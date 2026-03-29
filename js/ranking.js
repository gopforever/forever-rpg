// ranking.js — Standalone Rankings Page for Forever RPG
// Reads data from localStorage, renders a filterable, sortable leaderboard.

'use strict';

// ─── Class Data ───────────────────────────────────────────────────────────────

const RC_CLASS_ICONS = {
  warrior:     '⚔️',
  paladin:     '🛡️',
  shadowknight:'💀',
  ranger:      '🏹',
  rogue:       '🗡️',
  bard:        '🎵',
  monk:        '👊',
  wizard:      '🔮',
  magician:    '✨',
  enchanter:   '💫',
  necromancer: '☠️',
  cleric:      '✝️',
  druid:       '🌿',
  shaman:      '🦴',
  beastlord:   '🐾',
  berserker:   '🪓',
};

const RC_CLASS_COLORS = {
  warrior:     '#c0c0c0',
  paladin:     '#f58cba',
  shadowknight:'#8888ff',
  ranger:      '#abd473',
  rogue:       '#fff569',
  bard:        '#ff7d0a',
  monk:        '#00ff96',
  wizard:      '#40c7eb',
  magician:    '#ff8000',
  enchanter:   '#9482c9',
  necromancer: '#29a629',
  cleric:      '#ffffff',
  druid:       '#ff7d0a',
  shaman:      '#0070de',
  beastlord:   '#f4a101',
  berserker:   '#c79c6e',
};

const RC_CLASS_NAMES = {
  warrior:'Warrior', paladin:'Paladin', shadowknight:'Shadowknight',
  ranger:'Ranger', rogue:'Rogue', bard:'Bard', monk:'Monk',
  wizard:'Wizard', magician:'Magician', enchanter:'Enchanter',
  necromancer:'Necromancer', cleric:'Cleric', druid:'Druid',
  shaman:'Shaman', beastlord:'Beastlord', berserker:'Berserker',
};

// ─── Personality Data ─────────────────────────────────────────────────────────

const RC_PERSONALITY_ICONS = {
  grinder:'⚔️', socialite:'💬', loner:'🌑', merchant:'💰',
  veteran:'🧙', newbie:'🌱', hardcore:'💪', roleplayer:'🎭',
};

const RC_PERSONALITY_LABELS = {
  grinder:'Grinder', socialite:'Socialite', loner:'Loner', merchant:'Merchant',
  veteran:'Veteran', newbie:'Newbie', hardcore:'Hardcore', roleplayer:'Roleplayer',
};

const RC_RACE_ICONS = {
  human:'🧑', barbarian:'🪓', darkelf:'🧝', dwarf:'⛏️', erudite:'🔮',
  gnome:'🔧', halfelf:'🧝‍♀️', halfling:'🍀', highelf:'✨', iksar:'🦎',
  ogre:'👹', troll:'🧟', woodelf:'🌿', froglok:'🐸',
};
const RC_RACE_NAMES = {
  human:'Human', barbarian:'Barbarian', darkelf:'Dark Elf', dwarf:'Dwarf',
  erudite:'Erudite', gnome:'Gnome', halfelf:'Half Elf', halfling:'Halfling',
  highelf:'High Elf', iksar:'Iksar', ogre:'Ogre', troll:'Troll',
  woodelf:'Wood Elf', froglok:'Froglok',
};

function rcGetBio(ghost) {
  const cls = RC_CLASS_NAMES[ghost.classId] || ghost.classId;
  const lvl = ghost.level || 1;
  switch (ghost.personality) {
    case 'grinder':
      return lvl >= 40
        ? `A relentless ${cls} who hasn't logged out in days. Kill count speaks for itself.`
        : `A ${cls} chasing the next level with single-minded intensity.`;
    case 'socialite':
      return `A ${cls} who knows half the server by name. Always looking for a group.`;
    case 'loner':
      return `A ${cls} who prefers the quiet company of monsters. Solo since day one.`;
    case 'merchant':
      return `Always buying and selling — if it has a price, they've traded it.`;
    case 'veteran':
      return lvl >= 40
        ? `A seasoned ${cls} who's been farming this server since it opened. Knows every spawn timer.`
        : `An experienced ${cls} who's seen it all before.`;
    case 'newbie':
      return lvl <= 10
        ? `A fresh ${cls} still learning the ropes in Qeynos Hills.`
        : `A ${cls} who still gets excited over every drop.`;
    case 'hardcore':
      return `A ${cls} who considers sleeping a waste of XP. Death is not an option.`;
    case 'roleplayer':
      return `A ${cls} who lives the lore. Every kill has a story; every item, a legend.`;
    default:
      return `A ${cls} adventuring in the world.`;
  }
}

// ─── Zone Display Names ───────────────────────────────────────────────────────

const RC_ZONE_NAMES = {
  qeynos_hills:    'Qeynos Hills',
  blackburrow:     'Blackburrow',
  qeynos:          'Qeynos',
  everfrost_peaks: 'Everfrost Peaks',
  west_karana:     'West Karana',
  highpass_hold:   'Highpass Hold',
  kithicor_forest: 'Kithicor Forest',
  commonlands:     'The Commonlands',
  plane_of_fear:   'Plane of Fear',
  lake_of_ill_omen:'Lake of Ill Omen',
};

function rcZoneName(zoneId) {
  return RC_ZONE_NAMES[zoneId] || zoneId || 'Unknown';
}

// ─── Equipment Slot Labels ────────────────────────────────────────────────────

const RC_SLOT_LABELS = {
  head:'Head', face:'Face', ear1:'Ear 1', ear2:'Ear 2', neck:'Neck',
  shoulders:'Shoulders', back:'Back', chest:'Chest', wrist_l:'Wrist L',
  wrist_r:'Wrist R', hands:'Hands', waist:'Waist', legs:'Legs', feet:'Feet',
  primary:'Primary', secondary:'Secondary', range:'Range', ammo:'Ammo',
  ring1:'Ring 1', ring2:'Ring 2',
};

const RC_EQUIP_SLOTS = [
  'head','face','ear1','ear2','neck','shoulders','back','chest',
  'wrist_l','wrist_r','hands','waist','legs','feet',
  'primary','secondary','range','ammo','ring1','ring2',
];

// ─── State ────────────────────────────────────────────────────────────────────

let rcGhosts = [];
let rcGuildMap = {};   // ghostName → { name, tag }
let rcGuilds  = [];    // array of guild objects

let rcFilters = { classId: '', zone: '', guild: '', search: '' };
let rcSort    = { field: 'level', dir: 'desc' };
let rcPage    = 1;
const RC_PAGE_SIZE = 50;

let rcExpandedId = null;   // id of currently expanded ghost row

// ─── Data Loading ─────────────────────────────────────────────────────────────

function rcLoadData() {
  // Load ghosts
  try {
    const raw = localStorage.getItem('foreverRPG_ghosts');
    rcGhosts = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(rcGhosts)) rcGhosts = [];
  } catch (_) {
    rcGhosts = [];
  }

  // Load guilds
  rcGuilds  = [];
  rcGuildMap = {};
  try {
    const raw = localStorage.getItem('foreverRPG_playerGuilds');
    if (raw) {
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.guilds)) {
        rcGuilds = data.guilds;
        for (const guild of rcGuilds) {
          for (const member of (guild.members || [])) {
            rcGuildMap[member.name] = { name: guild.name, tag: guild.tag };
          }
        }
      }
    }
  } catch (_) {}
}

// ─── Derived Stat Helpers ─────────────────────────────────────────────────────

function rcGetHP(ghost) {
  return ghost.maxHP ?? (50 + (ghost.level || 1) * 10);
}
function rcGetMana(ghost) {
  return ghost.maxMana ?? (50 + (ghost.level || 1) * 8);
}
function rcGetAC(ghost) {
  return ghost.currentAC ?? (5 + (ghost.level || 1) * 2);
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

function rcSortedGhosts(list) {
  const { field, dir } = rcSort;
  const sign = dir === 'asc' ? 1 : -1;

  const val = g => {
    switch (field) {
      case 'level':  return g.level || 0;
      case 'kills':  return g.kills || 0;
      case 'xp':     return g.totalXP || 0;
      case 'gold':   return g.gold || 0;
      case 'aa':     return 0; // not tracked yet
      case 'hp':     return rcGetHP(g);
      case 'mana':   return rcGetMana(g);
      case 'ac':     return rcGetAC(g);
      default:       return g.level || 0;
    }
  };

  return [...list].sort((a, b) => sign * (val(a) - val(b)));
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function rcFilteredGhosts() {
  const { classId, zone, guild, search } = rcFilters;
  const needle = search.trim().toLowerCase();

  return rcGhosts.filter(g => {
    if (classId && g.classId !== classId) return false;
    if (zone   && g.zone   !== zone)    return false;
    if (guild) {
      const gm = rcGuildMap[g.name];
      if (!gm || gm.name !== guild) return false;
    }
    if (needle && !g.name.toLowerCase().includes(needle)) return false;
    return true;
  });
}

// ─── Populate Filter Dropdowns ────────────────────────────────────────────────

function rcPopulateFilters() {
  // Guild dropdown
  const guildSel = document.getElementById('rc-filter-guild');
  if (guildSel) {
    // Remove options beyond the first "All Guilds"
    while (guildSel.options.length > 1) guildSel.remove(1);
    for (const guild of rcGuilds) {
      const opt = document.createElement('option');
      opt.value = guild.name;
      opt.textContent = `[${guild.tag}] ${guild.name}`;
      guildSel.appendChild(opt);
    }
    guildSel.value = rcFilters.guild;
  }

  // Zone dropdown — populate from unique zones in ghost data
  const zoneSel = document.getElementById('rc-filter-zone');
  if (zoneSel) {
    const presentZones = new Set(rcGhosts.map(g => g.zone).filter(Boolean));
    while (zoneSel.options.length > 1) zoneSel.remove(1);
    for (const zoneId of [...presentZones].sort()) {
      const opt = document.createElement('option');
      opt.value = zoneId;
      opt.textContent = rcZoneName(zoneId);
      zoneSel.appendChild(opt);
    }
    zoneSel.value = rcFilters.zone;
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function rcRender() {
  const container = document.getElementById('rc-content');
  if (!container) return;

  if (!rcGhosts.length) {
    container.innerHTML = `
      <div id="rank-empty-state">
        <div class="empty-icon">⚔</div>
        <h2>No Ranking Data Found</h2>
        <p>Play the game first to generate character data!<br>
           Rankings are read directly from your local game save.</p>
        <a href="index.html" class="rank-play-btn">▶ Play Now</a>
      </div>`;
    document.getElementById('rank-pagination').style.display = 'none';
    return;
  }

  const filtered = rcFilteredGhosts();
  const sorted   = rcSortedGhosts(filtered);
  const totalPages = Math.max(1, Math.ceil(sorted.length / RC_PAGE_SIZE));
  rcPage = Math.min(rcPage, totalPages);
  const pageSlice = sorted.slice((rcPage - 1) * RC_PAGE_SIZE, rcPage * RC_PAGE_SIZE);

  // Update pagination
  const paginationEl = document.getElementById('rank-pagination');
  paginationEl.style.display = 'flex';
  document.getElementById('rc-prev-btn').disabled = rcPage <= 1;
  document.getElementById('rc-next-btn').disabled = rcPage >= totalPages;
  document.getElementById('rank-page-indicator').textContent =
    `Page ${rcPage} of ${totalPages}  (${sorted.length} characters)`;

  // Build table HTML
  let html = `
    <div id="rank-table-wrapper">
      <table id="rank-table">
        <thead>
          <tr>
            <th class="sortable col-rank" data-sort="">
              #
            </th>
            <th class="sortable col-name" data-sort="">Name</th>
            <th class="col-class">Class</th>
            <th class="col-guild">Guild</th>
            <th class="col-zone">Zone</th>
            <th class="sortable col-level" data-sort="level">Level <span class="sort-arrow">${rcSortArrow('level')}</span></th>
            <th class="sortable col-kills" data-sort="kills">Kills <span class="sort-arrow">${rcSortArrow('kills')}</span></th>
            <th class="sortable col-hp" data-sort="hp">HP <span class="sort-arrow">${rcSortArrow('hp')}</span></th>
            <th class="sortable col-mana" data-sort="mana">Mana <span class="sort-arrow">${rcSortArrow('mana')}</span></th>
            <th class="sortable col-ac" data-sort="ac">AC <span class="sort-arrow">${rcSortArrow('ac')}</span></th>
            <th class="sortable col-xp" data-sort="xp">XP <span class="sort-arrow">${rcSortArrow('xp')}</span></th>
            <th class="col-personality">Personality</th>
          </tr>
        </thead>
        <tbody>`;

  pageSlice.forEach((ghost, idx) => {
    const rank      = (rcPage - 1) * RC_PAGE_SIZE + idx + 1;
    const color     = RC_CLASS_COLORS[ghost.classId] || '#e8d5a0';
    const classIcon = RC_CLASS_ICONS[ghost.classId] || '⚔';
    const className = RC_CLASS_NAMES[ghost.classId] || ghost.classId;
    const zoneName  = rcZoneName(ghost.zone);
    const guildInfo = rcGuildMap[ghost.name];
    const guildText = guildInfo ? `[${guildInfo.tag}]` : '<span style="color:#4a4030">none</span>';
    const pKey      = ghost.personality || 'grinder';
    const pIcon     = RC_PERSONALITY_ICONS[pKey] || '';
    const pLabel    = RC_PERSONALITY_LABELS[pKey] || pKey;
    const hp        = rcGetHP(ghost).toLocaleString();
    const mana      = rcGetMana(ghost).toLocaleString();
    const ac        = rcGetAC(ghost).toLocaleString();
    const xp        = (ghost.totalXP || 0).toLocaleString();
    const kills     = (ghost.kills || 0).toLocaleString();
    const isExpanded = rcExpandedId === ghost.id;

    html += `
          <tr class="rc-ghost-row${isExpanded ? ' row-expanded' : ''}" data-ghost-id="${ghost.id}">
            <td class="rank-num${rank <= 3 ? ' top3' : ''}">${rank}</td>
            <td class="rank-name" style="color:${color}">${rcEscape(ghost.name)}</td>
            <td class="rank-class"><span style="color:${color}">${classIcon}</span> ${className}</td>
            <td class="rank-guild col-guild">${guildText}</td>
            <td class="rank-zone col-zone">${rcEscape(zoneName)}</td>
            <td class="rank-num-col col-level">${ghost.level || 1}</td>
            <td class="rank-num-col col-kills">${kills}</td>
            <td class="rank-num-col col-hp">${hp}</td>
            <td class="rank-num-col col-mana">${mana}</td>
            <td class="rank-num-col col-ac">${ac}</td>
            <td class="rank-num-col col-xp">${xp}</td>
            <td class="rank-personality col-personality"><span class="personality-badge">${pIcon} ${rcEscape(pLabel)}</span></td>
          </tr>`;

    if (isExpanded) {
      html += rcDetailRow(ghost, color);
    }
  });

  html += `
        </tbody>
      </table>
    </div>`;

  container.innerHTML = html;

  // Apply sort-active classes
  container.querySelectorAll('th[data-sort]').forEach(th => {
    const s = th.dataset.sort;
    if (s && s === rcSort.field) {
      th.classList.add('sort-active');
    } else {
      th.classList.remove('sort-active');
    }
  });

  // Row click handlers
  container.querySelectorAll('.rc-ghost-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = parseInt(row.dataset.ghostId, 10);
      rcExpandedId = (rcExpandedId === id) ? null : id;
      rcRender();
    });
  });

  // Sortable header click handlers
  container.querySelectorAll('th.sortable[data-sort]').forEach(th => {
    const field = th.dataset.sort;
    if (!field) return;
    th.addEventListener('click', e => {
      e.stopPropagation();
      if (rcSort.field === field) {
        rcSort.dir = rcSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        rcSort.field = field;
        rcSort.dir = 'desc';
      }
      rcPage = 1;
      rcExpandedId = null;
      rcRender();
      rcUpdateSortDirBtn();
    });
  });
}

function rcSortArrow(field) {
  if (rcSort.field !== field) return '↕';
  return rcSort.dir === 'asc' ? '▲' : '▼';
}

function rcDetailRow(ghost, color) {
  const bio = rcGetBio(ghost);

  // Stats
  const stats = [
    ['STR', ghost.STR], ['DEX', ghost.DEX], ['AGI', ghost.AGI], ['STA', ghost.STA],
    ['WIS', ghost.WIS], ['INT', ghost.INT], ['CHA', ghost.CHA],
  ];
  const statRows = stats.map(([label, val]) =>
    `<div class="rank-stat-row">
       <span class="stat-label">${label}</span>
       <span class="stat-val">${val != null ? val : '—'}</span>
     </div>`
  ).join('');

  // Equipment
  const equipRows = RC_EQUIP_SLOTS.map(slot => {
    const itemId = ghost.equipment && ghost.equipment[slot];
    const label  = RC_SLOT_LABELS[slot] || slot;
    if (itemId) {
      return `<div class="rank-equip-row">
                <span class="rank-equip-slot">${label}</span>
                <span class="rank-equip-item">${rcEscape(String(itemId))}</span>
              </div>`;
    }
    return `<div class="rank-equip-row">
              <span class="rank-equip-slot">${label}</span>
              <span class="rank-equip-empty">——</span>
            </div>`;
  }).join('');

  // Party
  const party = ghost.party || [];
  const partyRows = party.map(m => {
    const mColor = RC_CLASS_COLORS[m.classId] || '#e8d5a0';
    const mIcon  = RC_CLASS_ICONS[m.classId] || '⚔';
    return `<div class="rank-party-row">
              <span style="color:${mColor}">${mIcon}</span>
              <span style="color:${mColor}">${rcEscape(m.name)}</span>
              <span style="color:#a09060">Lv.${m.level || 1}</span>
            </div>`;
  }).join('') || '<div style="color:#4a4030;font-size:0.78rem">No party</div>';

  return `
    <tr class="rank-detail-row">
      <td colspan="12">
        <div class="rank-detail-inner">
          <div class="rank-detail-bio">${rcEscape(bio)}</div>
          ${ghost.race ? `<div class="rank-detail-section"><h4>🧬 Race</h4><div>${RC_RACE_ICONS[ghost.race] || ''} ${rcEscape(RC_RACE_NAMES[ghost.race] || ghost.race)}</div></div>` : ''}
          <div class="rank-detail-section">
            <h4>📊 Stats</h4>
            <div class="rank-stat-grid">${statRows}</div>
          </div>
          <div class="rank-detail-section">
            <h4>🗡 Equipment</h4>
            ${equipRows}
          </div>
          <div class="rank-detail-section">
            <h4>⚔ Party</h4>
            ${partyRows}
          </div>
        </div>
      </td>
    </tr>`;
}

function rcEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

function rcUpdateTimestamp() {
  const el = document.getElementById('rank-last-updated');
  if (el) el.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
}

// ─── Sort Direction Button ────────────────────────────────────────────────────

function rcUpdateSortDirBtn() {
  const btn = document.getElementById('rank-sort-dir-btn');
  if (btn) btn.textContent = rcSort.dir === 'asc' ? '▲ Asc' : '▼ Desc';
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function rcInit() {
  rcLoadData();
  rcPopulateFilters();
  rcRender();
  rcUpdateTimestamp();
  rcUpdateSortDirBtn();

  // Class filter
  const classSel = document.getElementById('rc-filter-class');
  if (classSel) {
    classSel.addEventListener('change', () => {
      rcFilters.classId = classSel.value;
      rcPage = 1; rcExpandedId = null; rcRender();
    });
  }

  // Zone filter
  const zoneSel = document.getElementById('rc-filter-zone');
  if (zoneSel) {
    zoneSel.addEventListener('change', () => {
      rcFilters.zone = zoneSel.value;
      rcPage = 1; rcExpandedId = null; rcRender();
    });
  }

  // Guild filter
  const guildSel = document.getElementById('rc-filter-guild');
  if (guildSel) {
    guildSel.addEventListener('change', () => {
      rcFilters.guild = guildSel.value;
      rcPage = 1; rcExpandedId = null; rcRender();
    });
  }

  // Sort-by dropdown
  const sortSel = document.getElementById('rc-sort-by');
  if (sortSel) {
    sortSel.value = rcSort.field;
    sortSel.addEventListener('change', () => {
      rcSort.field = sortSel.value;
      rcPage = 1; rcExpandedId = null; rcRender();
    });
  }

  // Sort direction toggle
  const sortDirBtn = document.getElementById('rank-sort-dir-btn');
  if (sortDirBtn) {
    sortDirBtn.addEventListener('click', () => {
      rcSort.dir = rcSort.dir === 'asc' ? 'desc' : 'asc';
      rcPage = 1; rcExpandedId = null; rcRender();
      rcUpdateSortDirBtn();
    });
  }

  // Search
  const searchBox = document.getElementById('rc-search');
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      rcFilters.search = searchBox.value;
      rcPage = 1; rcExpandedId = null; rcRender();
    });
  }

  // Reset filters
  const resetBtn = document.getElementById('rank-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      rcFilters = { classId: '', zone: '', guild: '', search: '' };
      rcSort = { field: 'level', dir: 'desc' };
      rcPage = 1;
      rcExpandedId = null;
      if (classSel)  classSel.value = '';
      if (zoneSel)   zoneSel.value  = '';
      if (guildSel)  guildSel.value = '';
      if (sortSel)   sortSel.value  = 'level';
      if (searchBox) searchBox.value = '';
      rcUpdateSortDirBtn();
      rcRender();
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('rank-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      rcExpandedId = null;
      rcPage = 1;
      rcLoadData();
      rcPopulateFilters();
      rcRender();
      rcUpdateTimestamp();
    });
  }

  // Pagination
  const prevBtn = document.getElementById('rc-prev-btn');
  const nextBtn = document.getElementById('rc-next-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (rcPage > 1) { rcPage--; rcExpandedId = null; rcRender(); }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = rcFilteredGhosts();
      const totalPages = Math.max(1, Math.ceil(filtered.length / RC_PAGE_SIZE));
      if (rcPage < totalPages) { rcPage++; rcExpandedId = null; rcRender(); }
    });
  }
}

document.addEventListener('DOMContentLoaded', rcInit);
