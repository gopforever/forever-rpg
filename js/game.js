// ============================================================
// FOREVER RPG — Main Game State & Loop
// ============================================================

/**
 * Global mutable state object for the entire game session.
 * Tracks party, enemies, inventory, zone, combat state, and settings.
 * @type {object}
 */
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
  monsterLog: {},
  combatLog: [],
  recentLoot: [],
  combatActive: false,
  inCombat: false,
  inspectedCharIndex: 0,
  pets: [],
  threatTable: {},
  settings: {
    autoLoot: true,
    combatSpeed: 2000,
    soundEnabled: false,
  },
  lastSave: Date.now(),
  gameTime: { day: 1, hour: 6 },
  _lastHPRegenTick: 0,
  _lastBuffDecayTick: 0,
  isPulling: false,
  camp: null,
  // New fields for achievements/guilds/QoL
  visitedZones: [],
  consecutiveWins: 0,
  guildId: null,
  totalXPEarned: 0,
  namedKills: 0,
  chatMessagesSeen: 0,
};

// ============================================================
// Game Loop Intervals
// ============================================================

/** @type {number|null} Interval handle for the combat tick loop. */
let combatInterval = null;
/** @type {number|null} Interval handle for the game tick (100ms mana regen and buff decay). */
let gameTickInterval = null;
/** @type {number|null} Interval handle for the auto-save tick. */
let autoSaveInterval = null;
/** @type {number|null} Interval handle for the in-game clock. */
let clockInterval = null;

/**
 * Initializes all game timer loops (combat, game tick, auto-save, and clock).
 * @returns {void}
 */
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
/**
 * Called every 100ms to handle mana regeneration and out-of-combat buff decay.
 * @returns {void}
 */
function gameTick() {
  const now = Date.now();

  // Mana regeneration (always — in and out of combat)
  if (GameState.party.length > 0) {
    if (typeof tickManaRegen === 'function') tickManaRegen(GameState.party);
  }

  // Out-of-combat only ticks
  if (!GameState.combatActive && GameState.party.length > 0) {

    // Buff/status decay every 1 second
    if (!GameState._lastBuffDecayTick) GameState._lastBuffDecayTick = now;
    if (now - GameState._lastBuffDecayTick >= 1000) {
      GameState._lastBuffDecayTick = now;
      let decayHappened = false;
      for (const member of GameState.party) {
        if (!member.statusEffects || member.statusEffects.length === 0) continue;
        const before = member.statusEffects.length;
        if (typeof tickStatusEffects === 'function') tickStatusEffects(member);
        if (member.statusEffects.length !== before) decayHappened = true;
      }
      if (decayHappened && typeof updatePartyUI === 'function') updatePartyUI();
    }
  }
}

/**
 * Flashes the save indicator element in the DOM to confirm a successful save.
 * @returns {void}
 */
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

/**
 * Entry point for the game — checks for an existing save, launches the UI, and starts game loops.
 * @returns {void}
 */
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
  
  // Initialize achievement and guild systems
  if (typeof initAchievements === 'function') initAchievements();
  if (typeof initGuilds === 'function') initGuilds();

  // Initialize ghost player simulation
  if (typeof initGhostPlayers === 'function') initGhostPlayers();
  
  // Start game loops
  startGameLoops();
}

/**
 * Attaches all DOM event listeners for buttons and interactive controls.
 * @returns {void}
 */
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

  // Hard reset button (BETA)
  const hardResetBtn = document.getElementById('hard-reset-btn');
  if (hardResetBtn) {
    hardResetBtn.addEventListener('click', () => {
      if (typeof hardReset === 'function') hardReset();
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

  // Pull button
  const pullBtn = document.getElementById('pull-btn');
  if (pullBtn) {
    pullBtn.addEventListener('click', () => {
      if (typeof pullEnemy === 'function') pullEnemy();
    });
  }

  // Set / Break Camp button
  const setCampBtn = document.getElementById('set-camp-btn');
  if (setCampBtn) {
    setCampBtn.addEventListener('click', () => {
      if (GameState.camp) {
        if (typeof breakCamp === 'function') breakCamp();
      } else {
        if (typeof setCamp === 'function') setCamp();
      }
    });
  }

  // Sit / Stand button
  const sitBtn = document.getElementById('sit-btn');
  if (sitBtn) {
    sitBtn.addEventListener('click', () => {
      if (GameState.isSitting) {
        if (typeof standUp === 'function') standUp();
      } else {
        if (typeof sitDown === 'function') sitDown();
      }
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

/**
 * Toggles the visibility of the settings panel.
 * @returns {void}
 */
function toggleSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  if (panel) {
    const visible = panel.style.display !== 'none' && panel.style.display !== '';
    panel.style.display = visible ? 'none' : 'block';
  }
}

/**
 * Updates the enabled/disabled state and labels of combat, pull, camp, and sit buttons.
 * @returns {void}
 */
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

  const sitBtn = document.getElementById('sit-btn');
  if (sitBtn) {
    sitBtn.disabled = !!(GameState.inCombat);
    sitBtn.textContent = GameState.isSitting ? '🧍 Stand' : '🧘 Sit';
  }

  const pullBtn = document.getElementById('pull-btn');
  if (pullBtn) {
    const zone = ZONES && GameState.zone ? ZONES[GameState.zone] : null;
    const canPull = !GameState.combatActive && !GameState.isPulling && !!GameState.selectedEnemyId && zone && !zone.isSafeZone;
    pullBtn.disabled = !canPull;
    pullBtn.textContent = GameState.isPulling ? '🏃 Pulling...' : '🎯 Pull';
  }

  const setCampBtn = document.getElementById('set-camp-btn');
  if (setCampBtn) {
    if (GameState.camp) {
      setCampBtn.textContent = '⛺ Break Camp';
      setCampBtn.title = 'Break your current camp';
      setCampBtn.classList.add('camp-active');
    } else {
      setCampBtn.textContent = '⛺ Set Camp';
      setCampBtn.title = 'Set camp on the selected enemy';
      setCampBtn.classList.remove('camp-active');
    }
  }

  const campIndicator = document.getElementById('camp-indicator');
  if (campIndicator) {
    if (GameState.camp) {
      const campEnemyName = ENEMIES && ENEMIES[GameState.camp.enemyId] ? ENEMIES[GameState.camp.enemyId].name : GameState.camp.enemyId;
      campIndicator.textContent = `⛺ Camp: ${campEnemyName}`;
      campIndicator.style.display = '';
    } else {
      campIndicator.textContent = '';
      campIndicator.style.display = 'none';
    }
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
