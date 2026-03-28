// ui.js — DOM rendering and UI updates for Forever RPG

// ─── Character Creation UI ────────────────────────────────────────────────────

/**
 * Shows the character-creation overlay and wires the Begin Adventure button.
 * @returns {void}
 */
function showCharacterCreation() {
  document.getElementById('creation-overlay').style.display = 'flex';
  renderCreationSlots();

  const beginBtn = document.getElementById('begin-adventure-btn');
  if (beginBtn) {
    beginBtn.onclick = handleBeginAdventure;
  }
}

/**
 * Hides the character-creation overlay.
 * @returns {void}
 */
function hideCharacterCreation() {
  document.getElementById('creation-overlay').style.display = 'none';
}

/**
 * Renders the five character-creation slot cards with name inputs, class
 * selectors, and live class preview sections.
 * @returns {void}
 */
function renderCreationSlots() {
  const container = document.getElementById('creation-slots');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const slot = document.createElement('div');
    slot.className = 'creation-slot';
    slot.id = `creation-slot-${i}`;
    slot.innerHTML = `
      <div class="slot-header">Slot ${i + 1}</div>
      <input type="text" class="char-name-input" id="char-name-${i}" placeholder="Character Name" maxlength="20">
      <select class="char-class-select" id="char-class-${i}">
        <option value="">-- Select Class --</option>
        <optgroup label="⚔ Melee">
          <option value="berserker">Berserker</option>
          <option value="monk">Monk</option>
          <option value="rogue">Rogue</option>
          <option value="warrior">Warrior</option>
        </optgroup>
        <optgroup label="🛡 Hybrid">
          <option value="bard">Bard</option>
          <option value="beastlord">Beastlord</option>
          <option value="paladin">Paladin</option>
          <option value="ranger">Ranger</option>
          <option value="shadowknight">Shadow Knight</option>
        </optgroup>
        <optgroup label="🔮 Caster">
          <option value="enchanter">Enchanter</option>
          <option value="magician">Magician</option>
          <option value="necromancer">Necromancer</option>
          <option value="wizard">Wizard</option>
        </optgroup>
        <optgroup label="✨ Priest">
          <option value="cleric">Cleric</option>
          <option value="druid">Druid</option>
          <option value="shaman">Shaman</option>
        </optgroup>
      </select>
      <div class="class-preview" id="class-preview-${i}"></div>
    `;
    container.appendChild(slot);

    const select = slot.querySelector('.char-class-select');
    const preview = slot.querySelector('.class-preview');
    select.addEventListener('change', () => {
      updateClassPreview(select.value, preview);
    });

    attachTooltip(select, () => select.value ? getClassTooltipHTML(select.value) : '');
  }
}

/**
 * Updates a class-preview element with the icon, name, role, description
 * snippet, and base stats for the selected class.
 * @param {string}      classId   - The class identifier key (e.g. `"warrior"`).
 * @param {HTMLElement} previewEl - The DOM element to write the preview into.
 * @returns {void}
 */
function updateClassPreview(classId, previewEl) {
  if (!classId || !CLASSES[classId]) {
    previewEl.innerHTML = '';
    return;
  }
  const cls = CLASSES[classId];
  const desc = cls.description || '';
  const shortDesc = desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
  previewEl.innerHTML = `
    <div class="preview-icon">${cls.icon || ''}</div>
    <div class="preview-name">${cls.name}</div>
    <div class="preview-role">${cls.role || ''}</div>
    <div class="preview-desc">${shortDesc}</div>
    <div class="preview-stats">
      <span>STR ${cls.baseStats.STR}</span>
      <span>DEX ${cls.baseStats.DEX}</span>
      <span>AGI ${cls.baseStats.AGI}</span>
      <span>STA ${cls.baseStats.STA}</span>
      <span>WIS ${cls.baseStats.WIS}</span>
      <span>INT ${cls.baseStats.INT}</span>
    </div>
    <div class="preview-mana">Mana: ${cls.manaStat || 'None'}</div>
  `;
}

/**
 * Reads the character-creation form, validates at least one character was
 * configured, initialises GameState, then hides the creation overlay and
 * launches the main game UI.
 * @returns {void}
 */
function handleBeginAdventure() {
  const chars = [];
  for (let i = 0; i < 5; i++) {
    const nameInput = document.getElementById(`char-name-${i}`);
    const classSelect = document.getElementById(`char-class-${i}`);
    if (nameInput && classSelect && nameInput.value.trim() && classSelect.value) {
      chars.push({ name: nameInput.value.trim(), classId: classSelect.value });
    }
  }

  if (chars.length === 0) {
    alert('You must create at least one character!');
    return;
  }

  GameState.party = createParty(chars);
  GameState.copper = 10;
  GameState.bags = ['small_pouch', null, null, null];
  GameState.bagContents = [{}, {}, {}, {}];
  GameState.bank = [];

  hideCharacterCreation();
  initMainUI();
  saveGame();
}

// ─── Main UI ──────────────────────────────────────────────────────────────────

/**
 * Initialises the main game UI after loading or creating a save — makes the
 * game container visible and renders all panels, tooltips, and draggable
 * panel positions.
 * @returns {void}
 */
function initMainUI() {
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) gameContainer.style.display = 'grid';

  renderTopBar();
  renderZonePanel();
  renderPartyPanel();
  renderKillCountPanel();
  renderCombatPanel();
  renderEnemySelector();
  renderCharacterInspectPanel();
  renderStatsPanel();
  renderEquipmentPanel();
  renderSpellsPanel();
  renderInventoryPanel();
  renderHotbar();

  initTooltips();
  restorePanelPositions();
  initDraggablePanels();
  updateGameClock();

  if (typeof renderWhoOnlinePanel === 'function') renderWhoOnlinePanel();
  renderMonsterLogPanel();

  if (GameState.selectedEnemyId) {
    selectEnemy(GameState.selectedEnemyId);
    updateEnemyDisplay();
  }

  // Keyboard hotbar: number keys 1–8 trigger ability slots
  document.addEventListener('keydown', (e) => {
    const num = parseInt(e.key);
    if (num >= 1 && num <= 8 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
      const idx = GameState.inspectedCharIndex !== undefined ? GameState.inspectedCharIndex : 0;
      const member = GameState.party && GameState.party[idx];
      const cls = member && CLASSES[member.classId];
      const abilities = (cls && cls.abilities) ? cls.abilities.slice(0, 8) : [];
      const ability = abilities[num - 1];
      if (ability) triggerHotbarAbility(idx, ability);
    }
  });

  // Poll every 100ms to flash enemy cards when an attack is imminent, and to
  // clear the indicator once the window has passed
  let _prevAnyIncoming = false;
  setInterval(() => {
    if (GameState.combatActive && GameState.enemies && GameState.enemies.length > 0) {
      const now = Date.now();
      const anyIncoming = GameState.enemies.some(e => e && e._nextAttackAt && e._nextAttackAt - now < 600 && e._nextAttackAt - now > 0);
      if (anyIncoming || _prevAnyIncoming) updateEnemyDisplay();
      _prevAnyIncoming = anyIncoming;
    } else {
      _prevAnyIncoming = false;
    }
  }, 100);
}

// ─── Panel Rendering ──────────────────────────────────────────────────────────

/**
 * Renders the top bar with the current wallet (gold/silver/copper) and the
 * active zone name.
 * @returns {void}
 */
function renderTopBar() {
  const walletEl = document.getElementById('wallet');
  if (walletEl) {
    walletEl.innerHTML = `
      <span class="gold-amount">${GameState.gold || 0}g</span>
      <span class="silver-amount">${GameState.silver || 0}s</span>
      <span class="copper-amount">${GameState.copper || 0}c</span>
    `;
  }

  const zoneEl = document.getElementById('current-zone-name');
  if (zoneEl) {
    const zone = ZONES[GameState.zone];
    if (zone) zoneEl.textContent = zone.name;
  }
}

/**
 * Renders the zone panel, including the minimap SVG, zone info, travel buttons,
 * and toggles visibility of city vs. combat panels based on whether the current
 * zone is a safe zone.
 * @returns {void}
 */
function renderZonePanel() {
  const minimapEl = document.getElementById('zone-minimap');
  if (minimapEl) {
    const zone = ZONES[GameState.zone];
    if (zone && zone.minimapSVG) {
      minimapEl.innerHTML = zone.minimapSVG;
    } else {
      minimapEl.innerHTML = '<div style="color:var(--text-dim);font-size:10px;padding:8px">No map data</div>';
    }
  }

  const zoneInfoEl = document.getElementById('zone-info');
  if (zoneInfoEl) {
    const zone = ZONES[GameState.zone];
    if (zone) {
      const isSafe = zone.isSafeZone ? '<div class="zone-safe-badge">🕊 Safe Zone</div>' : '';
      const levelDisplay = zone.isSafeZone ? 'City' : `Levels ${zone.levelRange[0]}-${zone.levelRange[1]}`;
      const connections = (zone.connections || []).map(connId => {
        const conn = ZONES[connId];
        if (!conn) return '';
        return `<button class="zone-travel-btn" data-zone="${connId}">➤ ${conn.name}</button>`;
      }).join('');
      zoneInfoEl.innerHTML = `
        <div class="zone-name">${zone.name}</div>
        <div class="zone-levels">${levelDisplay}</div>
        ${isSafe}
        <div class="zone-desc">${zone.description}</div>
        ${connections ? `<div class="zone-connections">${connections}</div>` : ''}
      `;
      zoneInfoEl.querySelectorAll('.zone-travel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (typeof travelToZone === 'function') travelToZone(btn.dataset.zone);
        });
      });
    }
  }

  // Show/hide city panel vs combat panels based on zone type
  const zone = ZONES[GameState.zone];
  const isSafe = zone && zone.isSafeZone;
  const cityPanel = document.getElementById('city-panel');
  const combatArea = document.getElementById('combat-area');
  const enemyGridContainer = document.getElementById('enemy-grid-container');
  const lootDisplay = document.getElementById('loot-display');

  if (cityPanel) cityPanel.style.display = isSafe ? 'block' : 'none';
  if (combatArea) combatArea.style.display = isSafe ? 'none' : '';
  if (enemyGridContainer) enemyGridContainer.style.display = isSafe ? 'none' : '';
  if (lootDisplay) lootDisplay.style.display = isSafe ? 'none' : '';

  if (isSafe) {
    GameState.combatActive = false;
    GameState.currentEnemy = null;
    renderCityPanel();
  }
}

/**
 * Moves the party to a new zone, stopping active combat, logging a flavor
 * message, and refreshing all relevant panels.
 * @param {string} zoneId - The zone identifier to travel to.
 * @returns {void}
 */
function changeZone(zoneId) {
  const zone = ZONES[zoneId];
  if (!zone) {
    addCombatLog(`That region is not yet accessible.`, 'system');
    return;
  }

  stopCombat();
  GameState.zone = zoneId;
  GameState.selectedEnemyId = null;

  if (zone.flavorLines && zone.flavorLines.length > 0) {
    const line = zone.flavorLines[Math.floor(Math.random() * zone.flavorLines.length)];
    addCombatLog(line, 'system');
  }

  addCombatLog(`You have entered ${zone.name}.`, 'system');

  renderTopBar();
  renderZonePanel();
  renderEnemySelector();
  renderMonsterLogPanel();
  if (typeof updateCombatUI === 'function') updateCombatUI();
  if (typeof refreshZonePlayers === 'function') refreshZonePlayers();
}

/**
 * Returns an HTML string describing the current action of a party member
 * (dead, meditating, idle, casting, waiting to swing, or attacking).
 * @param {object} member - The party member object from GameState.
 * @returns {string} HTML markup for the member's current action label.
 */
function getMemberActionText(member) {
  if (!member.isAlive) return '<span class="action-dead">💀 Dead</span>';
  if (!GameState.combatActive && GameState.isSitting) return '<span class="action-sit">🧘 Medding</span>';
  if (!GameState.combatActive) return '<span class="action-idle">— Idle</span>';
  if (member.isCasting && member.castingAbility) {
    const ability = member.castingAbility.ability;
    const remaining = Math.max(0, Math.ceil((member.castingAbility.castEndTime - Date.now()) / 1000));
    return `<span class="action-casting">🔮 ${ability.name} (${remaining}s)</span>`;
  }
  const now = Date.now();
  if (member.nextSwingAt && now < member.nextSwingAt) {
    const wait = Math.max(0, (member.nextSwingAt - now) / 1000).toFixed(1);
    return `<span class="action-swing">⚔ Swing (${wait}s)</span>`;
  }
  return `<span class="action-attacking">⚔ Attacking</span>`;
}

/**
 * Renders the full party roster panel, populating each slot with portrait,
 * HP/mana bars, status icons, threat indicator, pet row, and click listeners
 * for character inspection.
 * @returns {void}
 */
function renderPartyPanel() {
  const rosterEl = document.getElementById('party-roster');
  if (!rosterEl) return;
  rosterEl.innerHTML = '';

  const now = Date.now();

  for (let i = 0; i < 5; i++) {
    const member = GameState.party[i];
    const slot = document.createElement('div');
    slot.className = 'party-slot' + (member ? ' has-member' : ' empty');

    if (member) {
      const cls = CLASSES[member.classId];
      const hpPct = Math.max(0, Math.min(100, (member.hp / member.maxHP) * 100));
      const manaPct = member.maxMana > 0
        ? Math.max(0, Math.min(100, (member.mana / member.maxMana) * 100))
        : 0;
      const portrait = PORTRAITS ? (PORTRAITS[member.classId] || '') : '';

      const myThreat = (GameState.threatTable || {})[member.id] || 0;
      const maxThreat = Math.max(...Object.values(GameState.threatTable || {}).concat([0]));
      const isTarget = myThreat > 0 && myThreat >= maxThreat;

      const statusIconMap = { poison: '☠', disease: '🤢', cold: '🧊', stun: '⭐', mez: '💤', slow: '🐢', buff_damage: '⚔', buff_ac: '🛡', buff_attack: '🎵' };
      const statusIcons = (member.statusEffects || [])
        .filter(e => now < e.endTime)
        .map(e => `<span class="status-icon" title="${e.type}">${statusIconMap[e.type] || '✦'}</span>`)
        .join('');

      // HP bar colour tier
      const hpBarClass = hpPct <= 25 ? 'hp-bar low' : hpPct <= 50 ? 'hp-bar mid' : 'hp-bar';

      // Cast bar
      let castBarHTML = '';
      if (member.isCasting && member.castingAbility) {
        const ca = member.castingAbility;
        let castPct = 0;
        if (ca.castStartTime && ca.castEndTime > ca.castStartTime) {
          const castDuration = ca.castEndTime - ca.castStartTime;
          const elapsed = now - ca.castStartTime;
          castPct = Math.max(0, Math.min(100, (elapsed / castDuration) * 100));
        }
        castBarHTML = `
          <div class="cast-bar-track">
            <div class="cast-bar-fill" style="width:${castPct}%"></div>
            <span class="cast-bar-label">${ca.ability.name}</span>
          </div>`;
      }

      // Pet row
      let petRowHTML = '';
      if (typeof getPetForOwner === 'function') {
        const pet = getPetForOwner(member.id);
        if (pet) {
          const petHpPct = Math.max(0, Math.min(100, (pet.hp / pet.maxHP) * 100));
          petRowHTML = `<div class="pet-row">
            <span class="pet-name">${pet.name}</span>
            <div class="bar-container">
              <div class="bar pet-hp-bar" style="width:${petHpPct}%"></div>
              <span class="bar-text">${pet.hp}/${pet.maxHP}</span>
            </div>
            <button class="btn-dismiss-pet" onclick="dismissPet('${member.id}')">Dismiss</button>
          </div>`;
        }
      }

      slot.innerHTML = `
        <div class="member-frame${member.isAlive ? '' : ' dead'}" data-char-id="${member.id}" data-index="${i}">
          ${!member.isAlive ? '<div class="dead-overlay">DEAD</div>' : ''}
          ${isTarget ? '<div class="target-indicator">🎯</div>' : ''}
          <div class="member-frame-top">
            <div class="member-portrait">${portrait}</div>
            <div class="member-info">
              <div class="member-name ${member.isAlive ? '' : 'dead'}">${member.name}</div>
              <div class="member-class">${cls ? cls.icon + ' ' + cls.name : ''} Lv.${member.level}</div>
            </div>
          </div>
          <div class="member-bars">
            <div class="bar-container">
              <div class="bar ${hpBarClass}" style="width:${hpPct}%"></div>
              <span class="bar-text">${member.hp}/${member.maxHP}</span>
            </div>
            ${member.maxMana > 0 ? `
            <div class="bar-container">
              <div class="bar mana-bar" style="width:${manaPct}%"></div>
              <span class="bar-text">${member.mana}/${member.maxMana}</span>
            </div>` : ''}
          </div>
          ${castBarHTML}
          <div class="member-frame-footer">
            <div class="status-icons">${statusIcons}</div>
            <div class="member-action">${getMemberActionText(member)}</div>
          </div>
          ${petRowHTML}
        </div>
      `;

      slot.querySelector('.member-frame').addEventListener('click', () => {
        GameState.inspectedCharIndex = i;
        renderCharacterInspectPanel();
        renderStatsPanel();
        renderEquipmentPanel();
        renderSpellsPanel();
        renderHotbar();
      });

      attachTooltip(slot, () => getMemberTooltipHTML(member));
    } else {
      slot.innerHTML = `<div class="empty-slot">[ Empty Slot ]</div>`;
    }

    rosterEl.appendChild(slot);
  }
}

/**
 * Builds the HTML tooltip content for a party member showing their key stats.
 * @param {object} member - The party member object to build the tooltip for.
 * @returns {string} HTML markup for the member tooltip.
 */
function getMemberTooltipHTML(member) {
  const cls = CLASSES[member.classId];
  return `<div class="tt-member">
    <div class="tt-name" style="color:#c8a84b">${member.name}</div>
    <div class="tt-row"><span class="tt-label">Class:</span> ${cls ? cls.name : 'Unknown'}</div>
    <div class="tt-row"><span class="tt-label">Level:</span> ${member.level}</div>
    <div class="tt-row"><span class="tt-label">HP:</span> ${member.hp}/${member.maxHP}</div>
    <div class="tt-row"><span class="tt-label">Mana:</span> ${member.mana}/${member.maxMana}</div>
    <div class="tt-row"><span class="tt-label">AC:</span> ${member.currentAC || 0}</div>
    <div class="tt-row"><span class="tt-label">STR:</span> ${member.STR} <span class="tt-label">DEX:</span> ${member.DEX} <span class="tt-label">AGI:</span> ${member.AGI}</div>
    <div class="tt-row"><span class="tt-label">STA:</span> ${member.STA} <span class="tt-label">WIS:</span> ${member.WIS} <span class="tt-label">INT:</span> ${member.INT}</div>
  </div>`;
}

/**
 * Renders the kill-count panel as a sorted table listing the top 15 enemies
 * by kill count from GameState.
 * @returns {void}
 */
function renderKillCountPanel() {
  const killsEl = document.getElementById('kill-counts');
  if (!killsEl) return;

  const kills = GameState.killCounts || {};
  const entries = Object.entries(kills).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    killsEl.innerHTML = '<div class="no-kills">No kills yet.</div>';
    return;
  }

  killsEl.innerHTML = `<table class="kills-table">
    <thead><tr><th>Enemy</th><th>Kills</th></tr></thead>
    <tbody>
      ${entries.slice(0, 15).map(([id, count]) => {
        const enemy = ENEMIES[id];
        return `<tr>
          <td>${enemy ? enemy.name : id}</td>
          <td>${count}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

/**
 * Renders the monster-log panel for the current zone, showing each enemy's
 * kill/death counts, completion bar, and ??? placeholder for undiscovered foes.
 * @returns {void}
 */
function renderMonsterLogPanel() {
  const bodyEl = document.getElementById('monster-log-body');
  if (!bodyEl) return;

  const zone = ZONES[GameState.zone];
  if (!zone || zone.isSafeZone) {
    bodyEl.innerHTML = '<div class="no-kills">No enemies in this zone.</div>';
    return;
  }

  const commonEnemies = zone.commonEnemies || [];
  const rareEnemies = [...new Set(zone.rareEnemies || [])];
  const allZoneEnemyIds = [...new Set([...commonEnemies, ...rareEnemies])];

  if (allZoneEnemyIds.length === 0) {
    bodyEl.innerHTML = '<div class="no-kills">No enemies tracked for this zone.</div>';
    return;
  }

  const monsterLog = GameState.monsterLog || {};
  const killCounts = GameState.killCounts || {};

  const entries = allZoneEnemyIds.map(id => {
    const enemy = ENEMIES[id];
    const log = monsterLog[id] || null;
    const kills = killCounts[id] || 0;
    const deaths = log ? log.deaths : 0;
    const firstSeen = log ? log.firstSeen : null;
    const isRare = rareEnemies.includes(id);
    return { id, enemy, kills, deaths, firstSeen, isRare };
  });

  // Sort: discovered (kills>0) by kill count desc, then undiscovered
  entries.sort((a, b) => {
    if (a.kills > 0 && b.kills === 0) return -1;
    if (a.kills === 0 && b.kills > 0) return 1;
    return b.kills - a.kills;
  });

  bodyEl.innerHTML = entries.map(({ id, enemy, kills, deaths, firstSeen, isRare }) => {
    const name = enemy ? enemy.name : id;
    const level = enemy ? enemy.level : '?';
    const completion = Math.min(100, Math.floor(kills / 10) * 10);
    const barFill = Math.min(100, completion);
    const discovered = kills > 0;
    const rareIcon = isRare ? ' ⭐' : '';

    if (!discovered) {
      return `
        <div class="monster-log-entry monster-log-undiscovered">
          <div class="monster-log-row">
            <span class="monster-log-name">??? (Undiscovered)${rareIcon}</span>
            <span class="monster-log-level">Lv.${level}</span>
          </div>
          <div class="monster-log-stats">
            <span>0 kills</span>
          </div>
        </div>`;
    }

    return `
      <div class="monster-log-entry">
        <div class="monster-log-row">
          <span class="monster-log-name">${name}${rareIcon}</span>
          <span class="monster-log-level">Lv.${level}</span>
        </div>
        <div class="monster-log-stats">
          Kills: <strong>${kills}</strong> &nbsp; Deaths: <strong>${deaths}</strong>
        </div>
        <div class="monster-completion-bar-wrap">
          <div class="monster-completion-bar" style="width:${barFill}%"></div>
        </div>
        <div class="monster-log-pct">${completion}% complete</div>
      </div>`;
  }).join('');
}

/**
 * Renders the combat panel by refreshing the combat log and the enemy
 * display.
 * @returns {void}
 */
function renderCombatPanel() {
  renderCombatFilterTabs();
  renderCombatLog();
  updateEnemyDisplay();
}

function renderCombatFilterTabs() {
  const area = document.getElementById('combat-log-tabs');
  if (!area) return;
  const filters = ['all', 'damage', 'spells', 'loot', 'system'];
  const current = (GameState.settings && GameState.settings.logFilter) || 'all';
  area.innerHTML = filters.map(f =>
    `<button class="log-filter-tab${f === current ? ' active' : ''}" data-filter="${f}">${f.charAt(0).toUpperCase() + f.slice(1)}</button>`
  ).join('');
  area.querySelectorAll('.log-filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!GameState.settings) GameState.settings = {};
      GameState.settings.logFilter = btn.dataset.filter;
      renderCombatFilterTabs();
      renderCombatLog();
    });
  });
}

const _LOG_TYPE_MAP = {
  damage: ['damage', 'miss', 'crit', 'hit', 'enemy'],
  spells: ['spell', 'heal', 'cast', 'buff', 'debuff'],
  loot:   ['loot', 'xp', 'levelup'],
  system: ['system', 'zone', 'info', 'travel', 'death', 'poison', 'cold', 'disease'],
};

/**
 * Renders combat-log entries filtered by the active log filter tab,
 * keeping up to 200 entries and auto-scrolling to the bottom.
 * @returns {void}
 */
function renderCombatLog() {
  const logEl = document.getElementById('combat-log');
  if (!logEl) return;
  const filter = (GameState.settings && GameState.settings.logFilter) || 'all';
  const log = GameState.combatLog || [];
  const filtered = filter === 'all' ? log : log.filter(e => (_LOG_TYPE_MAP[filter] || []).includes(e.type));
  logEl.innerHTML = filtered.map(entry =>
    `<div class="log-entry log-${entry.type || 'info'}">${entry.text}</div>`
  ).join('');
  logEl.scrollTop = logEl.scrollHeight;
}

/**
 * Renders the active enemy list with HP bars, con-colour dots, CC tags, and
 * status/DoT effect labels; clicking a card sets it as the focused enemy.
 * @returns {void}
 */
function updateEnemyDisplay() {
  const listEl = document.getElementById('enemy-list');
  if (!listEl) return;

  const enemies = GameState.enemies && GameState.enemies.length > 0
    ? GameState.enemies.filter(e => e && e.hp > 0)
    : [];

  if (enemies.length === 0) {
    listEl.innerHTML = '<div class="no-enemy">Select an enemy to fight</div>';
    return;
  }

  const highestLevel = GameState.party
    ? Math.max(...GameState.party.filter(m => m && m.isAlive).map(m => m.level), 1)
    : 1;

  const now = Date.now();
  listEl.innerHTML = enemies.map((enemy, idx) => {
    const con = getConColor(highestLevel, enemy.level);
    const hpPct = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHP) * 100));
    const isPrimary = idx === 0;
    const isFocused = enemy === GameState.currentEnemy;

    const statusTags = [];
    if (enemy.statusEffects && enemy.statusEffects.length > 0) {
      enemy.statusEffects.forEach(e => {
        if (e.type === 'slow') statusTags.push('<span class="effect-tag effect-slow">slow</span>');
        else if (e.type === 'debuff_atk') statusTags.push('<span class="effect-tag effect-slow">🎵 screech</span>');
        else statusTags.push(`<span class="effect-tag">${e.type}</span>`);
      });
    }
    if (enemy.dots && enemy.dots.length > 0) {
      statusTags.push(`<span class="effect-tag effect-poison">${enemy.dots.length} DoT</span>`);
    }
    const statusHtml = statusTags.join('');

    const mezzed = enemy.mezzedUntil && now < enemy.mezzedUntil;
    const stunned = enemy.stunUntil && now < enemy.stunUntil;
    const feared = enemy.fearedUntil && now < enemy.fearedUntil;
    const ccLabel = mezzed ? ' <span class="enemy-cc-tag">MEZ</span>'
                  : stunned ? ' <span class="enemy-cc-tag">STUN</span>'
                  : feared  ? ' <span class="enemy-cc-tag cc-fear">FEAR</span>'
                  : '';

    const msToAttack = enemy._nextAttackAt ? enemy._nextAttackAt - now : Infinity;
    const isIncoming = msToAttack > 0 && msToAttack < 600;

    return `
      <div class="enemy-card${isPrimary ? ' enemy-card-primary' : ''}${isFocused ? ' focused' : ''}${isIncoming ? ' incoming-attack' : ''}" data-enemy-index="${idx}">
        <div class="enemy-card-header">
          <span class="con-dot con-${con.color}" title="${con.label}">●</span>
          <span class="enemy-card-name">${enemy.name}${ccLabel}</span>
          <span class="enemy-card-level">[Lv.${enemy.level}]</span>
          <span class="enemy-card-hp-text">${Math.max(0, enemy.hp)}/${enemy.maxHP}</span>
        </div>
        <div class="enemy-card-hp-track">
          <div class="enemy-card-hp-bar" style="width:${hpPct}%"></div>
        </div>
        ${statusHtml ? `<div class="enemy-card-status">${statusHtml}</div>` : ''}
      </div>
    `;
  }).join('');

  // Single delegated listener on the container — replaced each render so no accumulation
  listEl.onclick = (e) => {
    const card = e.target.closest('.enemy-card');
    if (!card) return;
    const idx = parseInt(card.dataset.enemyIndex, 10);
    if (!isNaN(idx) && enemies[idx]) {
      GameState.currentEnemy = enemies[idx];
      updateEnemyDisplay();
    }
  };
}

/**
 * Renders the clickable enemy-grid for the current zone, showing each enemy's
 * sprite, name, and con-colour level badge.
 * @returns {void}
 */
function renderEnemySelector() {
  const gridEl = document.getElementById('enemy-grid');
  if (!gridEl) return;

  const zone = ZONES[GameState.zone];
  if (!zone) return;

  gridEl.innerHTML = '';

  const allEnemyIds = [...new Set([
    ...(zone.commonEnemies || []),
    ...(zone.rareEnemies || [])
  ])];

  for (const enemyId of allEnemyIds) {
    const enemy = ENEMIES[enemyId];
    if (!enemy) continue;

    const btn = document.createElement('button');
    btn.className = 'enemy-btn' +
      (enemy.isRare ? ' rare-enemy' : '') +
      (GameState.selectedEnemyId === enemyId ? ' selected' : '');
    btn.title = enemy.name;
    const highestLevel = GameState.party
      ? Math.max(...GameState.party.filter(m => m && m.isAlive).map(m => m.level), 1)
      : 1;
    const con = getConColor(highestLevel, enemy.level);

    btn.innerHTML = `
      <div class="enemy-btn-sprite">${getSprite(enemyId)}</div>
      <div class="enemy-btn-name">${enemy.name}</div>
      <div class="enemy-btn-level"><span class="con-dot con-${con.color}">●</span> Lv.${enemy.level}</div>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.enemy-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectEnemy(enemyId);
      updateEnemyDisplay();
    });

    attachTooltip(btn, () => getEnemyTooltipHTML(enemyId));

    gridEl.appendChild(btn);
  }
}

/**
 * Renders the character-inspect panel for the currently inspected party
 * member, displaying portrait, HP/mana/XP bars, role, AC, and status effects.
 * @returns {void}
 */
function renderCharacterInspectPanel() {
  const idx = GameState.inspectedCharIndex !== undefined ? GameState.inspectedCharIndex : 0;
  const member = GameState.party[idx];
  const el = document.getElementById('char-inspect');
  if (!el || !member) return;

  const cls = CLASSES[member.classId];
  const hpPct = Math.max(0, Math.min(100, (member.hp / member.maxHP) * 100));
  const manaPct = member.maxMana > 0
    ? Math.max(0, Math.min(100, (member.mana / member.maxMana) * 100))
    : 0;

  const levelXpBase = xpForLevel(member.level);
  const levelXpNeeded = xpToNextLevel(member.level);
  const xpPct = levelXpNeeded > 0
    ? Math.max(0, Math.min(100, ((member.xp - levelXpBase) / levelXpNeeded) * 100))
    : 0;

  const portrait = PORTRAITS ? (PORTRAITS[member.classId] || '') : '';

  el.innerHTML = `
    <div class="inspect-header">
      <div class="inspect-portrait">${portrait}</div>
      <div class="inspect-info">
        <div class="inspect-name">${member.name}</div>
        <div class="inspect-class">${cls ? cls.icon + ' ' + cls.name : ''}</div>
        <div class="inspect-level">Level ${member.level}</div>
      </div>
    </div>
    <div class="bar-group">
      <div class="bar-label">HP ${member.hp}/${member.maxHP}</div>
      <div class="bar-track hp-track">
        <div class="bar hp-bar" style="width:${hpPct}%"></div>
      </div>
    </div>
    ${member.maxMana > 0 ? `
    <div class="bar-group">
      <div class="bar-label">MP ${member.mana}/${member.maxMana}</div>
      <div class="bar-track mana-track">
        <div class="bar mana-bar" style="width:${manaPct}%"></div>
      </div>
    </div>` : ''}
    <div class="bar-group">
      <div class="bar-label">XP ${member.xp - levelXpBase} / ${levelXpNeeded}${member.level >= MAX_LEVEL ? ' (MAX)' : ''}</div>
      <div class="bar-track xp-track">
        <div class="bar xp-bar" style="width:${xpPct}%"></div>
      </div>
    </div>
    <div class="inspect-role">Role: ${cls ? cls.role : ''}</div>
    <div class="inspect-ac">AC: ${member.currentAC || 0}</div>
    ${member.statusEffects && member.statusEffects.length > 0 ? `
    <div class="inspect-effects">
      ${member.statusEffects.map(e =>
        `<span class="effect-tag effect-${e.type}">${e.type}</span>`
      ).join('')}
    </div>` : ''}
  `;

  const xpBarEl = el.querySelector('.xp-track');
  if (xpBarEl) {
    const isHellLevel = HELL_LEVELS.includes(member.level);
    attachTooltip(xpBarEl, () => `
      <div class="tt-member">
        <div class="tt-name" style="color:#c8a84b">Experience</div>
        <div class="tt-row"><span class="tt-label">Level:</span> ${member.level}${isHellLevel ? ' <span style="color:#ff8844">⚠ Hell Level</span>' : ''}</div>
        <div class="tt-row"><span class="tt-label">Progress:</span> ${(member.xp - levelXpBase).toLocaleString()} / ${levelXpNeeded.toLocaleString()} XP</div>
        <div class="tt-row"><span class="tt-label">Total XP:</span> ${member.xp.toLocaleString()}</div>
        <div class="tt-row"><span class="tt-label">To Next:</span> ${(levelXpNeeded - (member.xp - levelXpBase)).toLocaleString()} XP remaining</div>
        ${member.level >= MAX_LEVEL ? '<div class="tt-row" style="color:#c8a84b">Maximum level reached!</div>' : ''}
      </div>
    `);
  }
}

/**
 * Renders the stats panel for the currently inspected party member, showing
 * base and bonus values for all primary stats and grouped skill progress bars.
 * @returns {void}
 */
function renderStatsPanel() {
  const idx = GameState.inspectedCharIndex !== undefined ? GameState.inspectedCharIndex : 0;
  const member = GameState.party[idx];
  const el = document.getElementById('stats-panel');
  if (!el || !member) return;

  const stats = ['STR', 'DEX', 'AGI', 'STA', 'WIS', 'INT', 'CHA'];
  const statColors = {
    STR: '#cc4444', DEX: '#44cc88', AGI: '#44aacc',
    STA: '#cc8844', WIS: '#8844cc', INT: '#4488cc', CHA: '#cc44cc'
  };

  let html = stats.map(stat => {
    const base = member[stat] || 0;
    const bonus = member.statBonuses ? (member.statBonuses[stat] || 0) : 0;
    const effective = Math.min(255, base + bonus);
    const pct = (effective / 255) * 100;

    return `<div class="stat-row" data-stat="${stat}">
      <div class="stat-label">${stat}</div>
      <div class="stat-bar-track">
        <div class="stat-bar" style="width:${pct}%;background:${statColors[stat]}"></div>
      </div>
      <div class="stat-value">${effective}${bonus !== 0
        ? `<span class="stat-bonus">${bonus > 0 ? '+' : ''}${bonus}</span>`
        : ''}</div>
    </div>`;
  }).join('');

  // Skills section
  const skills = member.skills;
  if (skills && typeof getSkillCap === 'function' && typeof SKILL_DISPLAY_NAMES !== 'undefined') {
    const skillGroups = [
      {
        label: 'Combat',
        keys: ['offense', 'defense', 'dodge', 'parry', 'riposte', 'doubleAttack', 'dualWield'],
      },
      {
        label: 'Weapon',
        keys: ['oneHandSlash', 'oneHandBlunt', 'twoHandSlash', 'twoHandBlunt', 'piercing', 'archery'],
      },
      {
        label: 'Class Skills',
        keys: [
          'backstab', 'frenzy', 'mend', 'kick', 'bash', 'taunt', 'roundKick', 'tigerClaw',
          'flyingKick', 'feignDeath', 'safeFall', 'sneak', 'hide', 'disarm', 'intimidation',
          'pickLock', 'pickPockets', 'applyPoison', 'disarmTrap', 'tracking', 'forage',
          'bindWound', 'swimming', 'layOnHands', 'harmTouch', 'senseUndead', 'senseDead',
        ],
      },
      {
        label: 'Magic',
        keys: [
          'channeling', 'meditation', 'abjuration', 'alteration', 'conjuration',
          'divination', 'evocation', 'singing', 'brass', 'percussion', 'stringed', 'wind',
        ],
      },
    ];

    for (const group of skillGroups) {
      const visibleKeys = group.keys.filter(k => skills[k] !== undefined);
      if (visibleKeys.length === 0) continue;

      html += `<div class="skill-section-header">${group.label}</div>`;
      for (const skillName of visibleKeys) {
        const current = skills[skillName] || 0;
        const cap = getSkillCap(member.classId, skillName, member.level);
        const pct = cap > 0 ? Math.min(100, (current / cap) * 100) : 0;
        const displayName = SKILL_DISPLAY_NAMES[skillName] || skillName;
        html += `<div class="skill-row">
          <div class="skill-label">${displayName}</div>
          <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${pct}%"></div></div>
          <div class="skill-value">${current} / ${cap}</div>
        </div>`;
      }
    }
  }

  el.innerHTML = html;

  el.querySelectorAll('.stat-row').forEach(row => {
    const stat = row.dataset.stat;
    attachTooltip(row, () => getStatTooltipHTML(stat));
  });
}

/**
 * Renders the equipment panel for the currently inspected party member,
 * displaying all equipment slots and the item equipped in each.
 * @returns {void}
 */
function renderEquipmentPanel() {
  const idx = GameState.inspectedCharIndex !== undefined ? GameState.inspectedCharIndex : 0;
  const member = GameState.party[idx];
  const el = document.getElementById('equipment-panel');
  if (!el || !member) return;

  const slots = [
    ['head', 'Head'], ['face', 'Face'], ['ear1', 'Ear 1'], ['ear2', 'Ear 2'],
    ['neck', 'Neck'], ['shoulders', 'Shoulders'], ['back', 'Back'],
    ['chest', 'Chest'], ['wrist_l', 'Wrist L'], ['wrist_r', 'Wrist R'],
    ['hands', 'Hands'], ['waist', 'Waist'], ['legs', 'Legs'], ['feet', 'Feet'],
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['range', 'Range'], ['ammo', 'Ammo'],
    ['ring1', 'Ring 1'], ['ring2', 'Ring 2']
  ];

  // Character selector tabs
  const charTabs = GameState.party.map((m, i) => {
    if (!m) return '';
    const cls = CLASSES[m.classId];
    return `<button class="equip-char-tab${i === idx ? ' active' : ''}" data-char-idx="${i}" title="${m.name}">${cls ? cls.icon : '?'} ${m.name}</button>`;
  }).join('');

  // Stat summary
  const totalAC = member.currentAC || 0;
  const carriedWeight = typeof getCurrentCarryWeight === 'function' ? getCurrentCarryWeight(member) : 0;
  const weightLimit = typeof getWeightLimit === 'function' ? getWeightLimit(member) : 100;
  const bonuses = member.statBonuses || {};
  const bonusStr = Object.entries(bonuses)
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`)
    .join('  ');

  el.innerHTML = `
    <div class="equip-char-tabs">${charTabs}</div>
    <div class="equip-summary">
      <span>AC: <strong>${totalAC}</strong></span>
      <span>Wt: <strong>${carriedWeight}/${weightLimit}</strong></span>
      ${bonusStr ? `<span class="equip-bonuses" title="Gear bonuses">${bonusStr}</span>` : ''}
    </div>
    <div class="equip-grid">` + slots.map(([slotId, label]) => {
    const itemId = member.equipment ? member.equipment[slotId] : null;
    const item = itemId ? ITEMS[itemId] : null;
    const rarityClass = item ? `rarity-${item.rarity}` : '';

    return `<div class="equip-slot ${rarityClass}" data-slot="${slotId}" data-item="${itemId || ''}">
      <div class="equip-slot-label">${label}</div>
      <div class="equip-slot-item">${item ? item.name : '—'}</div>
    </div>`;
  }).join('') + `</div>`;

  el.querySelectorAll('.equip-slot').forEach(slotEl => {
    const itemId = slotEl.dataset.item;
    if (itemId) {
      attachTooltip(slotEl, () => getItemTooltipHTML(itemId));
    }
    // Right-click on equipped slot → unequip context menu
    slotEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const equippedId = slotEl.dataset.item;
      if (!equippedId) return;
      showUnequipContextMenu(e, slotEl.dataset.slot, member);
    });
  });

  // Character selector tab clicks
  el.querySelectorAll('.equip-char-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      GameState.inspectedCharIndex = parseInt(tab.dataset.charIdx, 10);
      renderEquipmentPanel();
      renderCharacterInspectPanel();
      renderStatsPanel();
      renderSpellsPanel();
    });
  });
}

/**
 * Renders the spells/abilities panel for the currently inspected party member,
 * listing each ability with its name and mana cost.
 * @returns {void}
 */
function renderSpellsPanel() {
  const idx = GameState.inspectedCharIndex !== undefined ? GameState.inspectedCharIndex : 0;
  const member = GameState.party[idx];
  const el = document.getElementById('spells-panel');
  if (!el || !member) return;

  const cls = CLASSES[member.classId];
  if (!cls || !cls.abilities || cls.abilities.length === 0) {
    el.innerHTML = '<div class="no-spells">No abilities.</div>';
    return;
  }

  el.innerHTML = cls.abilities.map(ability => `
    <div class="spell-row" data-ability="${ability.name}">
      <div class="spell-name">${ability.name}</div>
      <div class="spell-cost">${ability.manaCost > 0 ? ability.manaCost + ' MP' : 'Passive'}</div>
    </div>
  `).join('');

  el.querySelectorAll('.spell-row').forEach((row, i) => {
    const ability = cls.abilities[i];
    if (ability) {
      attachTooltip(row, () => getAbilityTooltipHTML(ability));
    }
  });
}

function renderHotbar() {
  const hotbarEl = document.getElementById('hotbar');
  const labelEl = document.getElementById('hotbar-char-label');
  if (!hotbarEl) return;

  const idx = GameState.inspectedCharIndex !== undefined ? GameState.inspectedCharIndex : 0;
  const member = GameState.party && GameState.party[idx];

  if (labelEl) {
    labelEl.textContent = member ? `${member.name} [${member.classId}]` : '';
  }

  const cls = member && CLASSES[member.classId];
  const abilities = (cls && cls.abilities) ? cls.abilities.slice(0, 8) : [];

  hotbarEl.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const ability = abilities[i] || null;
    const slot = document.createElement('div');
    slot.className = 'hotbar-slot' + (ability ? '' : ' hotbar-empty');
    slot.dataset.index = i;
    slot.dataset.key = i + 1;

    if (ability) {
      const onCd = member && member.abilityCooldowns && member.abilityCooldowns[ability.name] && member.abilityCooldowns[ability.name] > Date.now();
      slot.classList.toggle('hotbar-cooldown', !!onCd);
      slot.innerHTML = `
        <div class="hotbar-key">${i + 1}</div>
        <div class="hotbar-icon">${getAbilityIcon(ability)}</div>
        <div class="hotbar-name">${ability.name}</div>
        <div class="hotbar-cost">${ability.manaCost > 0 ? ability.manaCost + 'mp' : 'passive'}</div>
        ${onCd ? '<div class="hotbar-cd-overlay"></div>' : ''}
      `;
      slot.addEventListener('click', () => triggerHotbarAbility(idx, ability));
      attachTooltip(slot, () => getAbilityTooltipHTML(ability));
    } else {
      slot.innerHTML = `<div class="hotbar-key">${i + 1}</div><div class="hotbar-empty-label">—</div>`;
    }

    hotbarEl.appendChild(slot);
  }
}

function getAbilityIcon(ability) {
  if (!ability) return '?';
  const name = (ability.name || '').toLowerCase();
  if (name.includes('heal') || name.includes('mend')) return '✚';
  if (name.includes('fire') || name.includes('flame') || name.includes('fireball')) return '🔥';
  if (name.includes('ice') || name.includes('frost') || name.includes('cold')) return '❄';
  if (name.includes('lightning') || name.includes('shock')) return '⚡';
  if (name.includes('stun') || name.includes('bash')) return '💥';
  if (name.includes('mez') || name.includes('charm') || name.includes('sleep')) return '💤';
  if (name.includes('slow')) return '🐢';
  if (name.includes('poison') || name.includes('dot')) return '☠';
  if (name.includes('shield') || name.includes('ward') || name.includes('armor')) return '🛡';
  if (name.includes('rune') || name.includes('buff')) return '✨';
  if (name.includes('taunt')) return '😠';
  if (name.includes('backstab') || name.includes('eviscerate')) return '🗡';
  if (name.includes('kick')) return '👢';
  if (name.includes('song') || name.includes('chant') || name.includes('aria')) return '🎵';
  if (name.includes('summon') || name.includes('pet')) return '🐾';
  if (name.includes('fear') || name.includes('panic')) return '👻';
  if (name.includes('nuke') || name.includes('blast') || name.includes('bolt')) return '💫';
  if (name.includes('snare') || name.includes('root')) return '🌿';
  return '⚔';
}

function triggerHotbarAbility(charIdx, ability) {
  if (!GameState.combatActive) {
    addCombatLog(`${ability.name} can only be used in combat.`, 'system');
    return;
  }
  const member = GameState.party && GameState.party[charIdx];
  if (!member || !member.isAlive) return;
  if (ability.manaCost > 0 && member.mana < ability.manaCost) {
    addCombatLog(`${member.name} does not have enough mana for ${ability.name}.`, 'system');
    return;
  }
  const onCd = member.abilityCooldowns && member.abilityCooldowns[ability.name] && member.abilityCooldowns[ability.name] > Date.now();
  if (onCd) {
    addCombatLog(`${ability.name} is not ready yet.`, 'system');
    return;
  }
  if (typeof dispatchAbilityEffect === 'function') {
    dispatchAbilityEffect(member, ability, GameState.currentEnemy, GameState.enemies);
    addCombatLog(`${member.name} manually activates ${ability.name}.`, 'cast');
  }
  renderHotbar();
}

/**
 * Appends new drops to the recent-loot list and renders up to the last five
 * loot entries with rarity-coloured text in the loot-display element.
 * @param {Array.<{itemId: string, quantity: number}>} drops - Array of newly
 *   dropped item stacks to add to the loot display.
 * @returns {void}
 */
function renderLootPanel(drops) {
  const lootEl = document.getElementById('loot-display');
  if (!lootEl) return;

  if (!GameState.recentLoot) GameState.recentLoot = [];
  GameState.recentLoot.push(...drops);
  if (GameState.recentLoot.length > 5) {
    GameState.recentLoot = GameState.recentLoot.slice(-5);
  }

  const rarityColors = {
    common: '#aaaaaa', magic: '#5588ff', rare: '#ffcc00', named: '#ff8800'
  };

  lootEl.innerHTML = GameState.recentLoot.map(drop => {
    const item = ITEMS[drop.itemId];
    if (!item) return '';
    const color = rarityColors[item.rarity] || '#aaaaaa';
    return `<div class="loot-entry" style="color:${color}">✦ ${item.name} x${drop.quantity}</div>`;
  }).join('');
}

// ─── Floating Damage Numbers ──────────────────────────────────────────────────

/**
 * Spawns a floating damage-number element inside the combat area that fades
 * out after one second.
 * @param {number|string} value      - The damage value to display.
 * @param {object}        targetChar - The target character object (currently
 *   unused in positioning but reserved for future use).
 * @param {boolean}       isCrit     - When true the number is styled as a
 *   critical hit and an exclamation mark is appended.
 * @returns {void}
 */
function showDamageNumber(value, targetChar, isCrit) {
  const combatArea = document.getElementById('combat-area');
  if (!combatArea) return;

  const el = document.createElement('div');
  el.className = 'damage-number' + (isCrit ? ' damage-crit' : '');
  el.textContent = isCrit ? `${value}!` : value;

  const x = 30 + Math.random() * 60;
  el.style.left = x + '%';
  el.style.top = '40%';

  combatArea.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ─── Level Up Effect ──────────────────────────────────────────────────────────

/**
 * Triggers a level-up burst animation on the matching party-member card and
 * displays a "LEVEL UP!" overlay in the combat area for two seconds.
 * @param {string|number} charId - The character ID used to find the matching
 *   `.party-member` DOM element.
 * @returns {void}
 */
function showLevelUpEffect(charId) {
  document.querySelectorAll('.party-member').forEach(m => {
    if (m.dataset.charId === String(charId)) {
      m.classList.add('level-up-burst');
      setTimeout(() => m.classList.remove('level-up-burst'), 2000);
    }
  });

  const combatArea = document.getElementById('combat-area');
  if (combatArea) {
    const el = document.createElement('div');
    el.className = 'level-up-text';
    el.textContent = 'LEVEL UP!';
    combatArea.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

// ─── Combat Log Management ────────────────────────────────────────────────────

/**
 * Appends a timestamped entry to the GameState combat log (capped at 100
 * entries) and immediately refreshes the combat-log panel.
 * @param {string} text - The message text to add to the log.
 * @param {string} type - The log entry type (e.g. `"info"`, `"system"`,
 *   `"loot"`, `"damage"`), used to apply CSS styling.
 * @returns {void}
 */
function addCombatLog(text, type) {
  if (!GameState.combatLog) GameState.combatLog = [];
  GameState.combatLog.push({ text, type: type || 'info', time: Date.now() });
  if (GameState.combatLog.length > 200) {
    GameState.combatLog = GameState.combatLog.slice(-200);
  }
  renderCombatLog();
}

/**
 * Adds a single item drop to the loot display panel.
 * @param {string} itemId    - The item identifier to display.
 * @param {number} quantity  - The quantity of the item dropped.
 * @returns {void}
 */
function addLoot(itemId, quantity) {
  renderLootPanel([{ itemId, quantity }]);
}

/**
 * Clears the recent-loot list from GameState and empties the loot-display
 * element in the DOM.
 * @returns {void}
 */
function clearLootDisplay() {
  GameState.recentLoot = [];
  const lootEl = document.getElementById('loot-display');
  if (lootEl) lootEl.innerHTML = '';
}

// ─── Game Clock ───────────────────────────────────────────────────────────────

/**
 * Updates the game-clock element with the current in-game day and 12-hour
 * time derived from GameState.gameTime.
 * @returns {void}
 */
function updateGameClock() {
  const clockEl = document.getElementById('game-clock');
  if (!clockEl) return;

  if (!GameState.gameTime) GameState.gameTime = { day: 1, hour: 6 };

  const h = GameState.gameTime.hour;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  clockEl.textContent = `Day ${GameState.gameTime.day}, ${hour12}:00 ${ampm}`;
}

// ─── Draggable Panels ─────────────────────────────────────────────────────────

/**
 * Attaches mousedown/mousemove/mouseup drag handlers and collapse-button
 * click handlers to every `.panel` element that has a `.panel-header`.
 * @returns {void}
 */
function initDraggablePanels() {
  const panels = document.querySelectorAll('.panel');
  panels.forEach(panel => {
    const header = panel.querySelector('.panel-header');
    if (!header) return;

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const collapseBtn = header.querySelector('.collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const body = panel.querySelector('.panel-body');
        if (body) {
          const collapsed = body.style.display === 'none';
          body.style.display = collapsed ? '' : 'none';
          collapseBtn.textContent = collapsed ? '▲' : '▼';
          savePanelPosition(
            panel.id,
            parseInt(panel.style.left) || 0,
            parseInt(panel.style.top) || 0,
            !collapsed
          );
        }
      });
    }

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('collapse-btn')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const style = window.getComputedStyle(panel);
      startLeft = parseInt(style.left) || panel.offsetLeft;
      startTop = parseInt(style.top) || panel.offsetTop;
      panel.style.zIndex = 1000;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = (startLeft + dx) + 'px';
      panel.style.top = (startTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        panel.style.zIndex = '';
        savePanelPosition(
          panel.id,
          parseInt(panel.style.left) || 0,
          parseInt(panel.style.top) || 0,
          false
        );
      }
    });
  });
}

/**
 * Reads saved panel positions from storage and applies left/top offsets and
 * collapsed state to each panel element.
 * @returns {void}
 */
function restorePanelPositions() {
  const positions = getPanelPositions();
  for (const [panelId, pos] of Object.entries(positions)) {
    const panel = document.getElementById(panelId);
    if (panel && pos) {
      if (pos.x) panel.style.left = pos.x + 'px';
      if (pos.y) panel.style.top = pos.y + 'px';
      if (pos.collapsed) {
        const body = panel.querySelector('.panel-body');
        const btn = panel.querySelector('.collapse-btn');
        if (body) body.style.display = 'none';
        if (btn) btn.textContent = '▼';
      }
    }
  }
}

// ─── Update Functions (called from game loop) ─────────────────────────────────

/**
 * Refreshes the combat log, enemy display, party UI, and top bar, then
 * updates the stop-button enabled state.
 * @returns {void}
 */
function updateCombatUI() {
  renderCombatLog();
  updateEnemyDisplay();
  updatePartyUI();
  renderTopBar();
  if (typeof updateStopButtonState === 'function') updateStopButtonState();
}

/**
 * Re-renders the party panel and, if a character is being inspected, also
 * refreshes the inspect and stats panels.
 * @returns {void}
 */
function updatePartyUI() {
  renderPartyPanel();
  if (GameState.inspectedCharIndex !== undefined) {
    renderCharacterInspectPanel();
    renderStatsPanel();
  }
  renderHotbar();
}

/**
 * Refreshes the inventory panel and rebuilds the inventory list with
 * rarity-coloured item entries and tooltips.
 * @returns {void}
 */
function updateInventoryUI() {
  renderInventoryPanel();

  const invEl = document.getElementById('inventory-list');
  if (!invEl) return;

  const rarityColors = {
    common: '#aaaaaa', magic: '#5588ff', rare: '#ffcc00', named: '#ff8800'
  };

  invEl.innerHTML = (GameState.inventory || []).map(stack => {
    const item = ITEMS[stack.itemId];
    if (!item) return '';
    const color = rarityColors[item.rarity] || '#aaaaaa';
    return `<div class="inv-item" data-item="${stack.itemId}" style="color:${color}">${item.name}${stack.quantity > 1 ? ` x${stack.quantity}` : ''}</div>`;
  }).join('');

  invEl.querySelectorAll('.inv-item[data-item]').forEach(el => {
    attachTooltip(el, () => getItemTooltipHTML(el.dataset.item));
  });
}

/**
 * Refreshes both the kill-count panel and the monster-log panel.
 * @returns {void}
 */
function updateKillCountUI() {
  renderKillCountPanel();
  renderMonsterLogPanel();
}

/**
 * Advances the in-game clock by one hour (rolling over at midnight) and
 * updates the game-clock display.
 * @returns {void}
 */
function updateGameTime() {
  if (!GameState.gameTime) GameState.gameTime = { day: 1, hour: 6 };
  GameState.gameTime.hour++;
  if (GameState.gameTime.hour >= 24) {
    GameState.gameTime.hour = 0;
    GameState.gameTime.day++;
  }
  updateGameClock();
}

// ─── Offline Progress Modal ───────────────────────────────────────────────────

/**
 * Displays the offline-progress modal summarising XP earned while the player
 * was away.
 * @param {{offlineHours: number, xpEarned: number}} offlineData - Object
 *   containing the number of hours offline and total XP earned during that
 *   time.
 * @returns {void}
 */
function showOfflineProgressModal(offlineData) {
  const modal = document.getElementById('offline-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Welcome Back!</h2>
      <p>You were away for ${offlineData.offlineHours} hours.</p>
      <p>Your party earned <strong>${offlineData.xpEarned} XP</strong> while you were gone!</p>
      <button id="offline-ok" class="btn-primary">Continue</button>
    </div>
  `;
  modal.style.display = 'flex';
  document.getElementById('offline-ok').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// ─── Export / Import UI Handlers ──────────────────────────────────────────────

/**
 * Opens the export-save modal and pre-populates its textarea with the
 * base64-encoded save string.
 * @returns {void}
 */
function handleExportSave() {
  const encoded = exportSave();
  if (!encoded) { alert('No save to export.'); return; }
  const modal = document.getElementById('export-modal');
  if (modal) {
    modal.style.display = 'flex';
    const textarea = modal.querySelector('textarea');
    if (textarea) { textarea.value = encoded; textarea.select(); }
  }
}

/**
 * Opens the import-save modal so the player can paste an exported save string.
 * @returns {void}
 */
function handleImportSave() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'flex';
}

// ─── Inventory Panel ──────────────────────────────────────────────────────────

/**
 * Returns an emoji icon character representing the item's equipment slot or
 * type for use in inventory and bag slot displays.
 * @param {string} itemId - The item identifier to look up in ITEMS.
 * @returns {string} A single emoji character representing the item category.
 */
function getItemIcon(itemId) {
  const item = ITEMS[itemId];
  if (!item) return '?';
  if (item.slot === 'primary' || item.slot === 'secondary') return '⚔';
  if (item.slot === 'head') return '🪖';
  if (item.slot === 'chest') return '🛡';
  if (item.slot === 'ring1' || item.slot === 'ring2') return '💍';
  if (item.slot === 'ear1' || item.slot === 'ear2') return '💎';
  if (item.slot === 'neck') return '📿';
  if (item.type === 'bag') return '👝';
  return '📦';
}

/**
 * Renders the full inventory panel including the weight bar, carry/bags/bank
 * tabs, and wires tab-switching and item-tooltip interactions.
 * @returns {void}
 */
function renderInventoryPanel() {
  const panel = document.getElementById('inventory-panel');
  if (!panel) return;

  const carriedWeight = typeof getInventoryWeight === 'function' ? getInventoryWeight() : 0;
  const inspectedChar = GameState.party[GameState.inspectedCharIndex || 0];
  const weightLimit = inspectedChar && typeof getWeightLimit === 'function' ? getWeightLimit(inspectedChar) : 100;
  const encumbered = inspectedChar && typeof isEncumbered === 'function' ? isEncumbered(inspectedChar) : false;

  panel.innerHTML = `
    <div class="inv-weight-bar-area">
      <div class="inv-weight-label ${encumbered ? 'encumbered' : ''}">
        ⚖ Weight: ${carriedWeight} / ${weightLimit} stone
        ${encumbered ? '<span class="encumbered-warn">ENCUMBERED!</span>' : ''}
      </div>
      <div class="inv-weight-track">
        <div class="inv-weight-fill ${encumbered ? 'enc-fill' : ''}"
             style="width:${Math.min(100, weightLimit > 0 ? (carriedWeight / weightLimit) * 100 : 0)}%"></div>
      </div>
    </div>
    <div class="inv-tabs">
      <button class="inv-tab active" data-tab="carry">🎒 Carry</button>
      <button class="inv-tab" data-tab="bags">👝 Bags</button>
      <button class="inv-tab" data-tab="bank">🏦 Bank</button>
    </div>
    <div class="inv-tab-content" id="inv-tab-carry">
      ${renderCarrySlots()}
    </div>
    <div class="inv-tab-content" id="inv-tab-bags" style="display:none">
      ${renderBagSlots()}
    </div>
    <div class="inv-tab-content" id="inv-tab-bank" style="display:none">
      ${renderBankSlots()}
    </div>
  `;

  panel.querySelectorAll('.inv-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelectorAll('.inv-tab-content').forEach(c => c.style.display = 'none');
      const target = panel.querySelector(`#inv-tab-${tab.dataset.tab}`);
      if (target) target.style.display = '';
    });
  });

  panel.querySelectorAll('[data-item]').forEach(el => {
    if (el.dataset.item) {
      attachTooltip(el, () => getItemTooltipHTML(el.dataset.item));
    }
  });

  // Right-click on filled carry slots → equip context menu
  panel.querySelectorAll('#inv-tab-carry .inv-slot.filled').forEach(slotEl => {
    slotEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const slotIndex = parseInt(slotEl.dataset.slotIndex, 10);
      showItemContextMenu(e, slotEl.dataset.item, slotIndex);
    });
  });

  const depositBtn = panel.querySelector('#deposit-all-btn');
  if (depositBtn) {
    depositBtn.addEventListener('click', () => {
      if (typeof depositAllToBank === 'function') depositAllToBank();
    });
  }
}

/**
 * Builds and returns the HTML for the carry-slot grid from GameState.inventory,
 * showing filled slots with icon and stack count and empty slots as blanks.
 * @returns {string} HTML markup for the carry-slots grid.
 */
function renderCarrySlots() {
  const inventory = GameState.inventory || [];
  const MAX_SLOTS = typeof MAX_CARRY_SLOTS !== 'undefined' ? MAX_CARRY_SLOTS : 30;
  const slots = [];
  for (let i = 0; i < MAX_SLOTS; i++) {
    const stack = inventory[i];
    if (stack) {
      const item = ITEMS[stack.itemId];
      const rarityClass = item ? `rarity-${item.rarity}` : '';
      slots.push(`
        <div class="inv-slot filled ${rarityClass}" data-item="${stack.itemId}" data-slot-index="${i}">
          <div class="inv-slot-icon">${getItemIcon(stack.itemId)}</div>
          <div class="inv-slot-count">${stack.quantity > 1 ? stack.quantity : ''}</div>
        </div>
      `);
    } else {
      slots.push(`<div class="inv-slot empty" data-slot-index="${i}"></div>`);
    }
  }
  return `<div class="inv-grid">${slots.join('')}</div>`;
}

/**
 * Builds and returns the HTML for all four bag slots, each containing the
 * bag's name, capacity, weight-reduction info, and an inline contents grid.
 * @returns {string} HTML markup for the bag-slots section.
 */
function renderBagSlots() {
  const bags = GameState.bags || [null, null, null, null];
  const bagContents = GameState.bagContents || [{}, {}, {}, {}];
  let html = '<div class="bag-slots-row">';
  for (let i = 0; i < 4; i++) {
    const bagId = bags[i];
    const bag = bagId ? ITEMS[bagId] : null;
    const usedSlots = bag ? Object.keys(bagContents[i] || {}).filter(k => bagContents[i][k]).length : 0;
    html += `
      <div class="bag-slot-container">
        <div class="bag-main-slot ${bag ? 'filled' : 'empty'}" data-bag-index="${i}" ${bag ? `data-item="${bagId}"` : ''}>
          ${bag ? `
            <div class="bag-icon">${getItemIcon(bagId)}</div>
            <div class="bag-name">${bag.name}</div>
            <div class="bag-capacity">${usedSlots}/${bag.capacity}</div>
            ${bag.weightReduction > 0 ? `<div class="bag-reduction">${bag.weightReduction}% WR</div>` : ''}
          ` : '<div class="empty-bag-label">Empty Bag Slot</div>'}
        </div>
        ${bag ? `
          <div class="bag-contents-grid">
            ${renderBagContents(i, bag.capacity)}
          </div>
        ` : ''}
      </div>
    `;
  }
  html += '</div>';
  return html;
}

/**
 * Builds and returns the HTML for the contents grid of a single bag.
 * @param {number} bagIndex  - Zero-based index into GameState.bagContents.
 * @param {number} capacity  - Number of slots the bag has.
 * @returns {string} HTML markup for the bag-contents grid.
 */
function renderBagContents(bagIndex, capacity) {
  const contents = (GameState.bagContents || [{}, {}, {}, {}])[bagIndex] || {};
  let html = '';
  for (let slot = 0; slot < capacity; slot++) {
    const stack = contents[slot];
    if (stack && stack.itemId) {
      const item = ITEMS[stack.itemId];
      const rarityClass = item ? `rarity-${item.rarity}` : '';
      html += `
        <div class="inv-slot filled ${rarityClass}" data-item="${stack.itemId}" data-bag-index="${bagIndex}" data-bag-slot="${slot}">
          <div class="inv-slot-icon">${getItemIcon(stack.itemId)}</div>
          <div class="inv-slot-count">${stack.quantity > 1 ? stack.quantity : ''}</div>
        </div>
      `;
    } else {
      html += `<div class="inv-slot empty" data-bag-index="${bagIndex}" data-bag-slot="${slot}"></div>`;
    }
  }
  return html;
}

/**
 * Builds and returns the HTML for the 100-slot bank grid along with the
 * bank header and deposit-all button.
 * @returns {string} HTML markup for the bank-slots section.
 */
function renderBankSlots() {
  const bank = GameState.bank || [];
  const BANK_SLOTS = 100;
  const slots = [];
  for (let i = 0; i < BANK_SLOTS; i++) {
    const stack = bank[i];
    if (stack) {
      const item = ITEMS[stack.itemId];
      const rarityClass = item ? `rarity-${item.rarity}` : '';
      const shortName = item ? (item.name.length > 10 ? item.name.slice(0, 9) + '…' : item.name) : '?';
      slots.push(`
        <div class="inv-slot filled bank-slot-filled ${rarityClass}" data-item="${stack.itemId}" data-bank-slot="${i}" title="${item ? item.name : ''}">
          <div class="inv-slot-icon">${getItemIcon(stack.itemId)}</div>
          <div class="inv-slot-count">${stack.quantity > 1 ? stack.quantity : ''}</div>
          <div class="inv-slot-name">${shortName}</div>
        </div>
      `);
    } else {
      slots.push(`<div class="inv-slot empty bank-slot" data-bank-slot="${i}"></div>`);
    }
  }
  return `
    <div class="bank-header">
      <span>🏦 Bank of Qeynos — ${bank.filter(Boolean).length}/${BANK_SLOTS} slots used</span>
      <button class="btn-deposit-all" id="deposit-all-btn">Deposit All</button>
    </div>
    <div class="inv-grid bank-grid">${slots.join('')}</div>
  `;
}

/**
 * Wires left-click (withdraw) and right-click context-menu interactions onto
 * the bank slot elements inside the given container.
 * @param {HTMLElement} container - The DOM element containing the bank slots.
 * @returns {void}
 */
function wireBankInteractions(container) {
  // Left-click filled slot → withdraw
  container.querySelectorAll('.bank-slot-filled').forEach(slotEl => {
    slotEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(slotEl.dataset.bankSlot, 10);
      if (typeof withdrawItemFromBank === 'function') withdrawItemFromBank(idx);
    });
    // Right-click → context menu
    slotEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showBankContextMenu(e, parseInt(slotEl.dataset.bankSlot, 10));
    });
  });

  // Left-click empty slot → open deposit picker
  container.querySelectorAll('.bank-slot').forEach(slotEl => {
    slotEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(slotEl.dataset.bankSlot, 10);
      showDepositPicker(slotEl, idx);
    });
  });
}

/**
 * Equips an item from the carry inventory onto a party member.
 * Swaps any previously equipped item in the same slot back to inventory.
 * Calls computeDerivedStats and refreshes all relevant panels.
 * @param {string} itemId            - The item ID to equip.
 * @param {number} inventorySlotIndex - Index in GameState.inventory.
 * @param {object} member            - The party member object to equip onto.
 */
function equipItemOnMember(itemId, inventorySlotIndex, member) {
  const item = ITEMS[itemId];
  if (!item || !item.slot) return;

  if (item.classes && item.classes.length > 0 && !item.classes.includes(member.classId)) {
    addCombatLog(`${member.name} cannot use ${item.name}.`, 'system');
    return;
  }

  const targetSlot = item.slot;
  const currentlyEquipped = member.equipment ? member.equipment[targetSlot] : null;
  if (currentlyEquipped) {
    if (typeof addToInventory === 'function') addToInventory(currentlyEquipped, 1);
  }

  if (!member.equipment) member.equipment = {};
  member.equipment[targetSlot] = itemId;

  const stack = GameState.inventory[inventorySlotIndex];
  if (stack) {
    stack.quantity -= 1;
    if (stack.quantity <= 0) {
      GameState.inventory.splice(inventorySlotIndex, 1);
    }
  }

  if (typeof computeDerivedStats === 'function') computeDerivedStats(member);
  addCombatLog(`${member.name} equips ${item.name}.`, 'system');
  if (typeof saveGame === 'function') saveGame();
  renderInventoryPanel();
  renderEquipmentPanel();
  updatePartyUI();
}

/**
 * Unequips an item from a party member's equipment slot and returns it
 * to the carry inventory.  Calls computeDerivedStats and refreshes panels.
 * @param {string} slotId  - The equipment slot key (e.g. 'chest', 'primary').
 * @param {object} member  - The party member object to unequip from.
 */
function unequipItem(slotId, member) {
  if (!member.equipment) return;
  const itemId = member.equipment[slotId];
  if (!itemId) return;

  if (typeof addToInventory === 'function') {
    const added = addToInventory(itemId, 1);
    if (added === false) {
      addCombatLog('Inventory full! Cannot unequip.', 'system');
      return;
    }
  }

  member.equipment[slotId] = null;
  if (typeof computeDerivedStats === 'function') computeDerivedStats(member);
  const item = ITEMS[itemId];
  addCombatLog(`${member.name} unequips ${item ? item.name : itemId}.`, 'system');
  if (typeof saveGame === 'function') saveGame();
  renderInventoryPanel();
  renderEquipmentPanel();
  updatePartyUI();
}

/**
 * Shows a right-click context menu for an inventory carry slot, offering
 * equip-on-member and drop options.
 * @param {MouseEvent} e          - The right-click event for positioning.
 * @param {string}     itemId     - The item ID in the slot.
 * @param {number}     invIndex   - Index in GameState.inventory.
 */
function showItemContextMenu(e, itemId, invIndex) {
  document.querySelectorAll('.item-context-menu').forEach(m => m.remove());
  const item = ITEMS[itemId];
  if (!item) return;

  const menu = document.createElement('div');
  menu.className = 'item-context-menu';
  menu.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;`;

  const livingMembers = (GameState.party || []).filter(m => m && m.isAlive);

  let equipOptions = '';
  if (item.slot) {
    equipOptions = livingMembers.map(m => {
      const canUse = !item.classes || item.classes.length === 0 || item.classes.includes(m.classId);
      return `<div class="ctx-item ctx-equip${canUse ? '' : ' ctx-disabled'}" data-member-id="${m.id}"
                   title="${canUse ? '' : 'Class restriction'}">⚔ Equip on ${m.name}</div>`;
    }).join('');
  }

  menu.innerHTML = `
    ${equipOptions}
    <div class="ctx-item ctx-drop ctx-destroy">🗑 Drop</div>
  `;
  document.body.appendChild(menu);

  menu.querySelectorAll('.ctx-equip:not(.ctx-disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      menu.remove();
      const memberId = btn.dataset.memberId;
      const member = (GameState.party || []).find(m => m && m.id === memberId);
      if (member) equipItemOnMember(itemId, invIndex, member);
    });
  });

  menu.querySelector('.ctx-drop').addEventListener('click', () => {
    menu.remove();
    const stack = GameState.inventory[invIndex];
    const itemName = item ? item.name : itemId;
    if (stack && confirm(`Drop ${itemName}? This cannot be undone.`)) {
      stack.quantity -= 1;
      if (stack.quantity <= 0) GameState.inventory.splice(invIndex, 1);
      addCombatLog(`Dropped ${itemName}.`, 'system');
      if (typeof saveGame === 'function') saveGame();
      renderInventoryPanel();
    }
  });

  const dismiss = () => { menu.remove(); document.removeEventListener('click', dismiss); };
  setTimeout(() => document.addEventListener('click', dismiss), 0);
}

/**
 * Shows a right-click context menu on an equipped slot offering an Unequip option.
 * @param {MouseEvent} e       - The right-click event for positioning.
 * @param {string}     slotId  - The equipment slot key.
 * @param {object}     member  - The party member to unequip from.
 */
function showUnequipContextMenu(e, slotId, member) {
  document.querySelectorAll('.item-context-menu').forEach(m => m.remove());
  const menu = document.createElement('div');
  menu.className = 'item-context-menu';
  menu.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;`;
  menu.innerHTML = `<div class="ctx-item">📤 Unequip</div>`;
  document.body.appendChild(menu);

  menu.querySelector('.ctx-item').addEventListener('click', () => {
    menu.remove();
    unequipItem(slotId, member);
  });

  const dismiss = () => { menu.remove(); document.removeEventListener('click', dismiss); };
  setTimeout(() => document.addEventListener('click', dismiss), 0);
}

/**
 * Displays a context menu at the mouse position for a bank slot, providing
 * withdraw and destroy actions for the item stored there.
 * @param {MouseEvent} e              - The right-click mouse event used for
 *   positioning the menu.
 * @param {number}     bankSlotIndex  - Zero-based index of the bank slot.
 * @returns {void}
 */
function showBankContextMenu(e, bankSlotIndex) {
  document.querySelectorAll('.bank-context-menu').forEach(m => m.remove());
  const stack = (GameState.bank || [])[bankSlotIndex];
  if (!stack) return;
  const item = ITEMS[stack.itemId];
  const itemName = item ? item.name : stack.itemId;

  const menu = document.createElement('div');
  menu.className = 'bank-context-menu';
  menu.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:9999;`;
  menu.innerHTML = `
    <div class="ctx-item ctx-withdraw">📤 Withdraw</div>
    <div class="ctx-item ctx-destroy">🗑 Destroy</div>
  `;
  document.body.appendChild(menu);

  menu.querySelector('.ctx-withdraw').addEventListener('click', () => {
    menu.remove();
    if (typeof withdrawItemFromBank === 'function') withdrawItemFromBank(bankSlotIndex);
  });
  menu.querySelector('.ctx-destroy').addEventListener('click', () => {
    menu.remove();
    if (confirm(`Destroy ${itemName}? This cannot be undone.`)) {
      if (!GameState.bank) return;
      GameState.bank[bankSlotIndex] = null;
      while (GameState.bank.length > 0 && GameState.bank[GameState.bank.length - 1] === null) {
        GameState.bank.pop();
      }
      addCombatLog(`Destroyed ${itemName}.`, 'system');
      if (typeof saveGame === 'function') saveGame();
      renderCityTabContent('bank');
    }
  });

  const dismiss = () => { menu.remove(); document.removeEventListener('click', dismiss); };
  setTimeout(() => document.addEventListener('click', dismiss), 0);
}

/**
 * Opens a floating deposit-picker popover anchored to an empty bank slot,
 * listing all depositable inventory items for the player to choose from.
 * @param {HTMLElement} anchorEl       - The bank-slot element to anchor the
 *   picker next to.
 * @param {number}      bankSlotIndex  - Zero-based index of the target bank
 *   slot.
 * @returns {void}
 */
function showDepositPicker(anchorEl, bankSlotIndex) {
  document.querySelectorAll('.bank-deposit-picker').forEach(p => p.remove());
  const inventory = GameState.inventory || [];
  const pickable = inventory.map((s, i) => ({ stack: s, idx: i })).filter(({ stack }) => {
    if (!stack) return false;
    const item = ITEMS[stack.itemId];
    return !(item && item.nodrop);
  });

  if (pickable.length === 0) {
    addCombatLog('Nothing in your inventory to deposit.', 'system');
    return;
  }

  const picker = document.createElement('div');
  picker.className = 'bank-deposit-picker';
  const rect = anchorEl.getBoundingClientRect();
  picker.style.cssText = `position:fixed;left:${rect.right + 4}px;top:${rect.top}px;z-index:9999;`;
  picker.innerHTML = `<div class="picker-title">Deposit into bank</div>` +
    pickable.map(({ stack, idx }) => {
      const item = ITEMS[stack.itemId];
      const name = item ? item.name : stack.itemId;
      const icon = getItemIcon(stack.itemId);
      return `<div class="picker-row" data-inv-index="${idx}" data-item-id="${stack.itemId}">${icon} ${name}${stack.quantity > 1 ? ` x${stack.quantity}` : ''}</div>`;
    }).join('');
  document.body.appendChild(picker);

  picker.querySelectorAll('.picker-row').forEach(row => {
    row.addEventListener('click', () => {
      picker.remove();
      const invIdx = parseInt(row.dataset.invIndex, 10);
      const itemId = row.dataset.itemId;
      if (typeof depositItemToBank === 'function') {
        depositItemToBank(itemId, invIdx);
      }
    });
  });

  const dismiss = (ev) => {
    if (!picker.contains(ev.target)) {
      picker.remove();
      document.removeEventListener('click', dismiss);
    }
  };
  setTimeout(() => document.addEventListener('click', dismiss), 0);
}

// ─── City Panel ───────────────────────────────────────────────────────────────

/**
 * Renders the city panel by wiring tab-button click handlers (once) and
 * rendering the currently active tab content.
 * @returns {void}
 */
function renderCityPanel() {
  const cityPanel = document.getElementById('city-panel');
  if (!cityPanel) return;

  // Ensure correct tab is active and content rendered
  const activeBtnEl = cityPanel.querySelector('.city-tab-btn.active');
  const activeTab = activeBtnEl ? activeBtnEl.dataset.cityTab : 'bank';

  // Wire tab buttons (only once, by removing/re-adding via innerHTML replacement would reset listeners,
  // so use a flag approach)
  if (!cityPanel.dataset.tabsWired) {
    cityPanel.addEventListener('click', (e) => {
      const btn = e.target.closest('.city-tab-btn');
      if (btn) {
        cityPanel.querySelectorAll('.city-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cityPanel.querySelectorAll('.city-tab-content').forEach(c => c.style.display = 'none');
        const target = document.getElementById(`city-tab-${btn.dataset.cityTab}`);
        if (target) target.style.display = '';
        renderCityTabContent(btn.dataset.cityTab);
      }
    });
    cityPanel.dataset.tabsWired = '1';
  }

  renderCityTabContent(activeTab);
}

/**
 * Renders the content for a specific city tab into its corresponding
 * `#city-tab-{tab}` element.  Supports `"bank"`, `"market"`, `"guild"`,
 * `"players"`, and `"leaderboard"` tabs.
 * @param {string} tab - The tab identifier to render (e.g. `"bank"`).
 * @returns {void}
 */
function renderCityTabContent(tab) {
  const el = document.getElementById(`city-tab-${tab}`);
  if (!el) return;

  const fmt = typeof formatCoins === 'function' ? formatCoins : (c) => `${c}c`;

  if (tab === 'bank') {
    el.innerHTML = renderBankSlots();
    wireBankInteractions(el);
    // Wire deposit-all button
    const depositBtn = el.querySelector('#deposit-all-btn');
    if (depositBtn) {
      depositBtn.addEventListener('click', () => {
        if (typeof depositAllToBank === 'function') depositAllToBank();
        renderCityTabContent('bank');
      });
    }
    // Tooltips for bank items
    el.querySelectorAll('[data-item]').forEach(itemEl => {
      if (itemEl.dataset.item) attachTooltip(itemEl, () => getItemTooltipHTML(itemEl.dataset.item));
    });
    // Coin exchange display
    const totalCopper = ((GameState.gold || 0) * 1000) + ((GameState.silver || 0) * 100) + (GameState.copper || 0);
    const exchangeDiv = document.createElement('div');
    exchangeDiv.className = 'city-coin-exchange';
    exchangeDiv.innerHTML = `
      <div class="city-section-title">💰 Coin Purse</div>
      <div class="coin-row"><span class="gold-amount">${GameState.gold || 0}g</span> <span class="silver-amount">${GameState.silver || 0}s</span> <span class="copper-amount">${GameState.copper || 0}c</span></div>
      <div class="coin-total">Total: ${fmt(totalCopper)}</div>
    `;
    el.insertAdjacentElement('afterbegin', exchangeDiv);

  } else if (tab === 'market') {
    const vendors = typeof CITY_VENDORS !== 'undefined' ? CITY_VENDORS : [];
    const itemsForSale = vendors.map(entry => {
      const item = typeof ITEMS !== 'undefined' ? ITEMS[entry.itemId] : null;
      if (!item) return '';
      return `
        <div class="vendor-row" data-item="${entry.itemId}">
          <span class="vendor-item-name">${getItemIcon(entry.itemId)} ${item.name}</span>
          <span class="vendor-item-price">${fmt(entry.buyPrice)}</span>
          <button class="city-btn" data-buy="${entry.itemId}">Buy</button>
        </div>
      `;
    }).join('');

    // Build sell list from inventory
    const inventory = GameState.inventory || [];
    const sellRows = inventory.filter(Boolean).map(stack => {
      const item = typeof ITEMS !== 'undefined' ? ITEMS[stack.itemId] : null;
      if (!item || item.nodrop) return '';
      const vendorRef = vendors.find(v => v.itemId === stack.itemId);
      const basePrice = vendorRef ? vendorRef.buyPrice : 2;
      const sellPrice = Math.max(1, Math.floor(basePrice * 0.5));
      return `
        <div class="vendor-row">
          <span class="vendor-item-name">${getItemIcon(stack.itemId)} ${item.name}${stack.quantity > 1 ? ` x${stack.quantity}` : ''}</span>
          <span class="vendor-item-price">${fmt(sellPrice)}/ea</span>
          <button class="city-btn sell-btn" data-sell="${stack.itemId}">Sell</button>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="city-section-title">🛒 General Merchant</div>
      <div class="vendor-list">${itemsForSale || '<div class="city-empty">No items available.</div>'}</div>
      <div class="city-section-title" style="margin-top:12px">💼 Sell Items</div>
      <div class="vendor-list">${sellRows || '<div class="city-empty">Your inventory is empty.</div>'}</div>
    `;

    el.querySelectorAll('[data-buy]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof buyFromVendor === 'function') buyFromVendor(btn.dataset.buy);
        renderCityTabContent('market');
      });
    });
    el.querySelectorAll('[data-sell]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof sellToVendor === 'function') sellToVendor(btn.dataset.sell, 1);
        renderCityTabContent('market');
      });
    });
    el.querySelectorAll('[data-item]').forEach(itemEl => {
      if (itemEl.dataset.item) attachTooltip(itemEl, () => getItemTooltipHTML(itemEl.dataset.item));
    });

  } else if (tab === 'guild') {
    const char = GameState.party[GameState.inspectedCharIndex || 0];
    if (!char) {
      el.innerHTML = '<div class="city-empty">No character selected.</div>';
      return;
    }

    const guild = typeof getGuildForClass === 'function' ? getGuildForClass(char.classId) : null;

    let guildHtml = '';
    if (!guild || !guild.npc) {
      guildHtml = `<div class="guild-info"><div class="guild-no-guild">⚠ Your guild is not located in Qeynos.</div><div class="guild-hint">${guild ? guild.name : ''}</div></div>`;
    } else {
      guildHtml = `
        <div class="guild-info">
          <div class="guild-name">${guild.name}</div>
          <div class="guild-npc">Guild Master: <span class="guild-npc-name">${guild.npc}</span></div>
          <div class="guild-location">📍 ${guild.location}</div>
        </div>
      `;
    }

    const availableSpells = typeof getAvailableSpells === 'function'
      ? getAvailableSpells(char.classId, char.level)
      : [];
    const learnedSpells = GameState.learnedSpells || [];

    const spellRows = availableSpells.map(spell => {
      const owned = learnedSpells.includes(spell.id);
      return `
        <div class="spell-row ${owned ? 'spell-owned' : ''}">
          <div class="spell-info">
            <div class="spell-name">${spell.name} ${owned ? '✓' : ''}</div>
            <div class="spell-meta">Lv.${spell.level} · ${spell.manaCost > 0 ? spell.manaCost + ' MP' : 'No mana'}</div>
          </div>
          <div class="spell-purchase">
            <span class="spell-price">${fmt(spell.buyPrice)}</span>
            ${owned ? '' : `<button class="city-btn" data-buy-spell="${spell.id}">Buy</button>`}
          </div>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      ${guildHtml}
      <div class="city-section-title" style="margin-top:12px">📜 Spells Available</div>
      ${spellRows || '<div class="city-empty">No spells available for your class and level.</div>'}
    `;

    el.querySelectorAll('[data-buy-spell]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof buySpell === 'function') buySpell(btn.dataset.buySpell);
        renderCityTabContent('guild');
      });
    });

  } else if (tab === 'players') {
    const listings = typeof getMarketListings === 'function' ? getMarketListings() : [];
    const fmt2 = typeof formatCoins === 'function' ? formatCoins : (c) => `${c}c`;

    if (!listings.length) {
      el.innerHTML = '<div class="city-empty">No player listings available yet.</div>';
      return;
    }

    const rows = listings.map(listing => {
      const color = (typeof CLASS_COLORS !== 'undefined' && CLASS_COLORS[listing.sellerClass]) || '#e8d5a0';
      const icon  = (typeof CLASS_ICONS  !== 'undefined' && CLASS_ICONS[listing.sellerClass])  || '⚔';
      return `
        <div class="market-listing" data-listing-id="${listing.id}">
          <span class="market-seller" style="color:${color}">${icon} ${listing.seller}</span>
          <span class="market-item-name">${listing.itemName}</span>
          <span class="market-qty">x${listing.qty}</span>
          <span class="market-price">${fmt2(listing.price * listing.qty)}</span>
          <button class="city-btn market-buy-btn" data-listing="${listing.id}">Buy</button>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="city-section-title">👥 Player Marketplace</div>
      <div class="market-hint">Ghost player listings — prices vary 80–150% of vendor price.</div>
      <div class="market-listing-header">
        <span>Seller</span><span>Item</span><span>Qty</span><span>Price</span><span></span>
      </div>
      ${rows}
    `;

    el.querySelectorAll('.market-buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const listingId = parseInt(btn.dataset.listing, 10);
        const currentListings = typeof getMarketListings === 'function' ? getMarketListings() : [];
        const listing   = currentListings.find(l => l.id === listingId);
        if (!listing) return;

        const totalCost = listing.price * listing.qty;
        const total = ((GameState.gold || 0) * 1000) + ((GameState.silver || 0) * 100) + (GameState.copper || 0);
        if (total < totalCost) {
          if (typeof addCombatLog === 'function') addCombatLog(`Not enough coin to buy ${listing.itemName} (${fmt2(totalCost)}).`, 'system');
          return;
        }

        // Deduct cost
        let remaining = total - totalCost;
        GameState.gold   = Math.floor(remaining / 1000);
        remaining %= 1000;
        GameState.silver = Math.floor(remaining / 100);
        GameState.copper = remaining % 100;

        // Add item to inventory
        if (typeof addToInventory === 'function') {
          addToInventory(listing.itemId, listing.qty);
        }

        // Remove listing
        const newListings = currentListings.filter(l => l.id !== listingId);
        if (typeof setMarketListings === 'function') setMarketListings(newListings);

        if (typeof addCombatLog === 'function') addCombatLog(`Purchased ${listing.itemName} x${listing.qty} from ${listing.seller} for ${fmt2(totalCost)}.`, 'loot');
        if (typeof renderTopBar === 'function') renderTopBar();
        if (typeof updateInventoryUI === 'function') updateInventoryUI();

        renderCityTabContent('players');
      });
    });

  } else if (tab === 'leaderboard') {
    const data = typeof getLeaderboardData === 'function' ? getLeaderboardData() : [];

    if (!data.length) {
      el.innerHTML = '<div class="city-empty">No ranking data available.</div>';
      return;
    }

    const rows = data.map((entry, i) => {
      const color = (typeof CLASS_COLORS !== 'undefined' && CLASS_COLORS[entry.classId]) || '#e8d5a0';
      const icon  = (typeof CLASS_ICONS  !== 'undefined' && CLASS_ICONS[entry.classId])  || '⚔';
      const zone  = (typeof ZONES !== 'undefined' && ZONES[entry.zone]) ? ZONES[entry.zone].name : entry.zone;
      const name  = entry.isPlayer ? `[YOU] ${entry.name}` : entry.name;
      const rowClass = entry.isPlayer ? 'leaderboard-you' : '';
      const partyIconsHtml = (entry.party && entry.party.length)
        ? entry.party.map(m => {
            const ic  = (typeof CLASS_ICONS  !== 'undefined' && CLASS_ICONS[m.classId])  || '⚔';
            const col = (typeof CLASS_COLORS !== 'undefined' && CLASS_COLORS[m.classId]) || '#e8d5a0';
            return `<span style="color:${col}" title="${m.classId}">${ic}</span>`;
          }).join('')
        : `<span style="color:${color}">${icon}</span>`;
      return `<tr class="${rowClass}">
        <td>${i + 1}</td>
        <td style="color:${color}">${name}</td>
        <td><span class="party-icons">${partyIconsHtml}</span></td>
        <td>${entry.level}</td>
        <td>${entry.kills.toLocaleString()}</td>
        <td>${zone}</td>
      </tr>`;
    }).join('');

    el.innerHTML = `
      <div class="city-section-title">🏆 World Rankings — Top 20</div>
      <table class="leaderboard-table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Party</th><th>Level</th><th>Kills</th><th>Zone</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }
}

// ─── Module Export ────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  showCharacterCreation,
  hideCharacterCreation,
  initMainUI,
  updateCombatUI,
  updatePartyUI,
  updateInventoryUI,
  updateKillCountUI,
  addCombatLog,
  addLoot,
  clearLootDisplay,
  showDamageNumber,
  showLevelUpEffect,
  renderEnemySelector,
  updateGameTime,
  showOfflineProgressModal,
  renderInventoryPanel,
  renderCarrySlots,
  renderBagSlots,
  renderBagContents,
  renderBankSlots,
  wireBankInteractions,
  renderCityPanel,
  renderCityTabContent,
  renderMonsterLogPanel,
  getItemIcon,
  equipItemOnMember,
  unequipItem,
  showItemContextMenu,
  showUnequipContextMenu,
};
