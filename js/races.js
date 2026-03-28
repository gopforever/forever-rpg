/**
 * Registry of all playable races, keyed by race ID string.
 *
 * Each entry defines the full configuration for a race, including its
 * display name, icon, lore description, starting zone, valid classes,
 * and authentic EverQuest Project 1999 base stats.
 *
 * @type {Object.<string, {
 *   id: string,
 *   name: string,
 *   icon: string,
 *   description: string,
 *   startingZone: string,
 *   availableClasses: Array<string>,
 *   baseStats: {STR: number, DEX: number, AGI: number, STA: number, WIS: number, INT: number, CHA: number},
 *   bonusStats: object  // Reserved for future flavor/display use (racial stat highlights); not applied to character stats directly.
 * }>}
 * @note All races currently start in Qeynos per the game specification. The startingZone field
 *       is included for future expansion when races may begin in their authentic home cities.
 */
const RACES = {
  human: {
    id: 'human',
    name: 'Human',
    icon: '🧑',
    description: 'Humans are the most versatile and balanced of all races, capable of pursuing any calling in Norrath. Their adaptability and ambition have made them the dominant force in the civilized world.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'paladin', 'shadowknight', 'ranger', 'rogue', 'bard', 'monk', 'enchanter', 'magician', 'necromancer', 'wizard', 'cleric', 'druid', 'shaman'],
    baseStats: { STR: 75, DEX: 75, AGI: 75, STA: 75, WIS: 75, INT: 75, CHA: 75 },
    bonusStats: { CHA: 5 },
  },

  barbarian: {
    id: 'barbarian',
    name: 'Barbarian',
    icon: '🪓',
    description: 'Barbarians are fierce and powerful warriors from the frigid northlands of Everfrost. Their enormous frames and raw strength make them devastating in melee combat, though their path is narrow.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'rogue', 'shaman'],
    baseStats: { STR: 103, DEX: 70, AGI: 82, STA: 95, WIS: 70, INT: 60, CHA: 55 },
    bonusStats: { STR: 15, STA: 10 },
  },

  darkelf: {
    id: 'darkelf',
    name: 'Dark Elf',
    icon: '🧝',
    description: 'Dark Elves, or Teir\'Dal, are a cunning and malevolent people who dwell in the underground city of Neriak. Their mastery of dark magic and agile reflexes make them formidable spellcasters and rogues.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'shadowknight', 'rogue', 'enchanter', 'magician', 'necromancer', 'wizard', 'cleric'],
    baseStats: { STR: 60, DEX: 90, AGI: 90, STA: 70, WIS: 83, INT: 99, CHA: 60 },
    bonusStats: { INT: 15, DEX: 10 },
  },

  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    icon: '⛏️',
    description: 'Dwarves are a stout and resilient folk from the underground city of Kaladim. Their devotion to their gods and love of battle makes them exceptional clerics and warriors, beloved for their reliability in any group.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'paladin', 'rogue', 'cleric'],
    baseStats: { STR: 90, DEX: 90, AGI: 70, STA: 90, WIS: 83, INT: 60, CHA: 45 },
    bonusStats: { STR: 10, WIS: 10, STA: 10 },
  },

  erudite: {
    id: 'erudite',
    name: 'Erudite',
    icon: '🔮',
    description: 'Erudites are the most intellectually gifted race in Norrath, hailing from the scholarly city of Erudin. Their extraordinary intelligence and mana pools make them the finest spellcasters in the known world.',
    startingZone: 'qeynos',
    availableClasses: ['wizard', 'enchanter', 'magician', 'necromancer', 'cleric', 'paladin', 'shadowknight'],
    baseStats: { STR: 60, DEX: 70, AGI: 70, STA: 70, WIS: 83, INT: 107, CHA: 70 },
    bonusStats: { INT: 20 },
  },

  gnome: {
    id: 'gnome',
    name: 'Gnome',
    icon: '🔧',
    description: 'Gnomes are inventive and curious tinkerers from the underground city of Ak\'Anon. Their natural aptitude for mechanics and magic makes them surprisingly effective wizards and enchanters despite their small stature.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'rogue', 'enchanter', 'magician', 'necromancer', 'wizard', 'cleric'],
    baseStats: { STR: 60, DEX: 95, AGI: 80, STA: 67, WIS: 67, INT: 98, CHA: 60 },
    bonusStats: { DEX: 15, INT: 15 },
  },

  halfelf: {
    id: 'halfelf',
    name: 'Half Elf',
    icon: '🧝‍♀️',
    description: 'Half Elves are a graceful blend of human ambition and elven elegance, found across the cities of Norrath. Their balanced nature allows them to excel as bards, rangers, and paladins among other callings.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'paladin', 'ranger', 'rogue', 'bard', 'cleric', 'druid'],
    baseStats: { STR: 80, DEX: 90, AGI: 90, STA: 75, WIS: 60, INT: 75, CHA: 75 },
    bonusStats: { DEX: 10, AGI: 10 },
  },

  halfling: {
    id: 'halfling',
    name: 'Halfling',
    icon: '🍀',
    description: 'Halflings are small but remarkably nimble folk from the rolling hills of Rivervale. Their natural luck and dexterity make them exceptional rogues, while their connection to nature serves them well as druids.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'rogue', 'cleric', 'druid'],
    baseStats: { STR: 70, DEX: 95, AGI: 95, STA: 75, WIS: 80, INT: 67, CHA: 75 },
    bonusStats: { DEX: 15, AGI: 15 },
  },

  highelf: {
    id: 'highelf',
    name: 'High Elf',
    icon: '✨',
    description: 'High Elves, or Koada\'Dal, are an ancient and noble people from the shining city of Felwithe. Their unmatched wisdom and magical affinity make them the foremost practitioners of divine and arcane magic.',
    startingZone: 'qeynos',
    availableClasses: ['wizard', 'enchanter', 'magician', 'paladin', 'cleric'],
    baseStats: { STR: 55, DEX: 75, AGI: 80, STA: 65, WIS: 95, INT: 92, CHA: 80 },
    bonusStats: { WIS: 15, INT: 10, CHA: 10 },
  },

  iksar: {
    id: 'iksar',
    name: 'Iksar',
    icon: '🦎',
    description: 'Iksars are a proud reptilian people from the lost continent of Kunark. Their natural regeneration, agility, and affinity for shadow make them powerful monks and necromancers, though they are despised by most other races.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'shadowknight', 'monk', 'shaman', 'necromancer'],
    baseStats: { STR: 76, DEX: 85, AGI: 90, STA: 70, WIS: 80, INT: 75, CHA: 55 },
    bonusStats: { AGI: 10 },
  },

  ogre: {
    id: 'ogre',
    name: 'Ogre',
    icon: '👹',
    description: 'Ogres are massive, brutish creatures with tremendous physical power. Hailing from the city of Oggok, they are among the strongest beings in Norrath and are virtually immune to being stunned from the front.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'shadowknight', 'shaman'],
    baseStats: { STR: 130, DEX: 60, AGI: 70, STA: 127, WIS: 70, INT: 60, CHA: 40 },
    bonusStats: { STR: 30, STA: 30 },
  },

  troll: {
    id: 'troll',
    name: 'Troll',
    icon: '🧟',
    description: 'Trolls are fearsome creatures with incredible regenerative powers and raw physical might. Their rapid health recovery and massive strength make them formidable warriors and shadow knights despite their low intelligence.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'shadowknight', 'shaman'],
    baseStats: { STR: 108, DEX: 75, AGI: 83, STA: 119, WIS: 60, INT: 52, CHA: 40 },
    bonusStats: { STR: 20, STA: 25 },
  },

  woodelf: {
    id: 'woodelf',
    name: 'Wood Elf',
    icon: '🌿',
    description: 'Wood Elves, or Feir\'Dal, are nimble forest dwellers from the treetop city of Kelethin. Their natural agility and harmony with the wild make them skilled rangers, druids, and bards.',
    startingZone: 'qeynos',
    availableClasses: ['warrior', 'ranger', 'rogue', 'bard', 'druid'],
    baseStats: { STR: 65, DEX: 95, AGI: 95, STA: 65, WIS: 80, INT: 75, CHA: 75 },
    bonusStats: { DEX: 15, AGI: 15 },
  },
};

if (typeof module !== 'undefined') module.exports = { RACES };
