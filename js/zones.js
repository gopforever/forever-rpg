const ZONES = {
  qeynos_hills: {
    id: 'qeynos_hills',
    name: 'Qeynos Hills',
    shortName: 'QH',
    levelRange: [2, 12],
    xpModifier: 0.9,
    description: 'Rolling green hills outside the great city of Qeynos. Home to wolves, bears, gnolls, and worse. A classic hunting ground for young adventurers.',
    enemies: [
      'mangy_rat',
      'giant_rat',
      'large_rat',
      'fire_beetle',
      'snake',
      'king_snake',
      'bat',
      'giant_bat',
      'gnoll_pup',
      'gnoll',
      'gnoll_scout',
      'gnoll_watcher',
      'gnoll_hunter',
      'gray_wolf',
      'rabid_wolf',
      'brown_bear',
      'grizzly_bear',
      'decaying_skeleton',
      'putrid_skeleton',
      'dread_corpse',
      'will_o_wisp',
      'bandit',
      'hadden',
      'varsoon_the_undying',
    ],
    commonEnemies: [
      'mangy_rat',
      'giant_rat',
      'large_rat',
      'fire_beetle',
      'snake',
      'bat',
      'gnoll_pup',
      'gnoll',
      'gray_wolf',
      'brown_bear',
      'bandit',
    ],
    // king_snake appears twice to give it double the spawn weight among rares
    rareEnemies: [
      'king_snake',
      'king_snake',
      'hadden',
      'varsoon_the_undying',
    ],
    rareSpawnChance: 0.08,
    ambientColor: '#2d4a1e',
    minimapSVG: `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="border-radius:4px;">
  <!-- Background sky gradient -->
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a7a3a"/>
      <stop offset="100%" stop-color="#2d4a1e"/>
    </linearGradient>
    <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a6b2a"/>
      <stop offset="100%" stop-color="#1e3a10"/>
    </linearGradient>
    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a7ab5"/>
      <stop offset="100%" stop-color="#1e4a7a"/>
    </linearGradient>
  </defs>

  <!-- Base ground fill -->
  <rect width="280" height="200" fill="url(#skyGrad)"/>

  <!-- Far background hills -->
  <path d="M0,120 Q30,80 70,100 Q110,120 150,85 Q190,55 230,90 Q260,110 280,95 L280,200 L0,200 Z" fill="#1e3a10" opacity="0.6"/>

  <!-- Mid hills -->
  <path d="M0,140 Q40,105 85,125 Q130,145 170,110 Q210,80 250,115 Q265,125 280,118 L280,200 L0,200 Z" fill="url(#hillGrad)"/>

  <!-- Foreground ground -->
  <path d="M0,160 Q50,150 100,158 Q150,165 200,155 Q240,148 280,160 L280,200 L0,200 Z" fill="#2a4a18"/>

  <!-- Dirt road / path winding through zone -->
  <path d="M10,195 Q40,170 60,155 Q85,138 110,140 Q135,142 155,130 Q175,118 200,115 Q225,112 250,125 Q265,132 275,128" fill="none" stroke="#8b6914" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <!-- Road center line (dashed) -->
  <path d="M10,195 Q40,170 60,155 Q85,138 110,140 Q135,142 155,130 Q175,118 200,115 Q225,112 250,125 Q265,132 275,128" fill="none" stroke="#c4962a" stroke-width="1.5" stroke-dasharray="6,5" stroke-linecap="round" opacity="0.6"/>

  <!-- Small pond / water feature (lower left) -->
  <ellipse cx="55" cy="170" rx="22" ry="12" fill="url(#waterGrad)" opacity="0.85"/>
  <ellipse cx="55" cy="170" rx="22" ry="12" fill="none" stroke="#6ab4e8" stroke-width="1" opacity="0.5"/>
  <!-- Water shimmer -->
  <line x1="44" y1="168" x2="52" y2="168" stroke="#a0d4f5" stroke-width="1" opacity="0.6"/>
  <line x1="56" y1="171" x2="66" y2="171" stroke="#a0d4f5" stroke-width="1" opacity="0.6"/>

  <!-- Stream flowing from pond -->
  <path d="M72,172 Q80,175 90,178 Q100,180 108,185" fill="none" stroke="#3a7ab5" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>

  <!-- Tree cluster: top-left (Wolf Den area) -->
  <circle cx="30" cy="112" r="9" fill="#1a3a0a"/>
  <circle cx="44" cy="108" r="8" fill="#1e4510"/>
  <circle cx="22" cy="120" r="7" fill="#162e08"/>
  <circle cx="38" cy="120" r="8" fill="#1a3a0a"/>

  <!-- Tree cluster: top-center-right (Bear Grove area) -->
  <circle cx="195" cy="95" r="9" fill="#1a3a0a"/>
  <circle cx="210" cy="90" r="10" fill="#1e4510"/>
  <circle cx="222" cy="98" r="8" fill="#162e08"/>
  <circle cx="202" cy="104" r="7" fill="#1a3a0a"/>
  <circle cx="215" cy="106" r="6" fill="#1e4510"/>

  <!-- Tree cluster: right edge (dark forest fringe) -->
  <circle cx="262" cy="118" r="8" fill="#1a3a0a"/>
  <circle cx="272" cy="112" r="7" fill="#162e08"/>
  <circle cx="270" cy="124" r="6" fill="#1a3a0a"/>

  <!-- Tree cluster: mid bottom (near path) -->
  <circle cx="135" cy="148" r="7" fill="#1e4510"/>
  <circle cx="146" cy="143" r="6" fill="#1a3a0a"/>

  <!-- Gnoll Camp marker: upper center -->
  <!-- Tent/camp icon -->
  <polygon points="115,72 108,90 122,90" fill="#7a4a1a" stroke="#c48a3a" stroke-width="1"/>
  <polygon points="122,75 115,90 129,90" fill="#8b5520" stroke="#c48a3a" stroke-width="1"/>
  <!-- Campfire glow -->
  <circle cx="118" cy="94" r="3" fill="#e85a10" opacity="0.9"/>
  <circle cx="118" cy="94" r="5" fill="#e85a10" opacity="0.3"/>

  <!-- Wolf Den marker: top-left cluster -->
  <!-- Den entrance arc -->
  <path d="M18,125 Q28,118 38,125" fill="none" stroke="#5a3a0a" stroke-width="2"/>
  <ellipse cx="28" cy="125" rx="10" ry="5" fill="#1a1a0a" opacity="0.6"/>

  <!-- Bear Grove marker: right tree cluster -->
  <!-- Bear paw print hint -->
  <circle cx="236" cy="95" r="2.5" fill="#3a2a0a" opacity="0.7"/>
  <circle cx="240" cy="91" r="1.5" fill="#3a2a0a" opacity="0.7"/>
  <circle cx="244" cy="93" r="1.5" fill="#3a2a0a" opacity="0.7"/>
  <circle cx="242" cy="98" r="1.5" fill="#3a2a0a" opacity="0.7"/>
  <circle cx="238" cy="100" r="1.5" fill="#3a2a0a" opacity="0.7"/>

  <!-- Skeleton / Undead area marker: lower right -->
  <circle cx="248" cy="160" r="5" fill="#2a1a3a" opacity="0.8"/>
  <text x="248" y="163" text-anchor="middle" font-family="serif" font-size="7" fill="#8a6aaa" opacity="0.9">☠</text>

  <!-- City gate icon bottom-left (Qeynos exit) -->
  <rect x="4" y="180" width="14" height="16" fill="#5a4a2a" stroke="#8a7a4a" stroke-width="1" rx="1"/>
  <path d="M4,180 Q11,174 18,180" fill="#4a3a1a" stroke="#8a7a4a" stroke-width="1"/>
  <rect x="8" y="186" width="6" height="10" fill="#2a1a0a"/>

  <!-- West Karana exit arrow: far right -->
  <polygon points="276,145 268,141 268,149" fill="#c4962a" opacity="0.8"/>
  <line x1="268" y1="145" x2="258" y2="145" stroke="#c4962a" stroke-width="1.5" opacity="0.7"/>

  <!-- Area Labels -->
  <!-- Gnoll Camp label -->
  <rect x="92" y="58" width="54" height="11" rx="2" fill="#000000" opacity="0.45"/>
  <text x="119" y="67" text-anchor="middle" font-family="serif" font-size="7.5" fill="#f0c050" font-weight="bold">Gnoll Camp</text>

  <!-- Wolf Den label -->
  <rect x="6" y="98" width="42" height="11" rx="2" fill="#000000" opacity="0.45"/>
  <text x="27" y="107" text-anchor="middle" font-family="serif" font-size="7" fill="#d4c080">Wolf Den</text>

  <!-- Bear Grove label -->
  <rect x="184" y="76" width="48" height="11" rx="2" fill="#000000" opacity="0.45"/>
  <text x="208" y="85" text-anchor="middle" font-family="serif" font-size="7" fill="#d4c080">Bear Grove</text>

  <!-- Undead Grounds label -->
  <rect x="224" y="151" width="52" height="11" rx="2" fill="#000000" opacity="0.45"/>
  <text x="250" y="160" text-anchor="middle" font-family="serif" font-size="6.5" fill="#b090d0">Undead Grounds</text>

  <!-- Qeynos exit label -->
  <text x="19" y="197" font-family="serif" font-size="6" fill="#c4962a" opacity="0.9">◄ Qeynos</text>

  <!-- West Karana exit label -->
  <text x="255" y="138" font-family="serif" font-size="6" fill="#c4962a" opacity="0.9">W. Karana ►</text>

  <!-- "You Are Here" gold star marker (center of zone, on path) -->
  <circle cx="140" cy="136" r="7" fill="#000000" opacity="0.4"/>
  <text x="140" y="140" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <!-- Subtle pulse ring -->
  <circle cx="140" cy="136" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>

  <!-- Zone border frame -->
  <rect width="280" height="200" fill="none" stroke="#5a7a3a" stroke-width="2" rx="3"/>
</svg>`,
    connections: ['west_karana', 'qeynos', 'blackburrow'],
    respawnTime: 3000,
  },

  qeynos: {
    id: 'qeynos',
    name: 'Qeynos',
    shortName: 'QEY',
    levelRange: [1, 60],
    xpModifier: 1,
    description: 'The City of Honor. A safe haven for adventurers.',
    isSafeZone: true,
    bindPoint: true,
    enemyPool: [],
    enemies: [],
    commonEnemies: [],
    rareEnemies: [],
    rareSpawnChance: 0,
    ambientColor: '#2a1e0e',
    minimapSVG: `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="border-radius:4px;">
  <defs>
    <linearGradient id="cityGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a2e1a"/>
      <stop offset="100%" stop-color="#1a1208"/>
    </linearGradient>
  </defs>
  <rect width="280" height="200" fill="url(#cityGrad)"/>
  <!-- City walls -->
  <rect x="10" y="10" width="260" height="180" fill="none" stroke="#8a7040" stroke-width="4" rx="4"/>
  <rect x="18" y="18" width="244" height="164" fill="none" stroke="#6a5030" stroke-width="1.5" rx="2"/>
  <!-- Roads -->
  <line x1="140" y1="18" x2="140" y2="182" stroke="#5a4820" stroke-width="5"/>
  <line x1="18" y1="100" x2="262" y2="100" stroke="#5a4820" stroke-width="5"/>
  <!-- North District -->
  <rect x="30" y="25" width="100" height="65" fill="#1e1a0e" stroke="#4a3a18" stroke-width="1" rx="2"/>
  <text x="80" y="55" text-anchor="middle" font-family="serif" font-size="8" fill="#c8a84b">North Qeynos</text>
  <text x="80" y="67" text-anchor="middle" font-family="serif" font-size="6" fill="#8a7040">Temple of Life</text>
  <text x="80" y="78" text-anchor="middle" font-family="serif" font-size="6" fill="#8a7040">Guild Halls</text>
  <!-- Mage Tower -->
  <rect x="150" y="25" width="100" height="65" fill="#1a1a2a" stroke="#3a3a5a" stroke-width="1" rx="2"/>
  <text x="200" y="52" text-anchor="middle" font-family="serif" font-size="8" fill="#8888ff">Mage Tower</text>
  <text x="200" y="64" text-anchor="middle" font-family="serif" font-size="6" fill="#6666cc">The Concordance</text>
  <circle cx="200" cy="40" r="8" fill="none" stroke="#6666cc" stroke-width="1" opacity="0.6"/>
  <text x="200" y="43" text-anchor="middle" font-family="serif" font-size="10" fill="#aaaaff">✦</text>
  <!-- Bank -->
  <rect x="110" y="80" width="60" height="40" fill="#2a2010" stroke="#c8a84b" stroke-width="1.5" rx="2"/>
  <text x="140" y="97" text-anchor="middle" font-family="serif" font-size="8" fill="#c8a84b">🏦 Bank</text>
  <text x="140" y="108" text-anchor="middle" font-family="serif" font-size="6" fill="#8a7040">of Qeynos</text>
  <!-- South Qeynos -->
  <rect x="30" y="115" width="100" height="55" fill="#1e1a0e" stroke="#4a3a18" stroke-width="1" rx="2"/>
  <text x="80" y="140" text-anchor="middle" font-family="serif" font-size="8" fill="#c8a84b">South Qeynos</text>
  <text x="80" y="152" text-anchor="middle" font-family="serif" font-size="6" fill="#8a7040">Market • Sewers</text>
  <!-- Market District -->
  <rect x="150" y="115" width="100" height="55" fill="#1e1a0e" stroke="#4a3a18" stroke-width="1" rx="2"/>
  <text x="200" y="140" text-anchor="middle" font-family="serif" font-size="8" fill="#c8a84b">Merchant Row</text>
  <text x="200" y="152" text-anchor="middle" font-family="serif" font-size="6" fill="#8a7040">Vendors • Inn</text>
  <!-- Gate label -->
  <text x="140" y="195" text-anchor="middle" font-family="serif" font-size="6" fill="#c4962a" opacity="0.9">◄ Qeynos Hills</text>
  <!-- Zone border frame -->
  <rect width="280" height="200" fill="none" stroke="#8a7040" stroke-width="2" rx="3"/>
</svg>`,
    connections: ['qeynos_hills'],
    respawnTime: 0,
  },

  blackburrow: {
    id: 'blackburrow',
    name: 'Blackburrow',
    shortName: 'BB',
    levelRange: [4, 15],
    xpModifier: 1.1,
    isDungeon: true,
    isSafeZone: false,
    description: 'A vast underground gnoll warren carved beneath the Qeynos Hills. Multi-level tunnels crawl with gnoll defenders and their vermin allies. Famous for deadly trains and treacherous flooded passages.',
    flavorLines: [
      'The stench of wet fur and stale ale hits you as you descend into Blackburrow.',
      'Somewhere deep below, a gnoll horn sounds. The tunnels are alive with movement.',
      'The narrow passages press in around you. Firelight flickers from unseen torches ahead.',
      'You hear the distant howl of gnolls echoing up the stone corridors.',
      'The air grows damp and cold as you step into Blackburrow\'s darkness.',
    ],
    enemies: [
      'gnoll_pup',
      'a_scrawny_gnoll',
      'a_gnoll_guard',
      'a_burly_gnoll',
      'a_gnoll_shaman',
      'a_gnoll_guard_elite',
      'a_giant_plague_rat',
      'a_giant_snake_bb',
      'lord_elgnub',
      'gnoll_high_shaman',
      'gnoll_brewer',
      'gnoll_commander',
    ],
    commonEnemies: [
      'gnoll_pup',
      'a_scrawny_gnoll',
      'a_gnoll_guard',
      'a_burly_gnoll',
      'a_gnoll_shaman',
      'a_gnoll_guard_elite',
      'a_giant_plague_rat',
      'a_giant_snake_bb',
    ],
    rareEnemies: [
      'gnoll_brewer',
      'gnoll_commander',
      'gnoll_high_shaman',
      'lord_elgnub',
    ],
    rareSpawnChance: 0.08,
    ambientColor: '#1a0f00',
    respawnTime: 6000,
    minimapSVG: `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="border-radius:4px;">
  <defs>
    <linearGradient id="bbFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a1a08"/>
      <stop offset="100%" stop-color="#120900"/>
    </linearGradient>
    <linearGradient id="bbWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a3a5a"/>
      <stop offset="100%" stop-color="#0a1a2a"/>
    </linearGradient>
    <linearGradient id="bbTorch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff8c00" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#ff4500" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Dark dungeon background -->
  <rect width="280" height="200" fill="#0d0700"/>

  <!-- Main upper tunnel -->
  <rect x="20" y="30" width="240" height="30" rx="4" fill="url(#bbFloor)" stroke="#3a2a10" stroke-width="1"/>
  <!-- Left branch tunnel -->
  <rect x="20" y="30" width="35" height="100" rx="4" fill="url(#bbFloor)" stroke="#3a2a10" stroke-width="1"/>
  <!-- Center vertical corridor -->
  <rect x="120" y="30" width="40" height="90" rx="4" fill="url(#bbFloor)" stroke="#3a2a10" stroke-width="1"/>
  <!-- Lower main tunnel -->
  <rect x="20" y="110" width="240" height="30" rx="4" fill="url(#bbFloor)" stroke="#3a2a10" stroke-width="1"/>
  <!-- Right descending passage -->
  <rect x="225" y="55" width="35" height="90" rx="4" fill="url(#bbFloor)" stroke="#3a2a10" stroke-width="1"/>
  <!-- Deep chamber -->
  <rect x="150" y="140" width="110" height="45" rx="6" fill="#1e0f04" stroke="#4a3010" stroke-width="1.5"/>

  <!-- Flooded lower passage -->
  <rect x="20" y="150" width="120" height="18" rx="3" fill="url(#bbWater)" stroke="#2a5a8a" stroke-width="1" opacity="0.85"/>
  <line x1="30" y1="157" x2="55" y2="157" stroke="#4a8abf" stroke-width="1" opacity="0.5"/>
  <line x1="65" y1="161" x2="100" y2="161" stroke="#4a8abf" stroke-width="1" opacity="0.5"/>
  <text x="72" y="163" text-anchor="middle" font-family="serif" font-size="5.5" fill="#6ab0e0" opacity="0.8">~ flooded ~</text>

  <!-- Entrance passage (top left) -->
  <rect x="0" y="35" width="25" height="20" fill="#2a1a08" stroke="#3a2a10" stroke-width="1"/>
  <text x="4" y="24" font-family="serif" font-size="6" fill="#c4962a" opacity="0.9">◄ QH</text>

  <!-- Everfrost connection hint (far right, wired but unbuilt) -->
  <rect x="255" y="35" width="25" height="20" fill="#1a1a2a" stroke="#2a2a4a" stroke-width="1"/>
  <text x="258" y="24" font-family="serif" font-size="5.5" fill="#6080a0" opacity="0.7">EF ►</text>

  <!-- Torch glow spots -->
  <ellipse cx="55" cy="45" rx="10" ry="6" fill="url(#bbTorch)" opacity="0.6"/>
  <ellipse cx="55" cy="125" rx="10" ry="6" fill="url(#bbTorch)" opacity="0.6"/>
  <ellipse cx="190" cy="45" rx="10" ry="6" fill="url(#bbTorch)" opacity="0.6"/>
  <ellipse cx="190" cy="125" rx="10" ry="6" fill="url(#bbTorch)" opacity="0.6"/>
  <!-- Torch icons -->
  <rect x="53" y="38" width="3" height="6" fill="#c06010" rx="1"/>
  <circle cx="54.5" cy="37" r="2" fill="#ff8c00" opacity="0.9"/>
  <rect x="188" y="38" width="3" height="6" fill="#c06010" rx="1"/>
  <circle cx="189.5" cy="37" r="2" fill="#ff8c00" opacity="0.9"/>
  <rect x="53" y="118" width="3" height="6" fill="#c06010" rx="1"/>
  <circle cx="54.5" cy="117" r="2" fill="#ff8c00" opacity="0.9"/>
  <rect x="188" y="118" width="3" height="6" fill="#c06010" rx="1"/>
  <circle cx="189.5" cy="117" r="2" fill="#ff8c00" opacity="0.9"/>

  <!-- Gnoll Camp marker (upper center) -->
  <polygon points="140,34 134,48 146,48" fill="#7a3a0a" stroke="#c06020" stroke-width="1"/>
  <polygon points="146,36 140,48 152,48" fill="#8b4a14" stroke="#c06020" stroke-width="1"/>

  <!-- Brewer's Hall label -->
  <rect x="82" y="58" width="58" height="11" rx="2" fill="#000000" opacity="0.55"/>
  <text x="111" y="67" text-anchor="middle" font-family="serif" font-size="7" fill="#c89040">Brewer's Hall</text>

  <!-- Deep Warren label -->
  <rect x="155" y="153" width="56" height="11" rx="2" fill="#000000" opacity="0.55"/>
  <text x="183" y="162" text-anchor="middle" font-family="serif" font-size="7" fill="#e05020">Deep Warren</text>

  <!-- Upper Tunnels label -->
  <rect x="60" y="31" width="52" height="10" rx="2" fill="#000000" opacity="0.45"/>
  <text x="86" y="39" text-anchor="middle" font-family="serif" font-size="6.5" fill="#d4b060">Upper Tunnels</text>

  <!-- Lord Elgnub marker in deep chamber -->
  <circle cx="205" cy="162" r="5" fill="#3a0000" opacity="0.9"/>
  <text x="205" y="166" text-anchor="middle" font-family="serif" font-size="8" fill="#ff3030">👑</text>

  <!-- Skull markers for danger -->
  <text x="235" y="105" text-anchor="middle" font-family="serif" font-size="9" fill="#8a6aaa" opacity="0.7">☠</text>

  <!-- "You Are Here" marker -->
  <circle cx="40" cy="45" r="7" fill="#000000" opacity="0.5"/>
  <text x="40" y="49" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="40" cy="45" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>

  <!-- Zone border frame -->
  <rect width="280" height="200" fill="none" stroke="#4a2a08" stroke-width="2" rx="3"/>
</svg>`,
    connections: ['qeynos_hills', 'everfrost'],
    levelRange: [4, 16],
    xpModifier: 1.0,
    description: 'A sprawling gnoll dungeon connecting Qeynos Hills to Everfrost Peaks. Multiple winding tunnels descend into darkness around a massive central pit. Famous for gnoll trains and valuable loot.',
    enemies: [
      'gnoll_pup',
      'scrawny_gnoll',
      'gnoll',
      'burly_gnoll',
      'gnoll_guard',
      'gnoll_shaman',
      'gnoll_commander',
      'gnoll_high_shaman',
      'giant_plague_rat',
      'giant_snake_bb',
      'grizzly_bear',
      'lord_elgnub',
      'master_brewer',
    ],
    commonEnemies: [
      'scrawny_gnoll',
      'gnoll',
      'burly_gnoll',
      'gnoll_guard',
      'giant_plague_rat',
    ],
    rareEnemies: [
      'gnoll_shaman',
      'gnoll_commander',
      'gnoll_high_shaman',
      'giant_snake_bb',
      'lord_elgnub',
      'master_brewer',
    ],
    rareSpawnChance: 0.12,
    ambientColor: '#1a1008',
    connections: ['qeynos_hills', 'everfrost_peaks'],
    respawnTime: 22000,
  },
};

function getZone(id) {
  return ZONES[id] || null;
}

function getZoneEnemies(zoneId) {
  const zone = ZONES[zoneId];
  return zone ? zone.enemies : [];
}

if (typeof module !== 'undefined') module.exports = { ZONES, getZone, getZoneEnemies };
