// drag.js — HTML5 Drag and Drop for Forever RPG inventory

// Drag state
let _dragSource = null; // { area: 'carry'|'bag'|'bank', index: number, bagIndex?: number, bagSlot?: number }

/**
 * Called after any inventory render to wire drag-and-drop handlers
 * onto all inventory slot elements inside the given container.
 * @param {HTMLElement} container
 */
function wireInventoryDragDrop(container) {
  if (!container) return;

  // ── Sources ──────────────────────────────────────────────────────────────

  // Carry slots
  container.querySelectorAll('#inv-tab-carry .inv-slot.filled').forEach(el => {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', e => {
      _dragSource = { area: 'carry', index: parseInt(el.dataset.slotIndex, 10) };
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(_dragSource));
      el.classList.add('drag-source');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('drag-source');
      document.querySelectorAll('.drag-over').forEach(t => t.classList.remove('drag-over'));
    });
  });

  // Bag slots
  container.querySelectorAll('.bag-contents-grid .inv-slot.filled').forEach(el => {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', e => {
      _dragSource = {
        area: 'bag',
        bagIndex: parseInt(el.dataset.bagIndex, 10),
        bagSlot: parseInt(el.dataset.bagSlot, 10),
      };
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(_dragSource));
      el.classList.add('drag-source');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('drag-source');
      document.querySelectorAll('.drag-over').forEach(t => t.classList.remove('drag-over'));
    });
  });

  // Bank slots (filled)
  container.querySelectorAll('.bank-slot-filled').forEach(el => {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', e => {
      _dragSource = { area: 'bank', index: parseInt(el.dataset.bankSlot, 10) };
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(_dragSource));
      el.classList.add('drag-source');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('drag-source');
      document.querySelectorAll('.drag-over').forEach(t => t.classList.remove('drag-over'));
    });
  });

  // ── Targets ──────────────────────────────────────────────────────────────

  // All carry slots (empty or filled)
  container.querySelectorAll('#inv-tab-carry .inv-slot').forEach(el => {
    el.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const destIndex = parseInt(el.dataset.slotIndex, 10);
      handleDrop({ area: 'carry', index: destIndex });
    });
  });

  // All bag content slots
  container.querySelectorAll('.bag-contents-grid .inv-slot').forEach(el => {
    el.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      handleDrop({
        area: 'bag',
        bagIndex: parseInt(el.dataset.bagIndex, 10),
        bagSlot: parseInt(el.dataset.bagSlot, 10),
      });
    });
  });

  // Bank slots (empty or filled)
  container.querySelectorAll('.bank-slot, .bank-slot-filled').forEach(el => {
    el.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      handleDrop({ area: 'bank', index: parseInt(el.dataset.bankSlot, 10) });
    });
  });
}

/**
 * Executes the move between drag source and drop target.
 * @param {{ area: string, index?: number, bagIndex?: number, bagSlot?: number }} dest
 */
function handleDrop(dest) {
  if (!_dragSource) return;
  const src = _dragSource;
  _dragSource = null;

  // Same slot — no-op
  if (src.area === dest.area) {
    if (src.area === 'carry' && src.index === dest.index) return;
    if (src.area === 'bank'  && src.index === dest.index) return;
    if (src.area === 'bag'   && src.bagIndex === dest.bagIndex && src.bagSlot === dest.bagSlot) return;
  }

  // Get source item
  let srcStack = null;
  if (src.area === 'carry') {
    srcStack = (GameState.inventory || [])[src.index];
  } else if (src.area === 'bag') {
    srcStack = ((GameState.bagContents || [{}])[src.bagIndex] || {})[src.bagSlot];
  } else if (src.area === 'bank') {
    srcStack = (GameState.bank || [])[src.index];
  }
  if (!srcStack) return;

  // Get destination item (may be null for empty slot)
  let destStack = null;
  if (dest.area === 'carry') {
    destStack = (GameState.inventory || [])[dest.index] || null;
  } else if (dest.area === 'bag') {
    destStack = ((GameState.bagContents || [{}])[dest.bagIndex] || {})[dest.bagSlot] || null;
  } else if (dest.area === 'bank') {
    destStack = (GameState.bank || [])[dest.index] || null;
  }

  // Perform the swap (works for both empty-to-filled and filled-to-filled)
  _setSlot(src, destStack);
  _setSlot(dest, srcStack);

  if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
}

function _setSlot(slot, value) {
  if (slot.area === 'carry') {
    if (!GameState.inventory) GameState.inventory = [];
    GameState.inventory[slot.index] = value === null ? null : value;
  } else if (slot.area === 'bag') {
    if (!GameState.bagContents) GameState.bagContents = [{}, {}, {}, {}];
    if (!GameState.bagContents[slot.bagIndex]) GameState.bagContents[slot.bagIndex] = {};
    if (value === null) {
      delete GameState.bagContents[slot.bagIndex][slot.bagSlot];
    } else {
      GameState.bagContents[slot.bagIndex][slot.bagSlot] = value;
    }
  } else if (slot.area === 'bank') {
    if (!GameState.bank) GameState.bank = [];
    GameState.bank[slot.index] = value;
  }
}
