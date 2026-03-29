'use strict';

// ─── Quest Definitions ────────────────────────────────────────────────────────

const QUESTS = [

  // ══════════════════════════════════════════
  // 🌿  Qeynos Hills  (levels 2–12)
  // ══════════════════════════════════════════
  {
    id: 'qh_gnoll_problem',
    zone: 'qeynos_hills',
    name: 'Gnoll Problem',
    desc: 'Kill 25 gnolls in Qeynos Hills.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['gnoll_pup', 'gnoll', 'gnoll_scout', 'gnoll_watcher', 'gnoll_hunter'],
      count: 25,
    },
    reward: {
      xp: 5000,
      copper: 200,
      items: [{ itemId: 'spiked_collar', quantity: 1 }],
      achievementId: 'quest_pest_control',
    },
    achievement: {
      id: 'quest_pest_control',
      category: 'quest',
      name: 'Pest Control',
      desc: 'Complete the Gnoll Problem quest.',
      points: 15,
    },
  },

  {
    id: 'qh_wolf_hunter',
    zone: 'qeynos_hills',
    name: 'Wolf Pack Hunter',
    desc: 'Kill 10 gray wolves and 5 rabid wolves in Qeynos Hills.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['gray_wolf', 'rabid_wolf'],
      count: 15,
    },
    reward: {
      xp: 4000,
      copper: 150,
      items: [
        { itemId: 'wolf_pelt', quantity: 5 },
        { itemId: 'large_pouch', quantity: 1 },
      ],
      achievementId: 'quest_wolf_hunter',
    },
    achievement: {
      id: 'quest_wolf_hunter',
      category: 'quest',
      name: "Who's Afraid?",
      desc: 'Complete the Wolf Pack Hunter quest.',
      points: 15,
    },
  },

  {
    id: 'qh_wisp_mystery',
    zone: 'qeynos_hills',
    name: 'The Wisp Mystery',
    desc: 'Kill 3 Will-o-Wisps in Qeynos Hills.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['will_o_wisp'],
      count: 3,
    },
    reward: {
      xp: 6000,
      copper: 300,
      items: [{ itemId: 'travelers_pack', quantity: 1 }],
      achievementId: 'quest_wisp_mystery',
    },
    achievement: {
      id: 'quest_wisp_mystery',
      category: 'quest',
      name: 'Chasing Ghosts',
      desc: 'Complete The Wisp Mystery quest.',
      points: 15,
    },
  },

  {
    id: 'qh_varsoon',
    zone: 'qeynos_hills',
    name: "Varsoon's Bane",
    desc: 'Slay Varsoon the Undying in Qeynos Hills.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['varsoon_the_undying'],
      count: 1,
    },
    reward: {
      xp: 10000,
      copper: 500,
      items: [{ itemId: 'gnoll_slayer', quantity: 1 }],
      achievementId: 'quest_varsoon',
    },
    achievement: {
      id: 'quest_varsoon',
      category: 'quest',
      name: 'Slayer of the Undying',
      desc: "Complete Varsoon's Bane quest.",
      points: 20,
    },
  },

  {
    id: 'qh_exterminator',
    zone: 'qeynos_hills',
    name: 'Exterminator',
    desc: 'Kill at least one mangy rat, giant rat, and large rat in Qeynos Hills.',
    ghostEligible: false,
    objective: {
      type: 'kill_all_types',
      enemies: ['mangy_rat', 'giant_rat', 'large_rat'],
    },
    reward: {
      xp: 3000,
      copper: 100,
      items: [
        { itemId: 'rat_pelt', quantity: 10 },
        { itemId: 'silver_coin', quantity: 5 },
      ],
      achievementId: 'quest_exterminator',
    },
    achievement: {
      id: 'quest_exterminator',
      category: 'quest',
      name: 'Rat King',
      desc: 'Complete the Exterminator quest.',
      points: 10,
    },
  },

  // ══════════════════════════════════════════
  // 🕳️  Blackburrow  (levels 4–16)
  // ══════════════════════════════════════════
  {
    id: 'bb_deeper',
    zone: 'blackburrow',
    name: 'Deeper and Darker',
    desc: 'Reach Floor 3 of Blackburrow.',
    ghostEligible: false,
    objective: {
      type: 'reach_floor',
      floor: 3,
    },
    reward: {
      xp: 8000,
      copper: 300,
      items: [{ itemId: 'elite_gnoll_helm', quantity: 1 }],
      achievementId: 'quest_bb_deeper',
    },
    achievement: {
      id: 'quest_bb_deeper',
      category: 'quest',
      name: "Don't Look Down",
      desc: 'Complete the Deeper and Darker quest.',
      points: 15,
    },
  },

  {
    id: 'bb_stouts',
    zone: 'blackburrow',
    name: "Last Round's on Me",
    desc: 'Loot 5 Blackburrow Stouts.',
    ghostEligible: false,
    objective: {
      type: 'loot',
      itemId: 'blackburrow_stout',
      count: 5,
    },
    reward: {
      xp: 5000,
      copper: 200,
      items: [
        { itemId: 'blackburrow_stout', quantity: 3 },
        { itemId: 'gold_coin', quantity: 1 },
      ],
      achievementId: 'quest_bb_stouts',
    },
    achievement: {
      id: 'quest_bb_stouts',
      category: 'quest',
      name: "Last Round's on Me",
      desc: "Complete the Last Round's on Me quest.",
      points: 10,
    },
  },

  {
    id: 'bb_high_shaman',
    zone: 'blackburrow',
    name: 'Silenced the Spirits',
    desc: 'Slay the Gnoll High Shaman in Blackburrow.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['gnoll_high_shaman', 'gnoll_high_shaman_bb'],
      count: 1,
    },
    reward: {
      xp: 9000,
      copper: 400,
      items: [
        { itemId: 'gnoll_shaman_beads', quantity: 3 },
        { itemId: 'large_pouch', quantity: 1 },
      ],
      achievementId: 'quest_bb_high_shaman',
    },
    achievement: {
      id: 'quest_bb_high_shaman',
      category: 'quest',
      name: 'Silenced the Spirits',
      desc: 'Complete the Silenced the Spirits quest.',
      points: 15,
    },
  },

  {
    id: 'bb_elgnub',
    zone: 'blackburrow',
    name: 'Dethroned',
    desc: 'Kill Lord Elgnub, ruler of the deep warrens.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['lord_elgnub'],
      count: 1,
    },
    reward: {
      xp: 15000,
      copper: 600,
      items: [{ itemId: 'elgnubs_gnoll_hide_belt', quantity: 1 }],
      achievementId: 'quest_bb_elgnub',
    },
    achievement: {
      id: 'quest_bb_elgnub',
      category: 'quest',
      name: 'Dethroned',
      desc: 'Complete the Dethroned quest.',
      points: 20,
    },
  },

  {
    id: 'bb_full_clear',
    zone: 'blackburrow',
    name: 'Full Clearance',
    desc: 'Clear all 5 floors of Blackburrow.',
    ghostEligible: false,
    objective: {
      type: 'reach_floor',
      floor: 5,
    },
    reward: {
      xp: 25000,
      copper: 1000,
      items: [{ itemId: 'lords_insignia_ring', quantity: 1 }],
      achievementId: 'quest_bb_full_clear',
    },
    achievement: {
      id: 'quest_bb_full_clear',
      category: 'quest',
      name: 'Full Clearance',
      desc: 'Complete the Full Clearance quest.',
      points: 25,
    },
  },

  // ══════════════════════════════════════════
  // ❄️  Everfrost Peaks
  // ══════════════════════════════════════════
  {
    id: 'ef_cold_front',
    zone: 'everfrost_peaks',
    name: 'Cold Front',
    desc: 'Kill 20 enemies in Everfrost Peaks.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: null,
      count: 20,
    },
    reward: {
      xp: 12000,
      copper: 300,
      items: [
        { itemId: 'wolf_pelt', quantity: 5 },
        { itemId: 'silver_coin', quantity: 20 },
      ],
      achievementId: 'quest_ef_cold_front',
    },
    achievement: {
      id: 'quest_ef_cold_front',
      category: 'quest',
      name: 'Frostbitten',
      desc: 'Complete the Cold Front quest.',
      points: 15,
    },
  },

  {
    id: 'ef_rare_hunter',
    zone: 'everfrost_peaks',
    name: "Something's Out There",
    desc: 'Kill any rare spawn in Everfrost Peaks.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: null,
      count: 1,
      rareOnly: true,
    },
    reward: {
      xp: 18000,
      copper: 500,
      items: [{ itemId: 'bear_pelt', quantity: 3 }],
      achievementId: 'quest_ef_rare',
    },
    achievement: {
      id: 'quest_ef_rare',
      category: 'quest',
      name: 'Wendigo Wrangler',
      desc: "Complete the Something's Out There quest.",
      points: 20,
    },
  },

  // ══════════════════════════════════════════
  // 🌾  West Karana  (levels 20–30)
  // ══════════════════════════════════════════
  {
    id: 'wk_bandit_bounty',
    zone: 'west_karana',
    name: "Road's Clear",
    desc: 'Kill 20 Karana Bandits and Raiders in West Karana.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['karana_bandit', 'karana_raider'],
      count: 20,
    },
    reward: {
      xp: 20000,
      copper: 500,
      items: [
        { itemId: 'raider_axe', quantity: 1 },
        { itemId: 'silver_coin', quantity: 20 },
      ],
      achievementId: 'quest_wk_bandits',
    },
    achievement: {
      id: 'quest_wk_bandits',
      category: 'quest',
      name: "Road's Clear",
      desc: "Complete the Road's Clear quest.",
      points: 15,
    },
  },

  {
    id: 'wk_griffon',
    zone: 'west_karana',
    name: 'Featherweight',
    desc: 'Kill the Plains Griffon in West Karana.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['plains_griffon'],
      count: 1,
    },
    reward: {
      xp: 28000,
      copper: 800,
      items: [{ itemId: 'giant_wolf_pelt', quantity: 2 }],
      achievementId: 'quest_wk_griffon',
    },
    achievement: {
      id: 'quest_wk_griffon',
      category: 'quest',
      name: 'Featherweight',
      desc: 'Complete the Featherweight quest.',
      points: 20,
    },
  },

  {
    id: 'wk_cyclops',
    zone: 'west_karana',
    name: 'One-Eye Down',
    desc: 'Kill the Plains Cyclops in West Karana.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['plains_cyclops'],
      count: 1,
    },
    reward: {
      xp: 28000,
      copper: 800,
      items: [{ itemId: 'bear_pelt', quantity: 3 }],
      achievementId: 'quest_wk_cyclops',
    },
    achievement: {
      id: 'quest_wk_cyclops',
      category: 'quest',
      name: 'One-Eye Down',
      desc: 'Complete the One-Eye Down quest.',
      points: 20,
    },
  },

  {
    id: 'wk_sweep',
    zone: 'west_karana',
    name: 'Karana Veteran',
    desc: 'Kill all 5 enemy types in West Karana.',
    ghostEligible: false,
    objective: {
      type: 'kill_all_types',
      enemies: ['karana_bandit', 'karana_raider', 'giant_wolf', 'plains_griffon', 'plains_cyclops'],
    },
    reward: {
      xp: 22000,
      copper: 600,
      items: [
        { itemId: 'giant_wolf_pelt', quantity: 3 },
        { itemId: 'gold_coin', quantity: 3 },
      ],
      achievementId: 'quest_wk_sweep',
    },
    achievement: {
      id: 'quest_wk_sweep',
      category: 'quest',
      name: 'Karana Veteran',
      desc: 'Complete the Karana Veteran quest.',
      points: 20,
    },
  },

  // ══════════════════════════════════════════
  // ⛰️  Highpass Hold  (levels 25–35)
  // ══════════════════════════════════════════
  {
    id: 'hp_toll',
    zone: 'highpass_hold',
    name: 'Nothing Passes',
    desc: 'Kill 15 Pass Bandits in Highpass Hold.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['pass_bandit'],
      count: 15,
    },
    reward: {
      xp: 18000,
      copper: 500,
      items: [
        { itemId: 'war_chief_axe', quantity: 1 },
        { itemId: 'silver_coin', quantity: 20 },
      ],
      achievementId: 'quest_hp_toll',
    },
    achievement: {
      id: 'quest_hp_toll',
      category: 'quest',
      name: 'Nothing Passes',
      desc: 'Complete the Nothing Passes quest.',
      points: 15,
    },
  },

  {
    id: 'hp_troll',
    zone: 'highpass_hold',
    name: 'Under the Bridge',
    desc: 'Kill the Rock Troll in Highpass Hold.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['rock_troll'],
      count: 1,
    },
    reward: {
      xp: 24000,
      copper: 700,
      items: [
        { itemId: 'troll_smash_club', quantity: 1 },
        { itemId: 'gnoll_war_totem', quantity: 1 },
      ],
      achievementId: 'quest_hp_troll',
    },
    achievement: {
      id: 'quest_hp_troll',
      category: 'quest',
      name: 'Under the Bridge',
      desc: 'Complete the Under the Bridge quest.',
      points: 20,
    },
  },

  {
    id: 'hp_war_chief',
    zone: 'highpass_hold',
    name: 'Decapitated',
    desc: 'Kill the Gnoll War Chief in Highpass Hold.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['gnoll_war_chief'],
      count: 1,
    },
    reward: {
      xp: 26000,
      copper: 800,
      items: [
        { itemId: 'gnoll_war_totem', quantity: 1 },
        { itemId: 'gold_coin', quantity: 3 },
      ],
      achievementId: 'quest_hp_war_chief',
    },
    achievement: {
      id: 'quest_hp_war_chief',
      category: 'quest',
      name: 'Decapitated',
      desc: 'Complete the Decapitated quest.',
      points: 20,
    },
  },

  // ══════════════════════════════════════════
  // 🌲  Kithicor Forest  (levels 30–42)
  // ══════════════════════════════════════════
  {
    id: 'kf_ghostbreaker',
    zone: 'kithicor_forest',
    name: 'Ghostbreaker',
    desc: 'Kill 30 undead soldiers in Kithicor Forest.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['kithicor_skeleton', 'kithicor_zombie', 'kithicor_warrior_spirit'],
      count: 30,
    },
    reward: {
      xp: 35000,
      copper: 800,
      items: [
        { itemId: 'bone_chips', quantity: 10 },
        { itemId: 'shadow_essence', quantity: 3 },
        { itemId: 'gold_coin', quantity: 4 },
      ],
      achievementId: 'quest_kf_ghostbreaker',
    },
    achievement: {
      id: 'quest_kf_ghostbreaker',
      category: 'quest',
      name: 'Ghostbreaker',
      desc: 'Complete the Ghostbreaker quest.',
      points: 20,
    },
  },

  {
    id: 'kf_night_shift',
    zone: 'kithicor_forest',
    name: 'Night Shift',
    desc: 'Win a full combat encounter in Kithicor Forest.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: null,
      count: 10,
    },
    reward: {
      xp: 28000,
      copper: 600,
      items: [
        { itemId: 'spirit_dust', quantity: 3 },
        { itemId: 'gold_coin', quantity: 3 },
      ],
      achievementId: 'quest_kf_night_shift',
    },
    achievement: {
      id: 'quest_kf_night_shift',
      category: 'quest',
      name: 'Night Shift',
      desc: 'Complete the Night Shift quest.',
      points: 15,
    },
  },

  // ══════════════════════════════════════════
  // 🏜️  Commonlands  (levels 38–50)
  // ══════════════════════════════════════════
  {
    id: 'cl_orc_offensive',
    zone: 'commonlands',
    name: "Crushbone's Bane",
    desc: 'Kill 30 Orc Warriors and Orc Shamans in the Commonlands.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['orc_warrior', 'orc_shaman'],
      count: 30,
    },
    reward: {
      xp: 45000,
      copper: 1000,
      items: [{ itemId: 'gold_coin', quantity: 5 }],
      achievementId: 'quest_cl_orcs',
    },
    achievement: {
      id: 'quest_cl_orcs',
      category: 'quest',
      name: "Crushbone's Bane",
      desc: "Complete the Crushbone's Bane quest.",
      points: 20,
    },
  },

  {
    id: 'cl_warlord',
    zone: 'commonlands',
    name: 'Warlord No More',
    desc: 'Kill the Crushbone Warlord in the Commonlands.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['crushbone_warlord'],
      count: 1,
    },
    reward: {
      xp: 55000,
      copper: 1200,
      items: [{ itemId: 'warlord_axe', quantity: 1 }],
      achievementId: 'quest_cl_warlord',
    },
    achievement: {
      id: 'quest_cl_warlord',
      category: 'quest',
      name: 'Warlord No More',
      desc: 'Complete the Warlord No More quest.',
      points: 25,
    },
  },

  {
    id: 'cl_shadow_hunt',
    zone: 'commonlands',
    name: 'Out of the Shadows',
    desc: 'Kill the Dark Elf Ranger in the Commonlands.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: ['dark_elf_ranger'],
      count: 1,
    },
    reward: {
      xp: 48000,
      copper: 1000,
      items: [
        { itemId: 'shadow_essence', quantity: 5 },
        { itemId: 'dark_elf_quiver', quantity: 1 },
      ],
      achievementId: 'quest_cl_shadow',
    },
    achievement: {
      id: 'quest_cl_shadow',
      category: 'quest',
      name: 'Out of the Shadows',
      desc: 'Complete the Out of the Shadows quest.',
      points: 20,
    },
  },

  // ══════════════════════════════════════════
  // 😱  Plane of Fear  (levels 45–55)
  // ══════════════════════════════════════════
  {
    id: 'pof_fearless',
    zone: 'plane_of_fear',
    name: 'Fearless',
    desc: 'Kill 10 enemies in the Plane of Fear.',
    ghostEligible: false,
    objective: {
      type: 'kill',
      enemies: null,
      count: 10,
    },
    reward: {
      xp: 60000,
      copper: 1500,
      items: [{ itemId: 'gold_coin', quantity: 5 }],
      achievementId: 'quest_pof_fearless',
    },
    achievement: {
      id: 'quest_pof_fearless',
      category: 'quest',
      name: 'Fearless',
      desc: 'Complete the Fearless quest.',
      points: 25,
    },
  },

  {
    id: 'pof_avatar',
    zone: 'plane_of_fear',
    name: 'Avatar of Fear',
    desc: 'Kill all enemy types in the Plane of Fear.',
    ghostEligible: false,
    objective: {
      type: 'kill_all_types',
      enemies: ['fear_golem', 'thought_horror', 'dracoliche', 'frenzied_puma', 'amygdalan_warrior', 'cazic_thule'],
    },
    reward: {
      xp: 120000,
      copper: 3000,
      items: [{ itemId: 'gold_coin', quantity: 15 }],
      achievementId: 'quest_pof_avatar',
    },
    achievement: {
      id: 'quest_pof_avatar',
      category: 'quest',
      name: 'Avatar of Fear',
      desc: 'Complete the Avatar of Fear quest.',
      points: 50,
    },
  },

  // ══════════════════════════════════════════
  // 👻  Ghost-Eligible Quests
  // ══════════════════════════════════════════
  {
    id: 'ghost_people_watcher',
    zone: 'qeynos',
    name: 'People Watcher',
    desc: 'Inspect 3 ghost players.',
    ghostEligible: true,
    objective: {
      type: 'inspect_ghosts',
      count: 3,
    },
    reward: {
      xp: 2000,
      copper: 100,
      items: [{ itemId: 'bread_loaf', quantity: 3 }],
      achievementId: 'quest_people_watcher',
    },
    achievement: {
      id: 'quest_people_watcher',
      category: 'quest',
      name: 'People Watcher',
      desc: 'Complete the People Watcher quest.',
      points: 10,
    },
  },

  {
    id: 'ghost_wandering_spirit',
    zone: 'qeynos',
    name: 'Wandering Spirit',
    desc: 'Visit 5 different zones as a ghost or witness ghost players in 5 zones.',
    ghostEligible: true,
    objective: {
      type: 'visit',
      count: 5,
    },
    reward: {
      xp: 8000,
      copper: 0,
      items: [],
      achievementId: 'quest_wandering_spirit',
    },
    achievement: {
      id: 'quest_wandering_spirit',
      category: 'quest',
      name: 'Wandering Spirit',
      desc: 'Complete the Wandering Spirit quest.',
      points: 15,
    },
  },

];

// ─── Storage ──────────────────────────────────────────────────────────────────

const QUEST_STORAGE_KEY = 'foreverRPG_quests';

// ─── Initialization ───────────────────────────────────────────────────────────

/**
 * Load quest state from localStorage into GameState.quests and register all
 * quest achievements into the shared ACHIEVEMENTS array.
 */
function initQuests() {
  // Register quest achievements into ACHIEVEMENTS (guard for missing array)
  if (typeof ACHIEVEMENTS !== 'undefined' && Array.isArray(ACHIEVEMENTS)) {
    for (const quest of QUESTS) {
      if (!ACHIEVEMENTS.find(a => a.id === quest.achievement.id)) {
        ACHIEVEMENTS.push(quest.achievement);
      }
    }
  }

  // Initialize state container (may already be populated by applyLoadedSave())
  if (!GameState.quests) {
    GameState.quests = {};
  }

  // Load from the dedicated quest key — it is updated on every startQuest() /
  // completeQuest() call, so it is always at least as fresh as the main save.
  // When both sources are present the dedicated key takes precedence.
  try {
    const saved = localStorage.getItem(QUEST_STORAGE_KEY);
    if (saved) {
      GameState.quests = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load quest state:', e);
    // Fall back to whatever applyLoadedSave() already populated
  }

  // Ensure every quest definition has a state entry (handles new quests added post-save)
  for (const quest of QUESTS) {
    if (!GameState.quests[quest.id]) {
      GameState.quests[quest.id] = { status: 'available', progress: {} };
    }
  }
}

/**
 * Persist current quest state to localStorage.
 */
function saveQuests() {
  try {
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(GameState.quests));
  } catch (e) {
    console.warn('Failed to save quest state:', e);
  }
}

// ─── Accessors ────────────────────────────────────────────────────────────────

/** Return the quest definition for the given ID, or null. */
function getQuest(id) {
  return QUESTS.find(q => q.id === id) || null;
}

/** Return the live state object for a quest, or null. */
function getQuestState(id) {
  return (GameState.quests || {})[id] || null;
}

/** Return all quest definitions whose zone matches zoneId. */
function getQuestsForZone(zoneId) {
  return QUESTS.filter(q => q.zone === zoneId);
}

/** Return quest definitions for zoneId that are still available to start. */
function getAvailableQuestsForZone(zoneId) {
  return QUESTS.filter(q => {
    if (q.zone !== zoneId) return false;
    const state = getQuestState(q.id);
    return state && state.status === 'available';
  });
}

/** Return definitions for all currently active quests. */
function getActiveQuests() {
  return QUESTS.filter(q => {
    const state = getQuestState(q.id);
    return state && state.status === 'active';
  });
}

/** Return definitions for all completed quests. */
function getCompletedQuests() {
  return QUESTS.filter(q => {
    const state = getQuestState(q.id);
    return state && state.status === 'completed';
  });
}

// ─── Quest Actions ────────────────────────────────────────────────────────────

/**
 * Activate a quest that is currently in the 'available' state.
 * @param {string} id - Quest ID.
 */
function startQuest(id) {
  const quest = getQuest(id);
  if (!quest) return;
  const state = getQuestState(id);
  if (!state || state.status !== 'available') return;

  state.status = 'active';
  if (typeof addCombatLog === 'function') {
    addCombatLog(`Quest started: ${quest.name}`, 'system');
  }
  saveQuests();
}

// ─── Progress Tracking ────────────────────────────────────────────────────────

/**
 * Main hook called by the game loop on relevant events.
 *
 * @param {'kill'|'loot'|'zone_change'|'floor_reached'|'ghost_inspected'} event
 * @param {object} data  - Event payload (enemyId, itemId, zoneId, floor, isRare, …)
 */
function checkQuestProgress(event, data) {
  if (!GameState.quests) return;

  const activeQuests = getActiveQuests();
  for (const quest of activeQuests) {
    // Only track events for the current zone, or ghost-eligible quests
    if (!quest.ghostEligible && quest.zone !== GameState.zone) continue;

    const state = GameState.quests[quest.id];
    if (!state || !state.progress) continue;

    const obj = quest.objective;
    let completed = false;

    if (event === 'kill' && (obj.type === 'kill' || obj.type === 'kill_all_types')) {
      completed = _handleKillEvent(quest, state, data);
    } else if (event === 'loot' && obj.type === 'loot') {
      completed = _handleLootEvent(quest, state, data);
    } else if (event === 'zone_change' && obj.type === 'visit') {
      completed = _handleVisitEvent(quest, state, data);
    } else if (event === 'floor_reached' && obj.type === 'reach_floor') {
      completed = _handleFloorEvent(quest, state, data);
    } else if (event === 'ghost_inspected' && obj.type === 'inspect_ghosts') {
      completed = _handleGhostInspectEvent(quest, state);
    }

    if (completed) {
      completeQuest(quest.id);
    }
  }
}

// ─── Internal Handlers ────────────────────────────────────────────────────────

function _handleKillEvent(quest, state, data) {
  const obj = quest.objective;

  if (obj.type === 'kill_all_types') {
    if (!state.progress.killedTypes) state.progress.killedTypes = {};

    // Sync from cumulative killCounts (always-on tracking)
    if (obj.enemies && GameState.killCounts) {
      for (const enemyId of obj.enemies) {
        if ((GameState.killCounts[enemyId] || 0) > 0) {
          state.progress.killedTypes[enemyId] = true;
        }
      }
    }

    return Array.isArray(obj.enemies) && obj.enemies.every(e => state.progress.killedTypes[e]);
  }

  // type === 'kill'
  if (obj.enemies === null) {
    // Any enemy in zone
    if (obj.rareOnly) {
      if (!state.progress.rareKills) state.progress.rareKills = 0;
      if (data && data.isRare) state.progress.rareKills += 1;
      return state.progress.rareKills >= obj.count;
    }
    // Generic zone kill counter (incremented per kill event)
    if (!state.progress.zoneKills) state.progress.zoneKills = 0;
    if (data && data.enemyId) state.progress.zoneKills += 1;
    return state.progress.zoneKills >= obj.count;
  }

  // Specific enemies — use cumulative killCounts (always-on tracking)
  if (!GameState.killCounts) return false;
  const total = obj.enemies.reduce(
    (sum, enemyId) => sum + (GameState.killCounts[enemyId] || 0),
    0,
  );
  return total >= obj.count;
}

function _handleLootEvent(quest, state, data) {
  const obj = quest.objective;
  if (!state.progress.looted) state.progress.looted = 0;
  if (data && data.itemId === obj.itemId) {
    state.progress.looted += (data.quantity || 1);
  }
  return state.progress.looted >= obj.count;
}

function _handleVisitEvent(quest, state, data) {
  const obj = quest.objective;
  if (!Array.isArray(state.progress.visited)) state.progress.visited = [];
  if (data && data.zoneId && !state.progress.visited.includes(data.zoneId)) {
    state.progress.visited.push(data.zoneId);
  }
  return state.progress.visited.length >= obj.count;
}

function _handleFloorEvent(quest, state, data) {
  const obj = quest.objective;
  const floor = (data && data.floor != null) ? data.floor : (GameState.dungeonFloor || 1);
  if (!state.progress.floor || floor > state.progress.floor) {
    state.progress.floor = floor;
  }
  return state.progress.floor >= obj.floor;
}

function _handleGhostInspectEvent(quest, state) {
  const obj = quest.objective;
  if (!state.progress.inspected) state.progress.inspected = 0;
  state.progress.inspected += 1;
  return state.progress.inspected >= obj.count;
}

// ─── Completion ───────────────────────────────────────────────────────────────

/**
 * Mark a quest as completed and deliver all rewards.
 * @param {string} id - Quest ID.
 */
function completeQuest(id) {
  const quest = getQuest(id);
  if (!quest) return;
  const state = GameState.quests[id];
  if (!state) return;

  state.status = 'completed';
  const reward = quest.reward;

  // 1. XP
  if (reward.xp > 0 && typeof gainXP === 'function') {
    gainXP(GameState.party, reward.xp);
    if (typeof addCombatLog === 'function') {
      addCombatLog(
        `Quest Complete: ${quest.name} — ${reward.xp.toLocaleString()} XP earned!`,
        'xp',
      );
    }
  }

  // 2. Coins
  if (reward.copper > 0) {
    GameState.copper = (GameState.copper || 0) + reward.copper;
    if (typeof normalizeCoins === 'function') normalizeCoins();
    if (typeof addCombatLog === 'function') {
      addCombatLog(`Quest Reward: ${reward.copper} copper received.`, 'loot');
    }
  }

  // 3. Items
  if (Array.isArray(reward.items)) {
    for (const { itemId, quantity } of reward.items) {
      if (typeof addToInventory === 'function') {
        addToInventory(itemId, quantity);
        if (typeof addCombatLog === 'function') {
          addCombatLog(`Quest Reward: ${quantity}x ${itemId} added to inventory.`, 'loot');
        }
      }
    }
  }

  // 4. Achievement
  if (reward.achievementId && typeof unlockAchievement === 'function') {
    unlockAchievement(reward.achievementId);
  }

  // 5. Persist and refresh UI
  saveQuests();
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderTopBar === 'function') renderTopBar();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
}

// ─── Module Export ────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  QUESTS,
  initQuests,
  saveQuests,
  getQuest,
  getQuestState,
  getQuestsForZone,
  getAvailableQuestsForZone,
  startQuest,
  checkQuestProgress,
  completeQuest,
  getActiveQuests,
  getCompletedQuests,
};
