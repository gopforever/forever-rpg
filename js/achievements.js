// achievements.js — Achievement & World First System for Forever RPG
// All data is client-side only, persisted in localStorage

// ─── Achievement Definitions ────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  // General
  { id: 'first_login',        category: 'general',     name: 'Welcome, Adventurer',   desc: 'Start the game for the first time',                          points: 10 },
  { id: 'first_kill',         category: 'general',     name: 'Blood on Your Hands',   desc: 'Kill your first enemy',                                      points: 10 },
  { id: 'first_death',        category: 'general',     name: 'Embraced by Darkness',  desc: 'Die for the first time',                                     points: 10 },
  { id: 'first_loot',         category: 'general',     name: 'Fortune Favors the Bold', desc: 'Loot your first item',                                     points: 10 },
  { id: 'first_group',        category: 'general',     name: 'Better Together',       desc: 'Create a party of 3+ members',                               points: 10 },
  { id: 'survive_10_fights',  category: 'general',     name: 'Battle Tested',         desc: 'Win 10 consecutive fights without dying', threshold: 10,     points: 10 },
  { id: 'reach_qeynos',       category: 'general',     name: 'City of Honor',         desc: 'Enter Qeynos (safe zone)',                                   points: 10 },

  // Advancement
  { id: 'level_5',            category: 'advancement', name: 'Seasoned',              desc: 'Reach level 5',                                              points: 10 },
  { id: 'level_10',           category: 'advancement', name: 'Veteran',               desc: 'Reach level 10',                                             points: 15 },
  { id: 'level_20',           category: 'advancement', name: 'Champion',              desc: 'Reach level 20',                                             points: 20 },
  { id: 'level_30',           category: 'advancement', name: 'Hero',                  desc: 'Reach level 30',                                             points: 25 },
  { id: 'level_50',           category: 'advancement', name: 'Legend',                desc: 'Reach level 50',                                             points: 30 },
  { id: 'level_60',           category: 'advancement', name: 'Transcendent',          desc: 'Reach level 60 (max)',                                       points: 50 },
  { id: 'earn_1000_xp',       category: 'advancement', name: 'Grinder',               desc: 'Earn 1,000 total XP',    threshold: 1000,                    points: 10 },
  { id: 'earn_100k_xp',       category: 'advancement', name: 'Relentless',            desc: 'Earn 100,000 total XP',  threshold: 100000,                  points: 10 },

  // Class
  { id: 'class_warrior',      category: 'class',       name: 'Steel and Will',        desc: 'Play as a Warrior',                                          points: 10 },
  { id: 'class_caster',       category: 'class',       name: 'Arcane Initiate',       desc: 'Play as any pure caster class',                              points: 10 },
  { id: 'class_healer',       category: 'class',       name: 'Keeper of Life',        desc: 'Play as a healer (cleric/druid/shaman)',                      points: 10 },
  { id: 'class_hybrid',       category: 'class',       name: 'Jack of All Trades',    desc: 'Play as a hybrid class',                                     points: 10 },

  // Keys (Zones)
  { id: 'zone_qeynos_hills',    category: 'keys',        name: 'Rolling Hills',         desc: 'Visit Qeynos Hills',                                       points: 10 },
  { id: 'zone_blackburrow',     category: 'keys',        name: 'Into the Dark',         desc: 'Visit Blackburrow',                                        points: 10 },
  { id: 'zone_everfrost',       category: 'keys',        name: 'Frozen Peaks',          desc: 'Visit Everfrost Peaks',                                    points: 10 },
  { id: 'zone_west_karana',     category: 'keys',        name: 'The Open Plains',       desc: 'Visit West Karana',                                        points: 10 },
  { id: 'zone_highpass',        category: 'keys',        name: 'Mountain Pass',         desc: 'Visit Highpass Hold',                                      points: 10 },
  { id: 'zone_kithicor',        category: 'keys',        name: 'Cursed Forest',         desc: 'Visit Kithicor Forest',                                    points: 10 },
  { id: 'zone_commonlands',     category: 'keys',        name: 'The Commonlands',       desc: 'Visit Commonlands',                                        points: 10 },
  { id: 'zone_plane_of_fear',   category: 'keys',        name: 'Into the Plane of Fear', desc: 'Visit the Plane of Fear',                                points: 10 },
  { id: 'zone_lake_of_ill_omen',category: 'keys',        name: 'Ill Omens',             desc: 'Visit the Lake of Ill Omen',                               points: 10 },
  { id: 'zone_befallen',        category: 'keys',        name: 'Into Befallen',         desc: 'Visit Befallen',                                           points: 10 },
  { id: 'all_zones',            category: 'keys',        name: 'World Traveler',        desc: 'Visit all zones',                                          points: 25 },

  // Level (Kill counts)
  { id: 'kill_10',            category: 'level',       name: 'Slayer',                desc: 'Kill 10 enemies',          threshold: 10,                    points: 10 },
  { id: 'kill_100',           category: 'level',       name: 'Destroyer',             desc: 'Kill 100 enemies',         threshold: 100,                   points: 15 },
  { id: 'kill_500',           category: 'level',       name: 'Warlord',               desc: 'Kill 500 enemies',         threshold: 500,                   points: 20 },
  { id: 'kill_1000',          category: 'level',       name: 'Massacre',              desc: 'Kill 1,000 enemies',       threshold: 1000,                  points: 25 },
  { id: 'kill_5000',          category: 'level',       name: 'Avatar of Death',       desc: 'Kill 5,000 enemies',       threshold: 5000,                  points: 50 },
  { id: 'kill_one_of_each',   category: 'level',       name: 'Completionist',         desc: 'Kill at least one of every enemy type',                      points: 25 },
  { id: 'kill_rare',          category: 'level',       name: 'Named Slayer',          desc: 'Kill a rare/named enemy',                                    points: 10 },
  { id: 'named_5',            category: 'level',       name: 'Rare Hunter',           desc: 'Kill 5 different named enemies', threshold: 5,               points: 15 },

  // Progression
  { id: 'equip_rare',         category: 'progression', name: 'Rare Find',             desc: 'Equip a rare-quality item',                                  points: 10 },
  { id: 'equip_full_set',     category: 'progression', name: 'Fully Geared',          desc: 'Have gear in all 20 equipment slots',                        points: 25 },
  { id: 'bank_10_items',      category: 'progression', name: 'Pack Rat',              desc: 'Store 10 items in the bank', threshold: 10,                  points: 10 },
  { id: 'buy_spell',          category: 'progression', name: 'Scrollkeeper',          desc: 'Purchase your first spell from the guild',                   points: 10 },
  { id: 'use_ability',        category: 'progression', name: 'Power Unleashed',       desc: 'Use a class ability in combat',                              points: 10 },

  // Skills
  { id: 'skill_25',           category: 'skills',      name: 'Apprentice',            desc: 'Reach skill level 25 in any skill',  threshold: 25,           points: 10 },
  { id: 'skill_50',           category: 'skills',      name: 'Journeyman',            desc: 'Reach skill level 50 in any skill',  threshold: 50,           points: 10 },
  { id: 'skill_100',          category: 'skills',      name: 'Master',                desc: 'Reach skill level 100 in any skill', threshold: 100,          points: 10 },
  { id: 'skill_200',          category: 'skills',      name: 'Grandmaster',           desc: 'Reach skill level 200 in any skill', threshold: 200,          points: 10 },

  // Special
  { id: 'buy_from_market',    category: 'special',     name: 'Savvy Shopper',         desc: 'Buy from the player marketplace',                            points: 10 },
  { id: 'sell_on_market',     category: 'special',     name: 'Merchant',              desc: 'List an item on the Player Marketplace',                     points: 10 },
  { id: 'gold_1000',          category: 'special',     name: 'Coin Collector',        desc: 'Accumulate 1,000 copper (or equivalent)', threshold: 1000,    points: 10 },
  { id: 'gold_10000',         category: 'special',     name: 'Merchant Prince',       desc: 'Accumulate 10,000 copper', threshold: 10000,                 points: 10 },
  { id: 'survive_rare',       category: 'special',     name: 'Against the Odds',      desc: 'Kill a rare/named enemy at lower level than it',             points: 10 },
  { id: 'win_without_healer', category: 'special',     name: 'No Safety Net',         desc: 'Win a fight with 3+ enemies and no healer in party',         points: 10 },

  // Vanity
  { id: 'inspect_ghost',      category: 'vanity',      name: 'People Watcher',        desc: 'Inspect a ghost player',                                     points: 10 },
  { id: 'zone_chat_10',       category: 'vanity',      name: 'Social Butterfly',      desc: 'See 10 zone chat messages', threshold: 10,                   points: 10 },
  { id: 'world_first_witness',category: 'vanity',      name: 'History Maker',         desc: 'Be online when a World First occurs',                        points: 10 },

  // Dungeon — Blackburrow
  { id: 'bb_enter',             category: 'dungeon', name: 'Smells Like Wet Dog',            desc: 'Enter Blackburrow for the first time',                         points: 10 },
  { id: 'bb_floor2',            category: 'dungeon', name: 'Going Deeper',                   desc: 'Reach Floor 2 of Blackburrow',                                 points: 10 },
  { id: 'bb_floor3',            category: 'dungeon', name: 'No Way Back Up',                 desc: "Reach Floor 3 of Blackburrow — The Shaman's Den",              points: 10 },
  { id: 'bb_floor4',            category: 'dungeon', name: "Where the Sun Doesn't Reach",    desc: 'Reach Floor 4 of Blackburrow — The Deep Warrens',              points: 10 },
  { id: 'bb_floor5',            category: 'dungeon', name: 'Audience With the Warlord',      desc: 'Reach Floor 5 of Blackburrow — The Darkpaw Throne',            points: 10 },
  { id: 'bb_clear',             category: 'dungeon', name: 'Blackburrow Cleared',            desc: 'Defeat Tranixx Darkpaw and complete Blackburrow',               points: 25 },
  { id: 'bb_brewer_slain',      category: 'dungeon', name: 'Last Call',                      desc: 'Slay the Gnoll Brewer in Blackburrow',                         points: 10 },
  { id: 'bb_master_brewer',     category: 'dungeon', name: 'The Brew Stops Here',            desc: 'Slay the Master Brewer in Blackburrow',                        points: 10 },
  { id: 'bb_high_shaman',       category: 'dungeon', name: 'Silenced the Spirits',           desc: 'Slay the Gnoll High Shaman in Blackburrow',                    points: 10 },
  { id: 'bb_lord_elgnub',       category: 'dungeon', name: 'Dethroned',                      desc: 'Slay Lord Elgnub, ruler of the deep warrens',                  points: 10 },
  { id: 'bb_tranixx',           category: 'dungeon', name: 'The Darkpaw Falls',              desc: 'Slay Tranixx Darkpaw, the legendary warlord of Blackburrow',   points: 10 },
  { id: 'bb_no_deaths',         category: 'dungeon', name: 'Clean Paws',                     desc: 'Clear Blackburrow without a single party death',               points: 25 },
  { id: 'bb_all_floors_solo',   category: 'dungeon', name: 'One Gnoll Army',                 desc: 'Clear all 5 floors of Blackburrow solo (party of 1)',           points: 25 },
  { id: 'bb_speed_clear',       category: 'dungeon', name: 'Like a Bat Out of Blackburrow',  desc: 'Clear Blackburrow in under 10 minutes',                         points: 25 },
  { id: 'bb_stout_collector',   category: 'dungeon', name: 'Blackburrow Stout Connoisseur',  desc: 'Loot 5 Blackburrow Stouts', threshold: 5,                      points: 10 },
  { id: 'bb_gnoll_genocide',    category: 'dungeon', name: 'Gnoll Exterminatus',             desc: 'Kill 100 gnolls inside Blackburrow', threshold: 100,            points: 10 },
  { id: 'bb_pelt_collector',    category: 'dungeon', name: 'Furrier of the Year',            desc: 'Collect 10 Blackburrow Gnoll Pelts', threshold: 10,             points: 10 },
  { id: 'bb_poisoned_survivor', category: 'dungeon', name: 'Built Different',                desc: 'Survive a poison proc from a gnoll shaman and still win the fight', points: 10 },
  { id: 'bb_train_survivor',    category: 'dungeon', name: 'Caught a Train',                 desc: 'Win a fight against 4 or more Blackburrow enemies at once',    points: 10 },
  { id: 'bb_tranixx_loot',      category: 'dungeon', name: 'Trophies from the Dark',         desc: 'Loot a named item from Tranixx Darkpaw',                       points: 10 },

  // Dungeon — Befallen
  { id: 'bef_enter',             category: 'dungeon', name: 'Where Light Has Forgotten',       desc: 'Enter Befallen for the first time',                                              points: 10 },
  { id: 'bef_floor2',            category: 'dungeon', name: 'Deeper Into Darkness',            desc: 'Reach Floor 2 of Befallen — The Haunted Halls',                                  points: 10 },
  { id: 'bef_floor3',            category: 'dungeon', name: 'The Rot Sets In',                 desc: 'Reach Floor 3 of Befallen — The Rotting Depths',                                 points: 10 },
  { id: 'bef_floor4',            category: 'dungeon', name: 'Shadow Sworn',                    desc: 'Reach Floor 4 of Befallen — The Crypt of Shadows',                               points: 10 },
  { id: 'bef_floor5',            category: 'dungeon', name: 'The Sanctum Awaits',              desc: 'Reach Floor 5 of Befallen — The Sanctum of Marnek',                              points: 10 },
  { id: 'bef_floor6',            category: 'dungeon', name: 'Audience With Darkness',          desc: 'Reach Floor 6 of Befallen — The Dark Throne',                                   points: 10 },
  { id: 'bef_clear',             category: 'dungeon', name: 'Befallen Conquered',              desc: 'Defeat Gynok Moltor and purge Befallen',                                         points: 25 },
  { id: 'bef_boondin',           category: 'dungeon', name: 'Uninvited Guest',                 desc: 'Slay Boondin Babbinsbort in Befallen',                                           points: 10 },
  { id: 'bef_lrodd',             category: 'dungeon', name: 'Bones of the Past',               desc: 'Slay Skeleton Lrodd',                                                            points: 10 },
  { id: 'bef_elf_skeleton',      category: 'dungeon', name: 'Fallen Elf',                      desc: 'Slay An Elf Skeleton',                                                           points: 10 },
  { id: 'bef_windstream',        category: 'dungeon', name: 'The Commander Falls',             desc: 'Slay Commander Windstream',                                                      points: 10 },
  { id: 'bef_amiaz',             category: 'dungeon', name: 'Heretic No More',                 desc: 'Slay Priest Amiaz',                                                              points: 10 },
  { id: 'bef_thaumaturgist',     category: 'dungeon', name: 'Silenced the Thaumaturgy',        desc: 'Slay The Thaumaturgist',                                                         points: 10 },
  { id: 'bef_gynok',             category: 'dungeon', name: "The Traitor's End",               desc: 'Slay Gynok Moltor, the fallen paladin who betrayed the light',                   points: 10 },
  { id: 'bef_no_deaths',         category: 'dungeon', name: 'Untouchable in the Dark',         desc: 'Clear Befallen without a single party death',                                    points: 25 },
  { id: 'bef_solo',              category: 'dungeon', name: 'Into Darkness Alone',             desc: 'Clear all 6 floors of Befallen solo (party of 1)',                               points: 25 },
  { id: 'bef_speed_clear',       category: 'dungeon', name: 'Racing the Reaper',               desc: 'Clear Befallen in under 15 minutes',                                                 points: 25 },
  { id: 'bef_undead_slayer',     category: 'dungeon', name: 'Bane of the Undead',              desc: 'Kill 150 undead enemies inside Befallen', threshold: 150,                        points: 10 },
  { id: 'bef_all_named',         category: 'dungeon', name: 'No Survivors',                    desc: 'Kill every named NPC in Befallen in a single run', threshold: 7,                 points: 10 },
  { id: 'bef_cursed_loot',       category: 'dungeon', name: 'Touched by Marnek',               desc: 'Loot the Dagger of Marnek from Gynok Moltor',                                    points: 10 },
  { id: 'bef_bone_claymore',     category: 'dungeon', name: 'The Bone Blade',                  desc: 'Loot the Bone Bladed Claymore from Gynok Moltor',                                points: 10 },
  { id: 'bef_train_survivor',    category: 'dungeon', name: 'Shadow Train',                    desc: 'Win a fight against 4 or more Befallen enemies at once',                         points: 10 },
  { id: 'bef_disease_survivor',  category: 'dungeon', name: 'Plague Resistant',                desc: 'Survive a disease proc from a Befallen undead and still win the fight',           points: 10 },

  // Gathering
  { id: 'gathering_first',             category: 'gathering', name: 'Gatherer',               desc: 'Complete your first gathering action',                                      points: 10 },
  { id: 'gathering_mining_50',         category: 'gathering', name: 'Rock Solid',             desc: 'Reach Mining level 50',             threshold: 50,                         points: 15 },
  { id: 'gathering_mining_100',        category: 'gathering', name: 'Master Miner',           desc: 'Reach Mining level 100',            threshold: 100,                        points: 25 },
  { id: 'gathering_mining_200',        category: 'gathering', name: 'Legend of the Deep',     desc: 'Reach Mining level 200 (max)',      threshold: 200,                        points: 50 },
  { id: 'gathering_lumberjacking_50',  category: 'gathering', name: 'Timber!',                desc: 'Reach Lumberjacking level 50',      threshold: 50,                         points: 15 },
  { id: 'gathering_lumberjacking_100', category: 'gathering', name: 'Master Lumberjack',      desc: 'Reach Lumberjacking level 100',     threshold: 100,                        points: 25 },
  { id: 'gathering_foraging_50',       category: 'gathering', name: 'Herbalist',              desc: 'Reach Foraging level 50',           threshold: 50,                         points: 15 },
  { id: 'gathering_foraging_100',      category: 'gathering', name: 'Master Forager',         desc: 'Reach Foraging level 100',          threshold: 100,                        points: 25 },
  { id: 'gathering_hunting_50',        category: 'gathering', name: 'Big Game Hunter',        desc: 'Reach Hunting level 50',            threshold: 50,                         points: 15 },
  { id: 'gathering_hunting_100',       category: 'gathering', name: 'Master Hunter',          desc: 'Reach Hunting level 100',           threshold: 100,                        points: 25 },
  { id: 'gathering_farming_50',        category: 'gathering', name: 'Green Thumb',            desc: 'Reach Farming level 50',            threshold: 50,                         points: 15 },
  { id: 'gathering_farming_100',       category: 'gathering', name: 'Master Farmer',          desc: 'Reach Farming level 100',           threshold: 100,                        points: 25 },
  { id: 'gathering_all_max',           category: 'gathering', name: 'Renaissance Gatherer',   desc: 'Reach level 200 in all 5 gathering disciplines',                            points: 100 },
  { id: 'gathering_mastery_25',        category: 'gathering', name: 'Node Expert',            desc: 'Reach mastery level 25 on any gathering node',  threshold: 25,             points: 10 },
  { id: 'gathering_mastery_99',        category: 'gathering', name: 'Node Master',            desc: 'Reach mastery level 99 on any gathering node',  threshold: 99,             points: 25 },
];

// ─── Class groups (derived from CLASSES archetype field in classes.js) ───────────

const CASTER_CLASSES = Object.keys(CLASSES).filter(id => CLASSES[id].archetype === 'Caster');
const HEALER_CLASSES = Object.keys(CLASSES).filter(id => CLASSES[id].archetype === 'Priest');
const HYBRID_CLASSES = Object.keys(CLASSES).filter(id => CLASSES[id].archetype === 'Hybrid');

// ─── Storage ─────────────────────────────────────────────────────────────────────

const ACHIEVEMENT_SAVE_KEY  = 'foreverRPG_achievements';
const WORLD_FIRSTS_SAVE_KEY = 'foreverRPG_worldFirsts';

let _achievements = [];
let _worldFirsts  = {};

// ─── Load / Save ─────────────────────────────────────────────────────────────────

function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_SAVE_KEY);
    const saved = raw ? JSON.parse(raw) : [];
    // Build map from saved data
    const savedMap = {};
    for (const rec of saved) savedMap[rec.id] = rec;
    // Merge: every defined achievement gets a record
    _achievements = ACHIEVEMENTS.map(def => savedMap[def.id] || { id: def.id, unlockedAt: null, progress: 0 });
  } catch (_) {
    _achievements = ACHIEVEMENTS.map(def => ({ id: def.id, unlockedAt: null, progress: 0 }));
  }
}

function saveAchievements() {
  try {
    localStorage.setItem(ACHIEVEMENT_SAVE_KEY, JSON.stringify(_achievements));
  } catch (_) {}
}

function loadWorldFirsts() {
  try {
    const raw = localStorage.getItem(WORLD_FIRSTS_SAVE_KEY);
    _worldFirsts = raw ? JSON.parse(raw) : {};
  } catch (_) {
    _worldFirsts = {};
  }
}

function saveWorldFirsts() {
  try {
    localStorage.setItem(WORLD_FIRSTS_SAVE_KEY, JSON.stringify(_worldFirsts));
  } catch (_) {}
}

// ─── Getters ──────────────────────────────────────────────────────────────────────

function getAchievement(id) {
  return _achievements.find(r => r.id === id) || null;
}

function isUnlocked(id) {
  const rec = getAchievement(id);
  return rec ? rec.unlockedAt !== null : false;
}

function getUnlockedCount() {
  return _achievements.filter(r => r.unlockedAt !== null).length;
}

function getTotalCount() {
  return _achievements.length;
}

function getAchievementsByCategory(category) {
  return ACHIEVEMENTS
    .filter(def => def.category === category)
    .map(def => {
      const rec = getAchievement(def.id) || { id: def.id, unlockedAt: null, progress: 0 };
      return { ...def, ...rec };
    });
}

function getWorldFirsts() {
  return _worldFirsts;
}

// ─── Unlock ────────────────────────────────────────────────────────────────────────

function unlockAchievement(id) {
  const rec = getAchievement(id);
  if (!rec || rec.unlockedAt !== null) return;
  rec.unlockedAt = Date.now();
  const def = ACHIEVEMENTS.find(d => d.id === id);
  if (def) onAchievementUnlocked(def);
  saveAchievements();
}

function updateAchievementProgress(id, value) {
  const rec = getAchievement(id);
  if (!rec || rec.unlockedAt !== null) return;
  rec.progress = value;
  const def = ACHIEVEMENTS.find(d => d.id === id);
  if (def && def.threshold !== undefined && value >= def.threshold) {
    unlockAchievement(id);
  } else {
    saveAchievements();
  }
}

// ─── Notification ──────────────────────────────────────────────────────────────────

function onAchievementUnlocked(achievement) {
  if (typeof showAchievementToast === 'function') {
    showAchievementToast(achievement);
  }
}

// ─── World Firsts ──────────────────────────────────────────────────────────────────

function recordWorldFirst(eventKey, who, detail) {
  if (_worldFirsts[eventKey]) return; // Already claimed
  _worldFirsts[eventKey] = { who, when: Date.now(), detail };
  saveWorldFirsts();

  // Push to world feed if available
  if (typeof pushWorldEvent === 'function') {
    pushWorldEvent(`🌟 <strong>WORLD FIRST</strong> — ${detail}`);
  }

  // The real player witnesses a World First
  if (typeof checkAchievements === 'function') {
    checkAchievements('world_first_witness', {});
  }
}

// ─── Achievement Checking ──────────────────────────────────────────────────────────

// Zone-id → achievement-id mapping
const ZONE_ACH_MAP = {
  qeynos_hills:     'zone_qeynos_hills',
  blackburrow:      'zone_blackburrow',
  befallen:         'zone_befallen',
  everfrost_peaks:  'zone_everfrost',
  west_karana:      'zone_west_karana',
  highpass_hold:    'zone_highpass',
  kithicor_forest:  'zone_kithicor',
  commonlands:      'zone_commonlands',
  plane_of_fear:    'zone_plane_of_fear',
  lake_of_ill_omen: 'zone_lake_of_ill_omen',
};

// All zone IDs that must be visited for "World Traveler"
const ALL_ZONE_IDS = Object.keys(ZONE_ACH_MAP);

let _consecutiveWins = 0;

function checkAchievements(event, data) {
  if (!_achievements.length) {
    console.warn('[Achievements] checkAchievements called before initAchievements(); event dropped:', event);
    return;
  }

  switch (event) {
    case 'first_login':
      unlockAchievement('first_login');
      break;

    case 'kill': {
      const { enemy, totalKills, killCounts, party } = data || {};
      // First kill
      if (totalKills >= 1) unlockAchievement('first_kill');

      // Kill count milestones
      updateAchievementProgress('kill_10',   totalKills);
      updateAchievementProgress('kill_100',  totalKills);
      updateAchievementProgress('kill_500',  totalKills);
      updateAchievementProgress('kill_1000', totalKills);
      updateAchievementProgress('kill_5000', totalKills);

      // Kill one of each enemy type
      if (killCounts && typeof ENEMIES !== 'undefined') {
        const allIds = Object.keys(ENEMIES);
        if (allIds.length && allIds.every(id => (killCounts[id] || 0) >= 1)) {
          unlockAchievement('kill_one_of_each');
        }
      }

      // Rare / named kill
      if (enemy && enemy.isRare) {
        unlockAchievement('kill_rare');

        // Track named kills for namedKills progress
        if (typeof GameState !== 'undefined') {
          GameState.namedKills = (GameState.namedKills || 0) + 1;
          updateAchievementProgress('named_5', GameState.namedKills);

          // Survive rare: kill rare enemy whose level > party leader level
          if (party && party.length) {
            const leaderLevel = party[0].level || 1;
            if ((enemy.level || 1) > leaderLevel) {
              unlockAchievement('survive_rare');
            }
          }
        }
      }

      // Win without healer: tracked in fight_win; noted here for context
      break;
    }

    case 'loot': {
      unlockAchievement('first_loot');

      // Check full equipment set for party leader
      if (typeof GameState !== 'undefined' && GameState.party && GameState.party.length) {
        const leader = GameState.party[0];
        const equip  = leader.equipment || {};
        const SLOTS  = ['head','face','ear1','ear2','neck','shoulders','back','chest',
                        'wrist_l','wrist_r','hands','waist','legs','feet',
                        'primary','secondary','range','ammo','ring1','ring2'];
        if (SLOTS.every(s => equip[s])) {
          unlockAchievement('equip_full_set');
        }
      }
      break;
    }

    case 'equip': {
      const { item } = data || {};
      if (item && (item.rarity === 'rare' || item.rarity === 'named')) {
        unlockAchievement('equip_rare');
      }

      // Check full equipment set for party leader
      if (typeof GameState !== 'undefined' && GameState.party && GameState.party.length) {
        const leader = GameState.party[0];
        const equip  = leader.equipment || {};
        const SLOTS  = ['head','face','ear1','ear2','neck','shoulders','back','chest',
                        'wrist_l','wrist_r','hands','waist','legs','feet',
                        'primary','secondary','range','ammo','ring1','ring2'];
        if (SLOTS.every(s => equip[s])) {
          unlockAchievement('equip_full_set');
        }
      }
      break;
    }

    case 'level_up': {
      const { member, level, totalXP } = data || {};
      if (!member) break;

      const lvlMap = { 5: 'level_5', 10: 'level_10', 20: 'level_20', 30: 'level_30', 50: 'level_50', 60: 'level_60' };
      if (lvlMap[level]) unlockAchievement(lvlMap[level]);

      if (totalXP !== undefined) {
        updateAchievementProgress('earn_1000_xp',  totalXP);
        updateAchievementProgress('earn_100k_xp',  totalXP);
      }

      if (level === 60) {
        if (typeof recordWorldFirst === 'function') {
          recordWorldFirst('first_level_60', member.name, `${member.name} reached Level 60!`);
        }
      }
      break;
    }

    case 'zone_change': {
      const { zoneId, visitedZones } = data || {};

      // Check safe zone (Qeynos)
      if (zoneId === 'qeynos') unlockAchievement('reach_qeynos');

      const achId = ZONE_ACH_MAP[zoneId];
      if (achId) unlockAchievement(achId);

      // World First zone discovery
      if (typeof recordWorldFirst === 'function') {
        const zoneName = (typeof ZONES !== 'undefined' && ZONES[zoneId]) ? ZONES[zoneId].name : zoneId;
        const playerName = (typeof GameState !== 'undefined' && GameState.party && GameState.party.length)
          ? GameState.party[0].name
          : 'You';
        recordWorldFirst(`first_zone_${zoneId}`, playerName, `${playerName} discovered ${zoneName} first!`);
      }

      // All zones
      const visited = visitedZones instanceof Set ? visitedZones : new Set(visitedZones || []);
      if (ALL_ZONE_IDS.every(z => visited.has(z))) {
        unlockAchievement('all_zones');
      }

      // Blackburrow entry
      if (zoneId === 'blackburrow') {
        unlockAchievement('bb_enter');
        checkAchievements('dungeon_floor', { dungeonId: 'blackburrow', floor: 1 });
      }

      // Befallen entry
      if (zoneId === 'befallen') {
        unlockAchievement('bef_enter');
        checkAchievements('dungeon_floor', { dungeonId: 'befallen', floor: 1 });
      }
      break;
    }

    case 'skill_up': {
      const { value } = data || {};
      if (value >= 25)  updateAchievementProgress('skill_25',  value);
      if (value >= 50)  updateAchievementProgress('skill_50',  value);
      if (value >= 100) updateAchievementProgress('skill_100', value);
      if (value >= 200) updateAchievementProgress('skill_200', value);
      break;
    }

    case 'bank_deposit': {
      const { bankSize } = data || {};
      if (bankSize !== undefined) updateAchievementProgress('bank_10_items', bankSize);
      break;
    }

    case 'spell_buy':
      unlockAchievement('buy_spell');
      break;

    case 'ability_use':
      unlockAchievement('use_ability');
      break;

    case 'market_buy':
      unlockAchievement('buy_from_market');
      break;

    case 'market_sell':
      unlockAchievement('sell_on_market');
      break;

    case 'inspect':
      unlockAchievement('inspect_ghost');
      break;

    case 'chat_message': {
      if (typeof GameState !== 'undefined') {
        GameState.chatMessagesSeen = (GameState.chatMessagesSeen || 0) + 1;
        updateAchievementProgress('zone_chat_10', GameState.chatMessagesSeen);
      }
      break;
    }

    case 'party_size': {
      const { size } = data || {};
      if (size >= 3) unlockAchievement('first_group');
      break;
    }

    case 'class': {
      const { party } = data || {};
      if (!party || !party.length) break;
      for (const m of party) {
        const cls = m.classId;
        if (cls === 'warrior')             unlockAchievement('class_warrior');
        if (CASTER_CLASSES.includes(cls))  unlockAchievement('class_caster');
        if (HEALER_CLASSES.includes(cls))  unlockAchievement('class_healer');
        if (HYBRID_CLASSES.includes(cls))  unlockAchievement('class_hybrid');
      }
      break;
    }

    case 'gold': {
      const { totalCopper } = data || {};
      if (totalCopper !== undefined) {
        updateAchievementProgress('gold_1000',  totalCopper);
        updateAchievementProgress('gold_10000', totalCopper);
      }
      break;
    }

    case 'fight_win': {
      _consecutiveWins++;
      updateAchievementProgress('survive_10_fights', _consecutiveWins);

      const { party, enemyCount } = data || {};
      // Win without healer: 3+ enemies, no healer in party
      if (party && (enemyCount || 0) >= 3) {
        const hasHealer = party.some(m => HEALER_CLASSES.includes(m.classId));
        if (!hasHealer) unlockAchievement('win_without_healer');
      }
      break;
    }

    case 'fight_loss':
      unlockAchievement('first_death');
      _consecutiveWins = 0;
      if (typeof GameState !== 'undefined') GameState.consecutiveWins = 0;
      break;

    case 'world_first_witness':
      unlockAchievement('world_first_witness');
      break;

    case 'dungeon_floor': {
      const { dungeonId, floor } = data || {};
      if (dungeonId === 'blackburrow') {
        if (floor >= 1) unlockAchievement('bb_enter');
        if (floor >= 2) unlockAchievement('bb_floor2');
        if (floor >= 3) unlockAchievement('bb_floor3');
        if (floor >= 4) unlockAchievement('bb_floor4');
        if (floor >= 5) unlockAchievement('bb_floor5');
      } else if (dungeonId === 'befallen') {
        if (floor >= 1) unlockAchievement('bef_enter');
        if (floor >= 2) unlockAchievement('bef_floor2');
        if (floor >= 3) unlockAchievement('bef_floor3');
        if (floor >= 4) unlockAchievement('bef_floor4');
        if (floor >= 5) unlockAchievement('bef_floor5');
        if (floor >= 6) unlockAchievement('bef_floor6');
      }
      break;
    }

    case 'dungeon_boss_kill': {
      const { dungeonId, bossId, party, timeSeconds, noDeath } = data || {};
      if (dungeonId === 'blackburrow') {
        if (bossId === 'gnoll_brewer')         unlockAchievement('bb_brewer_slain');
        if (bossId === 'master_brewer')        unlockAchievement('bb_master_brewer');
        if (bossId === 'gnoll_high_shaman_bb') unlockAchievement('bb_high_shaman');
        if (bossId === 'lord_elgnub')          unlockAchievement('bb_lord_elgnub');
        if (bossId === 'tranixx_darkpaw') {
          unlockAchievement('bb_tranixx');
          unlockAchievement('bb_clear');
          if (noDeath) unlockAchievement('bb_no_deaths');
          if (party && party.length === 1) unlockAchievement('bb_all_floors_solo');
          if (timeSeconds !== undefined && timeSeconds <= 600) unlockAchievement('bb_speed_clear');
          if (typeof recordWorldFirst === 'function' && party && party.length) {
            const playerName = party[0].name || 'Someone';
            recordWorldFirst('first_tranixx_darkpaw', playerName, `${playerName} was first to slay Tranixx Darkpaw in Blackburrow!`);
          }
        }
      } else if (dungeonId === 'befallen') {
        if (bossId === 'boondin_babbinsbort')  unlockAchievement('bef_boondin');
        if (bossId === 'skeleton_lrodd')        unlockAchievement('bef_lrodd');
        if (bossId === 'an_elf_skeleton')       unlockAchievement('bef_elf_skeleton');
        if (bossId === 'commander_windstream')  unlockAchievement('bef_windstream');
        if (bossId === 'priest_amiaz')          unlockAchievement('bef_amiaz');
        if (bossId === 'the_thaumaturgist')     unlockAchievement('bef_thaumaturgist');
        if (bossId === 'gynok_moltor') {
          unlockAchievement('bef_gynok');
          unlockAchievement('bef_clear');
          if (noDeath) unlockAchievement('bef_no_deaths');
          if (party && party.length === 1) unlockAchievement('bef_solo');
          if (timeSeconds !== undefined && timeSeconds <= 900) unlockAchievement('bef_speed_clear');
          if (typeof recordWorldFirst === 'function' && party && party.length) {
            const playerName = party[0].name || 'Someone';
            recordWorldFirst('first_gynok_moltor', playerName, `${playerName} was first to slay Gynok Moltor in Befallen!`);
          }
        }
      }
      break;
    }

    case 'dungeon_loot': {
      const { dungeonId, itemId, item } = data || {};
      if (dungeonId === 'blackburrow') {
        if (itemId === 'blackburrow_stout') {
          if (typeof GameState !== 'undefined') {
            GameState.bb_stoutCount = (GameState.bb_stoutCount || 0) + 1;
            updateAchievementProgress('bb_stout_collector', GameState.bb_stoutCount);
          }
        }
        if (itemId === 'blackburrow_gnoll_pelt' || itemId === 'blackburrow_gnoll_skin' || itemId === 'ruined_blackburrow_gnoll_pelt') {
          if (typeof GameState !== 'undefined') {
            GameState.bb_peltCount = (GameState.bb_peltCount || 0) + 1;
            updateAchievementProgress('bb_pelt_collector', GameState.bb_peltCount);
          }
        }
        if (item && item.rarity === 'named' && (itemId === 'darkpaw_hide_cloak' || itemId === 'darkpaw_fang_necklace')) {
          unlockAchievement('bb_tranixx_loot');
        }
      } else if (dungeonId === 'befallen') {
        if (itemId === 'dagger_of_marnek')     unlockAchievement('bef_cursed_loot');
        if (itemId === 'bone_bladed_claymore') unlockAchievement('bef_bone_claymore');
      }
      break;
    }

    case 'dungeon_kill': {
      const { dungeonId, enemyId, enemy, enemyCount, party } = data || {};
      if (dungeonId === 'blackburrow') {
        const gnollIds = [
          'gnoll_pup', 'a_scrawny_gnoll', 'scrawny_gnoll', 'a_gnoll_guard', 'burly_gnoll', 'a_burly_gnoll',
          'gnoll_guard', 'a_gnoll_shaman', 'gnoll_shaman', 'a_gnoll_guard_elite', 'gnoll_commander',
          'gnoll_commander_bb', 'gnoll_high_shaman', 'gnoll_high_shaman_bb', 'lord_elgnub',
          'gnoll_brewer', 'master_brewer', 'tranixx_darkpaw',
        ];
        if (gnollIds.includes(enemyId)) {
          if (typeof GameState !== 'undefined') {
            GameState.bb_gnollKills = (GameState.bb_gnollKills || 0) + 1;
            updateAchievementProgress('bb_gnoll_genocide', GameState.bb_gnollKills);
          }
        }
        if ((enemyCount || 0) >= 4) {
          unlockAchievement('bb_train_survivor');
        }
        if (enemy && enemy.statusProcs && enemy.statusProcs.some(p => p.type === 'poison') && party && party.every(m => m.hp > 0)) {
          unlockAchievement('bb_poisoned_survivor');
        }
      } else if (dungeonId === 'befallen') {
        const befUndeadIds = [
          'skeleton', 'dread_bone_skeleton', 'putrid_skeleton', 'decaying_skeleton',
          'large_skeleton', 'greater_skeleton', 'lesser_mummy', 'ice_bone_skeleton',
          'ghoul', 'skeleton_lrodd', 'an_elf_skeleton', 'gynok_moltor',
        ];
        if (befUndeadIds.includes(enemyId)) {
          if (typeof GameState !== 'undefined') {
            GameState.bef_undeadKills = (GameState.bef_undeadKills || 0) + 1;
            updateAchievementProgress('bef_undead_slayer', GameState.bef_undeadKills);
          }
        }
        if ((enemyCount || 0) >= 4) {
          unlockAchievement('bef_train_survivor');
        }
        if (enemy && enemy.statusProcs && enemy.statusProcs.some(p => p.type === 'disease') && enemy.isUndead && party && party.every(m => m.hp > 0)) {
          unlockAchievement('bef_disease_survivor');
        }
        const befNamedIds = [
          'boondin_babbinsbort', 'skeleton_lrodd', 'an_elf_skeleton',
          'commander_windstream', 'priest_amiaz', 'the_thaumaturgist', 'gynok_moltor',
        ];
        if (befNamedIds.includes(enemyId)) {
          if (typeof GameState !== 'undefined') {
            GameState.bef_namedKills = (GameState.bef_namedKills || 0) + 1;
            updateAchievementProgress('bef_all_named', GameState.bef_namedKills);
          }
        }
      }
      break;
    }

    case 'gathering_action': {
      const { discipline, newLevel, masteryLevel } = data || {};
      unlockAchievement('gathering_first');

      const levelMap = {
        mining:        { 50: 'gathering_mining_50',        100: 'gathering_mining_100',        200: 'gathering_mining_200' },
        lumberjacking: { 50: 'gathering_lumberjacking_50', 100: 'gathering_lumberjacking_100' },
        foraging:      { 50: 'gathering_foraging_50',      100: 'gathering_foraging_100' },
        hunting:       { 50: 'gathering_hunting_50',       100: 'gathering_hunting_100' },
        farming:       { 50: 'gathering_farming_50',       100: 'gathering_farming_100' },
      };
      if (discipline && newLevel && levelMap[discipline] && levelMap[discipline][newLevel]) {
        unlockAchievement(levelMap[discipline][newLevel]);
      }

      // All gathering skills at max (200)
      if (typeof GameState !== 'undefined' && GameState.party && GameState.party.length) {
        const leader = GameState.party[0];
        if (leader.gathering) {
          const allMax = ['mining', 'lumberjacking', 'foraging', 'hunting', 'farming'].every(d => {
            const gs = leader.gathering[d];
            return gs && gs.level >= 200;
          });
          if (allMax) unlockAchievement('gathering_all_max');
        }
      }

      // Mastery milestones
      if (masteryLevel !== undefined) {
        if (masteryLevel >= 25) updateAchievementProgress('gathering_mastery_25', masteryLevel);
        if (masteryLevel >= 99) updateAchievementProgress('gathering_mastery_99', masteryLevel);
      }
      break;
    }

    default:
      break;
  }
}

// ─── Initialization ────────────────────────────────────────────────────────────────

function initAchievements() {
  loadAchievements();
  loadWorldFirsts();

  // Startup checks
  unlockAchievement('first_login');

  if (typeof GameState !== 'undefined') {
    // Class achievements from existing party
    if (GameState.party && GameState.party.length) {
      checkAchievements('class', { party: GameState.party });
      if (GameState.party.length >= 3) checkAchievements('party_size', { size: GameState.party.length });
    }

    // Zone achievements from visited zones
    if (GameState.visitedZones && GameState.visitedZones.length) {
      for (const zId of GameState.visitedZones) {
        checkAchievements('zone_change', { zoneId: zId, visitedZones: new Set(GameState.visitedZones) });
      }
    }

    // Gold check
    const totalCopper = ((GameState.gold || 0) * 1000) + ((GameState.silver || 0) * 100) + (GameState.copper || 0);
    checkAchievements('gold', { totalCopper });

    // XP check
    const totalXP = GameState.totalXP || 0;
    if (totalXP > 0) {
      updateAchievementProgress('earn_1000_xp', totalXP);
      updateAchievementProgress('earn_100k_xp', totalXP);
    }

    // Kill counts
    const totalKills = Object.values(GameState.killCounts || {}).reduce((s, v) => s + v, 0);
    if (totalKills > 0) {
      checkAchievements('kill', {
        enemy: null,
        totalKills,
        killCounts: GameState.killCounts,
        party: GameState.party,
      });
    }

    // Dungeon counter rechecks
    if (GameState.bb_gnollKills)    updateAchievementProgress('bb_gnoll_genocide',  GameState.bb_gnollKills);
    if (GameState.bb_stoutCount)    updateAchievementProgress('bb_stout_collector', GameState.bb_stoutCount);
    if (GameState.bb_peltCount)     updateAchievementProgress('bb_pelt_collector',  GameState.bb_peltCount);
    if (GameState.bef_undeadKills)  updateAchievementProgress('bef_undead_slayer',  GameState.bef_undeadKills);
    if (GameState.bef_namedKills)   updateAchievementProgress('bef_all_named',      GameState.bef_namedKills);
    if (GameState.namedKills)       updateAchievementProgress('named_5',            GameState.namedKills);
    if (GameState.chatMessagesSeen) updateAchievementProgress('zone_chat_10',       GameState.chatMessagesSeen);
  }
}

// ─── Scoring ───────────────────────────────────────────────────────────────────────

function getTotalScore() {
  return _achievements
    .filter(r => r.unlockedAt !== null)
    .reduce((sum, r) => {
      const def = ACHIEVEMENTS.find(d => d.id === r.id);
      return sum + (def ? (def.points || 0) : 0);
    }, 0);
}

function getAchievementPoints() {
  return getTotalScore();
}

function getTotalPossiblePoints() {
  return ACHIEVEMENTS.reduce((sum, def) => sum + (def.points || 0), 0);
}

// ─── Module Export ──────────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  initAchievements,
  checkAchievements,
  recordWorldFirst,
  getWorldFirsts,
  getAchievementsByCategory,
  isUnlocked,
  getUnlockedCount,
  getTotalCount,
  getTotalScore,
  getAchievementPoints,
  getTotalPossiblePoints,
  unlockAchievement,
  loadAchievements,
  ACHIEVEMENTS,
};
