// stats.js - P99/EverQuest-inspired stat system for Forever RPG
// CLASSES and ITEMS are globals loaded via script tags in the browser

// EverQuest base stat cap (before AA/item augment effects)
const STAT_CAP = 255;

function getMaxHP(char) {
  const cls = CLASSES[char.classId];
  const hpPerSTA = cls ? cls.hpPerSTA : 3;
  const sta = char.STA + (char.statBonuses ? char.statBonuses.STA || 0 : 0);
  return Math.floor(30 + (sta * hpPerSTA * 0.8) + (char.level * hpPerSTA * 3));
}

function getMaxMana(char) {
  const cls = CLASSES[char.classId];
  if (!cls || !cls.manaStat) return 0;
  const manaStat = cls.manaStat;
  const statVal = char[manaStat] + (char.statBonuses ? char.statBonuses[manaStat] || 0 : 0);
  return Math.floor(20 + (statVal * 12 * 0.3) + (char.level * 15));
}

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
  let agiBonus = Math.floor((agi - 75) * 0.5);
  if (agi < 75) agiBonus = -((75 - agi) * 2);
  const defenseSkill = char.skills ? (char.skills['defense'] || 0) : 0;
  return Math.max(0, baseAC + agiBonus + Math.floor(defenseSkill / 10));
}

function getMeleeDamage(attacker, weapon) {
  let str = attacker.STR + (attacker.statBonuses ? attacker.statBonuses.STR || 0 : 0);
  const penalty = typeof getEncumbrancePenalty === 'function' ? getEncumbrancePenalty(attacker) : { str: 0, agi: 0 };
  str = Math.max(0, str + penalty.str);
  const weaponDmg = weapon ? weapon.dmg : 2;
  const offenseSkill = attacker.skills ? (attacker.skills['offense'] || 0) : 0;
  return Math.max(1, Math.floor(
    ((str - 15) / 10) +
    weaponDmg +
    (attacker.level * 0.5) +
    (offenseSkill / 20) +
    Math.random() * weaponDmg
  ));
}

function getCritChance(char) {
  const dex = char.DEX + (char.statBonuses ? char.statBonuses.DEX || 0 : 0);
  return dex / 1000;
}

function getMissChance(attacker, defender) {
  const atkDex = attacker.DEX + (attacker.statBonuses ? attacker.statBonuses.DEX || 0 : 0);
  const defAgi = defender.AGI + (defender.statBonuses ? defender.statBonuses.AGI || 0 : 0);
  const dodgeSkill = defender.skills ? (defender.skills['dodge'] || 0) : 0;
  const base = Math.max(0, (defAgi - atkDex) / 400);
  return Math.min(0.5, base + dodgeSkill / 1000);
}

function applyACMitigation(damage, defender) {
  const ac = (defender.currentAC !== undefined) ? defender.currentAC : getAC(defender);
  return Math.max(1, damage - Math.floor(ac / 5));
}

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

function computeDerivedStats(char) {
  char.statBonuses = computeStatBonuses(char);
  char.maxHP = getMaxHP(char);
  char.maxMana = getMaxMana(char);
  char.currentAC = getAC(char);
  if (char.hp === undefined || char.hp > char.maxHP) char.hp = char.maxHP;
  if (char.mana === undefined || char.mana > char.maxMana) char.mana = char.maxMana;
  return char;
}

function getEffectiveStat(char, stat) {
  const base = char[stat] || 0;
  const bonus = char.statBonuses ? (char.statBonuses[stat] || 0) : 0;
  return Math.min(STAT_CAP, base + bonus);
}

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

const MAX_LEVEL = 60;

// Levels with disproportionately large XP requirements (EQ "hell levels")
const HELL_LEVELS = [30, 35, 40, 45, 51, 54, 55, 56, 57, 58, 59];

/**
 * Returns the total cumulative XP required to have reached `level`.
 * xpForLevel(1) = 0, xpForLevel(2) = 1000, etc.
 */
function xpForLevel(level) {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL + 1) return XP_TABLE[MAX_LEVEL + 1];
  return XP_TABLE[level] ?? XP_TABLE[MAX_LEVEL + 1];
}

/**
 * Returns the XP needed to advance from `level` to `level + 1`.
 * xpToNextLevel(1) = 1000, xpToNextLevel(30) = 5,311,000, etc.
 */
function xpToNextLevel(level) {
  if (level >= MAX_LEVEL) return 0; // Already max level
  return xpForLevel(level + 1) - xpForLevel(level);
}

// CHA soft cap 115: below = worse merchant prices, above = diminishing returns
function getMerchantPriceMultiplier(char) {
  const cha = getEffectiveStat(char, 'CHA');
  if (cha >= 115) return 1.0 - ((cha - 115) * 0.001);
  return 1.0 + ((115 - cha) * 0.005);
}

function getSaveVsMagic(char) {
  const wis = getEffectiveStat(char, 'WIS');
  const bonus = char.statBonuses ? (char.statBonuses.resists ? char.statBonuses.resists.magic || 0 : 0) : 0;
  return Math.min(85, Math.floor(wis / 5) + bonus);
}

// ─── Weight & Encumbrance System ──────────────────────────────────────────────

function getWeightLimit(character) {
  return Math.max(10, (character.STR || 0) + 30);
}

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

function isEncumbered(character) {
  const carried = getCurrentCarryWeight(character) + getInventoryWeight();
  const limit = getWeightLimit(character);
  return carried > limit;
}

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

if (typeof module !== 'undefined') module.exports = { getMaxHP, getMaxMana, getAC, getMeleeDamage, getCritChance, getMissChance, applyACMitigation, computeDerivedStats, computeStatBonuses, getEffectiveStat, XP_TABLE, MAX_LEVEL, HELL_LEVELS, xpForLevel, xpToNextLevel, getMerchantPriceMultiplier, getSaveVsMagic, getWeightLimit, getCurrentCarryWeight, getInventoryWeight, isEncumbered, getEncumbrancePenalty };