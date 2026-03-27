// ui.js — DOM rendering and UI updates for Forever RPG

// ─── Character Creation UI ────────────────────────────────────────────────────

function showCharacterCreation() {
  document.getElementById('creation-overlay').style.display = 'flex';
  renderCreationSlots();

  const beginBtn = document.getElementById('begin-adventure-btn');
  if (beginBtn) {
    beginBtn.onclick = handleBeginAdventure;
  }
}

function hideCharacterCreation() {
  document.getElementById('creation-overlay').style.display = 'none';
}

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

  initTooltips();
  restorePanelPositions();
  initDraggablePanels();
  updateGameClock();

  if (typeof renderWhoOnlinePanel === 'function') renderWhoOnlinePanel();

  if (GameState.selectedEnemyId) {
    selectEnemy(GameState.selectedEnemyId);
    updateEnemyDisplay();
  }
}

// ─── Panel Rendering ──────────────────────────────────────────────────────────

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

function renderZonePanel() {
  const minimapEl = document.getElementById('zone-minimap');
  if (minimapEl) {
    const zone = ZONES[GameState.zone];
    if (zone && zone.minimapSVG) {
      minimapEl.innerHTML = zone.minimapSVG;
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
  if (typeof updateCombatUI === 'function') updateCombatUI();
  if (typeof refreshZonePlayers === 'function') refreshZonePlayers();
}

function renderPartyPanel() {
  const rosterEl = document.getElementById('party-roster');
  if (!rosterEl) return;
  rosterEl.innerHTML = '';

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

      slot.innerHTML = `
        <div class="party-member" data-char-id="${member.id}" data-index="${i}">
          <div class="member-portrait">${portrait}</div>
          <div class="member-info">
            <div class="member-name ${member.isAlive ? '' : 'dead'}">${member.name}</div>
            <div class="member-class">${cls ? cls.icon + ' ' + cls.name : ''} Lv.${member.level}</div>
            <div class="member-bars">
              <div class="bar-container">
                <div class="bar hp-bar" style="width:${hpPct}%"></div>
                <span class="bar-text">${member.hp}/${member.maxHP}</span>
              </div>
              ${member.maxMana > 0 ? `
              <div class="bar-container">
                <div class="bar mana-bar" style="width:${manaPct}%"></div>
                <span class="bar-text">${member.mana}/${member.maxMana}</span>
              </div>` : ''}
            </div>
          </div>
        </div>
      `;

      slot.querySelector('.party-member').addEventListener('click', () => {
        GameState.inspectedCharIndex = i;
        renderCharacterInspectPanel();
        renderStatsPanel();
        renderEquipmentPanel();
        renderSpellsPanel();
      });

      attachTooltip(slot, () => getMemberTooltipHTML(member));
    } else {
      slot.innerHTML = `<div class="empty-slot">[ Empty Slot ]</div>`;
    }

    rosterEl.appendChild(slot);
  }
}

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

function renderCombatPanel() {
  renderCombatLog();
  updateEnemyDisplay();
}

function renderCombatLog() {
  const logEl = document.getElementById('combat-log');
  if (!logEl) return;

  const log = GameState.combatLog || [];
  logEl.innerHTML = log.slice(-15).map(entry =>
    `<div class="log-entry log-${entry.type || 'info'}">${entry.text}</div>`
  ).join('');

  logEl.scrollTop = logEl.scrollHeight;
}

function updateEnemyDisplay() {
  const enemy = GameState.currentEnemy;
  const spriteEl = document.getElementById('enemy-sprite');
  const nameEl = document.getElementById('enemy-name');
  const hpBarEl = document.getElementById('enemy-hp-bar');
  const hpTextEl = document.getElementById('enemy-hp-text');
  const statusEl = document.getElementById('enemy-status');

  if (!enemy) {
    if (spriteEl) spriteEl.innerHTML = '<div class="no-enemy">Select an enemy to fight</div>';
    if (nameEl) nameEl.textContent = '';
    if (hpBarEl) hpBarEl.style.width = '0%';
    if (hpTextEl) hpTextEl.textContent = '';
    return;
  }

  if (spriteEl) spriteEl.innerHTML = getLargeSprite(enemy.id);
  if (nameEl) {
    const highestLevel = GameState.party
      ? Math.max(...GameState.party.filter(m => m && m.isAlive).map(m => m.level), 1)
      : 1;
    const con = getConColor(highestLevel, enemy.level);
    nameEl.innerHTML = `<span class="con-dot con-${con.color}" title="${con.label}">●</span> <span class="enemy-level">[Lv.${enemy.level}]</span> ${enemy.name}`;
  }

  if (hpBarEl) {
    const pct = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHP) * 100));
    hpBarEl.style.width = pct + '%';
  }
  if (hpTextEl) hpTextEl.textContent = `${Math.max(0, enemy.hp)} / ${enemy.maxHP}`;

  if (statusEl && enemy.statusEffects) {
    statusEl.innerHTML = enemy.statusEffects.map(e =>
      `<span class="effect-tag">${e.type}</span>`
    ).join('');
  }
}

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

  el.innerHTML = stats.map(stat => {
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

  el.querySelectorAll('.stat-row').forEach(row => {
    const stat = row.dataset.stat;
    attachTooltip(row, () => getStatTooltipHTML(stat));
  });
}

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

  el.innerHTML = `<div class="equip-grid">` + slots.map(([slotId, label]) => {
    const itemId = member.equipment ? member.equipment[slotId] : null;
    const item = itemId ? ITEMS[itemId] : null;
    const rarityClass = item ? `rarity-${item.rarity}` : '';

    return `<div class="equip-slot ${rarityClass}" data-slot="${slotId}" data-item="${itemId || ''}">
      <div class="equip-slot-label">${label}</div>
      <div class="equip-slot-item">${item ? item.name : '—'}</div>
    </div>`;
  }).join('') + '</div>';

  el.querySelectorAll('.equip-slot[data-item]').forEach(slotEl => {
    const itemId = slotEl.dataset.item;
    if (itemId) {
      attachTooltip(slotEl, () => getItemTooltipHTML(itemId));
    }
  });
}

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

function addCombatLog(text, type) {
  if (!GameState.combatLog) GameState.combatLog = [];
  GameState.combatLog.push({ text, type: type || 'info', time: Date.now() });
  if (GameState.combatLog.length > 100) {
    GameState.combatLog = GameState.combatLog.slice(-100);
  }
  renderCombatLog();
}

function addLoot(itemId, quantity) {
  renderLootPanel([{ itemId, quantity }]);
}

// ─── Game Clock ───────────────────────────────────────────────────────────────

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

function updateCombatUI() {
  renderCombatLog();
  updateEnemyDisplay();
  updatePartyUI();
  renderTopBar();
  if (typeof updateStopButtonState === 'function') updateStopButtonState();
}

function updatePartyUI() {
  renderPartyPanel();
  if (GameState.inspectedCharIndex !== undefined) {
    renderCharacterInspectPanel();
    renderStatsPanel();
  }
}

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

function updateKillCountUI() {
  renderKillCountPanel();
}

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

function handleImportSave() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'flex';
}

// ─── Inventory Panel ──────────────────────────────────────────────────────────

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

  const depositBtn = panel.querySelector('#deposit-all-btn');
  if (depositBtn) {
    depositBtn.addEventListener('click', () => {
      if (typeof depositAllToBank === 'function') depositAllToBank();
    });
  }
}

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

function renderBankSlots() {
  const bank = GameState.bank || [];
  const BANK_SLOTS = 100;
  const slots = [];
  for (let i = 0; i < BANK_SLOTS; i++) {
    const stack = bank[i];
    if (stack) {
      const item = ITEMS[stack.itemId];
      const rarityClass = item ? `rarity-${item.rarity}` : '';
      slots.push(`
        <div class="inv-slot filled ${rarityClass}" data-item="${stack.itemId}" data-bank-slot="${i}">
          <div class="inv-slot-icon">${getItemIcon(stack.itemId)}</div>
          <div class="inv-slot-count">${stack.quantity > 1 ? stack.quantity : ''}</div>
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

// ─── City Panel ───────────────────────────────────────────────────────────────

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

function renderCityTabContent(tab) {
  const el = document.getElementById(`city-tab-${tab}`);
  if (!el) return;

  const fmt = typeof formatCoins === 'function' ? formatCoins : (c) => `${c}c`;

  if (tab === 'bank') {
    el.innerHTML = renderBankSlots();
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
  renderCityPanel,
  renderCityTabContent,
  getItemIcon,
};
