// party.js - Party management system for Forever RPG
// Depends on globals: CLASSES, ITEMS, STARTING_GEAR, computeDerivedStats, xpForLevel, xpToNextLevel, STAT_CAP

let _charIdCounter = 0;

/**
 * Array of all valid equipment slot names for a character.
 * @type {Array<string>}
 */
const EQUIPMENT_SLOTS = [
  'primary', 'secondary', 'range', 'ammo',
  'head', 'face', 'neck', 'shoulders',
  'chest', 'back', 'wrist_l', 'wrist_r',
  'hands', 'ring1', 'ring2', 'waist',
  'legs', 'feet', 'ear1', 'ear2'
];

/**
 * Creates a new party member object with stats, equipment, and skills initialized.
 * @param {string} name    - The character's display name.
 * @param {string} classId - The class identifier (e.g. 'warrior', 'cleric').
 * @param {number} level   - Starting level (defaults to 1).
 * @param {string} [raceId] - Optional race identifier (e.g. 'human'). Defaults to 'human'.
 * @returns {object} Fully initialized character object.
 */
function createCharacter(name, classId, level = 1, raceId = 'human') {
  const cls = CLASSES[classId];
  if (!cls) throw new Error(`Unknown classId: ${classId}`);

  const base = cls.baseStats || {};

  // Blend racial base stats with class base stats.
  // Using an average of class+race keeps final numbers in a reasonable range while
  // still giving racial flavour (e.g. Ogre warriors are much stronger than Human warriors).
  // Pure addition would produce excessively high stats at creation.
  const racialBase = (typeof RACES !== 'undefined' && RACES[raceId] && RACES[raceId].baseStats)
    ? RACES[raceId].baseStats
    : {};
  const STAT_KEYS = ['STR', 'DEX', 'AGI', 'STA', 'WIS', 'INT', 'CHA'];
  const blendedStats = {};
  for (const stat of STAT_KEYS) {
    const classStat = base[stat] || 10;
    const raceStat = racialBase[stat] || classStat;
    blendedStats[stat] = Math.round((classStat + raceStat) / 2);
  }

  const equipment = {};
  for (const slot of EQUIPMENT_SLOTS) equipment[slot] = null;

  const char = {
    id: 'char_' + Date.now() + '_' + (++_charIdCounter),
    name,
    classId,
    race: raceId || 'human',
    level,
    xp: xpForLevel(level),
    xpToNext: xpToNextLevel(level),
    STR: blendedStats.STR,
    DEX: blendedStats.DEX,
    AGI: blendedStats.AGI,
    STA: blendedStats.STA,
    WIS: blendedStats.WIS,
    INT: blendedStats.INT,
    CHA: blendedStats.CHA,
    hp: undefined,
    maxHP: 0,
    mana: undefined,
    maxMana: 0,
    currentAC: 0,
    statBonuses: { STR: 0, DEX: 0, AGI: 0, STA: 0, WIS: 0, INT: 0, CHA: 0, resists: { magic: 0, fire: 0, cold: 0, poison: 0, disease: 0 } },
    equipment,
    statusEffects: [],
    isAlive: true,
    role: cls.role || 'DPS',
    abilityCooldowns: {},
    castingAbility: null,
    isCasting: false,
    nextSwingAt: 0,
    spellBook: [],
    actionBar: Array(10).fill(null),
  };

  // Equip starting gear
  const startingGear = (typeof STARTING_GEAR !== 'undefined' && STARTING_GEAR[classId]) ? STARTING_GEAR[classId] : [];
  for (const itemId of startingGear) {
    if (ITEMS[itemId] && ITEMS[itemId].slot) {
      const slot = ITEMS[itemId].slot;
      if (char.equipment[slot] === null) {
        char.equipment[slot] = itemId;
      }
    }
  }

  computeDerivedStats(char);
  char.hp = char.maxHP;
  char.mana = char.maxMana;
  char.skills = (typeof initSkills === 'function') ? initSkills(classId, level) : {};

  return char;
}

/**
 * Creates up to 5 characters from an array of character definition objects.
 * @param {Array<object>} characterDefinitions - Array of { name, classId, raceId, level } objects.
 * @returns {Array<object>} Array of initialized character objects.
 */
function createParty(characterDefinitions) {
  const defs = characterDefinitions.slice(0, 5);
  return defs.map(def => createCharacter(def.name, def.classId, def.level || 1, def.raceId || 'human'));
}

/**
 * Equips an item into the specified slot on a character, returning the displaced item ID.
 * @param {object} char   - The character object to equip the item on.
 * @param {string} itemId - The ID of the item to equip.
 * @param {string} slot   - The equipment slot name.
 * @returns {string|null} The item ID of the previously equipped item, or null.
 */
function equipItem(char, itemId, slot) {
  if (!EQUIPMENT_SLOTS.includes(slot)) return null;
  const item = ITEMS[itemId];
  if (!item) return null;
  // Validate item can go in this slot
  if (item.slot && item.slot !== slot) return null;

  const oldItem = char.equipment[slot] || null;
  char.equipment[slot] = itemId;
  computeDerivedStats(char);
  return oldItem;
}

/**
 * Removes the item currently equipped in the specified slot on a character.
 * @param {object} char - The character object to unequip from.
 * @param {string} slot - The equipment slot name to clear.
 * @returns {string|null} The item ID that was removed, or null if the slot was empty.
 */
function unequipItem(char, slot) {
  if (!EQUIPMENT_SLOTS.includes(slot)) return null;
  const itemId = char.equipment[slot] || null;
  char.equipment[slot] = null;
  computeDerivedStats(char);
  return itemId;
}

/**
 * Distributes XP equally among living party members and handles any resulting level-ups.
 * @param {Array<object>} party    - The party array of character objects.
 * @param {number}        xpAmount - Total XP to distribute.
 * @returns {Array<object>} Array of level-up result objects for each character.
 */
function gainXP(party, xpAmount) {
  const living = party.filter(c => c.isAlive);
  if (living.length === 0) return [];
  const share = Math.floor(xpAmount / living.length);
  const results = [];

  for (const char of living) {
    const oldLevel = char.level;
    char.xp += share;

    let leveled = false;
    while (char.xp >= xpForLevel(char.level + 1) && char.level < MAX_LEVEL) {
      levelUp(char);
      leveled = true;
    }
    char.xpToNext = xpToNextLevel(char.level);

    results.push({ charId: char.id, charName: char.name, leveled, oldLevel, newLevel: char.level });
  }

  return results;
}

/**
 * Advances a character one level, updating base stats and re-computing derived stats.
 * @param {object} char - The character object to level up.
 * @returns {void}
 */
function levelUp(char) {
  const cls = CLASSES[char.classId];
  char.level += 1;

  const primaryStats = (cls && cls.primaryStats) ? cls.primaryStats : [];
  const allStats = ['STR', 'DEX', 'AGI', 'STA', 'WIS', 'INT', 'CHA'];

  for (const stat of allStats) {
    if (primaryStats.includes(stat)) {
      char[stat] += 2;
    } else {
      char[stat] += 1;
    }
    // EQ stat cap — raw stats cannot exceed STAT_CAP before gear bonuses
    if (char[stat] > STAT_CAP) char[stat] = STAT_CAP;
  }

  computeDerivedStats(char);
  char.hp = char.maxHP;
  char.mana = char.maxMana;
  if (typeof unlockSkillsForLevel === 'function') unlockSkillsForLevel(char);
}

/**
 * Returns the highest-priority tank in the party, falling back to the first living member.
 * @param {Array<object>} party - The party array of character objects.
 * @returns {object|null} The tank character object, or null if no living members.
 */
function getPartyTank(party) {
  const tank = party.find(c => c.isAlive && c.role && c.role.toLowerCase().includes('tank'));
  return tank || party.find(c => c.isAlive) || null;
}

/**
 * Returns the living party member with the lowest current HP percentage.
 * @param {Array<object>} party - The party array of character objects.
 * @returns {object|null} The character with the lowest HP percentage, or null.
 */
function getLowestHPMember(party) {
  const living = party.filter(c => c.isAlive && c.maxHP > 0);
  if (living.length === 0) return null;
  return living.reduce((lowest, c) => {
    const pct = c.hp / c.maxHP;
    const lowestPct = lowest.hp / lowest.maxHP;
    return pct < lowestPct ? c : lowest;
  });
}

/**
 * Returns the first living healer-role member found in the party.
 * @param {Array<object>} party - The party array of character objects.
 * @returns {object|null} The healer character object, or null if none found.
 */
function getHealerInParty(party) {
  return party.find(c => c.isAlive && c.role && c.role.toLowerCase().includes('healer')) || null;
}

/**
 * Applies a status effect to a character, refreshing it if one of the same type already exists.
 * @param {object} char   - The character to apply the effect to.
 * @param {object} effect - The status effect object (must include a `type` property).
 * @returns {void}
 */
function applyStatusEffect(char, effect) {
  // Remove existing effect of same type first (no stacking, refresh duration)
  char.statusEffects = (char.statusEffects || []).filter(e => e.type !== effect.type);
  char.statusEffects.push(effect);
}

/**
 * Removes expired status effects and ticks DoT damage for any active damage-over-time effects.
 * @param {object} char - The character whose status effects are being ticked.
 * @returns {number} Total damage dealt by DoT effects this tick.
 */
function tickStatusEffects(char) {
  if (!char.statusEffects || char.statusEffects.length === 0) return 0;
  const now = Date.now();
  // Remove expired effects
  char.statusEffects = char.statusEffects.filter(e => e.endTime > now);
  let totalDamage = 0;
  for (const effect of char.statusEffects) {
    const dmg = effect.damage || effect.tickDamage || 0;
    if (dmg > 0) {
      if (!effect.nextTick || now >= effect.nextTick) {
        totalDamage += dmg;
        effect.nextTick = now + (effect.tickInterval || 3000);
      }
    }
  }
  return totalDamage;
}

/**
 * Returns true if the character is currently stunned.
 * @param {object} char - The character to check.
 * @returns {boolean}
 */
function isStunned(char) { return char.statusEffects.some(e => e.type === 'stun' && Date.now() < e.endTime); }
/**
 * Returns true if the character is currently mezzed (mesmerized).
 * @param {object} char - The character to check.
 * @returns {boolean}
 */
function isMezzed(char) { return char.statusEffects.some(e => e.type === 'mez' && Date.now() < e.endTime); }
/**
 * Returns true if the character is currently slowed.
 * @param {object} char - The character to check.
 * @returns {boolean}
 */
function isSlowed(char) { return char.statusEffects.some(e => e.type === 'slow' && Date.now() < e.endTime); }
/**
 * Returns true if the character is currently poisoned.
 * @param {object} char - The character to check.
 * @returns {boolean}
 */
function isPoisoned(char) { return char.statusEffects.some(e => e.type === 'poison' && Date.now() < e.endTime); }

if (typeof module !== 'undefined') module.exports = { createCharacter, createParty, equipItem, unequipItem, gainXP, levelUp, getPartyTank, getLowestHPMember, getHealerInParty, applyStatusEffect, tickStatusEffects, isStunned, isMezzed, isSlowed, isPoisoned };
