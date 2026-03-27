// ============================================================
// FOREVER RPG — Main Game State & Loop
// ============================================================

const GameState = {
  party: [],
  currentEnemy: null,
  selectedEnemyId: null,
  zone: 'qeynos_hills',
  inventory: [],
  bags: [null, null, null, null],
  bagContents: [{}, {}, {}, {}],
  bank: [],
  gold: 0,
  silver: 0,
  copper: 0,
  killCounts: {},
  combatLog: [],
  recentLoot: [],
  combatActive: false,
  inCombat: false,
  inspectedCharIndex: 0,
  settings: {
    autoLoot: true,
    combatSpeed: 2000,
    soundEnabled: false,
  },
  lastSave: Date.now(),
  gameTime: { day: 1, hour: 6 },
};

// ============================================================
// Game Loop Intervals
// ============================================================

let combatInterval = null;
let gameTickInterval = null;
let autoSaveInterval = null;
let clockInterval = null;

function startGameLoops() {
  // Clear any existing intervals
  if (combatInterval) clearInterval(combatInterval);
  if (gameTickInterval) clearInterval(gameTickInterval);
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  if (clockInterval) clearInterval(clockInterval);
  
  // Combat tick every 2000ms (adjustable via settings)
  combatInterval = setInterval(() => {
    if (typeof combatTick === 'function') combatTick();
  }, GameState.settings.combatSpeed);
  
  // Game tick every 100ms (mana regen, UI updates)
  gameTickInterval = setInterval(gameTick, 100);
  
  // Auto-save every 30 seconds
  autoSaveInterval = setInterval(() => {
    if (typeof saveGame === 'function') saveGame();
    updateSaveIndicator();
  }, 30000);
  
  // Game clock: 1 real minute = 1 game hour, update every 60 seconds
  clockInterval = setInterval(() => {
    if (typeof updateGameTime === 'function') updateGameTime();
  }, 60000);
}

// Called every 100ms
function gameTick() {
  // Mana regeneration
  if (GameState.party.length > 0) {
    if (typeof tickManaRegen === 'function') tickManaRegen(GameState.party);
  }
  
  // Update bars periodically (throttled by checking if anything changed)
  // This is done via UI update in combatTick, so we only do light updates here
}

function updateSaveIndicator() {
  const el = document.getElementById('save-indicator');
  if (el) {
    el.textContent = '💾 Saved';
    el.classList.add('saved-flash');
    setTimeout(() => el.classList.remove('saved-flash'), 1000);
  }
}

// ============================================================
// Initialization
// ============================================================

function init() {
  // Check for existing save
  if (typeof hasSave === 'function' && hasSave()) {
    const saveData = loadGame();
    if (saveData) {
      // Check offline progress
      const offline = checkOfflineProgress();
      
      // Apply save
      applyLoadedSave(saveData);
      
      // Show main UI
      initMainUI();
      
      // Apply offline progress and show modal
      if (offline) {
        const levelUps = applyOfflineProgress(offline);
        showOfflineProgressModal(offline);
        if (typeof updatePartyUI === 'function') updatePartyUI();
      }
    } else {
      showCharacterCreation();
    }
  } else {
    showCharacterCreation();
  }
  
  // Wire up all button handlers
  wireUpButtons();
  
  // Start game loops
  startGameLoops();
}

function wireUpButtons() {
  // Begin Adventure button
  const beginBtn = document.getElementById('begin-adventure-btn');
  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      if (typeof handleBeginAdventure === 'function') handleBeginAdventure();
    });
  }
  
  // Save button
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveGame();
      updateSaveIndicator();
    });
  }
  
  // Settings button
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', toggleSettingsPanel);
  }
  
  // Export save button
  const exportBtn = document.getElementById('export-save-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (typeof handleExportSave === 'function') handleExportSave();
    });
  }
  
  // Import save button
  const importBtn = document.getElementById('import-save-btn');
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      if (typeof handleImportSave === 'function') handleImportSave();
    });
  }
  
  // Delete save button
  const deleteBtn = document.getElementById('delete-save-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your save? This cannot be undone!')) {
        deleteSave();
        location.reload();
      }
    });
  }
  
  // Close modals
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  
  // Export copy button
  const exportCopyBtn = document.getElementById('export-copy-btn');
  if (exportCopyBtn) {
    exportCopyBtn.addEventListener('click', () => {
      const ta = document.getElementById('export-textarea');
      if (ta) {
        ta.select();
        document.execCommand('copy');
        exportCopyBtn.textContent = 'Copied!';
        setTimeout(() => { exportCopyBtn.textContent = 'Copy'; }, 2000);
      }
    });
  }
  
  // Import submit button
  const importSubmitBtn = document.getElementById('import-submit-btn');
  if (importSubmitBtn) {
    importSubmitBtn.addEventListener('click', () => {
      const ta = document.getElementById('import-textarea');
      if (ta && ta.value.trim()) {
        try {
          importSave(ta.value.trim());
          location.reload();
        } catch (e) {
          alert('Import failed: ' + e.message);
        }
      }
    });
  }
  
  // Stop Fighting button
  const stopBtn = document.getElementById('stop-combat-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (typeof stopCombat === 'function') stopCombat();
      document.querySelectorAll('.enemy-btn').forEach(b => b.classList.remove('selected'));
      updateStopButtonState();
    });
  }

  // Auto-loot toggle
  const autoLootToggle = document.getElementById('autoloot-toggle');
  if (autoLootToggle) {
    autoLootToggle.checked = GameState.settings.autoLoot;
    autoLootToggle.addEventListener('change', () => {
      GameState.settings.autoLoot = autoLootToggle.checked;
    });
  }
  
  // Combat speed slider
  const speedSlider = document.getElementById('combat-speed-slider');
  if (speedSlider) {
    speedSlider.value = GameState.settings.combatSpeed;
    speedSlider.addEventListener('change', () => {
      GameState.settings.combatSpeed = parseInt(speedSlider.value);
      // Restart combat interval with new speed
      if (combatInterval) clearInterval(combatInterval);
      combatInterval = setInterval(() => {
        if (typeof combatTick === 'function') combatTick();
      }, GameState.settings.combatSpeed);
    });
  }
}

function toggleSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  if (panel) {
    const visible = panel.style.display !== 'none' && panel.style.display !== '';
    panel.style.display = visible ? 'none' : 'block';
  }
}

function updateStopButtonState() {
  const stopBtn = document.getElementById('stop-combat-btn');
  if (!stopBtn) return;
  if (GameState.combatActive || GameState.selectedEnemyId) {
    stopBtn.disabled = false;
    stopBtn.classList.add('combat-active');
  } else {
    stopBtn.disabled = true;
    stopBtn.classList.remove('combat-active');
  }
}

// ============================================================
// DOMContentLoaded — Entry Point
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all scripts are parsed
  setTimeout(init, 50);
});

if (typeof module !== 'undefined') module.exports = { GameState, startGameLoops, init };
