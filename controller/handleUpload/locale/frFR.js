const enUS = require('./enUS');

module.exports = {
  Druide: enUS.Druid,
  Chasseur: enUS.Hunter,
  Mage: enUS.Mage,
  Prêtre: enUS.Priest,
  Voleur: enUS.Rogue,
  Démoniste: enUS.Warlock,
  Guerrier: enUS.Warrior,
  Chaman: enUS.Shaman,
  Paladin: enUS.Paladin,
  'Chevalier de la mort': enUS["Death Knight"],

  Nain: enUS.Dwarf,
  Gnome: enUS.Gnome,
  Humain: enUS.Human,
  'Elfe de la nuit': enUS['Night Elf'],
  'Draeneï': enUS.Draenei,
  'Elfe de sang': enUS['Blood Elf'],

  Orc: enUS.Orc,
  Tauren: enUS.Tauren,
  Troll: enUS.Troll,
  'Mort-vivant': enUS.Undead
};
