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
      zoneInfoEl.innerHTML = `
        <div class="zone-name">${zone.name}</div>
        <div class="zone-levels">Levels ${zone.levelRange[0]}-${zone.levelRange[1]}</div>
        <div class="zone-desc">${zone.description}</div>
      `;
    }
  }
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
  if (nameEl) nameEl.innerHTML = `<span class="enemy-level">[Lv.${enemy.level}]</span> ${enemy.name}`;

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
    btn.innerHTML = `
      <div class="enemy-btn-sprite">${getSprite(enemyId)}</div>
      <div class="enemy-btn-name">${enemy.name}</div>
      <div class="enemy-btn-level">Lv.${enemy.level}</div>
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
      <div class="bar-label">XP ${Math.floor(xpPct)}%</div>
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
  getItemIcon,
};
