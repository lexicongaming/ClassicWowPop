/* eslint-disable no-prototype-builtins */
const Character = require('../../models/Guilds');

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

  // check if realm param has multiple values
  if (Array.isArray(query.realm)) {
    query.realm = { $in: query.realm };
  }

  // remove from query if property value is all or both
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(query)) {
    if (['all', 'both'].includes(String(query[key]).toLowerCase())) {
      delete query[key];
    }
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
      $facet: {
        _total: [{ $group: { _id: null, count: { $sum: 1 } } }],
        _realms: [
          { $group: { _id: '$realm', _count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', count: '$_count' } },
          { $sort: { name: 1 } }
        ],
        _factions: [
          { $group: { _id: '$faction', _count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', count: '$_count' } },
          { $sort: { name: 1 } }
        ],
        _races: [
          { $group: { _id: '$race', _count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', count: '$_count' } },
          { $sort: { name: 1 } }
        ],
        _classes: [
          { $group: { _id: '$class', _count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', count: '$_count' } },
          { $sort: { name: 1 } }
        ],
        _levels: [
          { $group: { _id: '$level', _count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', count: '$_count' } },
          { $sort: { name: 1 } }
        ],
        _guilds: [
          { $group: { _id: '$guild', _count: { $sum: 1 } } },
          { $project: { _id: 0, name: '$_id', count: '$_count' } },
          { $sort: { count: -1 } }
        ]
      }
    },
    {
      $project: {
        total: { $arrayElemAt: ['$_total.count', 0] },
        realms: '$_realms',
        factions: '$_factions',
        races: '$_races',
        classes: '$_classes',
        levels: '$_levels',
        guilds: '$_guilds'
      }
    }
  ])
    .cache(0)
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      if (data && data.length > 0) {
        return cb(null, data[0]);
      }
      return undefined;
    });
};
