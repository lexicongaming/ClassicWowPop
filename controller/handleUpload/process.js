const Character = require('../../models/Character');
const Time = require('../../models/Time');
const TimeGuild = require('../../models/TimeGuild');
const Realm = require('../../models/Realm');
const Guild = require('../../models/Guilds');
const parse = require('./parse');

// process the lua database
const censusData = async (censusDb, cb) => {
  // write realms to realm collection
  Object.entries(censusDb.Servers).forEach(([realm, realmData]) => {
    const insertRealm = {
      realm,
      region: censusDb.Info.LoginServer
    };
    Realm.update(insertRealm, insertRealm, { upsert: true }).exec();
  });

  // parse the lua structures and get a nore flattenned array
  let parsedTimes;
  //let parsedTimesGuild;
  let parsedCharacters;
  let parsedGuilds;
  try {
    parsedTimes = parse.timesData(censusDb);
 //   parsedTimesGuild = parse.timesGuildData(censusDb);
    parsedCharacters = parse.charactersData(censusDb);
    parsedGuilds = parse.guildsData(censusDb);
  } catch (error) {
    cb({ status: 400, message: 'Parsing error - invaid times/character format', trace: error });
  }

  // update db
  // first create the bulk queries

  const charactersBulk = parsedCharacters.map(character => ({
    updateOne: {
      filter: {
        name: character.name,
        realm: character.realm,
        $or: [{ lastSeen: { $lt: character.lastSeen } }, { level: { $lt: character.level } }]
      },
      upsert: true,
      update: { ...character }
    }
  }));

  const guildsBulk = parsedGuilds.map(guild => ({
    updateOne: {
      filter: {
        name: guild.name,
        realm: guild.realm,
        faction: guild.faction,
        guild: guild.guild,
        level: guild.level,
        lastSeen: guild.lastSeen
      },
      upsert: true,
      update: { ...guild }
    }
  }));


  // make the promise and allow the E11000 duplicate key error with catch and return the result, that we then can acces in .then()
  // we get the E11000 error because of the unique compound index when the character level and lastSeen from the input is equal or lower then in the db
  const charactersBulkWritePromise = Character.bulkWrite(charactersBulk, { ordered: false }).catch(
    error => {
      if (error.code === 11000) {
        // we get that error because the document already exists and don't needs to be updated, so we can ignore this and proceed
        return error.result;
      }
      throw error;
    }
  );

  const guildsBulkWritePromise = Guild.bulkWrite(guildsBulk, { ordered: false }).catch(
    error => {
      if (error.code === 11000) {
        // we get that error because the document already exists and don't needs to be updated, so we can ignore this and proceed
        return error.result;
      }
      throw error;
    } 
  );

  // now we can await the promise and get the result
  const charactersBulkWriteResult = await charactersBulkWritePromise;
  const guildsBulkWriteResult = await guildsBulkWritePromise;

  // first we need to get the ids of the characters and guilds
  const characters = await Character.find(

    {
      name: { $in: parsedTimes.map(time => time.name) },
      realm: { $in: parsedTimes.map(time => time.realm) }
    },
    { _id: 1, name: 1, realm: 1 }
  ).exec();
    
  const guilds = await Guild.find(
    {
      name: { $in: parsedTimes.map(time => time.guild) },
      realm: { $in: parsedTimes.map(time => time.realm) },
      faction: { $in: parsedTimes.map(time => time.faction) },
      guild: { $in: parsedTimes.map(time => time.guild) },
    },
    { _id: 1, name: 1, realm: 1, faction: 1, guild: 1 }
  ).exec();

  // now we can map the times to the ids
  const times = parsedTimes.map(time => {
    const character = characters.find(
      character => character.name === time.name && character.realm === time.realm
    );
    const guild = guilds.find(
      guild =>
        guild.name === time.guild && guild.realm === time.realm && guild.faction === time.faction
    );
    return {
      ...time,
      character: character._id,
      guild: guild._id
    };
  });

  // now we can map the timesGuild to the ids
  const timesGuild = parsedTimes.map(time => {
    const guild = guilds.find(
      guild =>
        guild.name === time.guild && guild.realm === time.realm && guild.faction === time.faction
    );
    return {
      ...time,
      guild: guild._id
    };
  });


  const timesBulkWritePromise = Time.bulkWrite(timesBulk, { ordered: false }).catch(error => {
    if (error.code === 11000) {
      // we get that error because the document already exists and don't needs to be updated, so we can ignore this and proceed
      return error.result;
    }
    throw error;
  });
  const timesBulkWriteResult = await timesBulkWritePromise;

 const timesBulk = parsedTimes.map(time => ({
    updateOne: {
      filter: { date: time.date, realm: time.realm, faction: time.faction },
      upsert: true,
      update: { ...time }
    }
  }));

  const timesGuildBulk = parsedTimesGuild.map(timeGuild => ({
    updateOne: {
      
      filter: { date: timeGuild.date, realm: timeGuild.realm, faction: timeGuild.faction, guild: timeGuild.guild },
      upsert: true,
      update: { ...timeGuild }
    }
  }));

  const timesGuildBulkWritePromise = TimeGuild.bulkWrite(timesGuildBulk, { ordered: false }).catch(error => {
    if (error.code === 11000) {
      // we get that error because the document already exists and don't needs to be updated, so we can ignore this and proceed
      return error.result;
    }
    throw error;
  });

  const timesGuildBulkWriteResult = await timesGuildBulkWritePromise;

  // now we can return the result
  cb(null, {
    characters: charactersBulkWriteResult,
    guilds: guildsBulkWriteResult,
    times: timesBulkWriteResult,
    timesGuild: timesGuildBulkWriteResult
  });
};

  let timesGuildBulkWritePromise;
  if (timesGuildBulk.length > 0) {
    timesGuildBulkWritePromise = TimeGuild.bulkWrite(timesGuildBulk, { ordered: false });
  }
  let timesBulkWritePromise;
  if (timesBulk.length > 0) {
    timesBulkWritePromise = Time.bulkWrite(timesBulk, { ordered: false });
  }

  // wait for both bulk operations to finish and return stats
  Promise.all([charactersBulkWritePromise, timesBulkWritePromise, timesGuildBulkWritePromise])
    .then(([charactersResult, timesResult]) => {
      const stats = {
        charStats: {
          processed: parsedCharacters.length,
          inserted: charactersResult.nUpserted,
          updated: charactersResult.nModified
        },
        timeGuildStats: { 
          inserted: 0 
        },
        timeStats: {
          inserted: 0
        }
      };

      if (timesResult) {
        stats.timeStats.inserted = timesResult.nUpserted;
      }
      if (timesGuildBulkWritePromise) {
        stats.timeGuildStats.inserted = timesGuildBulkWritePromise.nUpserted;
      }

      console.log('chars:', stats.charStats, 'times-guild:', stats.timeGuildStats, 'times:', stats.timeStats);
      return cb(null, stats);
    })
    .catch(error => {
      cb({ status: 500, message: 'Processing error', trace: error });
    });
// end of processTimes

module.exports = {
  censusData
};