// ============================================================
// FOREVER RPG — Pet System
// ============================================================

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
const CLASS_DEFAULT_PET = {
  magician:   'earth_elemental',
  necromancer: 'skeleton',
  beastlord:  'warder',
};

// ── Scaling helpers ──────────────────────────────────────────

const PET_ATK_SCALE_PER_LEVEL = 0.05; // 5% ATK increase per owner level above 1
const PET_DMG_VARIANCE        = 4;    // Random variance range for pet attacks

function getPetMaxHP(template, ownerLevel) {
  // Base HP from template + 10 HP per owner level above 1
  return template.baseHP + (ownerLevel - 1) * 10;
}

// ── Core pet functions ───────────────────────────────────────

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

function getPetForOwner(ownerId) {
  if (!GameState.pets) return null;
  return GameState.pets.find(p => p.ownerId === ownerId) || null;
}

function petAttack(pet, enemy) {
  if (!pet || !pet.isAlive || !enemy) return;
  if (enemy.hp <= 0) return;

  const dmg = Math.max(1, pet.atk + Math.floor(Math.random() * PET_DMG_VARIANCE) - 1);
  enemy.hp = Math.max(0, enemy.hp - dmg);

  if (typeof addCombatLog === 'function') {
    addCombatLog(`${pet.name} attacks ${enemy.name} for ${dmg}!`, 'hit');
  }
}

function tickPets(enemy) {
  if (!GameState.pets || !GameState.pets.length) return;
  if (!enemy || enemy.hp <= 0) return;

  for (const pet of GameState.pets) {
    if (!pet.isAlive || pet.hp <= 0) continue;
    petAttack(pet, enemy);
  }
}

function commandPetAttack(caster, enemy) {
  const pet = getPetForOwner(caster.id);
  if (!pet) return;
  petAttack(pet, enemy);
}

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

if (typeof module !== 'undefined') {
  module.exports = { PET_TEMPLATES, CLASS_DEFAULT_PET, getPetMaxHP, summonPet, dismissPet, getPetForOwner, petAttack, tickPets, commandPetAttack, buffPet };
}
