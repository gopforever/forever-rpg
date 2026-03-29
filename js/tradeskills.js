// tradeskills.js — Tradeskills core engine for Forever RPG
// Blends Melvor Idle's crafting loop with EverQuest's seven iconic disciplines.

'use strict';

// ─── Discipline Definitions ───────────────────────────────────────────────────

const TRADESKILL_DISCIPLINES = {
  blacksmithing: { name: 'Blacksmithing', icon: '⚒️', maxLevel: 200 },
  tailoring:     { name: 'Tailoring',     icon: '🧵', maxLevel: 200 },
  baking:        { name: 'Baking',        icon: '🍞', maxLevel: 200 },
  brewing:       { name: 'Brewing',       icon: '🍺', maxLevel: 200 },
  pottery:       { name: 'Pottery',       icon: '🏺', maxLevel: 200 },
  fletching:     { name: 'Fletching',     icon: '🏹', maxLevel: 200 },
  jewelcrafting: { name: 'Jewelcrafting', icon: '💍', maxLevel: 200 },
};

// ─── XP Curve ────────────────────────────────────────────────────────────────

/**
 * Returns the total XP needed to reach `level`.
 * EQ-style: level * level * 10
 * @param {number} level
 * @returns {number}
 */
function getTradeskillXpForLevel(level) {
  return Math.floor(level * level * 10);
}

// ─── Recipe Database ──────────────────────────────────────────────────────────

const TRADESKILL_RECIPES = [
  // ── Blacksmithing ──────────────────────────────────────────────────────────
  {
    id: 'bronze_sword',
    name: 'Bronze Sword',
    discipline: 'blacksmithing',
    trivialLevel: 50,
    actionTime: 5000,
    inputs: [
      { itemId: 'ts_bronze_ingot', qty: 2 },
      { itemId: 'ts_sword_mold', qty: 1 },
    ],
    output: { itemId: 'ts_bronze_sword', qty: 1 },
    skillXp: 25,
    masteryXp: 10,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A sturdy bronze blade, forged in the fires of Qeynos.',
  },
  {
    id: 'iron_breastplate',
    name: 'Iron Breastplate',
    discipline: 'blacksmithing',
    trivialLevel: 100,
    actionTime: 8000,
    inputs: [
      { itemId: 'ts_iron_ingot', qty: 4 },
      { itemId: 'ts_breastplate_mold', qty: 1 },
    ],
    output: { itemId: 'ts_iron_breastplate', qty: 1 },
    skillXp: 55,
    masteryXp: 20,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A solid iron breastplate, hammered from ore mined in the Karana hills.',
  },
  {
    id: 'steel_shield',
    name: 'Steel Shield',
    discipline: 'blacksmithing',
    trivialLevel: 130,
    actionTime: 9000,
    inputs: [
      { itemId: 'ts_steel_ingot', qty: 3 },
      { itemId: 'ts_shield_mold', qty: 1 },
    ],
    output: { itemId: 'ts_steel_shield', qty: 1 },
    skillXp: 75,
    masteryXp: 28,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A tower shield of tempered steel. Born in the forge, proven in battle.',
  },
  {
    id: 'forged_axe',
    name: 'Forged Axe',
    discipline: 'blacksmithing',
    trivialLevel: 80,
    actionTime: 6000,
    inputs: [
      { itemId: 'ts_iron_ingot', qty: 2 },
      { itemId: 'ts_wooden_handle', qty: 1 },
    ],
    output: { itemId: 'ts_forged_axe', qty: 1 },
    skillXp: 40,
    masteryXp: 15,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A hand-forged axe with a balanced iron head and solid oak handle.',
  },
  {
    id: 'chainmail_coif',
    name: 'Chainmail Coif',
    discipline: 'blacksmithing',
    trivialLevel: 115,
    actionTime: 7000,
    inputs: [
      { itemId: 'ts_iron_ingot', qty: 2 },
      { itemId: 'ts_chainmail_links', qty: 3 },
    ],
    output: { itemId: 'ts_chainmail_coif', qty: 1 },
    skillXp: 60,
    masteryXp: 22,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'Interlocked iron rings form a coif worthy of a Qeynos guard captain.',
  },

  // ── Tailoring ──────────────────────────────────────────────────────────────
  {
    id: 'leather_tunic',
    name: 'Leather Tunic',
    discipline: 'tailoring',
    trivialLevel: 40,
    actionTime: 4000,
    inputs: [
      { itemId: 'ts_rawhide', qty: 3 },
      { itemId: 'ts_thread', qty: 2 },
    ],
    output: { itemId: 'ts_leather_tunic', qty: 1 },
    skillXp: 20,
    masteryXp: 8,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A simple but sturdy leather tunic stitched from cured rawhide.',
  },
  {
    id: 'silk_robe',
    name: 'Silk Robe',
    discipline: 'tailoring',
    trivialLevel: 120,
    actionTime: 7000,
    inputs: [
      { itemId: 'ts_silk_swatch', qty: 4 },
      { itemId: 'ts_thread', qty: 3 },
    ],
    output: { itemId: 'ts_silk_robe', qty: 1 },
    skillXp: 65,
    masteryXp: 25,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'An elegant silk robe favoured by the mages and enchanters of Qeynos.',
  },
  {
    id: 'reinforced_backpack',
    name: 'Reinforced Backpack',
    discipline: 'tailoring',
    trivialLevel: 75,
    actionTime: 6000,
    inputs: [
      { itemId: 'ts_rawhide', qty: 2 },
      { itemId: 'ts_canvas', qty: 2 },
      { itemId: 'ts_thread', qty: 2 },
    ],
    output: { itemId: 'ts_reinforced_backpack', qty: 1 },
    skillXp: 38,
    masteryXp: 14,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A multi-pocket backpack reinforced with thick canvas and double stitching.',
  },
  {
    id: 'woven_belt',
    name: 'Woven Belt',
    discipline: 'tailoring',
    trivialLevel: 55,
    actionTime: 4500,
    inputs: [
      { itemId: 'ts_silk_swatch', qty: 2 },
      { itemId: 'ts_thread', qty: 1 },
    ],
    output: { itemId: 'ts_woven_belt', qty: 1 },
    skillXp: 28,
    masteryXp: 10,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A finely woven silk belt, popular among merchants who can afford style.',
  },
  {
    id: 'velvet_cloak',
    name: 'Velvet Cloak',
    discipline: 'tailoring',
    trivialLevel: 150,
    actionTime: 9000,
    inputs: [
      { itemId: 'ts_velvet_cloth', qty: 3 },
      { itemId: 'ts_silk_swatch', qty: 2 },
      { itemId: 'ts_thread', qty: 2 },
    ],
    output: { itemId: 'ts_velvet_cloak', qty: 1 },
    skillXp: 90,
    masteryXp: 35,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A deep-purple velvet cloak with a satin lining. Worn only by the most distinguished.',
  },

  // ── Baking ─────────────────────────────────────────────────────────────────
  {
    id: 'travelers_bread',
    name: "Traveler's Bread",
    discipline: 'baking',
    trivialLevel: 30,
    actionTime: 3000,
    inputs: [
      { itemId: 'ts_wheat_flour', qty: 2 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_travelers_bread', qty: 2 },
    skillXp: 15,
    masteryXp: 5,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'Dense and filling bread baked for the road. Two loaves from a single batch.',
  },
  {
    id: 'herb_biscuit',
    name: 'Herb Biscuit',
    discipline: 'baking',
    trivialLevel: 60,
    actionTime: 4000,
    inputs: [
      { itemId: 'ts_wheat_flour', qty: 1 },
      { itemId: 'ts_dried_herbs', qty: 1 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_herb_biscuit', qty: 2 },
    skillXp: 30,
    masteryXp: 12,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'Light biscuits infused with Karana herbs. A favourite of rangers and druids.',
  },
  {
    id: 'honey_cake',
    name: 'Honey Cake',
    discipline: 'baking',
    trivialLevel: 90,
    actionTime: 5000,
    inputs: [
      { itemId: 'ts_wheat_flour', qty: 2 },
      { itemId: 'ts_honey', qty: 2 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_honey_cake', qty: 1 },
    skillXp: 48,
    masteryXp: 18,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A golden honey cake baked to perfection. Sweetness from the fields of Antonica.',
  },
  {
    id: 'meat_pie',
    name: 'Meat Pie',
    discipline: 'baking',
    trivialLevel: 110,
    actionTime: 6000,
    inputs: [
      { itemId: 'ts_wheat_flour', qty: 2 },
      { itemId: 'ts_raw_meat', qty: 2 },
      { itemId: 'ts_dried_herbs', qty: 1 },
    ],
    output: { itemId: 'ts_meat_pie', qty: 1 },
    skillXp: 58,
    masteryXp: 22,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A hearty meat pie that restores vigour. Warriors swear by these before raids.',
  },
  {
    id: 'lembas_loaf',
    name: 'Lembas Loaf',
    discipline: 'baking',
    trivialLevel: 160,
    actionTime: 8000,
    inputs: [
      { itemId: 'ts_wheat_flour', qty: 3 },
      { itemId: 'ts_honey', qty: 2 },
      { itemId: 'ts_dried_herbs', qty: 2 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_lembas_loaf', qty: 1 },
    skillXp: 95,
    masteryXp: 38,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A dense, magical loaf that sustains a traveler for an entire day. Sacred recipe of the Elddar Forest.',
  },

  // ── Brewing ────────────────────────────────────────────────────────────────
  {
    id: 'short_beer',
    name: 'Short Beer',
    discipline: 'brewing',
    trivialLevel: 25,
    actionTime: 3000,
    inputs: [
      { itemId: 'ts_water_flask', qty: 1 },
      { itemId: 'ts_barley', qty: 1 },
      { itemId: 'ts_yeast', qty: 1 },
    ],
    output: { itemId: 'ts_short_beer', qty: 2 },
    skillXp: 12,
    masteryXp: 5,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A quick, frothy brew knocked back in taverns from Freeport to Halas.',
  },
  {
    id: 'mead_of_clarity',
    name: 'Mead of Clarity',
    discipline: 'brewing',
    trivialLevel: 85,
    actionTime: 5500,
    inputs: [
      { itemId: 'ts_water_flask', qty: 1 },
      { itemId: 'ts_honey', qty: 2 },
      { itemId: 'ts_yeast', qty: 1 },
    ],
    output: { itemId: 'ts_mead_clarity', qty: 1 },
    skillXp: 45,
    masteryXp: 18,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A golden mead that clears the mind. Enchanters prize this for long meditation sessions.',
  },
  {
    id: 'velious_ale',
    name: 'Velious Ale',
    discipline: 'brewing',
    trivialLevel: 120,
    actionTime: 7000,
    inputs: [
      { itemId: 'ts_water_flask', qty: 2 },
      { itemId: 'ts_barley', qty: 2 },
      { itemId: 'ts_yeast', qty: 1 },
      { itemId: 'ts_ice_crystal', qty: 1 },
    ],
    output: { itemId: 'ts_velious_ale', qty: 1 },
    skillXp: 65,
    masteryXp: 25,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A glacial ale brewed with ice crystals from Velious. Hits like a frost giant.',
  },
  {
    id: 'jumjum_juice',
    name: 'Jumjum Juice',
    discipline: 'brewing',
    trivialLevel: 55,
    actionTime: 4500,
    inputs: [
      { itemId: 'ts_water_flask', qty: 1 },
      { itemId: 'ts_jumjum', qty: 3 },
    ],
    output: { itemId: 'ts_jumjum_juice', qty: 1 },
    skillXp: 28,
    masteryXp: 10,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'Sweet, sticky jumjum pressed into a refreshing juice. A Halfling delicacy from Rivervale.',
  },
  {
    id: 'mystic_brew',
    name: 'Mystic Brew',
    discipline: 'brewing',
    trivialLevel: 175,
    actionTime: 10000,
    inputs: [
      { itemId: 'ts_water_flask', qty: 1 },
      { itemId: 'ts_honey', qty: 1 },
      { itemId: 'ts_dried_herbs', qty: 2 },
      { itemId: 'ts_yeast', qty: 1 },
      { itemId: 'ts_rune_fragment', qty: 1 },
    ],
    output: { itemId: 'ts_mystic_brew', qty: 1 },
    skillXp: 110,
    masteryXp: 45,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A shimmering brew infused with arcane runes. Said to grant brief flashes of foresight.',
  },

  // ── Pottery ────────────────────────────────────────────────────────────────
  {
    id: 'clay_vial',
    name: 'Clay Vial',
    discipline: 'pottery',
    trivialLevel: 20,
    actionTime: 3000,
    inputs: [
      { itemId: 'ts_clay', qty: 1 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_clay_vial', qty: 2 },
    skillXp: 10,
    masteryXp: 4,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A simple clay vial, essential for alchemists and potion-makers across Norrath.',
  },
  {
    id: 'deity_idol',
    name: 'Deity Idol',
    discipline: 'pottery',
    trivialLevel: 130,
    actionTime: 8000,
    inputs: [
      { itemId: 'ts_clay', qty: 3 },
      { itemId: 'ts_glaze', qty: 2 },
      { itemId: 'ts_rune_fragment', qty: 1 },
    ],
    output: { itemId: 'ts_deity_idol', qty: 1 },
    skillXp: 72,
    masteryXp: 28,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A fired clay idol bearing the sigil of a deity. Used in temple offerings and shrines.',
  },
  {
    id: 'mixing_bowl',
    name: 'Mixing Bowl',
    discipline: 'pottery',
    trivialLevel: 45,
    actionTime: 4000,
    inputs: [
      { itemId: 'ts_clay', qty: 2 },
      { itemId: 'ts_glaze', qty: 1 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_mixing_bowl', qty: 1 },
    skillXp: 22,
    masteryXp: 8,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A wide, sturdy mixing bowl used by bakers and brewers throughout the land.',
  },
  {
    id: 'rune_shard',
    name: 'Rune Shard',
    discipline: 'pottery',
    trivialLevel: 95,
    actionTime: 6000,
    inputs: [
      { itemId: 'ts_clay', qty: 2 },
      { itemId: 'ts_glaze', qty: 1 },
      { itemId: 'ts_rune_fragment', qty: 2 },
    ],
    output: { itemId: 'ts_rune_shard', qty: 1 },
    skillXp: 50,
    masteryXp: 20,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A clay shard etched with ancient runes. Mages use these as foci for minor enchantments.',
  },
  {
    id: 'kiln_fired_urn',
    name: 'Kiln-Fired Urn',
    discipline: 'pottery',
    trivialLevel: 160,
    actionTime: 9000,
    inputs: [
      { itemId: 'ts_clay', qty: 4 },
      { itemId: 'ts_glaze', qty: 3 },
      { itemId: 'ts_water_flask', qty: 1 },
    ],
    output: { itemId: 'ts_kiln_fired_urn', qty: 1 },
    skillXp: 95,
    masteryXp: 38,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A masterwork urn fired in a stone kiln. Collectors and priests alike covet these vessels.',
  },

  // ── Fletching ──────────────────────────────────────────────────────────────
  {
    id: 'oak_bow',
    name: 'Oak Bow',
    discipline: 'fletching',
    trivialLevel: 50,
    actionTime: 5000,
    inputs: [
      { itemId: 'ts_oak_wood', qty: 2 },
      { itemId: 'ts_bowstring', qty: 1 },
    ],
    output: { itemId: 'ts_oak_bow', qty: 1 },
    skillXp: 25,
    masteryXp: 10,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A simple but reliable oak bow. The first bow of many a Qeynos ranger.',
  },
  {
    id: 'wooden_arrow',
    name: 'Wooden Arrows',
    discipline: 'fletching',
    trivialLevel: 20,
    actionTime: 3000,
    inputs: [
      { itemId: 'ts_oak_wood', qty: 1 },
      { itemId: 'ts_feathers', qty: 3 },
      { itemId: 'ts_arrow_tip', qty: 5 },
    ],
    output: { itemId: 'ts_wooden_arrow', qty: 20 },
    skillXp: 10,
    masteryXp: 4,
    masteryBonuses: {
      25: { bonusYieldChance: 0.15 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A bundle of twenty wooden arrows, straight-grained and true-feathered.',
  },
  {
    id: 'compound_bow',
    name: 'Compound Bow',
    discipline: 'fletching',
    trivialLevel: 140,
    actionTime: 9000,
    inputs: [
      { itemId: 'ts_yew_wood', qty: 2 },
      { itemId: 'ts_bowstring', qty: 2 },
      { itemId: 'ts_iron_ingot', qty: 1 },
    ],
    output: { itemId: 'ts_compound_bow', qty: 1 },
    skillXp: 80,
    masteryXp: 32,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A sophisticated compound bow. Leveraged limbs give it exceptional range and power.',
  },
  {
    id: 'broadhead_arrow',
    name: 'Broadhead Arrows',
    discipline: 'fletching',
    trivialLevel: 80,
    actionTime: 4000,
    inputs: [
      { itemId: 'ts_oak_wood', qty: 1 },
      { itemId: 'ts_feathers', qty: 2 },
      { itemId: 'ts_broadhead_tip', qty: 5 },
    ],
    output: { itemId: 'ts_broadhead_arrow', qty: 20 },
    skillXp: 40,
    masteryXp: 15,
    masteryBonuses: {
      25: { bonusYieldChance: 0.15 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'Wide-cutting broadheads designed to maximise wound channels on armoured foes.',
  },
  {
    id: 'recurve_bow',
    name: 'Recurve Bow',
    discipline: 'fletching',
    trivialLevel: 110,
    actionTime: 7500,
    inputs: [
      { itemId: 'ts_yew_wood', qty: 3 },
      { itemId: 'ts_bowstring', qty: 1 },
    ],
    output: { itemId: 'ts_recurve_bow', qty: 1 },
    skillXp: 60,
    masteryXp: 24,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A curved yew bow that stores more energy in its limbs. Favoured by elven rangers.',
  },

  // ── Jewelcrafting ──────────────────────────────────────────────────────────
  {
    id: 'copper_ring',
    name: 'Copper Ring',
    discipline: 'jewelcrafting',
    trivialLevel: 25,
    actionTime: 3500,
    inputs: [
      { itemId: 'ts_copper_ingot', qty: 1 },
      { itemId: 'ts_ring_mold', qty: 1 },
    ],
    output: { itemId: 'ts_copper_ring', qty: 1 },
    skillXp: 12,
    masteryXp: 5,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A simple copper band. Common enough, but a novice jeweler must start somewhere.',
  },
  {
    id: 'silver_earring',
    name: 'Silver Earring',
    discipline: 'jewelcrafting',
    trivialLevel: 70,
    actionTime: 5000,
    inputs: [
      { itemId: 'ts_silver_ingot', qty: 1 },
      { itemId: 'ts_jewel_setting', qty: 1 },
    ],
    output: { itemId: 'ts_silver_earring', qty: 1 },
    skillXp: 35,
    masteryXp: 13,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'An elegant silver earring with an ornate clasp. Favoured by bards and rogues alike.',
  },
  {
    id: 'gold_necklace',
    name: 'Gold Necklace',
    discipline: 'jewelcrafting',
    trivialLevel: 100,
    actionTime: 6500,
    inputs: [
      { itemId: 'ts_gold_ingot', qty: 1 },
      { itemId: 'ts_jewel_setting', qty: 2 },
    ],
    output: { itemId: 'ts_gold_necklace', qty: 1 },
    skillXp: 55,
    masteryXp: 22,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A fine gold chain with an artisan clasp. Worth a small fortune in any city market.',
  },
  {
    id: 'gem_set_bracelet',
    name: 'Gem-Set Bracelet',
    discipline: 'jewelcrafting',
    trivialLevel: 150,
    actionTime: 9000,
    inputs: [
      { itemId: 'ts_silver_ingot', qty: 2 },
      { itemId: 'ts_raw_gem', qty: 2 },
      { itemId: 'ts_jewel_setting', qty: 1 },
    ],
    output: { itemId: 'ts_gem_set_bracelet', qty: 1 },
    skillXp: 88,
    masteryXp: 35,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A silver bracelet set with polished gems. A jeweler\'s masterpiece and a merchant\'s dream.',
  },
  {
    id: 'enchanted_band',
    name: 'Enchanted Band',
    discipline: 'jewelcrafting',
    trivialLevel: 180,
    actionTime: 11000,
    inputs: [
      { itemId: 'ts_gold_ingot', qty: 2 },
      { itemId: 'ts_raw_gem', qty: 2 },
      { itemId: 'ts_rune_fragment', qty: 2 },
      { itemId: 'ts_jewel_setting', qty: 1 },
    ],
    output: { itemId: 'ts_enchanted_band', qty: 1 },
    skillXp: 120,
    masteryXp: 50,
    masteryBonuses: {
      25: { bonusYieldChance: 0.05 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    description: 'A gold band pulsing with arcane energy. Enchanters\' runes are carved into its inner face.',
  },
];

// ─── Tradeskill Materials (items used only in tradeskills) ────────────────────

const TRADESKILL_MATERIALS = {
  // Blacksmithing
  ts_bronze_ingot:     { id: 'ts_bronze_ingot',     name: 'Bronze Ingot',      icon: '🪨', description: 'A bar of bronze alloy, ready for the forge.' },
  ts_iron_ingot:       { id: 'ts_iron_ingot',       name: 'Iron Ingot',        icon: '🪨', description: 'A dense iron ingot, smelted from ore.' },
  ts_steel_ingot:      { id: 'ts_steel_ingot',      name: 'Steel Ingot',       icon: '🪨', description: 'Hardened steel, alloyed for superior weapons.' },
  ts_copper_ingot:     { id: 'ts_copper_ingot',     name: 'Copper Ingot',      icon: '🪨', description: 'A soft copper ingot, ideal for jewelry.' },
  ts_silver_ingot:     { id: 'ts_silver_ingot',     name: 'Silver Ingot',      icon: '🪨', description: 'Refined silver for fine jewelry.' },
  ts_gold_ingot:       { id: 'ts_gold_ingot',       name: 'Gold Ingot',        icon: '🪨', description: 'A gleaming gold ingot, prized by jewelers.' },
  ts_sword_mold:       { id: 'ts_sword_mold',       name: 'Sword Mold',        icon: '🔩', description: 'A clay mold shaped for casting sword blades.' },
  ts_breastplate_mold: { id: 'ts_breastplate_mold', name: 'Breastplate Mold',  icon: '🔩', description: 'A mold for casting breastplate sections.' },
  ts_shield_mold:      { id: 'ts_shield_mold',      name: 'Shield Mold',       icon: '🔩', description: 'A flat mold for casting shield faces.' },
  ts_wooden_handle:    { id: 'ts_wooden_handle',    name: 'Wooden Handle',     icon: '🪵', description: 'A shaped oak handle, fitted for an axe head.' },
  ts_chainmail_links:  { id: 'ts_chainmail_links',  name: 'Chainmail Links',   icon: '⛓', description: 'Interlocked iron rings, ready for weaving.' },
  // Tailoring
  ts_rawhide:          { id: 'ts_rawhide',          name: 'Rawhide',           icon: '🧴', description: 'Untreated animal hide, stiff but workable.' },
  ts_thread:           { id: 'ts_thread',           name: 'Thread',            icon: '🧵', description: 'Strong linen thread for sewing.' },
  ts_silk_swatch:      { id: 'ts_silk_swatch',      name: 'Silk Swatch',       icon: '🧣', description: 'A smooth square of woven silk.' },
  ts_canvas:           { id: 'ts_canvas',           name: 'Canvas',            icon: '🧶', description: 'Heavy-duty canvas fabric.' },
  ts_velvet_cloth:     { id: 'ts_velvet_cloth',     name: 'Velvet Cloth',      icon: '🟣', description: 'Luxurious velvet cloth, deep purple in hue.' },
  // Baking
  ts_wheat_flour:      { id: 'ts_wheat_flour',      name: 'Wheat Flour',       icon: '🌾', description: 'Finely milled flour from Karana wheat fields.' },
  ts_water_flask:      { id: 'ts_water_flask',      name: 'Water Flask',       icon: '🧴', description: 'A flask of fresh water.' },
  ts_dried_herbs:      { id: 'ts_dried_herbs',      name: 'Dried Herbs',       icon: '🌿', description: 'Aromatic herbs dried in the sun.' },
  ts_honey:            { id: 'ts_honey',            name: 'Honey',             icon: '🍯', description: 'Sweet honey from the plains of Antonica.' },
  ts_raw_meat:         { id: 'ts_raw_meat',         name: 'Raw Meat',          icon: '🥩', description: 'Fresh cuts of meat from field hunting.' },
  // Brewing
  ts_barley:           { id: 'ts_barley',           name: 'Barley',            icon: '🌾', description: 'Malted barley grain, essential for brewing.' },
  ts_yeast:            { id: 'ts_yeast',            name: 'Yeast',             icon: '🔬', description: 'Active yeast for fermentation.' },
  ts_ice_crystal:      { id: 'ts_ice_crystal',      name: 'Ice Crystal',       icon: '❄️', description: 'A pure crystal of magical ice from Velious.' },
  ts_jumjum:           { id: 'ts_jumjum',           name: 'Jumjum',            icon: '🫐', description: 'Sweet jumjum berries from the fields of Rivervale.' },
  ts_rune_fragment:    { id: 'ts_rune_fragment',    name: 'Rune Fragment',     icon: '🔮', description: 'A shard bearing ancient arcane markings.' },
  // Pottery
  ts_clay:             { id: 'ts_clay',             name: 'Clay',              icon: '🟤', description: 'Raw clay, ready for shaping and firing.' },
  ts_glaze:            { id: 'ts_glaze',            name: 'Pottery Glaze',     icon: '🫙', description: 'A mineral glaze that hardens in the kiln.' },
  // Fletching
  ts_oak_wood:         { id: 'ts_oak_wood',         name: 'Oak Wood',          icon: '🪵', description: 'Straight-grained oak, ideal for bows and shafts.' },
  ts_yew_wood:         { id: 'ts_yew_wood',         name: 'Yew Wood',          icon: '🪵', description: 'Flexible yew wood, prized by bowyers.' },
  ts_bowstring:        { id: 'ts_bowstring',        name: 'Bowstring',         icon: '〰️', description: 'A taut bowstring made from waxed sinew.' },
  ts_feathers:         { id: 'ts_feathers',         name: 'Feathers',          icon: '🪶', description: 'Straight flight feathers for arrow fletching.' },
  ts_arrow_tip:        { id: 'ts_arrow_tip',        name: 'Arrow Tip',         icon: '🔺', description: 'A small iron arrowhead.' },
  ts_broadhead_tip:    { id: 'ts_broadhead_tip',    name: 'Broadhead Tip',     icon: '🔺', description: 'A wide cutting arrowhead for maximum damage.' },
  // Jewelcrafting
  ts_ring_mold:        { id: 'ts_ring_mold',        name: 'Ring Mold',         icon: '🔩', description: 'A small wax mold for casting rings.' },
  ts_jewel_setting:    { id: 'ts_jewel_setting',    name: 'Jewel Setting',     icon: '💠', description: 'A delicate metal setting for holding gemstones.' },
  ts_raw_gem:          { id: 'ts_raw_gem',          name: 'Raw Gem',           icon: '💎', description: 'An uncut gemstone waiting to be polished.' },
  // Crafted outputs (equipment / usables)
  ts_bronze_sword:     { id: 'ts_bronze_sword',     name: 'Bronze Sword',      icon: '⚔️', description: 'A sturdy bronze blade, forged in the fires of Qeynos.' },
  ts_iron_breastplate: { id: 'ts_iron_breastplate', name: 'Iron Breastplate',  icon: '🛡️', description: 'A solid iron breastplate, hammered from Karana ore.' },
  ts_steel_shield:     { id: 'ts_steel_shield',     name: 'Steel Shield',      icon: '🛡️', description: 'A tower shield of tempered steel.' },
  ts_forged_axe:       { id: 'ts_forged_axe',       name: 'Forged Axe',        icon: '🪓', description: 'A hand-forged axe with iron head and oak handle.' },
  ts_chainmail_coif:   { id: 'ts_chainmail_coif',   name: 'Chainmail Coif',    icon: '🪖', description: 'Interlocked iron rings forming a protective coif.' },
  ts_leather_tunic:    { id: 'ts_leather_tunic',    name: 'Leather Tunic',     icon: '👕', description: 'A sturdy leather tunic stitched from cured rawhide.' },
  ts_silk_robe:        { id: 'ts_silk_robe',        name: 'Silk Robe',         icon: '👘', description: 'An elegant silk robe favoured by mages.' },
  ts_reinforced_backpack: { id: 'ts_reinforced_backpack', name: 'Reinforced Backpack', icon: '🎒', description: 'A multi-pocket backpack with double stitching.' },
  ts_woven_belt:       { id: 'ts_woven_belt',       name: 'Woven Belt',        icon: '🔗', description: 'A finely woven silk belt.' },
  ts_velvet_cloak:     { id: 'ts_velvet_cloak',     name: 'Velvet Cloak',      icon: '🟣', description: 'A deep-purple velvet cloak with satin lining.' },
  ts_travelers_bread:  { id: 'ts_travelers_bread',  name: "Traveler's Bread",  icon: '🍞', description: 'Dense, filling bread baked for the road.' },
  ts_herb_biscuit:     { id: 'ts_herb_biscuit',     name: 'Herb Biscuit',      icon: '🥐', description: 'Light biscuits infused with Karana herbs.' },
  ts_honey_cake:       { id: 'ts_honey_cake',       name: 'Honey Cake',        icon: '🍰', description: 'A golden honey cake baked to perfection.' },
  ts_meat_pie:         { id: 'ts_meat_pie',         name: 'Meat Pie',          icon: '🥧', description: 'A hearty meat pie that restores vigour.' },
  ts_lembas_loaf:      { id: 'ts_lembas_loaf',      name: 'Lembas Loaf',       icon: '🍞', description: 'A dense magical loaf that sustains a traveler for a day.' },
  ts_short_beer:       { id: 'ts_short_beer',       name: 'Short Beer',        icon: '🍺', description: 'A quick, frothy brew knocked back in taverns.' },
  ts_mead_clarity:     { id: 'ts_mead_clarity',     name: 'Mead of Clarity',   icon: '🍯', description: 'A golden mead that clears the mind.' },
  ts_velious_ale:      { id: 'ts_velious_ale',      name: 'Velious Ale',       icon: '🍺', description: 'A glacial ale brewed with Velious ice crystals.' },
  ts_jumjum_juice:     { id: 'ts_jumjum_juice',     name: 'Jumjum Juice',      icon: '🧃', description: 'Sweet, sticky jumjum pressed into refreshing juice.' },
  ts_mystic_brew:      { id: 'ts_mystic_brew',      name: 'Mystic Brew',       icon: '🧪', description: 'A shimmering brew infused with arcane runes.' },
  ts_clay_vial:        { id: 'ts_clay_vial',        name: 'Clay Vial',         icon: '🏺', description: 'A simple clay vial, essential for alchemists.' },
  ts_deity_idol:       { id: 'ts_deity_idol',       name: 'Deity Idol',        icon: '🗿', description: 'A fired clay idol bearing a deity\'s sigil.' },
  ts_mixing_bowl:      { id: 'ts_mixing_bowl',      name: 'Mixing Bowl',       icon: '🥣', description: 'A wide, sturdy mixing bowl for baking and brewing.' },
  ts_rune_shard:       { id: 'ts_rune_shard',       name: 'Rune Shard',        icon: '🔮', description: 'A clay shard etched with ancient runes.' },
  ts_kiln_fired_urn:   { id: 'ts_kiln_fired_urn',   name: 'Kiln-Fired Urn',   icon: '🏺', description: 'A masterwork urn fired in a stone kiln.' },
  ts_oak_bow:          { id: 'ts_oak_bow',          name: 'Oak Bow',           icon: '🏹', description: 'A simple but reliable oak bow.' },
  ts_wooden_arrow:     { id: 'ts_wooden_arrow',     name: 'Wooden Arrows',     icon: '➡️', description: 'A bundle of twenty wooden arrows.' },
  ts_compound_bow:     { id: 'ts_compound_bow',     name: 'Compound Bow',      icon: '🏹', description: 'A sophisticated compound bow with exceptional range.' },
  ts_broadhead_arrow:  { id: 'ts_broadhead_arrow',  name: 'Broadhead Arrows',  icon: '➡️', description: 'Wide-cutting broadheads for armoured foes.' },
  ts_recurve_bow:      { id: 'ts_recurve_bow',      name: 'Recurve Bow',       icon: '🏹', description: 'A curved yew bow that stores more energy in its limbs.' },
  ts_copper_ring:      { id: 'ts_copper_ring',      name: 'Copper Ring',       icon: '💍', description: 'A simple copper band.' },
  ts_silver_earring:   { id: 'ts_silver_earring',   name: 'Silver Earring',    icon: '💍', description: 'An elegant silver earring with ornate clasp.' },
  ts_gold_necklace:    { id: 'ts_gold_necklace',    name: 'Gold Necklace',     icon: '📿', description: 'A fine gold chain with artisan clasp.' },
  ts_gem_set_bracelet: { id: 'ts_gem_set_bracelet', name: 'Gem-Set Bracelet',  icon: '💎', description: 'A silver bracelet set with polished gems.' },
  ts_enchanted_band:   { id: 'ts_enchanted_band',   name: 'Enchanted Band',    icon: '✨', description: 'A gold band pulsing with arcane energy.' },
};

// ─── Starter Material Quantities (given to new characters) ───────────────────

const TRADESKILL_STARTER_MATERIALS = [
  { itemId: 'ts_bronze_ingot', qty: 10 },
  { itemId: 'ts_iron_ingot', qty: 5 },
  { itemId: 'ts_sword_mold', qty: 3 },
  { itemId: 'ts_breastplate_mold', qty: 2 },
  { itemId: 'ts_shield_mold', qty: 2 },
  { itemId: 'ts_wooden_handle', qty: 5 },
  { itemId: 'ts_chainmail_links', qty: 6 },
  { itemId: 'ts_rawhide', qty: 10 },
  { itemId: 'ts_thread', qty: 15 },
  { itemId: 'ts_silk_swatch', qty: 8 },
  { itemId: 'ts_canvas', qty: 5 },
  { itemId: 'ts_wheat_flour', qty: 10 },
  { itemId: 'ts_water_flask', qty: 15 },
  { itemId: 'ts_dried_herbs', qty: 8 },
  { itemId: 'ts_honey', qty: 6 },
  { itemId: 'ts_raw_meat', qty: 5 },
  { itemId: 'ts_barley', qty: 8 },
  { itemId: 'ts_yeast', qty: 6 },
  { itemId: 'ts_jumjum', qty: 6 },
  { itemId: 'ts_clay', qty: 12 },
  { itemId: 'ts_glaze', qty: 8 },
  { itemId: 'ts_oak_wood', qty: 10 },
  { itemId: 'ts_bowstring', qty: 5 },
  { itemId: 'ts_feathers', qty: 15 },
  { itemId: 'ts_arrow_tip', qty: 20 },
  { itemId: 'ts_copper_ingot', qty: 8 },
  { itemId: 'ts_silver_ingot', qty: 4 },
  { itemId: 'ts_ring_mold', qty: 5 },
  { itemId: 'ts_jewel_setting', qty: 6 },
  { itemId: 'ts_raw_gem', qty: 4 },
];

// ─── Per-Character State Init ─────────────────────────────────────────────────

/**
 * Ensure tradeskill state exists on a character. Safe to call multiple times.
 * @param {object} character
 */
function initTradeskills(character) {
  if (!character) return;
  if (!character.tradeskills) character.tradeskills = {};

  const ts = character.tradeskills;

  // Ensure each discipline exists
  for (const disc of Object.keys(TRADESKILL_DISCIPLINES)) {
    if (!ts[disc]) ts[disc] = { level: 1, xp: 0 };
    if (ts[disc].level === undefined) ts[disc].level = 1;
    if (ts[disc].xp === undefined) ts[disc].xp = 0;
  }

  // Ensure mastery map exists
  if (!ts.masteries) ts.masteries = {};
  for (const recipe of TRADESKILL_RECIPES) {
    if (ts.masteries[recipe.id] === undefined) ts.masteries[recipe.id] = 0;
  }

  // Ensure craft queue exists
  if (!Array.isArray(ts.craftQueue)) ts.craftQueue = [];

  // Ensure tradeskill inventory section exists
  if (!character.tradeskillInventory) {
    character.tradeskillInventory = {};
    // Give starter materials if this is a new tradeskills init
    for (const { itemId, qty } of TRADESKILL_STARTER_MATERIALS) {
      character.tradeskillInventory[itemId] = qty;
    }
  }
}

// ─── Getters ──────────────────────────────────────────────────────────────────

/**
 * Returns current integer level for a discipline.
 * @param {object} character
 * @param {string} discipline
 * @returns {number}
 */
function getTradeskillLevel(character, discipline) {
  if (!character.tradeskills || !character.tradeskills[discipline]) return 1;
  return character.tradeskills[discipline].level || 1;
}

/**
 * Converts mastery XP to 1-99 mastery level.
 * @param {object} character
 * @param {string} recipeId
 * @returns {number}
 */
function getMasteryLevel(character, recipeId) {
  if (!character.tradeskills || !character.tradeskills.masteries) return 0;
  const xp = character.tradeskills.masteries[recipeId] || 0;
  return Math.min(99, Math.floor(xp / 100));
}

/**
 * Returns the mastery bonuses object that are active at a given mastery level.
 * @param {object} recipe
 * @param {number} masteryLevel
 * @returns {object}
 */
function getActiveMasteryBonuses(recipe, masteryLevel) {
  const bonuses = {};
  if (!recipe.masteryBonuses) return bonuses;
  for (const [threshold, bonus] of Object.entries(recipe.masteryBonuses)) {
    if (masteryLevel >= parseInt(threshold, 10)) {
      Object.assign(bonuses, bonus);
    }
  }
  return bonuses;
}

/**
 * Returns the effective action time in ms, applying mastery speed reduction.
 * @param {object} character
 * @param {object} recipe
 * @returns {number}
 */
function getCraftingSpeed(character, recipe) {
  const mastery = getMasteryLevel(character, recipe.id);
  const bonuses = getActiveMasteryBonuses(recipe, mastery);
  const reduction = bonuses.actionTimeReduction || 0;
  return Math.max(500, Math.floor(recipe.actionTime * (1 - reduction)));
}

/**
 * Returns 0-1 chance of bonus output from mastery.
 * @param {object} character
 * @param {object} recipe
 * @returns {number}
 */
function getBonusYieldChance(character, recipe) {
  const mastery = getMasteryLevel(character, recipe.id);
  const bonuses = getActiveMasteryBonuses(recipe, mastery);
  return bonuses.bonusYieldChance || 0;
}

/**
 * Returns true if the mastery level grants "never fail" benefit.
 * @param {object} character
 * @param {object} recipe
 * @returns {boolean}
 */
function neverFails(character, recipe) {
  const mastery = getMasteryLevel(character, recipe.id);
  const bonuses = getActiveMasteryBonuses(recipe, mastery);
  return !!(bonuses.neverFails);
}

// ─── Inventory Helpers ────────────────────────────────────────────────────────

/**
 * Returns the quantity of itemId in the tradeskill inventory.
 * @param {object} character
 * @param {string} itemId
 * @returns {number}
 */
function getTSInvQty(character, itemId) {
  if (!character.tradeskillInventory) return 0;
  return character.tradeskillInventory[itemId] || 0;
}

/**
 * Check whether the character has enough materials for qty crafts.
 * @param {object} character
 * @param {object} recipe
 * @param {number} qty
 * @returns {boolean}
 */
function hasIngredients(character, recipe, qty) {
  for (const input of recipe.inputs) {
    if (getTSInvQty(character, input.itemId) < input.qty * qty) return false;
  }
  return true;
}

/**
 * Remove inputs for qty crafts from inventory.
 * @param {object} character
 * @param {object} recipe
 * @param {number} qty
 */
function consumeIngredients(character, recipe, qty) {
  if (!character.tradeskillInventory) character.tradeskillInventory = {};
  for (const input of recipe.inputs) {
    character.tradeskillInventory[input.itemId] =
      (character.tradeskillInventory[input.itemId] || 0) - input.qty * qty;
    if (character.tradeskillInventory[input.itemId] < 0) {
      character.tradeskillInventory[input.itemId] = 0;
    }
  }
}

/**
 * Add output items to tradeskill inventory.
 * @param {object} character
 * @param {object} recipe
 * @param {number} qty
 * @param {boolean} bonusYield - whether to award an extra set of outputs
 */
function giveOutput(character, recipe, qty, bonusYield) {
  if (!character.tradeskillInventory) character.tradeskillInventory = {};
  const total = bonusYield ? qty * 2 : qty;
  const out = recipe.output;
  character.tradeskillInventory[out.itemId] =
    (character.tradeskillInventory[out.itemId] || 0) + out.qty * total;
}

// ─── Crafting Queue ───────────────────────────────────────────────────────────

/**
 * Validate ingredients, consume materials, and push a craft to the queue.
 * @param {object} character
 * @param {string} recipeId
 * @param {number} quantity
 * @returns {{ success: boolean, message: string }}
 */
function startCraft(character, recipeId, quantity) {
  initTradeskills(character);
  const recipe = TRADESKILL_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return { success: false, message: 'Unknown recipe.' };
  quantity = Math.max(1, Math.floor(quantity));

  if (!hasIngredients(character, recipe, quantity)) {
    return { success: false, message: 'Not enough materials.' };
  }

  consumeIngredients(character, recipe, quantity);

  character.tradeskills.craftQueue.push({
    recipeId,
    quantity,
    startTime: Date.now(),
    completedCount: 0,
  });

  return { success: true, message: `Started crafting ${quantity}x ${recipe.name}.` };
}

/**
 * Award XP and level up in a discipline.
 * @param {object} character
 * @param {string} discipline
 * @param {number} xpAmount
 */
function awardSkillXp(character, discipline, xpAmount) {
  const ts = character.tradeskills[discipline];
  const disc = TRADESKILL_DISCIPLINES[discipline];
  if (!ts || !disc) return;

  ts.xp += xpAmount;
  // Level up loop
  while (ts.level < disc.maxLevel && ts.xp >= getTradeskillXpForLevel(ts.level + 1)) {
    ts.level++;
  }
}

/**
 * Process the craft queue for one character. Completes as many actions as
 * time allows. Awards skill XP and mastery XP. Applies mastery bonuses.
 * @param {object} character
 * @param {number} nowMs - current timestamp in ms
 */
function tickTradeskills(character, nowMs) {
  if (!character || !character.tradeskills) return;
  initTradeskills(character);

  const queue = character.tradeskills.craftQueue;
  if (!queue || queue.length === 0) return;

  let changed = false;
  let i = 0;
  while (i < queue.length) {
    const entry = queue[i];
    const recipe = TRADESKILL_RECIPES.find(r => r.id === entry.recipeId);
    if (!recipe) {
      queue.splice(i, 1);
      changed = true;
      continue;
    }

    const speed = getCraftingSpeed(character, recipe);
    const elapsed = nowMs - entry.startTime;
    const completable = Math.min(
      Math.floor(elapsed / speed),
      entry.quantity - entry.completedCount
    );

    if (completable > 0) {
      const disc = recipe.discipline;
      const currentLevel = getTradeskillLevel(character, disc);
      const awardXp = currentLevel < recipe.trivialLevel;

      for (let c = 0; c < completable; c++) {
        // Bonus yield roll per craft
        const bonusYield = Math.random() < getBonusYieldChance(character, recipe);
        giveOutput(character, recipe, 1, bonusYield);

        // Skill XP (suppressed at/above trivial level)
        if (awardXp) {
          awardSkillXp(character, disc, recipe.skillXp);
        }

        // Mastery XP always awarded
        character.tradeskills.masteries[recipe.id] =
          (character.tradeskills.masteries[recipe.id] || 0) + recipe.masteryXp;

        entry.completedCount++;
        // Advance the effective start time for the next action
        entry.startTime += speed;
      }
      changed = true;
    }

    if (entry.completedCount >= entry.quantity) {
      queue.splice(i, 1);
      changed = true;
    } else {
      i++;
    }
  }
  return changed;
}

/**
 * Process offline crafting catch-up. Called on game load after time has passed.
 * Each queued entry already has its `startTime` from when it was originally
 * enqueued, so calling tickTradeskills with the current time automatically
 * accounts for all time that elapsed while the game was closed.
 * @param {object} character
 * @param {number} offlineMs - milliseconds elapsed while offline (informational; startTimes are authoritative)
 */
function processTradeskillOffline(character, offlineMs) {
  if (!character || offlineMs <= 0) return;
  initTradeskills(character);
  const queue = character.tradeskills.craftQueue;
  if (!queue || queue.length === 0) return;
  tickTradeskills(character, Date.now());
}

/**
 * Ghost player crafting: pick a random recipe the ghost has materials for and
 * attempt one craft action.
 * @param {object} ghostCharacter
 */
function ghostCraft(ghostCharacter) {
  if (!ghostCharacter) return;
  initTradeskills(ghostCharacter);

  // Collect recipes the ghost can craft right now
  const available = TRADESKILL_RECIPES.filter(r => hasIngredients(ghostCharacter, r, 1));
  if (available.length === 0) {
    // Restock ghost with a small random batch of basic materials
    _ghostRestockMaterials(ghostCharacter);
    return;
  }

  const recipe = available[Math.floor(Math.random() * available.length)];
  const result = startCraft(ghostCharacter, recipe.id, 1);
  if (result.success) {
    // Immediately complete the craft for ghosts (they work in background)
    tickTradeskills(ghostCharacter, Date.now() + getCraftingSpeed(ghostCharacter, recipe) + 1);
  }
}

/**
 * Restock a ghost's tradeskill inventory with a random assortment of basic materials.
 * Uses the starter materials list so only raw ingredient IDs are stocked.
 * @param {object} ghost
 */
function _ghostRestockMaterials(ghost) {
  if (!ghost.tradeskillInventory) ghost.tradeskillInventory = {};
  const starters = TRADESKILL_STARTER_MATERIALS;
  const pick = starters[Math.floor(Math.random() * starters.length)];
  ghost.tradeskillInventory[pick.itemId] =
    (ghost.tradeskillInventory[pick.itemId] || 0) + 5 + Math.floor(Math.random() * 10);
}

// ─── Item Lookup Helper ───────────────────────────────────────────────────────

/**
 * Returns the item definition for a tradeskill item ID (material or product).
 * Falls back to the global ITEMS table if not a tradeskill-specific item.
 * @param {string} itemId
 * @returns {object|null}
 */
function getTSItem(itemId) {
  if (TRADESKILL_MATERIALS[itemId]) return TRADESKILL_MATERIALS[itemId];
  if (typeof ITEMS !== 'undefined' && ITEMS[itemId]) return ITEMS[itemId];
  return null;
}

if (typeof module !== 'undefined') {
  module.exports = {
    TRADESKILL_DISCIPLINES,
    TRADESKILL_RECIPES,
    TRADESKILL_MATERIALS,
    TRADESKILL_STARTER_MATERIALS,
    getTradeskillXpForLevel,
    initTradeskills,
    getTradeskillLevel,
    getMasteryLevel,
    getActiveMasteryBonuses,
    getCraftingSpeed,
    getBonusYieldChance,
    neverFails,
    hasIngredients,
    consumeIngredients,
    giveOutput,
    startCraft,
    tickTradeskills,
    processTradeskillOffline,
    ghostCraft,
    getTSItem,
  };
}
