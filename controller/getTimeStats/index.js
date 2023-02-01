/* eslint-disable no-prototype-builtins */
const Time = require('../../models/Time');
const { makeFactionStats } = require('./process');
const { isValidDate } = require('./helper');

module.exports = (req, cb) => {
  const query = { ...req.query };

  // fix the query and replace minLevel/maxLevel with level
  if (query.hasOwnProperty('dateFrom')) {
    const dateFrom = new Date(`${query.dateFrom} UTC`);
    if (!isValidDate(dateFrom)) {
      return cb(null, []);
    }
    query.date = { $gte: dateFrom };
    delete query.dateFrom;
  }
  if (query.hasOwnProperty('dateTo')) {
    let { dateTo } = query;
    if (dateTo === '') {
      dateTo = new Date();
    } else {
      dateTo = new Date(`${query.dateTo} UTC`);
    }

    if (!isValidDate(dateTo)) {
      return cb(null, []);
    }

    /* when we get the date in format YYYY-mm-dd the date is now set
    /* to YYYY-mm-dd 00:00:00 what is the start of that day but the user 
    /* would most likely expect to get results for the whole day so we set it 23:59:59 */
    if (
      dateTo.getUTCSeconds() === 0 &&
      dateTo.getUTCMinutes() === 0 &&
      dateTo.getUTCHours() === 0
    ) {
      dateTo = new Date(
        Date.UTC(dateTo.getUTCFullYear(), dateTo.getUTCMonth(), dateTo.getUTCDate(), 23, 59, 59)
      );
    }

    if (query.hasOwnProperty('date')) {
      query.date.$lte = dateTo;
    } else {
      query.date = { $lte: dateTo };
    }
    delete query.dateTo;
  }

  // check if realm param has multiple values
  if (Array.isArray(query.realm)) {
    query.realm = { $in: query.realm };
  }

  Time.find(query)
    .lean()
    .cache(0)
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database Error', trace: error });
      if (data) {
        const ret = makeFactionStats(data);
        return cb(null, ret);
      }
      return cb({ status: 400, message: 'Bad request', trace: error });
    });
};
