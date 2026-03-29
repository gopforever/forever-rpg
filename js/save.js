/**
 * LocalStorage key for the main game save data.
 * @type {string}
 */
const SAVE_KEY = 'foreverRPG_save';

/**
 * Current save data schema version number.
 * @type {number}
 */
const SAVE_VERSION = 3;

/**
 * Serializes the current GameState to localStorage as a versioned JSON object.
 * @returns {boolean} True if the save succeeded, false on error.
 */
function saveGame() {
  const saveData = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    party: GameState.party,
    inventory: GameState.inventory,
    bags: GameState.bags,
    bagContents: GameState.bagContents,
    bank: GameState.bank,
    gold: GameState.gold,
    silver: GameState.silver,
    copper: GameState.copper,
    killCounts: GameState.killCounts,
    monsterLog: GameState.monsterLog,
    settings: GameState.settings,
    zone: GameState.zone,
    selectedEnemyId: GameState.selectedEnemyId,
    gameTime: GameState.gameTime,
    panelPositions: getPanelPositions(),
    visitedZones: [...(GameState.visitedZones || [])],
    consecutiveWins: GameState.consecutiveWins || 0,
    guildId: GameState.guildId || null,
    totalXPEarned: GameState.totalXPEarned || 0,
    namedKills: GameState.namedKills || 0,
    chatMessagesSeen: GameState.chatMessagesSeen || 0,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    GameState.lastSave = Date.now();
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

/**
 * Deserializes the saved game data from localStorage and returns the parsed object.
 * @returns {object|null} The parsed save data object, or null if no valid save exists.
 */
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data) return null;
    // Accept current version and migrate v1/v2 saves
    if (![1, 2, SAVE_VERSION].includes(data.version)) return null;
    return data;
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

/**
 * Returns true if a valid save entry exists in localStorage.
 * @returns {boolean} True if a save is present, false otherwise.
 */
function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Removes all save-related keys from localStorage.
 * @returns {void}
 */
function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem('foreverRPG_panels');
}

/**
 * Returns a base64-encoded string of the current save data for export.
 * @returns {string|null} Base64-encoded save string, or null if no save exists.
 */
function exportSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  return btoa(raw);
}

/**
 * Decodes a base64-encoded save string and installs it into localStorage.
 * @param {string} encoded - The base64-encoded save string to import.
 * @returns {boolean} True if the import succeeded.
 * @throws {Error} If the encoded data is invalid or cannot be parsed.
 */
function importSave(encoded) {
  try {
    const raw = atob(encoded.trim());
    const data = JSON.parse(raw);
    if (!data || !data.party || !Array.isArray(data.party)) {
      throw new Error('Invalid save data');
    }
    localStorage.setItem(SAVE_KEY, raw);
    return true;
  } catch (e) {
    throw new Error('Import failed: ' + e.message);
  }
}

/**
 * Hydrates the GameState from a loaded save data object, migrating older saves as needed.
 * @param {object} data - The parsed save data object returned by loadGame.
 * @returns {void}
 */
function applyLoadedSave(data) {
  GameState.party = data.party.map(charData => {
    computeDerivedStats(charData);
    // Ensure skills object exists — migrate old saves gracefully
    if (!charData.skills) {
      charData.skills = (typeof initSkills === 'function')
        ? initSkills(charData.classId, charData.level)
        : {};
    }
    // Migrate race field — default to 'human' for older saves
    charData.race = charData.race || 'human';
    if (typeof unlockSkillsForLevel === 'function') unlockSkillsForLevel(charData);
    // Restore ability tracking fields — cast state always resets on load
    charData.abilityCooldowns = charData.abilityCooldowns || {};
    charData.castingAbility = null;
    charData.isCasting = false;
    // Spell book / action bar — initialize for older saves that pre-date this system
    if (!charData.spellBook) charData.spellBook = [];
    if (!charData.actionBar) charData.actionBar = Array(10).fill(null);
    // Tradeskills — initialize for older saves (safe to call multiple times)
    if (typeof initTradeskills === 'function') initTradeskills(charData);
    // Gathering — initialize for older saves (safe to call multiple times)
    if (typeof initGathering === 'function') initGathering(charData);
    return charData;
  });

  // Migrate legacy party-wide learnedSpells into per-character spellBooks
  if (data.learnedSpells && Array.isArray(data.learnedSpells) && data.learnedSpells.length > 0) {
    for (const spellId of data.learnedSpells) {
      const spell = (typeof GUILD_SPELLS !== 'undefined')
        ? GUILD_SPELLS.find(s => s.id === spellId)
        : null;
      if (!spell) continue;
      for (const char of GameState.party) {
        if (char.classId === spell.classId && !char.spellBook.includes(spellId)) {
          char.spellBook.push(spellId);
        }
      }
    }
  }

  GameState.inventory = data.inventory || [];
  if (data.bags !== undefined) GameState.bags = data.bags;
  if (data.bagContents !== undefined) GameState.bagContents = data.bagContents;
  if (data.bank !== undefined) GameState.bank = data.bank;
  GameState.gold = data.gold || 0;
  GameState.silver = data.silver || 0;
  GameState.copper = data.copper || 0;
  GameState.killCounts = data.killCounts || {};
  GameState.monsterLog = data.monsterLog || {};
  GameState.settings = { ...GameState.settings, ...data.settings };
  GameState.zone = data.zone || 'qeynos_hills';
  GameState.selectedEnemyId = data.selectedEnemyId || null;
  GameState.gameTime = data.gameTime || { day: 1, hour: 6 };
  // New fields (v2+)
  GameState.visitedZones = data.visitedZones || [];
  GameState.consecutiveWins = data.consecutiveWins || 0;
  GameState.guildId = data.guildId || null;
  GameState.totalXPEarned = data.totalXPEarned || 0;
  GameState.namedKills = data.namedKills || 0;
  GameState.chatMessagesSeen = data.chatMessagesSeen || 0;
}

/**
 * Calculates XP earned while the game was offline, capped at 8 hours of progress.
 * @returns {object|null} Offline progress summary object, or null if progress is negligible.
 */
function checkOfflineProgress() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const offlineMs = Date.now() - data.timestamp;
    const offlineMinutes = offlineMs / 60000;
    if (offlineMinutes < 5) return null;

    const offlineHours = Math.min(96, offlineMs / 3600000);

    const zone = ZONES[data.zone || 'qeynos_hills'];
    const avgXPPerKill = 30;
    const killsPerHour = 30;
    const xpEarned = Math.floor(avgXPPerKill * killsPerHour * offlineHours);

    return {
      offlineHours: offlineHours.toFixed(1),
      offlineMinutes: Math.floor(offlineMinutes),
      xpEarned,
      timestamp: data.timestamp,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Applies offline-earned XP to all party members and returns any level-up results.
 * @param {object} offlineData - The offline progress object returned by checkOfflineProgress.
 * @returns {Array<object>} Array of level-up result objects.
 */
function applyOfflineProgress(offlineData) {
  if (!offlineData || !GameState.party.length) return;
  const levelUps = gainXP(GameState.party, offlineData.xpEarned);
  return levelUps;
}

/**
 * Returns saved UI panel positions from localStorage as a key-value object.
 * @returns {object} Map of panel IDs to their saved position and state.
 */
function getPanelPositions() {
  try {
    return JSON.parse(localStorage.getItem('foreverRPG_panels') || '{}');
  } catch (e) {
    return {};
  }
}

/**
 * Persists a panel's position and collapsed state to localStorage.
 * @param {string}  panelId   - The unique identifier of the panel.
 * @param {number}  x         - The panel's X position in pixels.
 * @param {number}  y         - The panel's Y position in pixels.
 * @param {boolean} collapsed - Whether the panel is currently collapsed.
 * @returns {void}
 */
function savePanelPosition(panelId, x, y, collapsed) {
  const positions = getPanelPositions();
  positions[panelId] = { x, y, collapsed };
  localStorage.setItem('foreverRPG_panels', JSON.stringify(positions));
}

/**
 * Double-confirms with the user then clears all localStorage data and reloads the page.
 * @returns {void}
 */
function hardReset() {
  const first = confirm(
    '⚠ HARD RESET — This will wipe ALL progress including ghost players and start completely fresh.\n\nThis is a BETA testing tool. Are you sure?'
  );
  if (!first) return;
  const second = confirm('Really reset everything? This cannot be undone.');
  if (!second) return;
  localStorage.clear();
  location.reload();
}

/**
 * Returns a cosmetic summary of how many zone changes ghost players made while
 * the game was offline. This is purely informational and intended for display
 * in the offline progress modal.
 *
 * @returns {{ totalMoves: number, uniqueZones: number, summary: string }|null}
 *   An object with move counts and a human-readable summary, or null if no
 *   ghost data is available.
 */
function checkOfflineZoneActivity() {
  try {
    const raw = localStorage.getItem('foreverRPG_ghosts');
    if (!raw) return null;
    const ghosts = JSON.parse(raw);
    if (!Array.isArray(ghosts) || !ghosts.length) return null;
    const zonesVisited = new Set();
    ghosts.forEach(g => {
      if (g.zone) zonesVisited.add(g.zone);
      if (Array.isArray(g.visitedZones)) g.visitedZones.forEach(z => zonesVisited.add(z));
    });
    const totalMoves = ghosts.reduce((sum, g) => {
      // Estimate zone changes: ghosts that have been around long enough to move
      return sum + (g.lastZoneChange && g.lastZoneChange > 0 ? 1 : 0);
    }, 0);
    const uniqueZones = zonesVisited.size;
    const summary = `While you were away, ghost players visited ${uniqueZones} zone${uniqueZones !== 1 ? 's' : ''} across the world.`;
    return { totalMoves, uniqueZones, summary };
  } catch (e) {
    return null;
  }
}

if (typeof module !== 'undefined') module.exports = { saveGame, loadGame, hasSave, deleteSave, exportSave, importSave, applyLoadedSave, checkOfflineProgress, applyOfflineProgress, checkOfflineZoneActivity, getPanelPositions, savePanelPosition, hardReset };
