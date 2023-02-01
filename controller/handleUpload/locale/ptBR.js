const enUS = require('./enUS');

module.exports = {
  Druida: enUS.Druid,
  Caçador: enUS.Hunter,
  Mago: enUS.Mage,
  Sacerdote: enUS.Priest,
  Ladino: enUS.Rogue,
  Bruxo: enUS.Warlock,
  Guerreiro: enUS.Warrior,
  Xamã: enUS.Shaman,
  Paladino: enUS.Paladin,
  'Cavaleiro da Morte': enUS["Death Knight"],

  Anão: enUS.Dwarf,
  Gnomo: enUS.Gnome,
  Humano: enUS.Human,
  'Elfo Noturno': enUS['Night Elf'],
  'Elfo de Gelo': enUS.Draenei,
  'Elfo de Sangue': enUS['Blood Elf'],

  Orc: enUS.Orc,
  Tauren: enUS.Tauren,
  Troll: enUS.Troll,
  'Morto-vivo': enUS.Undead
};
