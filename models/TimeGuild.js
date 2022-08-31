const mongoose = require('mongoose');

const { Schema } = mongoose;

const timeSchemaGuild = new Schema({
    date: { type: Date, required: true, index: true },
    realm: { type: String, required: true, index: true },
    faction: { type: String, required: true, index: true },
    guild: { type: String, required: true, index: true },
    onlineByClass: {
      druid: { type: Number },
      hunter: { type: Number },
      mage: { type: Number },
      priest: { type: Number },
      rogue: { type: Number },
      warlock: { type: Number },
      warrior: { type: Number },
      shaman: { type: Number },
      paladin: { type: Number },
      deathknight: { type: Number }
    },
    onlineTotal: { type: Number, required: true }
  });
  
  timeSchemaGuild.index({ date: 1, realm: 1, faction: 1, guild: 1 });
  
  const TimeGuild = mongoose.model('TimeGuild', timeSchemaGuild);
  TimeGuild.init();
  
  module.exports = TimeGuild;