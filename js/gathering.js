// gathering.js — Gathering Skills core engine for Forever RPG
// Gives players a Melvor Idle-style active tick loop to earn raw materials for tradeskills.

'use strict';

// ─── Discipline Definitions ───────────────────────────────────────────────────

const GATHERING_DISCIPLINES = {
  mining:        { name: 'Mining',        icon: '⛏️', maxLevel: 200 },
  lumberjacking: { name: 'Lumberjacking', icon: '🪓', maxLevel: 200 },
  foraging:      { name: 'Foraging',      icon: '🌿', maxLevel: 200 },
  hunting:       { name: 'Hunting',       icon: '🏹', maxLevel: 200 },
  farming:       { name: 'Farming',       icon: '🌾', maxLevel: 200 },
};

// ─── XP Curve ────────────────────────────────────────────────────────────────

/**
 * Returns the total XP needed to reach `level`.
 * Same formula as tradeskills: level * level * 10
 * @param {number} level
 * @returns {number}
 */
function getGatheringXpForLevel(level) {
  return Math.floor(level * level * 10);
}

// ─── Gathering Node Database ──────────────────────────────────────────────────

const GATHERING_NODES = [

  // ── Mining ─────────────────────────────────────────────────────────────────

  {
    id: 'copper_vein',
    skill: 'mining',
    name: 'Copper Vein',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 6000,
    outputs: [{ itemId: 'ts_copper_ingot', qty: 1, chance: 1.0 }],
    skillXp: 20,
    masteryXp: 8,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'East Karana',
    description: 'A vein of copper ore exposed in the rocky hills of East Karana.',
  },
  {
    id: 'bronze_deposit',
    skill: 'mining',
    name: 'Bronze Deposit',
    levelReq: 10,
    trivialLevel: 60,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_bronze_ingot', qty: 1, chance: 1.0 }],
    skillXp: 25,
    masteryXp: 10,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'North Karana',
    description: 'A rich bronze deposit hidden beneath the grasslands of North Karana.',
  },
  {
    id: 'clay_pit',
    skill: 'mining',
    name: 'Clay Pit',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 5000,
    outputs: [{ itemId: 'ts_clay', qty: 2, chance: 1.0 }],
    skillXp: 15,
    masteryXp: 6,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'West Karana',
    description: 'A riverbank clay pit dug into the soft earth of West Karana.',
  },
  {
    id: 'iron_vein',
    skill: 'mining',
    name: 'Iron Vein',
    levelReq: 30,
    trivialLevel: 80,
    actionTime: 8000,
    outputs: [{ itemId: 'ts_iron_ingot', qty: 1, chance: 1.0 }],
    skillXp: 38,
    masteryXp: 15,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Highpass Hold',
    description: 'A deep iron vein running through the stone walls of Highpass Hold.',
  },
  {
    id: 'silver_vein',
    skill: 'mining',
    name: 'Silver Vein',
    levelReq: 75,
    trivialLevel: 125,
    actionTime: 10000,
    outputs: [{ itemId: 'ts_silver_ingot', qty: 1, chance: 1.0 }],
    skillXp: 65,
    masteryXp: 26,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Everfrost Peaks',
    description: 'A glittering silver vein partially buried beneath the permafrost of Everfrost.',
  },
  {
    id: 'gem_cluster',
    skill: 'mining',
    name: 'Gem Cluster',
    levelReq: 60,
    trivialLevel: 110,
    actionTime: 9000,
    outputs: [{ itemId: 'ts_raw_gem', qty: 1, chance: 1.0 }],
    skillXp: 55,
    masteryXp: 22,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: "Nagafen's Lair",
    description: "Precious gemstones embedded in the volcanic rock of Nagafen's Lair.",
  },
  {
    id: 'gold_vein',
    skill: 'mining',
    name: 'Gold Vein',
    levelReq: 125,
    trivialLevel: 175,
    actionTime: 12000,
    outputs: [{ itemId: 'ts_gold_ingot', qty: 1, chance: 1.0 }],
    skillXp: 105,
    masteryXp: 42,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: "Solusek's Eye",
    description: "A rare gold vein discovered deep within the scorching tunnels of Solusek's Eye.",
  },
  {
    id: 'steel_seam',
    skill: 'mining',
    name: 'Steel Seam',
    levelReq: 100,
    trivialLevel: 150,
    actionTime: 11000,
    outputs: [{ itemId: 'ts_steel_ingot', qty: 1, chance: 1.0 }],
    skillXp: 82,
    masteryXp: 33,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Kedge Keep',
    description: 'A seam of high-carbon steel ore locked within the flooded ruins of Kedge Keep.',
  },

  // ── Lumberjacking ───────────────────────────────────────────────────────────

  {
    id: 'oak_tree',
    skill: 'lumberjacking',
    name: 'Oak Tree',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 6000,
    outputs: [{ itemId: 'ts_oak_wood', qty: 2, chance: 1.0 }],
    skillXp: 20,
    masteryXp: 8,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Qeynos Hills',
    description: 'A sturdy oak growing on the slopes of Qeynos Hills, its grain straight and true.',
  },
  {
    id: 'yew_tree',
    skill: 'lumberjacking',
    name: 'Yew Tree',
    levelReq: 50,
    trivialLevel: 100,
    actionTime: 9000,
    outputs: [{ itemId: 'ts_yew_wood', qty: 1, chance: 1.0 }],
    skillXp: 50,
    masteryXp: 20,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Kithicor Forest',
    description: 'An ancient yew deep in Kithicor Forest, its flexible wood prized by bowyers.',
  },
  {
    id: 'handle_log',
    skill: 'lumberjacking',
    name: 'Sturdy Log',
    levelReq: 15,
    trivialLevel: 65,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_wooden_handle', qty: 2, chance: 1.0 }],
    skillXp: 28,
    masteryXp: 11,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'West Karana',
    description: 'A fallen log in West Karana, its limbs thick enough to shape into solid handles.',
  },

  // ── Foraging ────────────────────────────────────────────────────────────────

  {
    id: 'herb_patch',
    skill: 'foraging',
    name: 'Herb Patch',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 5000,
    outputs: [{ itemId: 'ts_dried_herbs', qty: 2, chance: 1.0 }],
    skillXp: 15,
    masteryXp: 6,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'North Karana',
    description: 'A cluster of wild herbs growing along the windswept plains of North Karana.',
  },
  {
    id: 'wheat_field',
    skill: 'foraging',
    name: 'Wheat Field',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 5000,
    outputs: [{ itemId: 'ts_wheat_flour', qty: 2, chance: 1.0 }],
    skillXp: 15,
    masteryXp: 6,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'West Karana',
    description: 'Golden wheat fields stretching across the plains of West Karana.',
  },
  {
    id: 'beehive',
    skill: 'foraging',
    name: 'Beehive',
    levelReq: 20,
    trivialLevel: 70,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_honey', qty: 1, chance: 1.0 }],
    skillXp: 30,
    masteryXp: 12,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Misty Thicket',
    description: 'A wild beehive tucked into a hollow tree at the edge of the Misty Thicket.',
  },
  {
    id: 'jumjum_vine',
    skill: 'foraging',
    name: 'Jumjum Vine',
    levelReq: 10,
    trivialLevel: 60,
    actionTime: 6000,
    outputs: [{ itemId: 'ts_jumjum', qty: 2, chance: 1.0 }],
    skillXp: 22,
    masteryXp: 9,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Rivervale',
    description: 'Sweet jumjum vines trailing along the river banks near Rivervale.',
  },
  {
    id: 'well_spring',
    skill: 'foraging',
    name: 'Spring Well',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 4000,
    outputs: [{ itemId: 'ts_water_flask', qty: 3, chance: 1.0 }],
    skillXp: 12,
    masteryXp: 5,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Lake Rathetear',
    description: 'A natural spring at the shores of Lake Rathetear, its water crystal clear.',
  },
  {
    id: 'glaze_deposit',
    skill: 'foraging',
    name: 'Glaze Deposit',
    levelReq: 25,
    trivialLevel: 75,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_glaze', qty: 2, chance: 1.0 }],
    skillXp: 32,
    masteryXp: 13,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'The Feerrott',
    description: 'Mineral-rich mud deposits in The Feerrott that dry into a natural glaze.',
  },
  {
    id: 'rune_site',
    skill: 'foraging',
    name: 'Ancient Rune Site',
    levelReq: 80,
    trivialLevel: 130,
    actionTime: 10000,
    outputs: [{ itemId: 'ts_rune_fragment', qty: 1, chance: 1.0 }],
    skillXp: 68,
    masteryXp: 27,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Plane of Fear',
    description: 'Ancient rune-carved stones scattered across the Plane of Fear, pulsing with residual magic.',
  },

  // ── Hunting ─────────────────────────────────────────────────────────────────

  {
    id: 'plains_hunt',
    skill: 'hunting',
    name: 'Plains Hunting',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 6000,
    outputs: [
      { itemId: 'ts_rawhide',  qty: 1, chance: 1.0 },
      { itemId: 'ts_raw_meat', qty: 1, chance: 1.0 },
    ],
    skillXp: 20,
    masteryXp: 8,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'West Karana',
    description: 'Hunting the plains animals of West Karana for hide and meat.',
  },
  {
    id: 'bird_hunt',
    skill: 'hunting',
    name: 'Avian Hunting',
    levelReq: 15,
    trivialLevel: 65,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_feathers', qty: 3, chance: 1.0 }],
    skillXp: 28,
    masteryXp: 11,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Qeynos Hills',
    description: 'Harvesting flight feathers from the large birds of Qeynos Hills.',
  },
  {
    id: 'forest_hunt',
    skill: 'hunting',
    name: 'Forest Hunting',
    levelReq: 35,
    trivialLevel: 85,
    actionTime: 8000,
    outputs: [
      { itemId: 'ts_rawhide',  qty: 2, chance: 1.0 },
      { itemId: 'ts_raw_meat', qty: 1, chance: 1.0 },
    ],
    skillXp: 40,
    masteryXp: 16,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Kithicor Forest',
    description: 'Tracking and hunting the large beasts that dwell in Kithicor Forest.',
  },
  {
    id: 'silk_spider',
    skill: 'hunting',
    name: 'Silk Spider Den',
    levelReq: 50,
    trivialLevel: 100,
    actionTime: 9000,
    outputs: [{ itemId: 'ts_silk_swatch', qty: 2, chance: 1.0 }],
    skillXp: 50,
    masteryXp: 20,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Befallen',
    description: 'Harvesting fine silk from the giant spiders nesting in the ruins of Befallen.',
  },
  {
    id: 'canvas_hunt',
    skill: 'hunting',
    name: 'Caravan Salvage',
    levelReq: 30,
    trivialLevel: 80,
    actionTime: 8000,
    outputs: [{ itemId: 'ts_canvas', qty: 2, chance: 1.0 }],
    skillXp: 38,
    masteryXp: 15,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'East Commonlands',
    description: 'Salvaging canvas from abandoned caravans along the East Commonlands road.',
  },

  // ── Farming ─────────────────────────────────────────────────────────────────

  {
    id: 'barley_field',
    skill: 'farming',
    name: 'Barley Field',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 6000,
    outputs: [{ itemId: 'ts_barley', qty: 2, chance: 1.0 }],
    skillXp: 20,
    masteryXp: 8,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'West Karana',
    description: 'A cultivated barley field on the fertile plains of West Karana.',
  },
  {
    id: 'silk_farm',
    skill: 'farming',
    name: 'Silk Worm Farm',
    levelReq: 40,
    trivialLevel: 90,
    actionTime: 9000,
    outputs: [{ itemId: 'ts_silk_swatch', qty: 2, chance: 1.0 }],
    skillXp: 48,
    masteryXp: 19,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Qeynos',
    description: 'A silk worm farm maintained on the outskirts of Qeynos, yielding fine swatches.',
  },
  {
    id: 'canvas_loom',
    skill: 'farming',
    name: 'Canvas Loom',
    levelReq: 20,
    trivialLevel: 70,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_canvas', qty: 2, chance: 1.0 }],
    skillXp: 30,
    masteryXp: 12,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Freeport',
    description: 'A communal canvas loom operated in the workshops of Freeport.',
  },
  {
    id: 'yeast_culture',
    skill: 'farming',
    name: 'Yeast Culture',
    levelReq: 10,
    trivialLevel: 60,
    actionTime: 6000,
    outputs: [{ itemId: 'ts_yeast', qty: 2, chance: 1.0 }],
    skillXp: 22,
    masteryXp: 9,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Rivervale',
    description: 'A halfling yeast culture kept warm in a Rivervale cellar, perfect for brewing.',
  },
  {
    id: 'thread_spindle',
    skill: 'farming',
    name: 'Thread Spindle',
    levelReq: 1,
    trivialLevel: 51,
    actionTime: 5000,
    outputs: [{ itemId: 'ts_thread', qty: 3, chance: 1.0 }],
    skillXp: 15,
    masteryXp: 6,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Qeynos',
    description: 'A wooden spindle for spinning raw fibers into usable thread, found in Qeynos.',
  },
  {
    id: 'velvet_loom',
    skill: 'farming',
    name: 'Velvet Loom',
    levelReq: 100,
    trivialLevel: 150,
    actionTime: 11000,
    outputs: [{ itemId: 'ts_velvet_cloth', qty: 1, chance: 1.0 }],
    skillXp: 82,
    masteryXp: 33,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Plane of Knowledge',
    description: 'An enchanted loom in the Plane of Knowledge that weaves deep-purple velvet cloth.',
  },
  {
    id: 'bowstring_gut',
    skill: 'farming',
    name: 'Sinew Preparation',
    levelReq: 25,
    trivialLevel: 75,
    actionTime: 7000,
    outputs: [{ itemId: 'ts_bowstring', qty: 2, chance: 1.0 }],
    skillXp: 32,
    masteryXp: 13,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'East Karana',
    description: 'Preparing waxed sinew bowstrings at a workbench in East Karana.',
  },
  {
    id: 'arrowsmith',
    skill: 'farming',
    name: "Arrowsmith's Bench",
    levelReq: 15,
    trivialLevel: 65,
    actionTime: 6000,
    outputs: [
      { itemId: 'ts_arrow_tip',      qty: 5, chance: 1.0 },
      { itemId: 'ts_broadhead_tip',  qty: 2, chance: 1.0 },
    ],
    skillXp: 28,
    masteryXp: 11,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Qeynos',
    description: "A fletcher's bench in Qeynos used to stamp and shape iron arrowheads.",
  },
  {
    id: 'chainlinks_forge',
    skill: 'farming',
    name: 'Chainlink Forge',
    levelReq: 30,
    trivialLevel: 80,
    actionTime: 8000,
    outputs: [{ itemId: 'ts_chainmail_links', qty: 3, chance: 1.0 }],
    skillXp: 38,
    masteryXp: 15,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'North Qeynos',
    description: 'A specialized forge in North Qeynos dedicated to bending and linking iron rings.',
  },
  {
    id: 'mold_workshop',
    skill: 'farming',
    name: 'Mold Workshop',
    levelReq: 10,
    trivialLevel: 60,
    actionTime: 6000,
    outputs: [
      { itemId: 'ts_sword_mold', qty: 1, chance: 1.0 },
      { itemId: 'ts_ring_mold',  qty: 1, chance: 1.0 },
    ],
    skillXp: 22,
    masteryXp: 9,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Freeport',
    description: 'A clay mold workshop in Freeport producing casting forms for smiths and jewelers.',
  },
  {
    id: 'jewel_workshop',
    skill: 'farming',
    name: "Jeweler's Workshop",
    levelReq: 50,
    trivialLevel: 100,
    actionTime: 9000,
    outputs: [{ itemId: 'ts_jewel_setting', qty: 2, chance: 1.0 }],
    skillXp: 50,
    masteryXp: 20,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Felwithe',
    description: 'An elven jeweler\'s workshop in Felwithe crafting delicate metal settings.',
  },
  {
    id: 'ice_harvest',
    skill: 'farming',
    name: 'Velious Ice Harvest',
    levelReq: 120,
    trivialLevel: 170,
    actionTime: 12000,
    outputs: [{ itemId: 'ts_ice_crystal', qty: 1, chance: 1.0 }],
    skillXp: 100,
    masteryXp: 40,
    masteryBonuses: {
      25: { bonusYieldChance: 0.10 },
      50: { actionTimeReduction: 0.10 },
      99: { neverFails: true },
    },
    zone: 'Velious',
    description: 'Harvesting pure ice crystals from deep glacial formations on the continent of Velious.',
  },
];

// ─── Per-Character State Init ─────────────────────────────────────────────────

/**
 * Ensure gathering state exists on a character. Safe to call multiple times.
 * @param {object} character
 */
function initGathering(character) {
  if (!character) return;
  if (!character.gathering) character.gathering = {};

  const g = character.gathering;

  // Ensure each discipline exists
  for (const skill of Object.keys(GATHERING_DISCIPLINES)) {
    if (!g[skill]) g[skill] = { level: 1, xp: 0 };
    if (g[skill].level === undefined) g[skill].level = 1;
    if (g[skill].xp    === undefined) g[skill].xp    = 0;
  }

  // Ensure mastery map exists
  if (!g.masteries) g.masteries = {};
  for (const node of GATHERING_NODES) {
    if (g.masteries[node.id] === undefined) g.masteries[node.id] = 0;
  }

  // Ensure active node slot exists
  if (g.activeNode === undefined) g.activeNode = null;

  // Ensure shared tradeskill inventory exists (created by initTradeskills if already called)
  if (!character.tradeskillInventory) character.tradeskillInventory = {};
}

// ─── Getters ──────────────────────────────────────────────────────────────────

/**
 * Returns current integer level for a gathering skill.
 * @param {object} character
 * @param {string} skill
 * @returns {number}
 */
function getGatheringLevel(character, skill) {
  if (!character.gathering || !character.gathering[skill]) return 1;
  return character.gathering[skill].level || 1;
}

/**
 * Converts node mastery XP to 1-99 mastery level.
 * @param {object} character
 * @param {string} nodeId
 * @returns {number}
 */
function getNodeMasteryLevel(character, nodeId) {
  if (!character.gathering || !character.gathering.masteries) return 0;
  const xp = character.gathering.masteries[nodeId] || 0;
  return Math.min(99, Math.floor(xp / 100));
}

/**
 * Returns the mastery bonuses active at a given mastery level for a node.
 * @param {object} node
 * @param {number} masteryLevel
 * @returns {object}
 */
function getActiveNodeMasteryBonuses(node, masteryLevel) {
  const bonuses = {};
  if (!node.masteryBonuses) return bonuses;
  for (const [threshold, bonus] of Object.entries(node.masteryBonuses)) {
    if (masteryLevel >= parseInt(threshold, 10)) {
      Object.assign(bonuses, bonus);
    }
  }
  return bonuses;
}

/**
 * Returns the effective action time in ms, applying mastery speed reduction.
 * Minimum is 500ms.
 * @param {object} character
 * @param {object} node
 * @returns {number}
 */
function getGatheringSpeed(character, node) {
  const mastery = getNodeMasteryLevel(character, node.id);
  const bonuses = getActiveNodeMasteryBonuses(node, mastery);
  const reduction = bonuses.actionTimeReduction || 0;
  return Math.max(500, Math.floor(node.actionTime * (1 - reduction)));
}

/**
 * Returns 0-1 bonus yield chance from node mastery.
 * @param {object} character
 * @param {object} node
 * @returns {number}
 */
function getGatheringYieldBonus(character, node) {
  const mastery = getNodeMasteryLevel(character, node.id);
  const bonuses = getActiveNodeMasteryBonuses(node, mastery);
  return bonuses.bonusYieldChance || 0;
}

// ─── Gathering Queue ──────────────────────────────────────────────────────────

/**
 * Validates level req and sets the active gathering node.
 * @param {object} character
 * @param {string} nodeId
 * @returns {{ success: boolean, message: string }}
 */
function startGathering(character, nodeId) {
  initGathering(character);
  const node = getGatherNode(nodeId);
  if (!node) return { success: false, message: 'Unknown gathering node.' };

  const level = getGatheringLevel(character, node.skill);
  if (level < node.levelReq) {
    return {
      success: false,
      message: `Requires ${GATHERING_DISCIPLINES[node.skill].name} level ${node.levelReq} (you have ${level}).`,
    };
  }

  character.gathering.activeNode = { nodeId, startTime: Date.now() };
  return { success: true, message: `Started gathering at ${node.name}.` };
}

/**
 * Clears the active gathering node.
 * @param {object} character
 */
function stopGathering(character) {
  if (!character || !character.gathering) return;
  character.gathering.activeNode = null;
}

/**
 * Award XP and level up in a gathering skill.
 * @param {object} character
 * @param {string} skill
 * @param {number} xpAmount
 */
function _awardGatheringXp(character, skill, xpAmount) {
  const disc = GATHERING_DISCIPLINES[skill];
  const gs = character.gathering[skill];
  if (!gs || !disc) return;

  gs.xp += xpAmount;
  while (gs.level < disc.maxLevel && gs.xp >= getGatheringXpForLevel(gs.level + 1)) {
    gs.level++;
  }
}

/**
 * Process the active gathering node for one character. Completes as many actions
 * as time allows, grants outputs to tradeskillInventory, and awards XP/mastery.
 * @param {object} character
 * @param {number} nowMs - current timestamp in ms
 * @returns {boolean} True if any state changed.
 */
function tickGathering(character, nowMs) {
  if (!character || !character.gathering) return false;
  initGathering(character);

  const active = character.gathering.activeNode;
  if (!active) return false;

  const node = getGatherNode(active.nodeId);
  if (!node) {
    character.gathering.activeNode = null;
    return true;
  }

  // Validate level requirement still met (e.g. after save migration edge cases)
  const level = getGatheringLevel(character, node.skill);
  if (level < node.levelReq) {
    character.gathering.activeNode = null;
    return true;
  }

  const speed = getGatheringSpeed(character, node);
  const elapsed = nowMs - active.startTime;
  const completable = Math.floor(elapsed / speed);

  if (completable <= 0) return false;

  const awardXp = level < node.trivialLevel;

  if (!character.tradeskillInventory) character.tradeskillInventory = {};

  for (let c = 0; c < completable; c++) {
    const bonusYield = Math.random() < getGatheringYieldBonus(character, node);

    // Give all outputs for this gather action
    for (const out of node.outputs) {
      if (Math.random() < out.chance) {
        const qty = bonusYield ? out.qty * 2 : out.qty;
        character.tradeskillInventory[out.itemId] =
          (character.tradeskillInventory[out.itemId] || 0) + qty;
      }
    }

    // Skill XP (suppressed at/above trivial level)
    if (awardXp) {
      _awardGatheringXp(character, node.skill, node.skillXp);
    }

    // Mastery XP always awarded
    character.gathering.masteries[node.id] =
      (character.gathering.masteries[node.id] || 0) + node.masteryXp;

    // Advance start time for continuous gathering
    active.startTime += speed;
  }

  // Fire achievement checks after all actions are processed
  if (typeof checkAchievements === 'function') {
    const newLevel = getGatheringLevel(character, node.skill);
    const newMasteryLevel = getNodeMasteryLevel(character, node.id);
    checkAchievements('gathering_action', {
      discipline: node.skill,
      newLevel,
      masteryLevel: newMasteryLevel,
    });
  }

  return true;
}

/**
 * Process offline gathering catch-up. Called on game load after time has passed.
 * @param {object} character
 * @param {number} offlineMs - milliseconds elapsed while offline (informational)
 */
function processGatheringOffline(character, offlineMs) {
  if (!character || offlineMs <= 0) return;
  initGathering(character);
  if (!character.gathering.activeNode) return;
  tickGathering(character, Date.now());
}

// ─── Ghost Gathering ──────────────────────────────────────────────────────────

/**
 * Ghost player gathering: pick a random available node and complete one action.
 * @param {object} ghostCharacter
 */
function ghostGather(ghostCharacter) {
  if (!ghostCharacter) return;
  initGathering(ghostCharacter);

  // Find nodes the ghost meets the level req for
  const available = GATHERING_NODES.filter(node => {
    return getGatheringLevel(ghostCharacter, node.skill) >= node.levelReq;
  });

  if (available.length === 0) {
    _ghostResetGathering(ghostCharacter);
    return;
  }

  const node = available[Math.floor(Math.random() * available.length)];
  const result = startGathering(ghostCharacter, node.id);
  if (result.success) {
    // Immediately complete one action for ghosts (they work in the background)
    const speed = getGatheringSpeed(ghostCharacter, node);
    tickGathering(ghostCharacter, Date.now() + speed + 1);
  }
}

/**
 * Fallback for ghosts with no available nodes: picks the lowest-level node and starts it.
 * @param {object} ghost
 */
function _ghostResetGathering(ghost) {
  const lowestNode = GATHERING_NODES.reduce((lowest, node) =>
    node.levelReq < lowest.levelReq ? node : lowest
  );
  startGathering(ghost, lowestNode.id);
  const speed = getGatheringSpeed(ghost, lowestNode);
  tickGathering(ghost, Date.now() + speed + 1);
}

// ─── Node Lookup Helper ───────────────────────────────────────────────────────

/**
 * Returns the node definition for a gathering node ID.
 * @param {string} nodeId
 * @returns {object|undefined}
 */
function getGatherNode(nodeId) {
  return GATHERING_NODES.find(n => n.id === nodeId);
}

// ─── Module Exports ───────────────────────────────────────────────────────────

if (typeof module !== 'undefined') {
  module.exports = {
    GATHERING_DISCIPLINES,
    GATHERING_NODES,
    getGatheringXpForLevel,
    initGathering,
    getGatheringLevel,
    getNodeMasteryLevel,
    getActiveNodeMasteryBonuses,
    getGatheringSpeed,
    getGatheringYieldBonus,
    startGathering,
    stopGathering,
    tickGathering,
    processGatheringOffline,
    ghostGather,
    getGatherNode,
  };
}
