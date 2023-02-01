/* eslint-disable no-underscore-dangle */
const Time = require('../../models/Time');

module.exports = cb => {
  Time.aggregate([{ $group: { _id: '$guild', sum: { $sum: 1 } } }])
    .cache(0)
    .exec((error, data) => {
      if (error) return cb({ status: 500, message: 'Database error', trace: error });
      if (data) {
        const guilds = data
          .map(element => element._id)
          .sort((a, b) => a.substring(5).localeCompare(b.substring(5)));
        return cb(null, { guilds });
      }
      return cb({ status: 500, message: 'No guilds found' });
    }
  );
};
