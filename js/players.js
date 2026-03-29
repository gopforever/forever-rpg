// players.js — Simulated Ghost Players for Forever RPG
// All data is client-side only, persisted in localStorage

// ─── Constants ─────────────────────────────────────────────────────────────────

const GHOST_SAVE_KEY     = 'foreverRPG_ghosts';
const GHOST_TICK_KEY     = 'foreverRPG_ghostTick';
const GHOST_VERSION_KEY  = 'foreverRPG_ghostsVersion';
const GHOST_PLAYERS_VERSION = 3;
const MARKET_SAVE_KEY    = 'foreverRPG_market';
const FIRST_PLAYED_KEY   = 'foreverRPG_firstPlayed';
const GHOST_POP_CAP      = 200;
const TICK_SECONDS       = 30;
const MAX_OFFLINE_TICKS  = 8640;
const MARKET_TRICKLE_MS  = 150000;
const CHAT_MAX_MESSAGES  = 30;
const WORLD_FEED_MAX     = 3;
const WHO_ONLINE_MAX     = 10;
const WHO_ONLINE_MIN     = 5;
const CHAT_MIN_DELAY_MS  = 20000;
const CHAT_DELAY_RANGE_MS = 25000;
const WORLD_EVENT_MIN_MS = 30000;
const WORLD_EVENT_RANGE_MS = 60000;

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

const EQUIP_SLOTS = [
  'head','face','ear1','ear2','neck','shoulders','back','chest',
  'wrist_l','wrist_r','hands','waist','legs','feet',
  'primary','secondary','range','ammo','ring1','ring2',
];

const PERSONALITY_TYPES = ['grinder','socialite','loner','merchant','veteran','newbie','hardcore','roleplayer'];

const PERSONALITY_ICONS = {
  grinder: '⚔️', socialite: '💬', loner: '🌑', merchant: '💰',
  veteran: '🧙', newbie: '🌱', hardcore: '💪', roleplayer: '🎭',
};

const PERSONALITY_LABELS = {
  grinder: 'Grinder', socialite: 'Socialite', loner: 'Loner', merchant: 'Merchant',
  veteran: 'Veteran', newbie: 'Newbie', hardcore: 'Hardcore', roleplayer: 'Roleplayer',
};

const GHOST_NAMES = [
  'Thalindra','Drakkon','Seraphina','Gorthak','Mireille','Vaelith','Bryndor','Cressida',
  'Zoltan','Fenwick','Alyxandre','Brimthorn','Caelindra','Darkveil','Elyndra','Frostwick',
  'Gavriok','Haldric','Isylara','Jorvik','Keldrath','Lumindra','Mortifax','Nalindra',
  'Osric','Pelindra','Quellan','Ravindra','Stormwick','Talinoth','Ulveth','Velindra',
  'Wulfric','Xylandris','Ysolde','Zephyrath','Aelindra','Bolthorn','Corvinath','Duskwind',
];

const NAME_PREFIXES = ['Thal','Drak','Vel','Myr','Zan','Bry','Sil','Gor','Mir','Vae','Ser','Cres','Celd','Xel','Boly','Fald','Gari','Hal','Ivel','Jarv','Kyr','Eor','Nor','Ral'];
const NAME_SUFFIXES = ['indra','kon','ith','ion','ara','wyn','ek','ak','el','oth','dra','ra','an','in','ix','ur','dar','eth','orn','ath','vel','ris'];

function generateGhostName(usedNames) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const pre = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
    const suf = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    const name = pre + suf;
    if (!usedNames.has(name)) return name;
  }
  const pre = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const suf = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
  return pre + suf + (1 + Math.floor(Math.random() * 99));
}

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

const GHOST_CLASSES = [
  'warrior','paladin','shadowknight','ranger','rogue','bard','monk',
  'wizard','magician','enchanter','necromancer','cleric','druid','shaman','beastlord','berserker',
];

const TANK_CLASSES   = ['warrior','paladin','shadowknight'];

const ALL_ZONES = ['qeynos_hills','blackburrow','qeynos','everfrost_peaks','west_karana','highpass_hold','kithicor_forest','commonlands','plane_of_fear','lake_of_ill_omen'];
const COMBAT_ZONES = ['qeynos_hills','blackburrow','everfrost_peaks','west_karana','highpass_hold','kithicor_forest','commonlands','plane_of_fear','lake_of_ill_omen'];

const ZONE_ENEMIES = {
  qeynos_hills: ['a Gnoll Scout','a Gray Wolf','a Brown Bear','a Giant Rat','a Bandit','Varsoon the Undying','a Fire Beetle','a Decaying Skeleton'],
  blackburrow:  ['a Gnoll Guard','a Burly Gnoll','a Gnoll Shaman','Lord Elgnub','a Plague Rat','a Giant Snake','the Gnoll Commander','the Gnoll High Shaman'],
  qeynos:       [],
  west_karana:  ['a Karana Bandit','a Giant Wolf','a Plains Griffon','a Karana Raider','a Dust Goblin','a Plains Cyclops','a Karana Gnoll Warrior'],
  highpass_hold: ['a Highpass Guard','a Pass Bandit','a Mountain Bear','a Highpass Skeleton','a Rock Troll','a Gnoll War Chief'],
  kithicor_forest: ['a Kithicor Skeleton','a Kithicor Zombie','a Warrior Spirit','a Corrupted Treant','a Kithicor Dark Elf','General Kill-Anaz'],
  commonlands:  ['an Orc Warrior','an Orc Shaman','an Orc Captain','a Commonlands Lion','a Dark Elf Ranger','Crushbone Warlord','a Plague Spectre'],
  plane_of_fear: ['a Fear Golem','a Thought Horror','a Dracoliche','a Frenzied Puma','an Amygdalan Warrior','Cazic-Thule'],
  lake_of_ill_omen: ['a Sarnak Warrior','a Sarnak Shaman','a Sarnak Berserker','a Froglok Tad','a Lake Goblin','a Goblin Shaman','a Giant Crab','an Iksar Bandit','the Emissary'],
};

const VETERAN_WARNINGS = [
  'Heads up — {enemy} is up near {loc}, nearly one-shotted my {cls} last week.',
  'Watch out at {loc}, {enemy} pops with friends. Do NOT engage solo.',
  'Pro tip: sit between pulls at {loc} to regen faster — trust me.',
  'If you see {enemy} up at {loc}, call it in zone. Rare spawn.',
  'Anyone else remember when {loc} used to be safe? Those days are gone.',
];

const CHAT_TEMPLATES = {
  lfg:     ['LFG {zone}, need {cls} PST','anyone want to group? LFG {zone}','LF{n}M for {zone} PST','need {cls} for group, LFG'],
  wts:     ['WTS [{item}] x{n}, PST','selling [{item}] cheap PST','WTS [{item}] — msg me','[{item}] for sale, {n} available PST','WTS [{item}] just upgraded — cheap!'],
  wtb:     ['WTB [{item}] PST anyone?','buying [{item}] paying good PST','WTB {n}x [{item}] message me','WTB [{item}], got gold PST'],
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
    'just got trained by 6 gnolls, lost xp smh',
    'finally dropped after 3 hours!',
    'enchanter resists are useless in this zone',
    'necro dots are insane for kiting here',
    'good group up at {loc}, ask to join',
    '{enemy} dropped a nice piece, gl to you',
  ],
  veteran: [
    'Heads up — {enemy} is up near {loc}, one-shot my {cls} last week',
    'Watch the respawn timer at {loc} — {enemy} pops faster than you think',
    'Pro tip: sit between pulls to regen faster',
    '{enemy} has an enrage — back off at 10% or you\'ll regret it',
    'Best camp in this zone is {loc} — fast respawn and good loot table',
  ],
  merchant: [
    'WTS [{item}] PST with offers',
    'WTB {item}, paying fair, PST',
    'WTS [{item}] x{n} — bulk discount PST',
    'WTB anything useful, got gold to spend PST',
  ],
};

const TELL_RESPONSES = {
  grinder:    ['Grinding hard, hit me up later.', 'In the middle of a kill streak. PST after.', 'No time to talk — kills to make.'],
  socialite:  ['OMG hey!! Wanna group??', 'Hey! Come hang out in {zone}! The more the merrier!', 'HI! I was just about to /tell you!'],
  loner:      ['...busy.', 'Solo right now.', 'Thanks but I\'m good.'],
  merchant:   ['Got any gold? I have deals!', 'PST if you want to trade.', 'Buying and selling. Hit me up.'],
  veteran:    ['Watch yourself in {zone} — dangerous tonight.', 'Need any advice out there?', 'Been playing since day one, ask me anything.'],
  newbie:     ['OH HI!! I just started!!', 'Sorry I dunno what I\'m doing lol', 'Can you help me? I\'m so lost!!'],
  hardcore:   ['Min-maxing right now. Back soon.', 'Can\'t afford downtime.', 'If you\'re not grinding, you\'re falling behind.'],
  roleplayer: ['*waves in greeting* Hail, traveler!', '*pauses mid-battle* Speak your piece.', 'Well met, adventurer. I am occupied.'],
};

const PERSONALITY_BIOS = {
  grinder:    (cls, lvl) => lvl >= 40 ? `A relentless ${cls} who hasn't logged out in days. Kill count speaks for itself.` : `A ${cls} chasing the next level with single-minded intensity.`,
  socialite:  (cls, lvl) => `A ${cls} who knows half the server by name. Always looking for a group.`,
  loner:      (cls, lvl) => `A ${cls} who prefers the quiet company of monsters. Solo since day one.`,
  merchant:   (cls, lvl) => `Always buying and selling — if it has a price, they've traded it.`,
  veteran:    (cls, lvl) => lvl >= 40 ? `A seasoned ${cls} who's been farming this server since it opened. Knows every spawn timer.` : `An experienced ${cls} who's seen it all before.`,
  newbie:     (cls, lvl) => lvl <= 10 ? `A fresh ${cls} still learning the ropes in Qeynos Hills.` : `A ${cls} who still gets excited over every drop.`,
  hardcore:   (cls, lvl) => `A ${cls} who considers sleeping a waste of XP. Death is not an option.`,
  roleplayer: (cls, lvl) => `A ${cls} who lives the lore. Every kill has a story; every item, a legend.`,
};

const ZONE_LOCS = {
  qeynos_hills: ['gnoll camp','wolf den','pond','ruins','Qeynos gate','the hill','the creek'],
  blackburrow:  ['upper tunnels','flooded area','deep chamber','gnoll brewery','the trap room','lower level'],
  qeynos:       ['the bank','the guild hall','the market','the temple','south district'],
  west_karana:  ['the road','the bandit camp','the gnoll outpost','the griffon roost','the cyclops fields','the river crossing'],
  highpass_hold: ['the mountain pass','the guard post','the bandit hideout','the troll cave','the gnoll war camp','the cliffside'],
  kithicor_forest: ['the dark grove','the haunted clearing','the old battlefield','the treant grove','the dark elf camp','the general\'s tomb'],
  commonlands:  ['the orc camp','the dark elf outpost','the lion plains','the road south','the warlord\'s fortress','the plagued gully'],
  plane_of_fear: ['the altar','the spire','the lava pit','Cazic\'s throne','the golem forge'],
  lake_of_ill_omen: ['the eastern docks','the sarnak encampment','the goblin village','the sunken ruins','the deep water','the lake shore'],
};

const PERSONALITY_STATUSES = {
  grinder:    g => `Hunting ${(ZONE_ENEMIES[g.zone]||['monsters'])[0]} — kill count climbing`,
  socialite:  g => `LFG anyone?? Need more people!`,
  loner:      g => `Solo farming the ruins`,
  merchant:   g => `Looking for deals`,
  veteran:    g => `Patrolling ${(ZONE_LOCS[g.zone]||['the area'])[0]} — eyes open`,
  newbie:     g => `Still learning — excited to be here!`,
  hardcore:   g => `Optimizing route — no downtime`,
  roleplayer: g => `*venturing through the ${(ZONE_LOCS[g.zone]||['ancient land'])[0]}*`,
};

let _sellableItems = null;

function getSellableItems() {
  if (_sellableItems) return _sellableItems;
  if (typeof ITEMS === 'undefined') return [];
  _sellableItems = Object.values(ITEMS).filter(i => !i.nodrop && i.name);
  return _sellableItems;
}

// ─── Seeded Random Helpers ──────────────────────────────────────────────────────

function seededRand(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function ghostSeed(ghostId, extra) {
  const day = Math.floor(Date.now() / 86400000);
  return (ghostId * 31337 + day * 9973 + (extra || 0)) | 0;
}

function seededPick(arr, seed) {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

function weightedLevel() {
  const r = Math.random();
  if (r < 0.15) return Math.floor(Math.random() * 9) + 1;
  if (r < 0.65) return Math.floor(Math.random() * 26) + 10;
  if (r < 0.90) return Math.floor(Math.random() * 15) + 36;
  return Math.floor(Math.random() * 10) + 51;
}

// ─── Ghost Party Builder ─────────────────────────────────────────────────────────

function createGhostParty(leaderName, leaderClassId) {
  const size = 5;
  const usedClasses = new Set([leaderClassId]);
  const usedNames   = new Set([leaderName]);

  const members = [{ name: leaderName, classId: leaderClassId, level: 1, xp: 0 }];
  const toAdd = size - 1;
  if (toAdd === 0) return members;

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

// ─── Item Helpers ────────────────────────────────────────────────────────────────

function getItemSlot(item) {
  if (!item) return null;
  if (item.slot && EQUIP_SLOTS.includes(item.slot)) return item.slot;
  if (item.type === 'weapon') return 'primary';
  if (item.type === 'armor') return item.slot || 'chest';
  if (item.type === 'jewelry') {
    if (item.id && item.id.includes('ring')) return 'ring1';
    if (item.id && item.id.includes('ear')) return 'ear1';
    if (item.id && item.id.includes('neck')) return 'neck';
    return 'ring1';
  }
  return null;
}

function sumItemStats(item) {
  if (!item) return 0;
  return ['str','dex','agi','sta','wis','int','cha','hp','mana','ac'].reduce((s, k) => s + (item[k] || 0), 0);
}

function isItemUpgrade(slot, newItem, equippedItem) {
  if (!equippedItem) return true;
  if (newItem.type === 'armor') return (newItem.ac || 0) > (equippedItem.ac || 0);
  if (newItem.type === 'weapon') {
    const nr = newItem.delay ? (newItem.dmg || 0) / newItem.delay : 0;
    const er = equippedItem.delay ? (equippedItem.dmg || 0) / equippedItem.delay : 0;
    return nr > er;
  }
  return sumItemStats(newItem) > sumItemStats(equippedItem);
}

function tryAutoEquip(ghost, newItem) {
  const slot = getItemSlot(newItem);
  if (!slot) return false;
  if (!ghost.equipment) ghost.equipment = {};
  const currentId = ghost.equipment[slot];
  const currentItem = currentId && typeof ITEMS !== 'undefined' ? ITEMS[currentId] : null;
  if (!isItemUpgrade(slot, newItem, currentItem)) return false;
  ghost.equipment[slot] = newItem.id;
  if (currentId) {
    if (!ghost.inventory) ghost.inventory = [];
    if (ghost.inventory.length < 20) ghost.inventory.push(currentId);
  }
  if (ghost.inventory) {
    const idx = ghost.inventory.lastIndexOf(newItem.id);
    if (idx !== -1) ghost.inventory.splice(idx, 1);
  }
  return true;
}

// ─── Ghost Player Definitions ───────────────────────────────────────────────────

const BEGINNER_ZONES = ['qeynos_hills', 'blackburrow'];

function createSingleGhost(id, name, isNew) {
  const classId     = GHOST_CLASSES[Math.floor(Math.random() * GHOST_CLASSES.length)];
  const zone        = BEGINNER_ZONES[Math.floor(Math.random() * BEGINNER_ZONES.length)];
  const xpRate      = 0.8 + Math.random() * 0.7;
  const personality = PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
  const ghost = {
    id, name, classId, level: 1, zone, kills: 0, totalXP: 0, gold: 0,
    xpRate, personality, inventory: [], equipment: {},
    lastActive: Date.now(),
    lastZoneChange: 0,
    ticksInZone: 0,
    party: createGhostParty(name, classId),
    spellBook: [],
    actionBar: [],
  };
  if (isNew) {
    setTimeout(() => {
      pushWorldEvent(`🌟 <strong style="color:${CLASS_COLORS[classId]}">${name}</strong> joined the server for the first time!`);
    }, 100);
  }
  initGhostStats(ghost);
  ghost.skills = (typeof initSkills === 'function') ? initSkills(ghost.classId, ghost.level) : {};
  return ghost;
}

function createGhostPlayers() {
  const ghosts = [];
  for (let i = 0; i < GHOST_NAMES.length; i++) {
    ghosts.push(createSingleGhost(i, GHOST_NAMES[i], false));
  }
  return ghosts;
}

// ─── Persistence ────────────────────────────────────────────────────────────────

function loadGhosts() {
  try {
    const version = parseInt(localStorage.getItem(GHOST_VERSION_KEY) || '0', 10);
    if (version !== GHOST_PLAYERS_VERSION) {
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

function saveGhosts(ghosts) {
  try {
    localStorage.setItem(GHOST_SAVE_KEY, JSON.stringify(ghosts));
    localStorage.setItem(GHOST_VERSION_KEY, String(GHOST_PLAYERS_VERSION));
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

// ─── Population Helpers ─────────────────────────────────────────────────────────

function getPopulationTarget() {
  let firstPlayed = 0;
  try { firstPlayed = parseInt(localStorage.getItem(FIRST_PLAYED_KEY) || '0', 10); } catch (_) {}
  if (!firstPlayed) return 20;
  const daysSince = (Date.now() - firstPlayed) / 86400000;
  return Math.min(GHOST_POP_CAP, Math.floor(20 + 180 * (1 - Math.exp(-daysSince / 20))));
}

function getDynamicWhoOnlineRange() {
  const n = _ghosts.length;
  if (n < 30)  return { min: 4,  max: 8  };
  if (n < 80)  return { min: 6,  max: 12 };
  if (n < 150) return { min: 8,  max: 18 };
  return           { min: 10, max: 30 };
}

// ─── Module-level State ─────────────────────────────────────────────────────────

let _ghosts = [];
let _zoneGhosts = [];
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
  while (feed.children.length > WORLD_FEED_MAX) {
    feed.removeChild(feed.firstChild);
  }
  setTimeout(() => {
    if (badge.parentNode) badge.parentNode.removeChild(badge);
  }, 10000);
}

function generateWorldEvent() {
  const ghost = _ghosts[Math.floor(Math.random() * _ghosts.length)];
  if (!ghost) return;
  const r = Math.random();
  const color = CLASS_COLORS[ghost.classId] || '#e8d5a0';
  const personality = ghost.personality || 'grinder';
  const zone = typeof ZONES !== 'undefined' && ZONES[ghost.zone] ? ZONES[ghost.zone].name : ghost.zone;
  const enemies = ZONE_ENEMIES[ghost.zone] || ['a monster'];
  const enemy = enemies[Math.floor(Math.random() * enemies.length)];

  if (r < 0.10) {
    const z = typeof ZONES !== 'undefined' ? ZONES[ghost.zone] : null;
    const rares = z && z.rareEnemies ? z.rareEnemies : null;
    if (rares && rares.length) {
      const rare = rares[Math.floor(Math.random() * rares.length)];
      const rareName = rare.name || rare;
      pushWorldEvent(`🗡️ <strong style="color:#ff8800">${ghost.name}</strong> slew <span style="color:#ff8800">[${rareName}]</span>! A worthy hunt.`);
    } else {
      pushWorldEvent(`⚔ <strong style="color:${color}">${ghost.name}</strong> slew ${enemy} in ${zone}!`);
    }
  } else if (r < 0.35) {
    if (personality === 'veteran') {
      pushWorldEvent(`⚔ <strong style="color:${color}">${ghost.name}</strong> dispatched ${enemy} in ${zone} with practiced efficiency.`);
    } else if (personality === 'newbie') {
      pushWorldEvent(`⚔ <strong style="color:${color}">${ghost.name}</strong> defeated ${enemy}! (First time!)`);
    } else {
      pushWorldEvent(`⚔ <strong style="color:${color}">${ghost.name}</strong> slew ${enemy} in ${zone}!`);
    }
  } else if (r < 0.55) {
    pushWorldEvent(`🌟 <strong style="color:${color}">${ghost.name}</strong> reached Level ${ghost.level}!`);
  } else if (r < 0.70) {
    pushWorldEvent(`💀 <strong style="color:${color}">${ghost.name}</strong> was slain by ${enemy}!`);
  } else if (r < 0.85) {
    const items = getSellableItems();
    if (items.length) {
      const item = items[Math.floor(Math.random() * items.length)];
      if (personality === 'newbie') {
        pushWorldEvent(`🏆 <strong style="color:${color}">${ghost.name}</strong> found [${item.name}]! Amazing!!`);
      } else if (personality === 'merchant') {
        pushWorldEvent(`🏆 <strong style="color:${color}">${ghost.name}</strong> acquired [${item.name}] — listing it soon!`);
      } else {
        pushWorldEvent(`🏆 <strong style="color:${color}">${ghost.name}</strong> claimed [${item.name}]!`);
      }
    }
  } else {
    if (personality === 'veteran') {
      const locs = ZONE_LOCS[ghost.zone] || ['the area'];
      const cls  = GHOST_CLASSES[Math.floor(Math.random() * GHOST_CLASSES.length)];
      const loc  = locs[Math.floor(Math.random() * locs.length)];
      const template = VETERAN_WARNINGS[Math.floor(Math.random() * VETERAN_WARNINGS.length)];
      const msg = template.replace('{enemy}', enemy).replace('{loc}', loc).replace('{cls}', cls);
      pushWorldEvent(`📣 <strong style="color:${color}">${ghost.name}</strong> [Veteran]: "${msg}"`);
    } else if (personality === 'merchant') {
      const items = getSellableItems();
      if (items.length) {
        const item = items[Math.floor(Math.random() * items.length)];
        const price = Math.max(1, Math.round(getBasePrice(item.id) * 0.85));
        pushWorldEvent(`💰 <strong style="color:${color}">${ghost.name}</strong> listed [${item.name}] on the market for ${price}c`);
      }
    } else {
      const items = getSellableItems();
      if (items.length) {
        const item = items[Math.floor(Math.random() * items.length)];
        pushWorldEvent(`🏆 <strong style="color:${color}">${ghost.name}</strong> claimed [${item.name}]!`);
      }
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

  // Achievement hook: chat message seen
  if (typeof checkAchievements === 'function') {
    checkAchievements('chat_message', {});
  }

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
  const personality = ghost.personality || 'grinder';
  const r = Math.random();

  let pool;
  if (personality === 'loner') {
    if (Math.random() < 0.6) return null;
    pool = CHAT_TEMPLATES.general;
  } else if (personality === 'merchant') {
    pool = r < 0.5 ? CHAT_TEMPLATES.wts : r < 0.75 ? CHAT_TEMPLATES.wtb : CHAT_TEMPLATES.merchant;
  } else if (personality === 'socialite') {
    pool = r < 0.5 ? CHAT_TEMPLATES.lfg : CHAT_TEMPLATES.general;
  } else if (personality === 'grinder') {
    pool = r < 0.4 ? CHAT_TEMPLATES.wts : CHAT_TEMPLATES.general;
  } else if (personality === 'veteran') {
    pool = r < 0.6 ? CHAT_TEMPLATES.veteran : CHAT_TEMPLATES.general;
  } else if (personality === 'hardcore') {
    pool = r < 0.3 ? CHAT_TEMPLATES.wts : CHAT_TEMPLATES.general;
  } else {
    if (r < 0.25)      pool = CHAT_TEMPLATES.lfg;
    else if (r < 0.45) pool = CHAT_TEMPLATES.wts;
    else if (r < 0.55) pool = CHAT_TEMPLATES.wtb;
    else               pool = CHAT_TEMPLATES.general;
  }

  let msg = pool[Math.floor(Math.random() * pool.length)];
  if (personality === 'roleplayer' && Math.random() < 0.5) msg = `*${msg}*`;
  if (isNight && Math.random() < 0.3) msg = 'good hunting out here tonight';

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
  const pool = _zoneGhosts.length ? _zoneGhosts : _ghosts;
  if (!pool.length) return;
  const ghost = pool[Math.floor(Math.random() * pool.length)];
  const msg = buildChatMessage(ghost);
  if (msg) addChatMessage(ghost, msg);
}

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

function getGhostStatus(ghost) {
  const personality = ghost.personality;
  if (personality && PERSONALITY_STATUSES[personality] && Math.random() < 0.5) {
    return PERSONALITY_STATUSES[personality](ghost);
  }
  const fn = STATUS_TEMPLATES[Math.floor(Math.random() * STATUS_TEMPLATES.length)];
  return fn(ghost);
}

function pickZoneGhosts(zoneId) {
  const { min, max } = getDynamicWhoOnlineRange();
  const count = min + Math.floor(seededRand(ghostSeed(zoneId.length, zoneId.charCodeAt(0))) * (max - min));
  const shuffled = [..._ghosts].sort((a, b) => seededRand(ghostSeed(a.id)) - seededRand(ghostSeed(b.id)));
  const selected = shuffled.slice(0, count).map(g => ({ ...g, zone: zoneId }));
  _zoneGhosts = selected;
  return selected;
}

function renderWhoOnlinePanel() {
  const el = document.getElementById('who-online-list');
  if (!el) return;

  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  const inCity = typeof ZONES !== 'undefined' && ZONES[zoneId] && ZONES[zoneId].isSafeZone;

  const dynMax = getDynamicWhoOnlineRange().max;
  const list = inCity
    ? _ghosts.slice(0, dynMax).map(g => ({ ...g }))
    : _zoneGhosts;

  if (!list.length) {
    el.innerHTML = '<div class="no-kills">No players nearby.</div>';
    return;
  }

  el.innerHTML = list.map(g => {
    const color = CLASS_COLORS[g.classId] || '#e8d5a0';
    const personality = g.personality || 'grinder';
    const pIcon = PERSONALITY_ICONS[personality] || '';
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
      <span class="personality-icon" title="${PERSONALITY_LABELS[personality] || personality}">${pIcon}</span>
      <span class="party-icons">${partyIconsHtml}</span>
      <span class="who-level">Lv.${g.level}</span>
      <div class="who-status">${status}</div>
    </div>`;
  }).join('');

  el.querySelectorAll('.who-online-row').forEach(row => {
    const ghostId = parseInt(row.dataset.ghostId, 10);
    const ghost = _ghosts.find(g => g.id === ghostId) || list.find(g => g.id === ghostId);
    if (!ghost) return;

    row.addEventListener('click', () => showGhostInspectModal(ghost));
    row.addEventListener('contextmenu', e => {
      e.preventDefault();
      showGhostContextMenu(ghost, e.clientX, e.clientY);
    });
  });
}

function refreshZonePlayers() {
  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  pickZoneGhosts(zoneId);
  renderWhoOnlinePanel();
}

// ─── Ghost Inspect Modal ─────────────────────────────────────────────────────────

function getGhostTitle(kills) {
  if (kills < 100)   return 'Novice Adventurer';
  if (kills < 1000)  return 'Seasoned Fighter';
  if (kills < 5000)  return 'Veteran of the Wilds';
  return 'Champion of Norrath';
}

function getGhostBio(ghost) {
  const cls = ghost.classId.charAt(0).toUpperCase() + ghost.classId.slice(1);
  const fn = PERSONALITY_BIOS[ghost.personality || 'grinder'];
  return fn ? fn(cls, ghost.level) : `A ${cls} adventuring in the world.`;
}

function computeGhostStats(ghost) {
  // Use stats.js functions if available; otherwise fall back to simple formulas
  if (typeof getMaxHP === 'function' && typeof CLASSES !== 'undefined' && CLASSES[ghost.classId]) {
    initGhostStats(ghost);
    return { hp: ghost.maxHP, mana: ghost.maxMana, ac: ghost.currentAC || (5 + ghost.level * 2) };
  }
  let hp = 50 + ghost.level * 10;
  let mana = 50 + ghost.level * 8;
  let ac = 5 + ghost.level * 2;
  if (ghost.equipment && typeof ITEMS !== 'undefined') {
    for (const slot of EQUIP_SLOTS) {
      const item = ITEMS[ghost.equipment[slot]];
      if (!item) continue;
      hp   += item.hp   || 0;
      mana += item.mana || 0;
      ac   += item.ac   || 0;
    }
  }
  return { hp, mana, ac };
}

/**
 * Initialises or refreshes all stats on a ghost using the same stats.js formulas
 * as the player character, so ghost HP/mana/AC scale correctly with class and level.
 * @param {object} ghost - The ghost player object (modified in place).
 */
function initGhostStats(ghost) {
  if (typeof CLASSES === 'undefined' || !CLASSES[ghost.classId]) return;
  const cls = CLASSES[ghost.classId];
  const level = ghost.level || 1;
  // Apply base stats with per-level growth
  const base = cls.baseStats || {};
  const primary = new Set(cls.primaryStats || []);
  for (const stat of ['STR', 'DEX', 'AGI', 'STA', 'WIS', 'INT', 'CHA']) {
    ghost[stat] = (base[stat] || 75) + (level - 1) * (primary.has(stat) ? 2 : 1);
  }
  ghost.equipment = ghost.equipment || {};
  if (typeof computeDerivedStats === 'function') {
    computeDerivedStats(ghost);
  } else {
    ghost.maxHP = 50 + level * 10;
    ghost.maxMana = 50 + level * 8;
    ghost.hp = ghost.maxHP;
    ghost.mana = ghost.maxMana;
  }
}

function getItemRarityClass(item) {
  if (!item) return 'rarity-common';
  if (item.rarity === 'named')  return 'rarity-named';
  if (item.rarity === 'rare')   return 'rarity-rare';
  if (item.rarity === 'magic')  return 'rarity-magic';
  return 'rarity-common';
}

function showGhostInspectModal(ghost) {
  const modal = document.getElementById('ghost-inspect-modal');
  if (!modal) return;

  // Achievement hook: inspect ghost
  if (typeof checkAchievements === 'function') checkAchievements('inspect', {});

  const zone  = typeof ZONES !== 'undefined' && ZONES[ghost.zone] ? ZONES[ghost.zone].name : ghost.zone;
  const party = ghost.party || [{ name: ghost.name, classId: ghost.classId, level: ghost.level, xp: 0 }];
  const personality = ghost.personality || 'grinder';
  const pIcon  = PERSONALITY_ICONS[personality] || '';
  const pLabel = PERSONALITY_LABELS[personality] || personality;
  const bio    = getGhostBio(ghost);
  const stats  = computeGhostStats(ghost);
  const title  = getGhostTitle(ghost.kills || 0);
  const classNameStr = ghost.classId.charAt(0).toUpperCase() + ghost.classId.slice(1);
  const classColor   = CLASS_COLORS[ghost.classId] || '#e8d5a0';
  const classIcon    = CLASS_ICONS[ghost.classId] || '⚔';

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

  const slotLabels = {
    head:'Head',face:'Face',ear1:'Ear 1',ear2:'Ear 2',neck:'Neck',shoulders:'Shoulders',
    back:'Back',chest:'Chest',wrist_l:'Wrist L',wrist_r:'Wrist R',hands:'Hands',waist:'Waist',
    legs:'Legs',feet:'Feet',primary:'Primary',secondary:'Secondary',
    range:'Range',ammo:'Ammo',ring1:'Ring 1',ring2:'Ring 2',
  };

  const equipRows = EQUIP_SLOTS.map(slot => {
    const itemId = ghost.equipment && ghost.equipment[slot];
    const item   = itemId && typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
    const label  = slotLabels[slot] || slot;
    if (item) {
      return `<div class="ghost-equip-row"><span class="ghost-equip-slot">${label}</span><span class="ghost-equip-item ${getItemRarityClass(item)}">[${item.name}]</span></div>`;
    }
    return `<div class="ghost-equip-row"><span class="ghost-equip-slot">${label}</span><span class="ghost-equip-empty">——</span></div>`;
  }).join('');

  const equippedSet = new Set(ghost.equipment ? Object.values(ghost.equipment) : []);
  const unequipped  = (ghost.inventory || []).filter(id => !equippedSet.has(id));
  const preview     = unequipped.slice(-5).reverse();
  const invRows = preview.length
    ? preview.map(id => {
        const item = typeof ITEMS !== 'undefined' ? ITEMS[id] : null;
        if (!item) return '';
        return `<div class="ghost-inv-row"><span class="${getItemRarityClass(item)}">[${item.name}]</span></div>`;
      }).join('')
    : '<div class="ghost-inv-row ghost-inv-empty">No items in bag</div>';

  const totalKills = (ghost.kills || 0).toLocaleString();
  const totalGold  = (ghost.gold  || 0).toLocaleString();

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  content.innerHTML = `
    <button class="modal-close" id="ghost-inspect-close">✕</button>
    <div class="ghost-inspect-header">
      <span class="ghost-inspect-classicon" style="color:${classColor}">${classIcon}</span>
      <div class="ghost-inspect-nameblock">
        <h2 style="color:${classColor}">${ghost.name}</h2>
        <div class="ghost-inspect-subtitle">${classNameStr} · Level ${ghost.level}</div>
        <div class="ghost-inspect-badge"><span class="personality-badge">${pIcon} ${pLabel}</span> · <em>${title}</em></div>
      </div>
    </div>
    <div class="ghost-inspect-bio">${bio}</div>
    <div class="ghost-inspect-stats-row">
      <span class="ghost-stat-hp">❤ ${stats.hp} HP</span>
      <span class="ghost-stat-mana">💧 ${stats.mana} Mana</span>
      <span class="ghost-stat-ac">🛡 ${stats.ac} AC</span>
      <span class="ghost-stat-kills">💀 ${totalKills} kills</span>
      <span class="ghost-stat-gold">💰 ${totalGold}c</span>
    </div>
    <div class="ghost-inspect-section-label">⚔ Equipment</div>
    <div class="ghost-equip-panel">${equipRows}</div>
    <div class="ghost-inspect-section-label">🎒 Bag Preview</div>
    <div class="ghost-inv-panel">${invRows}</div>
    <div class="ghost-inspect-section-label">👥 Party — Zone: ${zone}</div>
    <div class="ghost-party-list">${partyRows}</div>
  `;

  modal.style.display = 'flex';
  content.querySelector('#ghost-inspect-close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

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
        const personality = ghost.personality || 'grinder';
        const pool = TELL_RESPONSES[personality] || TELL_RESPONSES.grinder;
        const zoneId = typeof GameState !== 'undefined' ? GameState.zone : ghost.zone;
        const zoneName = typeof ZONES !== 'undefined' && ZONES[zoneId] ? ZONES[zoneId].name : zoneId;
        const msg = pool[Math.floor(Math.random() * pool.length)].replace('{zone}', zoneName);
        addChatMessage(ghost, `[Tell from ${ghost.name}]: ${msg}`);
      } else if (action === 'invite') {
        addChatMessage(ghost, `[Tell from ${ghost.name}]: Thanks for the invite! Party is full though, sorry.`);
      }
      menu.remove();
      _contextMenu = null;
    });
  });

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

function getBasePrice(itemId) {
  if (VENDOR_BASE_PRICES[itemId]) return VENDOR_BASE_PRICES[itemId];
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
    const item      = items[Math.floor(Math.random() * items.length)];
    const ghost     = _ghosts[Math.floor(Math.random() * _ghosts.length)];
    const qty       = Math.floor(Math.random() * 5) + 1;
    const base      = getBasePrice(item.id);
    const personality = ghost ? (ghost.personality || 'grinder') : 'grinder';
    let mult;
    if (personality === 'merchant')     mult = 0.85;
    else if (personality === 'veteran') mult = 1.20;
    else if (personality === 'newbie')  mult = 0.75;
    else                                mult = 0.7 + Math.random() * 0.6;
    const price = Math.max(1, Math.round(base * mult));

    listings.push({
      id:          Date.now() + i,
      itemId:      item.id,
      itemName:    item.name,
      seller:      ghost ? ghost.name    : 'Unknown',
      sellerId:    ghost ? ghost.id      : -1,
      sellerClass: ghost ? ghost.classId : 'warrior',
      qty,
      price,
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
  if (_marketListings.length >= 30) {
    _marketListings.shift();
  }
  const [newListing] = generateMarketListings(1);
  if (newListing) {
    _marketListings.push(newListing);
    saveMarket(_marketListings);
  }
}

function ghostSellItemToMarket(ghost) {
  if (!ghost.inventory || !ghost.inventory.length) return;
  const itemId = ghost.inventory[Math.floor(Math.random() * ghost.inventory.length)];
  const item = typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
  if (!item) return;
  const base = getBasePrice(itemId);
  const p = ghost.personality || 'grinder';
  let price;
  if (p === 'merchant')     price = Math.round(base * 0.85);
  else if (p === 'veteran') price = Math.round(base * 1.20);
  else if (p === 'newbie')  price = Math.round(base * 0.75);
  else                      price = Math.round(base * (0.7 + Math.random() * 0.6));
  price = Math.max(1, price);
  if (_marketListings.length >= 30) _marketListings.shift();
  _marketListings.push({
    id: `${Date.now()}_${Math.random()}`,
    itemId: item.id, itemName: item.name,
    seller: ghost.name, sellerId: ghost.id, sellerClass: ghost.classId,
    qty: 1, price,
  });
  saveMarket(_marketListings);
}

function ghostBuyFromMarket(ghost) {
  if (!ghost.equipment) ghost.equipment = {};
  if (!ghost.inventory) ghost.inventory = [];
  for (let i = 0; i < _marketListings.length; i++) {
    const listing = _marketListings[i];
    if (listing.sellerId === ghost.id) continue;
    const item = typeof ITEMS !== 'undefined' ? ITEMS[listing.itemId] : null;
    if (!item || (item.levelReq || 0) > ghost.level) continue;
    const slot = getItemSlot(item);
    if (!slot) continue;
    const currentId = ghost.equipment[slot];
    const currentItem = currentId && typeof ITEMS !== 'undefined' ? ITEMS[currentId] : null;
    if (!isItemUpgrade(slot, item, currentItem)) continue;
    const sellerName = listing.seller;
    const itemName   = listing.itemName;
    const price      = listing.price;
    _marketListings.splice(i, 1);
    ghost.inventory.push(item.id);
    tryAutoEquip(ghost, item);
    saveMarket(_marketListings);
    pushWorldEvent(`🛒 <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> purchased [${itemName}] from the market.`);
    if (sellerName && sellerName !== ghost.name) {
      pushWorldEvent(`🤝 <strong>${sellerName}</strong> sold [${itemName}] to <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> for ${price}c`);
      // If the seller is the real player, credit them gold
      if (listing.sellerId === 'player' && typeof GameState !== 'undefined') {
        GameState.copper = (GameState.copper || 0) + price;
        // Normalize coins (10c = 1s, 10s = 1g, 10g = 1p)
        if (typeof normalizeCoins === 'function') {
          normalizeCoins();
        } else {
          if (GameState.copper >= 10) {
            GameState.silver = (GameState.silver || 0) + Math.floor(GameState.copper / 10);
            GameState.copper = GameState.copper % 10;
          }
          if (GameState.silver >= 10) {
            GameState.gold = (GameState.gold || 0) + Math.floor(GameState.silver / 10);
            GameState.silver = GameState.silver % 10;
          }
          if (GameState.gold >= 10) {
            GameState.platinum = (GameState.platinum || 0) + Math.floor(GameState.gold / 10);
            GameState.gold = GameState.gold % 10;
          }
        }
        if (typeof addCombatLog === 'function') addCombatLog(`💰 Your item [${itemName}] sold on the market for ${price}c!`, 'loot');
        if (typeof renderTopBar === 'function') renderTopBar();
      }
    }
    break;
  }
}

/**
 * Lists one of the real player's inventory items on the Player Marketplace.
 * @param {string} itemId - The item ID to list.
 * @param {number} price  - Listing price in copper.
 */
function playerListItemOnMarket(itemId, price) {
  if (!itemId || !price || price <= 0) {
    if (typeof addCombatLog === 'function') addCombatLog('Invalid listing — enter a valid item and price > 0.', 'system');
    return;
  }
  const inventory = typeof GameState !== 'undefined' ? (GameState.inventory || []) : [];
  const stackIdx = inventory.findIndex(s => s && s.itemId === itemId);
  if (stackIdx === -1) {
    if (typeof addCombatLog === 'function') addCombatLog('Item not found in your inventory.', 'system');
    return;
  }
  const item = typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
  if (!item) { if (typeof addCombatLog === 'function') addCombatLog('Unknown item.', 'system'); return; }
  if (item.nodrop) {
    if (typeof addCombatLog === 'function') addCombatLog(`${item.name} is NO DROP and cannot be listed.`, 'system');
    return;
  }

  // Remove one from inventory
  const stack = inventory[stackIdx];
  stack.quantity -= 1;
  if (stack.quantity <= 0) inventory.splice(stackIdx, 1);

  const sellerName = (GameState.party && GameState.party.length) ? GameState.party[0].name : 'You';
  if (_marketListings.length >= 30) _marketListings.shift();
  _marketListings.push({
    id: `${Date.now()}_${Math.random()}`,
    itemId: item.id, itemName: item.name,
    seller: sellerName, sellerId: 'player', sellerClass: null,
    qty: 1, price: Math.round(price),
  });
  saveMarket(_marketListings);

  if (typeof addCombatLog === 'function') addCombatLog(`Listed [${item.name}] on the Player Marketplace for ${price}c.`, 'loot');
  if (typeof saveGame === 'function') saveGame();
  if (typeof checkAchievements === 'function') checkAchievements('market_sell', {});
  if (typeof renderCityTabContent === 'function') renderCityTabContent('players');
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
}

// ─── Ghost Tick Simulation ──────────────────────────────────────────────────────

function simulateGhostTick(ghost) {
  const rate = ghost.xpRate || 1;
  const xpPerTick = Math.floor(50 * ghost.level * (1 + ghost.level / 20) * rate);
  const killsPerTick = Math.max(1, Math.floor(Math.random() * (1 + ghost.level / 10)));
  const goldPerTick = Math.floor(Math.random() * (1 + ghost.level / 5));

  ghost.totalXP += xpPerTick;
  ghost.kills   += killsPerTick;
  ghost.gold    += goldPerTick;

  // Track ticks spent in current zone; move to a new zone occasionally
  if (!ghost.lastZoneChange) ghost.lastZoneChange = 0;
  if (!ghost.ticksInZone) ghost.ticksInZone = 0;
  ghost.ticksInZone++;
  if (ghost.ticksInZone >= 10 && Math.random() < 0.10) {
    const suitableZones = COMBAT_ZONES.filter(zid => {
      const z = typeof ZONES !== 'undefined' ? ZONES[zid] : null;
      if (!z || zid === ghost.zone) return false;
      if (!z.levelRange) return true;
      const [lo, hi] = z.levelRange;
      return ghost.level >= lo - 2 && ghost.level <= hi + 3;
    });
    if (suitableZones.length) {
      ghost.zone = suitableZones[Math.floor(Math.random() * suitableZones.length)];
      ghost.lastZoneChange = Date.now();
      ghost.ticksInZone = 0;
    }
  }

  // Initialize visitedZones tracking
  if (!ghost.visitedZones) ghost.visitedZones = [];
  if (ghost.zone && !ghost.visitedZones.includes(ghost.zone)) {
    ghost.visitedZones.push(ghost.zone);
    // Ghost discovers a zone — World First
    if (typeof recordWorldFirst === 'function') {
      const zoneName = (typeof ZONES !== 'undefined' && ZONES[ghost.zone]) ? ZONES[ghost.zone].name : ghost.zone;
      recordWorldFirst(`first_zone_${ghost.zone}`, ghost.name, `${ghost.name} discovered ${zoneName}!`);
    }
  }

  if (typeof xpForLevel === 'function' && ghost.level < 60) {
    let didLevelUp = false;
    while (ghost.level < 60 && ghost.totalXP >= xpForLevel(ghost.level + 1)) {
      ghost.level++;
      didLevelUp = true;
      if (ghost.party) {
        for (const member of ghost.party) { member.level = ghost.level; }
      }
      // World First: level 60
      if (ghost.level === 60 && typeof recordWorldFirst === 'function') {
        recordWorldFirst('first_level_60', ghost.name, `${ghost.name} reached Level 60!`);
      }
      if (Math.random() < 0.2) {
        const suitableZones = COMBAT_ZONES.filter(zid => {
          const z = typeof ZONES !== 'undefined' ? ZONES[zid] : null;
          return z && z.levelRange && ghost.level >= z.levelRange[0] && ghost.level <= z.levelRange[1];
        });
        ghost.zone = suitableZones.length
          ? suitableZones[Math.floor(Math.random() * suitableZones.length)]
          : COMBAT_ZONES[Math.floor(Math.random() * COMBAT_ZONES.length)];
      }
    }
    // Recalculate derived stats when the ghost gains a level
    if (didLevelUp) {
      initGhostStats(ghost);
      if (typeof unlockSkillsForLevel === 'function') unlockSkillsForLevel(ghost);
    }
  }

  if (!ghost.inventory) ghost.inventory = [];
  if (!ghost.equipment) ghost.equipment = {};
  if (Math.random() < 0.15 && typeof ITEMS !== 'undefined') {
    const zoneData = typeof ZONES !== 'undefined' ? ZONES[ghost.zone] : null;
    const zoneMaxLevel = (zoneData && zoneData.levelRange) ? zoneData.levelRange[1] : ghost.level;
    const zoneMinLevel = (zoneData && zoneData.levelRange) ? zoneData.levelRange[0] : 1;
    const lootable = Object.values(ITEMS).filter(i => {
      if (i.nodrop || !i.name) return false;
      const itemLevel = i.levelReq || zoneMinLevel;
      return itemLevel <= ghost.level && itemLevel <= zoneMaxLevel + 5;
    });
    if (lootable.length) {
      const newItem = lootable[Math.floor(Math.random() * lootable.length)];
      if (ghost.inventory.length >= 20) ghost.inventory.shift();
      ghost.inventory.push(newItem.id);
      const equipped = tryAutoEquip(ghost, newItem);
      if (equipped) {
        pushWorldEvent(`🛡️ <strong style="color:${CLASS_COLORS[ghost.classId]}">${ghost.name}</strong> equipped [${newItem.name}] — an upgrade!`);
        // World First: first item of this type
        if (typeof recordWorldFirst === 'function') {
          recordWorldFirst(`first_item_${newItem.id}`, ghost.name, `${ghost.name} obtained [${newItem.name}] first!`);
        }
      }
      // Check if rare item
      if (newItem.isRare && typeof recordWorldFirst === 'function' && ENEMIES) {
        recordWorldFirst(`first_named_kill_${newItem.id}`, ghost.name, `${ghost.name} slew a rare enemy!`);
      }
    }
  }

  if (ghost.inventory.length > 10 && Math.random() < 0.3) {
    ghostSellItemToMarket(ghost);
  }

  if (Math.random() < 0.10 && _marketListings.length > 0) {
    ghostBuyFromMarket(ghost);
  }

  // Ghost spell purchasing: if in a safe zone (simulating city visit), buy a random
  // affordable spell appropriate for their class/level from GUILD_SPELLS.
  if (typeof SPELL_BOOK_CLASSES !== 'undefined' && SPELL_BOOK_CLASSES.includes(ghost.classId) &&
      typeof GUILD_SPELLS !== 'undefined' && Math.random() < 0.05) {
    if (!ghost.spellBook) ghost.spellBook = [];
    if (!ghost.actionBar) ghost.actionBar = [];
    const available = GUILD_SPELLS.filter(s =>
      s.classId === ghost.classId &&
      s.level <= ghost.level &&
      !ghost.spellBook.includes(s.id) &&
      ghost.gold >= Math.ceil(s.buyPrice / 1000)
    );
    if (available.length > 0) {
      const pick = available[Math.floor(Math.random() * available.length)];
      ghost.gold = Math.max(0, ghost.gold - Math.ceil(pick.buyPrice / 1000));
      ghost.spellBook.push(pick.id);
      // Auto-assign to action bar if space is available (up to 10 slots)
      if (ghost.actionBar.length < 10) {
        ghost.actionBar.push(pick.id);
      }
    }
  }

  // Guild tick
  if (typeof tickGuildProgress === 'function') {
    tickGuildProgress(ghost, killsPerTick, xpPerTick);
  }

  // Tradeskill crafting: ghost attempts a craft once per tick
  if (typeof ghostCraft === 'function' && Math.random() < 0.5) {
    ghostCraft(ghost);
  }

  ghost.lastActive = Date.now();
  return ghost;
}

// ─── Offline Ghost Progression ──────────────────────────────────────────────────

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

// ─── Leaderboard ────────────────────────────────────────────────────────────────

function getLeaderboardData() {
  const entries = _ghosts.map(g => {
    // Find guild for this ghost
    let guildName = null;
    let guildTag  = null;
    if (typeof getGuildForGhost === 'function') {
      const guild = getGuildForGhost(g.id) || getGuildForGhost(g.name);
      if (guild) { guildName = guild.name; guildTag = guild.tag; }
    }
    return {
      id:               g.id,
      name:             g.name,
      classId:          g.classId,
      level:            g.level,
      kills:            g.kills,
      zone:             g.zone,
      party:            g.party || null,
      isPlayer:         false,
      gold:             g.gold || 0,
      totalXP:          g.totalXP || 0,
      guildName,
      guildTag,
      visitedZoneCount: (g.visitedZones || []).length,
      namedKills:       g.namedKills || 0,
      achievements:     0,
    };
  });

  if (typeof GameState !== 'undefined' && GameState.party && GameState.party.length > 0) {
    const leader = GameState.party[0];
    const kills  = Object.values(GameState.killCounts || {}).reduce((s, v) => s + v, 0);
    const totalCopper = ((GameState.gold || 0) * 1000) + ((GameState.silver || 0) * 100) + (GameState.copper || 0);
    let guildName = null;
    let guildTag  = null;
    if (typeof getPlayerGuild === 'function') {
      const guild = getPlayerGuild();
      if (guild) { guildName = guild.name; guildTag = guild.tag; }
    }
    const achievementCount = (typeof getUnlockedCount === 'function') ? getUnlockedCount() : 0;
    entries.push({
      id:               -1,
      name:             leader.name,
      classId:          leader.classId,
      level:            leader.level,
      kills,
      zone:             GameState.zone,
      party:            GameState.party.map(m => ({ name: m.name, classId: m.classId, level: m.level })),
      isPlayer:         true,
      gold:             totalCopper,
      totalXP:          leader.xp || 0,
      guildName,
      guildTag,
      visitedZoneCount: (GameState.visitedZones || []).length,
      namedKills:       GameState.namedKills || 0,
      achievements:     achievementCount,
    });
  }

  entries.sort((a, b) => b.level - a.level || b.kills - a.kills);
  return entries.slice(0, 50);
}

// ─── City Online Count ──────────────────────────────────────────────────────────

function updateCityOnlineCount() {
  const el = document.getElementById('city-online-count');
  if (!el) return;
  el.textContent = `🏙 Qeynos — ${_ghosts.length} players online`;
}

// ─── Initialization ─────────────────────────────────────────────────────────────

function initGhostPlayers() {
  try {
    if (!localStorage.getItem(FIRST_PLAYED_KEY)) {
      localStorage.setItem(FIRST_PLAYED_KEY, String(Date.now()));
    }
  } catch (_) {}

  let ghosts = loadGhosts();
  if (!ghosts || !ghosts.length) {
    ghosts = createGhostPlayers();
  }

  for (const g of ghosts) {
    if (!g.personality) g.personality = PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
    if (!g.inventory)   g.inventory   = [];
    if (!g.equipment)   g.equipment   = {};
    if (!g.spellBook)   g.spellBook   = [];
    if (!g.actionBar)   g.actionBar   = [];
  }

  ghosts = simulateOfflineProgression(ghosts);
  _ghosts = ghosts;
  saveGhosts(ghosts);

  if (_ghostTickInterval) clearInterval(_ghostTickInterval);
  _ghostTickInterval = setInterval(() => {
    for (const ghost of _ghosts) {
      simulateGhostTick(ghost);
    }
    localStorage.setItem(GHOST_TICK_KEY, String(Date.now()));

    const target = getPopulationTarget();
    if (_ghosts.length < target && Math.random() < 0.2) {
      const usedNames = new Set(_ghosts.map(g => g.name));
      const newId = _ghosts.length;
      let newName;
      if (newId < GHOST_NAMES.length) {
        newName = GHOST_NAMES[newId];
      } else {
        newName = generateGhostName(usedNames);
      }
      if (!usedNames.has(newName)) {
        const newGhost = createSingleGhost(newId, newName, true);
        _ghosts.push(newGhost);
      }
    }

    saveGhosts(_ghosts);
    updateCityOnlineCount();
  }, TICK_SECONDS * 1000);

  const zoneId = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
  pickZoneGhosts(zoneId);

  if (_whoInterval) clearInterval(_whoInterval);
  _whoInterval = setInterval(() => {
    const zid = typeof GameState !== 'undefined' ? GameState.zone : 'qeynos_hills';
    pickZoneGhosts(zid);
    renderWhoOnlinePanel();
  }, 60000);

  setInterval(() => {
    renderWhoOnlinePanel();
  }, 15000);

  _setupGhostInspectModal();

  let market = loadMarket();
  if (!market || !market.length) {
    market = generateMarketListings();
  }
  _marketListings = market;

  if (_marketTrickleInterval) clearInterval(_marketTrickleInterval);
  _marketTrickleInterval = setInterval(trickleMarketListing, MARKET_TRICKLE_MS);

  if (_worldFeedInterval) clearInterval(_worldFeedInterval);
  const scheduleWorldEvent = () => {
    const delay = WORLD_EVENT_MIN_MS + Math.random() * WORLD_EVENT_RANGE_MS;
    _worldFeedInterval = setTimeout(() => {
      generateWorldEvent();
      scheduleWorldEvent();
    }, delay);
  };
  scheduleWorldEvent();

  if (_chatInterval) clearTimeout(_chatInterval);
  scheduleChatMessage();

  updateCityOnlineCount();
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
  playerListItemOnMarket,
  CLASS_ICONS,
  CLASS_COLORS,
};
