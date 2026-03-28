// stats.js - P99/EverQuest-inspired stat system for Forever RPG
// CLASSES and ITEMS are globals loaded via script tags in the browser

/** EverQuest base stat cap before AA/augment effects — raw stats cannot exceed this. */
// EverQuest base stat cap (before AA/item augment effects)
const STAT_CAP = 255;

/**
 * Computes max HP from STA and class multiplier.
 * @param {object} char - The character object with classId, level, STA, and optional statBonuses.
 * @returns {number} The character's maximum hit points.
 */
function getMaxHP(char) {
  const cls = CLASSES[char.classId];
  const hpPerSTA_l60 = cls ? cls.hpPerSTA_l60 : 3.0;
  const hpPerSTA_l50 = cls ? cls.hpPerSTA_l50 : 2.5;
  const hpPerSTA_l1  = hpPerSTA_l50 * 0.6;
  const level = Math.max(1, Math.min(60, char.level || 1));
  let hpPerSTAAtLevel;
  if (level >= 50) {
    hpPerSTAAtLevel = hpPerSTA_l50 + (hpPerSTA_l60 - hpPerSTA_l50) * ((level - 50) / 10);
  } else {
    hpPerSTAAtLevel = hpPerSTA_l1 + (hpPerSTA_l50 - hpPerSTA_l1) * ((level - 1) / 49);
  }
  const sta = char.STA + (char.statBonuses ? char.statBonuses.STA || 0 : 0);
  const baseHP = 20 + level * 3;
  return Math.floor(baseHP + (sta * hpPerSTAAtLevel));
}

/**
 * Computes max mana from WIS/INT and class.
 * @param {object} char - The character object with classId, level, and the relevant mana stat.
 * @returns {number} The character's maximum mana, or 0 if the class has no mana stat.
 */
function getMaxMana(char) {
  const cls = CLASSES[char.classId];
  if (!cls || !cls.manaStat) return 0;
  const manaStat = cls.manaStat;
  const statVal = char[manaStat] + (char.statBonuses ? char.statBonuses[manaStat] || 0 : 0);
  const level = char.level || 1;
  let mana;
  if (statVal <= 200) {
    mana = (80 * level / 425) * statVal;
  } else {
    // Up to 200 at full rate, above 200 at half rate (P99 soft-cap at 200)
    mana = (80 * level / 425) * 200 + (40 * level / 425) * (statVal - 200);
  }
  return Math.max(0, Math.floor(mana));
}

/**
 * Computes total armor class from equipment, AGI bonus, and defense skill.
 * @param {object} char - The character object with equipment, AGI, statBonuses, and skills.
 * @returns {number} The character's total armor class (minimum 0).
 */
// AGI < 75 = massive AC penalty: (75 - AGI) * 2
function getAC(char) {
  let baseAC = 0;
  if (char.equipment) {
    for (const slot in char.equipment) {
      const itemId = char.equipment[slot];
      if (itemId && ITEMS[itemId] && ITEMS[itemId].ac) {
        baseAC += ITEMS[itemId].ac;
      }
    }
  }
  let agi = char.AGI + (char.statBonuses ? char.statBonuses.AGI || 0 : 0);
  const penalty = typeof getEncumbrancePenalty === 'function' ? getEncumbrancePenalty(char) : { str: 0, agi: 0 };
  agi = Math.max(0, agi + penalty.agi);
  // Apply P99 worn AC soft cap for level <= 50
  if ((char.level || 1) <= 50) {
    const wornACCap = ((char.level || 1) * 6) + 25;
    baseAC = Math.min(baseAC, wornACCap);
  }
  let agiBonus = Math.floor((agi - 75) * 0.5);
  if (agi < 75) agiBonus = -((75 - agi) * 2);
  const defenseSkill = char.skills ? (char.skills['defense'] || 0) : 0;
  return Math.max(0, baseAC + agiBonus + Math.floor(defenseSkill / 10));
}

/**
 * Computes melee damage using the P99/EverQuest pipeline:
 * weapon damage cap → Wrath → weighted D20 → extra bonus → main-hand bonus.
 * @param {object} attacker   - The attacking character.
 * @param {object|null} weapon - The equipped weapon (with dmg/delay), or null.
 * @param {object|null} defender - The defending character/enemy, or null for neutral mitigation.
 * @param {boolean} isMainHand - Whether this is a main-hand swing (adds main-hand bonus). Default true.
 * @returns {number} The computed melee damage value (minimum 1).
 */
function getMeleeDamage(attacker, weapon, defender = null, isMainHand = true) {
  let str = attacker.STR + (attacker.statBonuses ? attacker.statBonuses.STR || 0 : 0);
  const penalty = typeof getEncumbrancePenalty === 'function' ? getEncumbrancePenalty(attacker) : { str: 0, agi: 0 };
  str = Math.max(0, str + penalty.str);

  // Pre-pipeline: Weapon Damage Cap (clamps weaponDmg before Wrath calculation)
  let weaponDmg = weapon ? weapon.dmg : 2;
  const cls = CLASSES[attacker.classId];
  const archetype = cls ? cls.archetype : 'Melee';
  const level = attacker.level || 1;
  if (archetype === 'Caster') {
    if (level < 10) weaponDmg = Math.min(weaponDmg, 6);
    else if (level < 20) weaponDmg = Math.min(weaponDmg, 10);
    else if (level < 30) weaponDmg = Math.min(weaponDmg, 12);
    else if (level < 40) weaponDmg = Math.min(weaponDmg, 18);
    else weaponDmg = Math.min(weaponDmg, 20);
  } else if (archetype === 'Priest') {
    if (level < 10) weaponDmg = Math.min(weaponDmg, 9);
    else if (level < 20) weaponDmg = Math.min(weaponDmg, 12);
    else if (level < 30) weaponDmg = Math.min(weaponDmg, 20);
    else if (level < 40) weaponDmg = Math.min(weaponDmg, 26);
    else weaponDmg = Math.min(weaponDmg, 40);
  } else {
    // Melee & Tank (includes Hybrid)
    if (level < 10) weaponDmg = Math.min(weaponDmg, 10);
    else if (level < 20) weaponDmg = Math.min(weaponDmg, 14);
    else if (level < 30) weaponDmg = Math.min(weaponDmg, 30);
    else if (level < 40) weaponDmg = Math.min(weaponDmg, 60);
    else weaponDmg = Math.min(weaponDmg, 100);
  }

  // Step 1: Calculate Wrath
  const strengthModifier = str >= 75 ? ((2 * str) - 150) / 3 : 0;
  const weaponSkill = attacker.skills ? (attacker.skills['offense'] || 0) : 0;
  const wornATK = attacker.statBonuses ? (attacker.statBonuses.ATK || 0) : 0;
  const spellATK = attacker.spellATK || 0;
  const wrath = weaponSkill + strengthModifier + wornATK + spellATK;

  // Step 2: Roll weighted D20
  const wrathRoll = Math.random() * (wrath + 5);
  let defAC = 0, defDefSkill = 0, defAGI = 0;
  if (defender) {
    defAC = defender.currentAC !== undefined ? defender.currentAC : (defender.ac || 0);
    defDefSkill = defender.skills ? (defender.skills['defense'] || 0) : 0;
    defAGI = defender.AGI !== undefined ? defender.AGI : (defender.ac ? defender.ac * 3 : 0);
  }
  const mitigationRoll = Math.random() * (defAC + defDefSkill / 5 + defAGI / 20 + 5);
  let averageRoll = (wrathRoll + mitigationRoll + 10) / 2;
  if (averageRoll < 1) averageRoll = 1;
  let rollIndex = (wrathRoll - mitigationRoll) + (averageRoll / 2);
  if (rollIndex < 0) rollIndex = 0;
  let weightedD20 = Math.floor((rollIndex * 20) / averageRoll);
  weightedD20 = Math.min(19, Math.max(0, weightedD20)) + 1;
  const rolledD20 = weightedD20 / 10;

  // Step 3: Calculate DamageDone with extra bonus
  let maxExtra, maxExtraChance, minusFactor;
  if (archetype === 'Caster' || archetype === 'Priest') {
    maxExtra = 210; maxExtraChance = 23; minusFactor = 80;
  } else {
    if (level <= 50) { maxExtra = 210; maxExtraChance = 49; minusFactor = 80; }
    else if (level <= 55) { maxExtra = 245; maxExtraChance = 35; minusFactor = 80; }
    else if (level <= 59) { maxExtra = 265; maxExtraChance = 28; minusFactor = 70; }
    else { maxExtra = 285; maxExtraChance = 23; minusFactor = 65; }
  }

  let damageDone;
  if (wrath < 115) {
    damageDone = weaponDmg * rolledD20;
  } else {
    const d100 = Math.random() * 100;
    if (d100 < maxExtraChance) {
      damageDone = weaponDmg * rolledD20;
    } else {
      const baseBonus = Math.max(10, Math.floor((wrath - minusFactor) / 2));
      const extraPercent = Math.min(maxExtra, 100 + Math.floor(baseBonus * Math.random()));
      damageDone = Math.floor((weaponDmg * rolledD20 * extraPercent) / 100);
    }
  }

  // Step 4: Main Hand Damage Bonus (main-hand only, not offhand or throwing)
  if (isMainHand) {
    const mainHandBonus = getDamageBonus(weapon, level);
    damageDone = Math.floor(damageDone) + mainHandBonus;
  }

  return Math.max(1, Math.floor(damageDone));
}

/**
 * Returns crit chance for a character. Only Warriors and Berserkers can land
 * critical melee hits in the P99/EverQuest era.
 * @param {object} char - The character object with classId and level.
 * @returns {number} A decimal crit chance fraction (0 for non-warrior/berserker).
 */
function getCritChance(char) {
  const classId = char.classId;
  if (classId !== 'warrior' && classId !== 'berserker') return 0;
  return Math.min(0.15, 0.02 + (char.level * 0.001));
}

/**
 * Returns miss chance based on attacker DEX vs defender AGI and dodge skill.
 * @param {object} attacker - The attacking character with DEX and optional statBonuses.
 * @param {object} defender - The defending character with AGI, statBonuses, and skills.
 * @returns {number} A decimal miss chance fraction (0–0.5).
 */
function getMissChance(attacker, defender) {
  const atkDex = attacker.DEX + (attacker.statBonuses ? attacker.statBonuses.DEX || 0 : 0);
  const defAgi = defender.AGI + (defender.statBonuses ? defender.statBonuses.AGI || 0 : 0);
  const dodgeSkill = defender.skills ? (defender.skills['dodge'] || 0) : 0;
  const base = Math.max(0, (defAgi - atkDex) / 400);
  return Math.min(0.5, base + dodgeSkill / 1000);
}

/**
 * Reduces damage by AC / 8, with a minimum of 1.
 * @param {number} damage - The incoming damage value before mitigation.
 * @param {object} defender - The defending character; uses currentAC or computes via getAC.
 * @returns {number} The mitigated damage value (minimum 1).
 */
function applyACMitigation(damage, defender) {
  const ac = (defender.currentAC !== undefined) ? defender.currentAC : getAC(defender);
  return Math.max(1, damage - Math.floor(ac / 8));
}

/**
 * Sums all equipment stat bonuses and resistances into one object.
 * @param {object} char - The character object with an equipment map of slot → itemId.
 * @returns {object} An object with STR/DEX/AGI/STA/WIS/INT/CHA bonuses and a resists sub-object.
 */
function computeStatBonuses(char) {
  const bonuses = { STR: 0, DEX: 0, AGI: 0, STA: 0, WIS: 0, INT: 0, CHA: 0 };
  const resists = { magic: 0, fire: 0, cold: 0, poison: 0, disease: 0 };
  if (char.equipment) {
    for (const slot in char.equipment) {
      const itemId = char.equipment[slot];
      if (itemId && ITEMS[itemId]) {
        const item = ITEMS[itemId];
        if (item.stats) {
          for (const stat in item.stats) {
            if (bonuses[stat] !== undefined) bonuses[stat] += item.stats[stat];
          }
        }
        if (item.resists) {
          for (const res in item.resists) {
            if (resists[res] !== undefined) resists[res] += item.resists[res];
          }
        }
      }
    }
  }
  return { ...bonuses, resists };
}

/**
 * Recomputes all derived stats (HP, mana, AC, bonuses) on the char object in-place.
 * @param {object} char - The character object to update; modified directly.
 * @returns {object} The same character object with updated derived stats.
 */
function computeDerivedStats(char) {
  char.statBonuses = computeStatBonuses(char);
  char.maxHP = getMaxHP(char);
  char.maxMana = getMaxMana(char);
  char.currentAC = getAC(char);
  char.maxEndurance = getMaxEndurance(char);
  if (char.hp === undefined || char.hp > char.maxHP) char.hp = char.maxHP;
  if (char.mana === undefined || char.mana > char.maxMana) char.mana = char.maxMana;
  if (char.endurance === undefined || char.endurance > char.maxEndurance) char.endurance = char.maxEndurance;
  return char;
}

/**
 * Returns base stat plus equipment bonus, capped at STAT_CAP.
 * @param {object} char - The character object with raw stats and optional statBonuses.
 * @param {string} stat - The stat key to look up (e.g., 'STR', 'DEX').
 * @returns {number} The effective stat value (base + bonus, max STAT_CAP).
 */
function getEffectiveStat(char, stat) {
  const base = char[stat] || 0;
  const bonus = char.statBonuses ? (char.statBonuses[stat] || 0) : 0;
  return Math.min(STAT_CAP, base + bonus);
}

/**
 * Array of cumulative XP thresholds for each level 0–61, based on the Project 1999 experience table.
 * @type {Array<number>}
 */
// ─── True P99 / EverQuest Experience Table ────────────────────────────────────
// XP_TABLE[N] = total cumulative XP required to have reached level N.
// Source: https://wiki.project1999.com/Experience#Experience_Requirement_by_Level
// Index 0 and 1 are both 0 (level 1 starts at 0 XP).
// Index 61 is a sentinel equal to the XP needed to "complete" level 60.
const XP_TABLE = [
  /* 0  */        0,
  /* 1  */        0,
  /* 2  */        1_000,
  /* 3  */        8_000,
  /* 4  */       27_000,
  /* 5  */       64_000,
  /* 6  */      125_000,
  /* 7  */      216_000,
  /* 8  */      343_000,
  /* 9  */      512_000,
  /* 10 */      729_000,
  /* 11 */    1_000_000,
  /* 12 */    1_331_000,
  /* 13 */    1_728_000,
  /* 14 */    2_197_000,
  /* 15 */    2_744_000,
  /* 16 */    3_375_000,
  /* 17 */    4_096_000,
  /* 18 */    4_913_000,
  /* 19 */    5_832_000,
  /* 20 */    6_859_000,
  /* 21 */    8_000_000,
  /* 22 */    9_261_000,
  /* 23 */   10_648_000,
  /* 24 */   12_167_000,
  /* 25 */   13_824_000,
  /* 26 */   15_625_000,
  /* 27 */   17_576_000,
  /* 28 */   19_683_000,
  /* 29 */   21_952_000,
  /* 30 */   24_389_000,
  /* 31 */   29_700_000,   // ← Hell level jump at 30→31
  /* 32 */   32_770_100,
  /* 33 */   36_044_800,
  /* 34 */   39_530_700,
  /* 35 */   43_234_400,
  /* 36 */   51_450_000,   // ← Hell level jump at 35→36
  /* 37 */   55_987_200,
  /* 38 */   60_783_600,
  /* 39 */   65_846_400,
  /* 40 */   71_182_800,
  /* 41 */   83_200_000,   // ← Hell level jump at 40→41
  /* 42 */   89_597_300,
  /* 43 */   96_314_400,
  /* 44 */  103_359_100,
  /* 45 */  110_739_200,
  /* 46 */  127_575_000,   // ← Hell level jump at 45→46
  /* 47 */  136_270_400,
  /* 48 */  145_352_200,
  /* 49 */  154_828_800,
  /* 50 */  164_708_600,
  /* 51 */  175_000_000,
  /* 52 */  198_976_500,   // ← Hell level jump at 51→52
  /* 53 */  224_972_800,
  /* 54 */  253_090_900,
  /* 55 */  299_181_600,   // ← Hell level jump at 54→55
  /* 56 */  349_387_500,   // ← Hell level jump at 55→56
  /* 57 */  403_916_800,   // ← Hell level jump at 56→57
  /* 58 */  462_982_500,   // ← Hell level jump at 57→58
  /* 59 */  526_802_400,   // ← Hell level jump at 58→59
  /* 60 */  616_137_000,   // ← Hell level jump at 59→60
  /* 61 */  669_600_000,   // sentinel — XP to complete level 60
];

/** Maximum achievable player level (60). */
const MAX_LEVEL = 60;

/**
 * Array of levels with disproportionately large XP requirements (EverQuest hell levels).
 * @type {Array<number>}
 */
// Levels with disproportionately large XP requirements (EQ "hell levels")
const HELL_LEVELS = [30, 35, 40, 45, 51, 54, 55, 56, 57, 58, 59];

/**
 * Returns the total cumulative XP required to have reached `level`.
 * xpForLevel(1) = 0, xpForLevel(2) = 1000, etc.
 * @param {number} level - The target level (1–60).
 * @returns {number} Total cumulative XP needed to reach that level.
 */
function xpForLevel(level) {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL + 1) return XP_TABLE[MAX_LEVEL + 1];
  return XP_TABLE[level] ?? XP_TABLE[MAX_LEVEL + 1];
}

/**
 * Returns the XP needed to advance from `level` to `level + 1`.
 * xpToNextLevel(1) = 1000, xpToNextLevel(30) = 5,311,000, etc.
 * @param {number} level - The current level (1–59).
 * @returns {number} XP required to reach the next level, or 0 if already max level.
 */
function xpToNextLevel(level) {
  if (level >= MAX_LEVEL) return 0; // Already max level
  return xpForLevel(level + 1) - xpForLevel(level);
}

/**
 * CHA-based price multiplier with a soft cap at 200 (P99 documentation, same as WIS/INT).
 * @param {object} char - The character object used to compute effective CHA.
 * @returns {number} A price multiplier (>1 means worse prices, <1 means better prices).
 */
// CHA soft cap 200 per P99 documentation (same as WIS/INT)
function getMerchantPriceMultiplier(char) {
  const cha = getEffectiveStat(char, 'CHA');
  if (cha >= 200) return 1.0 - ((cha - 200) * 0.0005);
  return 1.0 + ((200 - cha) * 0.002);
}

/**
 * Computes magic resist save based on WIS and gear.
 * @param {object} char - The character object with WIS, statBonuses, and resist values.
 * @returns {number} Magic save value (0–85).
 */
function getSaveVsMagic(char) {
  const wis = getEffectiveStat(char, 'WIS');
  const bonus = char.statBonuses ? (char.statBonuses.resists ? char.statBonuses.resists.magic || 0 : 0) : 0;
  return Math.min(85, Math.floor(wis / 5) + bonus);
}

/**
 * Computes the probability (0.05–0.95) that char fully resists a spell of the given type.
 * Implements the P99 formula: 6 resist points = 1%, with a level-difference curve.
 * @param {object} char - The defending character.
 * @param {string} resistType - One of: 'magic','fire','cold','poison','disease'.
 * @param {number} attackerLevel - The attacking caster's level.
 * @returns {number} Resist chance as a decimal fraction (0.05 to 0.95).
 */
function getResistChance(char, resistType, attackerLevel) {
  const resistVal = char.statBonuses && char.statBonuses.resists
    ? (char.statBonuses.resists[resistType] || 0)
    : 0;
  // Base chance: every 6 resist points = 1%
  let chance = resistVal / 6 / 100;
  // Level difference modifier: ~12% per 7 levels
  const levelDiff = (char.level || 1) - (attackerLevel || 1);
  const levelMod = (levelDiff / 7) * 0.12;
  chance += levelMod;
  // PvE hard caps: 5% min, 95% max
  return Math.max(0.05, Math.min(0.95, chance));
}

/**
 * Computes max endurance from STA and STR, P99-inspired.
 * Endurance affects disciplines and strenuous activities.
 * @param {object} char
 * @returns {number}
 */
function getMaxEndurance(char) {
  const sta = char.STA + (char.statBonuses ? char.statBonuses.STA || 0 : 0);
  const str = char.STR + (char.statBonuses ? char.statBonuses.STR || 0 : 0);
  const level = char.level || 1;
  return Math.floor(100 + (sta * 0.5) + (str * 0.25) + (level * 5));
}

/**
 * Simple weapon ratio: DMG / DLY. Useful for weapon comparison UI.
 * @param {object} weapon - Weapon item with dmg and delay properties.
 * @returns {number} Ratio rounded to 3 decimal places.
 */
function getWeaponRatio(weapon) {
  if (!weapon || !weapon.delay || !weapon.dmg) return 0;
  return parseFloat((weapon.dmg / weapon.delay).toFixed(3));
}

/**
 * P99 main-hand damage bonus, awarded starting at level 28.
 * For one-handed weapons: floor((level - 25) / 3), min 0.
 * @param {object} weapon - Weapon item object.
 * @param {number} level - Character level.
 * @returns {number} Damage bonus integer.
 */
function getDamageBonus(weapon, level) {
  if (!weapon || !level || level < 28) return 0;
  return Math.max(0, Math.floor((level - 25) / 3));
}

// ─── Weight & Encumbrance System ──────────────────────────────────────────────

/**
 * Returns the STR-based carry weight limit for a character.
 * @param {object} character - The character object with a STR property.
 * @returns {number} Maximum carry weight (minimum 10).
 */
function getWeightLimit(character) {
  return Math.max(10, (character.STR || 0) + 30);
}

/**
 * Returns the total weight of all equipped items on a character.
 * @param {object} character - The character object with an equipment map of slot → itemId.
 * @returns {number} The total weight of equipped items.
 */
function getCurrentCarryWeight(character) {
  let total = 0;
  const equipment = character.equipment || {};
  for (const itemId of Object.values(equipment)) {
    if (itemId && ITEMS[itemId]) {
      total += ITEMS[itemId].weight || 0;
    }
  }
  return total;
}

/**
 * Returns the total weight of inventory items and bag contents, accounting for weight reduction.
 * Reads from the global `GameState.inventory`, `GameState.bags`, and `GameState.bagContents`.
 * @returns {number} Total inventory weight rounded to one decimal place.
 */
function getInventoryWeight() {
  let total = 0;
  for (const stack of (GameState.inventory || [])) {
    if (!stack) continue;
    const item = ITEMS[stack.itemId];
    if (item) total += (item.weight || 0) * stack.quantity;
  }
  for (let i = 0; i < 4; i++) {
    const bagId = GameState.bags ? GameState.bags[i] : null;
    const bag = bagId ? ITEMS[bagId] : null;
    const reduction = bag ? (bag.weightReduction || 0) / 100 : 0;
    const contents = GameState.bagContents ? GameState.bagContents[i] : {};
    for (const stack of Object.values(contents || {})) {
      if (stack && stack.itemId) {
        const item = ITEMS[stack.itemId];
        if (item) total += ((item.weight || 0) * stack.quantity) * (1 - reduction);
      }
    }
  }
  return parseFloat(total.toFixed(1));
}

/**
 * Returns true if the character's carry weight exceeds their weight limit.
 * @param {object} character - The character object to check encumbrance for.
 * @returns {boolean} Whether the character is currently encumbered.
 */
function isEncumbered(character) {
  const carried = getCurrentCarryWeight(character) + getInventoryWeight();
  const limit = getWeightLimit(character);
  return carried > limit;
}

/**
 * Returns STR and AGI penalties applied when a character is over-encumbered.
 * @param {object} character - The character object to compute penalties for.
 * @returns {object} An object with str and agi penalty values (both ≤ 0).
 */
function getEncumbrancePenalty(character) {
  if (!isEncumbered(character)) return { str: 0, agi: 0 };
  const carried = getCurrentCarryWeight(character) + getInventoryWeight();
  const limit = getWeightLimit(character);
  const overPct = Math.min(1, (carried - limit) / limit);
  return {
    str: -Math.floor(overPct * 30),
    agi: -Math.floor(overPct * 20),
  };
}

if (typeof module !== 'undefined') module.exports = { getMaxHP, getMaxMana, getAC, getMeleeDamage, getCritChance, getMissChance, applyACMitigation, computeDerivedStats, computeStatBonuses, getEffectiveStat, XP_TABLE, MAX_LEVEL, HELL_LEVELS, xpForLevel, xpToNextLevel, getMerchantPriceMultiplier, getSaveVsMagic, getResistChance, getMaxEndurance, getWeaponRatio, getDamageBonus, getWeightLimit, getCurrentCarryWeight, getInventoryWeight, isEncumbered, getEncumbrancePenalty };