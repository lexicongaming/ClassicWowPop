/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-properties */
// filter methods
const { StringHash } = require('./helper');
const locale = require('./locale');

const byDuplicateChars = (element, index, array) => {
  const foundIndex = array.findIndex(
    find => find.name === element.name && find.realm === element.realm
  );
  return foundIndex === index;
};

// sort methods
const byCharLastSeenAsc = (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen);
const byDateAsc = (a, b) => a.date - b.date;

// traverse through character lua table and make a flat array out of it
const charactersData = censusDb => {
  let flatCharArray = [];
  Object.entries(censusDb.Servers).forEach(([realm, realmData]) => {
    Object.entries(realmData).forEach(([faction, factionData]) => {
      Object.entries(factionData).forEach(([localizedRace, raceData]) => {
        Object.entries(raceData).forEach(([localizedClass, wclassData]) => {
          Object.entries(wclassData).forEach(([char, charData]) => {
            const [level, guild, lastSeen, hash, sex] = charData;

            if (hash) {
              const checkString =
                realm +
                faction +
                localizedRace +
                localizedClass +
                char +
                level +
                guild +
                lastSeen +
                sex;
              const checkHash = StringHash(checkString);
              if (Number(hash) !== checkHash) {
                console.log('manipulated?', char, hash, checkHash, checkString);
                return;
              }
            }

            const race = locale.get_enUS(localizedRace);
            const wclass = locale.get_enUS(localizedClass);

            if (!race || !wclass) {
              return;
            }

            const insertChar = {
              name: char,
              realm,
              faction,
              race,
              class: wclass,
              guild,
              level,
              sex,
              lastSeen: new Date(lastSeen)
            };
            flatCharArray.push(insertChar);
          });
        });
      });
    });
  });

  /* filter out duplicate characters that might be in original lua table
  /* because a player deleted its character and recreated it with a different race/class */
  flatCharArray = flatCharArray.sort(byCharLastSeenAsc).filter(byDuplicateChars);
  return flatCharArray;
};

// traverse through times lua table and make a flat array out of it
const timesData = censusDb => {
  let flatTimesArray = [];
  Object.entries(censusDb.TimesPlus).forEach(([realm, realmData]) => {
    Object.entries(realmData).forEach(([faction, factionData]) => {
      Object.entries(factionData).forEach(([time, timeValue]) => {
        const [times, hash] = timeValue.split(':');

        if (hash) {
          const checkString = times + realm + faction + time;
          const checkHash = StringHash(checkString);
          if (Number(hash) !== checkHash) {
            console.log('manipulated?', time, hash, checkHash, checkString);
            return;
          }
        }

        // eslint-disable-next-line prettier/prettier
        const [druid, hunter, mage, priest, rogue, warlock, warrior, shaman, paladin, deathknight] = times.split('&');
        // eslint-disable-next-line prettier/prettier
        const onlineByClass = { druid, hunter, mage, priest, rogue, warlock, warrior, shaman, paladin, deathknight };
        const onlineTotal = times.split('&').reduce((acc, current) => acc + Number(current), 0);
        const date = new Date(`${time.replace('&', ' ')} UTC`);
        flatTimesArray.push({ date, realm, faction, onlineByClass, onlineTotal });
      });
    });
  });

  flatTimesArray = flatTimesArray.sort(byDateAsc);
  return flatTimesArray;
};

module.exports = {
  charactersData,
  timesData
};
