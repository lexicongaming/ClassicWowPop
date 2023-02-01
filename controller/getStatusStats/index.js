/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
const moment = require('moment');
const Time = require('../../models/Time');

module.exports = (req, cb) => {
  const query = { ...req.query };

  if (query.hasOwnProperty('lastDays')) {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setDate(date.getDate() - Number(query.lastDays));
    query.date = { $gte: date };
    delete query.lastDays;
  }

  Time.aggregate([
    { $match: query },
    {
      $sort: {
        date: -1
      }
    },
    {
      $group: {
        _id: {
          realm: '$realm',
          faction: '$faction'
        },
        count: {
          $sum: 1
        },
        last: {
          $first: '$date'
        }
      }
    },
    {
      $sort: {
        last: 1
      }
    }
  ])
    .cache(0)
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      const ret = data.map(obj => {
        const newObj = {};
        newObj.realm = obj._id.realm.match(/_(.*)/)[1];
        newObj.faction = obj._id.faction;
        newObj.count = obj.count;
        newObj.last = moment(obj.last).format('YYYY-MM-DD HH:mm:ss');
        return newObj;
      });
      return cb(null, ret);
    });
};
