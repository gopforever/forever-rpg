// players.js — Simulated Ghost Players for Forever RPG
// All data is client-side only, persisted in localStorage

// ─── Constants ─────────────────────────────────────────────────────────────────

const GHOST_SAVE_KEY     = 'foreverRPG_ghosts';
const GHOST_TICK_KEY     = 'foreverRPG_ghostTick';
const MARKET_SAVE_KEY    = 'foreverRPG_market';
const TICK_SECONDS       = 30;           // 30 real seconds = 1 tick
const MAX_OFFLINE_TICKS  = 8640;         // 72 hours worth of 30-second ticks
const MARKET_REFRESH_MS  = 300000;       // 5 minutes
const MARKET_TRICKLE_MS  = 150000;       // 2.5 minutes
const CHAT_MAX_MESSAGES  = 30;
const WORLD_FEED_MAX     = 3;
const WHO_ONLINE_MAX     = 8;
const WHO_ONLINE_MIN     = 4;

// Class icons matching CLASSES object
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

// Ghost player name pool — EverQuest-style fantasy names
const GHOST_NAMES = [
  'Thalindra','Drakkon','Seraphina','Gorthak','Mireille','Vaelith','Bryndor','Cressida',
  'Zoltan','Fenwick','Alyxandre','Brimthorn','Caelindra','Darkveil','Elyndra','Frostwick',
  'Gavriok','Haldric','Isylara','Jorvik','Keldrath','Lumindra','Mortifax','Nalindra',
  'Osric','Pelindra','Quellan','Ravindra','Stormwick','Talinoth','Ulveth','Velindra',
  'Wulfric','Xylandris','Ysolde','Zephyrath','Aelindra','Bolthorn','Corvinath','Duskwind',
];

// All playable class IDs
const GHOST_CLASSES = [
  'warrior','paladin','shadowknight','ranger','rogue','bard','monk',
  'wizard','magician','enchanter','necromancer','cleric','druid','shaman','beastlord','berserker',
];

// All zone IDs (must match zones.js)
const ALL_ZONES = ['qeynos_hills','blackburrow','qeynos'];

// Non-city zones used for ghost activity
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

function getSellableItems() {
  if (_sellableItems) return _sellableItems;
  if (typeof ITEMS === 'undefined') return [];
  _sellableItems = Object.values(ITEMS).filter(i => !i.nodrop && i.name);
  return _sellableItems;
}

// ─── Seeded Random Helpers ──────────────────────────────────────────────────────

function seededRand(seed) {
  // Simple mulberry32 PRNG
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function ghostSeed(ghostId, extra) {
  // Mix ghost id with day number (and optional extra) for deterministic feel
  const day = Math.floor(Date.now() / 86400000);
  return (ghostId * 31337 + day * 9973 + (extra || 0)) | 0;
}

function seededPick(arr, seed) {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

function weightedLevel() {
  // Weighted toward mid-range 10–35, min 1, max 60
  const r = Math.random();
  if (r < 0.15) return Math.floor(Math.random() * 9) + 1;          // 1–9
  if (r < 0.65) return Math.floor(Math.random() * 26) + 10;        // 10–35
  if (r < 0.90) return Math.floor(Math.random() * 15) + 36;        // 36–50
  return Math.floor(Math.random() * 10) + 51;                       // 51–60
}

// ─── Ghost Player Definitions ───────────────────────────────────────────────────

function createGhostPlayers() {
  const ghosts = [];
  for (let i = 0; i < GHOST_NAMES.length; i++) {
    const level = weightedLevel();
    const classId = GHOST_CLASSES[Math.floor(Math.random() * GHOST_CLASSES.length)];
    const zone = COMBAT_ZONES[Math.floor(Math.random() * COMBAT_ZONES.length)];
    const baseXp = typeof xpForLevel === 'function' ? xpForLevel(level) : level * 1000;

    ghosts.push({
      id: i,
      name: GHOST_NAMES[i],
      classId,
      level,
      zone,
      kills: Math.floor(Math.random() * 500 * level),
      totalXP: baseXp + Math.floor(Math.random() * (typeof xpToNextLevel === 'function' ? xpToNextLevel(level) : 1000)),
      gold: Math.floor(Math.random() * 200 * level),
      lastActive: Date.now(),
    });
  }
  return ghosts;
}

// ─── Persistence ────────────────────────────────────────────────────────────────

function loadGhosts() {
  try {
    const raw = localStorage.getItem(GHOST_SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveGhosts(ghosts) {
  try {
    localStorage.setItem(GHOST_SAVE_KEY, JSON.stringify(ghosts));
  } catch (_) {}
}

function loadMarket() {
  try {
    const raw = localStorage.getItem(MARKET_SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveMarket(listings) {
  try {
    localStorage.setItem(MARKET_SAVE_KEY, JSON.stringify(listings));
  } catch (_) {}
}

// ─── Offline Ghost Progression ──────────────────────────────────────────────────

function simulateGhostTick(ghost) {
  // XP per tick scales with level
  const xpPerTick = Math.floor(50 * ghost.level * (1 + ghost.level / 20));
  const killsPerTick = Math.max(1, Math.floor(Math.random() * (1 + ghost.level / 10)));
  const goldPerTick = Math.floor(Math.random() * (1 + ghost.level / 5));

  ghost.totalXP += xpPerTick;
  ghost.kills   += killsPerTick;
  ghost.gold    += goldPerTick;

  // Level up check
  if (typeof xpForLevel === 'function' && ghost.level < 60) {
    while (ghost.level < 60 && ghost.totalXP >= xpForLevel(ghost.level + 1)) {
      ghost.level++;
      // Occasionally change zone on level up
      if (Math.random() < 0.2) {
        ghost.zone = COMBAT_ZONES[Math.floor(Math.random() * COMBAT_ZONES.length)];
      }
    }
  }

  ghost.lastActive = Date.now();
  return ghost;
}

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

function formatChatItem(text) {
  return text.replace(/\[([^\]]+)\]/g, '<span class="chat-item">[$1]</span>');
}

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

function triggerChatMessage() {
  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  // Pick a ghost from the current zone players, or any ghost
  const pool = _zoneGhosts.length ? _zoneGhosts : _ghosts;
  if (!pool.length) return;
  const ghost = pool[Math.floor(Math.random() * pool.length)];
  addChatMessage(ghost, buildChatMessage(ghost));
}

function scheduleChatMessage() {
  const delay = 20000 + Math.random() * 25000;  // 20–45 seconds
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

function getGhostStatus(ghost) {
  const fn = STATUS_TEMPLATES[Math.floor(Math.random() * STATUS_TEMPLATES.length)];
  return fn(ghost);
}

function pickZoneGhosts(zoneId) {
  // Deterministically pick 4–8 ghosts for this zone based on ghost id + day
  const count = WHO_ONLINE_MIN + Math.floor(seededRand(ghostSeed(zoneId.length, zoneId.charCodeAt(0))) * (WHO_ONLINE_MAX - WHO_ONLINE_MIN + 1));
  const shuffled = [..._ghosts].sort((a, b) => seededRand(ghostSeed(a.id)) - seededRand(ghostSeed(b.id)));
  // Force zone so they appear to be in this zone
  const selected = shuffled.slice(0, count).map(g => ({ ...g, zone: zoneId }));
  _zoneGhosts = selected;
  return selected;
}

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
    const icon  = CLASS_ICONS[g.classId] || '⚔';
    const status = getGhostStatus(g);
    return `<div class="who-online-row">
      <span class="who-icon" style="color:${color}">${icon}</span>
      <span class="who-name" style="color:${color}">${g.name}</span>
      <span class="who-level">Lv.${g.level}</span>
      <div class="who-status">${status}</div>
    </div>`;
  }).join('');
}

function refreshZonePlayers() {
  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  pickZoneGhosts(zoneId);
  renderWhoOnlinePanel();
}

// ─── Market Listings ────────────────────────────────────────────────────────────

const VENDOR_BASE_PRICES = {
  cloth_cap:     10,  cloth_tunic: 18,  cloth_pants:  15,  simple_boots: 12,
  short_sword:   60,  dagger:      40,  crude_mace:   50,  gnarled_staff: 45,
  crude_staff:   35,  small_shield:55,  bread_loaf:    3,
};

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

function getMarketListings() {
  return _marketListings;
}

function setMarketListings(listings) {
  _marketListings = listings;
  saveMarket(listings);
}

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

function getLeaderboardData() {
  const entries = _ghosts.map(g => ({
    id:      g.id,
    name:    g.name,
    classId: g.classId,
    level:   g.level,
    kills:   g.kills,
    zone:    g.zone,
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
      isPlayer: true,
    });
  }

  entries.sort((a, b) => b.level - a.level || b.kills - a.kills);
  return entries.slice(0, 20);
}

// ─── Initialization ─────────────────────────────────────────────────────────────

function initGhostPlayers() {
  // Load or create ghost players
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
    const delay = 30000 + Math.random() * 60000;
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
  CLASS_ICONS,
  CLASS_COLORS,
};
