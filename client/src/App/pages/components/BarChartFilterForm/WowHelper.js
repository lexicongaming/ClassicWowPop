const HORDE = { label: 'Horde', value: 'horde' };
const ALLIANCE = { label: 'Alliance', value: 'alliance' };

const HUMAN = { label: 'Human', value: 'human' };
const DWARF = { label: 'Dwarf', value: 'dwarf' };
const GNOME = { label: 'Gnome', value: 'gnome' };
const NIGHTELF = { label: 'Night Elf', value: 'night_elf' };
const UNDEAD = { label: 'Undead', value: 'undead' };
const ORC = { label: 'Orc', value: 'orc' };
const TAUREN = { label: 'Tauren', value: 'tauren' };
const TROLL = { label: 'Troll', value: 'troll' };
const BLOODELF = { label: 'Blood Elf', value: 'blood_elf' };
const DRAENEI = { label: 'Draenei', value: 'draenei' };

const WARRIOR = { label: 'Warrior', value: 'warrior' };
const PALADIN = { label: 'Paladin', value: 'paladin' };
const ROGUE = { label: 'Rogue', value: 'rogue' };
const HUNTER = { label: 'Hunter', value: 'hunter' };
const MAGE = { label: 'Mage', value: 'mage' };
const PRIEST = { label: 'Priest', value: 'priest' };
const SHAMAN = { label: 'Shaman', value: 'shaman' };
const DRUID = { label: 'Druid', value: 'druid' };
const WARLOCK = { label: 'Warlock', value: 'warlock' };

export const getFactions = () => {
  return [ALLIANCE, HORDE];
};

export const getRacesByFaction = faction => {
  if (faction === '') return [HUMAN, DWARF, GNOME, NIGHTELF, DRAENEI, UNDEAD, ORC, TAUREN, TROLL, BLOODELF];
  switch (faction.value) {
    case ALLIANCE.value:
      return [HUMAN, DWARF, GNOME, NIGHTELF, DRAENEI];
    case HORDE.value:
      return [UNDEAD, ORC, TAUREN, TROLL, BLOODELF];
    default:
      return undefined;
  }
};

export const getRaces = () => getRacesByFaction('');

export const getClassesByRace = race => {
  if (race === '') return [WARRIOR, PALADIN, SHAMAN, ROGUE, HUNTER, MAGE, PRIEST, DRUID, WARLOCK];
  switch (race.value) {
    case HUMAN.value:
      return [WARRIOR, PALADIN, ROGUE, PRIEST, MAGE, WARLOCK];
    case DWARF.value:
      return [WARRIOR, PALADIN, HUNTER, ROGUE, PRIEST];
    case GNOME.value:
      return [WARRIOR, ROGUE, MAGE, WARLOCK];
    case NIGHTELF.value:
      return [WARRIOR, HUNTER, ROGUE, PRIEST, DRUID];
    case DRAENEI.value:
      return [WARRIOR, HUNTER, PRIEST, PALADIN, SHAMAN, MAGE];
    case UNDEAD.value:
      return [WARRIOR, ROGUE, PRIEST, MAGE, WARLOCK];
    case ORC.value:
      return [WARRIOR, HUNTER, ROGUE, SHAMAN, WARLOCK];
    case TAUREN.value:
      return [WARRIOR, HUNTER, SHAMAN, DRUID];
    case TROLL.value:
      return [WARRIOR, HUNTER, ROGUE, PRIEST, SHAMAN, MAGE];
    case BLOODELF.value:
      return [HUNTER, MAGE, PALADIN, PRIEST, ROGUE, WARLOCK];
    default:
      return undefined;
  }
};

export const getClassesByFaction = faction => {
  if (faction === '')
    return [WARRIOR, PALADIN, SHAMAN, ROGUE, HUNTER, MAGE, PRIEST, DRUID, WARLOCK];
  return faction.value === ALLIANCE.value
    ? [WARRIOR, PALADIN, ROGUE, HUNTER, MAGE, PRIEST, DRUID, WARLOCK, SHAMAN]
    : [WARRIOR, SHAMAN, ROGUE, HUNTER, MAGE, PRIEST, DRUID, WARLOCK, PALADIN];
};

export const getClasses = () => getClassesByRace('');
