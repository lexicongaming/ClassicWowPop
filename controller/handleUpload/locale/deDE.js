const enUS = require('./enUS');

module.exports = {
  Druide: enUS.Druid,
  Jäger: enUS.Hunter,
  Magier: enUS.Mage,
  Priester: enUS.Priest,
  Schurke: enUS.Rogue,
  Hexenmeister: enUS.Warlock,
  Krieger: enUS.Warrior,
  Schamane: enUS.Shaman,
  Paladin: enUS.Paladin,
  Todesritter: enUS['Death Knight'],

  Zwerg: enUS.Dwarf,
  Gnom: enUS.Gnome,
  Mensch: enUS.Human,
  Nachtelf: enUS['Night Elf'],
  Dranei: enUS.Draenei,
  Blutelf: enUS['Blood Elf'],

  Orc: enUS.Orc,
  Tauren: enUS.Tauren,
  Troll: enUS.Troll,
  Untoter: enUS.Undead
};
