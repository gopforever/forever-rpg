// tradeskills-ui.js — Tradeskills City Tab UI for Forever RPG

'use strict';

// ─── State ────────────────────────────────────────────────────────────────────

let _tsSelectedDiscipline = 'blacksmithing';
let _tsProgressRafId = null;

// ─── Tab Entry Point ──────────────────────────────────────────────────────────

/**
 * Builds the full tradeskills tab HTML and wires up events.
 * Called when the Tradeskills city tab is clicked.
 */
function renderTradeskillsTab() {
  const el = document.getElementById('city-tab-tradeskills');
  if (!el) return;

  const char = _getTSActiveChar();
  if (!char) {
    el.innerHTML = '<div class="city-empty">No active party member.</div>';
    return;
  }

  if (typeof initTradeskills === 'function') initTradeskills(char);

  el.innerHTML = `
    <div class="tradeskills-root">
      ${_buildDisciplineSelector(char)}
      ${_buildSkillBar(char)}
      <div class="tradeskills-columns">
        <div class="tradeskills-recipe-col">
          <div class="city-section-title">📋 Recipes — ${TRADESKILL_DISCIPLINES[_tsSelectedDiscipline].name}</div>
          <div class="tradeskills-recipe-grid" id="ts-recipe-grid"></div>
        </div>
        <div class="tradeskills-queue-col">
          <div class="city-section-title">⚙️ Active Crafting Queue</div>
          <div class="tradeskills-queue-panel" id="ts-queue-panel"></div>
        </div>
      </div>
    </div>
  `;

  renderRecipeList(_tsSelectedDiscipline);
  renderCraftQueue(char);
  _wireDisciplineButtons(el, char);
  _startProgressAnimation();
}

// ─── Discipline Selector ──────────────────────────────────────────────────────

function _buildDisciplineSelector(char) {
  const buttons = Object.entries(TRADESKILL_DISCIPLINES).map(([id, disc]) => {
    const level = typeof getTradeskillLevel === 'function'
      ? getTradeskillLevel(char, id) : 1;
    const active = id === _tsSelectedDiscipline ? ' active' : '';
    return `<button class="tradeskills-discipline-btn${active}" data-ts-disc="${id}" title="${disc.name} — Level ${level}">
      <span class="ts-disc-icon">${disc.icon}</span>
      <span class="ts-disc-name">${disc.name}</span>
      <span class="ts-disc-level">Lv ${level}</span>
    </button>`;
  }).join('');
  return `<div class="tradeskills-discipline-selector">${buttons}</div>`;
}

function _wireDisciplineButtons(container, char) {
  container.querySelectorAll('[data-ts-disc]').forEach(btn => {
    btn.addEventListener('click', () => {
      _tsSelectedDiscipline = btn.dataset.tsDisc;
      // Update active state
      container.querySelectorAll('[data-ts-disc]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Update skill bar
      const barEl = container.querySelector('#ts-skill-bar-container');
      if (barEl) barEl.outerHTML = _buildSkillBar(char);
      // Re-render recipes
      const titleEl = container.querySelector('.tradeskills-recipe-col .city-section-title');
      if (titleEl) titleEl.textContent = `📋 Recipes — ${TRADESKILL_DISCIPLINES[_tsSelectedDiscipline].name}`;
      renderRecipeList(_tsSelectedDiscipline);
    });
  });
}

// ─── Skill Bar ────────────────────────────────────────────────────────────────

function _buildSkillBar(char) {
  const disc = TRADESKILL_DISCIPLINES[_tsSelectedDiscipline];
  const ts = char.tradeskills && char.tradeskills[_tsSelectedDiscipline];
  const level = (ts && ts.level) || 1;
  const xp = (ts && ts.xp) || 0;
  const xpNeeded = typeof getTradeskillXpForLevel === 'function'
    ? getTradeskillXpForLevel(level + 1) : (level * level * 10);
  const pct = xpNeeded > 0 ? Math.min(100, Math.floor((xp / xpNeeded) * 100)) : 0;

  return `<div class="tradeskills-skill-bar" id="ts-skill-bar-container">
    <span class="ts-skill-label">${disc.icon} ${disc.name}</span>
    <span class="ts-skill-level">Level <strong>${level}</strong> / ${disc.maxLevel}</span>
    <div class="tradeskills-xp-track">
      <div class="tradeskills-xp-fill" style="width:${pct}%"></div>
    </div>
    <span class="ts-skill-xp">${xp.toLocaleString()} / ${xpNeeded.toLocaleString()} XP (${pct}%)</span>
  </div>`;
}

// ─── Recipe List ──────────────────────────────────────────────────────────────

/**
 * Render recipe cards for a discipline into #ts-recipe-grid.
 * @param {string} discipline
 */
function renderRecipeList(discipline) {
  const grid = document.getElementById('ts-recipe-grid');
  if (!grid) return;
  const char = _getTSActiveChar();
  if (!char) { grid.innerHTML = '<div class="city-empty">No party member.</div>'; return; }

  const recipes = (typeof TRADESKILL_RECIPES !== 'undefined' ? TRADESKILL_RECIPES : [])
    .filter(r => r.discipline === discipline);

  if (!recipes.length) {
    grid.innerHTML = '<div class="city-empty">No recipes available.</div>';
    return;
  }

  grid.innerHTML = recipes.map(r => _buildRecipeCard(char, r)).join('');

  // Wire craft buttons
  grid.querySelectorAll('[data-ts-craft]').forEach(btn => {
    btn.addEventListener('click', () => {
      const recipeId = btn.dataset.tsCraft;
      const qtyInput = btn.closest('.tradeskills-recipe-card').querySelector('.ts-qty-input');
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      startCraftUI(char, recipeId, qty);
    });
  });

  // Wire mastery badge tooltips
  grid.querySelectorAll('[data-ts-mastery-info]').forEach(badge => {
    badge.addEventListener('click', e => {
      e.stopPropagation();
      _showMasteryTooltip(badge);
    });
  });
}

function _buildRecipeCard(char, recipe) {
  const masteryLevel = typeof getMasteryLevel === 'function' ? getMasteryLevel(char, recipe.id) : 0;
  const skillLevel = typeof getTradeskillLevel === 'function' ? getTradeskillLevel(char, recipe.discipline) : 1;
  const isTrivial = skillLevel >= recipe.trivialLevel;
  const canCraft = typeof hasIngredients === 'function' ? hasIngredients(char, recipe, 1) : false;
  const disc = TRADESKILL_DISCIPLINES[recipe.discipline];

  const inputsHtml = recipe.inputs.map(inp => {
    const item = typeof getTSItem === 'function' ? getTSItem(inp.itemId) : null;
    const have = _getTSInvCount(char, inp.itemId);
    const enough = have >= inp.qty;
    const icon = item ? (item.icon || '📦') : '📦';
    const name = item ? item.name : inp.itemId;
    return `<span class="ts-ingredient${enough ? '' : ' ts-ingredient-missing'}" title="${name}: have ${have}, need ${inp.qty}">
      ${icon} ${name} ×${inp.qty}${enough ? '' : ` <em>(have ${have})</em>`}
    </span>`;
  }).join('');

  const outputItem = typeof getTSItem === 'function' ? getTSItem(recipe.output.itemId) : null;
  const outputIcon = outputItem ? (outputItem.icon || '📦') : '📦';
  const outputName = outputItem ? outputItem.name : recipe.output.itemId;

  const masteryBonusesList = Object.entries(recipe.masteryBonuses || {}).map(([threshold, bonus]) => {
    const parts = [];
    if (bonus.bonusYieldChance) parts.push(`+${(bonus.bonusYieldChance * 100).toFixed(0)}% bonus yield`);
    if (bonus.actionTimeReduction) parts.push(`${(bonus.actionTimeReduction * 100).toFixed(0)}% faster`);
    if (bonus.neverFails) parts.push('Never fails');
    return `Mastery ${threshold}: ${parts.join(', ')}`;
  }).join('\n');

  const trivialBadge = isTrivial
    ? `<span class="ts-trivial-badge" title="No skill XP gained — recipe is trivial at your level">✓ Trivial</span>`
    : '';

  return `<div class="tradeskills-recipe-card${isTrivial ? ' ts-trivial' : ''}">
    <div class="ts-card-header">
      <span class="ts-card-name">${disc.icon} ${recipe.name}</span>
      <span class="tradeskills-mastery-badge" data-ts-mastery-info="${recipe.id}" title="${masteryBonusesList}">
        M${masteryLevel}
      </span>
      ${trivialBadge}
    </div>
    <div class="ts-card-desc">${recipe.description}</div>
    <div class="ts-card-ingredients">
      <span class="ts-label">Requires: </span>${inputsHtml}
    </div>
    <div class="ts-card-output">
      <span class="ts-label">Produces: </span>
      <span class="ts-output">${outputIcon} ${outputName} ×${recipe.output.qty}</span>
    </div>
    <div class="ts-card-meta">
      <span class="ts-trivial-level" title="Trivial at level ${recipe.trivialLevel}">Trivial: ${recipe.trivialLevel}</span>
      <span class="ts-action-time">⏱ ${(recipe.actionTime / 1000).toFixed(1)}s</span>
      <span class="ts-xp-badge">+${recipe.skillXp} XP</span>
    </div>
    <div class="ts-card-actions">
      <input type="number" class="ts-qty-input" value="1" min="1" max="999" title="Quantity">
      <button class="ts-craft-btn${canCraft ? '' : ' ts-craft-disabled'}" data-ts-craft="${recipe.id}"${canCraft ? '' : ' disabled'}>
        ⚒️ Craft
      </button>
    </div>
  </div>`;
}

function _showMasteryTooltip(badge) {
  const recipeId = badge.dataset.tsMasteryInfo;
  const recipe = (typeof TRADESKILL_RECIPES !== 'undefined' ? TRADESKILL_RECIPES : [])
    .find(r => r.id === recipeId);
  if (!recipe) return;

  const existing = document.getElementById('ts-mastery-popup');
  if (existing) existing.remove();

  const bonuses = Object.entries(recipe.masteryBonuses || {}).map(([threshold, bonus]) => {
    const parts = [];
    if (bonus.bonusYieldChance) parts.push(`+${(bonus.bonusYieldChance * 100).toFixed(0)}% bonus yield chance`);
    if (bonus.actionTimeReduction) parts.push(`${(bonus.actionTimeReduction * 100).toFixed(0)}% faster crafting`);
    if (bonus.neverFails) parts.push('Never fails');
    return `<div class="ts-mastery-row"><strong>Mastery ${threshold}:</strong> ${parts.join(', ')}</div>`;
  }).join('');

  const popup = document.createElement('div');
  popup.id = 'ts-mastery-popup';
  popup.className = 'ts-mastery-popup';
  popup.innerHTML = `<div class="ts-mastery-popup-title">${recipe.name} — Mastery Bonuses</div>${bonuses}
    <div class="ts-mastery-popup-close" id="ts-mastery-popup-close">✕</div>`;
  document.body.appendChild(popup);

  const rect = badge.getBoundingClientRect();
  popup.style.top = (rect.bottom + window.scrollY + 4) + 'px';
  popup.style.left = Math.max(4, rect.left + window.scrollX - 80) + 'px';

  const close = () => popup.remove();
  document.getElementById('ts-mastery-popup-close').addEventListener('click', close);
  setTimeout(() => document.addEventListener('click', function once(e) {
    if (!popup.contains(e.target)) { popup.remove(); }
    document.removeEventListener('click', once);
  }), 10);
}

// ─── Craft Queue Panel ────────────────────────────────────────────────────────

/**
 * Render the active craft queue panel.
 * @param {object} character
 */
function renderCraftQueue(character) {
  const panel = document.getElementById('ts-queue-panel');
  if (!panel) return;
  if (!character || !character.tradeskills) {
    panel.innerHTML = '<div class="ts-queue-empty">No active crafts.</div>';
    return;
  }

  const queue = character.tradeskills.craftQueue || [];
  if (!queue.length) {
    panel.innerHTML = '<div class="ts-queue-empty">Queue is empty. Start crafting a recipe!</div>';
    return;
  }

  panel.innerHTML = queue.map((entry, idx) => {
    const recipe = (typeof TRADESKILL_RECIPES !== 'undefined' ? TRADESKILL_RECIPES : [])
      .find(r => r.id === entry.recipeId);
    if (!recipe) return '';
    const speed = typeof getCraftingSpeed === 'function' ? getCraftingSpeed(character, recipe) : recipe.actionTime;
    const elapsed = Date.now() - entry.startTime;
    const currentActionElapsed = elapsed % speed;
    const pct = Math.min(100, Math.floor((currentActionElapsed / speed) * 100));
    const remaining = entry.quantity - entry.completedCount;
    const disc = TRADESKILL_DISCIPLINES[recipe.discipline];

    return `<div class="tradeskills-queue-entry" data-ts-queue-idx="${idx}">
      <div class="ts-queue-header">
        <span class="ts-queue-name">${disc.icon} ${recipe.name}</span>
        <span class="ts-queue-count">${entry.completedCount} / ${entry.quantity} crafted</span>
        <button class="ts-cancel-btn" data-ts-cancel="${idx}" title="Cancel and lose remaining queued crafts">✕</button>
      </div>
      <div class="tradeskills-progress-bar" data-ts-progress="${idx}">
        <div class="ts-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="ts-queue-meta">
        <span>${remaining} remaining</span>
        <span>${(speed / 1000).toFixed(1)}s per craft</span>
      </div>
    </div>`;
  }).join('');

  // Wire cancel buttons
  panel.querySelectorAll('[data-ts-cancel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.tsCancel, 10);
      character.tradeskills.craftQueue.splice(idx, 1);
      renderCraftQueue(character);
    });
  });
}

// ─── Craft Initiation ─────────────────────────────────────────────────────────

/**
 * UI-facing wrapper: start a craft, show feedback, re-render.
 * @param {object} character
 * @param {string} recipeId
 * @param {number} qty
 */
function startCraftUI(character, recipeId, qty) {
  if (typeof startCraft !== 'function') return;
  const result = startCraft(character, recipeId, qty);
  if (!result.success) {
    _showTSFeedback(result.message, 'error');
    return;
  }
  _showTSFeedback(result.message, 'success');
  renderRecipeList(_tsSelectedDiscipline);
  renderCraftQueue(character);
}

function _showTSFeedback(message, type) {
  const existing = document.getElementById('ts-feedback');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'ts-feedback';
  el.className = `ts-feedback ts-feedback-${type}`;
  el.textContent = message;
  const root = document.querySelector('.tradeskills-root');
  if (root) root.insertAdjacentElement('afterbegin', el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Progress Bar Animation ───────────────────────────────────────────────────

/**
 * Update progress bars each tick without full re-render.
 * Called from the game tick.
 */
function updateTradeskillsUI() {
  const panel = document.getElementById('ts-queue-panel');
  if (!panel || !panel.children.length) return;
  const char = _getTSActiveChar();
  if (!char || !char.tradeskills) return;

  const queue = char.tradeskills.craftQueue || [];
  queue.forEach((entry, idx) => {
    const recipe = (typeof TRADESKILL_RECIPES !== 'undefined' ? TRADESKILL_RECIPES : [])
      .find(r => r.id === entry.recipeId);
    if (!recipe) return;
    const speed = typeof getCraftingSpeed === 'function' ? getCraftingSpeed(char, recipe) : recipe.actionTime;
    const elapsed = Date.now() - entry.startTime;
    const currentActionElapsed = elapsed % speed;
    const pct = Math.min(100, (currentActionElapsed / speed) * 100);

    const fill = panel.querySelector(`[data-ts-progress="${idx}"] .ts-progress-fill`);
    if (fill) fill.style.width = pct.toFixed(1) + '%';

    const countEl = panel.querySelector(`[data-ts-queue-idx="${idx}"] .ts-queue-count`);
    if (countEl) countEl.textContent = `${entry.completedCount} / ${entry.quantity} crafted`;
  });

  // If queue length changed, full re-render
  const renderedEntries = panel.querySelectorAll('.tradeskills-queue-entry').length;
  if (renderedEntries !== queue.length) {
    renderCraftQueue(char);
  }
}

function _startProgressAnimation() {
  if (_tsProgressRafId) cancelAnimationFrame(_tsProgressRafId);
  const animate = () => {
    updateTradeskillsUI();
    _tsProgressRafId = requestAnimationFrame(animate);
  };
  _tsProgressRafId = requestAnimationFrame(animate);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function _getTSActiveChar() {
  if (typeof GameState === 'undefined' || !GameState.party || !GameState.party.length) return null;
  const idx = GameState.inspectedCharIndex || 0;
  return GameState.party[idx] || GameState.party[0];
}

function _getTSInvCount(char, itemId) {
  if (!char.tradeskillInventory) return 0;
  return char.tradeskillInventory[itemId] || 0;
}

if (typeof module !== 'undefined') {
  module.exports = {
    renderTradeskillsTab,
    renderRecipeList,
    renderCraftQueue,
    startCraftUI,
    updateTradeskillsUI,
  };
}
