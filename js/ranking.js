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

// ─── Achievement Points Lookup (inlined from achievements.js) ─────────────────
// ranking.js is a standalone page without access to game scripts, so point values
// are inlined here. Keep in sync with ACHIEVEMENTS definitions in achievements.js.

const RC_ACHIEVEMENT_POINTS = {
  first_login:10, first_kill:10, first_death:10, first_loot:10, first_group:10,
  survive_10_fights:10, reach_qeynos:10,
  level_5:10, level_10:15, level_20:20, level_30:25, level_50:30, level_60:50,
  earn_1000_xp:10, earn_100k_xp:10,
  class_warrior:10, class_caster:10, class_healer:10, class_hybrid:10,
  zone_qeynos_hills:10, zone_blackburrow:10, zone_everfrost:10, zone_west_karana:10,
  zone_highpass:10, zone_kithicor:10, zone_commonlands:10, zone_plane_of_fear:10,
  zone_lake_of_ill_omen:10, zone_befallen:10, all_zones:25,
  kill_10:10, kill_100:15, kill_500:20, kill_1000:25, kill_5000:50,
  kill_one_of_each:25, kill_rare:10, named_5:15,
  equip_rare:10, equip_full_set:25, bank_10_items:10, buy_spell:10, use_ability:10,
  skill_25:10, skill_50:10, skill_100:10, skill_200:10,
  buy_from_market:10, sell_on_market:10, gold_1000:10, gold_10000:10,
  survive_rare:10, win_without_healer:10,
  inspect_ghost:10, zone_chat_10:10, world_first_witness:10,
  bb_enter:10, bb_floor2:10, bb_floor3:10, bb_floor4:10, bb_floor5:10,
  bb_clear:25, bb_brewer_slain:10, bb_master_brewer:10, bb_high_shaman:10,
  bb_lord_elgnub:10, bb_tranixx:10, bb_no_deaths:25, bb_all_floors_solo:25,
  bb_speed_clear:25, bb_stout_collector:10, bb_gnoll_genocide:10,
  bb_pelt_collector:10, bb_poisoned_survivor:10, bb_train_survivor:10, bb_tranixx_loot:10,
  bef_enter:10, bef_floor2:10, bef_floor3:10, bef_floor4:10, bef_floor5:10, bef_floor6:10,
  bef_clear:25, bef_boondin:10, bef_lrodd:10, bef_elf_skeleton:10, bef_windstream:10,
  bef_amiaz:10, bef_thaumaturgist:10, bef_gynok:10, bef_no_deaths:25, bef_solo:25,
  bef_speed_clear:25, bef_undead_slayer:10, bef_all_named:10, bef_cursed_loot:10,
  bef_bone_claymore:10, bef_train_survivor:10, bef_disease_survivor:10,
  gathering_first:10, gathering_mining_50:15, gathering_mining_100:25, gathering_mining_200:50,
  gathering_lumberjacking_50:15, gathering_lumberjacking_100:25,
  gathering_foraging_50:15, gathering_foraging_100:25,
  gathering_hunting_50:15, gathering_hunting_100:25,
  gathering_farming_50:15, gathering_farming_100:25,
  gathering_all_max:100, gathering_mastery_25:10, gathering_mastery_99:25,
};

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

  // Load real player's party and inject as ghost-compatible entries
  try {
    const raw = localStorage.getItem('foreverRPG_save');
    if (raw) {
      const save = JSON.parse(raw);
      const data = save && save.data;
      if (data && Array.isArray(data.party) && data.party.length) {
        // Compute total kills and gold for real player
        const totalKills = Object.values(data.killCounts || {}).reduce((s, v) => s + v, 0);
        const totalGold  = (data.gold || 0) * 100 + (data.silver || 0) * 10 + (data.copper || 0);
        const zoneId     = (data.zone && data.zone.id) ? data.zone.id : (data.zone || '');

        // Compute real-player achievement points from their save data
        let playerAchPts = 0;
        try {
          const achRaw = localStorage.getItem('foreverRPG_achievements');
          if (achRaw) {
            const achArr = JSON.parse(achRaw);
            if (Array.isArray(achArr)) {
              for (const rec of achArr) {
                if (rec.unlockedAt !== null && RC_ACHIEVEMENT_POINTS[rec.id]) {
                  playerAchPts += RC_ACHIEVEMENT_POINTS[rec.id];
                }
              }
            }
          }
        } catch (_) {}

        // Build ghost-compatible objects for each party member (negative IDs)
        const playerGhosts = data.party.map((member, idx) => ({
          id:           -(idx + 1),
          name:         member.name,
          classId:      member.classId,
          level:        member.level || 1,
          kills:        totalKills,
          totalXP:      member.xp || member.totalXP || data.totalXPEarned || 0,
          gold:         totalGold,
          zone:         zoneId,
          personality:  member.personality || 'grinder',
          race:         member.race || '',
          maxHP:        member.maxHP || 0,
          maxMana:      member.maxMana || 0,
          currentAC:    member.currentAC || member.ac || 0,
          STR: member.STR, DEX: member.DEX, AGI: member.AGI, STA: member.STA,
          WIS: member.WIS, INT: member.INT, CHA: member.CHA,
          equipment:    member.equipment || {},
          party:        data.party
            .filter((_, i) => i !== idx)
            .map(m => ({ name: m.name, classId: m.classId, level: m.level || 1 })),
          isRealPlayer: true,
          achievementPts: playerAchPts,
        }));

        // Inject real player entries at the start so they appear first by default
        rcGhosts = [...playerGhosts, ...rcGhosts];
      }
    }
  } catch (_) {}

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
      case 'level':        return g.level || 0;
      case 'kills':        return g.kills || 0;
      case 'xp':           return g.totalXP || 0;
      case 'gold':         return g.gold || 0;
      case 'aa':           return 0; // not tracked yet
      case 'hp':           return rcGetHP(g);
      case 'mana':         return rcGetMana(g);
      case 'ac':           return rcGetAC(g);
      case 'achievementPts': return g.achievementPts || 0;
      default:             return g.level || 0;
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
            <th class="sortable col-achvpts" data-sort="achievementPts">Achv Pts <span class="sort-arrow">${rcSortArrow('achievementPts')}</span></th>
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
    let achvPts;
    if (ghost.isRealPlayer) {
      achvPts = (ghost.achievementPts || 0).toLocaleString();
    } else {
      achvPts = '—';
    }
    const isExpanded = rcExpandedId === ghost.id;
    const youBadge  = ghost.isRealPlayer
      ? ' <span class="rank-you-badge">⭐ YOU</span>'
      : '';
    const rowClass  = `rc-ghost-row${isExpanded ? ' row-expanded' : ''}${ghost.isRealPlayer ? ' rank-row-you' : ''}`;

    html += `
          <tr class="${rowClass}" data-ghost-id="${ghost.id}">
            <td class="rank-num${rank <= 3 ? ' top3' : ''}">${rank}</td>
            <td class="rank-name" style="color:${color}">${rcEscape(ghost.name)}${youBadge}</td>
            <td class="rank-class"><span style="color:${color}">${classIcon}</span> ${className}</td>
            <td class="rank-guild col-guild">${guildText}</td>
            <td class="rank-zone col-zone">${rcEscape(zoneName)}</td>
            <td class="rank-num-col col-level">${ghost.level || 1}</td>
            <td class="rank-num-col col-kills">${kills}</td>
            <td class="rank-num-col col-hp">${hp}</td>
            <td class="rank-num-col col-mana">${mana}</td>
            <td class="rank-num-col col-ac">${ac}</td>
            <td class="rank-num-col col-xp">${xp}</td>
            <td class="rank-num-col col-achvpts">${achvPts}</td>
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
  const youNote = ghost.isRealPlayer
    ? '<div class="rank-you-note">⭐ This is your character</div>'
    : '';

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
      <td colspan="13">
        <div class="rank-detail-inner">
          ${youNote}
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

// ─── World Firsts ─────────────────────────────────────────────────────────────

function rcRenderWorldFirsts() {
  const el = document.getElementById('rank-world-firsts');
  if (!el) return;

  let wf = {};
  try {
    const raw = localStorage.getItem('foreverRPG_worldFirsts');
    if (raw) wf = JSON.parse(raw);
  } catch (_) {}

  const entries = Object.entries(wf)
    .sort((a, b) => (b[1].when || 0) - (a[1].when || 0))
    .slice(0, 10);

  if (!entries.length) {
    el.innerHTML = `
      <div class="wf-header">🌟 World Firsts</div>
      <div class="wf-empty">No world firsts yet — be the first!</div>`;
    return;
  }

  const rows = entries.map(([, record]) => {
    const d = new Date(record.when || 0);
    const timeStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
      + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `<div class="wf-entry">
      <span class="wf-star">🌟</span>
      <span class="wf-detail">${rcEscape(record.detail || '')}</span>
      <span class="wf-meta">${rcEscape(record.who || '?')} — ${timeStr}</span>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="wf-header">🌟 World Firsts</div>
    <div class="wf-list">${rows}</div>`;
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
  rcRenderWorldFirsts();
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
      rcRenderWorldFirsts();
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
