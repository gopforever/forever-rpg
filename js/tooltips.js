let tooltipEl = null;
let tooltipTimeout = null;

/**
 * Creates the tooltip DOM element and attaches global mouse/scroll listeners.
 * @returns {void}
 */
function initTooltips() {
  tooltipEl = document.createElement('div');
  tooltipEl.id = 'tooltip';
  tooltipEl.className = 'tooltip';
  tooltipEl.style.display = 'none';
  document.body.appendChild(tooltipEl);

  document.addEventListener('mousemove', (e) => {
    if (tooltipEl.style.display === 'block') {
      positionTooltip(e.clientX, e.clientY);
    }
  });

  document.addEventListener('scroll', hideTooltip, true);
}

/**
 * Positions the tooltip element relative to the cursor, avoiding viewport edges.
 * @param {number} x - The horizontal cursor position in client coordinates.
 * @param {number} y - The vertical cursor position in client coordinates.
 * @returns {void}
 */
function positionTooltip(x, y) {
  const ttW = tooltipEl.offsetWidth;
  const ttH = tooltipEl.offsetHeight;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  let left = x + 16;
  let top = y + 16;

  if (left + ttW > winW - 10) left = x - ttW - 10;
  if (top + ttH > winH - 10) top = y - ttH - 10;

  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = top + 'px';
}

/**
 * Sets tooltip innerHTML and makes the tooltip visible at the given coordinates.
 * @param {string} html - The HTML string to render inside the tooltip.
 * @param {number} x - The horizontal cursor position in client coordinates.
 * @param {number} y - The vertical cursor position in client coordinates.
 * @returns {void}
 */
function showTooltip(html, x, y) {
  if (!tooltipEl) initTooltips();
  tooltipEl.innerHTML = html;
  tooltipEl.style.display = 'block';
  positionTooltip(x, y);
}

/**
 * Hides the tooltip and clears any pending show timeout.
 * @returns {void}
 */
function hideTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
  clearTimeout(tooltipTimeout);
}

/**
 * Attaches mouseenter/mouseleave/mousemove handlers to an element for delayed tooltip display.
 * @param {object} element - The DOM element to attach tooltip behavior to.
 * @param {Function} getHtmlFn - A function (or HTML string) that returns the tooltip HTML.
 * @returns {void}
 */
function attachTooltip(element, getHtmlFn) {
  element.addEventListener('mouseenter', (e) => {
    tooltipTimeout = setTimeout(() => {
      const html = typeof getHtmlFn === 'function' ? getHtmlFn() : getHtmlFn;
      showTooltip(html, e.clientX, e.clientY);
    }, 300);
  });
  element.addEventListener('mouseleave', hideTooltip);
  element.addEventListener('mousemove', (e) => {
    if (tooltipEl && tooltipEl.style.display === 'block') {
      positionTooltip(e.clientX, e.clientY);
    }
  });
}

/**
 * Builds and returns the full item tooltip HTML string with stats, flags, and flavor.
 * @param {string} itemId - The key used to look up the item in the ITEMS global.
 * @returns {string} An HTML string representing the complete item tooltip.
 */
function getItemTooltipHTML(itemId) {
  const item = ITEMS[itemId];
  if (!item) return '<div class="tt-error">Unknown item</div>';

  const rarityColors = {
    common: '#ffffff',
    magic: '#5588ff',
    rare: '#ffcc00',
    named: '#ff8800'
  };
  const color = rarityColors[item.rarity] || '#ffffff';

  let html = `<div class="tt-item">`;
  html += `<div class="tt-name" style="color:${color}">${item.name}</div>`;

  if (item.lore) html += `<div class="tt-flag tt-lore">LORE</div>`;
  if (item.nodrop) html += `<div class="tt-flag tt-nodrop">NO DROP</div>`;

  if (item.slot) html += `<div class="tt-row"><span class="tt-label">Slot:</span> ${item.slot.replace(/_/g, ' ').toUpperCase()}</div>`;

  if (item.type === 'weapon') {
    html += `<div class="tt-row"><span class="tt-label">Damage:</span> ${item.dmg} <span class="tt-label">Delay:</span> ${item.delay}</div>`;
    html += `<div class="tt-row"><span class="tt-label">Type:</span> ${item.weaponType}</div>`;
    if (item.dmg && item.delay) {
      const ratio = (item.dmg / (item.delay / 10)).toFixed(2);
      html += `<div class="tt-row"><span class="tt-label">Ratio:</span> ${ratio}</div>`;
    }
  }

  if (item.ac) html += `<div class="tt-row"><span class="tt-label">AC:</span> ${item.ac}</div>`;

  if (item.stats) {
    const statMap = { STR: 'STR', DEX: 'DEX', AGI: 'AGI', STA: 'STA', WIS: 'WIS', INT: 'INT', CHA: 'CHA' };
    for (const [key, label] of Object.entries(statMap)) {
      if (item.stats[key]) html += `<div class="tt-stat">+${item.stats[key]} ${label}</div>`;
    }
  }

  if (item.resists) {
    for (const [res, val] of Object.entries(item.resists)) {
      if (val) html += `<div class="tt-stat">+${val} SV ${res.charAt(0).toUpperCase() + res.slice(1)}</div>`;
    }
  }

  if (item.effect) html += `<div class="tt-effect">Effect: ${item.effect}</div>`;

  if (item.classes && item.classes.length > 0) {
    html += `<div class="tt-classes">${item.classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</div>`;
  }

  html += `<div class="tt-weight">WT: ${item.weight || 0}</div>`;
  if (item.flavor) html += `<div class="tt-flavor">"${item.flavor}"</div>`;

  html += '</div>';
  return html;
}

/**
 * Builds the enemy tooltip HTML with level, con color, XP, and loot table.
 * @param {string} enemyId - The key used to look up the enemy in the ENEMIES global.
 * @returns {string} An HTML string representing the complete enemy tooltip.
 */
function getEnemyTooltipHTML(enemyId) {
  const enemy = ENEMIES[enemyId];
  if (!enemy) return '<div class="tt-error">Unknown enemy</div>';

  let html = `<div class="tt-enemy">`;
  html += `<div class="tt-name" style="color:${enemy.isRare ? '#ff8800' : '#e8d5a0'}">${enemy.name}</div>`;
  html += `<div class="tt-row"><span class="tt-label">Level:</span> ${enemy.level}</div>`;
  html += `<div class="tt-row"><span class="tt-label">HP:</span> ${enemy.hp} <span class="tt-label">ATK:</span> ${enemy.atk} <span class="tt-label">AC:</span> ${enemy.ac}</div>`;

  const highestLevel = (typeof GameState !== 'undefined' && GameState.party)
    ? Math.max(...GameState.party.filter(m => m && m.isAlive).map(m => m.level), 1)
    : 1;
  const con = (typeof getConColor === 'function') ? getConColor(highestLevel, enemy.level) : null;
  const zoneData = (typeof GameState !== 'undefined' && GameState.zone && typeof ZONES !== 'undefined') ? ZONES[GameState.zone] : null;
  const zoneXpMod = zoneData && zoneData.xpModifier ? zoneData.xpModifier : 1;
  const effectiveXp = con ? Math.floor(enemy.xp * zoneXpMod * con.multiplier) : enemy.xp;

  if (con) {
    html += `<div class="tt-row"><span class="tt-label">Con:</span> <span class="con-dot con-${con.color}">${con.label}</span></div>`;
    html += `<div class="tt-row"><span class="tt-label">XP:</span> ${effectiveXp} <span class="tt-muted">(base ${enemy.xp})</span></div>`;
  } else {
    html += `<div class="tt-row"><span class="tt-label">XP:</span> ${enemy.xp}</div>`;
  }

  const tags = [enemy.type];
  if (enemy.isUndead) tags.push('Undead');
  if (enemy.isRare) tags.push('Rare');
  if (enemy.magicResist) tags.push(`MR:${enemy.magicResist}%`);
  html += `<div class="tt-tags">${tags.map(t => `<span class="tt-tag">${t}</span>`).join('')}</div>`;

  if (enemy.lootTable && enemy.lootTable.length > 0) {
    html += `<div class="tt-section">Drops:</div>`;
    for (const drop of enemy.lootTable) {
      const item = ITEMS[drop.itemId];
      const pct = Math.round(drop.chance * 100);
      const rarColor = item
        ? (item.rarity === 'named' ? '#ff8800' : item.rarity === 'rare' ? '#ffcc00' : item.rarity === 'magic' ? '#5588ff' : '#aaaaaa')
        : '#aaaaaa';
      html += `<div class="tt-drop"><span style="color:${rarColor}">${item ? item.name : drop.itemId}</span> <span class="tt-chance">${pct}%</span></div>`;
    }
  }

  if (enemy.description) html += `<div class="tt-flavor">"${enemy.description}"</div>`;

  html += '</div>';
  return html;
}

/**
 * Returns tooltip HTML describing a stat (STR, DEX, AGI, etc.).
 * @param {string} statName - The stat identifier (e.g., 'STR', 'SV Magic').
 * @returns {string} An HTML string with the stat name and description.
 */
function getStatTooltipHTML(statName) {
  const statDescriptions = {
    STR: 'Strength — Increases melee damage and attack power. Affects max hit. Cap: 255.',
    DEX: 'Dexterity — Improves proc rate, skill-up rate, and critical hit chance. Archery accuracy. Cap: 255.',
    AGI: 'Agility — Contributes to Armor Class and dodge/parry chance. Below 75 AGI causes a massive AC penalty. Cap: 255.',
    STA: 'Stamina — Increases your HP pool. Each class gains different HP per STA per level. Cap: 255.',
    WIS: 'Wisdom — Mana pool for Priest and Hybrid classes (Cleric, Druid, Shaman, Paladin, etc). Cap: 255.',
    INT: 'Intelligence — Mana pool for pure Caster classes (Wizard, Magician, Necromancer, Enchanter). Cap: 255.',
    CHA: 'Charisma — Improves merchant prices and increases resistance to Charm and Mez spells. Soft cap: ~115.',
    HP: 'Hit Points — Your life force. Reaches 0 and you die.',
    Mana: 'Mana — Resource used to cast spells. Regenerates slowly over time.',
    AC: 'Armor Class — Reduces incoming melee damage. Higher is better.',
    ATK: 'Attack — Base melee attack value. Affects hit chance.',
    'SV Magic': 'Save vs Magic — Chance to resist magic-based spells and effects.',
    'SV Fire': 'Save vs Fire — Chance to resist fire-based damage and effects.',
    'SV Cold': 'Save vs Cold — Chance to resist cold-based damage and effects.',
    'SV Poison': 'Save vs Poison — Chance to resist poison effects and DoTs.',
    'SV Disease': 'Save vs Disease — Chance to resist disease effects and DoTs.',
  };

  const desc = statDescriptions[statName] || `${statName} stat.`;
  return `<div class="tt-stat-desc"><div class="tt-name" style="color:#c8a84b">${statName}</div><div class="tt-body">${desc}</div></div>`;
}

/**
 * Returns tooltip HTML for a class ability with mana, cast time, and recast info.
 * @param {object} ability - The ability object with name, manaCost, castTime, recastTime, and description.
 * @returns {string} An HTML string representing the ability tooltip.
 */
function getAbilityTooltipHTML(ability) {
  if (!ability) return '';
  let html = `<div class="tt-ability">`;
  html += `<div class="tt-name" style="color:#8844ff">${ability.name}</div>`;
  if (ability.manaCost > 0) html += `<div class="tt-row"><span class="tt-label">Mana:</span> ${ability.manaCost}</div>`;
  if (ability.castTime > 0) html += `<div class="tt-row"><span class="tt-label">Cast Time:</span> ${(ability.castTime / 1000).toFixed(1)}s</div>`;
  if (ability.recastTime > 0) html += `<div class="tt-row"><span class="tt-label">Recast:</span> ${(ability.recastTime / 1000).toFixed(1)}s</div>`;
  html += `<div class="tt-body">${ability.description}</div>`;
  html += '</div>';
  return html;
}

/**
 * Returns tooltip HTML with a class overview and description.
 * @param {string} classId - The class identifier used to look up the class in the CLASSES global.
 * @returns {string} An HTML string representing the class tooltip.
 */
function getClassTooltipHTML(classId) {
  const cls = CLASSES[classId];
  if (!cls) return '';
  let html = `<div class="tt-class">`;
  html += `<div class="tt-name" style="color:#c8a84b">${cls.icon} ${cls.name}</div>`;
  html += `<div class="tt-row"><span class="tt-label">Role:</span> ${cls.role}</div>`;
  html += `<div class="tt-row"><span class="tt-label">Archetype:</span> ${cls.archetype}</div>`;
  html += `<div class="tt-row"><span class="tt-label">Primary Stats:</span> ${cls.primaryStats.join(', ')}</div>`;
  html += `<div class="tt-row"><span class="tt-label">Mana:</span> ${cls.manaStat || 'None'}</div>`;
  html += `<div class="tt-body">${cls.description}</div>`;
  html += '</div>';
  return html;
}

/**
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
 * Builds item tooltip HTML with stat deltas compared to the currently equipped item in the same slot.
 * @param {string} itemId  - The item ID to show.
 * @param {object} [member] - The party member to compare equipment against. Falls back to inspected member.
 * @returns {string} HTML string for the tooltip with delta indicators.
 */
function getItemTooltipHTMLWithCompare(itemId, member) {
  const item = ITEMS[itemId];
  if (!item) return '<div class="tt-error">Unknown item</div>';

  // Resolve the party member for comparison
  if (!member && typeof GameState !== 'undefined' && GameState.party && GameState.party.length) {
    const idx = GameState.inspectedCharIndex || 0;
    member = GameState.party[idx];
  }

  // Find currently equipped item in same slot
  let equippedItem = null;
  if (member && member.equipment && item.slot) {
    const equippedId = member.equipment[item.slot];
    if (equippedId && typeof ITEMS !== 'undefined') equippedItem = ITEMS[equippedId];
  }

  const rarityColors = {
    common: '#ffffff', magic: '#5588ff', rare: '#ffcc00', named: '#ff8800'
  };
  const color = rarityColors[item.rarity] || '#ffffff';

  const delta = (newVal, oldVal) => {
    const d = (newVal || 0) - (oldVal || 0);
    if (d > 0) return ` <span class="tt-delta-up">(▲+${d})</span>`;
    if (d < 0) return ` <span class="tt-delta-down">(▼${d})</span>`;
    return '';
  };

  let html = `<div class="tt-item">`;
  html += `<div class="tt-name" style="color:${color}">${item.name}</div>`;

  if (!equippedItem) {
    html += `<div class="tt-compare-hint" style="color:#888;font-size:0.7em">(new slot)</div>`;
  } else {
    html += `<div class="tt-compare-hint" style="color:#888;font-size:0.7em">vs [${equippedItem.name}]</div>`;
  }

  if (item.lore) html += `<div class="tt-flag tt-lore">LORE</div>`;
  if (item.nodrop) html += `<div class="tt-flag tt-nodrop">NO DROP</div>`;

  if (item.slot) html += `<div class="tt-row"><span class="tt-label">Slot:</span> ${item.slot.replace(/_/g, ' ').toUpperCase()}</div>`;

  if (item.type === 'weapon') {
    const dmgDelta = equippedItem && equippedItem.type === 'weapon' ? delta(item.dmg, equippedItem.dmg) : (equippedItem ? '' : '');
    const delayDelta = equippedItem && equippedItem.type === 'weapon' ? delta(-(item.delay || 0), -(equippedItem.delay || 0)) : '';
    html += `<div class="tt-row"><span class="tt-label">Damage:</span> ${item.dmg}${dmgDelta} <span class="tt-label">Delay:</span> ${item.delay}${delayDelta}</div>`;
    html += `<div class="tt-row"><span class="tt-label">Type:</span> ${item.weaponType}</div>`;
    if (item.dmg && item.delay) {
      const ratio = (item.dmg / (item.delay / 10)).toFixed(2);
      html += `<div class="tt-row"><span class="tt-label">Ratio:</span> ${ratio}</div>`;
    }
  }

  if (item.ac) {
    const acDelta = equippedItem ? delta(item.ac, equippedItem.ac) : '';
    html += `<div class="tt-row"><span class="tt-label">AC:</span> ${item.ac}${acDelta}</div>`;
  }

  if (item.stats) {
    const statMap = { STR: 'STR', DEX: 'DEX', AGI: 'AGI', STA: 'STA', WIS: 'WIS', INT: 'INT', CHA: 'CHA' };
    for (const [key, label] of Object.entries(statMap)) {
      if (item.stats[key]) {
        const statDelta = equippedItem && equippedItem.stats ? delta(item.stats[key], equippedItem.stats[key]) : '';
        html += `<div class="tt-stat">+${item.stats[key]} ${label}${statDelta}</div>`;
      }
    }
  }

  if (item.resists) {
    for (const [res, val] of Object.entries(item.resists)) {
      if (val) {
        const resDelta = (equippedItem && equippedItem.resists) ? delta(val, equippedItem.resists[res] || 0) : '';
        html += `<div class="tt-stat">+${val} SV ${res.charAt(0).toUpperCase() + res.slice(1)}${resDelta}</div>`;
      }
    }
  }

  if (item.effect) html += `<div class="tt-effect">Effect: ${item.effect}</div>`;

  if (item.classes && item.classes.length > 0) {
    html += `<div class="tt-classes">${item.classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</div>`;
  }

  html += `<div class="tt-weight">WT: ${item.weight || 0}</div>`;
  if (item.flavor) html += `<div class="tt-flavor">"${item.flavor}"</div>`;

  html += '</div>';
  return html;
}

if (typeof module !== 'undefined') module.exports = { initTooltips, showTooltip, hideTooltip, attachTooltip, getItemTooltipHTML, getItemTooltipHTMLWithCompare, getEnemyTooltipHTML, getStatTooltipHTML, getAbilityTooltipHTML, getClassTooltipHTML, getMemberTooltipHTML };
