// ============================================================
// FOREVER RPG — Pet System
// ============================================================

/**
 * Map of pet template IDs to base stats and owner class for summoned companions.
 * @type {object}
 */
const PET_TEMPLATES = {
  earth_elemental: {
    name: 'Earth Elemental',
    ownerClass: 'magician',
    baseHP: 60,
    baseATK: 10,
    icon: '🪨',
  },
  fire_elemental: {
    name: 'Fire Elemental',
    ownerClass: 'magician',
    baseHP: 50,
    baseATK: 14,
    icon: '🔥',
  },
  skeleton: {
    name: 'Skeleton',
    ownerClass: 'necromancer',
    baseHP: 45,
    baseATK: 8,
    icon: '💀',
  },
  zombie: {
    name: 'Zombie',
    ownerClass: 'necromancer',
    baseHP: 70,
    baseATK: 7,
    icon: '🧟',
  },
  warder: {
    name: 'Warder',
    ownerClass: 'beastlord',
    baseHP: 55,
    baseATK: 11,
    icon: '🐾',
  },
};

// Default template to use per class when no specific pet is requested
/**
 * Map of summoner class IDs to their default pet template ID.
 * @type {object}
 */
const CLASS_DEFAULT_PET = {
  magician:   'earth_elemental',
  necromancer: 'skeleton',
  beastlord:  'warder',
};

// ── Scaling helpers ──────────────────────────────────────────

/**
 * ATK increase per owner level above 1 (5% per level).
 * @type {number}
 */
const PET_ATK_SCALE_PER_LEVEL = 0.05; // 5% ATK increase per owner level above 1
/**
 * Random damage variance range added to pet attacks.
 * @type {number}
 */
const PET_DMG_VARIANCE        = 4;    // Random variance range for pet attacks

/**
 * Computes the maximum HP for a pet based on its template and the owner's level.
 * @param {object} template   - The pet template object from PET_TEMPLATES.
 * @param {number} ownerLevel - The current level of the pet's owner.
 * @returns {number} The computed maximum HP for the pet.
 */
function getPetMaxHP(template, ownerLevel) {
  // Base HP from template + 10 HP per owner level above 1
  return template.baseHP + (ownerLevel - 1) * 10;
}

// ── Core pet functions ───────────────────────────────────────

/**
 * Creates and registers a new pet for the given owner character, replacing any existing pet.
 * @param {object} owner - The character object summoning the pet.
 * @returns {object|null} The newly created pet object, or null if no template exists.
 */
function summonPet(owner) {
  if (!GameState.pets) GameState.pets = [];

  // Remove any existing pet for this owner first
  const existingIdx = GameState.pets.findIndex(p => p.ownerId === owner.id);
  if (existingIdx !== -1) GameState.pets.splice(existingIdx, 1);

  const templateId = CLASS_DEFAULT_PET[owner.classId];
  if (!templateId) return null;
  const template = PET_TEMPLATES[templateId];
  if (!template) return null;

  const maxHP = getPetMaxHP(template, owner.level);
  const atk   = Math.floor(template.baseATK * (1 + (owner.level - 1) * PET_ATK_SCALE_PER_LEVEL));

  const pet = {
    id:        `pet_${owner.id}_${Date.now()}`,
    ownerId:   owner.id,
    ownerName: owner.name,
    templateId,
    name:      template.icon + ' ' + template.name,
    maxHP,
    hp:        maxHP,
    atk,
    isAlive:   true,
  };

  GameState.pets.push(pet);

  if (typeof addCombatLog === 'function') {
    addCombatLog(`${owner.name} summons ${pet.name}! (HP: ${maxHP}, ATK: ${atk})`, 'spell');
  }
  if (typeof updatePartyUI === 'function') updatePartyUI();

  return pet;
}

/**
 * Removes the active pet belonging to the given owner from the game.
 * @param {string} ownerId - The ID of the character whose pet should be dismissed.
 * @returns {void}
 */
function dismissPet(ownerId) {
  if (!GameState.pets) return;
  const idx = GameState.pets.findIndex(p => p.ownerId === ownerId);
  if (idx === -1) return;
  const pet = GameState.pets[idx];
  GameState.pets.splice(idx, 1);
  if (typeof addCombatLog === 'function') {
    addCombatLog(`${pet.name} has been dismissed.`, 'system');
  }
  if (typeof updatePartyUI === 'function') updatePartyUI();
}

/**
 * Returns the active pet for the given owner character, or null if none exists.
 * @param {string} ownerId - The ID of the owner character.
 * @returns {object|null} The pet object or null.
 */
function getPetForOwner(ownerId) {
  if (!GameState.pets) return null;
  return GameState.pets.find(p => p.ownerId === ownerId) || null;
}

/**
 * Executes one attack from a pet against the given enemy.
 * @param {object} pet   - The attacking pet object.
 * @param {object} enemy - The enemy being attacked.
 * @returns {void}
 */
function petAttack(pet, enemy) {
  if (!pet || !pet.isAlive || !enemy) return;
  if (enemy.hp <= 0) return;

  const dmg = Math.max(1, pet.atk + Math.floor(Math.random() * PET_DMG_VARIANCE) - 1);
  enemy.hp = Math.max(0, enemy.hp - dmg);

  // DPS tracking — pets
  if (typeof GameState !== 'undefined') {
    if (!GameState.combatDPS) GameState.combatDPS = { sessionStart: null, damageByMember: {}, lastReset: null };
    GameState.combatDPS.sessionStart = GameState.combatDPS.sessionStart || Date.now();
    const petKey = `${pet.name} (${pet.ownerName})`;
    if (!GameState.combatDPS.damageByMember[petKey]) {
      GameState.combatDPS.damageByMember[petKey] = { total: 0, type: 'pet' };
    }
    GameState.combatDPS.damageByMember[petKey].total += dmg;
  }

  if (typeof addCombatLog === 'function') {
    addCombatLog(`${pet.name} attacks ${enemy.name} for ${dmg}!`, 'hit');
  }
}

/**
 * Triggers one attack from every active, living pet against the given enemy.
 * @param {object} enemy - The enemy all pets should attack.
 * @returns {void}
 */
function tickPets(enemy) {
  if (!GameState.pets || !GameState.pets.length) return;
  if (!enemy || enemy.hp <= 0) return;

  for (const pet of GameState.pets) {
    if (!pet.isAlive || pet.hp <= 0) continue;
    petAttack(pet, enemy);
  }
}

/**
 * Forces the caster's pet to perform one attack against the given enemy.
 * @param {object} caster - The character commanding their pet.
 * @param {object} enemy  - The enemy to attack.
 * @returns {void}
 */
function commandPetAttack(caster, enemy) {
  const pet = getPetForOwner(caster.id);
  if (!pet) return;
  petAttack(pet, enemy);
}

/**
 * Heals the caster's pet for the HP amount specified in the effect.
 * @param {object} caster - The character whose pet should be buffed.
 * @param {object} effect - The buff effect object containing a `value` property for HP.
 * @returns {void}
 */
function buffPet(caster, effect) {
  const pet = getPetForOwner(caster.id);
  if (!pet) return;
  const healAmt = effect.value || 0;
  if (healAmt > 0) {
    pet.hp = Math.min(pet.maxHP, pet.hp + healAmt);
    if (typeof addCombatLog === 'function') {
      addCombatLog(`${caster.name} buffs ${pet.name} for ${healAmt} HP!`, 'spell');
    }
  }
}

/**
 * Innate pet-summon ability descriptor for each summoner class.
 * Used to inject a free summon ability when the owner has no pet active,
 * regardless of whether they have purchased guild spells.
 * @type {Object.<string, object>}
 */
const INNATE_PET_ABILITY = {
  necromancer: {
    name: 'Summon Skeleton',
    manaCost: 30,
    castTime: 3000,
    recastTime: 30000,
    effect: { type: 'summon_pet' },
    description: 'Summon a skeletal servant to fight by your side.',
  },
  magician: {
    name: 'Summon Elemental',
    manaCost: 30,
    castTime: 3000,
    recastTime: 30000,
    effect: { type: 'summon_pet' },
    description: 'Summon an earth elemental to fight by your side.',
  },
  beastlord: {
    name: 'Call Warder',
    manaCost: 20,
    castTime: 2000,
    recastTime: 30000,
    effect: { type: 'summon_pet' },
    description: 'Call your spirit warder to your side.',
  },
};

if (typeof module !== 'undefined') {
  module.exports = { PET_TEMPLATES, CLASS_DEFAULT_PET, INNATE_PET_ABILITY, getPetMaxHP, summonPet, dismissPet, getPetForOwner, petAttack, tickPets, commandPetAttack, buffPet };
}
