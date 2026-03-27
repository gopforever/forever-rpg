// party.js - Party management system for Forever RPG
// Depends on globals: CLASSES, ITEMS, STARTING_GEAR, computeDerivedStats, xpForLevel, xpToNextLevel, STAT_CAP

let _charIdCounter = 0;

const EQUIPMENT_SLOTS = [
  'primary', 'secondary', 'range', 'ammo',
  'head', 'face', 'neck', 'shoulders',
  'chest', 'back', 'wrist_l', 'wrist_r',
  'hands', 'ring1', 'ring2', 'waist',
  'legs', 'feet', 'ear1', 'ear2'
];

function createCharacter(name, classId, level = 1) {
  const cls = CLASSES[classId];
  if (!cls) throw new Error(`Unknown classId: ${classId}`);

  const base = cls.baseStats || {};
  const equipment = {};
  for (const slot of EQUIPMENT_SLOTS) equipment[slot] = null;

  const char = {
    id: 'char_' + Date.now() + '_' + (++_charIdCounter),
    name,
    classId,
    level,
    xp: xpForLevel(level),
    xpToNext: xpToNextLevel(level),
    STR: base.STR || 10,
    DEX: base.DEX || 10,
    AGI: base.AGI || 10,
    STA: base.STA || 10,
    WIS: base.WIS || 10,
    INT: base.INT || 10,
    CHA: base.CHA || 10,
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

  return char;
}

function createParty(characterDefinitions) {
  const defs = characterDefinitions.slice(0, 5);
  return defs.map(def => createCharacter(def.name, def.classId, def.level || 1));
}

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

function unequipItem(char, slot) {
  if (!EQUIPMENT_SLOTS.includes(slot)) return null;
  const itemId = char.equipment[slot] || null;
  char.equipment[slot] = null;
  computeDerivedStats(char);
  return itemId;
}

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

    results.push({ charId: char.id, leveled, oldLevel, newLevel: char.level });
  }

  return results;
}

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
}

function getPartyTank(party) {
  const tank = party.find(c => c.isAlive && c.role && c.role.toLowerCase().includes('tank'));
  return tank || party.find(c => c.isAlive) || null;
}

function getLowestHPMember(party) {
  const living = party.filter(c => c.isAlive && c.maxHP > 0);
  if (living.length === 0) return null;
  return living.reduce((lowest, c) => {
    const pct = c.hp / c.maxHP;
    const lowestPct = lowest.hp / lowest.maxHP;
    return pct < lowestPct ? c : lowest;
  });
}

function getHealerInParty(party) {
  return party.find(c => c.isAlive && c.role && c.role.toLowerCase().includes('healer')) || null;
}

function applyStatusEffect(char, effect) {
  const existing = char.statusEffects.find(e => e.type === effect.type);
  if (existing) {
    // Always refresh duration; only override tickDamage if the new effect is stronger
    existing.endTime = effect.endTime || (Date.now() + (effect.duration || 0));
    if (effect.tickDamage !== undefined && effect.tickDamage > existing.tickDamage) {
      existing.tickDamage = effect.tickDamage;
    }
    return;
  }
  const applied = {
    type: effect.type,
    duration: effect.duration || 0,
    tickDamage: effect.tickDamage || 0,
    startTime: effect.startTime || Date.now(),
    endTime: effect.endTime || (Date.now() + (effect.duration || 0)),
  };
  char.statusEffects.push(applied);
}

function tickStatusEffects(char) {
  const now = Date.now();
  let totalDamage = 0;

  char.statusEffects = char.statusEffects.filter(effect => {
    if (now >= effect.endTime) return false;
    if (effect.tickDamage && effect.tickDamage > 0) {
      totalDamage += effect.tickDamage;
    }
    return true;
  });

  if (totalDamage > 0) {
    char.hp = Math.max(0, char.hp - totalDamage);
    if (char.hp === 0) char.isAlive = false;
  }

  return totalDamage;
}

function isStunned(char) { return char.statusEffects.some(e => e.type === 'stun' && Date.now() < e.endTime); }
function isMezzed(char) { return char.statusEffects.some(e => e.type === 'mez' && Date.now() < e.endTime); }
function isSlowed(char) { return char.statusEffects.some(e => e.type === 'slow' && Date.now() < e.endTime); }
function isPoisoned(char) { return char.statusEffects.some(e => e.type === 'poison' && Date.now() < e.endTime); }

if (typeof module !== 'undefined') module.exports = { createCharacter, createParty, equipItem, unequipItem, gainXP, levelUp, getPartyTank, getLowestHPMember, getHealerInParty, applyStatusEffect, tickStatusEffects, isStunned, isMezzed, isSlowed, isPoisoned };
