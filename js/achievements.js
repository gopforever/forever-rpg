// achievements.js — Achievement & World First System for Forever RPG
// All data is client-side only, persisted in localStorage

// ─── Achievement Definitions ────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  // General
  { id: 'first_login',        category: 'general',     name: 'Welcome, Adventurer',   desc: 'Start the game for the first time' },
  { id: 'first_kill',         category: 'general',     name: 'Blood on Your Hands',   desc: 'Kill your first enemy' },
  { id: 'first_death',        category: 'general',     name: 'Embraced by Darkness',  desc: 'Die for the first time' },
  { id: 'first_loot',         category: 'general',     name: 'Fortune Favors the Bold', desc: 'Loot your first item' },
  { id: 'first_group',        category: 'general',     name: 'Better Together',       desc: 'Create a party of 3+ members' },
  { id: 'survive_10_fights',  category: 'general',     name: 'Battle Tested',         desc: 'Win 10 consecutive fights without dying', threshold: 10 },
  { id: 'reach_qeynos',       category: 'general',     name: 'City of Honor',         desc: 'Enter Qeynos (safe zone)' },

  // Advancement
  { id: 'level_5',            category: 'advancement', name: 'Seasoned',              desc: 'Reach level 5' },
  { id: 'level_10',           category: 'advancement', name: 'Veteran',               desc: 'Reach level 10' },
  { id: 'level_20',           category: 'advancement', name: 'Champion',              desc: 'Reach level 20' },
  { id: 'level_30',           category: 'advancement', name: 'Hero',                  desc: 'Reach level 30' },
  { id: 'level_50',           category: 'advancement', name: 'Legend',                desc: 'Reach level 50' },
  { id: 'level_60',           category: 'advancement', name: 'Transcendent',          desc: 'Reach level 60 (max)' },
  { id: 'earn_1000_xp',       category: 'advancement', name: 'Grinder',               desc: 'Earn 1,000 total XP',    threshold: 1000 },
  { id: 'earn_100k_xp',       category: 'advancement', name: 'Relentless',            desc: 'Earn 100,000 total XP',  threshold: 100000 },

  // Class
  { id: 'class_warrior',      category: 'class',       name: 'Steel and Will',        desc: 'Play as a Warrior' },
  { id: 'class_caster',       category: 'class',       name: 'Arcane Initiate',       desc: 'Play as any pure caster class' },
  { id: 'class_healer',       category: 'class',       name: 'Keeper of Life',        desc: 'Play as a healer (cleric/druid/shaman)' },
  { id: 'class_hybrid',       category: 'class',       name: 'Jack of All Trades',    desc: 'Play as a hybrid class' },

  // Keys (Zones)
  { id: 'zone_qeynos_hills',  category: 'keys',        name: 'Rolling Hills',         desc: 'Visit Qeynos Hills' },
  { id: 'zone_blackburrow',   category: 'keys',        name: 'Into the Dark',         desc: 'Visit Blackburrow' },
  { id: 'zone_everfrost',     category: 'keys',        name: 'Frozen Peaks',          desc: 'Visit Everfrost Peaks' },
  { id: 'zone_west_karana',   category: 'keys',        name: 'The Open Plains',       desc: 'Visit West Karana' },
  { id: 'zone_highpass',      category: 'keys',        name: 'Mountain Pass',         desc: 'Visit Highpass Hold' },
  { id: 'zone_kithicor',      category: 'keys',        name: 'Cursed Forest',         desc: 'Visit Kithicor Forest' },
  { id: 'zone_commonlands',   category: 'keys',        name: 'The Commonlands',       desc: 'Visit Commonlands' },
  { id: 'all_zones',          category: 'keys',        name: 'World Traveler',        desc: 'Visit all zones' },

  // Level (Kill counts)
  { id: 'kill_10',            category: 'level',       name: 'Slayer',                desc: 'Kill 10 enemies',          threshold: 10 },
  { id: 'kill_100',           category: 'level',       name: 'Destroyer',             desc: 'Kill 100 enemies',         threshold: 100 },
  { id: 'kill_500',           category: 'level',       name: 'Warlord',               desc: 'Kill 500 enemies',         threshold: 500 },
  { id: 'kill_1000',          category: 'level',       name: 'Massacre',              desc: 'Kill 1,000 enemies',       threshold: 1000 },
  { id: 'kill_5000',          category: 'level',       name: 'Avatar of Death',       desc: 'Kill 5,000 enemies',       threshold: 5000 },
  { id: 'kill_one_of_each',   category: 'level',       name: 'Completionist',         desc: 'Kill at least one of every enemy type' },
  { id: 'kill_rare',          category: 'level',       name: 'Named Slayer',          desc: 'Kill a rare/named enemy' },
  { id: 'named_5',            category: 'level',       name: 'Rare Hunter',           desc: 'Kill 5 different named enemies', threshold: 5 },

  // Progression
  { id: 'equip_rare',         category: 'progression', name: 'Rare Find',             desc: 'Equip a rare-quality item' },
  { id: 'equip_full_set',     category: 'progression', name: 'Fully Geared',          desc: 'Have gear in all 20 equipment slots' },
  { id: 'bank_10_items',      category: 'progression', name: 'Pack Rat',              desc: 'Store 10 items in the bank', threshold: 10 },
  { id: 'buy_spell',          category: 'progression', name: 'Scrollkeeper',          desc: 'Purchase your first spell from the guild' },
  { id: 'use_ability',        category: 'progression', name: 'Power Unleashed',       desc: 'Use a class ability in combat' },

  // Skills
  { id: 'skill_25',           category: 'skills',      name: 'Apprentice',            desc: 'Reach skill level 25 in any skill',  threshold: 25 },
  { id: 'skill_50',           category: 'skills',      name: 'Journeyman',            desc: 'Reach skill level 50 in any skill',  threshold: 50 },
  { id: 'skill_100',          category: 'skills',      name: 'Master',                desc: 'Reach skill level 100 in any skill', threshold: 100 },
  { id: 'skill_200',          category: 'skills',      name: 'Grandmaster',           desc: 'Reach skill level 200 in any skill', threshold: 200 },

  // Special
  { id: 'buy_from_market',    category: 'special',     name: 'Savvy Shopper',         desc: 'Buy from the player marketplace' },
  { id: 'gold_1000',          category: 'special',     name: 'Coin Collector',        desc: 'Accumulate 1,000 copper (or equivalent)', threshold: 1000 },
  { id: 'gold_10000',         category: 'special',     name: 'Merchant Prince',       desc: 'Accumulate 10,000 copper', threshold: 10000 },
  { id: 'survive_rare',       category: 'special',     name: 'Against the Odds',      desc: 'Kill a rare/named enemy at lower level than it' },
  { id: 'win_without_healer', category: 'special',     name: 'No Safety Net',         desc: 'Win a fight with 3+ enemies and no healer in party' },

  // Vanity
  { id: 'inspect_ghost',      category: 'vanity',      name: 'People Watcher',        desc: 'Inspect a ghost player' },
  { id: 'zone_chat_10',       category: 'vanity',      name: 'Social Butterfly',      desc: 'See 10 zone chat messages', threshold: 10 },
  { id: 'world_first_witness',category: 'vanity',      name: 'History Maker',         desc: 'Be online when a World First occurs' },
];

// ─── Storage ─────────────────────────────────────────────────────────────────────

const ACHIEVEMENT_SAVE_KEY  = 'foreverRPG_achievements';
const WORLD_FIRSTS_SAVE_KEY = 'foreverRPG_worldFirsts';

let _achievements = [];
let _worldFirsts  = {};
let _achievementListeners = [];

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
  // Mark "History Maker" for anyone online when world first happens
  if (achievement.id === 'world_first_witness') return;
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

const HEALER_CLASSES  = ['cleric', 'druid', 'shaman'];
const CASTER_CLASSES  = ['wizard', 'magician', 'necromancer', 'enchanter'];
const HYBRID_CLASSES  = ['paladin', 'shadowknight', 'ranger', 'bard', 'monk', 'beastlord', 'berserker'];

// Zone-id → achievement-id mapping
const ZONE_ACH_MAP = {
  qeynos_hills: 'zone_qeynos_hills',
  blackburrow:  'zone_blackburrow',
  everfrost:    'zone_everfrost',
  west_karana:  'zone_west_karana',
  highpass:     'zone_highpass',
  kithicor:     'zone_kithicor',
  commonlands:  'zone_commonlands',
};

// All zone IDs that must be visited for "World Traveler"
const ALL_ZONE_IDS = Object.keys(ZONE_ACH_MAP);

let _consecutiveWins = 0;

function checkAchievements(event, data) {
  if (!_achievements.length) return;

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
  }
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
  unlockAchievement,
  loadAchievements,
  ACHIEVEMENTS,
};
