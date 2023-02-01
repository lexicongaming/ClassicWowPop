/* eslint-disable no-prototype-builtins */
const Character = require('../../models/Character');

module.exports = (req, cb) => {
  const query = { ...req.query };

  // fix the query and replace minLevel/maxLevel with level
  if (query.hasOwnProperty('minLevel')) {
    query.level = { $gte: Number(query.minLevel) };
    delete query.minLevel;
  }
  if (query.hasOwnProperty('maxLevel')) {
    if (query.hasOwnProperty('level')) {
      query.level.$lte = Number(query.maxLevel);
    } else {
      query.level = { $lte: Number(query.maxLevel) };
    }
    delete query.maxLevel;
  }

  if (query.hasOwnProperty('lastSeen')) {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setDate(date.getDate() - Number(query.lastSeen));
    query.lastSeen = { $gte: date };
  }

  Character.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          realm: '$realm',
          faction: '$faction'
        },
        total: { $sum: 1 }
      }
    },
    { $sort: { '_id.faction': 1 } },
    {
      $group: {
        _id: '$_id.realm',
        factions: {
          $push: {
            faction: '$_id.faction',
            total: '$total'
          }
        }
      }
    }
  ])
    .cache(0)
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      const ret = data
        .map(obj => {
          const newObj = {};
          newObj.realm = obj._id.match(/_(.*)/)[1];
          if (obj.factions.length === 1) {
            if (obj.factions[0].faction === 'Alliance') {
              newObj.alliance = obj.factions[0].total;
              newObj.horde = 0;
            } else {
              newObj.alliance = 0;
              newObj.horde = obj.factions[0].total;
            }
          } else if (obj.factions.length > 1) {
            newObj.alliance = obj.factions[0].total;
            newObj.horde = obj.factions[1].total;
          }
          return newObj;
        })
        .sort((a, b) => a.realm.localeCompare(b.realm));
      return cb(null, ret);
    });
};
