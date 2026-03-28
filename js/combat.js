/* globals GameState, CLASSES, ITEMS, ENEMIES, ZONES,
   getMaxHP, getMaxMana, getAC, getMeleeDamage, getCritChance, getMissChance,
   applyACMitigation, computeDerivedStats, gainXP,
   getPartyTank, getLowestHPMember, getHealerInParty,
   applyStatusEffect, tickStatusEffects, isStunned, isMezzed, isSlowed,
   rollLoot, addCombatLog, addLoot, showDamageNumber, getSprite,
   updateCombatUI, updatePartyUI, updateInventoryUI, updateKillCountUI,
   showLevelUpEffect,
   trySkillGain, hasSkill, SKILL_DISPLAY_NAMES,
   addThreat, getCurrentTarget, tickAbilityCasts, interruptCast,
   dispatchAbilityEffect, selectAbilityForMember,
   tickPets, summonPet, commandPetAttack, buffPet,
   startGroupCombat, tryCallForHelp, makeLiveEnemy, rollWeightedGroup,
   xpForLevel, xpToNextLevel, MAX_LEVEL */

const MAX_CARRY_SLOTS = 30;

// Maximum number of enemies allowed in a single encounter
const MAX_ENCOUNTER_ENEMIES = 3;

/**
 * Creates a live enemy object from a template ID.
 * @param {string} enemyId
 * @returns {object|null}
 */
function makeLiveEnemy(enemyId) {
  const template = ENEMIES[enemyId];
  if (!template) return null;
  return {
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
    dots: [],
    debuffs: {},
    stunUntil: 0,
    mezzedUntil: 0,
    fearedUntil: 0,
    hasCalledForHelp: false,
    enraged: false,
    hasFled: false,
  };
}

/**
 * Selects a group from a weighted groups array.
 * @param {Array<{members: string[], weight: number}>} groups
 * @returns {object|null}
 */
function rollWeightedGroup(groups) {
  const totalWeight = groups.reduce((sum, g) => sum + (g.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const group of groups) {
    roll -= (group.weight || 1);
    if (roll <= 0) return group;
  }
  return groups[groups.length - 1];
}

function startCombat(enemyId) {
  const template = ENEMIES[enemyId];
  if (!template) {
    console.error(`startCombat: unknown enemyId "${enemyId}"`);
    return;
  }

  // Check for group spawn based on zone data
  const zoneData = ZONES && GameState.zone ? ZONES[GameState.zone] : null;
  if (
    zoneData &&
    zoneData.groups &&
    zoneData.groupSpawnChance &&
    Math.random() < zoneData.groupSpawnChance
  ) {
    const group = rollWeightedGroup(zoneData.groups);
    if (group && group.members && group.members.length > 0) {
      startGroupCombat(group.members);
      return;
    }
  }

  const liveEnemy = makeLiveEnemy(enemyId);
  GameState.enemies = [liveEnemy];
  GameState.currentEnemy = liveEnemy;
  GameState.combatActive = true;
  GameState.inCombat = true;
  GameState.threatTable = {};
  GameState._lastHPRegenTick = Date.now();
  GameState._lastBuffDecayTick = Date.now();

  // Reset per-character swing timers for the new encounter
  if (GameState.party) {
    for (const member of GameState.party) {
      member.nextSwingAt = 0;
    }
  }

  if (GameState.isSitting) {
    GameState.isSitting = false;
    addCombatLog('You stand up as combat begins!', 'system');
  }

  addCombatLog(`--- ${template.name} engages! ---`, 'system');

  if (typeof updateCombatUI === 'function') updateCombatUI();
}

/**
 * Starts combat with multiple enemies simultaneously (group spawn).
 * @param {string[]} enemyIds - Array of enemy IDs to enter combat together
 */
function startGroupCombat(enemyIds) {
  const liveEnemies = enemyIds
    .slice(0, MAX_ENCOUNTER_ENEMIES)
    .map(id => makeLiveEnemy(id))
    .filter(Boolean);
  if (liveEnemies.length === 0) return;

  GameState.enemies = liveEnemies;
  GameState.currentEnemy = liveEnemies[0];
  GameState.combatActive = true;
  GameState.inCombat = true;
  GameState.threatTable = {};
  GameState._lastHPRegenTick = Date.now();
  GameState._lastBuffDecayTick = Date.now();

  // Reset per-character swing timers for the new encounter
  if (GameState.party) {
    for (const member of GameState.party) {
      member.nextSwingAt = 0;
    }
  }

  if (GameState.isSitting) {
    GameState.isSitting = false;
    addCombatLog('You stand up as combat begins!', 'system');
  }

  const names = liveEnemies.map(e => e.name).join(', ');
  addCombatLog(`You are ambushed by a group: ${names}!`, 'system');

  if (typeof updateCombatUI === 'function') updateCombatUI();
}

/**
 * Attempts to trigger a call-for-help on an enemy that was just attacked.
 * Only fires once per enemy (guarded by hasCalledForHelp flag).
 * @param {object} enemy - Live enemy object
 */
function tryCallForHelp(enemy) {
  if (enemy.hasCalledForHelp) return;
  const template = ENEMIES[enemy.id];
  if (!template || !template.callsForHelp) return;

  const { chance, addIds } = template.callsForHelp;
  if (!addIds || addIds.length === 0) return;
  if (Math.random() >= chance) return;

  // Cap total active enemies
  if ((GameState.enemies || []).length >= MAX_ENCOUNTER_ENEMIES) {
    enemy.hasCalledForHelp = true;
    return;
  }

  // Pick a valid add (must exist in ENEMIES)
  const validAdds = addIds.filter(id => ENEMIES[id]);
  if (validAdds.length === 0) return;

  const addId = validAdds[Math.floor(Math.random() * validAdds.length)];
  const add = makeLiveEnemy(addId);
  if (!add) return;

  enemy.hasCalledForHelp = true;
  GameState.enemies = GameState.enemies || [];
  GameState.enemies.push(add);

  const msg = enemy.id === 'gnoll_watcher'
    ? `A gnoll watcher lets out a piercing howl! Reinforcements arrive!`
    : `${enemy.name} calls for help! ${add.name} joins the fight!`;
  addCombatLog(msg, 'system');
}

function selectEnemy(enemyId) {
  GameState.selectedEnemyId = enemyId;
  startCombat(enemyId);
}

/**
 * Attempts to pull an add from the zone when a fleeing enemy calls for help.
 * @param {object} fleeingEnemy - Live enemy object that is fleeing
 */
function tryPullAdd(fleeingEnemy) {
  if (!GameState.enemies || GameState.enemies.length >= MAX_ENCOUNTER_ENEMIES) return;

  const zone = ZONES && GameState.zone ? ZONES[GameState.zone] : null;
  if (!zone) return;

  const activeIds = new Set(GameState.enemies.map(e => e.id));
  const candidates = (zone.commonEnemies || []).filter(id => !activeIds.has(id));
  if (candidates.length === 0) return;

  const fleeingTemplate = ENEMIES[fleeingEnemy.id];
  const sameType = fleeingTemplate
    ? candidates.filter(id => {
        const t = ENEMIES[id];
        return t && t.type === fleeingTemplate.type;
      })
    : [];

  const poolToUse = sameType.length > 0 ? sameType : candidates;
  const addId = poolToUse[Math.floor(Math.random() * poolToUse.length)];
  if (!addId) return;

  if (Math.random() < 0.4) {
    const add = makeLiveEnemy(addId);
    if (!add) return;
    GameState.enemies.push(add);
    addCombatLog(`${fleeingEnemy.name}'s cries bring ${add.name} rushing to help!`, 'system');
    if (typeof updateCombatUI === 'function') updateCombatUI();
  }
}

function stopCombat() {
  GameState.combatActive = false;
  GameState.inCombat = false;
  GameState.enemies = [];
  GameState.currentEnemy = null;
  GameState.selectedEnemyId = null;
  addCombatLog('Combat stopped.', 'system');
  if (typeof updateCombatUI === 'function') updateCombatUI();
}

function combatTick() {
  // Always tick regen regardless of combat state
  if (GameState.party && GameState.party.length > 0) {
    tickManaRegen(GameState.party);
    tickHPRegen(GameState.party);
  }

  if (!GameState.combatActive) {
    if (typeof updatePartyUI === 'function') updatePartyUI();
    return;
  }
  if (!GameState.enemies || GameState.enemies.length === 0) return;

  const party = GameState.party;

  // Threat decay: reduce all threats by 1% per tick
  if (GameState.threatTable) {
    for (const id in GameState.threatTable) {
      GameState.threatTable[id] = Math.max(0, GameState.threatTable[id] * 0.99);
    }
  }

  const livingMembers = party.filter(m => m.isAlive);
  if (livingMembers.length === 0) {
    handlePartyWipe();
    return;
  }

  // Apply bard song auras each tick
  tickBardSongs();

  // Resolve in-flight ability casts (target primary enemy)
  const primaryEnemy = GameState.enemies[0];
  tickAbilityCasts(livingMembers, primaryEnemy);

  // Tick enemy DoTs
  const now = Date.now();
  for (const enemy of GameState.enemies.slice()) {
    if (enemy.dots && enemy.dots.length > 0) {
      enemy.dots = enemy.dots.filter(dot => dot.endTime > now);
      for (const dot of enemy.dots) {
        if (now >= dot.nextTick) {
          enemy.hp = Math.max(0, enemy.hp - dot.damage);
          addCombatLog(`${enemy.name} takes ${dot.damage} damage from a spell effect.`, 'poison');
          dot.nextTick = now + dot.tickInterval;
        }
      }
    }
  }

  // Handle any deaths from DoTs
  for (const dead of GameState.enemies.filter(e => e.hp <= 0)) {
    handleEnemyDeath(dead);
    if (!GameState.combatActive) return;
  }
  if (!GameState.enemies || GameState.enemies.length === 0) return;

  // Party member attacks: each member targets the lowest-HP living enemy
  for (const member of livingMembers) {
    if (!GameState.combatActive) return;
    const liveEnemies = (GameState.enemies || []).filter(e => e.hp > 0);
    if (liveEnemies.length === 0) break;

    if (!isStunned(member) && !isMezzed(member)) {
      const target = liveEnemies.reduce((a, b) => a.hp <= b.hp ? a : b);
      memberAttack(member, target);
      // Pass the same target to ability selection so damage abilities hit the same enemy
      selectAbilityForMember(member, target, party);
      // Trigger call-for-help on the attacked enemy (if still alive)
      if (target.hp > 0) tryCallForHelp(target);
    }
  }

  // Handle any deaths from party attacks
  for (const dead of (GameState.enemies || []).filter(e => e.hp <= 0)) {
    handleEnemyDeath(dead);
    if (!GameState.combatActive) return;
  }
  if (!GameState.enemies || GameState.enemies.length === 0) return;

  // Enrage check: enemies below 20% HP enrage if their template has enrages: true
  for (const enemy of GameState.enemies) {
    if (enemy.hp > 0 && !enemy.enraged && (enemy.hp / enemy.maxHP) < 0.2) {
      const template = ENEMIES[enemy.id];
      if (template && template.enrages) {
        enemy.enraged = true;
        enemy.atk = Math.floor(enemy.atk * 1.5);
        addCombatLog(`${enemy.name} ENRAGES!`, 'system');
      }
    }
  }

  // Flee check: enemies below 15% HP may attempt to flee and call for help
  for (const enemy of GameState.enemies) {
    if (enemy.hp > 0 && !enemy.hasFled && (enemy.hp / enemy.maxHP) < 0.15) {
      enemy.hasFled = true;
      if (Math.random() < 0.6) {
        enemy.fearedUntil = Date.now() + 8000;
        addCombatLog(`${enemy.name} attempts to flee!`, 'system');
        tryPullAdd(enemy);
      }
    }
  }

  const healer = getHealerInParty(party);
  if (healer && healer.isAlive && healer.mana > 0) {
    performHeal(healer, party);
  }

  if (typeof tickPets === 'function') tickPets(GameState.enemies[0]);

  // Handle any deaths from ability effects / pets
  for (const dead of (GameState.enemies || []).filter(e => e.hp <= 0)) {
    handleEnemyDeath(dead);
    if (!GameState.combatActive) return;
  }
  if (!GameState.enemies || GameState.enemies.length === 0) return;

  // Each living enemy attacks the highest-threat party member
  const nowAtk = Date.now();
  for (const enemy of GameState.enemies.slice()) {
    if (enemy.hp <= 0) continue;
    if (enemy.stunUntil && nowAtk < enemy.stunUntil) {
      addCombatLog(`${enemy.name} is stunned and cannot attack!`, 'system');
    } else if (enemy.mezzedUntil && nowAtk < enemy.mezzedUntil) {
      addCombatLog(`${enemy.name} is mesmerized!`, 'system');
    } else if (enemy.fearedUntil && nowAtk < enemy.fearedUntil) {
      addCombatLog(`${enemy.name} flees in terror!`, 'system');
    } else {
      const template = ENEMIES[enemy.id];
      if (template && template.aoeAttack) {
        // AoE: announce the first time this enemy sweeps
        if (!enemy.hasAnnouncedAoe) {
          enemy.hasAnnouncedAoe = true;
          addCombatLog(`${enemy.name} unleashes a sweeping attack!`, 'system');
        }
        const primaryTarget = getCurrentTarget(party);
        if (primaryTarget && primaryTarget.isAlive) {
          enemyAttack(enemy, primaryTarget, party);
        }
        const splashTargets = party.filter(m => m.isAlive && m !== primaryTarget);
        for (const splashTarget of splashTargets) {
          enemyAttackAoe(enemy, splashTarget, party, 0.6);
        }
      } else {
        const target = getCurrentTarget(party);
        if (target && target.isAlive) {
          enemyAttack(enemy, target, party);
        }
      }
    }
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
  const now = Date.now();
  if (member.nextSwingAt && now < member.nextSwingAt) return; // not ready to swing yet

  const weaponId = member.equipment ? member.equipment.primary : null;
  const weapon = weaponId && ITEMS[weaponId] ? ITEMS[weaponId] : { dmg: 2, delay: 28, name: 'Fists' };

  // Set swing timer (applies even on a miss)
  const delayMs = (weapon.delay || 28) * 100 * (isSlowed(member) ? 2 : 1);
  member.nextSwingAt = now + delayMs;

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

  // Check for active buff_damage on the member (e.g. Berserker's Berserk)
  const damageBuff = member.statusEffectMap && member.statusEffectMap['buff_damage'];
  if (damageBuff && Date.now() < damageBuff.endTime) {
    damage = Math.floor(damage * (1 + (damageBuff.value || 0) / 100));
  }

  // Check for active buff_attack (e.g. Bard's Anthem de Arms — % ATK bonus)
  const attackBuff = (member.statusEffects || []).find(e => e.type === 'buff_attack' && Date.now() < e.endTime);
  if (attackBuff) {
    damage = Math.floor(damage * (1 + (attackBuff.value || 0) / 100));
  }

  damage = applyACMitigation(damage, { currentAC: enemy.ac, AGI: enemy.ac * 3, statBonuses: {} });
  damage = Math.max(1, damage);

  enemy.hp = Math.max(0, enemy.hp - damage);

  const logType = isCrit ? 'crit' : 'hit';
  const critText = isCrit ? ' **CRITICAL HIT!**' : '';
  addCombatLog(`${member.name} hits ${enemy.name} for ${damage} damage!${critText}`, logType);
  showDamageNumber(damage, null, isCrit);

  // Generate threat from melee damage
  if (typeof addThreat === 'function') addThreat(member, damage);

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

  // Dual wield second swing
  if (
    typeof hasSkill === 'function' && hasSkill(member, 'dualWield') &&
    member.equipment && member.equipment.secondary &&
    ITEMS[member.equipment.secondary]
  ) {
    // ~63% proc rate at max skill (252/400)
    const dualChance = (member.skills['dualWield'] || 0) / 400;
    if (Math.random() < dualChance) {
      const offhandWeapon = ITEMS[member.equipment.secondary];
      let dmgOff = Math.floor(getMeleeDamage(member, offhandWeapon) * 0.5);
      // Apply active damage buff to offhand as well
      if (damageBuff && Date.now() < damageBuff.endTime) {
        dmgOff = Math.floor(dmgOff * (1 + (damageBuff.value || 0) / 100));
      }
      dmgOff = applyACMitigation(dmgOff, { currentAC: enemy.ac, AGI: enemy.ac * 3, statBonuses: {} });
      dmgOff = Math.max(1, dmgOff);
      enemy.hp = Math.max(0, enemy.hp - dmgOff);
      addCombatLog(`${member.name} hits ${enemy.name} with offhand for ${dmgOff}!`, 'hit');
      if (typeof addThreat === 'function') addThreat(member, dmgOff);
      if (typeof trySkillGain === 'function') trySkillGain(member, 'dualWield');
    }
  }
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

  const effectiveAtk = Math.max(1, enemy.atk - (enemy.debuffs && enemy.debuffs.STR ? Math.floor(enemy.debuffs.STR / 5) : 0));
  let rawDamage = Math.max(1, effectiveAtk + Math.floor(Math.random() * (effectiveAtk * 0.5)));

  // Check for active debuff_atk on the enemy (e.g. Bard's Angstlich's Appalling Screech)
  const atkDebuff = (enemy.statusEffects || []).find(e => e.type === 'debuff_atk' && Date.now() < e.endTime);
  if (atkDebuff) {
    rawDamage = Math.floor(rawDamage * (1 - (atkDebuff.value || 0) / 100));
  }

  let damage = Math.max(1, rawDamage);
  damage = applyACMitigation(damage, target);

  // Check for active buff_ac on the target (e.g. Warrior's Defense Discipline)
  // A value of 20 AC buff → 10% damage reduction (value / 200)
  const acBuff = target.statusEffectMap && target.statusEffectMap['buff_ac'];
  if (acBuff && Date.now() < acBuff.endTime) {
    damage = Math.max(1, Math.floor(damage * (1 - (acBuff.value || 0) / 200)));
  }

  damage = Math.max(1, damage);

  // Check if target is invulnerable
  const invulnEffect = target.statusEffectMap && target.statusEffectMap['invulnerable'];
  if (invulnEffect && Date.now() < invulnEffect.endTime) {
    addCombatLog(`${target.name} is invulnerable!`, 'miss');
    return;
  }

  // Enemy crit check
  const enemyCritChance = Math.min(0.08, 0.03 + (enemy.level - 1) * 0.005);
  const enemyIsCrit = Math.random() < enemyCritChance;
  if (enemyIsCrit) damage = Math.floor(damage * 2);

  target.hp = Math.max(0, target.hp - damage);

  const critSuffix = enemyIsCrit ? ' **CRITICAL HIT!**' : '';
  addCombatLog(`${enemy.name} hits ${target.name} for ${damage} damage!${critSuffix}`, enemyIsCrit ? 'crit' : 'enemy');
  showDamageNumber(damage, target, enemyIsCrit);

  // Interrupt casting if the target is a caster mid-cast
  if (target.isCasting) {
    const channelingSkill = target.skills ? (target.skills['channeling'] || 0) : 0;
    const interruptResist = channelingSkill / 300; // max ~84% at 252 skill
    if (Math.random() > interruptResist) {
      interruptCast(target);
    }
  }

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

  // Roll enemy status procs
  if (enemy.statusProcs && enemy.statusProcs.length > 0) {
    for (const proc of enemy.statusProcs) {
      if (Math.random() < (proc.chance || 0)) {
        // Check target's resist for this proc type
        const resistValue = target.statBonuses && target.statBonuses.resists
          ? (target.statBonuses.resists[proc.type] || 0)
          : 0;
        if (resistValue > 0 && Math.random() * 100 < resistValue) {
          addCombatLog(`${target.name} resists the ${proc.type}!`, 'miss');
          continue;
        }
        applyStatusEffect(target, {
          type: proc.type,
          damage: proc.damage || 0,
          duration: proc.duration || 10000,
          endTime: Date.now() + (proc.duration || 10000),
          tickInterval: proc.tickInterval || 3000,
          nextTick: Date.now() + (proc.tickInterval || 3000),
        });
        addCombatLog(`${target.name} is afflicted with ${proc.type} from ${enemy.name}!`, 'poison');
      }
    }
  }
}

function enemyAttackAoe(enemy, target, party, multiplier) {
  // AoE splash: no dodge/parry/riposte, reduced damage
  const missChance = getMissChance({ DEX: 75, statBonuses: {} }, target);
  if (Math.random() < missChance * 0.5) return; // halved miss chance for AoE

  // Check if target is invulnerable
  const invulnEffect = target.statusEffectMap && target.statusEffectMap['invulnerable'];
  if (invulnEffect && Date.now() < invulnEffect.endTime) {
    addCombatLog(`${target.name} is invulnerable!`, 'miss');
    return;
  }

  const effectiveAtk = Math.max(1, enemy.atk - (enemy.debuffs && enemy.debuffs.STR ? Math.floor(enemy.debuffs.STR / 5) : 0));
  let damage = Math.max(1, Math.floor((effectiveAtk + Math.floor(Math.random() * (effectiveAtk * 0.5))) * (multiplier || 0.6)));
  damage = applyACMitigation(damage, target);
  damage = Math.max(1, damage);

  target.hp = Math.max(0, target.hp - damage);
  addCombatLog(`${enemy.name}'s attack splashes ${target.name} for ${damage} damage!`, 'enemy');
  showDamageNumber(damage, target, false);

  if (typeof trySkillGain === 'function') trySkillGain(target, 'defense');

  if (target.hp <= 0) {
    target.isAlive = false;
    addCombatLog(`${target.name} has DIED!`, 'death');
    ensureMonsterLogEntry(enemy.id).deaths++;
    if (!party.some(m => m.isAlive)) {
      setTimeout(handlePartyWipe, 500);
    }
  }

  // Status procs still apply on AoE splash (halved proc chance)
  if (enemy.statusProcs && enemy.statusProcs.length > 0) {
    for (const proc of enemy.statusProcs) {
      if (Math.random() < (proc.chance || 0) * 0.5) {
        const resistValue = target.statBonuses && target.statBonuses.resists
          ? (target.statBonuses.resists[proc.type] || 0)
          : 0;
        if (resistValue > 0 && Math.random() * 100 < resistValue) {
          addCombatLog(`${target.name} resists the ${proc.type}!`, 'miss');
          continue;
        }
        applyStatusEffect(target, {
          type: proc.type,
          damage: proc.damage || 0,
          duration: proc.duration || 10000,
          endTime: Date.now() + (proc.duration || 10000),
          tickInterval: proc.tickInterval || 3000,
          nextTick: Date.now() + (proc.tickInterval || 3000),
        });
        addCombatLog(`${target.name} is afflicted with ${proc.type} from ${enemy.name}'s AoE!`, 'poison');
      }
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
  // Remove from active enemies array first
  GameState.enemies = (GameState.enemies || []).filter(e => e !== enemy);
  GameState.currentEnemy = GameState.enemies[0] || null;

  const remaining = GameState.enemies.length;
  if (remaining > 0) {
    addCombatLog(
      `${enemy.name} has been slain! ${remaining} ${remaining === 1 ? 'enemy' : 'enemies'} remain.`,
      'death'
    );
  } else {
    addCombatLog(`${enemy.name} has been slain!`, 'death');
  }

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

  if (remaining > 0) {
    // More enemies remain — keep combat active, just update UI
    if (typeof updateCombatUI === 'function') updateCombatUI();
    if (typeof updatePartyUI === 'function') updatePartyUI();
    if (typeof updateInventoryUI === 'function') updateInventoryUI();
    if (typeof updateKillCountUI === 'function') updateKillCountUI();
    return;
  }

  // All enemies are dead — end the encounter
  GameState.combatActive = false;
  GameState.inCombat = false;

  if (GameState.camp && GameState.camp.zoneId === GameState.zone && GameState.camp.enemyId === GameState.selectedEnemyId) {
    setTimeout(() => {
      if (GameState.camp && GameState.selectedEnemyId) {
        addCombatLog(`Your camp respawns — ${ENEMIES[GameState.selectedEnemyId] ? ENEMIES[GameState.selectedEnemyId].name : GameState.selectedEnemyId} returns.`, 'system');
        startCombat(GameState.selectedEnemyId);
        if (typeof updateCombatUI === 'function') updateCombatUI();
      }
    }, 1500); // faster camp respawn
  } else if (GameState.selectedEnemyId) {
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
  GameState.inCombat = false;
  GameState.enemies = [];
  GameState.currentEnemy = null;

  // XP penalty: lose 7% of current level's XP progress, cannot de-level
  for (const member of GameState.party) {
    if (typeof xpForLevel === 'function' && typeof xpToNextLevel === 'function') {
      const levelBase = xpForLevel(member.level);
      const levelRange = xpToNextLevel(member.level);
      const penalty = Math.floor(levelRange * 0.07);
      const newXP = Math.max(levelBase, member.xp - penalty);
      const lost = member.xp - newXP;
      member.xp = newXP;
      if (lost > 0) {
        addCombatLog(`${member.name} loses ${lost} experience points.`, 'death');
      }
    }
  }

  setTimeout(() => {
    for (const member of GameState.party) {
      member.isAlive = true;
      member.hp = Math.max(1, Math.floor(member.maxHP * 0.1));
      member.mana = Math.max(0, Math.floor(member.maxMana * 0.1));
      member.statusEffects = [];
      if (member.statusEffectMap) member.statusEffectMap = {};
      member.castingAbility = null;
      member.isCasting = false;
      member.nextSwingAt = 0;
    }
    addCombatLog('Party recovers... ready to fight again.', 'system');
    if (typeof updateCombatUI === 'function') updateCombatUI();
    if (typeof updatePartyUI === 'function') updatePartyUI();
  }, 5000);
}

// ── System 3: Threat Table ────────────────────────────────────────────────────

function addThreat(member, amount) {
  if (!GameState.threatTable) GameState.threatTable = {};
  GameState.threatTable[member.id] = (GameState.threatTable[member.id] || 0) + amount;
}

function getCurrentTarget(party) {
  const living = party.filter(m => m.isAlive);
  if (living.length === 0) return null;
  if (!GameState.threatTable || Object.keys(GameState.threatTable).length === 0) {
    return getPartyTank(party) || living[0];
  }
  let best = null;
  let bestThreat = -1;
  for (const member of living) {
    const threat = GameState.threatTable[member.id] || 0;
    if (threat > bestThreat) {
      bestThreat = threat;
      best = member;
    }
  }
  return best || getPartyTank(party) || living[0];
}

// ── System 1: Ability Cast Pipeline ──────────────────────────────────────────

function tickAbilityCasts(party, enemy) {
  const now = Date.now();
  for (const member of party) {
    if (!member.isAlive || !member.isCasting || !member.castingAbility) continue;
    if (now >= member.castingAbility.castEndTime) {
      // Fizzle check — only for abilities with cast time > 0 (instant casts skip this)
      const channelingSkill = (member.skills && member.skills['channeling']) || 0;
      // 35% fizzle at skill 0, reaches 0% at skill ~252 (0.35 - 252/720 ≈ 0)
      const fizzleChance = Math.max(0, 0.35 - channelingSkill / 720);
      // Only fizzle spell-type abilities (not melee/utility instants)
      const ability = member.castingAbility.ability;
      const isMagicAbility = ability.effect && [
        'damage', 'damage_aoe', 'damage_undead', 'heal', 'heal_pet', 'dot',
        'lifetap', 'mez', 'stun', 'fear', 'aoe_fear', 'debuff', 'buff',
        'turn_undead', 'invulnerability'
      ].includes(ability.effect.type);

      if (isMagicAbility && Math.random() < fizzleChance) {
        // Fizzle — cast fails, mana already spent
        addCombatLog(`${member.name}'s ${ability.name} fizzles!`, 'miss');
        member.abilityCooldowns[ability.name] = now + 2000; // 2 s short cooldown on fizzle
        member.castingAbility = null;
        member.isCasting = false;
        // Still gain channeling skill on fizzle (you learn from failure)
        if (typeof trySkillGain === 'function') trySkillGain(member, 'channeling');
        continue;
      }

      // Cast completed — dispatch effect
      dispatchAbilityEffect(member, ability, enemy, GameState.party);
      member.abilityCooldowns[ability.name] =
        now + (ability.recastTime || 0);
      member.castingAbility = null;
      member.isCasting = false;
    }
    // If still casting, do nothing else for this member this tick
  }
}

function interruptCast(member) {
  if (!member.isCasting) return;
  addCombatLog(`${member.name}'s cast is interrupted!`, 'system');
  member.castingAbility = null;
  member.isCasting = false;
}

function dispatchAbilityEffect(caster, ability, enemy, party) {
  const effect = ability.effect;
  if (!effect) return;

  switch (effect.type) {
    // ── Damage ──────────────────────────────────
    case 'damage': {
      if (!enemy) break;
      let dmg = effect.value || 0;
      const resistPct = (enemy.magicResist || 0) / 100;
      dmg = Math.max(1, Math.floor(dmg * (1 - resistPct)));
      if (caster.skills) {
        const spellSkill = caster.skills['evocation'] || caster.skills['conjuration'] || 0;
        dmg = Math.floor(dmg * (1 + spellSkill / 1000));
      }
      enemy.hp = Math.max(0, enemy.hp - dmg);
      addCombatLog(`${caster.name} hits ${enemy.name} for ${dmg} magic damage!`, 'spell');
      if (typeof addThreat === 'function') addThreat(caster, dmg * 1.5);
      if (typeof trySkillGain === 'function') {
        trySkillGain(caster, 'evocation');
        trySkillGain(caster, 'channeling');
      }
      break;
    }

    case 'damage_aoe': {
      if (!enemy) break;
      let dmg = effect.value || 0;
      const resistPct = (enemy.magicResist || 0) / 100;
      dmg = Math.max(1, Math.floor(dmg * (1 - resistPct)));
      enemy.hp = Math.max(0, enemy.hp - dmg);
      addCombatLog(`${caster.name} detonates an AoE for ${dmg} damage on ${enemy.name}!`, 'spell');
      if (typeof addThreat === 'function') addThreat(caster, dmg);
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'evocation');
      break;
    }

    case 'damage_undead': {
      if (!enemy) break;
      if (!enemy.isUndead) {
        addCombatLog(`${caster.name}'s holy strike has no effect on the living.`, 'system');
        break;
      }
      const dmg = Math.max(1, effect.value || 0);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      addCombatLog(`${caster.name} smites ${enemy.name} with holy light for ${dmg}!`, 'spell');
      if (typeof addThreat === 'function') addThreat(caster, dmg);
      break;
    }

    // ── Healing ──────────────────────────────────
    case 'heal':
    case 'heal_pet': {
      const healTarget = getLowestHPMember(party) || caster;
      if (!healTarget || !healTarget.isAlive) break;
      const healAmt = Math.min(effect.value || 0, Math.max(0, healTarget.maxHP - healTarget.hp));
      healTarget.hp = Math.min(healTarget.maxHP, healTarget.hp + healAmt);
      addCombatLog(`${caster.name} heals ${healTarget.name} for ${healAmt} HP.`, 'heal');
      // Healing generates aggro
      if (typeof addThreat === 'function') addThreat(caster, healAmt * 0.5);
      if (typeof trySkillGain === 'function') {
        trySkillGain(caster, 'alteration');
        trySkillGain(caster, 'channeling');
      }
      break;
    }

    // ── Lifetap ──────────────────────────────────
    case 'lifetap': {
      if (!enemy) break;
      const resistPct = (enemy.magicResist || 0) / 100;
      let dmg = Math.max(1, Math.floor((effect.value || 0) * (1 - resistPct)));
      enemy.hp = Math.max(0, enemy.hp - dmg);
      caster.hp = Math.min(caster.maxHP, caster.hp + dmg);
      addCombatLog(`${caster.name} lifetaps ${enemy.name} for ${dmg}!`, 'spell');
      if (typeof addThreat === 'function') addThreat(caster, dmg);
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'alteration');
      break;
    }

    // ── Buff ─────────────────────────────────────
    case 'buff': {
      const stat = effect.stat;
      const value = effect.value || 0;
      const dur = effect.duration || 60000;
      const buffTarget = (stat === 'damage' || stat === 'ac' || stat === 'attack' || stat === 'attack_speed')
        ? caster
        : (getLowestHPMember(party) || caster);
      applyStatusEffect(buffTarget, { type: 'buff_' + stat, value, endTime: Date.now() + dur });
      addCombatLog(`${caster.name} gains ${ability.name}!`, 'buff');
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'abjuration');
      break;
    }

    // ── Debuff ───────────────────────────────────
    case 'debuff': {
      if (!enemy) break;
      const stat = effect.stat;
      const value = effect.value || 0;
      enemy.debuffs = enemy.debuffs || {};
      enemy.debuffs[stat] = (enemy.debuffs[stat] || 0) + value;
      addCombatLog(`${caster.name} weakens ${enemy.name} (${stat} -${value})!`, 'debuff');
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'alteration');
      break;
    }

    // ── Stun ─────────────────────────────────────
    case 'stun': {
      if (!enemy) break;
      const dur = effect.duration || 3000;
      enemy.stunUntil = Date.now() + dur;
      addCombatLog(`${caster.name} stuns ${enemy.name}!`, 'spell');
      break;
    }

    // ── Fear ─────────────────────────────────────
    case 'fear':
    case 'aoe_fear': {
      if (!enemy) break;
      const dur = effect.duration || 10000;
      enemy.fearedUntil = Date.now() + dur;
      addCombatLog(`${enemy.name} flees in terror from ${caster.name}!`, 'spell');
      break;
    }

    // ── Taunt ────────────────────────────────────
    case 'taunt': {
      if (!enemy || typeof addThreat !== 'function') break;
      const maxThreat = Math.max(...Object.values(GameState.threatTable || {}), 0);
      GameState.threatTable = GameState.threatTable || {};
      GameState.threatTable[caster.id] = maxThreat + 500;
      addCombatLog(`${caster.name} taunts ${enemy.name}!`, 'system');
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'taunt');
      break;
    }

    // ── Mez ──────────────────────────────────────
    case 'mez': {
      if (!enemy) break;
      const dur = effect.duration || 20000;
      enemy.mezzedUntil = Date.now() + dur;
      addCombatLog(`${caster.name} mesmerizes ${enemy.name}!`, 'spell');
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'alteration');
      break;
    }

    // ── DoT ───────────────────────────────────────
    case 'dot': {
      if (!enemy) break;
      // Check enemy magic resist
      const magicResistPct = (enemy.magicResist || 0) / 100;
      if (magicResistPct > 0 && Math.random() < magicResistPct) {
        addCombatLog(`${enemy.name} resists the spell!`, 'miss');
        break;
      }
      enemy.dots = enemy.dots || [];
      enemy.dots.push({
        damage: effect.dot || effect.value || 5,
        endTime: Date.now() + 30000,
        tickInterval: 3000,
        nextTick: Date.now() + 3000,
      });
      addCombatLog(`${caster.name} afflicts ${enemy.name} with a damage-over-time effect!`, 'poison');
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'alteration');
      break;
    }

    // ── Invulnerability ──────────────────────────
    case 'invulnerability': {
      applyStatusEffect(caster, { type: 'invulnerable', endTime: Date.now() + (effect.duration || 8000) });
      addCombatLog(`${caster.name} becomes invulnerable!`, 'buff');
      if (typeof trySkillGain === 'function') trySkillGain(caster, 'abjuration');
      break;
    }

    // ── Turn Undead ──────────────────────────────
    case 'turn_undead': {
      if (!enemy) break;
      if (!enemy.isUndead) {
        addCombatLog(`${caster.name}'s holy power has no effect on the living.`, 'system');
        break;
      }
      const dmg = effect.value || Math.floor(caster.level * 4);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      addCombatLog(`${caster.name} turns ${enemy.name} with holy light for ${dmg} damage!`, 'spell');
      if (typeof addThreat === 'function') addThreat(caster, dmg);
      if (typeof trySkillGain === 'function') {
        trySkillGain(caster, 'alteration');
        trySkillGain(caster, 'abjuration');
      }
      break;
    }

    // ── Resurrect ────────────────────────────────
    case 'resurrect': {
      const deadMember = party.find(m => !m.isAlive);
      if (!deadMember) {
        addCombatLog(`${caster.name}'s resurrection finds no fallen ally.`, 'system');
        break;
      }
      deadMember.isAlive = true;
      deadMember.hp = Math.max(1, Math.floor(deadMember.maxHP * 0.2));
      deadMember.mana = Math.max(0, Math.floor(deadMember.maxMana * 0.1));
      deadMember.statusEffects = [];
      if (deadMember.statusEffectMap) deadMember.statusEffectMap = {};
      deadMember.castingAbility = null;
      deadMember.isCasting = false;
      addCombatLog(`${caster.name} resurrects ${deadMember.name}! They return with 20% HP.`, 'heal');
      if (typeof addThreat === 'function') addThreat(caster, 500);
      if (typeof trySkillGain === 'function') {
        trySkillGain(caster, 'alteration');
        trySkillGain(caster, 'channeling');
      }
      if (typeof updatePartyUI === 'function') updatePartyUI();
      break;
    }

    // ── Pet commands ─────────────────────────────
    case 'summon_pet':
      if (typeof summonPet === 'function') summonPet(caster);
      break;

    case 'pet_attack':
      if (typeof commandPetAttack === 'function') commandPetAttack(caster, enemy);
      break;

    case 'pet_buff':
      if (typeof buffPet === 'function') buffPet(caster, effect);
      break;

    // ── Utility ───────────────────────────────────
    default:
      addCombatLog(`${caster.name} uses ${ability.name}.`, 'spell');
      break;
  }
}

function selectAbilityForMember(member, enemy, party) {
  if (member.isCasting) return; // already casting
  const cls = CLASSES[member.classId];
  if (!cls || !cls.abilities) return;
  const now = Date.now();

  // Gather candidate abilities: usable, off cooldown, mana available
  const candidates = cls.abilities.filter(ab => {
    if (member.abilityCooldowns[ab.name] && now < member.abilityCooldowns[ab.name]) return false;
    if ((ab.manaCost || 0) > (member.mana || 0)) return false;
    if (!enemy && ab.effect && ['damage', 'damage_aoe', 'damage_undead', 'stun', 'fear', 'aoe_fear', 'mez', 'dot', 'lifetap', 'taunt'].includes(ab.effect.type)) return false;
    return true;
  });

  if (candidates.length === 0) return;

  // Priority: heal if party is hurting, then damage/debuff, then buffs/utility
  let chosen = null;
  const lowestHP = getLowestHPMember(party);
  const partyHurt = lowestHP && (lowestHP.hp / lowestHP.maxHP) < 0.6;

  // Healers: prioritize rez if someone is dead, then heal if hurt
  if (['cleric', 'druid', 'shaman', 'paladin', 'beastlord'].includes(member.classId)) {
    const hasDead = party.some(m => !m.isAlive);
    if (hasDead) {
      chosen = candidates.find(ab => ab.effect && ab.effect.type === 'resurrect');
    }
    if (!chosen && partyHurt) {
      chosen = candidates.find(ab => ab.effect && (ab.effect.type === 'heal' || ab.effect.type === 'heal_pet'));
    }
  }

  // Casters prioritize damage
  if (!chosen && enemy && ['wizard', 'magician', 'necromancer', 'enchanter'].includes(member.classId)) {
    chosen = candidates.find(ab => ab.effect && ['damage', 'damage_aoe', 'lifetap', 'dot'].includes(ab.effect.type));
  }

  // Hybrids: use damage if enemy alive, heal if party hurt
  if (!chosen && enemy) {
    chosen = candidates.find(ab => ab.effect && ['damage', 'damage_undead', 'lifetap', 'stun', 'fear', 'aoe_fear', 'taunt'].includes(ab.effect.type));
  }

  // Fallback: any usable ability
  if (!chosen) chosen = candidates[0];
  if (!chosen) return;

  // Deduct mana immediately
  member.mana = Math.max(0, (member.mana || 0) - (chosen.manaCost || 0));

  if ((chosen.castTime || 0) <= 0) {
    // Instant cast
    dispatchAbilityEffect(member, chosen, enemy, party);
    member.abilityCooldowns[chosen.name] = now + (chosen.recastTime || 0);
  } else {
    // Begin cast
    member.isCasting = true;
    member.castingAbility = {
      ability: chosen,
      castEndTime: now + chosen.castTime,
      targetType: chosen.effect ? chosen.effect.type : 'none',
    };
    addCombatLog(`${member.name} begins casting ${chosen.name}...`, 'spell');
  }
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
  const sitting = !GameState.inCombat && GameState.isSitting;
  for (const member of party) {
    if (!member.isAlive || member.maxMana === 0) continue;
    let regenRate;
    if (sitting) {
      const meditationSkill = (member.skills && member.skills['meditation']) || 0;
      regenRate = Math.floor(3 + member.level * 0.5 + meditationSkill / 25);
      if (typeof trySkillGain === 'function') trySkillGain(member, 'meditation');
    } else if (!GameState.inCombat) {
      regenRate = Math.floor(member.level * 0.5 + 2);
    } else {
      regenRate = Math.floor(member.level * 0.5 + 1);
    }
    member.mana = Math.min(member.maxMana, member.mana + regenRate);
  }
}

function tickHPRegen(party) {
  const sitting = !GameState.inCombat && GameState.isSitting;
  for (const member of party) {
    if (!member.isAlive) continue;
    if (member.hp >= member.maxHP) continue;

    let regenRate;
    const sta = member.STA || 0;

    if (sitting) {
      // Sitting out of combat: generous regen
      regenRate = Math.floor(2 + sta / 20 + member.level * 0.3);
    } else if (!GameState.inCombat) {
      // Standing out of combat: moderate regen
      regenRate = Math.floor(1 + sta / 40 + member.level * 0.15);
    } else {
      // In combat: very slow STA-based tick
      regenRate = Math.floor(sta / 60);
    }

    if (regenRate > 0) {
      member.hp = Math.min(member.maxHP, member.hp + regenRate);
    }
  }
}

function sitDown() {
  if (GameState.inCombat) return;
  GameState.isSitting = true;
  addCombatLog('You sit down to meditate.', 'system');
  if (typeof updateCombatUI === 'function') updateCombatUI();
}

/**
 * Makes the player character stand up and updates the UI state.
 */
function standUp() {
  GameState.isSitting = false;
  if (typeof updateCombatUI === 'function') updateCombatUI();
}

/**
 * Pull System — sends the fastest party member out to pull the selected enemy.
 * Has a chance to drag in an add (~25% base, reduced for skilled pullers).
 */
function pullEnemy() {
  if (GameState.combatActive || !GameState.selectedEnemyId) return;

  // Find the puller: prefer Rogue/Ranger/Monk, else highest DEX
  const living = GameState.party.filter(m => m && m.isAlive);
  const preferredPullers = living.filter(m => ['rogue', 'ranger', 'monk'].includes(m.classId));
  const puller = preferredPullers.length > 0
    ? preferredPullers.reduce((a, b) => (b.DEX || 0) > (a.DEX || 0) ? b : a)
    : living.reduce((a, b) => (b.DEX || 0) > (a.DEX || 0) ? b : a);

  if (!puller) return;

  const template = ENEMIES[GameState.selectedEnemyId];
  if (!template) return;

  addCombatLog(`${puller.name} heads out to pull ${template.name}...`, 'system');

  // Pull delay: 2–4 seconds (simulates travel time)
  const pullDelay = 2000 + Math.random() * 2000;

  GameState.isPulling = true;
  if (typeof updateCombatUI === 'function') updateCombatUI();

  setTimeout(() => {
    GameState.isPulling = false;

    // Check for pull add: ~25% base chance, reduced if puller is Monk/Rogue/Ranger
    const addChance = ['monk', 'rogue', 'ranger'].includes(puller.classId) ? 0.10 : 0.25;
    const pulled = [makeLiveEnemy(GameState.selectedEnemyId)].filter(Boolean);

    if (Math.random() < addChance) {
      // Pull a random common enemy from the zone as the add
      const zone = ZONES && GameState.zone ? ZONES[GameState.zone] : null;
      const pool = zone ? (zone.commonEnemies || []) : [];
      const addId = pool[Math.floor(Math.random() * pool.length)];
      if (addId && addId !== GameState.selectedEnemyId) {
        const add = makeLiveEnemy(addId);
        if (add) {
          pulled.push(add);
          addCombatLog(`${puller.name} dragged in an add: ${add.name}!`, 'system');
        }
      }
    }

    if (pulled.length === 0) {
      addCombatLog('The pull failed — no enemies found.', 'system');
      if (typeof updateCombatUI === 'function') updateCombatUI();
      return;
    }

    // Start combat with pulled enemies
    GameState.enemies = pulled.slice(0, MAX_ENCOUNTER_ENEMIES);
    GameState.currentEnemy = GameState.enemies[0];
    GameState.combatActive = true;
    GameState.inCombat = true;
    GameState.threatTable = {};
    GameState._lastHPRegenTick = Date.now();
    GameState._lastBuffDecayTick = Date.now();

    if (GameState.isSitting) {
      GameState.isSitting = false;
      addCombatLog('You stand up as combat begins!', 'system');
    }

    const names = GameState.enemies.map(e => e.name).join(', ');
    addCombatLog(`${puller.name} returns with: ${names}!`, 'system');

    if (typeof updateCombatUI === 'function') updateCombatUI();
  }, pullDelay);
}

/**
 * Camp System — set camp on the currently selected enemy type.
 * Camp respawns are faster and flagged with flavor text.
 */
function setCamp() {
  if (!GameState.selectedEnemyId) {
    addCombatLog('Select an enemy first to set camp on it.', 'system');
    return;
  }
  GameState.camp = {
    zoneId: GameState.zone,
    enemyId: GameState.selectedEnemyId,
    setAt: Date.now(),
  };
  const template = ENEMIES[GameState.selectedEnemyId];
  addCombatLog(`Camp set on ${template ? template.name : GameState.selectedEnemyId}. Enemies will respawn to your camp.`, 'system');
  if (typeof updateCombatUI === 'function') updateCombatUI();
}

/**
 * Break the current camp.
 */
function breakCamp() {
  GameState.camp = null;
  addCombatLog('Camp broken.', 'system');
  if (typeof updateCombatUI === 'function') updateCombatUI();
}

/**
 * Bard Songs — applies persistent song auras each combat tick if a Bard is in the party.
 * Songs are passive, mana-free auras that buff the whole party and debuff enemies.
 */
function tickBardSongs() {
  if (!GameState.combatActive) return;
  const bard = (GameState.party || []).find(m => m && m.isAlive && m.classId === 'bard');
  if (!bard) return;

  const party = GameState.party.filter(m => m && m.isAlive);
  const now = Date.now();
  const songDuration = 8000; // songs last 8 seconds (refreshed each tick ~2–3s, so persistent)

  // Anthem de Arms (lv 1+): party-wide ATK +5%
  if (bard.level >= 1) {
    for (const member of party) {
      applyStatusEffect(member, { type: 'buff_attack', value: 5, endTime: now + songDuration });
    }
  }

  // Chant of Battle (lv 2+): flat melee damage buff
  if (bard.level >= 2) {
    for (const member of party) {
      applyStatusEffect(member, { type: 'buff_damage', value: 3, endTime: now + songDuration });
    }
  }

  // Angstlich's Appalling Screech (lv 3+): enemy ATK debuff
  if (bard.level >= 3 && GameState.enemies) {
    for (const enemy of GameState.enemies.filter(e => e.hp > 0)) {
      applyStatusEffect(enemy, { type: 'debuff_atk', value: 10, endTime: now + songDuration });
    }
  }

  // Lyssa's Solidarity of Vision (lv 5+): party-wide AC buff
  if (bard.level >= 5) {
    for (const member of party) {
      applyStatusEffect(member, { type: 'buff_ac', value: 8, endTime: now + songDuration });
    }
  }

  // Verses of Victory (lv 8+): party-wide HP regen aura
  if (bard.level >= 8) {
    for (const member of party) {
      member.hp = Math.min(member.maxHP, member.hp + 3);
    }
  }

  // Gain singing skill on each tick
  if (typeof trySkillGain === 'function') trySkillGain(bard, 'singing');
}

if (typeof module !== 'undefined') module.exports = { startCombat, startGroupCombat, tryCallForHelp, tryPullAdd, makeLiveEnemy, rollWeightedGroup, combatTick, selectEnemy, stopCombat, addToInventory, addToBag, addToBank, depositAllToBank, tickManaRegen, tickHPRegen, handlePartyWipe, addThreat, getCurrentTarget, tickAbilityCasts, interruptCast, dispatchAbilityEffect, selectAbilityForMember, enemyAttackAoe, sitDown, standUp, pullEnemy, setCamp, breakCamp, tickBardSongs };
