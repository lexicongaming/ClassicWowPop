const enUS = require('./enUS');

module.exports = {
  Druida: enUS.Druid,
  Cazador: enUS.Hunter,
  Mago: enUS.Mage,
  Sacerdote: enUS.Priest,
  Pícaro: enUS.Rogue,
  Brujo: enUS.Warlock,
  Guerrero: enUS.Warrior,
  Chamán: enUS.Shaman,
  Paladín: enUS.Paladin,
  'Caballero de la Muerte': enUS['Death Knight'],

  Enano: enUS.Dwarf,
  Gnomo: enUS.Gnome,
  Humano: enUS.Human,
  'Elfo de la noche': enUS['Night Elf'],
  'Draenei': enUS.Draenei,
  'Elfo de sangre': enUS['Blood Elf'],

  Orco: enUS.Orc,
  Tauren: enUS.Tauren,
  Trol: enUS.Troll,
  'No-muerto': enUS.Undead
};
