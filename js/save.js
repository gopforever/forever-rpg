const SAVE_KEY = 'foreverRPG_save';
const SAVE_VERSION = 1;

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

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== SAVE_VERSION) return null;
    return data;
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem('foreverRPG_panels');
}

function exportSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  return btoa(raw);
}

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

function applyLoadedSave(data) {
  GameState.party = data.party.map(charData => {
    computeDerivedStats(charData);
    return charData;
  });
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
}

function checkOfflineProgress() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const offlineMs = Date.now() - data.timestamp;
    const offlineMinutes = offlineMs / 60000;
    if (offlineMinutes < 5) return null;

    const offlineHours = Math.min(8, offlineMs / 3600000);

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

function applyOfflineProgress(offlineData) {
  if (!offlineData || !GameState.party.length) return;
  const levelUps = gainXP(GameState.party, offlineData.xpEarned);
  return levelUps;
}

function getPanelPositions() {
  try {
    return JSON.parse(localStorage.getItem('foreverRPG_panels') || '{}');
  } catch (e) {
    return {};
  }
}

function savePanelPosition(panelId, x, y, collapsed) {
  const positions = getPanelPositions();
  positions[panelId] = { x, y, collapsed };
  localStorage.setItem('foreverRPG_panels', JSON.stringify(positions));
}

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

if (typeof module !== 'undefined') module.exports = { saveGame, loadGame, hasSave, deleteSave, exportSave, importSave, applyLoadedSave, checkOfflineProgress, applyOfflineProgress, getPanelPositions, savePanelPosition, hardReset };
