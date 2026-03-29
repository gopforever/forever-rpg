// gathering-ui.js — Gathering Skills City Tab UI for Forever RPG

'use strict';

// ─── State ────────────────────────────────────────────────────────────────────

let _gsSelectedSkill = 'mining';
let _gsProgressRafId = null;

// ─── Tab Entry Point ──────────────────────────────────────────────────────────

/**
 * Builds the full gathering tab HTML and wires up events.
 * Called when the Gathering city tab is clicked.
 */
function renderGatheringTab() {
  const el = document.getElementById('city-tab-gathering');
  if (!el) return;

  const char = _getGSActiveChar();
  if (!char) {
    el.innerHTML = '<div class="city-empty">No active party member.</div>';
    return;
  }

  if (typeof initGathering === 'function') initGathering(char);

  el.innerHTML = `
    <div class="tradeskills-root">
      ${_buildGSSkillSelector(char)}
      ${_buildGSSkillBar(char)}
      <div class="tradeskills-columns">
        <div class="tradeskills-recipe-col">
          <div class="city-section-title">🗺 Nodes — ${GATHERING_DISCIPLINES[_gsSelectedSkill].name}</div>
          <div class="tradeskills-recipe-grid" id="gs-node-grid"></div>
        </div>
        <div class="tradeskills-queue-col">
          <div class="city-section-title">⛏️ Active Gathering</div>
          <div class="tradeskills-queue-panel" id="gs-active-panel"></div>
        </div>
      </div>
    </div>
  `;

  _renderGSNodeList(char, _gsSelectedSkill);
  _renderGSActivePanel(char);
  _wireGSSkillButtons(el, char);
  _startGSProgressAnimation();
}

// ─── Skill Selector ───────────────────────────────────────────────────────────

function _buildGSSkillSelector(char) {
  const buttons = Object.entries(GATHERING_DISCIPLINES).map(([id, disc]) => {
    const level = typeof getGatheringLevel === 'function'
      ? getGatheringLevel(char, id) : 1;
    const active = id === _gsSelectedSkill ? ' active' : '';
    return `<button class="tradeskills-discipline-btn${active}" data-gs-skill="${id}" title="${disc.name} — Level ${level}">
      <span class="ts-disc-icon">${disc.icon}</span>
      <span class="ts-disc-name">${disc.name}</span>
      <span class="ts-disc-level">Lv ${level}</span>
    </button>`;
  }).join('');
  return `<div class="tradeskills-discipline-selector">${buttons}</div>`;
}

function _wireGSSkillButtons(container, char) {
  container.querySelectorAll('[data-gs-skill]').forEach(btn => {
    btn.addEventListener('click', () => {
      _gsSelectedSkill = btn.dataset.gsSkill;
      container.querySelectorAll('[data-gs-skill]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const barEl = container.querySelector('#gs-skill-bar-container');
      if (barEl) barEl.outerHTML = _buildGSSkillBar(char);
      const titleEl = container.querySelector('.tradeskills-recipe-col .city-section-title');
      if (titleEl) titleEl.textContent = `🗺 Nodes — ${GATHERING_DISCIPLINES[_gsSelectedSkill].name}`;
      _renderGSNodeList(char, _gsSelectedSkill);
    });
  });
}

// ─── Skill Bar ────────────────────────────────────────────────────────────────

function _buildGSSkillBar(char) {
  const disc = GATHERING_DISCIPLINES[_gsSelectedSkill];
  const gs = char.gathering && char.gathering[_gsSelectedSkill];
  const level = (gs && gs.level) || 1;
  const xp = (gs && gs.xp) || 0;
  const xpNeeded = typeof getGatheringXpForLevel === 'function'
    ? getGatheringXpForLevel(level + 1) : (level * level * 10);
  const pct = xpNeeded > 0 ? Math.min(100, Math.floor((xp / xpNeeded) * 100)) : 0;

  return `<div class="tradeskills-skill-bar" id="gs-skill-bar-container">
    <span class="ts-skill-label">${disc.icon} ${disc.name}</span>
    <span class="ts-skill-level">Level <strong>${level}</strong> / ${disc.maxLevel}</span>
    <div class="tradeskills-xp-track">
      <div class="tradeskills-xp-fill" style="width:${pct}%"></div>
    </div>
    <span class="ts-skill-xp">${xp.toLocaleString()} / ${xpNeeded.toLocaleString()} XP (${pct}%)</span>
  </div>`;
}

// ─── Node List ────────────────────────────────────────────────────────────────

/**
 * Render node cards for a skill into #gs-node-grid.
 * @param {object} character
 * @param {string} skill
 */
function _renderGSNodeList(character, skill) {
  const grid = document.getElementById('gs-node-grid');
  if (!grid) return;
  if (!character) { grid.innerHTML = '<div class="city-empty">No party member.</div>'; return; }

  const nodes = (typeof GATHERING_NODES !== 'undefined' ? GATHERING_NODES : [])
    .filter(n => n.skill === skill);

  if (!nodes.length) {
    grid.innerHTML = '<div class="city-empty">No gathering nodes available.</div>';
    return;
  }

  const level = typeof getGatheringLevel === 'function' ? getGatheringLevel(character, skill) : 1;
  const active = character.gathering && character.gathering.activeNode;

  grid.innerHTML = nodes.map(node => _buildGSNodeCard(character, node, level, active)).join('');

  // Wire gather buttons
  grid.querySelectorAll('[data-gs-gather]').forEach(btn => {
    btn.addEventListener('click', () => {
      onGatherButtonClick(character, btn.dataset.gsGather);
    });
  });

  // Wire stop button
  grid.querySelectorAll('[data-gs-stop]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof stopGathering === 'function') stopGathering(character);
      renderGatheringTab();
    });
  });
}

function _buildGSNodeCard(char, node, skillLevel, active) {
  const masteryLevel = typeof getNodeMasteryLevel === 'function'
    ? getNodeMasteryLevel(char, node.id) : 0;
  const locked = skillLevel < node.levelReq;
  const isActive = active && active.nodeId === node.id;
  const disc = GATHERING_DISCIPLINES[node.skill];

  const outputsHtml = node.outputs.map(out => {
    const icon = _getGSItemIcon(out.itemId);
    const name = _getGSItemName(out.itemId);
    return `<span class="ts-ingredient" title="${name} ×${out.qty}">${icon} ${name} ×${out.qty}</span>`;
  }).join('');

  // Build mastery bonuses display with ✅/🔒 indicators
  const masteryThresholds = Object.entries(node.masteryBonuses || {})
    .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));

  const masteryBonusesHtml = masteryThresholds.map(([threshold, bonus]) => {
    const needed = parseInt(threshold, 10);
    const active_ = masteryLevel >= needed;
    const parts = [];
    if (bonus.bonusYieldChance) parts.push(`+${(bonus.bonusYieldChance * 100).toFixed(0)}% yield`);
    if (bonus.actionTimeReduction) parts.push(`-${(bonus.actionTimeReduction * 100).toFixed(0)}% time`);
    if (bonus.neverFails) parts.push('Never fails');
    const label = parts.join(', ');
    const icon = active_ ? '✅' : '🔒';
    const cls  = active_ ? 'gs-mastery-bonus-active' : 'gs-mastery-bonus-locked';
    return `<div class="${cls}">${icon} <span class="gs-mastery-threshold">Mastery ${needed}</span>: ${label}</div>`;
  }).join('');

  const masteryPct = Math.min(100, (masteryLevel / 99) * 100).toFixed(1);

  const masteryBlockHtml = `
    <div class="gs-mastery-block">
      <div class="gs-mastery-label">Mastery: <strong>${masteryLevel}</strong> / 99</div>
      <div class="gs-mastery-track"><div class="gs-mastery-fill" style="width:${masteryPct}%"></div></div>
      ${masteryBonusesHtml}
    </div>`;

  const actionBtn = locked
    ? `<button class="ts-craft-btn ts-craft-disabled" disabled>🔒 Level ${node.levelReq} Required</button>`
    : isActive
      ? `<button class="ts-craft-btn" data-gs-stop="${node.id}">⏹ Stop</button>`
      : `<button class="ts-craft-btn" data-gs-gather="${node.id}">⛏️ Gather</button>`;

  const speed = typeof getGatheringSpeed === 'function' ? getGatheringSpeed(char, node) : node.actionTime;

  return `<div class="tradeskills-recipe-card${isActive ? ' ts-active-node' : ''}${locked ? ' ts-trivial' : ''}">
    <div class="ts-card-header">
      <span class="ts-card-name">${disc.icon} ${node.name}</span>
      <span class="tradeskills-mastery-badge">M${masteryLevel}</span>
    </div>
    <div class="ts-card-desc">${node.description}</div>
    <div class="ts-card-desc" style="color:#a0b8d0;font-size:0.85em">📍 ${node.zone}</div>
    ${masteryBlockHtml}
    <div class="ts-card-ingredients">
      <span class="ts-label">Yields: </span>${outputsHtml}
    </div>
    <div class="ts-card-meta">
      <span class="ts-trivial-level" title="Trivial at level ${node.trivialLevel}">Trivial: ${node.trivialLevel}</span>
      <span class="ts-action-time">⏱ ${(speed / 1000).toFixed(1)}s</span>
      <span class="ts-xp-badge">+${node.skillXp} XP</span>
    </div>
    <div class="ts-card-actions">${actionBtn}</div>
  </div>`;
}

// ─── Active Gathering Panel ───────────────────────────────────────────────────

/**
 * Render the active gathering status panel.
 * @param {object} character
 */
function _renderGSActivePanel(character) {
  const panel = document.getElementById('gs-active-panel');
  if (!panel) return;

  if (!character || !character.gathering || !character.gathering.activeNode) {
    panel.innerHTML = '<div class="ts-queue-empty">No active gathering. Select a node to begin!</div>';
    return;
  }

  const active = character.gathering.activeNode;
  const node = typeof getGatherNode === 'function' ? getGatherNode(active.nodeId) : null;
  if (!node) {
    panel.innerHTML = '<div class="ts-queue-empty">Unknown node. Please select a new one.</div>';
    return;
  }

  const disc = GATHERING_DISCIPLINES[node.skill];
  const speed = typeof getGatheringSpeed === 'function' ? getGatheringSpeed(character, node) : node.actionTime;
  const pct = getGatheringProgressPct(character, Date.now());

  const outputsHtml = node.outputs.map(out => {
    const icon = _getGSItemIcon(out.itemId);
    const name = _getGSItemName(out.itemId);
    return `<span class="ts-ingredient">${icon} ${name} ×${out.qty}</span>`;
  }).join(' ');

  panel.innerHTML = `
    <div class="tradeskills-queue-entry">
      <div class="ts-queue-header">
        <span class="ts-queue-name">${disc.icon} ${node.name}</span>
        <span class="ts-queue-count">📍 ${node.zone}</span>
      </div>
      <div class="tradeskills-progress-bar" id="gs-progress-bar">
        <div class="ts-progress-fill" id="gs-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="ts-queue-meta">
        <span>${outputsHtml}</span>
        <span>${(speed / 1000).toFixed(1)}s per gather</span>
      </div>
      <div class="ts-card-actions" style="margin-top:8px">
        <button class="ts-craft-btn" id="gs-stop-active-btn">⏹ Stop Gathering</button>
      </div>
    </div>
  `;

  const stopBtn = document.getElementById('gs-stop-active-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (typeof stopGathering === 'function') stopGathering(character);
      renderGatheringTab();
    });
  }
}

// ─── Gather Button Handler ────────────────────────────────────────────────────

/**
 * Called when a Gather button is clicked. Starts gathering and re-renders.
 * @param {object} character
 * @param {string} nodeId
 */
function onGatherButtonClick(character, nodeId) {
  if (typeof startGathering !== 'function') return;
  const result = startGathering(character, nodeId);
  if (!result.success) {
    _showGSFeedback(result.message, 'error');
    return;
  }
  _showGSFeedback(result.message, 'success');
  renderGatheringTab();
}

function _showGSFeedback(message, type) {
  const existing = document.getElementById('gs-feedback');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'gs-feedback';
  el.className = `ts-feedback ts-feedback-${type}`;
  el.textContent = message;
  const root = document.querySelector('.tradeskills-root');
  if (root) root.insertAdjacentElement('afterbegin', el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Progress Calculation ─────────────────────────────────────────────────────

/**
 * Returns 0-100 progress through the current gathering action.
 * @param {object} character
 * @param {number} nowMs - current timestamp in ms
 * @returns {number}
 */
function getGatheringProgressPct(character, nowMs) {
  if (!character || !character.gathering || !character.gathering.activeNode) return 0;
  const active = character.gathering.activeNode;
  const node = typeof getGatherNode === 'function' ? getGatherNode(active.nodeId) : null;
  if (!node) return 0;
  const speed = typeof getGatheringSpeed === 'function' ? getGatheringSpeed(character, node) : node.actionTime;
  const elapsed = nowMs - active.startTime;
  const currentActionElapsed = elapsed % speed;
  return Math.min(100, (currentActionElapsed / speed) * 100);
}

// ─── Progress Bar Animation ───────────────────────────────────────────────────

/**
 * Update the gathering progress bar each frame without full re-render.
 */
function updateGatheringUI() {
  const fill = document.getElementById('gs-progress-fill');
  if (!fill) return;
  const char = _getGSActiveChar();
  if (!char) return;
  const pct = getGatheringProgressPct(char, Date.now());
  fill.style.width = pct.toFixed(1) + '%';
}

function _startGSProgressAnimation() {
  if (_gsProgressRafId) cancelAnimationFrame(_gsProgressRafId);
  const animate = () => {
    updateGatheringUI();
    _gsProgressRafId = requestAnimationFrame(animate);
  };
  _gsProgressRafId = requestAnimationFrame(animate);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _getGSActiveChar() {
  if (typeof GameState === 'undefined' || !GameState.party || !GameState.party.length) return null;
  const idx = GameState.inspectedCharIndex || 0;
  return GameState.party[idx] || GameState.party[0];
}

function _getGSItemIcon(itemId) {
  if (typeof getTSItem === 'function') {
    const item = getTSItem(itemId);
    if (item) return item.icon || '📦';
  }
  return '📦';
}

function _getGSItemName(itemId) {
  if (typeof getTSItem === 'function') {
    const item = getTSItem(itemId);
    if (item) return item.name;
  }
  return itemId;
}

if (typeof module !== 'undefined') {
  module.exports = {
    renderGatheringTab,
    onGatherButtonClick,
    getGatheringProgressPct,
    updateGatheringUI,
  };
}
