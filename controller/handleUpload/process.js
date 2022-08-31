const Character = require('../../models/Character');
const Guild = require('../../models/Guilds');
const Time = require('../../models/Time').default;
const Realm = require('../../models/Realm');
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
  let parsedCharacters;
  try {
    parsedTimes = parse.timesData(censusDb);
    parsedCharacters = parse.charactersData(censusDb);
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

  const timesBulk = parsedTimes.map(time => ({
    updateOne: {
      filter: { date: time.date, realm: time.realm, faction: time.faction },
      upsert: true,
      update: { ...time }
    }
  }));

  let timesBulkWritePromise;
  if (timesBulk.length > 0) {
    timesBulkWritePromise = Time.bulkWrite(timesBulk, { ordered: false });
  }

  // wait for both bulk operations to finish and return stats
  Promise.all([charactersBulkWritePromise, timesBulkWritePromise])
    .then(([charactersResult, timesResult]) => {
      const stats = {
        charStats: {
          processed: parsedCharacters.length,
          inserted: charactersResult.nUpserted,
          updated: charactersResult.nModified
        },
        timeStats: {
          inserted: 0
        }
      };

      if (timesResult) {
        stats.timeStats.inserted = timesResult.nUpserted;
      }

      console.log('chars:', stats.charStats, 'times:', stats.timeStats);
      return cb(null, stats);
    })
    .catch(error => {
      cb({ status: 500, message: 'Processing error', trace: error });
    });
};

module.exports = {
  censusData
};
