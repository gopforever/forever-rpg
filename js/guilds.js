// guilds.js — Player Guild System for Forever RPG
// Player-created groups (distinct from class guilds in city.js)
// All data client-side, persisted in localStorage

// ─── Constants ─────────────────────────────────────────────────────────────────────

const PLAYER_GUILDS_SAVE_KEY = 'foreverRPG_playerGuilds';
const PLAYER_GUILDS_VERSION  = 1;

const GUILD_RANKS = ['Recruit', 'Member', 'Officer', 'Leader'];

const SEED_GUILDS = [
  { name: 'Crusaders of Norrath', tag: 'CoN', motd: 'Honor above all.' },
  { name: 'The Dark Covenant',    tag: 'TDC', motd: 'Power through shadow.' },
  { name: 'Arcane Society',       tag: 'AS',  motd: 'Knowledge is power.' },
  { name: 'Ironforge Brotherhood',tag: 'IFB', motd: 'Steel and sweat.' },
  { name: 'Order of the Vale',    tag: 'OtV', motd: 'Nature guides us.' },
];

// ─── Module State ──────────────────────────────────────────────────────────────────

let _playerGuilds = [];
let _ghostGuildMap = {}; // ghostId → guildId

// ─── Load / Save ──────────────────────────────────────────────────────────────────

function loadPlayerGuilds() {
  try {
    const raw = localStorage.getItem(PLAYER_GUILDS_SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.version === PLAYER_GUILDS_VERSION && Array.isArray(data.guilds)) {
      return data.guilds;
    }
    return null;
  } catch (_) {
    return null;
  }
}

function savePlayerGuilds() {
  try {
    localStorage.setItem(PLAYER_GUILDS_SAVE_KEY, JSON.stringify({
      version: PLAYER_GUILDS_VERSION,
      guilds: _playerGuilds,
    }));
  } catch (_) {}
}

// ─── Guild Creation ────────────────────────────────────────────────────────────────

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function createPlayerGuilds() {
  const guilds = [];
  for (const seed of SEED_GUILDS) {
    guilds.push({
      id: slugify(seed.name),
      name: seed.name,
      tag: seed.tag,
      motd: seed.motd,
      founded: Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000),
      members: [],
      kills: 0,
      xp: 0,
      worldFirsts: 0,
      isPlayerGuild: false,
    });
  }
  return guilds;
}

// Populate guilds with ghost members (3–12 per guild)
function populateGuildsWithGhosts(ghosts) {
  if (!ghosts || !ghosts.length) return;

  const available = [...ghosts];
  _ghostGuildMap = {};

  for (const guild of _playerGuilds) {
    const count = 3 + Math.floor(Math.random() * 10); // 3–12
    for (let i = 0; i < count && available.length; i++) {
      const idx = Math.floor(Math.random() * available.length);
      const ghost = available.splice(idx, 1)[0];
      const rank = GUILD_RANKS[Math.floor(Math.random() * (GUILD_RANKS.length - 1))]; // No random Leaders
      guild.members.push({
        name:     ghost.name,
        classId:  ghost.classId,
        level:    ghost.level,
        rank,
        isPlayer: false,
        joinedAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 3600 * 1000),
      });
      _ghostGuildMap[ghost.id] = guild.id;
      // Seed kills/xp from ghost
      guild.kills += ghost.kills || 0;
      guild.xp    += ghost.totalXP || 0;
    }
    // Assign a "Leader" from existing members
    if (guild.members.length) {
      guild.members[0].rank = 'Leader';
    }
  }
}

// ─── Initialization ────────────────────────────────────────────────────────────────

function initGuilds() {
  const saved = loadPlayerGuilds();
  if (saved && saved.length) {
    _playerGuilds = saved;
    // Rebuild ghost→guild map from saved data
    _ghostGuildMap = {};
    for (const guild of _playerGuilds) {
      for (const member of guild.members) {
        if (!member.isPlayer) {
          // Map by name since we don't store ghost ids
          _ghostGuildMap[member.name] = guild.id;
        }
      }
    }
  } else {
    _playerGuilds = createPlayerGuilds();
    // Populate with ghosts from localStorage if available
    try {
      const raw = localStorage.getItem('foreverRPG_ghosts');
      if (raw) {
        const ghosts = JSON.parse(raw);
        if (Array.isArray(ghosts)) populateGuildsWithGhosts(ghosts);
      }
    } catch (_) {}
    savePlayerGuilds();
  }
}

// ─── Lookups ──────────────────────────────────────────────────────────────────────

function getGuildForGhost(ghostIdOrName) {
  const guildId = _ghostGuildMap[ghostIdOrName];
  if (!guildId) return null;
  return _playerGuilds.find(g => g.id === guildId) || null;
}

function getGuildById(guildId) {
  return _playerGuilds.find(g => g.id === guildId) || null;
}

function getGuildLeaderboard() {
  return [..._playerGuilds]
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 10);
}

function getPlayerGuild() {
  if (typeof GameState === 'undefined' || !GameState.guildId) return null;
  return _playerGuilds.find(g => g.id === GameState.guildId) || null;
}

// ─── Join / Leave ──────────────────────────────────────────────────────────────────

function joinGuild(guildId) {
  if (typeof GameState === 'undefined') return false;
  const guild = _playerGuilds.find(g => g.id === guildId);
  if (!guild) return false;

  // Remove from any existing guild first
  leaveGuild();

  const leader = (GameState.party && GameState.party.length) ? GameState.party[0] : null;
  const name   = leader ? leader.name : 'You';
  const cls    = leader ? leader.classId : 'warrior';
  const lvl    = leader ? leader.level : 1;

  guild.members.push({
    name,
    classId:  cls,
    level:    lvl,
    rank:     'Recruit',
    isPlayer: true,
    joinedAt: Date.now(),
  });

  GameState.guildId = guildId;

  if (typeof checkAchievements === 'function') {
    checkAchievements('first_group', {});
  }

  savePlayerGuilds();
  if (typeof saveGame === 'function') saveGame();
  return true;
}

function leaveGuild() {
  if (typeof GameState === 'undefined' || !GameState.guildId) return;
  const guild = _playerGuilds.find(g => g.id === GameState.guildId);
  if (guild) {
    guild.members = guild.members.filter(m => !m.isPlayer);
  }
  GameState.guildId = null;
  savePlayerGuilds();
}

// ─── Ghost Guild Tick ──────────────────────────────────────────────────────────────

function tickGuildProgress(ghost, killsGained, xpGained) {
  const guildId = _ghostGuildMap[ghost.id] || _ghostGuildMap[ghost.name];
  if (!guildId) return;
  const guild = _playerGuilds.find(g => g.id === guildId);
  if (!guild) return;
  guild.kills += killsGained || 0;
  guild.xp    += xpGained    || 0;
  // Update member level in the guild roster
  const member = guild.members.find(m => m.name === ghost.name);
  if (member) member.level = ghost.level;
}

// ─── Module Export ──────────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  initGuilds,
  getGuildForGhost,
  getGuildById,
  getGuildLeaderboard,
  getPlayerGuild,
  joinGuild,
  leaveGuild,
  tickGuildProgress,
  savePlayerGuilds,
};
