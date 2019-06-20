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

  // remove from query if property value is all or both
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(query)) {
    if (['all', 'both'].includes(String(query[key]).toLowerCase())) {
      delete query[key];
    }
  }

  Character.aggregate(
    [
      { $match: query },
      {
        $facet: {
          _total: [{ $group: { _id: null, count: { $sum: 1 } } }],
          _factions: [
            { $group: { _id: '$faction', _count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$_count' } }
          ]
        }
      },
      {
        $project: {
          total: { $arrayElemAt: ['$_total.count', 0] },
          factions: '$_factions'
        }
      }
    ],
    (error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      if (data && data.length > 0) {
        return cb(null, data[0]);
      }
      return undefined;
    }
  );
};
