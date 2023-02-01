/* eslint-disable no-underscore-dangle */
const Time = require('../../models/Time');

module.exports = cb => {
  Time.aggregate([{ $group: { _id: '$realm', sum: { $sum: 1 } } }])
    .cache(0)
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database error', trace: error });
      if (data) {
        const realms = data
          .map(element => element._id)
          .sort((a, b) => a.substring(5).localeCompare(b.substring(5)));
        return cb(null, { realms });
      }
      return cb({ status: 500, message: 'No realms found' });
    });
};
