const enUS = require('./enUS');

module.exports = {
  Druido: enUS.Druid,
  Cacciatore: enUS.Hunter,
  Mago: enUS.Mage,
  Sacerdote: enUS.Priest,
  Ladro: enUS.Rogue,
  Stregone: enUS.Warlock,
  Guerriero: enUS.Warrior,
  Sciamano: enUS.Shaman,
  Paladino: enUS.Paladin,
  Deathknight: enUS["Death Knight"],

  Nano: enUS.Dwarf,
  Gnomo: enUS.Gnome,
  Umano: enUS.Human,
  'Elfo della Notte': enUS['Night Elf'],
  'Elfo del Gelo': enUS['Draenei'],
  'Elfo del Sangue': enUS['Blood Elf'],

  Orco: enUS.Orc,
  Tauren: enUS.Tauren,
  Troll: enUS.Troll,
  'Non Morto': enUS.Undead
};
