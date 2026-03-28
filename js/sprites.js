'use strict';

/**
 * Map of entity IDs to inline SVG strings used to render enemy and
 * character icons throughout the UI.  Each key is an enemy/entity ID
 * (e.g. `"mangy_rat"`) and each value is a self-contained SVG markup
 * string sized at 64 × 64 viewBox units.
 * @type {Object.<string, string>}
 */
const SPRITES = {

  mangy_rat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M14 44 Q7 40 6 32 Q5 24 11 22" fill="none" stroke="#d4a0a0" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="31" cy="42" rx="16" ry="10" fill="#7a6e60"/>
    <ellipse cx="46" cy="36" rx="9" ry="8" fill="#7a6e60"/>
    <ellipse cx="43" cy="28" rx="4" ry="3" fill="#c49090"/>
    <ellipse cx="43" cy="28" rx="2.5" ry="2" fill="#e8b0b0"/>
    <ellipse cx="54" cy="37" rx="4" ry="3" fill="#6a5e50"/>
    <circle cx="57" cy="36" r="1.5" fill="#c08080"/>
    <circle cx="50" cy="33" r="1.5" fill="#111"/>
    <circle cx="50.5" cy="32.5" r="0.5" fill="#fff"/>
    <line x1="54" y1="36" x2="62" y2="33" stroke="#bbb" stroke-width="0.8"/>
    <line x1="54" y1="37" x2="63" y2="37" stroke="#bbb" stroke-width="0.8"/>
    <line x1="54" y1="38" x2="62" y2="40" stroke="#bbb" stroke-width="0.8"/>
    <line x1="24" y1="50" x2="22" y2="58" stroke="#6a5e50" stroke-width="2" stroke-linecap="round"/>
    <line x1="30" y1="52" x2="29" y2="60" stroke="#6a5e50" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="52" x2="37" y2="60" stroke="#6a5e50" stroke-width="2" stroke-linecap="round"/>
    <line x1="44" y1="50" x2="44" y2="58" stroke="#6a5e50" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="27" cy="39" rx="3" ry="2" fill="#5a5048" opacity="0.5"/>
    <ellipse cx="36" cy="45" rx="2" ry="1.5" fill="#5a5048" opacity="0.5"/>
  </svg>`,

  giant_rat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M10 46 Q3 38 4 28 Q5 18 12 19" fill="none" stroke="#b08080" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="31" cy="43" rx="20" ry="13" fill="#4e4840"/>
    <ellipse cx="49" cy="35" rx="12" ry="10" fill="#4e4840"/>
    <ellipse cx="46" cy="25" rx="5.5" ry="4" fill="#9a6868"/>
    <ellipse cx="46" cy="25" rx="3.5" ry="2.5" fill="#d09090"/>
    <ellipse cx="59" cy="37" rx="6" ry="4" fill="#3e3830"/>
    <circle cx="63" cy="35" r="2" fill="#b06060"/>
    <circle cx="53" cy="31" r="2.5" fill="#cc2222"/>
    <circle cx="53.8" cy="30.2" r="0.8" fill="#ff6666"/>
    <rect x="57" y="39" width="3" height="4" rx="1" fill="#eeeebb"/>
    <rect x="61" y="39" width="2.5" height="4" rx="1" fill="#eeeebb"/>
    <line x1="16" y1="54" x2="13" y2="63" stroke="#3e3830" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="26" y1="56" x2="24" y2="64" stroke="#3e3830" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="37" y1="56" x2="36" y2="64" stroke="#3e3830" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="46" y1="54" x2="46" y2="63" stroke="#3e3830" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  large_rat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M12 45 Q6 38 7 29 Q8 21 14 21" fill="none" stroke="#c4a090" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="31" cy="43" rx="18" ry="12" fill="#8b7355"/>
    <ellipse cx="47" cy="35" rx="10" ry="9" fill="#8b7355"/>
    <ellipse cx="44" cy="27" rx="5" ry="3.5" fill="#b89080"/>
    <ellipse cx="44" cy="27" rx="3" ry="2" fill="#e0a8a0"/>
    <ellipse cx="56" cy="37" rx="5" ry="3.5" fill="#7a6245"/>
    <circle cx="60" cy="36" r="2" fill="#b07070"/>
    <circle cx="51" cy="32" r="2" fill="#222"/>
    <circle cx="51.6" cy="31.4" r="0.7" fill="#fff"/>
    <line x1="55" y1="36" x2="63" y2="33" stroke="#ccc" stroke-width="0.9"/>
    <line x1="55" y1="37" x2="64" y2="37" stroke="#ccc" stroke-width="0.9"/>
    <line x1="55" y1="38" x2="63" y2="40" stroke="#ccc" stroke-width="0.9"/>
    <line x1="19" y1="53" x2="17" y2="61" stroke="#7a6245" stroke-width="2" stroke-linecap="round"/>
    <line x1="28" y1="55" x2="27" y2="63" stroke="#7a6245" stroke-width="2" stroke-linecap="round"/>
    <line x1="37" y1="55" x2="36" y2="63" stroke="#7a6245" stroke-width="2" stroke-linecap="round"/>
    <line x1="45" y1="53" x2="45" y2="61" stroke="#7a6245" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  fire_beetle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="38" rx="22" ry="14" fill="#cc3300"/>
    <ellipse cx="32" cy="38" rx="20" ry="12" fill="#e84a00"/>
    <line x1="32" y1="26" x2="32" y2="50" stroke="#aa2200" stroke-width="2"/>
    <ellipse cx="20" cy="24" rx="8" ry="6" fill="#222"/>
    <ellipse cx="44" cy="24" rx="8" ry="6" fill="#222"/>
    <ellipse cx="32" cy="22" rx="10" ry="8" fill="#111"/>
    <circle cx="26" cy="21" r="4" fill="#ff6600"/>
    <circle cx="26" cy="21" r="2.5" fill="#ffaa00"/>
    <circle cx="26" cy="21" r="1" fill="#fff"/>
    <circle cx="38" cy="21" r="4" fill="#ff6600"/>
    <circle cx="38" cy="21" r="2.5" fill="#ffaa00"/>
    <circle cx="38" cy="21" r="1" fill="#fff"/>
    <line x1="25" y1="16" x2="20" y2="10" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="32" y1="14" x2="32" y2="6" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="39" y1="16" x2="44" y2="10" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="12" y1="32" x2="3" y2="27" stroke="#aa2200" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="12" y1="38" x2="2" y2="38" stroke="#aa2200" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="12" y1="44" x2="3" y2="49" stroke="#aa2200" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="52" y1="32" x2="61" y2="27" stroke="#aa2200" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="52" y1="38" x2="62" y2="38" stroke="#aa2200" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="52" y1="44" x2="61" y2="49" stroke="#aa2200" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="38" rx="20" ry="12" fill="none" stroke="#cc4400" stroke-width="1"/>
    <path d="M14 32 Q32 28 50 32" fill="none" stroke="#cc4400" stroke-width="1"/>
    <path d="M14 38 Q32 34 50 38" fill="none" stroke="#cc4400" stroke-width="1"/>
    <path d="M14 44 Q32 40 50 44" fill="none" stroke="#cc4400" stroke-width="1"/>
  </svg>`,

  snake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M8 52 Q10 42 20 38 Q32 34 36 26 Q40 18 36 12" fill="none" stroke="#4a7c3f" stroke-width="9" stroke-linecap="round"/>
    <path d="M8 52 Q10 42 20 38 Q32 34 36 26 Q40 18 36 12" fill="none" stroke="#5a9e4e" stroke-width="7" stroke-linecap="round"/>
    <path d="M8 52 Q10 42 20 38 Q32 34 36 26 Q40 18 36 12" fill="none" stroke="#6bbf5d" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="34" cy="10" rx="8" ry="6" fill="#4a7c3f" transform="rotate(-20 34 10)"/>
    <ellipse cx="34" cy="10" rx="6" ry="4.5" fill="#5a9e4e" transform="rotate(-20 34 10)"/>
    <circle cx="31" cy="7" r="1.5" fill="#111"/>
    <circle cx="31.4" cy="6.6" r="0.5" fill="#fff"/>
    <circle cx="37" cy="8" r="1.5" fill="#111"/>
    <circle cx="37.4" cy="7.6" r="0.5" fill="#fff"/>
    <path d="M38 14 L41 11 M38 14 L42 15" fill="none" stroke="#cc2222" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M8 52 Q10 42 20 38 Q32 34 36 26 Q40 18 36 12" fill="none" stroke="#7ed66e" stroke-width="2" stroke-dasharray="4,6" opacity="0.5"/>
  </svg>`,

  king_snake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M6 55 Q8 44 18 40 Q30 36 34 26 Q38 16 34 8" fill="none" stroke="#3a6e2e" stroke-width="11" stroke-linecap="round"/>
    <path d="M6 55 Q8 44 18 40 Q30 36 34 26 Q38 16 34 8" fill="none" stroke="#2ea830" stroke-width="9" stroke-linecap="round"/>
    <path d="M6 55 Q8 44 18 40 Q30 36 34 26 Q38 16 34 8" fill="none" stroke="#50d040" stroke-width="7" stroke-linecap="round"/>
    <path d="M6 55 Q8 44 18 40 Q30 36 34 26 Q38 16 34 8" fill="none" stroke="#e8d820" stroke-width="2" stroke-dasharray="5,5" opacity="0.8"/>
    <ellipse cx="32" cy="6" rx="10" ry="7" fill="#2ea830" transform="rotate(-20 32 6)"/>
    <ellipse cx="32" cy="6" rx="8" ry="5.5" fill="#50d040" transform="rotate(-20 32 6)"/>
    <polygon points="28,1 32,-3 36,1" fill="#e8c800"/>
    <polygon points="32,-3 30,-6 34,-6" fill="#e8c800"/>
    <circle cx="28" cy="4" r="2" fill="#111"/>
    <circle cx="28.5" cy="3.5" r="0.7" fill="#fff"/>
    <circle cx="36" cy="5" r="2" fill="#111"/>
    <circle cx="36.5" cy="4.5" r="0.7" fill="#fff"/>
    <path d="M36 10 L40 6 M36 10 L41 12" fill="none" stroke="#ffaa00" stroke-width="2" stroke-linecap="round"/>
    <circle cx="26" cy="35" r="2" fill="#e8c800" opacity="0.7"/>
    <circle cx="32" cy="30" r="2" fill="#e8c800" opacity="0.7"/>
    <circle cx="20" cy="42" r="2" fill="#e8c800" opacity="0.7"/>
  </svg>`,

  bat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <polygon points="32,28 10,16 4,30 18,34" fill="#3a2a1e"/>
    <polygon points="32,28 54,16 60,30 46,34" fill="#3a2a1e"/>
    <polygon points="18,34 4,30 8,42 20,40" fill="#2a1e14"/>
    <polygon points="46,34 60,30 56,42 44,40" fill="#2a1e14"/>
    <ellipse cx="32" cy="36" rx="10" ry="9" fill="#2a1e14"/>
    <polygon points="26,28 22,20 28,26" fill="#2a1e14"/>
    <polygon points="38,28 42,20 36,26" fill="#2a1e14"/>
    <circle cx="28" cy="34" r="2" fill="#cc1111"/>
    <circle cx="28.5" cy="33.5" r="0.7" fill="#ff5555"/>
    <circle cx="36" cy="34" r="2" fill="#cc1111"/>
    <circle cx="36.5" cy="33.5" r="0.7" fill="#ff5555"/>
    <path d="M30 39 L29 42 M30 39 L31 42 M34 39 L33 42 M34 39 L35 42" fill="none" stroke="#1a1008" stroke-width="1.2"/>
    <path d="M28 37 Q32 40 36 37" fill="none" stroke="#1a1008" stroke-width="1"/>
  </svg>`,

  giant_bat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <polygon points="32,30 6,12 1,28 16,36" fill="#1a0e08"/>
    <polygon points="32,30 58,12 63,28 48,36" fill="#1a0e08"/>
    <polygon points="16,36 1,28 4,46 18,43" fill="#140a04"/>
    <polygon points="48,36 63,28 60,46 46,43" fill="#140a04"/>
    <polygon points="16,36 12,48 22,44" fill="#140a04"/>
    <polygon points="48,36 52,48 42,44" fill="#140a04"/>
    <ellipse cx="32" cy="38" rx="12" ry="11" fill="#1a0e08"/>
    <polygon points="25,27 20,17 27,26" fill="#1a0e08"/>
    <polygon points="39,27 44,17 37,26" fill="#1a0e08"/>
    <circle cx="27" cy="36" r="3" fill="#dd1111"/>
    <circle cx="28" cy="35" r="1" fill="#ff4444"/>
    <circle cx="37" cy="36" r="3" fill="#dd1111"/>
    <circle cx="38" cy="35" r="1" fill="#ff4444"/>
    <path d="M28 42 Q32 46 36 42" fill="none" stroke="#0a0604" stroke-width="1.5"/>
    <path d="M29 44 L28 48 M32 45 L32 49 M35 44 L36 48" fill="none" stroke="#0a0604" stroke-width="1.5"/>
  </svg>`,

  gnoll_pup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="22" y="36" width="20" height="20" rx="3" fill="#8b6914"/>
    <ellipse cx="32" cy="26" rx="11" ry="12" fill="#a07820"/>
    <polygon points="24,18 20,8 27,16" fill="#a07820"/>
    <polygon points="40,18 44,8 37,16" fill="#a07820"/>
    <polygon points="24,18 20,8 27,16" fill="#c8a030" opacity="0.5"/>
    <polygon points="40,18 44,8 37,16" fill="#c8a030" opacity="0.5"/>
    <ellipse cx="32" cy="30" rx="6" ry="5" fill="#c8a030"/>
    <circle cx="28" cy="24" r="2" fill="#1a1008"/>
    <circle cx="28.5" cy="23.5" r="0.7" fill="#fff"/>
    <circle cx="36" cy="24" r="2" fill="#1a1008"/>
    <circle cx="36.5" cy="23.5" r="0.7" fill="#fff"/>
    <circle cx="32" cy="31" r="1.5" fill="#3a1a08"/>
    <path d="M28 34 Q32 37 36 34" fill="none" stroke="#3a1a08" stroke-width="1.2"/>
    <line x1="22" y1="56" x2="20" y2="64" stroke="#6a4a08" stroke-width="3" stroke-linecap="round"/>
    <line x1="42" y1="56" x2="44" y2="64" stroke="#6a4a08" stroke-width="3" stroke-linecap="round"/>
    <line x1="25" y1="36" x2="20" y2="44" stroke="#6a4a08" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="39" y1="36" x2="44" y2="44" stroke="#6a4a08" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  gnoll: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="20" y="32" width="24" height="24" rx="3" fill="#7a5a10"/>
    <rect x="20" y="32" width="24" height="10" rx="2" fill="#5a4008" opacity="0.7"/>
    <ellipse cx="32" cy="22" rx="12" ry="12" fill="#9a7818"/>
    <polygon points="23,14 18,4 26,13" fill="#9a7818"/>
    <polygon points="41,14 46,4 38,13" fill="#9a7818"/>
    <polygon points="23,14 18,4 26,13" fill="#c8a030" opacity="0.6"/>
    <polygon points="41,14 46,4 38,13" fill="#c8a030" opacity="0.6"/>
    <ellipse cx="32" cy="27" rx="7" ry="6" fill="#c8a030"/>
    <circle cx="27" cy="20" r="2.5" fill="#1a1008"/>
    <circle cx="27.7" cy="19.3" r="0.8" fill="#fff"/>
    <circle cx="37" cy="20" r="2.5" fill="#1a1008"/>
    <circle cx="37.7" cy="19.3" r="0.8" fill="#fff"/>
    <circle cx="32" cy="28" r="2" fill="#3a1a08"/>
    <path d="M27 31 Q32 35 37 31" fill="none" stroke="#3a1a08" stroke-width="1.5"/>
    <rect x="42" y="34" width="4" height="18" rx="2" fill="#888" transform="rotate(10 42 34)"/>
    <polygon points="46,34 50,28 52,36" fill="#aaa" transform="rotate(10 42 34)"/>
    <line x1="20" y1="56" x2="17" y2="64" stroke="#5a4008" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="44" y1="56" x2="47" y2="64" stroke="#5a4008" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="23" y1="33" x2="16" y2="48" stroke="#5a4008" stroke-width="3" stroke-linecap="round"/>
    <line x1="41" y1="33" x2="48" y2="48" stroke="#5a4008" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  gnoll_scout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="20" y="32" width="22" height="23" rx="3" fill="#5a7a20"/>
    <rect x="20" y="32" width="22" height="8" rx="2" fill="#3a5010" opacity="0.8"/>
    <ellipse cx="31" cy="21" rx="11" ry="11" fill="#9a7818"/>
    <polygon points="23,13 18,3 26,12" fill="#9a7818"/>
    <polygon points="39,13 44,3 36,12" fill="#9a7818"/>
    <polygon points="23,13 18,3 26,12" fill="#c8a030" opacity="0.5"/>
    <polygon points="39,13 44,3 36,12" fill="#c8a030" opacity="0.5"/>
    <ellipse cx="31" cy="25" rx="6" ry="5" fill="#c8a030"/>
    <circle cx="27" cy="19" r="2" fill="#1a1008"/>
    <circle cx="27.5" cy="18.5" r="0.7" fill="#fff"/>
    <circle cx="35" cy="19" r="2" fill="#1a1008"/>
    <circle cx="35.5" cy="18.5" r="0.7" fill="#fff"/>
    <line x1="8" y1="22" x2="42" y2="35" stroke="#8a6820" stroke-width="2" stroke-linecap="round"/>
    <circle cx="9" cy="22" r="2" fill="#7a5818"/>
    <line x1="20" y1="55" x2="17" y2="63" stroke="#3a5010" stroke-width="3" stroke-linecap="round"/>
    <line x1="42" y1="55" x2="45" y2="63" stroke="#3a5010" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="33" x2="15" y2="47" stroke="#3a5010" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="40" y1="33" x2="47" y2="47" stroke="#3a5010" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  gnoll_watcher: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="19" y="31" width="24" height="24" rx="3" fill="#8a7020"/>
    <rect x="19" y="31" width="24" height="9" rx="2" fill="#6a5010" opacity="0.8"/>
    <ellipse cx="31" cy="21" rx="12" ry="12" fill="#9a7818"/>
    <polygon points="22,13 17,2 25,12" fill="#9a7818"/>
    <polygon points="40,13 45,2 37,12" fill="#9a7818"/>
    <ellipse cx="31" cy="26" rx="7" ry="6" fill="#c8a030"/>
    <circle cx="26" cy="19" r="2.5" fill="#ee8800"/>
    <circle cx="26.7" cy="18.3" r="0.9" fill="#ffcc44"/>
    <circle cx="36" cy="19" r="2.5" fill="#ee8800"/>
    <circle cx="36.7" cy="18.3" r="0.9" fill="#ffcc44"/>
    <circle cx="31" cy="27" r="2" fill="#3a1a08"/>
    <rect x="6" y="30" width="14" height="8" rx="2" fill="#7a6010" transform="rotate(-10 6 30)"/>
    <rect x="6" y="30" width="14" height="8" rx="2" fill="none" stroke="#aaa" stroke-width="1" transform="rotate(-10 6 30)"/>
    <line x1="19" y1="55" x2="16" y2="63" stroke="#6a5010" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="43" y1="55" x2="46" y2="63" stroke="#6a5010" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="22" y1="32" x2="15" y2="46" stroke="#6a5010" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="32" x2="47" y2="46" stroke="#6a5010" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  gnoll_hunter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="19" y="30" width="24" height="25" rx="3" fill="#6a4808"/>
    <rect x="19" y="30" width="24" height="9" rx="2" fill="#4a3000" opacity="0.9"/>
    <ellipse cx="31" cy="20" rx="12" ry="12" fill="#9a7818"/>
    <polygon points="22,12 16,1 25,11" fill="#9a7818"/>
    <polygon points="40,12 46,1 37,11" fill="#9a7818"/>
    <ellipse cx="31" cy="25" rx="7" ry="6" fill="#c8a030"/>
    <circle cx="26" cy="18" r="2.5" fill="#cc2200"/>
    <circle cx="26.7" cy="17.3" r="0.9" fill="#ff5522"/>
    <circle cx="36" cy="18" r="2.5" fill="#cc2200"/>
    <circle cx="36.7" cy="17.3" r="0.9" fill="#ff5522"/>
    <rect x="44" y="14" width="3" height="36" rx="1.5" fill="#8a6820"/>
    <polygon points="44,14 47,14 45.5,4" fill="#c0a030"/>
    <polygon points="44,14 47,14 45.5,4" fill="none" stroke="#e8c840" stroke-width="0.8"/>
    <rect x="44" y="28" width="10" height="2" rx="1" fill="#8a6820"/>
    <line x1="19" y1="55" x2="16" y2="63" stroke="#4a3000" stroke-width="4" stroke-linecap="round"/>
    <line x1="43" y1="55" x2="46" y2="63" stroke="#4a3000" stroke-width="4" stroke-linecap="round"/>
    <line x1="22" y1="31" x2="14" y2="44" stroke="#4a3000" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="31" x2="43" y2="44" stroke="#4a3000" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  gray_wolf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="30" cy="40" rx="20" ry="12" fill="#7a7a80"/>
    <ellipse cx="48" cy="36" rx="12" ry="10" fill="#8a8a90"/>
    <polygon points="44,28 40,18 48,27" fill="#8a8a90"/>
    <polygon points="52,28 56,18 50,27" fill="#8a8a90"/>
    <polygon points="44,28 40,18 48,27" fill="#b0b0b8" opacity="0.5"/>
    <polygon points="52,28 56,18 50,27" fill="#b0b0b8" opacity="0.5"/>
    <ellipse cx="57" cy="38" rx="6" ry="4" fill="#8a8a90"/>
    <circle cx="52" cy="33" r="2" fill="#111"/>
    <circle cx="52.6" cy="32.4" r="0.7" fill="#fff"/>
    <circle cx="59" cy="38" r="1.5" fill="#222"/>
    <path d="M55 40 L58 38 L61 41" fill="none" stroke="#444" stroke-width="1"/>
    <line x1="58" y1="36" x2="63" y2="33" stroke="#888" stroke-width="0.8"/>
    <line x1="58" y1="37" x2="64" y2="37" stroke="#888" stroke-width="0.8"/>
    <line x1="58" y1="38" x2="63" y2="40" stroke="#888" stroke-width="0.8"/>
    <polygon points="10,40 4,30 8,42" fill="#7a7a80"/>
    <line x1="16" y1="50" x2="12" y2="60" stroke="#6a6a70" stroke-width="3" stroke-linecap="round"/>
    <line x1="24" y1="52" x2="22" y2="62" stroke="#6a6a70" stroke-width="3" stroke-linecap="round"/>
    <line x1="36" y1="52" x2="35" y2="62" stroke="#6a6a70" stroke-width="3" stroke-linecap="round"/>
    <line x1="44" y1="50" x2="44" y2="60" stroke="#6a6a70" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  rabid_wolf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="30" cy="40" rx="20" ry="12" fill="#4a3a2a"/>
    <ellipse cx="48" cy="36" rx="12" ry="10" fill="#5a4a3a"/>
    <polygon points="44,28 40,17 48,27" fill="#5a4a3a"/>
    <polygon points="52,28 56,17 50,27" fill="#5a4a3a"/>
    <ellipse cx="57" cy="38" rx="6" ry="4" fill="#5a4a3a"/>
    <circle cx="52" cy="33" r="2.5" fill="#cc0000"/>
    <circle cx="52.8" cy="32.2" r="0.9" fill="#ff4444"/>
    <circle cx="59" cy="38" r="1.5" fill="#220000"/>
    <path d="M53 41 L56 39 L60 42" fill="none" stroke="#5a4a3a" stroke-width="1.5"/>
    <rect x="54" y="39" width="8" height="3" rx="1" fill="#eee" opacity="0.8"/>
    <ellipse cx="58" cy="40" rx="3" ry="1.5" fill="#fff" opacity="0.6"/>
    <polygon points="10,40 4,29 8,41" fill="#4a3a2a"/>
    <line x1="16" y1="50" x2="12" y2="60" stroke="#3a2a1a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="24" y1="52" x2="22" y2="62" stroke="#3a2a1a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="36" y1="52" x2="35" y2="62" stroke="#3a2a1a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="44" y1="50" x2="44" y2="60" stroke="#3a2a1a" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="30" cy="38" rx="4" ry="2" fill="#ccc" opacity="0.4"/>
  </svg>`,

  brown_bear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="42" rx="22" ry="16" fill="#7a4a18"/>
    <ellipse cx="32" cy="28" rx="16" ry="15" fill="#8a5820"/>
    <circle cx="22" cy="15" r="7" fill="#8a5820"/>
    <circle cx="42" cy="15" r="7" fill="#8a5820"/>
    <circle cx="22" cy="15" r="4" fill="#6a3a10"/>
    <circle cx="42" cy="15" r="4" fill="#6a3a10"/>
    <ellipse cx="32" cy="33" rx="8" ry="6" fill="#c88040"/>
    <circle cx="27" cy="26" r="3" fill="#111"/>
    <circle cx="27.8" cy="25.2" r="1" fill="#fff"/>
    <circle cx="37" cy="26" r="3" fill="#111"/>
    <circle cx="37.8" cy="25.2" r="1" fill="#fff"/>
    <circle cx="32" cy="34" r="2.5" fill="#5a3010"/>
    <path d="M27 37 Q32 41 37 37" fill="none" stroke="#5a3010" stroke-width="2"/>
    <line x1="14" y1="56" x2="10" y2="63" stroke="#5a3010" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="24" y1="58" x2="22" y2="64" stroke="#5a3010" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="40" y1="58" x2="42" y2="64" stroke="#5a3010" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="50" y1="56" x2="54" y2="63" stroke="#5a3010" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="10" y1="63" x2="6" y2="62" stroke="#3a1a00" stroke-width="1.5"/>
    <line x1="10" y1="63" x2="7" y2="65" stroke="#3a1a00" stroke-width="1.5"/>
    <line x1="54" y1="63" x2="58" y2="62" stroke="#3a1a00" stroke-width="1.5"/>
    <line x1="54" y1="63" x2="57" y2="65" stroke="#3a1a00" stroke-width="1.5"/>
  </svg>`,

  grizzly_bear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="43" rx="24" ry="17" fill="#5a3a0c"/>
    <ellipse cx="32" cy="27" rx="18" ry="16" fill="#6a4818"/>
    <circle cx="20" cy="13" r="8" fill="#6a4818"/>
    <circle cx="44" cy="13" r="8" fill="#6a4818"/>
    <circle cx="20" cy="13" r="5" fill="#4a2808"/>
    <circle cx="44" cy="13" r="5" fill="#4a2808"/>
    <ellipse cx="32" cy="24" rx="16" ry="6" fill="#9a7030" opacity="0.5"/>
    <ellipse cx="32" cy="33" rx="9" ry="7" fill="#c08040"/>
    <circle cx="26" cy="25" r="3.5" fill="#111"/>
    <circle cx="27" cy="24" r="1.2" fill="#fff"/>
    <circle cx="38" cy="25" r="3.5" fill="#111"/>
    <circle cx="39" cy="24" r="1.2" fill="#fff"/>
    <circle cx="32" cy="35" r="3" fill="#3a1a00"/>
    <path d="M26 39 Q32 44 38 39" fill="none" stroke="#3a1a00" stroke-width="2.5"/>
    <line x1="12" y1="58" x2="7" y2="64" stroke="#3a1a00" stroke-width="5.5" stroke-linecap="round"/>
    <line x1="22" y1="60" x2="20" y2="64" stroke="#3a1a00" stroke-width="5.5" stroke-linecap="round"/>
    <line x1="42" y1="60" x2="44" y2="64" stroke="#3a1a00" stroke-width="5.5" stroke-linecap="round"/>
    <line x1="52" y1="58" x2="57" y2="64" stroke="#3a1a00" stroke-width="5.5" stroke-linecap="round"/>
    <line x1="7" y1="64" x2="3" y2="63" stroke="#1a0a00" stroke-width="2"/>
    <line x1="7" y1="64" x2="4" y2="67" stroke="#1a0a00" stroke-width="2"/>
    <line x1="57" y1="64" x2="61" y2="63" stroke="#1a0a00" stroke-width="2"/>
    <line x1="57" y1="64" x2="60" y2="67" stroke="#1a0a00" stroke-width="2"/>
  </svg>`,

  decaying_skeleton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="10" r="10" fill="#e8e0c8"/>
    <ellipse cx="27" cy="9" rx="4" ry="5" fill="#1a1a1a"/>
    <ellipse cx="37" cy="9" rx="4" ry="5" fill="#1a1a1a"/>
    <ellipse cx="32" cy="14" rx="4" ry="2" fill="#1a1a1a" opacity="0.5"/>
    <rect x="30" y="20" width="4" height="18" rx="2" fill="#e8e0c8"/>
    <rect x="26" y="22" width="12" height="3" rx="1" fill="#d0c8b0"/>
    <rect x="24" y="27" width="16" height="2.5" rx="1" fill="#d0c8b0"/>
    <rect x="25" y="32" width="14" height="2.5" rx="1" fill="#d0c8b0"/>
    <rect x="26" y="37" width="12" height="2.5" rx="1" fill="#d0c8b0"/>
    <rect x="14" y="20" width="4" height="16" rx="2" fill="#e8e0c8" transform="rotate(-10 14 20)"/>
    <rect x="46" y="20" width="4" height="16" rx="2" fill="#e8e0c8" transform="rotate(10 46 20)"/>
    <rect x="12" y="34" width="4" height="14" rx="2" fill="#e8e0c8" transform="rotate(-5 12 34)"/>
    <rect x="48" y="34" width="4" height="14" rx="2" fill="#e8e0c8" transform="rotate(5 48 34)"/>
    <rect x="28" y="38" width="4" height="16" rx="2" fill="#e8e0c8" transform="rotate(-8 28 38)"/>
    <rect x="32" y="38" width="4" height="16" rx="2" fill="#e8e0c8" transform="rotate(8 32 38)"/>
    <rect x="24" y="52" width="4" height="8" rx="2" fill="#e8e0c8" transform="rotate(-5 24 52)"/>
    <rect x="36" y="52" width="4" height="8" rx="2" fill="#e8e0c8" transform="rotate(5 36 52)"/>
  </svg>`,

  putrid_skeleton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="10" r="10" fill="#c8d888"/>
    <ellipse cx="27" cy="9" rx="4" ry="5" fill="#1a2a08"/>
    <ellipse cx="37" cy="9" rx="4" ry="5" fill="#1a2a08"/>
    <ellipse cx="32" cy="14" rx="4" ry="2" fill="#1a2a08" opacity="0.6"/>
    <path d="M28 18 Q30 22 28 25" fill="none" stroke="#88aa22" stroke-width="2"/>
    <path d="M36 18 Q34 22 36 26" fill="none" stroke="#88aa22" stroke-width="2"/>
    <rect x="30" y="20" width="4" height="18" rx="2" fill="#c8d888"/>
    <rect x="26" y="22" width="12" height="3" rx="1" fill="#b0c070"/>
    <rect x="24" y="27" width="16" height="2.5" rx="1" fill="#b0c070"/>
    <rect x="25" y="32" width="14" height="2.5" rx="1" fill="#b0c070"/>
    <rect x="26" y="37" width="12" height="2.5" rx="1" fill="#b0c070"/>
    <circle cx="28" cy="30" r="2" fill="#88aa22" opacity="0.7"/>
    <circle cx="38" cy="25" r="1.5" fill="#88aa22" opacity="0.7"/>
    <rect x="14" y="20" width="4" height="16" rx="2" fill="#c8d888" transform="rotate(-10 14 20)"/>
    <rect x="46" y="20" width="4" height="16" rx="2" fill="#c8d888" transform="rotate(10 46 20)"/>
    <rect x="12" y="34" width="4" height="14" rx="2" fill="#c8d888" transform="rotate(-5 12 34)"/>
    <rect x="48" y="34" width="4" height="14" rx="2" fill="#c8d888" transform="rotate(5 48 34)"/>
    <rect x="28" y="38" width="4" height="16" rx="2" fill="#c8d888" transform="rotate(-8 28 38)"/>
    <rect x="32" y="38" width="4" height="16" rx="2" fill="#c8d888" transform="rotate(8 32 38)"/>
    <rect x="24" y="52" width="4" height="8" rx="2" fill="#c8d888" transform="rotate(-5 24 52)"/>
    <rect x="36" y="52" width="4" height="8" rx="2" fill="#c8d888" transform="rotate(5 36 52)"/>
  </svg>`,

  dread_corpse: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="28" fill="#5500aa" opacity="0.15"/>
    <circle cx="32" cy="10" r="10" fill="#c0a8d0"/>
    <ellipse cx="27" cy="8" rx="5" ry="6" fill="#1a0030"/>
    <ellipse cx="37" cy="8" rx="5" ry="6" fill="#1a0030"/>
    <circle cx="27" cy="8" r="2" fill="#cc00ff" opacity="0.8"/>
    <circle cx="37" cy="8" r="2" fill="#cc00ff" opacity="0.8"/>
    <ellipse cx="32" cy="14" rx="4" ry="2" fill="#1a0030" opacity="0.7"/>
    <rect x="30" y="20" width="4" height="18" rx="2" fill="#b898c8"/>
    <rect x="26" y="22" width="12" height="3" rx="1" fill="#9878b0"/>
    <rect x="24" y="27" width="16" height="2.5" rx="1" fill="#9878b0"/>
    <rect x="25" y="32" width="14" height="2.5" rx="1" fill="#9878b0"/>
    <rect x="26" y="37" width="12" height="2.5" rx="1" fill="#9878b0"/>
    <rect x="14" y="19" width="4" height="16" rx="2" fill="#b898c8" transform="rotate(-15 14 19)"/>
    <rect x="46" y="19" width="4" height="16" rx="2" fill="#b898c8" transform="rotate(15 46 19)"/>
    <rect x="12" y="33" width="4" height="15" rx="2" fill="#b898c8" transform="rotate(-5 12 33)"/>
    <rect x="48" y="33" width="4" height="15" rx="2" fill="#b898c8" transform="rotate(5 48 33)"/>
    <rect x="28" y="38" width="4" height="16" rx="2" fill="#b898c8" transform="rotate(-10 28 38)"/>
    <rect x="32" y="38" width="4" height="16" rx="2" fill="#b898c8" transform="rotate(10 32 38)"/>
    <rect x="24" y="52" width="4" height="8" rx="2" fill="#b898c8" transform="rotate(-5 24 52)"/>
    <rect x="36" y="52" width="4" height="8" rx="2" fill="#b898c8" transform="rotate(5 36 52)"/>
    <ellipse cx="32" cy="32" rx="18" ry="22" fill="none" stroke="#aa00ff" stroke-width="1.5" opacity="0.4"/>
    <ellipse cx="32" cy="32" rx="22" ry="26" fill="none" stroke="#7700cc" stroke-width="1" opacity="0.3"/>
  </svg>`,

  will_o_wisp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="28" fill="#001840" opacity="0.3"/>
    <circle cx="32" cy="32" r="22" fill="#0044aa" opacity="0.25"/>
    <circle cx="32" cy="32" r="16" fill="#0088ff" opacity="0.3"/>
    <circle cx="32" cy="32" r="10" fill="#44aaff" opacity="0.5"/>
    <circle cx="32" cy="32" r="6" fill="#88ccff" opacity="0.8"/>
    <circle cx="32" cy="32" r="3" fill="#ffffff"/>
    <line x1="32" y1="4" x2="32" y2="14" stroke="#88ccff" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="32" y1="50" x2="32" y2="60" stroke="#88ccff" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="4" y1="32" x2="14" y2="32" stroke="#88ccff" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="50" y1="32" x2="60" y2="32" stroke="#88ccff" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="11" y1="11" x2="18" y2="18" stroke="#88ccff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
    <line x1="46" y1="46" x2="53" y2="53" stroke="#88ccff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
    <line x1="53" y1="11" x2="46" y2="18" stroke="#88ccff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
    <line x1="18" y1="46" x2="11" y2="53" stroke="#88ccff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="26" fill="none" stroke="#0066ff" stroke-width="0.5" opacity="0.4" stroke-dasharray="3,4"/>
    <circle cx="29" cy="30" r="1.5" fill="#ffffff" opacity="0.8"/>
  </svg>`,

  bandit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="22" y="32" width="20" height="24" rx="3" fill="#3a3028"/>
    <circle cx="32" cy="22" r="10" fill="#5a4a38"/>
    <ellipse cx="32" cy="17" rx="12" ry="8" fill="#2a2018"/>
    <ellipse cx="32" cy="22" rx="8" ry="5" fill="#2a2018" opacity="0.8"/>
    <rect x="20" y="16" width="24" height="8" rx="4" fill="#2a2018"/>
    <circle cx="28" cy="23" r="2" fill="#222"/>
    <circle cx="36" cy="23" r="2" fill="#222"/>
    <rect x="20" y="24" width="24" height="4" rx="2" fill="#2a2018"/>
    <rect x="44" y="34" width="3" height="14" rx="1.5" fill="#888" transform="rotate(15 44 34)"/>
    <polygon points="44,34 47,34 45.5,26" fill="#bbb" transform="rotate(15 44 34)"/>
    <rect x="14" y="33" width="10" height="3" rx="1.5" fill="#5a4a38"/>
    <rect x="40" y="33" width="10" height="3" rx="1.5" fill="#5a4a38"/>
    <line x1="14" y1="34" x2="8" y2="50" stroke="#3a3028" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="34" x2="56" y2="50" stroke="#3a3028" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="56" x2="20" y2="64" stroke="#2a2018" stroke-width="4" stroke-linecap="round"/>
    <line x1="42" y1="56" x2="44" y2="64" stroke="#2a2018" stroke-width="4" stroke-linecap="round"/>
    <rect x="28" y="40" width="8" height="5" rx="1" fill="#6a5a48" opacity="0.6"/>
  </svg>`,

  hadden: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="#e8d060" opacity="0.15"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#e8c820" stroke-width="2" opacity="0.5"/>
    <rect x="22" y="32" width="22" height="24" rx="3" fill="#2060a0"/>
    <rect x="22" y="32" width="22" height="8" rx="2" fill="#1a4a80" opacity="0.7"/>
    <circle cx="33" cy="21" r="11" fill="#c8a070"/>
    <rect x="20" y="14" width="26" height="10" rx="5" fill="#4a3010"/>
    <rect x="26" y="12" width="14" height="6" rx="3" fill="#3a2008"/>
    <circle cx="28" cy="22" r="2" fill="#3a2010"/>
    <circle cx="38" cy="22" r="2" fill="#3a2010"/>
    <path d="M28 27 Q33 30 38 27" fill="none" stroke="#3a2010" stroke-width="1.5"/>
    <line x1="44" y1="33" x2="60" y2="10" stroke="#8a6820" stroke-width="2" stroke-linecap="round"/>
    <line x1="60" y1="10" x2="62" y2="28" stroke="#8a6820" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2,3"/>
    <circle cx="60" cy="10" r="2" fill="#c8a030"/>
    <line x1="22" y1="35" x2="14" y2="50" stroke="#1a4a80" stroke-width="3" stroke-linecap="round"/>
    <line x1="44" y1="35" x2="52" y2="50" stroke="#1a4a80" stroke-width="3" stroke-linecap="round"/>
    <line x1="26" y1="56" x2="24" y2="64" stroke="#1a4a80" stroke-width="4" stroke-linecap="round"/>
    <line x1="40" y1="56" x2="42" y2="64" stroke="#1a4a80" stroke-width="4" stroke-linecap="round"/>
    <rect x="23" y="40" width="7" height="6" rx="1" fill="#1a4a80" opacity="0.8"/>
  </svg>`,

  varsoon_the_undying: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="#440066" opacity="0.2"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#aa00ff" stroke-width="2" opacity="0.6"/>
    <circle cx="32" cy="32" r="26" fill="none" stroke="#e8c820" stroke-width="1.5" opacity="0.4"/>
    <polygon points="32,56 16,62 20,42 44,42 48,62" fill="#2a0044"/>
    <rect x="22" y="28" width="20" height="28" rx="4" fill="#3a0066"/>
    <rect x="22" y="28" width="20" height="8" rx="3" fill="#220044" opacity="0.8"/>
    <line x1="22" y1="36" x2="16" y2="56" stroke="#2a0044" stroke-width="4" stroke-linecap="round"/>
    <line x1="42" y1="36" x2="48" y2="56" stroke="#2a0044" stroke-width="4" stroke-linecap="round"/>
    <circle cx="32" cy="17" r="10" fill="#d0c0a0"/>
    <ellipse cx="28" cy="15" rx="4" ry="5" fill="#1a0030"/>
    <ellipse cx="36" cy="15" rx="4" ry="5" fill="#1a0030"/>
    <circle cx="28" cy="15" r="2" fill="#cc00ff" opacity="0.9"/>
    <circle cx="36" cy="15" r="2" fill="#cc00ff" opacity="0.9"/>
    <ellipse cx="32" cy="20" rx="4" ry="2" fill="#1a0030" opacity="0.6"/>
    <ellipse cx="32" cy="24" rx="5" ry="2" fill="#c0c0a0"/>
    <rect x="48" y="20" width="3" height="38" rx="1.5" fill="#6a4888"/>
    <circle cx="49.5" cy="18" r="5" fill="#aa00ff" opacity="0.8"/>
    <circle cx="49.5" cy="18" r="3" fill="#cc44ff"/>
    <circle cx="49.5" cy="18" r="1.5" fill="#fff" opacity="0.9"/>
    <ellipse cx="32" cy="32" rx="16" ry="20" fill="none" stroke="#8800cc" stroke-width="1" opacity="0.5" stroke-dasharray="3,4"/>
  </svg>`,

  // ─── EVERFROST PEAKS SPRITES ───────────────────────────────────────────────

  frost_goblin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="42" rx="13" ry="12" fill="#3a6090"/>
    <ellipse cx="32" cy="24" rx="11" ry="10" fill="#4a78b0"/>
    <ellipse cx="20" cy="22" rx="4" ry="5" fill="#3a6090"/>
    <ellipse cx="44" cy="22" rx="4" ry="5" fill="#3a6090"/>
    <ellipse cx="27" cy="22" rx="3" ry="3.5" fill="#c0e0ff"/>
    <ellipse cx="37" cy="22" rx="3" ry="3.5" fill="#c0e0ff"/>
    <circle cx="27" cy="22" r="1.5" fill="#002244"/>
    <circle cx="37" cy="22" r="1.5" fill="#002244"/>
    <circle cx="27.5" cy="21.5" r="0.5" fill="#ffffff"/>
    <circle cx="37.5" cy="21.5" r="0.5" fill="#ffffff"/>
    <ellipse cx="32" cy="27" rx="2" ry="1.5" fill="#2a5080"/>
    <path d="M28 30 Q32 33 36 30" fill="none" stroke="#1a3060" stroke-width="1.5"/>
    <polygon points="29,30 27,34 31,30" fill="#ddeeff"/>
    <polygon points="35,30 37,34 33,30" fill="#ddeeff"/>
    <rect x="42" y="30" width="4" height="16" rx="1" fill="#88ccff" opacity="0.9" transform="rotate(-20 44 38)"/>
    <ellipse cx="25" cy="54" rx="5" ry="4" fill="#3a6090"/>
    <ellipse cx="39" cy="54" rx="5" ry="4" fill="#3a6090"/>
    <polygon points="20,38 23,31 26,38" fill="#aaddff" opacity="0.7"/>
    <polygon points="38,36 41,29 44,36" fill="#aaddff" opacity="0.7"/>
  </svg>`,

  ice_wolf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M8 38 Q4 28 8 20" fill="none" stroke="#d0e8ff" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="32" cy="40" rx="20" ry="13" fill="#c8dcf0"/>
    <ellipse cx="50" cy="33" rx="13" ry="11" fill="#d0e4f8"/>
    <polygon points="42,24 46,14 52,24" fill="#c0d4e8"/>
    <polygon points="52,22 56,13 60,22" fill="#c0d4e8"/>
    <ellipse cx="60" cy="36" rx="5" ry="4" fill="#b8cce0"/>
    <circle cx="62" cy="34" r="1.5" fill="#2244aa"/>
    <ellipse cx="63" cy="36" rx="2" ry="1.5" fill="#1a3080"/>
    <circle cx="53" cy="30" r="2.5" fill="#88bbff"/>
    <circle cx="53" cy="30" r="1.2" fill="#111133"/>
    <circle cx="53.5" cy="29.5" r="0.4" fill="#ffffff"/>
    <rect x="16" y="50" width="6" height="10" rx="3" fill="#b8cce0"/>
    <rect x="26" y="52" width="6" height="9" rx="3" fill="#b8cce0"/>
    <rect x="37" y="51" width="6" height="9" rx="3" fill="#b8cce0"/>
    <rect x="46" y="50" width="6" height="10" rx="3" fill="#b8cce0"/>
    <polygon points="24,35 26,28 28,35" fill="#aaddff" opacity="0.8"/>
    <polygon points="33,33 35,27 37,33" fill="#aaddff" opacity="0.8"/>
  </svg>`,

  snow_skeleton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <line x1="32" y1="20" x2="32" y2="56" stroke="#ddeeff" stroke-width="3"/>
    <ellipse cx="32" cy="15" rx="11" ry="12" fill="#eef5ff"/>
    <ellipse cx="27" cy="13" rx="3.5" ry="4" fill="#1a3a5a"/>
    <ellipse cx="37" cy="13" rx="3.5" ry="4" fill="#1a3a5a"/>
    <ellipse cx="27" cy="13" rx="2" ry="2.5" fill="#88bbff" opacity="0.9"/>
    <ellipse cx="37" cy="13" rx="2" ry="2.5" fill="#88bbff" opacity="0.9"/>
    <rect x="25" y="22" width="14" height="6" rx="2" fill="#e0eeff"/>
    <line x1="28" y1="22" x2="28" y2="28" stroke="#1a3a5a" stroke-width="1"/>
    <line x1="32" y1="22" x2="32" y2="28" stroke="#1a3a5a" stroke-width="1"/>
    <line x1="36" y1="22" x2="36" y2="28" stroke="#1a3a5a" stroke-width="1"/>
    <path d="M24,30 Q18,34 20,40" fill="none" stroke="#ddeeff" stroke-width="2"/>
    <path d="M26,32 Q19,37 21,43" fill="none" stroke="#ddeeff" stroke-width="2"/>
    <path d="M40,30 Q46,34 44,40" fill="none" stroke="#ddeeff" stroke-width="2"/>
    <path d="M38,32 Q45,37 43,43" fill="none" stroke="#ddeeff" stroke-width="2"/>
    <ellipse cx="32" cy="46" rx="8" ry="5" fill="none" stroke="#ddeeff" stroke-width="2"/>
    <line x1="26" y1="50" x2="22" y2="63" stroke="#ddeeff" stroke-width="3" stroke-linecap="round"/>
    <line x1="38" y1="50" x2="42" y2="63" stroke="#ddeeff" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="30" x2="10" y2="42" stroke="#ddeeff" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="30" x2="54" y2="42" stroke="#ddeeff" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="35" rx="14" ry="12" fill="#aaccff" opacity="0.15"/>
  </svg>`,

  frozen_zombie: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="42" rx="14" ry="16" fill="#2a4a3a"/>
    <ellipse cx="32" cy="42" rx="14" ry="16" fill="#88aacc" opacity="0.35"/>
    <ellipse cx="32" cy="22" rx="12" ry="13" fill="#3a5a44"/>
    <ellipse cx="32" cy="22" rx="12" ry="13" fill="#99bbdd" opacity="0.3"/>
    <ellipse cx="26" cy="19" rx="3.5" ry="3" fill="#0a2a1a"/>
    <ellipse cx="38" cy="19" rx="3.5" ry="3" fill="#0a2a1a"/>
    <ellipse cx="26" cy="19" rx="2" ry="2" fill="#4488cc" opacity="0.8"/>
    <ellipse cx="38" cy="19" rx="2" ry="2" fill="#4488cc" opacity="0.8"/>
    <path d="M26 27 Q32 31 38 27" fill="none" stroke="#0a1a10" stroke-width="1.5"/>
    <rect x="3" y="34" width="15" height="7" rx="3.5" fill="#2a4a3a" transform="rotate(-15 10 37)"/>
    <rect x="46" y="34" width="15" height="7" rx="3.5" fill="#2a4a3a" transform="rotate(15 53 37)"/>
    <rect x="22" y="56" width="8" height="10" rx="4" fill="#2a4a3a"/>
    <rect x="34" y="56" width="8" height="10" rx="4" fill="#2a4a3a"/>
    <polygon points="14,28 17,20 20,28" fill="#aaccff" opacity="0.9"/>
    <polygon points="44,28 47,20 50,28" fill="#aaccff" opacity="0.9"/>
    <polygon points="28,10 32,2 36,10" fill="#bbddff" opacity="0.8"/>
  </svg>`,

  everfrost_gnoll: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="42" rx="14" ry="13" fill="#4a5a70"/>
    <ellipse cx="32" cy="24" rx="12" ry="11" fill="#5a6a80"/>
    <ellipse cx="32" cy="30" rx="6" ry="5" fill="#4a5a70"/>
    <polygon points="20,16 17,6 26,14" fill="#5a6a80"/>
    <polygon points="44,16 47,6 38,14" fill="#5a6a80"/>
    <circle cx="26" cy="21" r="3" fill="#88aacc"/>
    <circle cx="38" cy="21" r="3" fill="#88aacc"/>
    <circle cx="26" cy="21" r="1.5" fill="#111"/>
    <circle cx="38" cy="21" r="1.5" fill="#111"/>
    <circle cx="26.5" cy="20.5" r="0.5" fill="#fff"/>
    <circle cx="38.5" cy="20.5" r="0.5" fill="#fff"/>
    <ellipse cx="32" cy="29" rx="2.5" ry="2" fill="#3a4a60"/>
    <polygon points="29,33 27,38 31,33" fill="#ddeeff"/>
    <polygon points="35,33 37,38 33,33" fill="#ddeeff"/>
    <rect x="3" y="36" width="14" height="5" rx="2.5" fill="#4a5a70" transform="rotate(-25 10 38)"/>
    <rect x="47" y="26" width="4" height="22" rx="2" fill="#7a8a9a"/>
    <polygon points="47,26 51,26 49,18" fill="#aaddff" opacity="0.9"/>
    <ellipse cx="24" cy="55" rx="6" ry="5" fill="#4a5a70"/>
    <ellipse cx="40" cy="55" rx="6" ry="5" fill="#4a5a70"/>
    <ellipse cx="32" cy="42" rx="8" ry="5" fill="#aaccee" opacity="0.25"/>
  </svg>`,

  ice_giant_scout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="18" ry="16" fill="#4a7a9a"/>
    <ellipse cx="32" cy="20" rx="16" ry="15" fill="#5a8aaa"/>
    <path d="M16,14 Q18,4 32,2 Q46,4 48,14" fill="#88aacc"/>
    <polygon points="28,2 32,-4 36,2" fill="#cceeff" opacity="0.9"/>
    <ellipse cx="25" cy="18" rx="4" ry="4.5" fill="#002244"/>
    <ellipse cx="39" cy="18" rx="4" ry="4.5" fill="#002244"/>
    <ellipse cx="25" cy="18" rx="2.5" ry="3" fill="#5599ff"/>
    <ellipse cx="39" cy="18" rx="2.5" ry="3" fill="#5599ff"/>
    <ellipse cx="32" cy="24" rx="3" ry="2.5" fill="#4a7a9a"/>
    <path d="M20,28 Q32,35 44,28" fill="#88aacc" opacity="0.6"/>
    <rect x="50" y="28" width="7" height="28" rx="3" fill="#8a6a4a"/>
    <rect x="46" y="20" width="14" height="12" rx="3" fill="#aaccee"/>
    <rect x="4" y="36" width="12" height="8" rx="4" fill="#4a7a9a"/>
    <rect x="48" y="30" width="10" height="8" rx="4" fill="#4a7a9a" transform="rotate(30 53 34)"/>
    <rect x="18" y="56" width="10" height="10" rx="5" fill="#3a6a8a"/>
    <rect x="36" y="56" width="10" height="10" rx="5" fill="#3a6a8a"/>
    <text x="32" y="47" text-anchor="middle" font-family="serif" font-size="10" fill="#aaddff" opacity="0.7">❄</text>
  </svg>`,

  a_wooly_mammoth: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="30" cy="42" rx="26" ry="18" fill="#5a4a38"/>
    <ellipse cx="30" cy="42" rx="24" ry="16" fill="#6a5a48"/>
    <ellipse cx="52" cy="34" rx="14" ry="13" fill="#6a5a48"/>
    <path d="M62 40 Q66 48 62 56 Q60 60 56 58" fill="none" stroke="#5a4a38" stroke-width="6" stroke-linecap="round"/>
    <path d="M58 42 Q68 46 70 55 Q70 60 64 60" fill="none" stroke="#eeeebb" stroke-width="4" stroke-linecap="round"/>
    <path d="M56 44 Q64 52 62 60" fill="none" stroke="#ddddaa" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <circle cx="56" cy="30" r="3" fill="#1a1008"/>
    <circle cx="56" cy="30" r="1.5" fill="#cc8800"/>
    <circle cx="56.5" cy="29.5" r="0.5" fill="#ffffff"/>
    <ellipse cx="42" cy="26" rx="7" ry="5" fill="#4a3a28"/>
    <path d="M10,30 Q14,24 18,30" fill="none" stroke="#4a3a28" stroke-width="2"/>
    <path d="M18,26 Q22,20 26,26" fill="none" stroke="#4a3a28" stroke-width="2"/>
    <path d="M26,24 Q30,18 34,24" fill="none" stroke="#4a3a28" stroke-width="2"/>
    <rect x="10" y="56" width="8" height="10" rx="4" fill="#5a4a38"/>
    <rect x="22" y="58" width="8" height="8" rx="4" fill="#5a4a38"/>
    <rect x="34" y="58" width="8" height="8" rx="4" fill="#5a4a38"/>
    <rect x="46" y="56" width="8" height="10" rx="4" fill="#5a4a38"/>
    <ellipse cx="22" cy="28" rx="10" ry="4" fill="#ddeeff" opacity="0.6"/>
    <ellipse cx="38" cy="26" rx="8" ry="3" fill="#ddeeff" opacity="0.5"/>
  </svg>`,

  permafrost_spectre: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="35" rx="22" ry="26" fill="#1a3a5a" opacity="0.5"/>
    <path d="M16,38 Q14,52 20,58 Q26,64 32,60 Q38,64 44,58 Q50,52 48,38 Q42,28 32,26 Q22,28 16,38 Z" fill="#336699" opacity="0.6"/>
    <path d="M20,58 Q22,64 18,68" fill="none" stroke="#88aacc" stroke-width="2" opacity="0.7"/>
    <path d="M32,60 Q32,66 30,70" fill="none" stroke="#88aacc" stroke-width="2" opacity="0.7"/>
    <path d="M44,58 Q42,64 46,68" fill="none" stroke="#88aacc" stroke-width="2" opacity="0.7"/>
    <ellipse cx="32" cy="22" rx="13" ry="14" fill="#3a5a7a" opacity="0.85"/>
    <ellipse cx="26" cy="19" rx="4" ry="5" fill="#0a1a2a"/>
    <ellipse cx="38" cy="19" rx="4" ry="5" fill="#0a1a2a"/>
    <ellipse cx="26" cy="19" rx="2.5" ry="3.5" fill="#66aaff" opacity="0.9"/>
    <ellipse cx="38" cy="19" rx="2.5" ry="3.5" fill="#66aaff" opacity="0.9"/>
    <ellipse cx="26" cy="19" rx="1" ry="1.5" fill="#aaddff"/>
    <ellipse cx="38" cy="19" rx="1" ry="1.5" fill="#aaddff"/>
    <path d="M25,27 Q32,32 39,27" fill="#0a1a2a" stroke="#1a3a5a" stroke-width="1"/>
    <path d="M14,34 Q8,28 10,20" fill="none" stroke="#4488aa" stroke-width="1.5" opacity="0.6" stroke-dasharray="3,2"/>
    <path d="M50,34 Q56,28 54,20" fill="none" stroke="#4488aa" stroke-width="1.5" opacity="0.6" stroke-dasharray="3,2"/>
    <polygon points="8,42 11,34 14,42" fill="#aaccff" opacity="0.7"/>
    <polygon points="50,42 53,34 56,42" fill="#aaccff" opacity="0.7"/>
    <polygon points="26,8 29,0 32,8" fill="#bbddff" opacity="0.6"/>
    <ellipse cx="32" cy="35" rx="20" ry="22" fill="none" stroke="#4488bb" stroke-width="1" opacity="0.4" stroke-dasharray="4,3"/>
  </svg>`,

  karana_bandit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="42" rx="12" ry="14" fill="#6b5040"/>
    <ellipse cx="32" cy="22" rx="11" ry="10" fill="#b89a70"/>
    <polygon points="20,18 32,8 44,18 42,26 22,26" fill="#888878"/>
    <ellipse cx="26" cy="20" rx="2.5" ry="2.5" fill="#222"/>
    <ellipse cx="38" cy="20" rx="2.5" ry="2.5" fill="#222"/>
    <rect x="4" y="34" width="13" height="5" rx="2.5" fill="#6b5040" transform="rotate(-20 10 36)"/>
    <rect x="47" y="30" width="3" height="22" rx="1" fill="#c8b870"/>
    <polygon points="47,30 50,30 48.5,23" fill="#e0d090"/>
    <ellipse cx="24" cy="56" rx="6" ry="5" fill="#5a4030"/>
    <ellipse cx="40" cy="56" rx="6" ry="5" fill="#5a4030"/>
  </svg>`,

  karana_raider: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="14" ry="14" fill="#5a4030"/>
    <ellipse cx="32" cy="22" rx="12" ry="11" fill="#a08060"/>
    <rect x="20" y="18" width="24" height="7" rx="3" fill="#c03030" opacity="0.85"/>
    <ellipse cx="26" cy="20" rx="2.5" ry="2" fill="#1a0808"/>
    <ellipse cx="38" cy="20" rx="2.5" ry="2" fill="#1a0808"/>
    <rect x="3" y="36" width="14" height="6" rx="3" fill="#5a4030" transform="rotate(-25 10 39)"/>
    <rect x="47" y="24" width="4" height="20" rx="2" fill="#a0a0a0"/>
    <polygon points="47,24 51,24 49,14" fill="#c0c0c0"/>
    <polygon points="43,18 51,18 47,26" fill="#808080" opacity="0.7"/>
    <ellipse cx="24" cy="58" rx="6" ry="4" fill="#4a3020"/>
    <ellipse cx="40" cy="58" rx="6" ry="4" fill="#4a3020"/>
  </svg>`,

  giant_wolf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M8 40 Q4 30 8 22" fill="none" stroke="#c8a870" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="32" cy="42" rx="22" ry="14" fill="#8b6040"/>
    <ellipse cx="50" cy="34" rx="14" ry="12" fill="#9a7050"/>
    <polygon points="42,24 46,13 53,24" fill="#7a5030"/>
    <polygon points="53,22 57,12 62,22" fill="#7a5030"/>
    <ellipse cx="61" cy="36" rx="5" ry="4" fill="#6b4028"/>
    <circle cx="63" cy="34" r="1.5" fill="#402010"/>
    <ellipse cx="64" cy="36" rx="2" ry="1.5" fill="#301808"/>
    <circle cx="54" cy="30" r="2.5" fill="#d4a050"/>
    <circle cx="54" cy="30" r="1.2" fill="#181008"/>
    <circle cx="54.5" cy="29.5" r="0.4" fill="#ffffff"/>
    <rect x="14" y="52" width="6" height="10" rx="3" fill="#6b4028"/>
    <rect x="24" y="54" width="6" height="9" rx="3" fill="#6b4028"/>
    <rect x="36" y="53" width="6" height="9" rx="3" fill="#6b4028"/>
    <rect x="46" y="52" width="6" height="10" rx="3" fill="#6b4028"/>
    <ellipse cx="30" cy="42" rx="14" ry="8" fill="#c8a870" opacity="0.4"/>
  </svg>`,

  plains_griffon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="28" cy="44" rx="20" ry="14" fill="#8b6030"/>
    <ellipse cx="46" cy="36" rx="12" ry="10" fill="#9a7040"/>
    <path d="M4 28 Q2 20 8 16 Q14 12 18 20 Q14 28 8 32 Z" fill="#c8902a"/>
    <path d="M4 40 Q2 32 6 28 Q10 24 14 30 Q12 40 6 44 Z" fill="#c8902a"/>
    <ellipse cx="54" cy="30" rx="10" ry="9" fill="#d4a030"/>
    <polygon points="50,22 54,12 60,20" fill="#d4b040"/>
    <polygon points="56,20 62,12 64,22" fill="#d4b040"/>
    <path d="M56,33 Q62,34 64,38" fill="none" stroke="#d4a030" stroke-width="3" stroke-linecap="round"/>
    <circle cx="59" cy="27" r="2.5" fill="#181008"/>
    <circle cx="59" cy="27" r="1.2" fill="#402008"/>
    <path d="M62,30 Q66,32 64,36" fill="none" stroke="#d4a030" stroke-width="2" stroke-linecap="round"/>
    <rect x="14" y="54" width="6" height="9" rx="3" fill="#7a5020"/>
    <rect x="24" y="56" width="6" height="8" rx="3" fill="#7a5020"/>
    <rect x="34" y="55" width="6" height="8" rx="3" fill="#7a5020"/>
    <path d="M2 50 Q-4 44 0 38" fill="none" stroke="#8b6030" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  karana_gnoll_warrior: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="13" ry="12" fill="#5a7030"/>
    <ellipse cx="32" cy="24" rx="12" ry="11" fill="#6a8040"/>
    <ellipse cx="32" cy="30" rx="5" ry="4" fill="#7a9040"/>
    <polygon points="20,16 17,5 26,14" fill="#6a8040"/>
    <polygon points="44,16 47,5 38,14" fill="#6a8040"/>
    <circle cx="26" cy="21" r="3" fill="#c8b050"/>
    <circle cx="38" cy="21" r="3" fill="#c8b050"/>
    <circle cx="26" cy="21" r="1.5" fill="#111"/>
    <circle cx="38" cy="21" r="1.5" fill="#111"/>
    <circle cx="26.5" cy="20.5" r="0.5" fill="#fff"/>
    <circle cx="38.5" cy="20.5" r="0.5" fill="#fff"/>
    <ellipse cx="32" cy="29" rx="2.5" ry="2" fill="#4a6020"/>
    <polygon points="29,33 27,38 31,33" fill="#d4c060"/>
    <polygon points="35,33 37,38 33,33" fill="#d4c060"/>
    <rect x="3" y="36" width="14" height="5" rx="2.5" fill="#5a7030" transform="rotate(-20 10 38)"/>
    <rect x="46" y="26" width="4" height="22" rx="2" fill="#8b7040"/>
    <polygon points="46,26 50,26 48,18" fill="#a09050"/>
    <ellipse cx="24" cy="56" rx="6" ry="5" fill="#4a6020"/>
    <ellipse cx="40" cy="56" rx="6" ry="5" fill="#4a6020"/>
    <line x1="18" y1="22" x2="14" y2="16" stroke="#4a6020" stroke-width="1.5"/>
    <line x1="46" y1="22" x2="50" y2="16" stroke="#4a6020" stroke-width="1.5"/>
  </svg>`,

  plains_cyclops: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="48" rx="20" ry="16" fill="#7a6840"/>
    <ellipse cx="32" cy="22" rx="18" ry="17" fill="#c8a050"/>
    <ellipse cx="32" cy="22" rx="9" ry="10" fill="#1a1008"/>
    <ellipse cx="32" cy="22" rx="6" ry="7" fill="#cc2020"/>
    <ellipse cx="32" cy="22" rx="3" ry="3.5" fill="#880000"/>
    <circle cx="33" cy="20" r="1.5" fill="#ffffff" opacity="0.6"/>
    <path d="M20,33 Q32,40 44,33" fill="#a08040" opacity="0.6"/>
    <rect x="4" y="40" width="12" height="8" rx="4" fill="#7a6840"/>
    <rect x="48" y="40" width="12" height="8" rx="4" fill="#7a6840"/>
    <ellipse cx="20" cy="60" rx="8" ry="6" fill="#6a5830"/>
    <ellipse cx="44" cy="60" rx="8" ry="6" fill="#6a5830"/>
    <ellipse cx="24" cy="10" rx="5" ry="3" fill="#6a5830"/>
    <ellipse cx="40" cy="10" rx="5" ry="3" fill="#6a5830"/>
  </svg>`,

  dust_goblin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="42" rx="12" ry="11" fill="#8b7040"/>
    <ellipse cx="32" cy="24" rx="11" ry="10" fill="#c8a860"/>
    <ellipse cx="20" cy="22" rx="4" ry="5" fill="#8b7040"/>
    <ellipse cx="44" cy="22" rx="4" ry="5" fill="#8b7040"/>
    <ellipse cx="27" cy="22" rx="3" ry="3.5" fill="#e0d090"/>
    <ellipse cx="37" cy="22" rx="3" ry="3.5" fill="#e0d090"/>
    <circle cx="27" cy="22" r="1.5" fill="#3a2808"/>
    <circle cx="37" cy="22" r="1.5" fill="#3a2808"/>
    <circle cx="27.5" cy="21.5" r="0.5" fill="#ffffff"/>
    <circle cx="37.5" cy="21.5" r="0.5" fill="#ffffff"/>
    <ellipse cx="32" cy="28" rx="2" ry="1.5" fill="#7a6030"/>
    <path d="M28 31 Q32 34 36 31" fill="none" stroke="#5a4020" stroke-width="1.5"/>
    <polygon points="29,31 27,35 31,31" fill="#e8d890"/>
    <polygon points="35,31 37,35 33,31" fill="#e8d890"/>
    <rect x="42" y="30" width="3" height="14" rx="1" fill="#a09050" opacity="0.9" transform="rotate(-20 43 37)"/>
    <ellipse cx="25" cy="53" rx="5" ry="4" fill="#7a6030"/>
    <ellipse cx="39" cy="53" rx="5" ry="4" fill="#7a6030"/>
    <polygon points="20,38 23,31 26,38" fill="#d4c060" opacity="0.7"/>
    <polygon points="38,36 41,29 44,36" fill="#d4c060" opacity="0.7"/>
  </svg>`,

  highpass_guard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="14" ry="14" fill="#8090a8"/>
    <ellipse cx="32" cy="22" rx="12" ry="11" fill="#c8a870"/>
    <polygon points="18,12 32,4 46,12 44,24 20,24" fill="#606880"/>
    <polygon points="28,4 32,-2 36,4" fill="#c4962a"/>
    <ellipse cx="26" cy="20" rx="3" ry="3" fill="#202840"/>
    <ellipse cx="38" cy="20" rx="3" ry="3" fill="#202840"/>
    <rect x="4" y="38" width="15" height="7" rx="3.5" fill="#8090a8" transform="rotate(-15 11 41)"/>
    <polygon points="4,38 10,28 16,38 10,44" fill="#c8d0e0" opacity="0.85"/>
    <rect x="46" y="30" width="3" height="24" rx="1" fill="#c8d0e0"/>
    <polygon points="46,30 49,30 47.5,22" fill="#e0e8f0"/>
    <ellipse cx="24" cy="58" rx="7" ry="5" fill="#7080a0"/>
    <ellipse cx="40" cy="58" rx="7" ry="5" fill="#7080a0"/>
    <rect x="22" y="32" width="20" height="12" rx="2" fill="#9090a8" opacity="0.7"/>
  </svg>`,

  pass_bandit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M20,22 Q16,30 18,56 Q22,62 32,62 Q42,62 46,56 Q48,30 44,22 Z" fill="#404840"/>
    <ellipse cx="32" cy="20" rx="11" ry="10" fill="#686060"/>
    <polygon points="18,14 32,4 46,14 44,24 20,24" fill="#303830"/>
    <ellipse cx="27" cy="18" rx="2.5" ry="2.5" fill="#1a1010"/>
    <ellipse cx="37" cy="18" rx="2.5" ry="2.5" fill="#1a1010"/>
    <rect x="4" y="36" width="13" height="5" rx="2.5" fill="#404840" transform="rotate(-20 10 38)"/>
    <rect x="47" y="28" width="3" height="18" rx="1" fill="#c0b880" transform="rotate(-15 48 37)"/>
    <ellipse cx="24" cy="57" rx="6" ry="4" fill="#303830"/>
    <ellipse cx="40" cy="57" rx="6" ry="4" fill="#303830"/>
    <line x1="26" y1="14" x2="22" y2="10" stroke="#303830" stroke-width="2"/>
    <line x1="38" y1="14" x2="42" y2="10" stroke="#303830" stroke-width="2"/>
  </svg>`,

  gnoll_war_chief: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="46" rx="16" ry="14" fill="#5a7030"/>
    <ellipse cx="32" cy="24" rx="14" ry="13" fill="#6a8040"/>
    <ellipse cx="32" cy="30" rx="6" ry="5" fill="#7a9040"/>
    <polygon points="18,15 14,3 26,13" fill="#6a8040"/>
    <polygon points="46,15 50,3 38,13" fill="#6a8040"/>
    <circle cx="25" cy="21" r="3.5" fill="#d4a040"/>
    <circle cx="39" cy="21" r="3.5" fill="#d4a040"/>
    <circle cx="25" cy="21" r="1.8" fill="#111"/>
    <circle cx="39" cy="21" r="1.8" fill="#111"/>
    <line x1="20" y1="18" x2="26" y2="26" stroke="#cc3020" stroke-width="2"/>
    <line x1="44" y1="18" x2="38" y2="26" stroke="#cc3020" stroke-width="2"/>
    <line x1="18" y1="28" x2="28" y2="30" stroke="#cc3020" stroke-width="2"/>
    <line x1="46" y1="28" x2="36" y2="30" stroke="#cc3020" stroke-width="2"/>
    <polygon points="29,34 27,40 31,34" fill="#d4c060"/>
    <polygon points="35,34 37,40 33,34" fill="#d4c060"/>
    <rect x="2" y="38" width="16" height="6" rx="3" fill="#5a7030" transform="rotate(-20 10 41)"/>
    <rect x="46" y="20" width="5" height="28" rx="2" fill="#8b7040"/>
    <polygon points="44,20 51,20 47.5,10" fill="#a09050"/>
    <polygon points="51,20 58,20 54.5,28" fill="#808040" opacity="0.7"/>
    <ellipse cx="22" cy="60" rx="7" ry="5" fill="#4a6020"/>
    <ellipse cx="42" cy="60" rx="7" ry="5" fill="#4a6020"/>
  </svg>`,

  mountain_bear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="30" cy="44" rx="24" ry="17" fill="#6b4020"/>
    <ellipse cx="50" cy="36" rx="16" ry="14" fill="#7a5030"/>
    <ellipse cx="10" cy="44" rx="8" ry="8" fill="#6b4020"/>
    <circle cx="20" cy="28" r="5" fill="#5a3010"/>
    <circle cx="34" cy="28" r="5" fill="#5a3010"/>
    <ellipse cx="56" cy="30" rx="8" ry="7" fill="#7a5030"/>
    <circle cx="58" cy="28" r="2.5" fill="#c8a050"/>
    <circle cx="58" cy="28" r="1" fill="#1a0a00"/>
    <ellipse cx="60" cy="30" rx="4" ry="3" fill="#6b4020"/>
    <path d="M50,38 Q58,42 60,48" fill="none" stroke="#c8a050" stroke-width="3" stroke-linecap="round"/>
    <rect x="10" y="56" width="9" height="10" rx="4" fill="#4a2a10"/>
    <rect x="22" y="58" width="9" height="8" rx="4" fill="#4a2a10"/>
    <rect x="34" y="58" width="9" height="8" rx="4" fill="#4a2a10"/>
    <rect x="44" y="56" width="9" height="10" rx="4" fill="#4a2a10"/>
    <ellipse cx="30" cy="44" rx="12" ry="6" fill="#c8a050" opacity="0.35"/>
  </svg>`,

  highpass_skeleton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <line x1="32" y1="20" x2="32" y2="56" stroke="#e0ddd0" stroke-width="3"/>
    <ellipse cx="32" cy="15" rx="11" ry="12" fill="#e0ddd0"/>
    <ellipse cx="27" cy="13" rx="3.5" ry="4" fill="#b0a890"/>
    <ellipse cx="37" cy="13" rx="3.5" ry="4" fill="#b0a890"/>
    <ellipse cx="27" cy="13" rx="2" ry="2.5" fill="#888070" opacity="0.9"/>
    <ellipse cx="37" cy="13" rx="2" ry="2.5" fill="#888070" opacity="0.9"/>
    <rect x="25" y="22" width="14" height="6" rx="2" fill="#d0cec0"/>
    <line x1="28" y1="22" x2="28" y2="28" stroke="#a0a090" stroke-width="1"/>
    <line x1="32" y1="22" x2="32" y2="28" stroke="#a0a090" stroke-width="1"/>
    <line x1="36" y1="22" x2="36" y2="28" stroke="#a0a090" stroke-width="1"/>
    <path d="M24,30 Q18,34 20,40" fill="none" stroke="#e0ddd0" stroke-width="2"/>
    <path d="M26,32 Q19,37 21,43" fill="none" stroke="#e0ddd0" stroke-width="2"/>
    <path d="M40,30 Q46,34 44,40" fill="none" stroke="#e0ddd0" stroke-width="2"/>
    <path d="M38,32 Q45,37 43,43" fill="none" stroke="#e0ddd0" stroke-width="2"/>
    <ellipse cx="32" cy="46" rx="8" ry="5" fill="none" stroke="#e0ddd0" stroke-width="2"/>
    <line x1="26" y1="50" x2="22" y2="63" stroke="#e0ddd0" stroke-width="3" stroke-linecap="round"/>
    <line x1="38" y1="50" x2="42" y2="63" stroke="#e0ddd0" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="30" x2="10" y2="42" stroke="#e0ddd0" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="30" x2="54" y2="42" stroke="#e0ddd0" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="35" rx="14" ry="12" fill="#c0c0b8" opacity="0.12"/>
  </svg>`,

  rock_troll: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="48" rx="20" ry="16" fill="#6a6458"/>
    <ellipse cx="32" cy="26" rx="18" ry="16" fill="#7a7468"/>
    <ellipse cx="32" cy="20" rx="14" ry="12" fill="#8a8070"/>
    <ellipse cx="24" cy="17" rx="4" ry="5" fill="#6a6458"/>
    <ellipse cx="40" cy="17" rx="4" ry="5" fill="#6a6458"/>
    <ellipse cx="26" cy="18" rx="2.5" ry="3" fill="#1a1810"/>
    <ellipse cx="38" cy="18" rx="2.5" ry="3" fill="#1a1810"/>
    <ellipse cx="26" cy="18" rx="1.2" ry="1.5" fill="#d0c890"/>
    <ellipse cx="38" cy="18" rx="1.2" ry="1.5" fill="#d0c890"/>
    <path d="M24,26 Q32,30 40,26" fill="#6a6458" stroke="#4a4440" stroke-width="1"/>
    <rect x="2" y="38" width="14" height="8" rx="4" fill="#6a6458"/>
    <rect x="48" y="38" width="14" height="8" rx="4" fill="#6a6458"/>
    <ellipse cx="20" cy="62" rx="10" ry="6" fill="#5a5448"/>
    <ellipse cx="44" cy="62" rx="10" ry="6" fill="#5a5448"/>
    <line x1="22" y1="28" x2="18" y2="22" stroke="#4a4440" stroke-width="2"/>
    <line x1="32" y1="24" x2="30" y2="18" stroke="#4a4440" stroke-width="2"/>
    <line x1="42" y1="28" x2="46" y2="22" stroke="#4a4440" stroke-width="2"/>
    <line x1="26" y1="38" x2="22" y2="32" stroke="#4a4440" stroke-width="1.5"/>
    <line x1="38" y1="38" x2="42" y2="32" stroke="#4a4440" stroke-width="1.5"/>
  </svg>`,

  kithicor_skeleton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <line x1="32" y1="20" x2="32" y2="56" stroke="#c0bcb0" stroke-width="3"/>
    <ellipse cx="32" cy="15" rx="11" ry="12" fill="#c0bcb0"/>
    <ellipse cx="27" cy="13" rx="3.5" ry="4" fill="#404838"/>
    <ellipse cx="37" cy="13" rx="3.5" ry="4" fill="#404838"/>
    <ellipse cx="27" cy="13" rx="2" ry="2.5" fill="#40ff80" opacity="0.9"/>
    <ellipse cx="37" cy="13" rx="2" ry="2.5" fill="#40ff80" opacity="0.9"/>
    <ellipse cx="27" cy="13" rx="0.8" ry="1" fill="#80ffb0"/>
    <ellipse cx="37" cy="13" rx="0.8" ry="1" fill="#80ffb0"/>
    <rect x="25" y="22" width="14" height="6" rx="2" fill="#b0acaa"/>
    <line x1="28" y1="22" x2="28" y2="28" stroke="#404838" stroke-width="1"/>
    <line x1="32" y1="22" x2="32" y2="28" stroke="#404838" stroke-width="1"/>
    <line x1="36" y1="22" x2="36" y2="28" stroke="#404838" stroke-width="1"/>
    <path d="M24,30 Q18,34 20,40" fill="none" stroke="#c0bcb0" stroke-width="2"/>
    <path d="M26,32 Q19,37 21,43" fill="none" stroke="#c0bcb0" stroke-width="2"/>
    <path d="M40,30 Q46,34 44,40" fill="none" stroke="#c0bcb0" stroke-width="2"/>
    <path d="M38,32 Q45,37 43,43" fill="none" stroke="#c0bcb0" stroke-width="2"/>
    <ellipse cx="32" cy="46" rx="8" ry="5" fill="none" stroke="#c0bcb0" stroke-width="2"/>
    <line x1="26" y1="50" x2="22" y2="63" stroke="#c0bcb0" stroke-width="3" stroke-linecap="round"/>
    <line x1="38" y1="50" x2="42" y2="63" stroke="#c0bcb0" stroke-width="3" stroke-linecap="round"/>
    <line x1="22" y1="30" x2="10" y2="42" stroke="#c0bcb0" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="42" y1="30" x2="54" y2="42" stroke="#c0bcb0" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="35" rx="14" ry="12" fill="#40ff80" opacity="0.07"/>
  </svg>`,

  kithicor_zombie: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="46" rx="14" ry="16" fill="#506840"/>
    <ellipse cx="32" cy="46" rx="14" ry="16" fill="#405028" opacity="0.4"/>
    <ellipse cx="32" cy="24" rx="12" ry="13" fill="#607850"/>
    <ellipse cx="26" cy="21" rx="3.5" ry="3" fill="#202818"/>
    <ellipse cx="38" cy="21" rx="3.5" ry="3" fill="#202818"/>
    <ellipse cx="26" cy="21" rx="2" ry="2" fill="#80a060" opacity="0.7"/>
    <ellipse cx="38" cy="21" rx="2" ry="2" fill="#80a060" opacity="0.7"/>
    <path d="M26 29 Q32 33 38 29" fill="none" stroke="#2a3818" stroke-width="1.5"/>
    <rect x="3" y="36" width="15" height="7" rx="3.5" fill="#506840" transform="rotate(-15 10 39)"/>
    <rect x="46" y="36" width="15" height="7" rx="3.5" fill="#405028" transform="rotate(25 53 39)"/>
    <rect x="22" y="58" width="8" height="10" rx="4" fill="#405028"/>
    <rect x="34" y="58" width="8" height="10" rx="4" fill="#405028"/>
    <line x1="20" y1="36" x2="14" y2="30" stroke="#80a060" stroke-width="2" opacity="0.7"/>
    <line x1="44" y1="36" x2="50" y2="28" stroke="#80a060" stroke-width="2" opacity="0.7"/>
    <polygon points="28,10 32,2 36,10" fill="#80a060" opacity="0.5"/>
    <ellipse cx="32" cy="30" rx="10" ry="8" fill="#80a060" opacity="0.1"/>
  </svg>`,

  kithicor_warrior_spirit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="38" rx="18" ry="22" fill="#80c0ff" opacity="0.25"/>
    <path d="M18,42 Q16,54 22,60 Q28,66 32,62 Q36,66 42,60 Q48,54 46,42 Q40,32 32,30 Q24,32 18,42 Z" fill="#c0e8ff" opacity="0.35"/>
    <ellipse cx="32" cy="22" rx="12" ry="13" fill="#a0d0ff" opacity="0.6"/>
    <ellipse cx="26" cy="19" rx="3.5" ry="4" fill="#1a3050" opacity="0.8"/>
    <ellipse cx="38" cy="19" rx="3.5" ry="4" fill="#1a3050" opacity="0.8"/>
    <ellipse cx="26" cy="19" rx="2" ry="2.5" fill="#ffffff" opacity="0.9"/>
    <ellipse cx="38" cy="19" rx="2" ry="2.5" fill="#ffffff" opacity="0.9"/>
    <path d="M25,27 Q32,32 39,27" fill="none" stroke="#c0e8ff" stroke-width="1.5" opacity="0.8"/>
    <rect x="48" y="20" width="3" height="32" rx="1.5" fill="#c0e8ff" opacity="0.6" stroke="#ffffff" stroke-width="0.5"/>
    <polygon points="47,20 51,20 49,12" fill="#ffffff" opacity="0.7"/>
    <path d="M14,38 Q8,32 10,22" fill="none" stroke="#80c0ff" stroke-width="1.5" opacity="0.5" stroke-dasharray="3,2"/>
    <path d="M50,38 Q56,32 54,22" fill="none" stroke="#80c0ff" stroke-width="1.5" opacity="0.5" stroke-dasharray="3,2"/>
    <polygon points="8,46 11,38 14,46" fill="#c0e8ff" opacity="0.5"/>
    <polygon points="50,46 53,38 56,46" fill="#c0e8ff" opacity="0.5"/>
    <ellipse cx="32" cy="35" rx="20" ry="22" fill="none" stroke="#80c0ff" stroke-width="1" opacity="0.3" stroke-dasharray="4,3"/>
  </svg>`,

  corrupted_treant: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="20" y="28" width="24" height="36" rx="4" fill="#2a1a08"/>
    <rect x="20" y="28" width="24" height="36" rx="4" fill="#1a3010" opacity="0.5"/>
    <ellipse cx="32" cy="20" rx="22" ry="16" fill="#2a1a08"/>
    <ellipse cx="32" cy="20" rx="16" ry="12" fill="#1a2808"/>
    <ellipse cx="26" cy="18" rx="4" ry="5" fill="#1a0808"/>
    <ellipse cx="38" cy="18" rx="4" ry="5" fill="#1a0808"/>
    <ellipse cx="26" cy="18" rx="2" ry="2.5" fill="#c03020"/>
    <ellipse cx="38" cy="18" rx="2" ry="2.5" fill="#c03020"/>
    <path d="M4 32 Q8 24 14 28 Q8 32 4 40" fill="none" stroke="#2a1a08" stroke-width="6" stroke-linecap="round"/>
    <path d="M60 32 Q56 24 50 28 Q56 32 60 40" fill="none" stroke="#2a1a08" stroke-width="6" stroke-linecap="round"/>
    <line x1="24" y1="32" x2="20" y2="26" stroke="#c03020" stroke-width="1.5" opacity="0.8"/>
    <line x1="32" y1="28" x2="32" y2="22" stroke="#c03020" stroke-width="1.5" opacity="0.8"/>
    <line x1="40" y1="32" x2="44" y2="26" stroke="#c03020" stroke-width="1.5" opacity="0.8"/>
    <line x1="24" y1="44" x2="18" y2="40" stroke="#c03020" stroke-width="1" opacity="0.6"/>
    <line x1="40" y1="44" x2="46" y2="40" stroke="#c03020" stroke-width="1" opacity="0.6"/>
    <line x1="28" y1="52" x2="24" y2="48" stroke="#c03020" stroke-width="1" opacity="0.5"/>
    <line x1="36" y1="52" x2="40" y2="48" stroke="#c03020" stroke-width="1" opacity="0.5"/>
    <ellipse cx="32" cy="32" rx="10" ry="8" fill="#c03020" opacity="0.08"/>
  </svg>`,

  kithicor_dark_elf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="12" ry="16" fill="#404080"/>
    <ellipse cx="32" cy="44" rx="12" ry="16" fill="#201028" opacity="0.7"/>
    <ellipse cx="32" cy="22" rx="11" ry="10" fill="#d0c0e0"/>
    <polygon points="20,16 17,6 25,14" fill="#d0c0e0"/>
    <polygon points="44,16 47,6 39,14" fill="#d0c0e0"/>
    <ellipse cx="27" cy="20" rx="3" ry="3" fill="#1a0810"/>
    <ellipse cx="37" cy="20" rx="3" ry="3" fill="#1a0810"/>
    <ellipse cx="27" cy="20" rx="1.5" ry="1.5" fill="#cc3020"/>
    <ellipse cx="37" cy="20" rx="1.5" ry="1.5" fill="#cc3020"/>
    <path d="M27 27 Q32 30 37 27" fill="none" stroke="#8060a0" stroke-width="1.5"/>
    <rect x="4" y="36" width="14" height="5" rx="2.5" fill="#404080" transform="rotate(-20 11 38)"/>
    <rect x="46" y="26" width="3" height="24" rx="1" fill="#8060a0"/>
    <polygon points="46,26 49,26 47.5,18" fill="#a080c0"/>
    <ellipse cx="24" cy="60" rx="6" ry="4" fill="#201028"/>
    <ellipse cx="40" cy="60" rx="6" ry="4" fill="#201028"/>
    <ellipse cx="32" cy="40" rx="8" ry="10" fill="#4a2060" opacity="0.5"/>
  </svg>`,

  general_kill_anaz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <line x1="32" y1="20" x2="32" y2="58" stroke="#c8d0e0" stroke-width="3.5"/>
    <ellipse cx="32" cy="14" rx="13" ry="13" fill="#c8d0e0"/>
    <polygon points="18,10 32,0 46,10 42,18 22,18" fill="#a0a8c0"/>
    <polygon points="28,0 32,-6 36,0" fill="#ffd700"/>
    <polygon points="22,0 28,0 24,6" fill="#ffd700" opacity="0.8"/>
    <polygon points="36,0 42,0 40,6" fill="#ffd700" opacity="0.8"/>
    <ellipse cx="26" cy="13" rx="3.5" ry="4" fill="#102010"/>
    <ellipse cx="38" cy="13" rx="3.5" ry="4" fill="#102010"/>
    <ellipse cx="26" cy="13" rx="2" ry="2.5" fill="#60ff80"/>
    <ellipse cx="38" cy="13" rx="2" ry="2.5" fill="#60ff80"/>
    <rect x="22" y="22" width="20" height="8" rx="2" fill="#a0a8c0"/>
    <line x1="26" y1="22" x2="26" y2="30" stroke="#60ff80" stroke-width="1" opacity="0.7"/>
    <line x1="32" y1="22" x2="32" y2="30" stroke="#60ff80" stroke-width="1" opacity="0.7"/>
    <line x1="38" y1="22" x2="38" y2="30" stroke="#60ff80" stroke-width="1" opacity="0.7"/>
    <path d="M20,32 Q14,36 16,44" fill="none" stroke="#c8d0e0" stroke-width="2.5"/>
    <path d="M22,34 Q15,40 17,47" fill="none" stroke="#c8d0e0" stroke-width="2"/>
    <path d="M44,32 Q50,36 48,44" fill="none" stroke="#c8d0e0" stroke-width="2.5"/>
    <path d="M42,34 Q49,40 47,47" fill="none" stroke="#c8d0e0" stroke-width="2"/>
    <ellipse cx="32" cy="48" rx="9" ry="6" fill="none" stroke="#c8d0e0" stroke-width="2.5"/>
    <line x1="25" y1="52" x2="20" y2="64" stroke="#c8d0e0" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="39" y1="52" x2="44" y2="64" stroke="#c8d0e0" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="46" y="24" width="5" height="32" rx="2" fill="#8090a0"/>
    <polygon points="45,24 51,24 48,14" fill="#a0b0c0"/>
    <ellipse cx="32" cy="35" rx="16" ry="14" fill="#60ff80" opacity="0.07"/>
    <ellipse cx="32" cy="35" rx="20" ry="18" fill="none" stroke="#60ff80" stroke-width="1" opacity="0.25" stroke-dasharray="4,3"/>
  </svg>`,

  orc_warrior: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="14" ry="14" fill="#4a7020"/>
    <ellipse cx="32" cy="22" rx="13" ry="12" fill="#608030"/>
    <ellipse cx="26" cy="20" rx="3" ry="3.5" fill="#2a4a10"/>
    <ellipse cx="38" cy="20" rx="3" ry="3.5" fill="#2a4a10"/>
    <ellipse cx="26" cy="20" rx="1.8" ry="2.2" fill="#90c040" opacity="0.8"/>
    <ellipse cx="38" cy="20" rx="1.8" ry="2.2" fill="#90c040" opacity="0.8"/>
    <polygon points="28,28 26,34 30,28" fill="#c8a050"/>
    <polygon points="36,28 38,34 34,28" fill="#c8a050"/>
    <rect x="4" y="36" width="14" height="7" rx="3.5" fill="#4a7020" transform="rotate(-20 11 39)"/>
    <rect x="46" y="24" width="5" height="30" rx="2" fill="#808890"/>
    <polygon points="45,24 51,24 48,14" fill="#909090"/>
    <polygon points="46,30 56,30 56,36 46,36" fill="#606870" opacity="0.8"/>
    <ellipse cx="24" cy="58" rx="7" ry="5" fill="#3a6010"/>
    <ellipse cx="40" cy="58" rx="7" ry="5" fill="#3a6010"/>
    <ellipse cx="32" cy="42" rx="8" ry="5" fill="#608030" opacity="0.3"/>
  </svg>`,

  orc_shaman: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="13" ry="14" fill="#3a6018"/>
    <ellipse cx="32" cy="22" rx="12" ry="11" fill="#508028"/>
    <ellipse cx="26" cy="20" rx="3" ry="3" fill="#1a3808"/>
    <ellipse cx="38" cy="20" rx="3" ry="3" fill="#1a3808"/>
    <ellipse cx="26" cy="20" rx="1.8" ry="1.8" fill="#90c040" opacity="0.8"/>
    <ellipse cx="38" cy="20" rx="1.8" ry="1.8" fill="#90c040" opacity="0.8"/>
    <polygon points="28,28 26,33 30,28" fill="#c8a050"/>
    <polygon points="36,28 38,33 34,28" fill="#c8a050"/>
    <line x1="22" y1="18" x2="18" y2="14" stroke="#cc8020" stroke-width="2"/>
    <line x1="26" y1="16" x2="22" y2="10" stroke="#cc8020" stroke-width="1.5"/>
    <line x1="42" y1="18" x2="46" y2="14" stroke="#cc8020" stroke-width="2"/>
    <line x1="38" y1="16" x2="42" y2="10" stroke="#cc8020" stroke-width="1.5"/>
    <rect x="4" y="38" width="13" height="5" rx="2.5" fill="#3a6018" transform="rotate(-15 10 40)"/>
    <rect x="46" y="16" width="4" height="32" rx="2" fill="#8a5020"/>
    <circle cx="48" cy="13" r="6" fill="#1a4a60"/>
    <circle cx="48" cy="13" r="4" fill="#40ccff" opacity="0.8"/>
    <circle cx="48" cy="13" r="2" fill="#a0eeff"/>
    <ellipse cx="24" cy="58" rx="7" ry="5" fill="#2a5010"/>
    <ellipse cx="40" cy="58" rx="7" ry="5" fill="#2a5010"/>
  </svg>`,

  orc_captain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="46" rx="16" ry="15" fill="#3a5818"/>
    <rect x="20" y="32" width="24" height="18" rx="3" fill="#606868" opacity="0.8"/>
    <ellipse cx="32" cy="22" rx="14" ry="13" fill="#608030"/>
    <polygon points="18,12 32,4 46,12 44,22 20,22" fill="#505858"/>
    <ellipse cx="26" cy="19" rx="3.5" ry="3.5" fill="#1a3808"/>
    <ellipse cx="38" cy="19" rx="3.5" ry="3.5" fill="#1a3808"/>
    <ellipse cx="26" cy="19" rx="2" ry="2" fill="#90c040" opacity="0.7"/>
    <ellipse cx="38" cy="19" rx="2" ry="2" fill="#90c040" opacity="0.7"/>
    <polygon points="28,27 26,33 30,27" fill="#c8a050"/>
    <polygon points="36,27 38,33 34,27" fill="#c8a050"/>
    <rect x="2" y="38" width="16" height="8" rx="4" fill="#505858"/>
    <polygon points="2,38 12,30 12,46" fill="#7a8888" opacity="0.8"/>
    <rect x="46" y="26" width="4" height="28" rx="2" fill="#d4c060"/>
    <polygon points="45,26 50,26 47.5,16" fill="#e0d070"/>
    <ellipse cx="22" cy="62" rx="8" ry="5" fill="#2a4010"/>
    <ellipse cx="42" cy="62" rx="8" ry="5" fill="#2a4010"/>
  </svg>`,

  commonlands_lion: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <path d="M8 44 Q4 36 6 28" fill="none" stroke="#c8902a" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="32" cy="44" rx="22" ry="14" fill="#c8902a"/>
    <ellipse cx="50" cy="34" rx="14" ry="12" fill="#d4a040"/>
    <circle cx="50" cy="30" r="12" fill="#8b6018" opacity="0.7"/>
    <ellipse cx="56" cy="28" rx="10" ry="9" fill="#d4a040"/>
    <polygon points="50,20 54,10 60,20" fill="#c8902a"/>
    <polygon points="58,18 62,10 64,18" fill="#c8902a"/>
    <circle cx="58" cy="26" r="2.5" fill="#181008"/>
    <circle cx="58" cy="26" r="1.2" fill="#402008"/>
    <ellipse cx="62" cy="28" rx="4" ry="3" fill="#e0b870"/>
    <path d="M60,32 Q64,36 62,42" fill="none" stroke="#c8902a" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="12" y="54" width="8" height="10" rx="4" fill="#a07020"/>
    <rect x="24" y="56" width="7" height="8" rx="3.5" fill="#a07020"/>
    <rect x="35" y="56" width="7" height="8" rx="3.5" fill="#a07020"/>
    <rect x="46" y="54" width="8" height="10" rx="4" fill="#a07020"/>
    <ellipse cx="28" cy="44" rx="12" ry="7" fill="#e0b870" opacity="0.4"/>
  </svg>`,

  dark_elf_ranger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="44" rx="11" ry="16" fill="#402060"/>
    <ellipse cx="32" cy="44" rx="11" ry="16" fill="#180c20" opacity="0.6"/>
    <ellipse cx="32" cy="22" rx="10" ry="9" fill="#c0a8d0"/>
    <polygon points="20,16 17,6 25,14" fill="#c0a8d0"/>
    <polygon points="44,16 47,6 39,14" fill="#c0a8d0"/>
    <ellipse cx="27" cy="20" rx="2.5" ry="2.5" fill="#0a0010"/>
    <ellipse cx="37" cy="20" rx="2.5" ry="2.5" fill="#0a0010"/>
    <ellipse cx="27" cy="20" rx="1.3" ry="1.3" fill="#cc3020"/>
    <ellipse cx="37" cy="20" rx="1.3" ry="1.3" fill="#cc3020"/>
    <rect x="4" y="34" width="12" height="5" rx="2.5" fill="#402060" transform="rotate(-15 10 36)"/>
    <path d="M48 10 Q50 32 48 56" fill="none" stroke="#8b6030" stroke-width="3" stroke-linecap="round"/>
    <line x1="48" y1="20" x2="58" y2="26" stroke="#8b6030" stroke-width="1.5"/>
    <line x1="48" y1="30" x2="58" y2="32" stroke="#8b6030" stroke-width="1.5"/>
    <line x1="48" y1="40" x2="58" y2="36" stroke="#8b6030" stroke-width="1.5"/>
    <ellipse cx="24" cy="60" rx="6" ry="4" fill="#180c20"/>
    <ellipse cx="40" cy="60" rx="6" ry="4" fill="#180c20"/>
  </svg>`,

  crushbone_warlord: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="48" rx="18" ry="16" fill="#304010"/>
    <rect x="18" y="34" width="28" height="22" rx="3" fill="#505858" opacity="0.85"/>
    <ellipse cx="32" cy="22" rx="16" ry="15" fill="#506020"/>
    <polygon points="16,12 32,2 48,12 46,24 18,24" fill="#4a5050"/>
    <ellipse cx="26" cy="18" rx="4" ry="4.5" fill="#1a2808"/>
    <ellipse cx="38" cy="18" rx="4" ry="4.5" fill="#1a2808"/>
    <ellipse cx="26" cy="18" rx="2.5" ry="3" fill="#cc4020"/>
    <ellipse cx="38" cy="18" rx="2.5" ry="3" fill="#cc4020"/>
    <polygon points="27,27 25,34 29,27" fill="#c8a040"/>
    <polygon points="37,27 39,34 35,27" fill="#c8a040"/>
    <rect x="2" y="36" width="16" height="9" rx="4" fill="#505858"/>
    <ellipse cx="6" cy="36" r="6" fill="#cc4020" opacity="0.6"/>
    <rect x="46" y="36" width="16" height="9" rx="4" fill="#505858"/>
    <ellipse cx="58" cy="36" r="6" fill="#cc4020" opacity="0.6"/>
    <rect x="48" y="18" width="7" height="36" rx="3" fill="#8a8848"/>
    <polygon points="46,18 55,18 50.5,6" fill="#d4c050"/>
    <polygon points="54,24 62,22 58,34" fill="#a0a040" opacity="0.8"/>
    <ellipse cx="20" cy="64" rx="9" ry="6" fill="#203010"/>
    <ellipse cx="44" cy="64" rx="9" ry="6" fill="#203010"/>
  </svg>`,

  plague_spectre: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <ellipse cx="32" cy="36" rx="22" ry="26" fill="#306030" opacity="0.45"/>
    <path d="M16,40 Q14,54 20,60 Q26,66 32,62 Q38,66 44,60 Q50,54 48,40 Q42,28 32,26 Q22,28 16,40 Z" fill="#406040" opacity="0.55"/>
    <path d="M20,60 Q22,66 18,70" fill="none" stroke="#80ff80" stroke-width="2" opacity="0.7"/>
    <path d="M32,62 Q32,68 30,72" fill="none" stroke="#80ff80" stroke-width="2" opacity="0.7"/>
    <path d="M44,60 Q42,66 46,70" fill="none" stroke="#80ff80" stroke-width="2" opacity="0.7"/>
    <ellipse cx="32" cy="22" rx="14" ry="14" fill="#3a6030" opacity="0.9"/>
    <ellipse cx="26" cy="19" rx="4" ry="5" fill="#0a1a08"/>
    <ellipse cx="38" cy="19" rx="4" ry="5" fill="#0a1a08"/>
    <ellipse cx="26" cy="19" rx="2.5" ry="3.5" fill="#ccff40" opacity="0.9"/>
    <ellipse cx="38" cy="19" rx="2.5" ry="3.5" fill="#ccff40" opacity="0.9"/>
    <ellipse cx="26" cy="19" rx="1" ry="1.5" fill="#eeffaa"/>
    <ellipse cx="38" cy="19" rx="1" ry="1.5" fill="#eeffaa"/>
    <path d="M25,27 Q32,32 39,27" fill="#0a1a08" stroke="#1a3010" stroke-width="1"/>
    <circle cx="18" cy="30" r="3" fill="#ccff40" opacity="0.4"/>
    <circle cx="46" cy="34" r="2.5" fill="#ccff40" opacity="0.4"/>
    <circle cx="24" cy="46" r="2" fill="#80ff80" opacity="0.5"/>
    <circle cx="40" cy="48" r="2" fill="#80ff80" opacity="0.5"/>
    <circle cx="32" cy="54" r="3" fill="#ccff40" opacity="0.4"/>
    <polygon points="8,44 11,36 14,44" fill="#d0e8d0" opacity="0.5"/>
    <polygon points="50,44 53,36 56,44" fill="#d0e8d0" opacity="0.5"/>
    <ellipse cx="32" cy="36" rx="20" ry="24" fill="none" stroke="#80ff80" stroke-width="1" opacity="0.3" stroke-dasharray="4,3"/>
  </svg>`,

};
const PORTRAITS = {

  warrior: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#3a2a14"/>
    <rect x="15" y="22" width="18" height="20" rx="2" fill="#8a6820"/>
    <rect x="15" y="22" width="18" height="6" rx="2" fill="#aaaaaa"/>
    <rect x="13" y="24" width="5" height="14" rx="2" fill="#7a5810"/>
    <rect x="30" y="24" width="5" height="14" rx="2" fill="#7a5810"/>
    <circle cx="24" cy="15" r="9" fill="#c8a070"/>
    <rect x="16" y="8" width="16" height="9" rx="4" fill="#888"/>
    <circle cx="24" cy="13" r="2" fill="#444"/>
    <rect x="36" y="14" width="3" height="28" rx="1.5" fill="#bbb"/>
    <polygon points="36,14 39,14 37.5,6" fill="#ddd"/>
    <rect x="36" y="26" width="8" height="2" rx="1" fill="#999"/>
  </svg>`,

  paladin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#1a1a30"/>
    <circle cx="24" cy="24" r="22" fill="#e8c820" opacity="0.15"/>
    <rect x="15" y="22" width="18" height="20" rx="2" fill="#d4c080"/>
    <rect x="15" y="22" width="18" height="6" rx="2" fill="#eeeeee"/>
    <rect x="13" y="24" width="5" height="14" rx="2" fill="#b8a060"/>
    <rect x="30" y="24" width="5" height="14" rx="2" fill="#b8a060"/>
    <circle cx="24" cy="15" r="9" fill="#d8b880"/>
    <rect x="16" y="8" width="16" height="9" rx="4" fill="#d4c080"/>
    <rect x="21" y="6" width="6" height="2" rx="1" fill="#e8c820"/>
    <line x1="24" y1="30" x2="24" y2="36" stroke="#e8c820" stroke-width="2"/>
    <line x1="20" y1="33" x2="28" y2="33" stroke="#e8c820" stroke-width="2"/>
  </svg>`,

  shadowknight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#0a0010"/>
    <circle cx="24" cy="24" r="22" fill="#440088" opacity="0.3"/>
    <rect x="15" y="22" width="18" height="20" rx="2" fill="#1a1020"/>
    <rect x="15" y="22" width="18" height="6" rx="2" fill="#333"/>
    <rect x="13" y="24" width="5" height="14" rx="2" fill="#111018"/>
    <rect x="30" y="24" width="5" height="14" rx="2" fill="#111018"/>
    <circle cx="24" cy="15" r="9" fill="#2a1a30"/>
    <rect x="16" y="8" width="16" height="9" rx="4" fill="#1a1020"/>
    <circle cx="22" cy="14" r="2" fill="#8800ff"/>
    <circle cx="26" cy="14" r="2" fill="#8800ff"/>
    <rect x="36" y="12" width="3" height="30" rx="1.5" fill="#332244"/>
    <polygon points="36,12 39,12 37.5,3" fill="#440066"/>
    <line x1="24" y1="28" x2="24" y2="38" stroke="#6600aa" stroke-width="1.5" opacity="0.6"/>
  </svg>`,

  ranger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#0a1a08"/>
    <rect x="16" y="22" width="16" height="20" rx="2" fill="#3a6020"/>
    <rect x="16" y="22" width="16" height="6" rx="2" fill="#5a8030"/>
    <circle cx="24" cy="15" r="9" fill="#c8a870"/>
    <rect x="16" y="8" width="16" height="8" rx="3" fill="#3a6020"/>
    <rect x="14" y="24" width="4" height="12" rx="2" fill="#2a4a18"/>
    <rect x="30" y="24" width="4" height="12" rx="2" fill="#2a4a18"/>
    <path d="M8 10 Q12 24 8 38" fill="none" stroke="#8a6020" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="8" y1="10" x2="8" y2="38" stroke="#8a6020" stroke-width="1.5"/>
    <line x1="18" y1="24" x2="8" y2="24" stroke="#c8a030" stroke-width="1.5" stroke-dasharray="2,2"/>
    <circle cx="8" cy="24" r="1.5" fill="#c8a030"/>
  </svg>`,

  bard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#1a0a2a"/>
    <rect x="16" y="22" width="16" height="20" rx="2" fill="#883090"/>
    <rect x="16" y="22" width="16" height="6" rx="2" fill="#aa44bb"/>
    <circle cx="24" cy="15" r="9" fill="#d0a870"/>
    <rect x="16" y="8" width="16" height="8" rx="3" fill="#bb4400"/>
    <ellipse cx="10" cy="30" rx="5" ry="7" fill="#8a4000" transform="rotate(-20 10 30)"/>
    <line x1="14" y1="24" x2="6" y2="27" stroke="#c8a030" stroke-width="1"/>
    <line x1="14" y1="26" x2="6" y2="29" stroke="#c8a030" stroke-width="1"/>
    <line x1="14" y1="28" x2="6" y2="31" stroke="#c8a030" stroke-width="1"/>
    <circle cx="6" cy="24" r="2" fill="#c8a030"/>
    <rect x="14" y="24" width="4" height="12" rx="2" fill="#6a2070"/>
    <rect x="30" y="24" width="4" height="12" rx="2" fill="#6a2070"/>
  </svg>`,

  beastlord: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#1a0e04"/>
    <rect x="17" y="22" width="14" height="20" rx="2" fill="#8a5020"/>
    <circle cx="24" cy="15" r="9" fill="#c89060"/>
    <rect x="17" y="8" width="14" height="8" rx="3" fill="#6a3810"/>
    <rect x="15" y="24" width="4" height="12" rx="2" fill="#7a4018"/>
    <rect x="29" y="24" width="4" height="12" rx="2" fill="#7a4018"/>
    <ellipse cx="10" cy="38" rx="7" ry="5" fill="#8a6030"/>
    <circle cx="8" cy="36" r="3" fill="#5a3a18"/>
    <polygon points="6,34 5,30 8,32" fill="#5a3a18"/>
    <polygon points="10,34 11,30 8,32" fill="#5a3a18"/>
    <circle cx="7" cy="36" r="1" fill="#222"/>
  </svg>`,

  berserker: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#1a0400"/>
    <circle cx="24" cy="24" r="22" fill="#cc2200" opacity="0.2"/>
    <rect x="16" y="22" width="16" height="20" rx="2" fill="#7a1008"/>
    <rect x="16" y="22" width="16" height="6" rx="2" fill="#cc2200"/>
    <circle cx="24" cy="15" r="9" fill="#c87060"/>
    <rect x="16" y="8" width="16" height="8" rx="3" fill="#5a0808"/>
    <circle cx="21" cy="13" r="2" fill="#cc2200"/>
    <circle cx="27" cy="13" r="2" fill="#cc2200"/>
    <rect x="14" y="24" width="4" height="14" rx="2" fill="#601008"/>
    <rect x="30" y="24" width="4" height="14" rx="2" fill="#601008"/>
    <rect x="4" y="20" width="12" height="5" rx="2" fill="#5a0808" transform="rotate(-30 4 20)"/>
    <polygon points="4,20 16,20 10,12" fill="#7a0a0a" transform="rotate(-30 4 20)"/>
  </svg>`,

  monk: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#1a1408"/>
    <rect x="17" y="22" width="14" height="20" rx="2" fill="#c87818"/>
    <rect x="17" y="22" width="14" height="6" rx="2" fill="#e8a030"/>
    <circle cx="24" cy="15" r="9" fill="#d09860"/>
    <rect x="21" y="8" width="6" height="4" rx="2" fill="#c87818"/>
    <rect x="15" y="24" width="4" height="14" rx="2" fill="#b86810"/>
    <rect x="29" y="24" width="4" height="14" rx="2" fill="#b86810"/>
    <line x1="14" y1="30" x2="6" y2="22" stroke="#e8a030" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="34" y1="30" x2="42" y2="22" stroke="#e8a030" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="17" y1="22" x2="31" y2="22" stroke="#e8a030" stroke-width="1.5"/>
    <circle cx="24" cy="19" r="1.5" fill="#e8a030"/>
  </svg>`,

  rogue: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#080808"/>
    <rect x="16" y="22" width="16" height="20" rx="2" fill="#222"/>
    <rect x="16" y="22" width="16" height="6" rx="2" fill="#333"/>
    <circle cx="24" cy="15" r="9" fill="#888"/>
    <rect x="14" y="8" width="20" height="10" rx="4" fill="#1a1a1a"/>
    <rect x="16" y="11" width="16" height="6" rx="3" fill="#222"/>
    <rect x="14" y="24" width="4" height="14" rx="2" fill="#1a1a1a"/>
    <rect x="30" y="24" width="4" height="14" rx="2" fill="#1a1a1a"/>
    <rect x="32" y="30" width="2.5" height="12" rx="1.2" fill="#aaa" transform="rotate(-20 32 30)"/>
    <polygon points="32,30 34.5,30 33.2,24" fill="#ddd" transform="rotate(-20 32 30)"/>
    <circle cx="22" cy="14" r="1.5" fill="#333"/>
    <circle cx="26" cy="14" r="1.5" fill="#333"/>
  </svg>`,

  wizard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#080820"/>
    <polygon points="24,22 16,22 32,22 24,22 20,42 28,42" fill="#1a2080"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#2030a0"/>
    <circle cx="24" cy="15" r="9" fill="#b0a8c8"/>
    <polygon points="16,14 24,2 32,14" fill="#2030a0"/>
    <circle cx="24" cy="4" r="3" fill="#4488ff"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#1a2080"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#1a2080"/>
    <rect x="34" y="14" width="3" height="28" rx="1.5" fill="#4060c0"/>
    <circle cx="35.5" cy="12" r="4" fill="#4488ff" opacity="0.9"/>
    <circle cx="35.5" cy="12" r="2" fill="#88bbff"/>
    <circle cx="20" cy="14" r="2" fill="#111"/>
    <circle cx="28" cy="14" r="2" fill="#111"/>
  </svg>`,

  magician: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#200808"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#c03000"/>
    <circle cx="24" cy="15" r="9" fill="#d09860"/>
    <polygon points="16,14 24,1 32,14" fill="#c03000"/>
    <circle cx="24" cy="3" r="3" fill="#ff6600"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#a02800"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#a02800"/>
    <rect x="34" y="12" width="3" height="30" rx="1.5" fill="#a02800"/>
    <circle cx="35.5" cy="10" r="4" fill="#ff6600" opacity="0.9"/>
    <circle cx="35.5" cy="10" r="2" fill="#ffaa44"/>
    <circle cx="21" cy="14" r="2" fill="#111"/>
    <circle cx="27" cy="14" r="2" fill="#111"/>
    <circle cx="10" cy="20" r="2" fill="#ff6600" opacity="0.7"/>
    <circle cx="12" cy="32" r="1.5" fill="#ff6600" opacity="0.5"/>
  </svg>`,

  necromancer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#040008"/>
    <circle cx="24" cy="24" r="22" fill="#440066" opacity="0.3"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#1a0030"/>
    <circle cx="24" cy="15" r="9" fill="#c0b0c8"/>
    <polygon points="16,14 24,1 32,14" fill="#1a0030"/>
    <ellipse cx="20" cy="13" rx="4" ry="5" fill="#0a0018"/>
    <ellipse cx="28" cy="13" rx="4" ry="5" fill="#0a0018"/>
    <circle cx="20" cy="13" r="2" fill="#8800ff"/>
    <circle cx="28" cy="13" r="2" fill="#8800ff"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#110022"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#110022"/>
    <rect x="34" y="10" width="3" height="32" rx="1.5" fill="#330055"/>
    <circle cx="35.5" cy="8" r="5" fill="#440088"/>
    <circle cx="35.5" cy="8" r="3" fill="#8800ff"/>
    <circle cx="35.5" cy="8" r="1.5" fill="#cc44ff"/>
    <ellipse cx="32" cy="20" rx="3" ry="2" fill="#660099" opacity="0.5"/>
  </svg>`,

  enchanter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#0a0820"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#3020a0"/>
    <circle cx="24" cy="15" r="9" fill="#b8b0d8"/>
    <polygon points="16,14 24,1 32,14" fill="#3020a0"/>
    <circle cx="24" cy="3" r="3" fill="#8888ff"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#2a1888"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#2a1888"/>
    <circle cx="21" cy="14" r="2" fill="#111"/>
    <circle cx="27" cy="14" r="2" fill="#111"/>
    <circle cx="10" cy="18" r="2" fill="#aa88ff" opacity="0.8"/>
    <circle cx="6" cy="28" r="1.5" fill="#8866ff" opacity="0.7"/>
    <circle cx="12" cy="36" r="2" fill="#aa88ff" opacity="0.6"/>
    <circle cx="38" cy="20" r="2" fill="#aa88ff" opacity="0.8"/>
    <circle cx="40" cy="30" r="1.5" fill="#8866ff" opacity="0.7"/>
    <line x1="10" y1="18" x2="14" y2="22" stroke="#aa88ff" stroke-width="1" opacity="0.5"/>
    <line x1="38" y1="20" x2="34" y2="22" stroke="#aa88ff" stroke-width="1" opacity="0.5"/>
  </svg>`,

  cleric: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#101830"/>
    <circle cx="24" cy="24" r="22" fill="#e8e8e0" opacity="0.1"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#e8e4d0"/>
    <circle cx="24" cy="15" r="9" fill="#d8c898"/>
    <polygon points="16,14 24,2 32,14" fill="#d8d0b8"/>
    <circle cx="24" cy="4" r="3" fill="#e8c820"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#c8c4b0"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#c8c4b0"/>
    <line x1="24" y1="28" x2="24" y2="38" stroke="#e8c820" stroke-width="2.5"/>
    <line x1="19" y1="32" x2="29" y2="32" stroke="#e8c820" stroke-width="2.5"/>
    <circle cx="20" cy="14" r="2" fill="#222"/>
    <circle cx="28" cy="14" r="2" fill="#222"/>
  </svg>`,

  druid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#081408"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#2a6018"/>
    <circle cx="24" cy="15" r="9" fill="#b89060"/>
    <polygon points="16,14 24,2 32,14" fill="#2a6018"/>
    <circle cx="24" cy="4" r="3" fill="#44aa22"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#204810"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#204810"/>
    <circle cx="20" cy="14" r="2" fill="#1a1008"/>
    <circle cx="28" cy="14" r="2" fill="#1a1008"/>
    <rect x="34" y="14" width="3" height="26" rx="1.5" fill="#6a4010"/>
    <circle cx="35.5" cy="12" r="4" fill="#2a8010"/>
    <circle cx="35.5" cy="12" r="2.5" fill="#44aa22"/>
    <circle cx="8" cy="30" r="3" fill="#2a6018" opacity="0.7"/>
    <circle cx="6" cy="22" r="2" fill="#2a6018" opacity="0.5"/>
    <circle cx="10" cy="38" r="2.5" fill="#2a6018" opacity="0.6"/>
  </svg>`,

  shaman: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="6" fill="#100808"/>
    <polygon points="16,22 32,22 28,42 20,42" fill="#7a4010"/>
    <circle cx="24" cy="15" r="9" fill="#c89050"/>
    <polygon points="16,14 24,2 32,14" fill="#6a3808"/>
    <circle cx="24" cy="4" r="3" fill="#cc8820"/>
    <rect x="14" y="22" width="4" height="14" rx="2" fill="#6a3808"/>
    <rect x="30" y="22" width="4" height="14" rx="2" fill="#6a3808"/>
    <line x1="20" y1="12" x2="16" y2="8" stroke="#cc8820" stroke-width="2"/>
    <line x1="28" y1="12" x2="32" y2="8" stroke="#cc8820" stroke-width="2"/>
    <line x1="20" y1="16" x2="14" y2="16" stroke="#cc8820" stroke-width="1.5"/>
    <line x1="28" y1="16" x2="34" y2="16" stroke="#cc8820" stroke-width="1.5"/>
    <rect x="34" y="14" width="3" height="26" rx="1.5" fill="#8a5020"/>
    <circle cx="35.5" cy="11" r="4" fill="#cc8820"/>
    <circle cx="35.5" cy="11" r="2" fill="#ffcc44"/>
    <ellipse cx="22" cy="17" rx="2" ry="1" fill="#cc4400" opacity="0.6"/>
    <ellipse cx="26" cy="17" rx="2" ry="1" fill="#cc4400" opacity="0.6"/>
  </svg>`,
};

/**
 * Returns the inline SVG string for the given entity ID, falling back to a
 * grey question-mark placeholder when no sprite is registered for that ID.
 * @param {string} enemyId - The entity/enemy ID to look up in SPRITES.
 * @returns {string} The inline SVG markup for the entity icon.
 */
function getSprite(enemyId) {
  return SPRITES[enemyId] || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="4" fill="#888888"/><text x="32" y="38" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">?</text></svg>`;
}

/**
 * Returns a 128 × 128 version of the sprite for the given entity ID by
 * rewriting the width/height attributes on the SVG element.
 * @param {string} enemyId - The entity/enemy ID whose sprite should be enlarged.
 * @returns {string} The inline SVG markup resized to 128 × 128 pixels.
 */
function getLargeSprite(enemyId) {
  const svg = getSprite(enemyId);
  return svg.replace('<svg ', '<svg width="128" height="128" ');
}

if (typeof module !== 'undefined') module.exports = { SPRITES, PORTRAITS, getSprite, getLargeSprite };
