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
  const agi = char.AGI + (char.statBonuses ? char.statBonuses.AGI || 0 : 0);
  let agiBonus = Math.floor((agi - 75) * 0.5);
  if (agi < 75) agiBonus = -((75 - agi) * 2);
  return Math.max(0, baseAC + agiBonus);
}

function getMeleeDamage(attacker, weapon) {
  const str = attacker.STR + (attacker.statBonuses ? attacker.statBonuses.STR || 0 : 0);
  const weaponDmg = weapon ? weapon.dmg : 2;
  return Math.max(1, Math.floor(((str - 15) / 10) + weaponDmg + (attacker.level * 0.5) + Math.random() * weaponDmg));
}

function getCritChance(char) {
  const dex = char.DEX + (char.statBonuses ? char.statBonuses.DEX || 0 : 0);
  return dex / 1000;
}

function getMissChance(attacker, defender) {
  const atkDex = attacker.DEX + (attacker.statBonuses ? attacker.statBonuses.DEX || 0 : 0);
  const defAgi = defender.AGI + (defender.statBonuses ? defender.statBonuses.AGI || 0 : 0);
  return Math.max(0, Math.min(0.5, (defAgi - atkDex) / 400));
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

// EQ-style XP curve — roughly triples every few levels
function xpForLevel(level) {
  if (level <= 1) return 0;
  const xpTable = [
    0, 0, 80, 240, 720, 2000, 5400, 13500, 34000, 83000, 200000
  ];
  if (level < xpTable.length) return xpTable[level];
  return Math.floor(xpTable[10] * Math.pow(3, level - 10));
}

function xpToNextLevel(level) {
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

if (typeof module !== 'undefined') module.exports = { getMaxHP, getMaxMana, getAC, getMeleeDamage, getCritChance, getMissChance, applyACMitigation, computeDerivedStats, computeStatBonuses, getEffectiveStat, xpForLevel, xpToNextLevel, getMerchantPriceMultiplier, getSaveVsMagic };
