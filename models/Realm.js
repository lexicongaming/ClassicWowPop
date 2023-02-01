const mongoose = require('mongoose');

const { Schema } = mongoose;

const realmSchema = new Schema({
  realm: { type: String },
  region: { type: String }
});

const Realm = mongoose.model('Realm', realmSchema);
Realm.init();

module.exports = Realm;
