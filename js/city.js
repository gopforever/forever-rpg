// city.js — Qeynos city data and logic for Forever RPG

// ─── Guild Data ───────────────────────────────────────────────────────────────

/**
 * Map of class ID to guild info for each playable class in Qeynos.
 * @type {object}
 */
const GUILDS = {
  warrior:      { name: 'Warriors of the Shield',   npc: 'Sergeant Darius Gandros', location: 'North Qeynos' },
  paladin:      { name: 'The Protectors of Pine',   npc: 'High Priest Nondank',     location: 'North Qeynos' },
  ranger:       { name: 'Rangers of the Farfield',  npc: 'Warden Nindric Laset',    location: 'North Qeynos' },
  rogue:        { name: 'The Qeynos Rogues',        npc: 'Hanlore Escaval',         location: 'South Qeynos' },
  bard:         { name: 'The Qeynos Bards',         npc: 'Lyris Moonwhisper',       location: 'North Qeynos' },
  monk:         { name: 'The Ashen Order',           npc: 'Master Tarn',             location: 'South Qeynos' },
  wizard:       { name: 'The Concordance',           npc: 'Mage Weith',              location: 'The Mage Tower' },
  magician:     { name: 'The Concordance',           npc: 'Vahlara the Summoner',    location: 'The Mage Tower' },
  enchanter:    { name: 'The Concordance',           npc: 'Jilea Windspell',         location: 'The Mage Tower' },
  necromancer:  { name: 'The Bloodsabers',           npc: 'Renux Herkanor',          location: 'Qeynos Sewers' },
  shadowknight: { name: 'The Bloodsabers',           npc: 'Renux Herkanor',          location: 'Qeynos Sewers' },
  cleric:       { name: 'Temple of Life',            npc: 'High Priestess Arynna',   location: 'North Qeynos' },
  druid:        { name: 'The Jaggedpine Treefolk',   npc: 'Sylvan Mosswick',         location: 'South Qeynos' },
  shaman:       { name: 'None (visit Halas)',         npc: null,                      location: null },
  beastlord:    { name: 'None (visit Shar Vahl)',    npc: null,                      location: null },
  berserker:    { name: 'None (visit Halas)',         npc: null,                      location: null },
};

// ─── City Vendor Inventory ────────────────────────────────────────────────────

/**
 * Array of vendor-sold items with buy prices.
 * @type {Array<object>}
 */
const CITY_VENDORS = [
  { itemId: 'cloth_cap',     buyPrice: 10  },
  { itemId: 'cloth_tunic',   buyPrice: 18  },
  { itemId: 'cloth_pants',   buyPrice: 15  },
  { itemId: 'simple_boots',  buyPrice: 12  },
  { itemId: 'short_sword',   buyPrice: 60  },
  { itemId: 'dagger',        buyPrice: 40  },
  { itemId: 'crude_mace',    buyPrice: 50  },
  { itemId: 'gnarled_staff', buyPrice: 45  },
  { itemId: 'crude_staff',   buyPrice: 35  },
  { itemId: 'small_shield',  buyPrice: 55  },
  { itemId: 'bread_loaf',    buyPrice: 3   },
];

// ─── Guild Spells ─────────────────────────────────────────────────────────────

/**
 * Array of purchasable spells organized by class, level, and effect.
 * @type {Array<object>}
 */
const GUILD_SPELLS = [
  // Cleric
  { id: 'spell_minor_healing',   name: 'Minor Healing',             classId: 'cleric',       level: 1,  manaCost: 10, effect: { healAmount: 30  }, buyPrice: 500  },
  { id: 'spell_light_healing',   name: 'Light Healing',             classId: 'cleric',       level: 5,  manaCost: 20, effect: { healAmount: 80  }, buyPrice: 1500 },
  { id: 'spell_healing',         name: 'Healing',                   classId: 'cleric',       level: 9,  manaCost: 40, effect: { healAmount: 150 }, buyPrice: 3500 },
  // Druid
  { id: 'spell_burst_of_flame',  name: 'Burst of Flame',            classId: 'druid',        level: 1,  manaCost: 10, effect: { dmg: 15         }, buyPrice: 500  },
  { id: 'spell_skin_like_wood',  name: 'Skin like Wood',            classId: 'druid',        level: 5,  manaCost: 20, effect: { ac: 12          }, buyPrice: 1500 },
  { id: 'spell_regeneration',    name: 'Regeneration',              classId: 'druid',        level: 9,  manaCost: 30, effect: { hpRegen: 5      }, buyPrice: 3500 },
  // Shaman
  { id: 'spell_burst_flame_sh',  name: 'Burst of Flame',            classId: 'shaman',       level: 1,  manaCost: 10, effect: { dmg: 15         }, buyPrice: 500  },
  { id: 'spell_talisman_tnarg',  name: 'Talisman of Tnarg',         classId: 'shaman',       level: 5,  manaCost: 25, effect: { healAmount: 100 }, buyPrice: 1500 },
  { id: 'spell_malo',            name: 'Malo',                      classId: 'shaman',       level: 9,  manaCost: 35, effect: { debuff: 'malo'  }, buyPrice: 3500 },
  // Wizard
  { id: 'spell_burst_flame_wz',  name: 'Burst of Flame',            classId: 'wizard',       level: 1,  manaCost: 10, effect: { dmg: 20         }, buyPrice: 500  },
  { id: 'spell_shock_of_ice',    name: 'Shock of Ice',              classId: 'wizard',       level: 5,  manaCost: 25, effect: { dmg: 55         }, buyPrice: 1500 },
  { id: 'spell_lava_bolt',       name: 'Lava Bolt',                 classId: 'wizard',       level: 9,  manaCost: 50, effect: { dmg: 110        }, buyPrice: 3500 },
  // Magician
  { id: 'spell_burst_flame_mg',  name: 'Burst of Flame',            classId: 'magician',     level: 1,  manaCost: 10, effect: { dmg: 20         }, buyPrice: 500  },
  { id: 'spell_summon_food',     name: 'Summon Food',               classId: 'magician',     level: 1,  manaCost: 10, effect: { summon: 'food'  }, buyPrice: 500  },
  { id: 'spell_monster_summon',  name: 'Monster Summoning I',       classId: 'magician',     level: 5,  manaCost: 40, effect: { summon: 'pet'   }, buyPrice: 2000 },
  // Enchanter
  { id: 'spell_mesmerize',       name: 'Mesmerize',                 classId: 'enchanter',    level: 1,  manaCost: 15, effect: { mez: true       }, buyPrice: 500  },
  { id: 'spell_breeze',          name: 'Breeze',                    classId: 'enchanter',    level: 5,  manaCost: 20, effect: { manaRegen: 3    }, buyPrice: 1500 },
  { id: 'spell_clarity',         name: 'Clarity',                   classId: 'enchanter',    level: 9,  manaCost: 30, effect: { manaRegen: 7    }, buyPrice: 3500 },
  // Necromancer
  { id: 'spell_lifetap',         name: 'Lifetap',                   classId: 'necromancer',  level: 1,  manaCost: 15, effect: { dmg: 18, heal: 18 }, buyPrice: 500  },
  { id: 'spell_fear',            name: 'Fear',                      classId: 'necromancer',  level: 5,  manaCost: 25, effect: { fear: true      }, buyPrice: 1500 },
  { id: 'spell_plague',          name: 'Plague',                    classId: 'necromancer',  level: 9,  manaCost: 40, effect: { dot: 15         }, buyPrice: 3500 },
  // Paladin
  { id: 'spell_minor_heal_pal',  name: 'Minor Healing',             classId: 'paladin',      level: 1,  manaCost: 10, effect: { healAmount: 25  }, buyPrice: 500  },
  { id: 'spell_flash_of_light',  name: 'Flash of Light',            classId: 'paladin',      level: 5,  manaCost: 20, effect: { stun: true      }, buyPrice: 1500 },
  // Shadow Knight
  { id: 'spell_fear_sk',         name: 'Fear',                      classId: 'shadowknight', level: 5,  manaCost: 25, effect: { fear: true      }, buyPrice: 1500 },
  { id: 'spell_lifetap_sk',      name: 'Lifetap',                   classId: 'shadowknight', level: 1,  manaCost: 15, effect: { dmg: 18, heal: 18 }, buyPrice: 500  },
  // Bard
  { id: 'spell_anthem_de_arms',  name: 'Anthem de Arms',            classId: 'bard',         level: 1,  manaCost: 0,  effect: { atkBuff: 5      }, buyPrice: 500  },
  { id: 'spell_lyssa_solidarity',name: "Lyssa's Solidarity of Vision", classId: 'bard',      level: 5,  manaCost: 0,  effect: { acBuff: 8       }, buyPrice: 1500 },
  // Ranger
  { id: 'spell_burst_flame_rng', name: 'Burst of Flame',            classId: 'ranger',       level: 1,  manaCost: 10, effect: { dmg: 15         }, buyPrice: 500  },
  { id: 'spell_snare',           name: 'Snare',                     classId: 'ranger',       level: 5,  manaCost: 20, effect: { snare: true     }, buyPrice: 1500 },
  // Beastlord
  { id: 'spell_minor_heal_bst',  name: 'Minor Healing',             classId: 'beastlord',    level: 1,  manaCost: 10, effect: { healAmount: 25  }, buyPrice: 500  },
  { id: 'spell_burst_flame_bst', name: 'Burst of Flame',            classId: 'beastlord',    level: 1,  manaCost: 10, effect: { dmg: 15         }, buyPrice: 500  },

  // ─── High-Level Spells (Level 45–55) ─────────────────────────────────────

  // Cleric — level 45-55
  { id: 'spell_divine_aura',        name: 'Divine Aura',           classId: 'cleric',       level: 45, manaCost: 180, effect: { healAmount: 800  }, buyPrice: 85000  },
  { id: 'spell_complete_heal',      name: 'Complete Heal',         classId: 'cleric',       level: 50, manaCost: 300, effect: { healAmount: 2000 }, buyPrice: 150000 },
  { id: 'spell_celestial_healing',  name: 'Celestial Healing',     classId: 'cleric',       level: 55, manaCost: 400, effect: { healAmount: 3000 }, buyPrice: 250000 },

  // Druid — level 45-55
  { id: 'spell_nature_walker',      name: 'Nature Walker\'s Behest', classId: 'druid',      level: 45, manaCost: 160, effect: { dmg: 380        }, buyPrice: 80000  },
  { id: 'spell_storm_strike',       name: 'Storm Strike',          classId: 'druid',        level: 50, manaCost: 250, effect: { dmg: 600        }, buyPrice: 140000 },
  { id: 'spell_superior_regen',     name: 'Superior Regeneration', classId: 'druid',        level: 55, manaCost: 350, effect: { hpRegen: 22     }, buyPrice: 220000 },

  // Shaman — level 45-55
  { id: 'spell_cannibalize_iv',     name: 'Cannibalize IV',        classId: 'shaman',       level: 45, manaCost: 0,   effect: { manaRegen: 12   }, buyPrice: 80000  },
  { id: 'spell_avatar',             name: 'Avatar',                classId: 'shaman',       level: 50, manaCost: 280, effect: { atkBuff: 80     }, buyPrice: 145000 },
  { id: 'spell_torpor',             name: 'Torpor',                classId: 'shaman',       level: 55, manaCost: 400, effect: { healAmount: 1500 }, buyPrice: 240000 },

  // Wizard — level 45-55
  { id: 'spell_sunstrike',          name: 'Sunstrike',             classId: 'wizard',       level: 45, manaCost: 195, effect: { dmg: 720        }, buyPrice: 90000  },
  { id: 'spell_ice_comet',          name: 'Ice Comet',             classId: 'wizard',       level: 50, manaCost: 290, effect: { dmg: 1100       }, buyPrice: 160000 },
  { id: 'spell_time_stop',          name: 'Time Stop',             classId: 'wizard',       level: 55, manaCost: 400, effect: { stun: true      }, buyPrice: 250000 },

  // Magician — level 45-55
  { id: 'spell_elemental_simulacrum', name: 'Elemental Simulacrum', classId: 'magician',    level: 45, manaCost: 200, effect: { summon: 'pet'   }, buyPrice: 90000  },
  { id: 'spell_monster_summon_iii', name: 'Monster Summoning III', classId: 'magician',     level: 50, manaCost: 300, effect: { summon: 'pet'   }, buyPrice: 160000 },
  { id: 'spell_dagger_of_symbols',  name: 'Dagger of Symbols',    classId: 'magician',     level: 55, manaCost: 380, effect: { dmg: 850        }, buyPrice: 240000 },

  // Enchanter — level 45-55
  { id: 'spell_beguile',            name: 'Beguile',               classId: 'enchanter',    level: 45, manaCost: 170, effect: { mez: true       }, buyPrice: 85000  },
  { id: 'spell_clarity_ii',         name: 'Clarity II',            classId: 'enchanter',    level: 50, manaCost: 200, effect: { manaRegen: 15   }, buyPrice: 150000 },
  { id: 'spell_rune_v',             name: 'Rune V',                classId: 'enchanter',    level: 55, manaCost: 350, effect: { ac: 120         }, buyPrice: 240000 },

  // Necromancer — level 45-55
  { id: 'spell_death_peace',        name: 'Death Peace',           classId: 'necromancer',  level: 45, manaCost: 160, effect: { mez: true       }, buyPrice: 85000  },
  { id: 'spell_lich',               name: 'Lich',                  classId: 'necromancer',  level: 50, manaCost: 0,   effect: { manaRegen: 20   }, buyPrice: 150000 },
  { id: 'spell_quivering_veil',     name: 'Quivering Veil of Xarn', classId: 'necromancer', level: 55, manaCost: 400, effect: { dot: 180        }, buyPrice: 250000 },

  // Paladin — level 45-55
  { id: 'spell_holy_might',         name: 'Holy Might',            classId: 'paladin',      level: 45, manaCost: 160, effect: { dmg: 400        }, buyPrice: 85000  },
  { id: 'spell_symbol_of_marr',     name: 'Symbol of Marr',        classId: 'paladin',      level: 50, manaCost: 250, effect: { healAmount: 900 }, buyPrice: 150000 },
  { id: 'spell_supernal_remedy',    name: 'Supernal Remedy',       classId: 'paladin',      level: 55, manaCost: 350, effect: { healAmount: 1600 }, buyPrice: 240000 },

  // Shadow Knight — level 45-55
  { id: 'spell_leech',              name: 'Leech',                 classId: 'shadowknight', level: 45, manaCost: 160, effect: { dmg: 380, heal: 380 }, buyPrice: 85000  },
  { id: 'spell_bond_of_death',      name: 'Bond of Death',         classId: 'shadowknight', level: 50, manaCost: 260, effect: { dot: 120        }, buyPrice: 150000 },
  { id: 'spell_dread_gaze',         name: 'Dread Gaze',            classId: 'shadowknight', level: 55, manaCost: 380, effect: { fear: true      }, buyPrice: 240000 },
];

// ─── Coin Formatting ──────────────────────────────────────────────────────────

/**
 * Converts a copper integer amount to a formatted coin string like "2g 3s 5c".
 * @param {number} copper - Total amount in copper pieces.
 * @returns {string} Formatted coin string.
 */
function formatCoins(copper) {
  if (!copper || copper <= 0) return '0c';
  const gold   = Math.floor(copper / 1000);
  const silver = Math.floor((copper % 1000) / 100);
  const cop    = copper % 100;
  const parts  = [];
  if (gold   > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (cop    > 0) parts.push(`${cop}c`);
  return parts.join(' ') || '0c';
}

// ─── City Logic Functions ─────────────────────────────────────────────────────

/**
 * Returns the guild object for the given class ID, or null if none exists.
 * @param {string} classId - The class identifier (e.g. 'warrior', 'cleric').
 * @returns {object|null} Guild info object or null.
 */
function getGuildForClass(classId) {
  return GUILDS[classId] || null;
}

/**
 * Returns spells available to a class at or below the given level.
 * @param {string} classId - The class identifier.
 * @param {number} level   - The character's current level.
 * @returns {Array<object>} Filtered array of matching spell objects.
 */
function getAvailableSpells(classId, level) {
  return GUILD_SPELLS.filter(s => s.classId === classId && s.level <= level);
}

/**
 * Returns the party's total wealth expressed in copper from GameState gold/silver/copper.
 * @returns {number} Total copper value.
 */
function getTotalCopper() {
  return ((GameState.gold || 0) * 1000) + ((GameState.silver || 0) * 100) + (GameState.copper || 0);
}

/**
 * Deducts the given copper amount from GameState, redistributing across gold/silver/copper.
 * @param {number} amount - Amount in copper to deduct.
 * @returns {boolean} True if the deduction succeeded, false if insufficient funds.
 */
function deductCopper(amount) {
  let total = getTotalCopper() - amount;
  if (total < 0) return false;
  GameState.gold   = Math.floor(total / 1000);
  total %= 1000;
  GameState.silver = Math.floor(total / 100);
  GameState.copper = total % 100;
  return true;
}

/**
 * Purchases a spell from the guild and adds it to the learned spells list.
 * @param {string} spellId - The ID of the spell to purchase.
 * @returns {boolean} True if the purchase succeeded, false otherwise.
 */
function buySpell(spellId) {
  const spell = GUILD_SPELLS.find(s => s.id === spellId);
  if (!spell) { addCombatLog('Unknown spell.', 'system'); return false; }

  GameState.learnedSpells = GameState.learnedSpells || [];
  if (GameState.learnedSpells.includes(spellId)) {
    addCombatLog(`You already know ${spell.name}.`, 'system');
    return false;
  }

  const char = GameState.party[GameState.inspectedCharIndex || 0];
  if (!char || char.classId !== spell.classId) {
    addCombatLog(`Your character cannot learn ${spell.name}.`, 'system');
    return false;
  }
  if (char.level < spell.level) {
    addCombatLog(`You need to be level ${spell.level} to learn ${spell.name}.`, 'system');
    return false;
  }

  if (!deductCopper(spell.buyPrice)) {
    addCombatLog(`Not enough coin to buy ${spell.name} (${formatCoins(spell.buyPrice)}).`, 'system');
    return false;
  }

  GameState.learnedSpells.push(spellId);
  addCombatLog(`You learned ${spell.name}!`, 'levelup');
  if (typeof renderTopBar === 'function') renderTopBar();
  // Achievement hook
  if (typeof checkAchievements === 'function') checkAchievements('spell_buy', {});
  return true;
}

/**
 * Purchases an item from the city vendor and adds it to the party inventory.
 * @param {string} itemId - The ID of the item to purchase.
 * @returns {boolean} True if the purchase succeeded, false otherwise.
 */
function buyFromVendor(itemId) {
  const entry = CITY_VENDORS.find(v => v.itemId === itemId);
  if (!entry) { addCombatLog('Item not available.', 'system'); return false; }

  const item = typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
  if (!item) { addCombatLog('Unknown item.', 'system'); return false; }

  if (!deductCopper(entry.buyPrice)) {
    addCombatLog(`Not enough coin to buy ${item.name} (${formatCoins(entry.buyPrice)}).`, 'system');
    return false;
  }

  if (typeof addToInventory === 'function') {
    addToInventory(itemId, 1);
  }
  addCombatLog(`You purchased ${item.name}.`, 'loot');
  if (typeof renderTopBar === 'function') renderTopBar();
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
  return true;
}

/**
 * Sells a quantity of an item from the party inventory to the vendor.
 * @param {string} itemId   - The ID of the item to sell.
 * @param {number} quantity - Number of items to sell.
 * @returns {boolean} True if the sale succeeded, false otherwise.
 */
function sellToVendor(itemId, quantity) {
  quantity = quantity || 1;

  const vendorEntry = CITY_VENDORS.find(v => v.itemId === itemId);
  const item = typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;

  // Only allow selling items that have a buy price reference; unknown items get 1c each
  const basePrice = vendorEntry ? vendorEntry.buyPrice : 2;
  const sellPrice = Math.max(1, Math.floor(basePrice * 0.5)) * quantity;

  if (!item) { addCombatLog('Unknown item.', 'system'); return false; }
  if (item.nodrop) { addCombatLog(`${item.name} is no-drop and cannot be sold.`, 'system'); return false; }

  // Remove from inventory
  if (!GameState.inventory) { addCombatLog('Nothing to sell.', 'system'); return false; }
  const stack = GameState.inventory.find(s => s && s.itemId === itemId);
  if (!stack || stack.quantity < quantity) {
    addCombatLog(`You don't have enough ${item.name} to sell.`, 'system');
    return false;
  }
  stack.quantity -= quantity;
  if (stack.quantity <= 0) {
    const idx = GameState.inventory.indexOf(stack);
    GameState.inventory.splice(idx, 1);
  }

  // Add coin
  let total = getTotalCopper() + sellPrice;
  GameState.gold   = Math.floor(total / 1000);
  total %= 1000;
  GameState.silver = Math.floor(total / 100);
  GameState.copper = total % 100;

  addCombatLog(`Sold ${item.name} x${quantity} for ${formatCoins(sellPrice)}.`, 'loot');
  if (typeof renderTopBar === 'function') renderTopBar();
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
  return true;
}

// ─── Bank Operations ──────────────────────────────────────────────────────────

/**
 * Deposits an item from the party inventory into the bank.
 * @param {string} itemId             - The ID of the item to deposit.
 * @param {number} fromInventoryIndex - Index of the item in GameState.inventory.
 * @returns {boolean} True if the deposit succeeded, false otherwise.
 */
function depositItemToBank(itemId, fromInventoryIndex) {
  if (!GameState.inventory) return false;
  const stack = GameState.inventory[fromInventoryIndex];
  if (!stack || stack.itemId !== itemId) return false;
  const item = ITEMS[itemId];
  if (item && item.nodrop) {
    addCombatLog(`${item ? item.name : itemId} is no-drop and cannot be banked.`, 'system');
    return false;
  }
  const success = addToBank(itemId, stack.quantity);
  if (!success) {
    addCombatLog('Bank is full!', 'system');
    return false;
  }
  GameState.inventory.splice(fromInventoryIndex, 1);
  addCombatLog(`Deposited ${item ? item.name : itemId} to bank.`, 'loot');
  // Achievement hook
  if (typeof checkAchievements === 'function') {
    checkAchievements('bank_deposit', { bankSize: (GameState.bank || []).filter(Boolean).length });
  }
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
  if (typeof renderCityTabContent === 'function') renderCityTabContent('bank');
  return true;
}

/**
 * Withdraws an item from the bank into the party inventory.
 * @param {number} bankSlotIndex - Index of the bank slot to withdraw from.
 * @returns {boolean} True if the withdrawal succeeded, false otherwise.
 */
function withdrawItemFromBank(bankSlotIndex) {
  if (!GameState.bank) return false;
  const stack = GameState.bank[bankSlotIndex];
  if (!stack) return false;
  const item = ITEMS[stack.itemId];
  if (typeof addToInventory === 'function') {
    addToInventory(stack.itemId, stack.quantity);
  } else {
    if (!GameState.inventory) GameState.inventory = [];
    GameState.inventory.push({ itemId: stack.itemId, quantity: stack.quantity });
  }
  GameState.bank[bankSlotIndex] = null;
  // Compact nulls from end
  while (GameState.bank.length > 0 && GameState.bank[GameState.bank.length - 1] === null) {
    GameState.bank.pop();
  }
  addCombatLog(`Withdrew ${item ? item.name : stack.itemId} from bank.`, 'loot');
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
  if (typeof renderCityTabContent === 'function') renderCityTabContent('bank');
  return true;
}

// ─── Zone Travel ──────────────────────────────────────────────────────────────

/**
 * Moves the party to the specified zone, stopping combat and refreshing all zone UI.
 * @param {string} zoneId - The ID of the zone to travel to.
 * @returns {void}
 */
function travelToZone(zoneId) {
  const zone = typeof ZONES !== 'undefined' ? ZONES[zoneId] : null;
  if (!zone) { addCombatLog('Unknown zone.', 'system'); return; }

  // Stop combat when leaving any zone
  if (typeof stopCombat === 'function') stopCombat();
  GameState.combatActive = false;
  GameState.currentEnemy = null;
  GameState.selectedEnemyId = null;

  GameState.zone = zoneId;

  // Track visited zones
  if (!GameState.visitedZones) GameState.visitedZones = [];
  if (!GameState.visitedZones.includes(zoneId)) {
    GameState.visitedZones.push(zoneId);
  }

  // Achievement hook: zone_change
  if (typeof checkAchievements === 'function') {
    checkAchievements('zone_change', { zoneId, visitedZones: new Set(GameState.visitedZones) });
  }
  // Safe zone: reach_qeynos
  if (zone.isSafeZone && typeof checkAchievements === 'function') {
    checkAchievements('zone_change', { zoneId: 'qeynos', visitedZones: new Set(GameState.visitedZones) });
  }

  if (typeof renderZonePanel === 'function') renderZonePanel();
  if (typeof renderEnemySelector === 'function') renderEnemySelector();
  if (typeof renderCityPanel === 'function') renderCityPanel();
  if (typeof updateEnemyDisplay === 'function') updateEnemyDisplay();
  if (typeof renderTopBar === 'function') renderTopBar();

  addCombatLog(`You have entered ${zone.name}.`, 'system');
}

// ─── Module Export ────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  GUILDS, CITY_VENDORS, GUILD_SPELLS,
  formatCoins, getGuildForClass, getAvailableSpells,
  buySpell, buyFromVendor, sellToVendor, travelToZone,
  depositItemToBank, withdrawItemFromBank,
};
