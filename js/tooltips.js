let tooltipEl = null;
let tooltipTimeout = null;

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

function showTooltip(html, x, y) {
  if (!tooltipEl) initTooltips();
  tooltipEl.innerHTML = html;
  tooltipEl.style.display = 'block';
  positionTooltip(x, y);
}

function hideTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
  clearTimeout(tooltipTimeout);
}

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

if (typeof module !== 'undefined') module.exports = { initTooltips, showTooltip, hideTooltip, attachTooltip, getItemTooltipHTML, getEnemyTooltipHTML, getStatTooltipHTML, getAbilityTooltipHTML, getClassTooltipHTML };
