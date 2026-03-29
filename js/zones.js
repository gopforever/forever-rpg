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
    groups: [
      { members: ['gnoll_pup', 'gnoll_pup'], weight: 4 },
      { members: ['gnoll', 'gnoll_pup'], weight: 3 },
      { members: ['gnoll_watcher', 'gnoll'], weight: 2 },
      { members: ['gray_wolf', 'gray_wolf'], weight: 3 },
      { members: ['bandit', 'bandit'], weight: 2 },
    ],
    groupSpawnChance: 0.30,
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
    levelRange: [4, 16],
    xpModifier: 1.1,
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
      'gnoll_pup', 'a_scrawny_gnoll', 'a_gnoll_guard', 'a_burly_gnoll', 'a_gnoll_shaman',
      'a_gnoll_guard_elite', 'a_giant_plague_rat', 'a_giant_snake_bb', 'lord_elgnub',
      'gnoll_high_shaman', 'gnoll_brewer', 'gnoll_commander', 'gnoll_high_shaman_bb',
      'gnoll_commander_bb', 'master_brewer', 'burly_gnoll', 'gnoll_guard',
      'giant_snake_bb', 'gnoll_shaman', 'tranixx_darkpaw',
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
      'tranixx_darkpaw',
    ],
    rareSpawnChance: 0.08,
    ambientColor: '#1a0f00',
    respawnTime: 6000,
    isDungeon: true,
    currentFloor: 1,
    floors: [
      {
        floor: 1,
        name: 'The Upper Warrens',
        levelRange: [4, 6],
        commonEnemies: ['gnoll_pup', 'a_scrawny_gnoll', 'a_gnoll_guard', 'a_giant_plague_rat'],
        miniBoss: 'gnoll_brewer',
        isFinalFloor: false,
      },
      {
        floor: 2,
        name: 'The Guard Barracks',
        levelRange: [6, 9],
        commonEnemies: ['burly_gnoll', 'a_burly_gnoll', 'gnoll_guard', 'a_gnoll_guard_elite'],
        miniBoss: 'master_brewer',
        isFinalFloor: false,
      },
      {
        floor: 3,
        name: "The Shaman's Den",
        levelRange: [9, 11],
        commonEnemies: ['a_gnoll_shaman', 'gnoll_shaman', 'a_giant_snake_bb', 'gnoll_commander_bb'],
        miniBoss: 'gnoll_high_shaman_bb',
        isFinalFloor: false,
      },
      {
        floor: 4,
        name: 'The Deep Warrens',
        levelRange: [11, 14],
        commonEnemies: ['gnoll_commander', 'gnoll_high_shaman', 'giant_snake_bb', 'a_gnoll_guard_elite'],
        miniBoss: 'lord_elgnub',
        isFinalFloor: false,
      },
      {
        floor: 5,
        name: 'The Darkpaw Throne',
        levelRange: [15, 16],
        commonEnemies: ['a_gnoll_guard_elite', 'gnoll_commander'],
        miniBoss: null,
        isFinalFloor: true,
        finalBoss: 'tranixx_darkpaw',
      },
    ],
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
    groups: [
      { members: ['a_scrawny_gnoll', 'a_gnoll_guard'], weight: 4 },
      { members: ['a_gnoll_guard', 'a_burly_gnoll'], weight: 3 },
      { members: ['a_gnoll_guard', 'a_gnoll_shaman'], weight: 2 },
      { members: ['a_burly_gnoll', 'a_gnoll_guard_elite'], weight: 1 },
    ],
    groupSpawnChance: 0.40,
    connections: ['qeynos_hills', 'everfrost_peaks'],
  },

  befallen: {
    id: 'befallen',
    name: 'Befallen',
    shortName: 'BEF',
    levelRange: [7, 26],
    xpModifier: 1.2,
    isDungeon: true,
    isSafeZone: false,
    description: 'A crumbling tower of stone and shadow, Befallen was once a fortress of light. Now it is a stronghold of undead, necromancers, and shadow knights. Wide level variance makes this dungeon treacherous from top to bottom.',
    flavorLines: [
      'Cold air rushes up from below, carrying the sweet stench of rot and old death.',
      'Somewhere in the dark, a necromancer whispers incantations to the walls.',
      'Shadow knight patrols march in lockstep through halls lit only by cold witchfire.',
      'A wave of dread washes over you as you step deeper into Befallen\'s crumbling corridors.',
      'The stones themselves seem to weep. Old bloodstains mark the walls like dark art.',
    ],
    enemies: [
      'giant_rat', 'plague_rat', 'decaying_skeleton', 'skeleton', 'dread_bone_skeleton',
      'putrid_skeleton', 'large_skeleton', 'greater_skeleton', 'lesser_mummy', 'ice_bone_skeleton',
      'ghoul', 'will_o_wisp_bef', 'necromancer_apprentice', 'neophyte', 'acolyte',
      'theurgist', 'a_shadowknight', 'a_shadowknight_elite',
      'boondin_babbinsbort', 'skeleton_lrodd', 'an_elf_skeleton', 'priest_amiaz',
      'the_thaumaturgist', 'commander_windstream', 'gynok_moltor',
    ],
    commonEnemies: [
      'giant_rat', 'plague_rat', 'decaying_skeleton', 'skeleton', 'dread_bone_skeleton',
      'putrid_skeleton', 'large_skeleton', 'greater_skeleton', 'lesser_mummy', 'ice_bone_skeleton',
      'ghoul', 'will_o_wisp_bef', 'necromancer_apprentice', 'neophyte', 'acolyte',
      'theurgist', 'a_shadowknight', 'a_shadowknight_elite',
    ],
    rareEnemies: [
      'boondin_babbinsbort', 'skeleton_lrodd', 'an_elf_skeleton', 'priest_amiaz',
      'the_thaumaturgist', 'commander_windstream', 'gynok_moltor',
    ],
    rareSpawnChance: 0.08,
    ambientColor: '#0d0a1a',
    respawnTime: 22000,
    currentFloor: 1,
    floors: [
      {
        floor: 1,
        name: 'The Forsaken Entry',
        levelRange: [7, 10],
        commonEnemies: ['giant_rat', 'plague_rat', 'decaying_skeleton', 'skeleton'],
        miniBoss: 'boondin_babbinsbort',
        isFinalFloor: false,
      },
      {
        floor: 2,
        name: 'The Haunted Halls',
        levelRange: [10, 14],
        commonEnemies: ['skeleton', 'dread_bone_skeleton', 'putrid_skeleton', 'a_shadowknight'],
        miniBoss: 'skeleton_lrodd',
        isFinalFloor: false,
      },
      {
        floor: 3,
        name: 'The Rotting Depths',
        levelRange: [13, 17],
        commonEnemies: ['large_skeleton', 'ghoul', 'lesser_mummy', 'neophyte'],
        miniBoss: 'an_elf_skeleton',
        isFinalFloor: false,
      },
      {
        floor: 4,
        name: 'The Crypt of Shadows',
        levelRange: [16, 20],
        commonEnemies: ['greater_skeleton', 'ice_bone_skeleton', 'acolyte', 'necromancer_apprentice'],
        miniBoss: 'priest_amiaz',
        isFinalFloor: false,
      },
      {
        floor: 5,
        name: 'The Sanctum of Marnek',
        levelRange: [19, 23],
        commonEnemies: ['will_o_wisp_bef', 'theurgist', 'a_shadowknight_elite', 'greater_skeleton'],
        miniBoss: 'the_thaumaturgist',
        isFinalFloor: false,
      },
      {
        floor: 6,
        name: 'The Dark Throne',
        levelRange: [23, 26],
        commonEnemies: ['a_shadowknight_elite', 'necromancer_apprentice'],
        miniBoss: null,
        isFinalFloor: true,
        finalBoss: 'gynok_moltor',
      },
    ],
    minimapSVG: `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="border-radius:4px;">
  <defs>
    <linearGradient id="befFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a0d2a"/>
      <stop offset="100%" stop-color="#0a0612"/>
    </linearGradient>
    <linearGradient id="befTorch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7a40cc" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#3a1066" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="befDeep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e0818"/>
      <stop offset="100%" stop-color="#060310"/>
    </linearGradient>
  </defs>

  <!-- Dark stone background -->
  <rect width="280" height="200" fill="#080510"/>

  <!-- Stone texture lines -->
  <line x1="0" y1="40" x2="280" y2="40" stroke="#14102a" stroke-width="1" opacity="0.6"/>
  <line x1="0" y1="80" x2="280" y2="80" stroke="#14102a" stroke-width="1" opacity="0.6"/>
  <line x1="0" y1="120" x2="280" y2="120" stroke="#14102a" stroke-width="1" opacity="0.6"/>
  <line x1="0" y1="160" x2="280" y2="160" stroke="#14102a" stroke-width="1" opacity="0.6"/>

  <!-- Entry Hall (top) -->
  <rect x="80" y="10" width="120" height="35" rx="3" fill="url(#befFloor)" stroke="#2a1a4a" stroke-width="1"/>
  <rect x="105" y="8" width="70" height="14" rx="2" fill="#000000" opacity="0.55"/>
  <text x="140" y="18" text-anchor="middle" font-family="serif" font-size="7" fill="#9a70cc">Entry Hall</text>

  <!-- Central corridor -->
  <rect x="125" y="45" width="30" height="50" rx="2" fill="url(#befFloor)" stroke="#2a1a4a" stroke-width="1"/>

  <!-- Left wing -->
  <rect x="20" y="55" width="110" height="30" rx="3" fill="url(#befFloor)" stroke="#2a1a4a" stroke-width="1"/>

  <!-- Right wing -->
  <rect x="150" y="55" width="110" height="30" rx="3" fill="url(#befFloor)" stroke="#2a1a4a" stroke-width="1"/>

  <!-- Crypt chamber (middle) -->
  <rect x="60" y="95" width="160" height="40" rx="4" fill="url(#befFloor)" stroke="#3a1a5a" stroke-width="1.5"/>
  <rect x="90" y="98" width="50" height="13" rx="2" fill="#000000" opacity="0.55"/>
  <text x="115" y="108" text-anchor="middle" font-family="serif" font-size="7" fill="#b080e0">Crypt</text>

  <!-- Descending staircase marker -->
  <rect x="130" y="140" width="20" height="24" rx="2" fill="#12082a" stroke="#4a2a7a" stroke-width="1"/>
  <line x1="134" y1="144" x2="146" y2="144" stroke="#6a40aa" stroke-width="1"/>
  <line x1="134" y1="149" x2="146" y2="149" stroke="#6a40aa" stroke-width="1"/>
  <line x1="134" y1="154" x2="146" y2="154" stroke="#6a40aa" stroke-width="1"/>
  <line x1="134" y1="159" x2="146" y2="159" stroke="#6a40aa" stroke-width="1"/>
  <text x="140" y="172" text-anchor="middle" font-family="serif" font-size="5.5" fill="#9060cc">▼ Down</text>

  <!-- Dark Throne chamber (bottom) -->
  <rect x="50" y="168" width="180" height="28" rx="4" fill="url(#befDeep)" stroke="#5a1a8a" stroke-width="2"/>
  <rect x="100" y="170" width="80" height="13" rx="2" fill="#000000" opacity="0.6"/>
  <text x="140" y="180" text-anchor="middle" font-family="serif" font-size="7" fill="#cc50aa">Dark Throne</text>

  <!-- Eerie purple torch glows -->
  <ellipse cx="55" cy="68" rx="10" ry="6" fill="url(#befTorch)" opacity="0.7"/>
  <ellipse cx="225" cy="68" rx="10" ry="6" fill="url(#befTorch)" opacity="0.7"/>
  <ellipse cx="100" cy="110" rx="8" ry="5" fill="url(#befTorch)" opacity="0.6"/>
  <ellipse cx="180" cy="110" rx="8" ry="5" fill="url(#befTorch)" opacity="0.6"/>
  <!-- Torch icons (blue-purple witchfire) -->
  <rect x="53" y="61" width="3" height="5" fill="#5a1a8a" rx="1"/>
  <circle cx="54.5" cy="60" r="2" fill="#9050cc" opacity="0.9"/>
  <rect x="223" y="61" width="3" height="5" fill="#5a1a8a" rx="1"/>
  <circle cx="224.5" cy="60" r="2" fill="#9050cc" opacity="0.9"/>
  <rect x="98" y="103" width="3" height="5" fill="#5a1a8a" rx="1"/>
  <circle cx="99.5" cy="102" r="2" fill="#7030aa" opacity="0.9"/>
  <rect x="178" y="103" width="3" height="5" fill="#5a1a8a" rx="1"/>
  <circle cx="179.5" cy="102" r="2" fill="#7030aa" opacity="0.9"/>

  <!-- Skull danger markers -->
  <text x="38" y="115" text-anchor="middle" font-family="serif" font-size="10" fill="#8a4aaa" opacity="0.75">☠</text>
  <text x="242" y="115" text-anchor="middle" font-family="serif" font-size="10" fill="#8a4aaa" opacity="0.75">☠</text>
  <text x="140" y="196" text-anchor="middle" font-family="serif" font-size="10" fill="#cc4088" opacity="0.8">☠</text>

  <!-- Zone exit arrow -->
  <rect x="2" y="14" width="26" height="14" fill="#0e0818" stroke="#2a1a4a" stroke-width="1" rx="2"/>
  <text x="15" y="24" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">◄ Exit</text>

  <!-- "You Are Here" gold star -->
  <circle cx="140" cy="27" r="7" fill="#000000" opacity="0.5"/>
  <text x="140" y="31" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="27" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>

  <!-- Zone border frame -->
  <rect width="280" height="200" fill="none" stroke="#3a1a5a" stroke-width="2" rx="3"/>
</svg>`,
    connections: ['commons_of_befallen'],
    groups: [
      { members: ['decaying_skeleton', 'skeleton'], weight: 4 },
      { members: ['skeleton', 'putrid_skeleton'], weight: 3 },
      { members: ['ghoul', 'lesser_mummy'], weight: 2 },
      { members: ['a_shadowknight', 'necromancer_apprentice'], weight: 2 },
      { members: ['neophyte', 'acolyte'], weight: 3 },
    ],
    groupSpawnChance: 0.35,
    unlockCondition: 'blackburrow_cleared',
  },

  everfrost_peaks: {
    id: 'everfrost_peaks',
    name: 'Everfrost Peaks',
    shortName: 'EF',
    levelRange: [10, 20],
    xpModifier: 1.1,
    description: 'A frozen wasteland of jagged ice and howling blizzards. The undead walk here, and worse things lurk beneath the snow.',
    enemies: [
      'frost_goblin',
      'ice_wolf',
      'snow_skeleton',
      'frozen_zombie',
      'everfrost_gnoll',
      'ice_giant_scout',
      'a_wooly_mammoth',
      'permafrost_spectre',
    ],
    commonEnemies: [
      'frost_goblin',
      'ice_wolf',
      'snow_skeleton',
      'frozen_zombie',
      'everfrost_gnoll',
    ],
    rareEnemies: [
      'ice_giant_scout',
      'a_wooly_mammoth',
      'permafrost_spectre',
    ],
    rareSpawnChance: 0.10,
    groups: [
      { members: ['frost_goblin', 'frost_goblin'], weight: 4 },
      { members: ['everfrost_gnoll', 'frost_goblin'], weight: 3 },
      { members: ['ice_wolf', 'ice_wolf'], weight: 3 },
      { members: ['snow_skeleton', 'frozen_zombie'], weight: 2 },
    ],
    groupSpawnChance: 0.25,
    respawnTime: 4000,
    isSafeZone: false,
    ambientColor: '#0a1a2a',
    connections: ['blackburrow'],
    flavorLines: [
      'The wind howls across the frozen tundra like a mourning spirit.',
      'Your breath fogs in the bitter air. Something moves beneath the snow.',
      'The creak of ice echoes from every direction.',
      'Skeletal figures stagger through the blizzard, drawn by living warmth.',
      'A distant roar shakes the permafrost. Something large is nearby.',
    ],
    minimapSVG: `<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style="border-radius:4px;">
  <defs>
    <linearGradient id="efSkyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1a2e"/>
      <stop offset="100%" stop-color="#1a3050"/>
    </linearGradient>
    <linearGradient id="efSnowGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c8ddf0"/>
      <stop offset="100%" stop-color="#8ab0cc"/>
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect width="280" height="200" fill="url(#efSkyGrad)"/>

  <!-- Stars -->
  <circle cx="20" cy="15" r="1" fill="#ffffff" opacity="0.8"/>
  <circle cx="55" cy="8" r="1.2" fill="#ffffff" opacity="0.9"/>
  <circle cx="100" cy="18" r="0.8" fill="#aaccff" opacity="0.7"/>
  <circle cx="145" cy="6" r="1" fill="#ffffff" opacity="0.8"/>
  <circle cx="200" cy="12" r="1.2" fill="#ffffff" opacity="0.9"/>
  <circle cx="245" cy="20" r="0.8" fill="#aaccff" opacity="0.7"/>
  <circle cx="265" cy="9" r="1" fill="#ffffff" opacity="0.8"/>

  <!-- Far mountain peaks -->
  <polygon points="0,110 30,55 60,110" fill="#1a2d42" opacity="0.9"/>
  <polygon points="40,110 80,40 120,110" fill="#1e3348" opacity="0.9"/>
  <polygon points="100,110 140,30 180,110" fill="#1a2d42" opacity="0.9"/>
  <polygon points="160,110 200,50 240,110" fill="#1e3348" opacity="0.9"/>
  <polygon points="220,110 255,60 280,110" fill="#1a2d42" opacity="0.9"/>

  <!-- Snow caps on peaks -->
  <polygon points="30,55 22,75 38,75" fill="#ddeeff" opacity="0.9"/>
  <polygon points="80,40 68,65 92,65" fill="#eef5ff" opacity="0.9"/>
  <polygon points="140,30 126,58 154,58" fill="#ddeeff" opacity="0.9"/>
  <polygon points="200,50 188,72 212,72" fill="#eef5ff" opacity="0.9"/>
  <polygon points="255,60 245,78 265,78" fill="#ddeeff" opacity="0.9"/>

  <!-- Snow ground -->
  <path d="M0,130 Q40,120 80,128 Q120,136 160,122 Q200,110 240,125 Q260,132 280,128 L280,200 L0,200 Z" fill="url(#efSnowGrad)"/>

  <!-- Snow drifts / texture -->
  <ellipse cx="60" cy="148" rx="30" ry="8" fill="#ddeeff" opacity="0.5"/>
  <ellipse cx="160" cy="140" rx="25" ry="6" fill="#ddeeff" opacity="0.5"/>
  <ellipse cx="230" cy="152" rx="20" ry="5" fill="#ddeeff" opacity="0.5"/>

  <!-- Ice formation (center) -->
  <polygon points="130,125 137,105 144,125" fill="#88bbdd" opacity="0.8"/>
  <polygon points="144,125 150,110 157,125" fill="#99ccee" opacity="0.7"/>

  <!-- Blackburrow connection arrow (left) -->
  <rect x="2" y="85" width="22" height="14" fill="#1a1008" stroke="#4a2a08" stroke-width="1" rx="2"/>
  <text x="13" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a" opacity="0.9">◄ BB</text>

  <!-- Skull marker (danger) -->
  <text x="245" y="100" text-anchor="middle" font-family="serif" font-size="10" fill="#6a8aaa" opacity="0.6">☠</text>

  <!-- "You Are Here" -->
  <circle cx="32" cy="92" r="7" fill="#000000" opacity="0.5"/>
  <text x="32" y="96" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="32" cy="92" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>

  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#2a4466" stroke-width="2" rx="3"/>
</svg>`,
  },

  west_karana: {
    id: 'west_karana',
    name: 'West Karana',
    shortName: 'WK',
    levelRange: [20, 30],
    xpModifier: 1.15,
    isDungeon: false,
    isSafeZone: false,
    description: 'Vast rolling plains stretching west from Qeynos. Bandits and gnolls roam alongside dangerous wildlife. The horizon seems endless.',
    enemies: [
      'karana_bandit', 'karana_raider', 'giant_wolf', 'plains_griffon',
      'karana_gnoll_warrior', 'plains_cyclops', 'dust_goblin',
    ],
    commonEnemies: [
      'karana_bandit', 'karana_raider', 'giant_wolf', 'karana_gnoll_warrior', 'dust_goblin',
    ],
    rareEnemies: [
      'plains_griffon', 'plains_cyclops',
    ],
    rareSpawnChance: 0.10,
    groups: [
      { members: ['karana_bandit', 'karana_bandit'], weight: 4 },
      { members: ['karana_bandit', 'karana_raider'], weight: 3 },
      { members: ['karana_gnoll_warrior', 'karana_gnoll_warrior'], weight: 3 },
      { members: ['giant_wolf', 'giant_wolf'], weight: 2 },
    ],
    groupSpawnChance: 0.25,
    respawnTime: 3500,
    ambientColor: '#1a1a0e',
    connections: ['qeynos_hills', 'highpass_hold'],
    flavorLines: [
      'The wind sweeps across endless plains, carrying the scent of distant rain.',
      'Wagon ruts scar the road — signs of caravans that may not have made it.',
      'A wolf howls in the distance. Then another. Then many.',
      'Dust rises on the horizon. Riders, or something worse, approach.',
      'The flat land offers no cover. Whatever is hunting you already sees you.',
    ],
    minimapSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200">
  <!-- Sky/horizon -->
  <rect width="280" height="200" fill="#2a2a14"/>
  <!-- Rolling plains ground -->
  <ellipse cx="70" cy="160" rx="90" ry="40" fill="#3a3318"/>
  <ellipse cx="200" cy="155" rx="100" ry="45" fill="#3d3619"/>
  <ellipse cx="140" cy="170" rx="120" ry="35" fill="#44391a"/>
  <!-- Grass patches -->
  <rect x="30" y="110" width="4" height="10" fill="#5a5c20" rx="1"/>
  <rect x="60" y="105" width="4" height="12" fill="#5a5c20" rx="1"/>
  <rect x="200" y="108" width="4" height="10" fill="#5a5c20" rx="1"/>
  <rect x="230" y="112" width="3" height="8" fill="#5a5c20" rx="1"/>
  <rect x="150" y="100" width="5" height="14" fill="#4e5018" rx="1"/>
  <!-- Road path -->
  <path d="M0,130 Q80,120 140,125 Q200,130 280,118" fill="none" stroke="#6b5a30" stroke-width="8" stroke-linecap="round"/>
  <path d="M0,130 Q80,120 140,125 Q200,130 280,118" fill="none" stroke="#7a6838" stroke-width="4" stroke-linecap="round" stroke-dasharray="15,10"/>
  <!-- Bandit camp marker -->
  <rect x="60" y="78" width="22" height="16" fill="#2a1a08" stroke="#6a4010" stroke-width="1" rx="2"/>
  <text x="71" y="89" text-anchor="middle" font-family="serif" font-size="6" fill="#c4962a">⚔ Camp</text>
  <!-- Gnoll outpost marker -->
  <rect x="190" y="72" width="30" height="16" fill="#1a2008" stroke="#405010" stroke-width="1" rx="2"/>
  <text x="205" y="83" text-anchor="middle" font-family="serif" font-size="5.5" fill="#80b040">Gnoll Post</text>
  <!-- Qeynos Hills connection (right) -->
  <rect x="256" y="85" width="22" height="14" fill="#1a2a0a" stroke="#2a4a0a" stroke-width="1" rx="2"/>
  <text x="267" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">QH ►</text>
  <!-- Highpass connection (left) -->
  <rect x="2" y="85" width="22" height="14" fill="#1a1008" stroke="#4a3008" stroke-width="1" rx="2"/>
  <text x="13" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">◄ HP</text>
  <!-- You Are Here -->
  <circle cx="140" cy="125" r="7" fill="#000000" opacity="0.5"/>
  <text x="140" y="129" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="125" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#44391a" stroke-width="2" rx="3"/>
</svg>`,
  },

  highpass_hold: {
    id: 'highpass_hold',
    name: 'Highpass Hold',
    shortName: 'HP',
    levelRange: [25, 35],
    xpModifier: 1.2,
    isDungeon: false,
    isSafeZone: false,
    description: 'A dangerous mountain pass controlled by the Highpass guards and plagued by bandits and gnoll war parties. Narrow paths wind between sheer cliffs.',
    enemies: [
      'highpass_guard', 'pass_bandit', 'gnoll_war_chief', 'mountain_bear',
      'highpass_skeleton', 'rock_troll',
    ],
    commonEnemies: [
      'highpass_guard', 'pass_bandit', 'mountain_bear', 'highpass_skeleton',
    ],
    rareEnemies: [
      'gnoll_war_chief', 'rock_troll',
    ],
    rareSpawnChance: 0.12,
    groups: [
      { members: ['highpass_guard', 'highpass_guard'], weight: 4 },
      { members: ['pass_bandit', 'pass_bandit'], weight: 3 },
      { members: ['highpass_guard', 'highpass_skeleton'], weight: 2 },
      { members: ['mountain_bear', 'highpass_skeleton'], weight: 2 },
    ],
    groupSpawnChance: 0.30,
    respawnTime: 4000,
    ambientColor: '#1a1208',
    connections: ['west_karana', 'kithicor_forest', 'lake_of_ill_omen'],
    flavorLines: [
      'The narrow path winds between sheer cliff faces. One wrong step means a fatal fall.',
      'The wind screams through the pass, masking the sound of approaching danger.',
      'Rock slides have claimed many travelers here. The bones prove it.',
      'Gnoll war drums echo off the stone walls, growing ever louder.',
      'The guards here don\'t look friendly. Neither do the things behind them.',
    ],
    minimapSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200">
  <!-- Dark background -->
  <rect width="280" height="200" fill="#141008"/>
  <!-- Mountain silhouettes -->
  <polygon points="0,200 40,60 80,200" fill="#2a2018"/>
  <polygon points="50,200 100,40 150,200" fill="#2e2418"/>
  <polygon points="130,200 180,50 230,200" fill="#2a2018"/>
  <polygon points="200,200 250,65 280,200" fill="#262018"/>
  <!-- Rocky pass floor -->
  <path d="M0,155 Q70,145 140,150 Q210,155 280,145" fill="#3a3025" stroke="none"/>
  <!-- Narrow path -->
  <path d="M10,160 Q80,152 140,156 Q200,160 270,150" fill="none" stroke="#5a4830" stroke-width="6"/>
  <!-- Cliff walls with stone texture -->
  <rect x="0" y="80" width="30" height="80" fill="#302820" rx="2"/>
  <rect x="250" y="85" width="30" height="75" fill="#302820" rx="2"/>
  <line x1="5" y1="90" x2="25" y2="100" stroke="#403830" stroke-width="1"/>
  <line x1="5" y1="110" x2="25" y2="118" stroke="#403830" stroke-width="1"/>
  <line x1="255" y1="92" x2="275" y2="103" stroke="#403830" stroke-width="1"/>
  <!-- Guard post marker -->
  <rect x="100" y="70" width="26" height="16" fill="#182030" stroke="#304060" stroke-width="1" rx="2"/>
  <text x="113" y="81" text-anchor="middle" font-family="serif" font-size="5.5" fill="#8ab0d0">⚔ Guard</text>
  <!-- Troll cave marker -->
  <rect x="180" y="75" width="26" height="16" fill="#201808" stroke="#604020" stroke-width="1" rx="2"/>
  <text x="193" y="86" text-anchor="middle" font-family="serif" font-size="5.5" fill="#b06030">Troll Cave</text>
  <!-- West Karana connection (right) -->
  <rect x="256" y="85" width="22" height="14" fill="#1a2a0a" stroke="#2a4a0a" stroke-width="1" rx="2"/>
  <text x="267" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">WK ►</text>
  <!-- Kithicor connection (left) -->
  <rect x="2" y="85" width="22" height="14" fill="#0a180a" stroke="#1a3010" stroke-width="1" rx="2"/>
  <text x="13" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">◄ KF</text>
  <!-- You Are Here -->
  <circle cx="140" cy="153" r="7" fill="#000000" opacity="0.5"/>
  <text x="140" y="157" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="153" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#302820" stroke-width="2" rx="3"/>
</svg>`,
  },

  kithicor_forest: {
    id: 'kithicor_forest',
    name: 'Kithicor Forest',
    shortName: 'KF',
    levelRange: [30, 42],
    xpModifier: 1.25,
    isDungeon: false,
    isSafeZone: false,
    description: 'Once a peaceful forest, Kithicor is now haunted by undead soldiers from a battle fought long ago. Dark magic pervades the trees at night. Incredibly dangerous for the unwary.',
    enemies: [
      'kithicor_skeleton', 'kithicor_zombie', 'kithicor_warrior_spirit',
      'corrupted_treant', 'kithicor_dark_elf', 'general_kill_anaz',
    ],
    commonEnemies: [
      'kithicor_skeleton', 'kithicor_zombie', 'kithicor_warrior_spirit',
      'corrupted_treant', 'kithicor_dark_elf',
    ],
    rareEnemies: [
      'general_kill_anaz',
    ],
    rareSpawnChance: 0.15,
    groups: [
      { members: ['kithicor_skeleton', 'kithicor_skeleton'], weight: 4 },
      { members: ['kithicor_zombie', 'kithicor_skeleton'], weight: 3 },
      { members: ['kithicor_warrior_spirit', 'kithicor_skeleton'], weight: 2 },
      { members: ['corrupted_treant', 'kithicor_zombie'], weight: 2 },
    ],
    groupSpawnChance: 0.35,
    respawnTime: 4500,
    ambientColor: '#080e08',
    connections: ['highpass_hold', 'commonlands'],
    flavorLines: [
      'The trees are wrong here. Their bark is black and their branches reach like skeletal hands.',
      'Whispers rise from the forest floor — the voices of soldiers long dead.',
      'A spectral light drifts between the trees. Don\'t follow it.',
      'The air smells of old battlefields: rot, rust, and something that has no name.',
      'Something moves in the canopy. It is watching you.',
    ],
    minimapSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200">
  <!-- Dark background -->
  <rect width="280" height="200" fill="#050c05"/>
  <!-- Forest ground -->
  <ellipse cx="140" cy="175" rx="140" ry="40" fill="#0d1a0d"/>
  <!-- Skeletal tree silhouettes -->
  <line x1="30" y1="170" x2="30" y2="60" stroke="#1a2a1a" stroke-width="4"/>
  <line x1="30" y1="90" x2="10" y2="70" stroke="#1a2a1a" stroke-width="2"/>
  <line x1="30" y1="90" x2="50" y2="65" stroke="#1a2a1a" stroke-width="2"/>
  <line x1="30" y1="110" x2="8" y2="95" stroke="#1a2a1a" stroke-width="1.5"/>
  <line x1="80" y1="170" x2="80" y2="50" stroke="#1e2e1a" stroke-width="5"/>
  <line x1="80" y1="80" x2="55" y2="55" stroke="#1a2a1a" stroke-width="2.5"/>
  <line x1="80" y1="80" x2="105" y2="58" stroke="#1a2a1a" stroke-width="2.5"/>
  <line x1="80" y1="110" x2="60" y2="98" stroke="#1a2a1a" stroke-width="1.5"/>
  <line x1="200" y1="170" x2="200" y2="55" stroke="#1a2a1a" stroke-width="4"/>
  <line x1="200" y1="85" x2="178" y2="62" stroke="#1a2a1a" stroke-width="2"/>
  <line x1="200" y1="85" x2="222" y2="60" stroke="#1a2a1a" stroke-width="2"/>
  <line x1="240" y1="170" x2="240" y2="65" stroke="#1e2e1a" stroke-width="5"/>
  <line x1="240" y1="95" x2="215" y2="72" stroke="#1a2a1a" stroke-width="2.5"/>
  <line x1="240" y1="95" x2="265" y2="70" stroke="#1a2a1a" stroke-width="2.5"/>
  <!-- Ghostly lights -->
  <circle cx="60" cy="130" r="5" fill="#40ff80" opacity="0.3"/>
  <circle cx="60" cy="130" r="8" fill="none" stroke="#40ff80" stroke-width="1" opacity="0.2"/>
  <circle cx="190" cy="120" r="4" fill="#80ffff" opacity="0.25"/>
  <circle cx="140" cy="100" r="3" fill="#c0ffb0" opacity="0.2"/>
  <!-- Battlefield marker -->
  <rect x="98" y="78" width="36" height="16" fill="#0a100a" stroke="#203020" stroke-width="1" rx="2"/>
  <text x="116" y="89" text-anchor="middle" font-family="serif" font-size="5.5" fill="#60a060">☠ Battlefield</text>
  <!-- General's tomb marker -->
  <rect x="150" y="55" width="32" height="16" fill="#0a080a" stroke="#301830" stroke-width="1" rx="2"/>
  <text x="166" y="66" text-anchor="middle" font-family="serif" font-size="5" fill="#a060c0">General's Tomb</text>
  <!-- Highpass connection (right) -->
  <rect x="256" y="85" width="22" height="14" fill="#141008" stroke="#302808" stroke-width="1" rx="2"/>
  <text x="267" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">HP ►</text>
  <!-- Commonlands connection (left) -->
  <rect x="2" y="85" width="22" height="14" fill="#160e08" stroke="#3a2008" stroke-width="1" rx="2"/>
  <text x="13" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">◄ CL</text>
  <!-- You Are Here -->
  <circle cx="140" cy="145" r="7" fill="#000000" opacity="0.6"/>
  <text x="140" y="149" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="145" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#1a2a1a" stroke-width="2" rx="3"/>
</svg>`,
  },

  commonlands: {
    id: 'commonlands',
    name: 'Commonlands',
    shortName: 'CL',
    levelRange: [38, 50],
    xpModifier: 1.3,
    isDungeon: false,
    isSafeZone: false,
    description: 'Broad dusty plains south of the Feerrott. Orc war parties from the Crushbone stronghold march these roads, and worse things lurk in the gullies. The staging ground for mid-level adventurers.',
    enemies: [
      'orc_warrior', 'orc_shaman', 'orc_captain', 'commonlands_lion',
      'dark_elf_ranger', 'crushbone_warlord', 'plague_spectre',
    ],
    commonEnemies: [
      'orc_warrior', 'orc_shaman', 'orc_captain', 'commonlands_lion', 'dark_elf_ranger',
    ],
    rareEnemies: [
      'crushbone_warlord', 'plague_spectre',
    ],
    rareSpawnChance: 0.12,
    groups: [
      { members: ['orc_warrior', 'orc_warrior'], weight: 4 },
      { members: ['orc_warrior', 'orc_shaman'], weight: 3 },
      { members: ['orc_captain', 'orc_warrior'], weight: 2 },
      { members: ['orc_warrior', 'orc_warrior', 'orc_shaman'], weight: 1 },
    ],
    groupSpawnChance: 0.30,
    respawnTime: 5000,
    ambientColor: '#1a0e08',
    connections: ['kithicor_forest', 'plane_of_fear', 'lake_of_ill_omen'],
    flavorLines: [
      'The road is rutted by the passage of orc war parties. The dust never settles.',
      'Orc drums beat in the distance — a war march growing closer.',
      'The skulls of fallen adventurers line the road as a warning. Heed it.',
      'Something enormous prowls the gully to the south, leaving massive tracks.',
      'A dark elf scout watches from a rocky outcrop. It doesn\'t try to hide.',
    ],
    minimapSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200">
  <!-- Dusty plains background -->
  <rect width="280" height="200" fill="#1e1208"/>
  <!-- Ground terrain -->
  <ellipse cx="140" cy="180" rx="150" ry="45" fill="#2a1c0e"/>
  <ellipse cx="50" cy="165" rx="70" ry="30" fill="#2e1e10"/>
  <ellipse cx="230" cy="168" rx="80" ry="32" fill="#2c1c0e"/>
  <!-- Dusty road -->
  <path d="M0,148 Q90,140 140,144 Q190,148 280,138" fill="none" stroke="#5a4020" stroke-width="10"/>
  <path d="M0,148 Q90,140 140,144 Q190,148 280,138" fill="none" stroke="#6a5030" stroke-width="5" stroke-dasharray="20,12"/>
  <!-- Orc camp markers -->
  <rect x="55" y="72" width="28" height="16" fill="#1a0e04" stroke="#4a2808" stroke-width="1" rx="2"/>
  <text x="69" y="83" text-anchor="middle" font-family="serif" font-size="5.5" fill="#b05020">⚔ Orc Camp</text>
  <rect x="180" y="68" width="36" height="16" fill="#1a0e04" stroke="#4a2808" stroke-width="1" rx="2"/>
  <text x="198" y="79" text-anchor="middle" font-family="serif" font-size="5" fill="#b05020">Warlord Fortress</text>
  <!-- Dark elf outpost -->
  <rect x="120" y="48" width="36" height="16" fill="#10081a" stroke="#301040" stroke-width="1" rx="2"/>
  <text x="138" y="59" text-anchor="middle" font-family="serif" font-size="5" fill="#9060c0">Dark Elf Post</text>
  <!-- Rocky gullies -->
  <path d="M20,175 Q60,160 80,175" fill="none" stroke="#3a2810" stroke-width="3"/>
  <path d="M190,172 Q230,158 260,173" fill="none" stroke="#3a2810" stroke-width="3"/>
  <!-- Skull warnings along road -->
  <text x="40" y="145" font-family="serif" font-size="8" fill="#804020" opacity="0.8">☠</text>
  <text x="230" y="142" font-family="serif" font-size="8" fill="#804020" opacity="0.8">☠</text>
  <!-- Kithicor Forest connection (right) -->
  <rect x="256" y="85" width="22" height="14" fill="#0a180a" stroke="#1a3010" stroke-width="1" rx="2"/>
  <text x="267" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">KF ►</text>
  <!-- You Are Here -->
  <circle cx="140" cy="144" r="7" fill="#000000" opacity="0.5"/>
  <text x="140" y="148" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="144" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#3a2010" stroke-width="2" rx="3"/>
</svg>`,
  },

  // ─── Plane of Fear ─────────────────────────────────────────────────────────

  plane_of_fear: {
    id: 'plane_of_fear',
    name: 'Plane of Fear',
    shortName: 'PoF',
    levelRange: [45, 55],
    xpModifier: 1.5,
    isDungeon: false,
    isSafeZone: false,
    description: 'The Plane of Fear is the realm of Cazic-Thule, the Faceless — a dimension of pure dread where mortals are unmade by terror. Ancient constructs, thought horrors, and the undead dracoliche stalk this hellish landscape.',
    enemies: [
      'fear_golem', 'thought_horror', 'dracoliche', 'frenzied_puma',
      'amygdalan_warrior', 'cazic_thule',
    ],
    commonEnemies: [
      'fear_golem', 'thought_horror', 'dracoliche', 'frenzied_puma', 'amygdalan_warrior',
    ],
    rareEnemies: ['cazic_thule'],
    rareSpawnChance: 0.04,
    groups: [
      { members: ['fear_golem', 'amygdalan_warrior'], weight: 4 },
      { members: ['fear_golem', 'fear_golem'], weight: 3 },
      { members: ['frenzied_puma', 'frenzied_puma'], weight: 3 },
      { members: ['frenzied_puma', 'frenzied_puma', 'frenzied_puma'], weight: 1 },
      { members: ['amygdalan_warrior', 'amygdalan_warrior'], weight: 2 },
    ],
    groupSpawnChance: 0.35,
    respawnTime: 8000,
    ambientColor: '#1a0014',
    connections: ['commonlands'],
    flavorLines: [
      'The air itself trembles here. Reality feels thin, like a membrane about to tear.',
      'Lava cracks split the obsidian ground, filling the sky with the stench of sulfur and despair.',
      'Twisted spires of black stone jut from the earth like broken teeth. Something writhes at their bases.',
      'Glowing eyes watch from every shadow. They do not blink. They never blink.',
      'Cazic-Thule\'s presence permeates every stone. To be here is to know true fear.',
    ],
    minimapSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200">
  <!-- Dark hellish background -->
  <rect width="280" height="200" fill="#0d000d"/>
  <!-- Lava ground cracks -->
  <path d="M0,180 Q40,170 80,175 Q120,180 160,172 Q200,165 280,178" fill="#1a0014" stroke="none"/>
  <path d="M20,190 Q60,175 100,185 Q140,195 180,178 Q220,162 280,185" fill="#200018" stroke="none"/>
  <!-- Lava crack lines -->
  <path d="M30,185 Q50,160 70,180 Q90,160 110,185" fill="none" stroke="#ff2200" stroke-width="2" opacity="0.8"/>
  <path d="M130,190 Q155,165 175,188 Q195,168 215,190" fill="none" stroke="#ff4400" stroke-width="1.5" opacity="0.7"/>
  <path d="M0,175 Q25,155 45,175" fill="none" stroke="#cc1100" stroke-width="2" opacity="0.6"/>
  <path d="M230,178 Q255,155 280,175" fill="none" stroke="#dd1100" stroke-width="2" opacity="0.6"/>
  <!-- Lava glow fills in cracks -->
  <path d="M30,185 Q50,160 70,180" fill="none" stroke="#ff6600" stroke-width="1" opacity="0.5"/>
  <path d="M130,190 Q155,165 175,188" fill="none" stroke="#ff8800" stroke-width="0.5" opacity="0.4"/>
  <!-- Twisted spires -->
  <polygon points="50,170 42,60 58,60" fill="#1a0020" stroke="#330033" stroke-width="1"/>
  <polygon points="50,170 44,55 56,55" fill="#220028" stroke="none"/>
  <polygon points="120,175 109,45 131,45" fill="#1c001c" stroke="#2a0028" stroke-width="1"/>
  <polygon points="200,172 190,70 210,70" fill="#1a0020" stroke="#330033" stroke-width="1"/>
  <polygon points="250,175 243,80 257,80" fill="#1e001e" stroke="none"/>
  <!-- Spire glow tips -->
  <circle cx="50" cy="58" r="3" fill="#aa00ff" opacity="0.4"/>
  <circle cx="120" cy="47" r="4" fill="#cc00cc" opacity="0.35"/>
  <circle cx="200" cy="73" r="3" fill="#aa00ff" opacity="0.4"/>
  <circle cx="250" cy="83" r="2" fill="#9900cc" opacity="0.3"/>
  <!-- Glowing eyes in shadows -->
  <ellipse cx="80" cy="130" rx="3" ry="2" fill="#ff0000" opacity="0.8"/>
  <ellipse cx="86" cy="130" rx="3" ry="2" fill="#ff0000" opacity="0.8"/>
  <ellipse cx="160" cy="115" rx="3" ry="2" fill="#ff2200" opacity="0.7"/>
  <ellipse cx="166" cy="115" rx="3" ry="2" fill="#ff2200" opacity="0.7"/>
  <ellipse cx="220" cy="135" rx="2" ry="1.5" fill="#dd0000" opacity="0.6"/>
  <ellipse cx="225" cy="135" rx="2" ry="1.5" fill="#dd0000" opacity="0.6"/>
  <!-- Altar of Cazic-Thule marker -->
  <rect x="108" y="68" width="44" height="16" fill="#0d0010" stroke="#550055" stroke-width="1" rx="2"/>
  <text x="130" y="79" text-anchor="middle" font-family="serif" font-size="5.5" fill="#cc44cc">✦ Cazic's Altar</text>
  <!-- Golem Forge marker -->
  <rect x="28" y="88" width="38" height="14" fill="#100010" stroke="#440022" stroke-width="1" rx="2"/>
  <text x="47" y="98" text-anchor="middle" font-family="serif" font-size="5" fill="#ff4444">Golem Forge</text>
  <!-- Lava Pit marker -->
  <rect x="195" y="95" width="30" height="14" fill="#120006" stroke="#440000" stroke-width="1" rx="2"/>
  <text x="210" y="105" text-anchor="middle" font-family="serif" font-size="5" fill="#ff6600">Lava Pit</text>
  <!-- Commonlands connection (left) -->
  <rect x="2" y="85" width="22" height="14" fill="#160010" stroke="#3a0030" stroke-width="1" rx="2"/>
  <text x="13" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">◄ CL</text>
  <!-- You Are Here -->
  <circle cx="140" cy="148" r="7" fill="#000000" opacity="0.6"/>
  <text x="140" y="152" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="148" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#330022" stroke-width="2" rx="3"/>
</svg>`,
  },

  // ─── Lake of Ill Omen ──────────────────────────────────────────────────────

  lake_of_ill_omen: {
    id: 'lake_of_ill_omen',
    name: 'Lake of Ill Omen',
    shortName: 'LOIO',
    levelRange: [25, 35],
    xpModifier: 1.2,
    isDungeon: false,
    isSafeZone: false,
    description: 'A vast, murky lake on the continent of Kunark, fouled by Sarnak activity and goblin encampments along its shores. Iksar bandits lurk among the ruins, and something ancient watches from the deep water.',
    enemies: [
      'sarnak_warrior', 'sarnak_shaman', 'sarnak_berserker', 'froglok_tad',
      'lake_goblin', 'goblin_shaman', 'giant_crab', 'iksar_bandit', 'the_emissary',
    ],
    commonEnemies: [
      'sarnak_warrior', 'sarnak_shaman', 'sarnak_berserker', 'froglok_tad',
      'lake_goblin', 'goblin_shaman', 'giant_crab', 'iksar_bandit',
    ],
    rareEnemies: ['the_emissary'],
    rareSpawnChance: 0.06,
    groups: [
      { members: ['sarnak_warrior', 'sarnak_warrior'], weight: 4 },
      { members: ['sarnak_warrior', 'sarnak_shaman'], weight: 3 },
      { members: ['lake_goblin', 'lake_goblin'], weight: 4 },
      { members: ['lake_goblin', 'goblin_shaman'], weight: 3 },
      { members: ['sarnak_berserker', 'sarnak_warrior'], weight: 2 },
      { members: ['giant_crab', 'giant_crab'], weight: 2 },
    ],
    groupSpawnChance: 0.30,
    respawnTime: 4000,
    ambientColor: '#061410',
    connections: ['commonlands', 'highpass_hold'],
    flavorLines: [
      'The lake water is an unsettling green-black. Shapes move beneath the surface that have no name.',
      'Sarnak war drums echo across the still water from the eastern encampment.',
      'Rotting docks jut from the shore like broken fingers. The wood is black and slick with algae.',
      'Froglok tadpoles swarm in the shallows. Their presence usually means something worse is nearby.',
      'A mist hangs permanently over the lake, muffling sound and swallowing light. Omens are bad here.',
    ],
    minimapSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200">
  <!-- Dark murky background -->
  <rect width="280" height="200" fill="#060e0a"/>
  <!-- Lake water (murky green) -->
  <ellipse cx="140" cy="115" rx="120" ry="75" fill="#0a1e14"/>
  <ellipse cx="140" cy="115" rx="105" ry="62" fill="#0d2418"/>
  <!-- Water shimmer ripples -->
  <ellipse cx="110" cy="105" rx="30" ry="8" fill="none" stroke="#1a4028" stroke-width="1" opacity="0.5"/>
  <ellipse cx="170" cy="125" rx="25" ry="6" fill="none" stroke="#163820" stroke-width="1" opacity="0.4"/>
  <ellipse cx="140" cy="90" rx="20" ry="5" fill="none" stroke="#1a4028" stroke-width="0.5" opacity="0.3"/>
  <!-- Shore terrain -->
  <path d="M20,140 Q60,185 140,190 Q220,185 260,140" fill="#0e1a10" stroke="#122016" stroke-width="1"/>
  <path d="M0,130 Q30,175 140,180 Q250,175 280,130" fill="none" stroke="#0d2010" stroke-width="2"/>
  <!-- Ruined docks -->
  <rect x="35" y="135" width="4" height="25" fill="#1e1008" stroke="#2a1810" stroke-width="1"/>
  <rect x="45" y="132" width="4" height="28" fill="#1e1008" stroke="#2a1810" stroke-width="1"/>
  <rect x="55" y="137" width="4" height="22" fill="#1e1008" stroke="#2a1810" stroke-width="1"/>
  <path d="M35,136 Q45,133 55,138" fill="none" stroke="#2a1808" stroke-width="2"/>
  <rect x="210" y="133" width="4" height="26" fill="#1e1008" stroke="#2a1810" stroke-width="1"/>
  <rect x="220" y="136" width="4" height="23" fill="#1e1008" stroke="#2a1810" stroke-width="1"/>
  <path d="M210,134 Q220,137" fill="none" stroke="#2a1808" stroke-width="2"/>
  <!-- Ruins along shore -->
  <rect x="60" y="155" width="16" height="10" fill="#162018" stroke="#1e2c20" stroke-width="1" rx="1"/>
  <rect x="64" y="148" width="8" height="8" fill="#162018" stroke="none"/>
  <rect x="190" y="152" width="20" height="12" fill="#162018" stroke="#1e2c20" stroke-width="1" rx="1"/>
  <!-- Sarnak camp marker -->
  <rect x="170" y="55" width="38" height="14" fill="#0e0a08" stroke="#3a2808" stroke-width="1" rx="2"/>
  <text x="189" y="65" text-anchor="middle" font-family="serif" font-size="5" fill="#b05a20">⚔ Sarnak Camp</text>
  <!-- Goblin village marker -->
  <rect x="60" y="60" width="34" height="14" fill="#080e0a" stroke="#1a3010" stroke-width="1" rx="2"/>
  <text x="77" y="70" text-anchor="middle" font-family="serif" font-size="5" fill="#60a040">Goblin Village</text>
  <!-- Deep water marker -->
  <rect x="112" y="100" width="36" height="14" fill="#060e0a" stroke="#0a2818" stroke-width="1" rx="2"/>
  <text x="130" y="110" text-anchor="middle" font-family="serif" font-size="5" fill="#30a878">~ Deep Water ~</text>
  <!-- Commonlands connection (left) -->
  <rect x="2" y="85" width="22" height="14" fill="#0e1408" stroke="#1a2808" stroke-width="1" rx="2"/>
  <text x="13" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">◄ CL</text>
  <!-- Highpass Hold connection (right) -->
  <rect x="256" y="85" width="22" height="14" fill="#0e1008" stroke="#1a2008" stroke-width="1" rx="2"/>
  <text x="267" y="95" text-anchor="middle" font-family="serif" font-size="5.5" fill="#c4962a">HP ►</text>
  <!-- You Are Here -->
  <circle cx="140" cy="148" r="7" fill="#000000" opacity="0.5"/>
  <text x="140" y="152" text-anchor="middle" font-family="serif" font-size="12" fill="#ffd700">✦</text>
  <circle cx="140" cy="148" r="10" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
  <!-- Zone border -->
  <rect width="280" height="200" fill="none" stroke="#0e2010" stroke-width="2" rx="3"/>
</svg>`,
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
