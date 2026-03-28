// skills.js - P99/EverQuest-authentic per-character skill system for Forever RPG

/** New characters start with 1 to this value points in each unlocked skill. */
const INITIAL_SKILL_RANGE = 10;    // new chars start with 1–10 points in each unlocked skill

/** Skill-ups are announced to the combat log at multiples of this value. */
const SKILL_MILESTONE_INTERVAL = 25; // announce skill-ups at multiples of this value

/**
 * Per-class map of skill names to their absolute maximum value (hard cap).
 * Used to clamp skill gains regardless of level.
 * @type {object}
 */
const SKILL_HARD_CAPS = {
  warrior: {
    offense: 252, defense: 252, oneHandSlash: 252, oneHandBlunt: 252,
    twoHandSlash: 252, twoHandBlunt: 252, piercing: 252,
    dodge: 252, parry: 252, riposte: 252, doubleAttack: 252,
    dualWield: 252, bash: 252, kick: 252, taunt: 252,
    disarm: 252, intimidation: 252, bindWound: 200, swimming: 200,
  },
  paladin: {
    offense: 252, defense: 252, oneHandSlash: 200, oneHandBlunt: 200,
    twoHandBlunt: 200, bash: 200, dodge: 200, parry: 200, kick: 200,
    taunt: 200, bindWound: 200, channeling: 200,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
    layOnHands: 1,
    senseUndead: 200,
  },
  shadowknight: {
    offense: 252, defense: 252, oneHandSlash: 200, oneHandBlunt: 200,
    twoHandBlunt: 200, bash: 200, dodge: 200, parry: 200, kick: 200,
    taunt: 200, bindWound: 200, channeling: 200,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
    harmTouch: 1, senseDead: 200, intimidation: 200,
  },
  ranger: {
    offense: 252, defense: 252, oneHandSlash: 200, oneHandBlunt: 200,
    piercing: 200, twoHandSlash: 200, archery: 252,
    dodge: 200, parry: 200, dualWield: 252, doubleAttack: 252,
    kick: 200, taunt: 200, bindWound: 200, tracking: 200, forage: 200,
    channeling: 200,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  bard: {
    offense: 200, defense: 200, oneHandSlash: 200, oneHandBlunt: 200,
    piercing: 200, dodge: 200, parry: 100,
    singing: 200, brass: 200, percussion: 200, stringed: 200, wind: 200,
    taunt: 200, bindWound: 200, forage: 200,
  },
  monk: {
    offense: 252, defense: 252, oneHandBlunt: 252, twoHandBlunt: 252,
    kick: 252, roundKick: 252, tigerClaw: 252, flyingKick: 252,
    dodge: 252, riposte: 252, doubleAttack: 252, mend: 252,
    feignDeath: 200, safeFall: 200, bindWound: 200, meditation: 252,
  },
  rogue: {
    offense: 252, defense: 252, oneHandSlash: 200, piercing: 252,
    dodge: 200, parry: 252, riposte: 252, doubleAttack: 252, dualWield: 252,
    backstab: 252, sneak: 200, hide: 200, pickLock: 200, pickPockets: 200,
    applyPoison: 200, disarmTrap: 200, bindWound: 200,
  },
  berserker: {
    offense: 252, defense: 252, oneHandSlash: 252, twoHandSlash: 252,
    oneHandBlunt: 252, twoHandBlunt: 252,
    dodge: 200, doubleAttack: 252, dualWield: 252,
    frenzy: 252, kick: 200, intimidation: 200, bindWound: 200,
  },
  beastlord: {
    offense: 252, defense: 252, oneHandBlunt: 252, oneHandSlash: 200,
    piercing: 200, kick: 252, dodge: 200, dualWield: 200,
    mend: 200, channeling: 200, bindWound: 200,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
    meditation: 252,
  },
  cleric: {
    defense: 200, oneHandBlunt: 200, twoHandBlunt: 200,
    bash: 200, dodge: 75, bindWound: 200, channeling: 200, meditation: 252,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  druid: {
    defense: 200, oneHandBlunt: 200, twoHandBlunt: 200,
    dodge: 75, bindWound: 200, channeling: 200, meditation: 252, forage: 200,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  shaman: {
    defense: 200, oneHandBlunt: 200, twoHandBlunt: 200,
    dodge: 75, bindWound: 200, channeling: 200, meditation: 252,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  wizard: {
    defense: 145, oneHandBlunt: 100, dodge: 75,
    bindWound: 200, channeling: 200, meditation: 252,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  magician: {
    defense: 145, oneHandBlunt: 100, dodge: 75,
    bindWound: 200, channeling: 200, meditation: 252,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  enchanter: {
    defense: 145, oneHandBlunt: 100, dodge: 75,
    bindWound: 200, channeling: 200, meditation: 252,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
  necromancer: {
    defense: 145, oneHandBlunt: 100, dodge: 75,
    bindWound: 200, channeling: 200, meditation: 252,
    abjuration: 252, alteration: 252, conjuration: 252, divination: 252, evocation: 252,
  },
};

/**
 * Maps each class ID to its archetype tier: melee, hybrid, priest, or caster.
 * Used to determine skill gain rate.
 * @type {object}
 */
const CLASS_TIER = {
  warrior: 'melee', monk: 'melee', rogue: 'melee', berserker: 'melee',
  paladin: 'hybrid', shadowknight: 'hybrid', ranger: 'hybrid', bard: 'hybrid', beastlord: 'hybrid',
  cleric: 'priest', druid: 'priest', shaman: 'priest',
  wizard: 'caster', magician: 'caster', enchanter: 'caster', necromancer: 'caster',
};

/**
 * Maps class tier to the per-level skill cap multiplier used in getSkillCap().
 * @type {object}
 */
const TIER_MULTIPLIER = { melee: 5, hybrid: 5, priest: 4, caster: 3 };

/**
 * Per-class map of skill names to the level at which that skill becomes available.
 * @type {object}
 */
const SKILL_UNLOCK_LEVELS = {
  warrior: {
    offense: 1, defense: 1, oneHandSlash: 1, oneHandBlunt: 1,
    twoHandSlash: 1, twoHandBlunt: 1, piercing: 1,
    kick: 1, taunt: 1, bash: 6, dodge: 6,
    parry: 10, doubleAttack: 13, dualWield: 13,
    riposte: 15, disarm: 20, intimidation: 27, bindWound: 1, swimming: 1,
  },
  paladin: {
    offense: 1, defense: 1, oneHandSlash: 1, oneHandBlunt: 1, twoHandBlunt: 1,
    kick: 1, taunt: 1, bash: 6, dodge: 6, parry: 10,
    channeling: 1, abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
    layOnHands: 1, senseUndead: 9, bindWound: 1,
  },
  shadowknight: {
    offense: 1, defense: 1, oneHandSlash: 1, oneHandBlunt: 1, twoHandBlunt: 1,
    kick: 1, taunt: 1, bash: 6, dodge: 6, parry: 10,
    channeling: 1, abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
    harmTouch: 1, senseDead: 9, intimidation: 20, bindWound: 1,
  },
  ranger: {
    offense: 1, defense: 1, oneHandSlash: 1, oneHandBlunt: 1,
    piercing: 1, twoHandSlash: 1, archery: 1,
    dodge: 1, parry: 1, taunt: 1, kick: 1,
    dualWield: 20, doubleAttack: 20,
    tracking: 1, forage: 5, bindWound: 1, channeling: 1,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  bard: {
    offense: 1, defense: 1, oneHandSlash: 1, oneHandBlunt: 1, piercing: 1,
    dodge: 1, taunt: 1,
    singing: 1, brass: 1, percussion: 1, stringed: 1, wind: 1,
    forage: 5, bindWound: 1,
  },
  monk: {
    offense: 1, defense: 1, oneHandBlunt: 1, twoHandBlunt: 1,
    kick: 1, safeFall: 1, bindWound: 1, meditation: 1,
    roundKick: 5, mend: 10, tigerClaw: 10, doubleAttack: 1, riposte: 15,
    feignDeath: 17, flyingKick: 30,
  },
  rogue: {
    offense: 1, defense: 1, oneHandSlash: 1, piercing: 1,
    dodge: 1, parry: 1, riposte: 1, doubleAttack: 1, dualWield: 1,
    sneak: 1, hide: 1, bindWound: 1,
    backstab: 10, pickLock: 14, pickPockets: 16,
    applyPoison: 20, disarmTrap: 21,
  },
  berserker: {
    offense: 1, defense: 1, oneHandSlash: 1, twoHandSlash: 1,
    oneHandBlunt: 1, twoHandBlunt: 1,
    dodge: 1, doubleAttack: 1, dualWield: 1,
    frenzy: 1, kick: 1, intimidation: 27, bindWound: 1,
  },
  beastlord: {
    offense: 1, defense: 1, oneHandBlunt: 1, oneHandSlash: 1,
    piercing: 1, kick: 1, dodge: 1, dualWield: 1,
    mend: 10, channeling: 1, bindWound: 1, meditation: 1,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  cleric: {
    defense: 1, oneHandBlunt: 1, twoHandBlunt: 1, bash: 1,
    dodge: 6, bindWound: 1, channeling: 1, meditation: 8,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  druid: {
    defense: 1, oneHandBlunt: 1, twoHandBlunt: 1,
    dodge: 6, bindWound: 1, channeling: 1, meditation: 8, forage: 5,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  shaman: {
    defense: 1, oneHandBlunt: 1, twoHandBlunt: 1,
    dodge: 6, bindWound: 1, channeling: 1, meditation: 8,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  wizard: {
    defense: 1, oneHandBlunt: 1, dodge: 6,
    bindWound: 1, channeling: 1, meditation: 4,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  magician: {
    defense: 1, oneHandBlunt: 1, dodge: 6,
    bindWound: 1, channeling: 1, meditation: 4,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  enchanter: {
    defense: 1, oneHandBlunt: 1, dodge: 6,
    bindWound: 1, channeling: 1, meditation: 4,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
  necromancer: {
    defense: 1, oneHandBlunt: 1, dodge: 6,
    bindWound: 1, channeling: 1, meditation: 4,
    abjuration: 1, alteration: 1, conjuration: 1, divination: 1, evocation: 1,
  },
};

/**
 * Maps each skill name to the primary stat that governs its skill-up roll probability.
 * @type {object}
 */
const SKILL_STAT = {
  offense: 'STR', defense: 'AGI',
  oneHandSlash: 'STR', oneHandBlunt: 'STR', twoHandSlash: 'STR',
  twoHandBlunt: 'STR', piercing: 'DEX',
  dodge: 'AGI', parry: 'AGI', riposte: 'DEX',
  doubleAttack: 'DEX', dualWield: 'DEX',
  bash: 'STR', kick: 'STR', taunt: 'CHA',
  backstab: 'DEX', roundKick: 'DEX', tigerClaw: 'DEX', flyingKick: 'DEX',
  mend: 'WIS', feignDeath: 'DEX', safeFall: 'AGI',
  frenzy: 'STR', sneak: 'AGI', hide: 'AGI',
  tracking: 'WIS', forage: 'WIS', archery: 'DEX',
  singing: 'CHA', brass: 'DEX', percussion: 'DEX', stringed: 'DEX', wind: 'DEX',
  channeling: 'WIS', meditation: 'WIS',
  abjuration: 'WIS', alteration: 'WIS', conjuration: 'INT',
  divination: 'WIS', evocation: 'INT',
  bindWound: 'WIS', swimming: 'STA',
  pickLock: 'DEX', pickPockets: 'DEX', applyPoison: 'DEX',
  disarmTrap: 'DEX', intimidation: 'CHA',
  senseUndead: 'WIS', senseDead: 'INT',
};

/**
 * Maps skill keys (camelCase) to human-readable display names shown in the UI.
 * @type {object}
 */
const SKILL_DISPLAY_NAMES = {
  offense: 'Offense', defense: 'Defense',
  oneHandSlash: '1H Slash', oneHandBlunt: '1H Blunt',
  twoHandSlash: '2H Slash', twoHandBlunt: '2H Blunt',
  piercing: 'Piercing', dodge: 'Dodge', parry: 'Parry',
  riposte: 'Riposte', doubleAttack: 'Double Attack',
  dualWield: 'Dual Wield', bash: 'Bash', kick: 'Kick',
  taunt: 'Taunt', disarm: 'Disarm', intimidation: 'Intimidation',
  backstab: 'Backstab', roundKick: 'Round Kick',
  tigerClaw: 'Tiger Claw', flyingKick: 'Flying Kick',
  mend: 'Mend', feignDeath: 'Feign Death', safeFall: 'Safe Fall',
  frenzy: 'Frenzy', sneak: 'Sneak', hide: 'Hide',
  pickLock: 'Pick Lock', pickPockets: 'Pick Pockets',
  applyPoison: 'Apply Poison', disarmTrap: 'Disarm Trap',
  tracking: 'Tracking', forage: 'Forage', archery: 'Archery',
  singing: 'Singing', brass: 'Brass', percussion: 'Percussion',
  stringed: 'Stringed', wind: 'Wind',
  channeling: 'Channeling', meditation: 'Meditation',
  abjuration: 'Abjuration', alteration: 'Alteration',
  conjuration: 'Conjuration', divination: 'Divination', evocation: 'Evocation',
  bindWound: 'Bind Wound', swimming: 'Swimming',
  layOnHands: 'Lay on Hands', harmTouch: 'Harm Touch',
  senseUndead: 'Sense Undead', senseDead: 'Sense Dead',
};

/**
 * Returns the current skill cap for a character given their class and level.
 * Hard cap is the class's maximum (e.g. 252). Per-level cap = multiplier * (level + 1).
 */
function getSkillCap(classId, skillName, level) {
  const caps = SKILL_HARD_CAPS[classId];
  if (!caps || caps[skillName] === undefined) return 0;
  const hardCap = caps[skillName];
  const tier = CLASS_TIER[classId] || 'caster';
  const mult = TIER_MULTIPLIER[tier];
  const levelCap = mult * (level + 1);
  return Math.min(hardCap, levelCap);
}

/**
 * Initialize a character's skills object based on class and level.
 * Skills unlocked at or below current level start at a small baseline.
 */
function initSkills(classId, level) {
  const unlocks = SKILL_UNLOCK_LEVELS[classId] || {};
  const skills = {};
  for (const [skillName, unlockLevel] of Object.entries(unlocks)) {
    if (level >= unlockLevel) {
      const cap = getSkillCap(classId, skillName, level);
      skills[skillName] = Math.min(cap, Math.floor(Math.random() * INITIAL_SKILL_RANGE) + 1);
    }
  }
  return skills;
}

/**
 * Called after every successful use of a skill.
 * Rolls for a skill-up using the P99 formula: chance = (200 - current) / stat.
 * Logs a milestone message every 25 points.
 * Returns true if a skill-up occurred.
 */
function trySkillGain(member, skillName) {
  if (!member.skills) member.skills = {};
  const current = member.skills[skillName] || 0;
  const cap = getSkillCap(member.classId, skillName, member.level);
  if (cap === 0 || current >= cap) return false;

  let statName = SKILL_STAT[skillName] || 'INT';
  // P99: for general skills governed by WIS or INT, use whichever is higher
  if (statName === 'WIS' || statName === 'INT') {
    const charWIS = (member['WIS'] || 1) + (member.statBonuses ? (member.statBonuses['WIS'] || 0) : 0);
    const charINT = (member['INT'] || 1) + (member.statBonuses ? (member.statBonuses['INT'] || 0) : 0);
    statName = charWIS >= charINT ? 'WIS' : 'INT';
  }
  const statVal = (member[statName] || 1) + (member.statBonuses ? (member.statBonuses[statName] || 0) : 0);
  const chance = Math.min(1.0, (200 - current) / Math.max(1, statVal));

  if (Math.random() < chance) {
    const newVal = current + 1;
    member.skills[skillName] = newVal;
    if (newVal % SKILL_MILESTONE_INTERVAL === 0 && typeof addCombatLog === 'function') {
      const displayName = SKILL_DISPLAY_NAMES[skillName] || skillName;
      addCombatLog(`${member.name}'s ${displayName} has increased to ${newVal}!`, 'levelup');
    }
    // Achievement hook: skill_up
    if (typeof checkAchievements === 'function') {
      checkAchievements('skill_up', { skillName, value: newVal });
    }
    return true;
  }
  return false;
}

/**
 * Check whether a skill has been unlocked for a character at their current level.
 */
function hasSkill(member, skillName) {
  const unlocks = SKILL_UNLOCK_LEVELS[member.classId] || {};
  const unlockLevel = unlocks[skillName];
  if (unlockLevel === undefined) return false;
  return member.level >= unlockLevel;
}

/**
 * Called on level-up to unlock any new skills earned at that level.
 * New skills start at 1.
 */
function unlockSkillsForLevel(member) {
  const unlocks = SKILL_UNLOCK_LEVELS[member.classId] || {};
  if (!member.skills) member.skills = {};
  for (const [skillName, unlockLevel] of Object.entries(unlocks)) {
    if (member.level >= unlockLevel && member.skills[skillName] === undefined) {
      member.skills[skillName] = 1;
    }
  }
}

if (typeof module !== 'undefined') module.exports = {
  SKILL_HARD_CAPS, CLASS_TIER, TIER_MULTIPLIER, SKILL_UNLOCK_LEVELS,
  SKILL_STAT, SKILL_DISPLAY_NAMES, INITIAL_SKILL_RANGE, SKILL_MILESTONE_INTERVAL,
  getSkillCap, initSkills, trySkillGain, hasSkill, unlockSkillsForLevel,
};
