// players.js — Simulated Ghost Players for Forever RPG
// All data is client-side only, persisted in localStorage

// ─── Constants ─────────────────────────────────────────────────────────────────

/** @type {string} LocalStorage key used to persist the serialized ghost player array. */
const GHOST_SAVE_KEY     = 'foreverRPG_ghosts';
/** @type {string} LocalStorage key storing the Unix-ms timestamp of the last ghost tick. */
const GHOST_TICK_KEY     = 'foreverRPG_ghostTick';
/** @type {string} LocalStorage key storing the current ghost data schema version number. */
const GHOST_VERSION_KEY  = 'foreverRPG_ghostsVersion';
/** @type {number} Schema version for ghost player data; stale data is wiped on mismatch. */
const GHOST_PLAYERS_VERSION = 2;
/** @type {string} LocalStorage key used to persist the serialized player market listing array. */
const MARKET_SAVE_KEY    = 'foreverRPG_market';
/** @type {number} Number of real-world seconds that elapse per ghost simulation tick. */
const TICK_SECONDS       = 30;           // 30 real seconds = 1 tick
/** @type {number} Maximum ticks applied when catching up offline progress (caps at 72 hours). */
const MAX_OFFLINE_TICKS  = 8640;         // 8640 ticks (72 hours at 30-second intervals)
/** @type {number} Milliseconds between automatic market listing trickle updates (2.5 minutes). */
const MARKET_TRICKLE_MS  = 150000;       // 2.5 minutes
/** @type {number} Maximum number of chat messages retained and rendered in the zone chat log. */
const CHAT_MAX_MESSAGES  = 30;
/** @type {number} Maximum number of world-event badges shown in the world feed panel at once. */
const WORLD_FEED_MAX     = 3;
/** @type {number} Maximum number of ghost players shown in the Who's Online panel. */
const WHO_ONLINE_MAX     = 8;
/** @type {number} Minimum number of ghost players shown in the Who's Online panel. */
const WHO_ONLINE_MIN     = 4;
/** @type {number} Minimum delay in milliseconds between consecutive ghost chat messages. */
const CHAT_MIN_DELAY_MS  = 20000;        // minimum 20 seconds between chat messages
/** @type {number} Maximum additional random delay in milliseconds added on top of CHAT_MIN_DELAY_MS. */
const CHAT_DELAY_RANGE_MS = 25000;       // random extra 0–25 seconds
/** @type {number} Minimum delay in milliseconds between consecutive world-feed events. */
const WORLD_EVENT_MIN_MS = 30000;        // minimum 30 seconds between world events
/** @type {number} Maximum additional random delay in milliseconds added on top of WORLD_EVENT_MIN_MS. */
const WORLD_EVENT_RANGE_MS = 60000;      // random extra 0–60 seconds

// Class icons matching CLASSES object
/**
 * Maps each class ID to its representative emoji icon used in chat and the Who's Online panel.
 *
 * @type {Object<string, string>}
 */
const CLASS_ICONS = {
  warrior:     '⚔️',
  paladin:     '🛡️',
  shadowknight:'💀',
  ranger:      '🏹',
  rogue:       '🗡️',
  bard:        '🎵',
  monk:        '👊',
  wizard:      '🔮',
  magician:    '✨',
  enchanter:   '💫',
  necromancer: '☠️',
  cleric:      '✝️',
  druid:       '🌿',
  shaman:      '🦴',
  beastlord:   '🐾',
  berserker:   '🪓',
};

// Class color for chat names
/**
 * Maps each class ID to a WoW-style hex color string used to colorize player names in chat
 * and the Who's Online panel.
 *
 * @type {Object<string, string>}
 */
const CLASS_COLORS = {
  warrior:     '#c0c0c0',
  paladin:     '#f58cba',
  shadowknight:'#8888ff',
  ranger:      '#abd473',
  rogue:       '#fff569',
  bard:        '#ff7d0a',
  monk:        '#00ff96',
  wizard:      '#40c7eb',
  magician:    '#ff8000',
  enchanter:   '#9482c9',
  necromancer: '#29a629',
  cleric:      '#ffffff',
  druid:       '#ff7d0a',
  shaman:      '#0070de',
  beastlord:   '#f4a101',
  berserker:   '#c79c6e',
};

// Ghost player name pool — EverQuest-style fantasy names (account/leader names)
/**
 * Pool of EverQuest-style fantasy names used as ghost player leader names.
 * One ghost is created per name, so the pool size determines total ghost count.
 *
 * @type {Array<string>}
 */
const GHOST_NAMES = [
  'Thalindra','Drakkon','Seraphina','Gorthak','Mireille','Vaelith','Bryndor','Cressida',
  'Zoltan','Fenwick','Alyxandre','Brimthorn','Caelindra','Darkveil','Elyndra','Frostwick',
  'Gavriok','Haldric','Isylara','Jorvik','Keldrath','Lumindra','Mortifax','Nalindra',
  'Osric','Pelindra','Quellan','Ravindra','Stormwick','Talinoth','Ulveth','Velindra',
  'Wulfric','Xylandris','Ysolde','Zephyrath','Aelindra','Bolthorn','Corvinath','Duskwind',
];

// Separate name pool for party members (distinct from leader names)
/**
 * Pool of fantasy names assigned to non-leader ghost party members.
 * Kept separate from GHOST_NAMES to avoid name collisions within a party.
 *
 * @type {Array<string>}
 */
const PARTY_MEMBER_NAMES = [
  'Arithar','Baelindra','Cyranoth','Delvara','Evindrel','Faerith','Gaelindra',
  'Heloria','Indreth','Jarindra','Kelavar','Larimoth','Mindrath','Naelindra',
  'Orvindra','Praelith','Quarinoth','Raelith','Sindrath','Tavinor','Uldrava',
  'Vindrath','Wendorath','Xarindra','Yavindra','Zelindra','Ardivath','Brindoch',
  'Carinoth','Devrath','Elorath','Fendrath','Gorindra','Helvath','Irindra',
  'Jeldrath','Karindra','Lendrath','Morvindra','Nalvath','Orindra','Palvindra',
  'Quelindra','Rendrath','Selvindra','Teldrath','Uvindra','Valdrath','Windora',
  'Xelindra','Yvindra','Zandrath','Bolvindra','Celdrath','Drivindra',
  'Eorath','Faldrath','Garivoth','Halindra','Iveldra','Jarvindra','Kyrindra',
];

// All playable class IDs
/**
 * Complete list of playable class IDs used when randomly assigning a class to a ghost player.
 *
 * @type {Array<string>}
 */
const GHOST_CLASSES = [
  'warrior','paladin','shadowknight','ranger','rogue','bard','monk',
  'wizard','magician','enchanter','necromancer','cleric','druid','shaman','beastlord','berserker',
];

// Class role buckets for MMO-authentic party composition
/**
 * Class IDs that fulfil the healer role; used to ensure parties of 3+ include a healer.
 *
 * @type {Array<string>}
 */
const HEALER_CLASSES = ['cleric','druid','shaman'];
/**
 * Class IDs that fulfil the tank role; used to ensure parties of 4+ include a tank.
 *
 * @type {Array<string>}
 */
const TANK_CLASSES   = ['warrior','paladin','shadowknight'];

// All zone IDs (must match zones.js)
/**
 * All zone IDs available in the game.  Must stay in sync with the ZONES registry in zones.js.
 *
 * @type {Array<string>}
 */
const ALL_ZONES = ['qeynos_hills','blackburrow','qeynos'];

// Non-city zones used for ghost activity
/**
 * Subset of ALL_ZONES containing non-city (combat) zones where ghosts actively hunt.
 *
 * @type {Array<string>}
 */
const COMBAT_ZONES = ['qeynos_hills','blackburrow'];

// Enemy names by zone for flavor text
const ZONE_ENEMIES = {
  qeynos_hills: ['a Gnoll Scout','a Gray Wolf','a Brown Bear','a Giant Rat','a Bandit','Varsoon the Undying','a Fire Beetle','a Decaying Skeleton'],
  blackburrow:  ['a Gnoll Guard','a Burly Gnoll','a Gnoll Shaman','Lord Elgnub','a Plague Rat','a Giant Snake','the Gnoll Commander','the Gnoll High Shaman'],
  qeynos:       [],
};

// Chat message templates
const CHAT_TEMPLATES = {
  lfg:     ['LFG {zone}, need {cls} PST','anyone want to group? LFG {zone}','LF{n}M for {zone} PST','need {cls} for group, LFG'],
  wts:     ['WTS [{item}] x{n}, PST','selling [{item}] cheap PST','WTS [{item}] — msg me','[{item}] for sale, {n} available PST'],
  wtb:     ['WTB [{item}] PST anyone?','buying [{item}] paying good PST','WTB {n}x [{item}] message me'],
  general: [
    'careful, {enemy} is up near the ruins',
    'good hunting out here tonight',
    'anyone else getting wrecked by {enemy}?',
    'train to zone! run!',
    'is {enemy} up? anyone know?',
    'OOM, have to med a sec',
    'nice loot drop just now',
    'AFK for a few, at camp',
    'man this zone is packed tonight',
    'anyone have a spare {item}?',
    'just dinged {lvl}, finally!',
    'anyone buffing? can I get {cls} buff?',
    'clear to the {loc}',
    'this camp is mine, FYI',
    'respawn time is fast here',
  ],
};

// Landmark names per zone
const ZONE_LOCS = {
  qeynos_hills: ['gnoll camp','wolf den','pond','ruins','Qeynos gate','the hill','the creek'],
  blackburrow:  ['upper tunnels','flooded area','deep chamber','gnoll brewery','the trap room','lower level'],
  qeynos:       ['the bank','the guild hall','the market','the temple','south district'],
};

// Sellable item names for chat / market (grabbed dynamically, cached here)
let _sellableItems = null;

/**
 * Returns (and caches) the list of all tradeable items derived from the ITEMS registry.
 * Items with `nodrop: true` or without a `name` are excluded.
 *
 * @returns {Array<object>} Array of item definition objects that can be sold or traded.
 */
function getSellableItems() {
  if (_sellableItems) return _sellableItems;
  if (typeof ITEMS === 'undefined') return [];
  _sellableItems = Object.values(ITEMS).filter(i => !i.nodrop && i.name);
  return _sellableItems;
}

// ─── Seeded Random Helpers ──────────────────────────────────────────────────────

/**
 * Mulberry32 seeded pseudo-random number generator.
 * Produces a deterministic float in [0, 1) for a given 32-bit integer seed.
 *
 * @param {number} seed - 32-bit integer seed value.
 * @returns {number} Pseudo-random float in the range [0, 1).
 */
function seededRand(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Derives a deterministic integer seed from a ghost's numeric ID, the current day,
 * and an optional extra discriminator.  Mixing in the day gives slow drift over time
 * while keeping the output stable within a single session.
 *
 * @param {number} ghostId - The ghost player's numeric ID.
 * @param {number} [extra=0] - Optional extra value to further differentiate seeds.
 * @returns {number} A 32-bit integer seed suitable for seededRand().
 */
function ghostSeed(ghostId, extra) {
  // Mix ghost id with day number (and optional extra) for deterministic feel
  const day = Math.floor(Date.now() / 86400000);
  return (ghostId * 31337 + day * 9973 + (extra || 0)) | 0;
}

/**
 * Picks a random element from an array using a seeded RNG for deterministic selection.
 *
 * @param {Array<object>} arr  - The array to pick from.
 * @param {number}        seed - Integer seed passed to seededRand().
 * @returns {object} A single element from arr chosen deterministically by seed.
 */
function seededPick(arr, seed) {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

/**
 * Generates a random character level weighted toward the mid-range (10–35),
 * with tails for low-level (1–9), high-level (36–50), and max-tier (51–60) players.
 *
 * @returns {number} A level between 1 and 60 inclusive.
 */
function weightedLevel() {
  // Weighted toward mid-range 10–35, min 1, max 60
  const r = Math.random();
  if (r < 0.15) return Math.floor(Math.random() * 9) + 1;          // 1–9
  if (r < 0.65) return Math.floor(Math.random() * 26) + 10;        // 10–35
  if (r < 0.90) return Math.floor(Math.random() * 15) + 36;        // 36–50
  return Math.floor(Math.random() * 10) + 51;                       // 51–60
}

// ─── Ghost Party Builder ─────────────────────────────────────────────────────────

/**
 * Builds a ghost party with the leader as the first member.
 * Parties of 3+ guarantee a healer; parties of 4+ also guarantee a tank,
 * unless the leader already fills that role.  Each member gets a unique name
 * drawn from PARTY_MEMBER_NAMES and a unique class.
 *
 * @param {string} leaderName    - Display name of the party leader.
 * @param {string} leaderClassId - Class ID of the party leader.
 * @returns {Array<{ name: string, classId: string, level: number, xp: number }>}
 *   Ordered array of party members starting with the leader.
 */
function createGhostParty(leaderName, leaderClassId) {
  const size = 1 + Math.floor(Math.random() * 5);   // 1 to 5 members total
  const usedClasses = new Set([leaderClassId]);
  const usedNames   = new Set([leaderName]);

  const members = [{ name: leaderName, classId: leaderClassId, level: 1, xp: 0 }];

  const toAdd = size - 1;
  if (toAdd === 0) return members;

  // Build required-role list based on party size
  const required = [];
  const leaderIsHealer = HEALER_CLASSES.includes(leaderClassId);
  const leaderIsTank   = TANK_CLASSES.includes(leaderClassId);

  if (size >= 3 && !leaderIsHealer) {
    const healerOptions = HEALER_CLASSES.filter(c => !usedClasses.has(c));
    if (healerOptions.length) required.push(healerOptions[Math.floor(Math.random() * healerOptions.length)]);
  }
  if (size >= 4 && !leaderIsTank) {
    const tankOptions = TANK_CLASSES.filter(c => !usedClasses.has(c) && !required.includes(c));
    if (tankOptions.length) required.push(tankOptions[Math.floor(Math.random() * tankOptions.length)]);
  }

  for (let i = 0; i < toAdd; i++) {
    let classId;
    if (i < required.length) {
      classId = required[i];
    } else {
      const available = GHOST_CLASSES.filter(c => !usedClasses.has(c));
      if (!available.length) break;
      classId = available[Math.floor(Math.random() * available.length)];
    }
    usedClasses.add(classId);

    const namePool = PARTY_MEMBER_NAMES.filter(n => !usedNames.has(n));
    if (!namePool.length) break;
    const name = namePool[Math.floor(Math.random() * namePool.length)];
    usedNames.add(name);

    members.push({ name, classId, level: 1, xp: 0 });
  }

  return members;
}

// ─── Ghost Player Definitions ───────────────────────────────────────────────────

/**
 * Creates the initial array of ghost player objects, one per entry in GHOST_NAMES.
 * Each ghost starts at level 1 in a random combat zone and is assigned a randomized
 * XP rate multiplier and a freshly built party.
 *
 * @returns {Array<object>} Array of ghost player objects ready for persistence and simulation.
 */
function createGhostPlayers() {
  const ghosts = [];
  for (let i = 0; i < GHOST_NAMES.length; i++) {
    const classId = GHOST_CLASSES[Math.floor(Math.random() * GHOST_CLASSES.length)];
    const zone    = COMBAT_ZONES[Math.floor(Math.random() * COMBAT_ZONES.length)];
    const xpRate  = 0.8 + Math.random() * 0.7;   // 0.8–1.5× (exclusive) — determines eventual rank

    ghosts.push({
      id:         i,
      name:       GHOST_NAMES[i],
      classId,
      level:      1,
      zone,
      kills:      0,
      totalXP:    0,
      gold:       0,
      xpRate,
      lastActive: Date.now(),
      party:      createGhostParty(GHOST_NAMES[i], classId),
    });
  }
  return ghosts;
}

// ─── Persistence ────────────────────────────────────────────────────────────────

/**
 * Loads the persisted ghost player array from localStorage.
 * Returns null when data is absent, corrupted, or from a mismatched schema version
 * (stale data is automatically cleared in that case).
 *
 * @returns {Array<object>|null} Parsed ghost array, or null if unavailable.
 */
function loadGhosts() {
  try {
    const version = parseInt(localStorage.getItem(GHOST_VERSION_KEY) || '0', 10);
    if (version !== GHOST_PLAYERS_VERSION) {
      // Version mismatch — wipe stale data and start fresh
      localStorage.removeItem(GHOST_SAVE_KEY);
      localStorage.removeItem(GHOST_TICK_KEY);
      localStorage.setItem(GHOST_VERSION_KEY, String(GHOST_PLAYERS_VERSION));
      return null;
    }
    const raw = localStorage.getItem(GHOST_SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

/**
 * Serializes the ghost player array to localStorage along with the current schema version.
 * Errors (e.g., storage quota exceeded) are silently swallowed.
 *
 * @param {Array<object>} ghosts - Array of ghost player objects to persist.
 * @returns {void}
 */
function saveGhosts(ghosts) {
  try {
    localStorage.setItem(GHOST_SAVE_KEY, JSON.stringify(ghosts));
    localStorage.setItem(GHOST_VERSION_KEY, String(GHOST_PLAYERS_VERSION));
  } catch (_) {}
}

/**
 * Loads the persisted market listing array from localStorage.
 * Returns null when data is absent or corrupted.
 *
 * @returns {Array<object>|null} Parsed market listings, or null if unavailable.
 */
function loadMarket() {
  try {
    const raw = localStorage.getItem(MARKET_SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

/**
 * Serializes the market listing array to localStorage.
 * Errors (e.g., storage quota exceeded) are silently swallowed.
 *
 * @param {Array<object>} listings - Market listing objects to persist.
 * @returns {void}
 */
function saveMarket(listings) {
  try {
    localStorage.setItem(MARKET_SAVE_KEY, JSON.stringify(listings));
  } catch (_) {}
}

// ─── Offline Ghost Progression ──────────────────────────────────────────────────

/**
 * Advances a single ghost player by one simulation tick.
 * Grants XP, kills, and gold scaled to the ghost's level and individual XP rate.
 * Triggers level-ups (capped at 60), syncs party member levels, and occasionally
 * moves the ghost to a different combat zone on level-up.
 *
 * @param {object} ghost - A ghost player object from the _ghosts array (mutated in place).
 * @returns {object} The mutated ghost object.
 */
function simulateGhostTick(ghost) {
  // XP per tick scales with level and ghost's individual XP rate
  const rate = ghost.xpRate || 1;
  const xpPerTick = Math.floor(50 * ghost.level * (1 + ghost.level / 20) * rate);
  const killsPerTick = Math.max(1, Math.floor(Math.random() * (1 + ghost.level / 10)));
  const goldPerTick = Math.floor(Math.random() * (1 + ghost.level / 5));

  ghost.totalXP += xpPerTick;
  ghost.kills   += killsPerTick;
  ghost.gold    += goldPerTick;

  // Level up check — all party members level together
  if (typeof xpForLevel === 'function' && ghost.level < 60) {
    while (ghost.level < 60 && ghost.totalXP >= xpForLevel(ghost.level + 1)) {
      ghost.level++;
      // Sync every party member to the new level
      if (ghost.party) {
        for (const member of ghost.party) {
          member.level = ghost.level;
        }
      }
      // Occasionally change zone on level up
      if (Math.random() < 0.2) {
        ghost.zone = COMBAT_ZONES[Math.floor(Math.random() * COMBAT_ZONES.length)];
      }
    }
  }

  ghost.lastActive = Date.now();
  return ghost;
}

/**
 * Calculates how many simulation ticks have elapsed since the last saved tick timestamp
 * and applies that many ticks to every ghost (capped at MAX_OFFLINE_TICKS).
 * Updates the stored tick timestamp on completion.
 *
 * @param {Array<object>} ghosts - Array of ghost player objects (mutated in place).
 * @returns {Array<object>} The same mutated ghosts array.
 */
function simulateOfflineProgression(ghosts) {
  let lastTick = 0;
  try {
    lastTick = parseInt(localStorage.getItem(GHOST_TICK_KEY) || '0', 10);
  } catch (_) {}

  const now = Date.now();
  if (!lastTick) {
    localStorage.setItem(GHOST_TICK_KEY, String(now));
    return ghosts;
  }

  const elapsedSeconds = Math.floor((now - lastTick) / 1000);
  let ticks = Math.floor(elapsedSeconds / TICK_SECONDS);
  if (ticks <= 0) return ghosts;

  ticks = Math.min(ticks, MAX_OFFLINE_TICKS);

  for (const ghost of ghosts) {
    for (let t = 0; t < ticks; t++) {
      simulateGhostTick(ghost);
    }
  }

  localStorage.setItem(GHOST_TICK_KEY, String(now));
  return ghosts;
}

// ─── Module-level State ─────────────────────────────────────────────────────────

let _ghosts = [];
let _zoneGhosts = [];          // ghosts "in" the player's current zone
let _marketListings = [];
let _chatInterval = null;
let _whoInterval  = null;
let _ghostTickInterval = null;
let _worldFeedInterval = null;
let _marketTrickleInterval = null;

// ─── World Feed ─────────────────────────────────────────────────────────────────

/**
 * Appends a world-event badge to the world-feed DOM element.
 * Removes the oldest badge when the panel exceeds WORLD_FEED_MAX entries.
 * The badge auto-dismisses after 10 seconds.
 *
 * @param {string} text - HTML string to display inside the badge.
 * @returns {void}
 */
function pushWorldEvent(text) {
  const feed = document.getElementById('world-feed');
  if (!feed) return;

  const badge = document.createElement('div');
  badge.className = 'world-event';
  badge.innerHTML = text;
  feed.appendChild(badge);

  // Remove oldest if over max
  while (feed.children.length > WORLD_FEED_MAX) {
    feed.removeChild(feed.firstChild);
  }

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (badge.parentNode) badge.parentNode.removeChild(badge);
  }, 10000);
}

/**
 * Picks a random ghost and generates a world-feed event: a kill, level-up, death,
 * or item acquisition message, each with different probabilities.
 *
 * @returns {void}
 */
function generateWorldEvent() {
  const ghost = _ghosts[Math.floor(Math.random() * _ghosts.length)];
  if (!ghost) return;

  const r = Math.random();
  const icon = CLASS_ICONS[ghost.classId] || '⚔';
  if (r < 0.35) {
    const zone = ZONES && ZONES[ghost.zone] ? ZONES[ghost.zone].name : ghost.zone;
    const enemies = ZONE_ENEMIES[ghost.zone] || ['a monster'];
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    pushWorldEvent(`⚔ <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> slew ${enemy} in ${zone}!`);
  } else if (r < 0.6) {
    pushWorldEvent(`🌟 <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> reached Level ${ghost.level}!`);
  } else if (r < 0.8) {
    const zone = ZONES && ZONES[ghost.zone] ? ZONES[ghost.zone].name : ghost.zone;
    const enemies = ZONE_ENEMIES[ghost.zone] || ['a monster'];
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    pushWorldEvent(`💀 <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> was slain by ${enemy}!`);
  } else {
    const items = getSellableItems();
    if (items.length) {
      const item = items[Math.floor(Math.random() * items.length)];
      pushWorldEvent(`🏆 <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> claimed ${item.name}!`);
    }
  }
}

// ─── Zone Chat ──────────────────────────────────────────────────────────────────

let _chatMessages = [];

/**
 * Wraps item link tokens of the form `[Item Name]` in a styled `<span>` for display in chat.
 *
 * @param {string} text - Raw chat message text potentially containing `[Item Name]` tokens.
 * @returns {string} HTML string with item tokens replaced by styled spans.
 */
function formatChatItem(text) {
  return text.replace(/\[([^\]]+)\]/g, '<span class="chat-item">[$1]</span>');
}

/**
 * Appends a new chat line from the given ghost to the zone-chat-log DOM element
 * and to the in-memory _chatMessages buffer.  Trims the log to CHAT_MAX_MESSAGES.
 *
 * @param {object} ghost - Ghost player object providing name, classId, etc.
 * @param {string} text  - Plain-text or item-link-annotated message body.
 * @returns {void}
 */
function addChatMessage(ghost, text) {
  const log = document.getElementById('zone-chat-log');
  const color = CLASS_COLORS[ghost.classId] || '#e8d5a0';
  const icon  = CLASS_ICONS[ghost.classId] || '⚔';

  const msg = { ghost, text, time: Date.now() };
  _chatMessages.push(msg);
  if (_chatMessages.length > CHAT_MAX_MESSAGES) _chatMessages.shift();

  if (!log) return;

  const line = document.createElement('div');
  line.className = 'chat-line';
  line.innerHTML = `<span class="chat-name" style="color:${color}">${icon} ${ghost.name}</span>: ${formatChatItem(text)}`;
  log.appendChild(line);

  while (log.children.length > CHAT_MAX_MESSAGES) {
    log.removeChild(log.firstChild);
  }

  log.scrollTop = log.scrollHeight;
}

/**
 * Generates a context-appropriate chat message string for the given ghost.
 * Selects a template category (LFG, WTS, WTB, or general) and fills in
 * zone, item, enemy, landmark, class, and level placeholders.
 *
 * @param {object} ghost - Ghost player object used to derive level and zone context.
 * @returns {string} A filled-in, plain-text chat message.
 */
function buildChatMessage(ghost) {
  const zoneId   = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  const items    = getSellableItems();
  const itemName = items.length ? items[Math.floor(Math.random() * items.length)].name : 'Gnoll Fang';
  const enemies  = ZONE_ENEMIES[zoneId] || ['a gnoll'];
  const enemy    = enemies[Math.floor(Math.random() * enemies.length)];
  const locs     = ZONE_LOCS[zoneId] || ['the area'];
  const loc      = locs[Math.floor(Math.random() * locs.length)];
  const n        = Math.floor(Math.random() * 5) + 1;
  const cls      = GHOST_CLASSES[Math.floor(Math.random() * GHOST_CLASSES.length)];
  const lvl      = ghost.level + Math.floor(Math.random() * 5);
  const hour     = new Date().getHours();
  const isNight  = hour >= 20 || hour < 6;

  const r = Math.random();
  let pool;
  if (r < 0.25) {
    pool = CHAT_TEMPLATES.lfg;
  } else if (r < 0.45) {
    pool = CHAT_TEMPLATES.wts;
  } else if (r < 0.55) {
    pool = CHAT_TEMPLATES.wtb;
  } else {
    pool = CHAT_TEMPLATES.general;
  }

  let msg = pool[Math.floor(Math.random() * pool.length)];

  // Night-time flavor
  if (isNight && Math.random() < 0.3) {
    msg = 'good hunting out here tonight';
  }

  msg = msg
    .replace('{zone}',  ZONES && ZONES[zoneId] ? ZONES[zoneId].shortName || ZONES[zoneId].name : zoneId)
    .replace('{item}',  itemName)
    .replace('{enemy}', enemy)
    .replace('{loc}',   loc)
    .replace('{cls}',   cls)
    .replace('{n}',     String(n))
    .replace('{lvl}',   String(lvl));

  return msg;
}

/**
 * Picks a random ghost from the current zone (or the full ghost pool as a fallback),
 * builds a chat message for it, and posts it to the zone chat log.
 *
 * @returns {void}
 */
function triggerChatMessage() {
  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  // Pick a ghost from the current zone players, or any ghost
  const pool = _zoneGhosts.length ? _zoneGhosts : _ghosts;
  if (!pool.length) return;
  const ghost = pool[Math.floor(Math.random() * pool.length)];
  addChatMessage(ghost, buildChatMessage(ghost));
}

/**
 * Schedules the next ghost chat message after a randomized delay
 * (CHAT_MIN_DELAY_MS + random portion of CHAT_DELAY_RANGE_MS) and then reschedules
 * itself, creating a self-perpetuating chat loop.
 *
 * @returns {void}
 */
function scheduleChatMessage() {
  const delay = CHAT_MIN_DELAY_MS + Math.random() * CHAT_DELAY_RANGE_MS;
  _chatInterval = setTimeout(() => {
    triggerChatMessage();
    scheduleChatMessage();
  }, delay);
}

// ─── Who's Online Panel ─────────────────────────────────────────────────────────

const STATUS_TEMPLATES = [
  g => `Fighting ${(ZONE_ENEMIES[g.zone]||['a monster'])[Math.floor(Math.random()*(ZONE_ENEMIES[g.zone]||['a monster']).length)]}`,
  g => `Looting ${(ZONE_ENEMIES[g.zone]||['a monster'])[Math.floor(Math.random()*(ZONE_ENEMIES[g.zone]||['a monster']).length)]}`,
  g => `Resting`,
  g => `Medding`,
  g => `Heading to ${(ZONE_LOCS[g.zone]||['the area'])[Math.floor(Math.random()*(ZONE_LOCS[g.zone]||['the area']).length)]}`,
  g => `Looking for a group`,
  g => `Buffing up`,
  g => `OOM — medding`,
];

/**
 * Returns a randomly selected status description string for a ghost player,
 * such as "Fighting a Gnoll Scout" or "Medding".
 *
 * @param {object} ghost - Ghost player object providing zone context.
 * @returns {string} A short human-readable activity string.
 */
function getGhostStatus(ghost) {
  const fn = STATUS_TEMPLATES[Math.floor(Math.random() * STATUS_TEMPLATES.length)];
  return fn(ghost);
}

/**
 * Deterministically selects a subset of ghosts for the given zone based on the ghost IDs
 * and the current day, then stores them in _zoneGhosts.  Each selected ghost has its
 * zone field overridden to zoneId so they appear to be present in that zone.
 *
 * @param {string} zoneId - The zone ID to populate with ghost players.
 * @returns {Array<object>} The selected ghost objects (also stored in _zoneGhosts).
 */
function pickZoneGhosts(zoneId) {
  // Deterministically pick 4–8 ghosts for this zone based on ghost id + day
  const count = WHO_ONLINE_MIN + Math.floor(seededRand(ghostSeed(zoneId.length, zoneId.charCodeAt(0))) * (WHO_ONLINE_MAX - WHO_ONLINE_MIN));
  const shuffled = [..._ghosts].sort((a, b) => seededRand(ghostSeed(a.id)) - seededRand(ghostSeed(b.id)));
  // Force zone so they appear to be in this zone
  const selected = shuffled.slice(0, count).map(g => ({ ...g, zone: zoneId }));
  _zoneGhosts = selected;
  return selected;
}

/**
 * Rebuilds the Who's Online panel DOM with the current zone ghosts (or all ghosts when
 * in a city safe-zone).  Attaches left-click (inspect) and right-click (context menu)
 * handlers to each row.
 *
 * @returns {void}
 */
function renderWhoOnlinePanel() {
  const el = document.getElementById('who-online-list');
  if (!el) return;

  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  const inCity = typeof ZONES !== 'undefined' && ZONES[zoneId] && ZONES[zoneId].isSafeZone;

  // In city, show ghosts from all combat zones
  const list = inCity
    ? _ghosts.slice(0, WHO_ONLINE_MAX).map(g => ({ ...g }))
    : _zoneGhosts;

  if (!list.length) {
    el.innerHTML = '<div class="no-kills">No players nearby.</div>';
    return;
  }

  el.innerHTML = list.map(g => {
    const color = CLASS_COLORS[g.classId] || '#e8d5a0';
    const partyIconsHtml = g.party
      ? g.party.map(m => {
          const ic  = CLASS_ICONS[m.classId] || '⚔';
          const col = CLASS_COLORS[m.classId] || '#e8d5a0';
          return `<span style="color:${col}" title="${m.name} (${m.classId})">${ic}</span>`;
        }).join('')
      : `<span style="color:${color}">${CLASS_ICONS[g.classId] || '⚔'}</span>`;
    const status = getGhostStatus(g);
    return `<div class="who-online-row" data-ghost-id="${g.id}" style="cursor:pointer" title="Left-click to inspect · Right-click for options">
      <span class="who-name" style="color:${color}">${g.name}</span>
      <span class="party-icons">${partyIconsHtml}</span>
      <span class="who-level">Lv.${g.level}</span>
      <div class="who-status">${status}</div>
    </div>`;
  }).join('');

  // Attach click / right-click handlers via event delegation on the list
  el.querySelectorAll('.who-online-row').forEach(row => {
    const ghostId = parseInt(row.dataset.ghostId, 10);
    // Prefer full ghost from _ghosts (has all data); fall back to zone copy
    const ghost = _ghosts.find(g => g.id === ghostId) || list.find(g => g.id === ghostId);
    if (!ghost) return;

    row.addEventListener('click', () => showGhostInspectModal(ghost));
    row.addEventListener('contextmenu', e => {
      e.preventDefault();
      showGhostContextMenu(ghost, e.clientX, e.clientY);
    });
  });
}

/**
 * Re-picks the ghost players for the player's current zone and re-renders
 * the Who's Online panel to reflect the updated selection.
 *
 * @returns {void}
 */
function refreshZonePlayers() {
  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  pickZoneGhosts(zoneId);
  renderWhoOnlinePanel();
}

// ─── Ghost Inspect Modal ─────────────────────────────────────────────────────────

/**
 * Opens and populates the ghost inspect modal with the party roster, zone,
 * total kill count, and gold earned for the given ghost.
 *
 * @param {object} ghost - The ghost player object to inspect.
 * @returns {void}
 */
function showGhostInspectModal(ghost) {
  const modal = document.getElementById('ghost-inspect-modal');
  if (!modal) return;

  const zone  = typeof ZONES !== 'undefined' && ZONES[ghost.zone] ? ZONES[ghost.zone].name : ghost.zone;
  const party = ghost.party || [{ name: ghost.name, classId: ghost.classId, level: ghost.level, xp: 0 }];

  const partyRows = party.map(member => {
    const icon      = CLASS_ICONS[member.classId] || '⚔';
    const color     = CLASS_COLORS[member.classId] || '#e8d5a0';
    const className = member.classId.charAt(0).toUpperCase() + member.classId.slice(1);
    return `<div class="ghost-party-row">
      <span class="ghost-party-icon" style="color:${color}">${icon}</span>
      <span class="ghost-party-name">${member.name}</span>
      <span class="ghost-party-class" style="color:${color}">${className}</span>
      <span class="ghost-party-level">Lv.${member.level}</span>
    </div>`;
  }).join('');

  const totalKills = (ghost.kills || 0).toLocaleString();
  const totalGold  = (ghost.gold  || 0).toLocaleString();

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  content.innerHTML = `
    <button class="modal-close" id="ghost-inspect-close">✕</button>
    <h2>👥 ${ghost.name}'s Party</h2>
    <div class="ghost-inspect-zone">Zone: ${zone}</div>
    <div class="ghost-party-list">${partyRows}</div>
    <div class="ghost-inspect-stats">
      <div>💀 Total Kills: ${totalKills}</div>
      <div>💰 Gold Earned: ${totalGold}c</div>
    </div>
  `;

  modal.style.display = 'flex';

  content.querySelector('#ghost-inspect-close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// One-time setup for the ghost inspect modal (escape + click-outside)
/**
 * Attaches one-time event listeners to the ghost inspect modal so that clicking
 * outside its content area or pressing Escape will close it.
 *
 * @returns {void}
 */
function _setupGhostInspectModal() {
  const modal = document.getElementById('ghost-inspect-modal');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

// ─── Ghost Context Menu ──────────────────────────────────────────────────────────

let _contextMenu = null;

const TELL_RESPONSES = [
  'Hey! Busy grinding but maybe later.',
  'Hail! In the middle of a fight, PST me in a bit.',
  'Sup! Grinding hard out here, catch you later.',
  'Hey there! Party is slammed right now — /tell me later!',
  'Can\'t chat, about to pull. Hit me up after.',
];

/**
 * Displays a right-click context menu near the cursor with options to inspect,
 * send a tell to, or invite the given ghost.  Dismisses automatically on any
 * subsequent click outside the menu.
 *
 * @param {object} ghost - The ghost player object the menu was invoked on.
 * @param {number} x     - Horizontal pixel position (clientX) for the menu.
 * @param {number} y     - Vertical pixel position (clientY) for the menu.
 * @returns {void}
 */
function showGhostContextMenu(ghost, x, y) {
  if (_contextMenu) { _contextMenu.remove(); _contextMenu = null; }

  const menu = document.createElement('div');
  menu.className = 'ghost-context-menu';
  menu.style.left = `${x}px`;
  menu.style.top  = `${y}px`;

  menu.innerHTML = `
    <div class="ghost-context-item" data-action="inspect">👁 Inspect Party</div>
    <div class="ghost-context-item" data-action="tell">💬 Send Tell</div>
    <div class="ghost-context-item" data-action="invite">🤝 Invite to Group</div>
  `;

  document.body.appendChild(menu);
  _contextMenu = menu;

  menu.querySelectorAll('.ghost-context-item').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      const action = item.dataset.action;
      if (action === 'inspect') {
        showGhostInspectModal(ghost);
      } else if (action === 'tell') {
        const msg = TELL_RESPONSES[Math.floor(Math.random() * TELL_RESPONSES.length)];
        addChatMessage(ghost, `[Tell from ${ghost.name}]: ${msg}`);
      } else if (action === 'invite') {
        addChatMessage(ghost, `[Tell from ${ghost.name}]: Thanks for the invite! Party is full though, sorry.`);
      }
      menu.remove();
      _contextMenu = null;
    });
  });

  // Click anywhere else to close
  const closeMenu = () => {
    if (_contextMenu) { _contextMenu.remove(); _contextMenu = null; }
    document.removeEventListener('click', closeMenu);
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

// ─── Market Listings ────────────────────────────────────────────────────────────

const VENDOR_BASE_PRICES = {
  cloth_cap:     10,  cloth_tunic: 18,  cloth_pants:  15,  simple_boots: 12,
  short_sword:   60,  dagger:      40,  crude_mace:   50,  gnarled_staff: 45,
  crude_staff:   35,  small_shield:55,  bread_loaf:    3,
};

/**
 * Returns the base copper price for an item, consulting the VENDOR_BASE_PRICES table first
 * and falling back to a formula derived from the item's weapon damage or armor class.
 *
 * @param {string} itemId - The snake_case item ID to price.
 * @returns {number} Estimated base price in copper coins.
 */
function getBasePrice(itemId) {
  if (VENDOR_BASE_PRICES[itemId]) return VENDOR_BASE_PRICES[itemId];
  // Estimate from item data if available
  if (typeof ITEMS !== 'undefined' && ITEMS[itemId]) {
    const item = ITEMS[itemId];
    if (item.type === 'weapon') return 50 + (item.dmg || 0) * 10;
    if (item.type === 'armor')  return 30 + (item.ac  || 0) * 8;
    return 5;
  }
  return 10;
}

/**
 * Generates an array of randomized ghost-player market listings.
 * Each listing contains a random tradeable item, a random ghost seller,
 * a random quantity, and a price derived from the base price with a ±30% spread.
 *
 * @param {number} [count] - Number of listings to generate; defaults to 8–15 if omitted.
 * @returns {Array<object>} Array of market listing objects.
 */
function generateMarketListings(count) {
  count = count || (8 + Math.floor(Math.random() * 8));
  const items = getSellableItems();
  if (!items.length) return [];

  const listings = [];
  for (let i = 0; i < count; i++) {
    const item   = items[Math.floor(Math.random() * items.length)];
    const ghost  = _ghosts[Math.floor(Math.random() * _ghosts.length)];
    const qty    = Math.floor(Math.random() * 5) + 1;
    const base   = getBasePrice(item.id);
    const mult   = 0.8 + Math.random() * 0.7;   // 80%–150%
    const price  = Math.max(1, Math.round(base * mult));

    listings.push({
      id:       Date.now() + i,
      itemId:   item.id,
      itemName: item.name,
      seller:   ghost ? ghost.name : 'Unknown',
      sellerId: ghost ? ghost.id   : -1,
      sellerClass: ghost ? ghost.classId : 'warrior',
      qty,
      price,   // price per unit in copper
    });
  }
  return listings;
}

/**
 * Returns the current in-memory market listing array.
 *
 * @returns {Array<object>} The active market listings.
 */
function getMarketListings() {
  return _marketListings;
}

/**
 * Replaces the in-memory market listings with a new array and persists it.
 *
 * @param {Array<object>} listings - New market listing objects to store.
 * @returns {void}
 */
function setMarketListings(listings) {
  _marketListings = listings;
  saveMarket(listings);
}

/**
 * Adds one freshly generated market listing to _marketListings (evicting the oldest
 * when the cap of 20 is reached) and persists the updated list.
 *
 * @returns {void}
 */
function trickleMarketListing() {
  if (_marketListings.length >= 20) {
    // Remove oldest
    _marketListings.shift();
  }
  const [newListing] = generateMarketListings(1);
  if (newListing) {
    _marketListings.push(newListing);
    saveMarket(_marketListings);
  }
}

// ─── Leaderboard ────────────────────────────────────────────────────────────────

/**
 * Builds the sorted leaderboard data by combining all ghost players with the real player
 * (from GameState), then returning the top 20 entries ranked by level, then kills.
 *
 * @returns {Array<{
 *   id: number,
 *   name: string,
 *   classId: string,
 *   level: number,
 *   kills: number,
 *   zone: string,
 *   party: Array<object>|null,
 *   isPlayer: boolean
 * }>} Top-20 leaderboard entries.
 */
function getLeaderboardData() {
  const entries = _ghosts.map(g => ({
    id:       g.id,
    name:     g.name,
    classId:  g.classId,
    level:    g.level,
    kills:    g.kills,
    zone:     g.zone,
    party:    g.party || null,
    isPlayer: false,
  }));

  // Insert real player
  if (typeof GameState !== 'undefined' && GameState.party && GameState.party.length > 0) {
    const leader = GameState.party[0];
    const kills  = Object.values(GameState.killCounts || {}).reduce((s, v) => s + v, 0);
    entries.push({
      id:       -1,
      name:     leader.name,
      classId:  leader.classId,
      level:    leader.level,
      kills,
      zone:     GameState.zone,
      party:    GameState.party.map(m => ({ name: m.name, classId: m.classId, level: m.level })),
      isPlayer: true,
    });
  }

  entries.sort((a, b) => b.level - a.level || b.kills - a.kills);
  return entries.slice(0, 20);
}

// ─── Initialization ─────────────────────────────────────────────────────────────

/**
 * Bootstraps the entire ghost player simulation system.
 * Loads or creates ghost data, applies offline progression, starts the per-tick
 * interval, initializes the Who's Online panel, sets up the inspect modal,
 * loads or generates market listings, starts the market trickle, schedules world-feed
 * events, and begins the zone chat loop.
 *
 * @returns {void}
 */
function initGhostPlayers() {
  // Load or create ghost players (version check is inside loadGhosts)
  let ghosts = loadGhosts();
  if (!ghosts || !ghosts.length) {
    ghosts = createGhostPlayers();
  }

  // Simulate offline progression
  ghosts = simulateOfflineProgression(ghosts);
  _ghosts = ghosts;
  saveGhosts(ghosts);

  // Set up tick interval (every 30 seconds)
  if (_ghostTickInterval) clearInterval(_ghostTickInterval);
  _ghostTickInterval = setInterval(() => {
    for (const ghost of _ghosts) {
      simulateGhostTick(ghost);
    }
    localStorage.setItem(GHOST_TICK_KEY, String(Date.now()));
    saveGhosts(_ghosts);
  }, TICK_SECONDS * 1000);

  // Initialize zone players
  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  pickZoneGhosts(zoneId);

  // Refresh who's online every 60 seconds
  if (_whoInterval) clearInterval(_whoInterval);
  _whoInterval = setInterval(() => {
    const zid = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
    pickZoneGhosts(zid);
    renderWhoOnlinePanel();
  }, 60000);

  // Refresh statuses every 15 seconds
  setInterval(() => {
    renderWhoOnlinePanel();
  }, 15000);

  // Set up ghost inspect modal (escape / click-outside to close)
  _setupGhostInspectModal();

  // Load or generate market
  let market = loadMarket();
  if (!market || !market.length) {
    market = generateMarketListings();
  }
  _marketListings = market;

  // Market trickle
  if (_marketTrickleInterval) clearInterval(_marketTrickleInterval);
  _marketTrickleInterval = setInterval(trickleMarketListing, MARKET_TRICKLE_MS);

  // World feed events
  if (_worldFeedInterval) clearInterval(_worldFeedInterval);
  const scheduleWorldEvent = () => {
    const delay = WORLD_EVENT_MIN_MS + Math.random() * WORLD_EVENT_RANGE_MS;
    _worldFeedInterval = setTimeout(() => {
      generateWorldEvent();
      scheduleWorldEvent();
    }, delay);
  };
  scheduleWorldEvent();

  // Zone chat
  if (_chatInterval) clearTimeout(_chatInterval);
  scheduleChatMessage();
}

// ─── Module Export ──────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  initGhostPlayers,
  renderWhoOnlinePanel,
  refreshZonePlayers,
  getLeaderboardData,
  getMarketListings,
  setMarketListings,
  generateMarketListings,
  showGhostInspectModal,
  showGhostContextMenu,
  CLASS_ICONS,
  CLASS_COLORS,
};
