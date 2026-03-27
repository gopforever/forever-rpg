/* globals GameState, CLASSES, ITEMS, ENEMIES, ZONES,
   getMaxHP, getMaxMana, getAC, getMeleeDamage, getCritChance, getMissChance,
   applyACMitigation, computeDerivedStats, gainXP,
   getPartyTank, getLowestHPMember, getHealerInParty,
   applyStatusEffect, tickStatusEffects, isStunned, isMezzed, isSlowed,
   rollLoot, addCombatLog, addLoot, showDamageNumber, getSprite,
   updateCombatUI, updatePartyUI, updateInventoryUI, updateKillCountUI,
   showLevelUpEffect,
   trySkillGain, hasSkill, SKILL_DISPLAY_NAMES */

const MAX_CARRY_SLOTS = 30;

function startCombat(enemyId) {
  const template = ENEMIES[enemyId];
  if (!template) {
    console.error(`startCombat: unknown enemyId "${enemyId}"`);
    return;
  }

  GameState.currentEnemy = {
    id: enemyId,
    name: template.name,
    level: template.level,
    hp: template.hp,
    maxHP: template.hp,
    atk: template.atk,
    ac: template.ac,
    xp: template.xp,
    isUndead: template.isUndead || false,
    magicResist: template.magicResist || 0,
    statusEffects: [],
    statusEffectMap: {},
    sprite: template.sprite || null,
    loot: template.loot || [],
    statusProcs: template.statusProcs || [],
  };

  GameState.combatActive = true;
  GameState.inCombat = true;

  addCombatLog(`--- ${template.name} engages! ---`, 'system');

  if (typeof updateCombatUI === 'function') updateCombatUI();
}

function selectEnemy(enemyId) {
  GameState.selectedEnemyId = enemyId;
  startCombat(enemyId);
}

function stopCombat() {
  GameState.combatActive = false;
  GameState.inCombat = false;
  GameState.currentEnemy = null;
  GameState.selectedEnemyId = null;
  addCombatLog('Combat stopped.', 'system');
  if (typeof updateCombatUI === 'function') updateCombatUI();
}

function combatTick() {
  if (!GameState.combatActive || !GameState.currentEnemy) return;

  const enemy = GameState.currentEnemy;
  const party = GameState.party;

  const livingMembers = party.filter(m => m.isAlive);
  if (livingMembers.length === 0) {
    handlePartyWipe();
    return;
  }

  for (const member of livingMembers) {
    if (!isStunned(member) && !isMezzed(member)) {
      memberAttack(member, enemy);
    }
    if (enemy.hp <= 0) break;
  }

  const healer = getHealerInParty(party);
  if (healer && healer.isAlive && healer.mana > 0) {
    performHeal(healer, party);
  }

  if (enemy.hp <= 0) {
    handleEnemyDeath(enemy);
    return;
  }

  const tank = getPartyTank(party);
  if (tank && tank.isAlive) {
    enemyAttack(enemy, tank, party);
  }

  const stillLiving = party.filter(m => m.isAlive);
  for (const member of stillLiving) {
    const statusDamage = tickStatusEffects(member);
    if (statusDamage > 0) {
      member.hp = Math.max(0, member.hp - statusDamage);
      const effectType = member.statusEffects.length > 0 ? member.statusEffects[0].type : 'status';
      addCombatLog(`${member.name} takes ${statusDamage} ${effectType} damage!`, 'poison');
      if (member.hp <= 0) {
        member.isAlive = false;
        addCombatLog(`${member.name} has DIED!`, 'death');
      }
    }

    // Monk mend: passive regen via skill
    if (
      member.classId === 'monk' &&
      typeof hasSkill === 'function' && hasSkill(member, 'mend') &&
      member.hp < member.maxHP * 0.8 &&
      Math.random() < 0.1
    ) {
      const mendSkill = (member.skills && member.skills['mend']) || 0;
      const mendHeal = Math.max(1, Math.floor(mendSkill / 2));
      member.hp = Math.min(member.maxHP, member.hp + mendHeal);
      if (typeof trySkillGain === 'function') trySkillGain(member, 'mend');
    }
  }

  if (typeof updateCombatUI === 'function') updateCombatUI();
}

function getWeaponSkillName(weapon) {
  if (!weapon) return 'oneHandBlunt';
  const t = weapon.weaponType || weapon.slot || '';
  if (t === 'piercing' || t === 'dagger') return 'piercing';
  if (t === 'twoHandSlash' || t === '2hslash') return 'twoHandSlash';
  if (t === 'twoHandBlunt' || t === '2hblunt') return 'twoHandBlunt';
  if (t === 'twoHandPierce') return 'piercing';
  if (t.includes('blunt') || t.includes('mace') || t.includes('staff')) return 'oneHandBlunt';
  return 'oneHandSlash';
}

function memberAttack(member, enemy) {
  const weaponId = member.equipment ? member.equipment.primary : null;
  const weapon = weaponId && ITEMS[weaponId] ? ITEMS[weaponId] : { dmg: 2, delay: 28, name: 'Fists' };

  if (isSlowed(member) && Math.random() < 0.5) return;

  const missChance = getMissChance(member, { AGI: enemy.ac * 3, statBonuses: {} });
  if (Math.random() < missChance) {
    addCombatLog(`${member.name} misses ${enemy.name}.`, 'miss');
    showDamageNumber('Miss', member, false);
    return;
  }

  let damage = getMeleeDamage(member, weapon);

  const isCrit = Math.random() < getCritChance(member);
  if (isCrit) damage = Math.floor(damage * 2);

  damage = applyACMitigation(damage, { currentAC: enemy.ac, AGI: enemy.ac * 3, statBonuses: {} });
  damage = Math.max(1, damage);

  enemy.hp = Math.max(0, enemy.hp - damage);

  const logType = isCrit ? 'crit' : 'hit';
  const critText = isCrit ? ' **CRITICAL HIT!**' : '';
  addCombatLog(`${member.name} hits ${enemy.name} for ${damage} damage!${critText}`, logType);
  showDamageNumber(damage, null, isCrit);

  // Skill gains on successful hit
  if (typeof trySkillGain === 'function') {
    trySkillGain(member, 'offense');
    const weaponSkill = getWeaponSkillName(weaponId ? weapon : null);
    trySkillGain(member, weaponSkill);

    // Double attack proc
    if (typeof hasSkill === 'function' && hasSkill(member, 'doubleAttack')) {
      const doubleChance = (member.skills['doubleAttack'] || 0) / 500;
      if (Math.random() < doubleChance) {
        let dmg2 = getMeleeDamage(member, weapon);
        dmg2 = applyACMitigation(dmg2, { currentAC: enemy.ac, AGI: enemy.ac * 3, statBonuses: {} });
        dmg2 = Math.max(1, dmg2);
        enemy.hp = Math.max(0, enemy.hp - dmg2);
        addCombatLog(`${member.name} hits ${enemy.name} again for ${dmg2} (Double Attack)!`, 'hit');
        trySkillGain(member, 'doubleAttack');
      }
    }
  }

  procClassAbility(member, enemy, damage);
}

function enemyAttack(enemy, target, party) {
  // Dodge check
  if (typeof hasSkill === 'function' && hasSkill(target, 'dodge')) {
    const dodgeChance = (target.skills['dodge'] || 0) / 600;
    if (Math.random() < dodgeChance) {
      addCombatLog(`${target.name} dodges ${enemy.name}'s attack!`, 'miss');
      if (typeof trySkillGain === 'function') trySkillGain(target, 'dodge');
      return;
    }
  }

  // Parry check
  if (typeof hasSkill === 'function' && hasSkill(target, 'parry')) {
    const parryChance = (target.skills['parry'] || 0) / 700;
    if (Math.random() < parryChance) {
      addCombatLog(`${target.name} parries ${enemy.name}'s attack!`, 'miss');
      if (typeof trySkillGain === 'function') trySkillGain(target, 'parry');

      // Riposte check (only triggers after successful parry)
      if (typeof hasSkill === 'function' && hasSkill(target, 'riposte')) {
        const riposteChance = (target.skills['riposte'] || 0) / 800;
        if (Math.random() < riposteChance) {
          const riposteDmg = Math.max(1, Math.floor(getMeleeDamage(target, null) * 0.7));
          enemy.hp = Math.max(0, enemy.hp - riposteDmg);
          addCombatLog(`${target.name} ripostes for ${riposteDmg} damage!`, 'hit');
          if (typeof trySkillGain === 'function') trySkillGain(target, 'riposte');
        }
      }
      return;
    }
  }

  const missChance = getMissChance(
    { DEX: 75, statBonuses: {} },
    target
  );

  if (Math.random() < missChance) {
    addCombatLog(`${enemy.name} misses ${target.name}.`, 'miss');
    return;
  }

  let damage = Math.max(1, enemy.atk + Math.floor(Math.random() * (enemy.atk * 0.5)));
  damage = applyACMitigation(damage, target);
  damage = Math.max(1, damage);

  target.hp = Math.max(0, target.hp - damage);

  addCombatLog(`${enemy.name} hits ${target.name} for ${damage} damage!`, 'enemy');
  showDamageNumber(damage, target, false);

  // Defender gains defense skill on being hit
  if (typeof trySkillGain === 'function') trySkillGain(target, 'defense');

  if (target.hp <= 0) {
    target.isAlive = false;
    addCombatLog(`${target.name} has DIED!`, 'death');

    ensureMonsterLogEntry(enemy.id).deaths++;

    if (!party.some(m => m.isAlive)) {
      setTimeout(handlePartyWipe, 500);
    }
  }

  const procs = enemy.statusProcs || (enemy.statusEffects && enemy.statusEffects.length > 0 ? enemy.statusEffects : []);
  for (const effect of procs) {
    if (Math.random() < effect.chance) {
      applyStatusEffect(target, {
        type: effect.type,
        endTime: Date.now() + effect.duration,
        tickDamage: effect.damage || 0,
        lastTick: Date.now(),
      });
      addCombatLog(`${target.name} is ${effect.type}ed!`, 'spell');
    }
  }
}

function performHeal(healer, party) {
  const target = getLowestHPMember(party);
  if (!target) return;

  const hpPercent = target.hp / target.maxHP;
  if (hpPercent >= 0.9) return;

  const healAmount = Math.floor(20 + (healer.WIS * 0.3) + (healer.level * 5));
  const manaCost = Math.floor(healAmount * 0.4);

  if (healer.mana < manaCost) return;

  healer.mana = Math.max(0, healer.mana - manaCost);
  target.hp = Math.min(target.maxHP, target.hp + healAmount);

  addCombatLog(`${healer.name} heals ${target.name} for ${healAmount}!`, 'heal');

  // Skill gains on successful heal
  if (typeof trySkillGain === 'function') {
    trySkillGain(healer, 'channeling');
    trySkillGain(healer, 'alteration');
  }
}

/**
 * Returns the con color, XP multiplier, and label for a given level difference.
 * @param {number} partyLevel - Highest level of living party members
 * @param {number} enemyLevel - Level of the enemy
 * @returns {{ color: string, label: string, multiplier: number }}
 */
function getConColor(partyLevel, enemyLevel) {
  const diff = enemyLevel - partyLevel; // positive = enemy is higher level

  if (diff >= 4)   return { color: 'red',       label: '⚔ Red',        multiplier: 1.25 };
  if (diff >= 1)   return { color: 'yellow',    label: '◆ Yellow',     multiplier: 1.0  };
  if (diff === 0)  return { color: 'white',     label: '● White',      multiplier: 1.0  };
  if (diff === -1) return { color: 'blue',      label: '● Blue',       multiplier: 0.8  };
  if (diff === -2) return { color: 'blue',      label: '● Blue',       multiplier: 0.65 };
  if (diff === -3) return { color: 'blue',      label: '● Blue',       multiplier: 0.5  };
  if (diff >= -6)  return { color: 'lightblue', label: '● Light Blue', multiplier: 0.25 };
  return               { color: 'green',       label: '● Green',      multiplier: 0    };
}

function ensureMonsterLogEntry(enemyId) {
  if (!GameState.monsterLog) GameState.monsterLog = {};
  if (!GameState.monsterLog[enemyId]) {
    GameState.monsterLog[enemyId] = { kills: 0, deaths: 0, firstSeen: Date.now(), lastKill: null };
  }
  return GameState.monsterLog[enemyId];
}

function handleEnemyDeath(enemy) {
  addCombatLog(`${enemy.name} has been slain!`, 'death');

  const zoneData = ZONES && GameState.zone ? ZONES[GameState.zone] : null;
  const zoneXpModifier = zoneData && zoneData.xpModifier ? zoneData.xpModifier : 1;

  // Con-color XP scaling
  const highestLevel = Math.max(...GameState.party.filter(m => m.isAlive).map(m => m.level), 1);
  const { multiplier: conMultiplier, label: conLabel } = getConColor(highestLevel, enemy.level);

  const xpGain = Math.floor(enemy.xp * zoneXpModifier * conMultiplier);
  const levelUps = gainXP(GameState.party, xpGain);

  const livingCount = GameState.party.filter(m => m.isAlive).length;
  const xpPerMember = Math.floor(xpGain / Math.max(1, livingCount));

  if (xpGain > 0) {
    addCombatLog(`Party gains ${xpGain} XP (${xpPerMember} each) [${conLabel}]`, 'xp');
  } else {
    addCombatLog(`${enemy.name} was ${conLabel} — no experience gained.`, 'xp');
  }

  for (const lu of levelUps) {
    if (lu.leveled) {
      addCombatLog(`${lu.charName} reached level ${lu.newLevel}!`, 'levelup');
      if (typeof showLevelUpEffect === 'function') showLevelUpEffect(lu.charId);
    }
  }

  if (!GameState.killCounts) GameState.killCounts = {};
  if (!GameState.killCounts[enemy.id]) GameState.killCounts[enemy.id] = 0;
  GameState.killCounts[enemy.id]++;

  const logEntry = ensureMonsterLogEntry(enemy.id);
  logEntry.kills++;
  logEntry.lastKill = Date.now();

  const lootDrops = rollLoot(ENEMIES[enemy.id]);
  for (const drop of lootDrops) {
    if (GameState.settings && GameState.settings.autoLoot) {
      addToInventory(drop.itemId, drop.quantity);
      const item = ITEMS[drop.itemId];
      if (item) {
        addCombatLog(`You receive: ${item.name} x${drop.quantity}`, 'loot');
        addLoot(drop.itemId, drop.quantity);
      }
    }
  }

  GameState.combatActive = false;
  GameState.currentEnemy = null;

  if (GameState.selectedEnemyId) {
    const respawnTime = zoneData && zoneData.respawnTime ? zoneData.respawnTime : 3000;
    setTimeout(() => {
      if (GameState.selectedEnemyId) {
        startCombat(GameState.selectedEnemyId);
        if (typeof updateCombatUI === 'function') updateCombatUI();
      }
    }, respawnTime);
  }

  if (typeof updateCombatUI === 'function') updateCombatUI();
  if (typeof updatePartyUI === 'function') updatePartyUI();
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
  if (typeof updateKillCountUI === 'function') updateKillCountUI();
}

function handlePartyWipe() {
  addCombatLog('--- PARTY HAS BEEN DEFEATED ---', 'death');
  GameState.combatActive = false;
  GameState.currentEnemy = null;

  setTimeout(() => {
    for (const member of GameState.party) {
      member.isAlive = true;
      member.hp = Math.max(1, Math.floor(member.maxHP * 0.1));
      member.mana = Math.max(0, Math.floor(member.maxMana * 0.1));
      member.statusEffects = [];
      if (member.statusEffectMap) member.statusEffectMap = {};
    }
    addCombatLog('Party recovers... ready to fight again.', 'system');
    if (typeof updateCombatUI === 'function') updateCombatUI();
    if (typeof updatePartyUI === 'function') updatePartyUI();
  }, 5000);
}

function procClassAbility(member, enemy, damage) {
  const classId = member.classId;
  const procRoll = Math.random();

  if (classId === 'rogue' && member.equipment && member.equipment.primary) {
    if (procRoll < 0.15) {
      const backstabDmg = Math.floor(damage * 1.5);
      enemy.hp = Math.max(0, enemy.hp - backstabDmg);
      addCombatLog(`${member.name} BACKSTABS for ${backstabDmg} extra damage!`, 'crit');
    }
  } else if (classId === 'monk') {
    if (procRoll < 0.1) {
      const kickDmg = Math.floor(member.level * 2 + (member.STR || 0) * 0.1);
      enemy.hp = Math.max(0, enemy.hp - kickDmg);
      addCombatLog(`${member.name} lands a FLYING KICK for ${kickDmg}!`, 'hit');
    }
  } else if (classId === 'berserker') {
    if (member.hp < member.maxHP * 0.3 && procRoll < 0.2) {
      const frenzyDmg = Math.floor(damage * 0.7);
      enemy.hp = Math.max(0, enemy.hp - frenzyDmg);
      addCombatLog(`${member.name} FRENZIES for ${frenzyDmg} extra!`, 'crit');
    }
  } else if (classId === 'paladin' || classId === 'cleric') {
    if (enemy.isUndead && procRoll < 0.15) {
      const holyDmg = Math.floor(member.level * 3);
      enemy.hp = Math.max(0, enemy.hp - holyDmg);
      addCombatLog(`${member.name} channels holy power for ${holyDmg} vs undead!`, 'spell');
    }
  } else if (classId === 'shadowknight' || classId === 'necromancer') {
    if (procRoll < 0.08) {
      const tapDmg = Math.floor(member.level * 2);
      enemy.hp = Math.max(0, enemy.hp - tapDmg);
      member.hp = Math.min(member.maxHP, member.hp + tapDmg);
      addCombatLog(`${member.name} drains ${tapDmg} life!`, 'spell');
    }
  } else if (classId === 'wizard' || classId === 'magician') {
    if (procRoll < 0.12 && member.mana >= 20) {
      const spellDmg = Math.floor((member.INT || 0) * 0.3 + member.level * 4);
      if (enemy.magicResist && Math.random() < enemy.magicResist / 100) {
        addCombatLog(`${enemy.name} RESISTS the spell!`, 'miss');
      } else {
        enemy.hp = Math.max(0, enemy.hp - spellDmg);
        addCombatLog(`${member.name} blasts ${enemy.name} for ${spellDmg}!`, 'spell');
      }
      member.mana = Math.max(0, member.mana - 20);
    }
  } else if (classId === 'enchanter') {
    if (procRoll < 0.1 && member.mana >= 15) {
      applyStatusEffect(enemy, { type: 'slow', endTime: Date.now() + 8000 });
      member.mana = Math.max(0, member.mana - 15);
      addCombatLog(`${member.name} slows ${enemy.name}!`, 'spell');
    }
  } else if (classId === 'shaman') {
    if (procRoll < 0.1 && member.mana >= 15) {
      applyStatusEffect(enemy, { type: 'slow', endTime: Date.now() + 10000 });
      member.mana = Math.max(0, member.mana - 15);
      addCombatLog(`${member.name} slows ${enemy.name} with malaise!`, 'spell');
    }
  } else if (classId === 'druid') {
    if (procRoll < 0.08 && member.mana >= 12) {
      applyStatusEffect(enemy, { type: 'slow', endTime: Date.now() + 12000 });
      member.mana = Math.max(0, member.mana - 12);
      addCombatLog(`${member.name} snares ${enemy.name}!`, 'spell');
    }
  } else if (classId === 'bard') {
    if (procRoll < 0.05) {
      addCombatLog(`${member.name} plays an inspiring melody!`, 'spell');
    }
  } else if (classId === 'ranger') {
    if (procRoll < 0.12) {
      const arrowDmg = Math.floor((member.DEX || 0) * 0.15 + member.level * 1.5);
      enemy.hp = Math.max(0, enemy.hp - arrowDmg);
      addCombatLog(`${member.name} fires an arrow for ${arrowDmg}!`, 'hit');
    }
  } else if (classId === 'beastlord') {
    if (procRoll < 0.15) {
      const warderDmg = Math.floor(member.level * 1.8 + (member.WIS || 0) * 0.1);
      enemy.hp = Math.max(0, enemy.hp - warderDmg);
      addCombatLog(`${member.name}'s warder attacks for ${warderDmg}!`, 'hit');
    }
  }
}

function addToInventory(itemId, quantity) {
  if (!GameState.inventory) GameState.inventory = [];

  const item = ITEMS[itemId];

  // Try to stack in existing slot
  const existing = GameState.inventory.find(stack => stack && stack.itemId === itemId);
  if (existing) {
    existing.quantity += quantity;
    return true;
  }

  // Check if we have a free slot (max 30 base carry slots)
  if (GameState.inventory.filter(Boolean).length >= MAX_CARRY_SLOTS) {
    // Try to fit in a bag
    if (GameState.bags) {
      for (let i = 0; i < 4; i++) {
        if (GameState.bags[i] && addToBag(i, itemId, quantity)) {
          return true;
        }
      }
    }
    addCombatLog(`Inventory full! ${item ? item.name : itemId} lost!`, 'system');
    return false;
  }

  GameState.inventory.push({ itemId, quantity, item: ITEMS[itemId] });
  return true;
}

function addToBag(bagIndex, itemId, quantity) {
  if (!GameState.bags || !GameState.bags[bagIndex]) return false;
  const bag = ITEMS[GameState.bags[bagIndex]];
  if (!bag) return false;
  if (!GameState.bagContents) GameState.bagContents = [{}, {}, {}, {}];
  const contents = GameState.bagContents[bagIndex];

  // Find existing stack
  for (const slot of Object.keys(contents)) {
    if (contents[slot] && contents[slot].itemId === itemId) {
      contents[slot].quantity += quantity;
      return true;
    }
  }
  // Find empty slot
  for (let slotIndex = 0; slotIndex < bag.capacity; slotIndex++) {
    if (!contents[slotIndex]) {
      contents[slotIndex] = { itemId, quantity };
      return true;
    }
  }
  return false; // Bag full
}

function addToBank(itemId, quantity) {
  if (!GameState.bank) GameState.bank = [];
  const existing = GameState.bank.find(s => s && s.itemId === itemId);
  if (existing) {
    existing.quantity += quantity;
    return true;
  }
  if (GameState.bank.filter(Boolean).length >= 100) return false;
  GameState.bank.push({ itemId, quantity });
  return true;
}

function depositAllToBank() {
  if (!GameState.inventory) return;
  const keep = [];
  let depositedCount = 0;
  for (const stack of GameState.inventory) {
    if (!stack) continue;
    const item = ITEMS[stack.itemId];
    if (item && item.nodrop) {
      keep.push(stack);
    } else {
      const success = addToBank(stack.itemId, stack.quantity);
      if (!success) {
        keep.push(stack);
      } else {
        depositedCount++;
        if (typeof addCombatLog === 'function') {
          addCombatLog(`Deposited ${item ? item.name : stack.itemId} to bank.`, 'loot');
        }
      }
    }
  }
  GameState.inventory = keep;
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
  if (typeof renderCityTabContent === 'function') renderCityTabContent('bank');
}

function tickManaRegen(party) {
  for (const member of party) {
    if (!member.isAlive || member.maxMana === 0) continue;
    const regenRate = Math.floor(member.level * 0.5 + 1);
    member.mana = Math.min(member.maxMana, member.mana + regenRate);
  }
}

if (typeof module !== 'undefined') module.exports = { startCombat, combatTick, selectEnemy, stopCombat, addToInventory, addToBag, addToBank, depositAllToBank, tickManaRegen, handlePartyWipe };
