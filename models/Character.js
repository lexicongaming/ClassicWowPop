const mongoose = require('mongoose');

const { Schema } = mongoose;

const characterSchema = new Schema({
  name: { type: String, required: true, index: true },
  realm: { type: String, required: true, index: true },
  faction: { type: String, required: true, index: true },
  class: { type: String, required: true, index: true },
  race: { type: String, required: true, index: true },
  guild: { type: String, index: true },
  level: { type: Number, required: true, index: true },
  sex: { type: Number, index: true },
  lastSeen: { type: Date, required: true }
});

characterSchema.index({ name: 1, realm: 1 }, { unique: true });
characterSchema.index({ name: 1, realm: 1, level: 1, lastSeen: 1 });

const Character = mongoose.model('Character', characterSchema);
Character.init();

module.exports = Character;
