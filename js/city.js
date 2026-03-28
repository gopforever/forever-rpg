// city.js — Qeynos city data and logic for Forever RPG

// ─── Guild Data ───────────────────────────────────────────────────────────────

/**
 * Map of class ID to guild info for each playable class in Qeynos.
 * @type {object}
 */
const GUILDS = {
  warrior:      { name: 'Warriors of the Shield',   npc: 'Sergeant Darius Gandros', location: 'North Qeynos' },
  paladin:      { name: 'The Protectors of Pine',   npc: 'High Priest Nondank',     location: 'North Qeynos' },
  ranger:       { name: 'Rangers of the Farfield',  npc: 'Warden Nindric Laset',    location: 'North Qeynos' },
  rogue:        { name: 'The Qeynos Rogues',        npc: 'Hanlore Escaval',         location: 'South Qeynos' },
  bard:         { name: 'The Qeynos Bards',         npc: 'Lyris Moonwhisper',       location: 'North Qeynos' },
  monk:         { name: 'The Ashen Order',           npc: 'Master Tarn',             location: 'South Qeynos' },
  wizard:       { name: 'The Concordance',           npc: 'Mage Weith',              location: 'The Mage Tower' },
  magician:     { name: 'The Concordance',           npc: 'Vahlara the Summoner',    location: 'The Mage Tower' },
  enchanter:    { name: 'The Concordance',           npc: 'Jilea Windspell',         location: 'The Mage Tower' },
  necromancer:  { name: 'The Bloodsabers',           npc: 'Renux Herkanor',          location: 'Qeynos Sewers' },
  shadowknight: { name: 'The Bloodsabers',           npc: 'Renux Herkanor',          location: 'Qeynos Sewers' },
  cleric:       { name: 'Temple of Life',            npc: 'High Priestess Arynna',   location: 'North Qeynos' },
  druid:        { name: 'The Jaggedpine Treefolk',   npc: 'Sylvan Mosswick',         location: 'South Qeynos' },
  shaman:       { name: 'None (visit Halas)',         npc: null,                      location: null },
  beastlord:    { name: 'None (visit Shar Vahl)',    npc: null,                      location: null },
  berserker:    { name: 'None (visit Halas)',         npc: null,                      location: null },
};

// ─── City Vendor Inventory ────────────────────────────────────────────────────

/**
 * Array of vendor-sold items with buy prices.
 * @type {Array<object>}
 */
const CITY_VENDORS = [
  { itemId: 'cloth_cap',     buyPrice: 10  },
  { itemId: 'cloth_tunic',   buyPrice: 18  },
  { itemId: 'cloth_pants',   buyPrice: 15  },
  { itemId: 'simple_boots',  buyPrice: 12  },
  { itemId: 'short_sword',   buyPrice: 60  },
  { itemId: 'dagger',        buyPrice: 40  },
  { itemId: 'crude_mace',    buyPrice: 50  },
  { itemId: 'gnarled_staff', buyPrice: 45  },
  { itemId: 'crude_staff',   buyPrice: 35  },
  { itemId: 'small_shield',  buyPrice: 55  },
  { itemId: 'bread_loaf',    buyPrice: 3   },
];

// ─── Guild Spells ─────────────────────────────────────────────────────────────

/**
 * Array of purchasable spells organized by class, level, and effect.
 * @type {Array<object>}
 */
const GUILD_SPELLS = [
  // CLERIC
  { id: 'spell_minor_healing_clr', name: "Minor Healing", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'heal', value: 30 }, buyPrice: 500 },
  { id: 'spell_courage_clr', name: "Courage", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_divine_aura_clr', name: "Divine Aura", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'invulnerable', value: 1, duration: 6000 }, buyPrice: 500 },
  { id: 'spell_flash_of_light_clr', name: "Flash of Light", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'stun', duration: 2100 }, buyPrice: 500 },
  { id: 'spell_lull_clr', name: "Lull", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'calm', duration: 10500 }, buyPrice: 500 },
  { id: 'spell_spook_the_dead_clr', name: "Spook the Dead", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'fear_undead', duration: 8000 }, buyPrice: 500 },
  { id: 'spell_strike_clr', name: "Strike", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_yaulp_clr', name: "Yaulp", classId: 'cleric', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'attack', value: 3, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_light_healing_clr', name: "Light Healing", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'heal', value: 190 }, buyPrice: 1500 },
  { id: 'spell_cure_blindness_clr', name: "Cure Blindness", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'blindness' }, buyPrice: 1500 },
  { id: 'spell_cure_disease_clr', name: "Cure Disease", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 1500 },
  { id: 'spell_cure_poison_clr', name: "Cure Poison", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 1500 },
  { id: 'spell_furor_clr', name: "Furor", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'attack', value: 11, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_holy_armor_clr', name: "Holy Armor", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'ac', value: 15, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_reckless_strength_clr', name: "Reckless Strength", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'strength', value: 20, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_stun_clr', name: "Stun", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'stun', duration: 2500 }, buyPrice: 1500 },
  { id: 'spell_ward_undead_clr', name: "Ward Undead", classId: 'cleric', level: 5, manaCost: 36, effect: { type: 'damage_undead', value: 103 }, buyPrice: 1500 },
  { id: 'spell_healing_clr', name: "Healing", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'heal', value: 350 }, buyPrice: 3500 },
  { id: 'spell_center_clr', name: "Center", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'mana_regen', value: 2, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_endure_fire_clr', name: "Endure Fire", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'resist_fire', value: 28, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_endure_poison_clr', name: "Endure Poison", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'resist_poison', value: 28, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_fear_clr', name: "Fear", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'fear', duration: 7700 }, buyPrice: 3500 },
  { id: 'spell_hammer_of_wrath_clr', name: "Hammer of Wrath", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'damage', value: 191 }, buyPrice: 3500 },
  { id: 'spell_invigor_clr', name: "Invigor", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'stamina', value: 30, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_root_clr', name: "Root", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'root', duration: 9500 }, buyPrice: 3500 },
  { id: 'spell_sanctuary_clr', name: "Sanctuary", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'ac', value: 50, duration: 30000 }, buyPrice: 3500 },
  { id: 'spell_word_of_pain_clr', name: "Word of Pain", classId: 'cleric', level: 9, manaCost: 62, effect: { type: 'dot', value: 32 }, buyPrice: 3500 },
  { id: 'spell_bind_affinity_clr', name: "Bind Affinity", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'utility', effect: 'bind' }, buyPrice: 6000 },
  { id: 'spell_cancel_magic_clr', name: "Cancel Magic", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'dispel', value: 1 }, buyPrice: 6000 },
  { id: 'spell_endure_cold_clr', name: "Endure Cold", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'resist_cold', value: 38, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_expulse_undead_clr', name: "Expulse Undead", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'damage_undead', value: 301 }, buyPrice: 6000 },
  { id: 'spell_halo_of_light_clr', name: "Halo of Light", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'ac', value: 37, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_invisibility_versus_undead_clr', name: "Invisibility versus Undead", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'invis_undead', value: 1, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_reanimation_clr', name: "Reanimation", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'rez', value: 96 }, buyPrice: 6000 },
  { id: 'spell_smite_clr', name: "Smite", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'damage', value: 301 }, buyPrice: 6000 },
  { id: 'spell_symbol_of_transal_clr', name: "Symbol of Transal", classId: 'cleric', level: 14, manaCost: 94, effect: { type: 'heal', value: 550 }, buyPrice: 6000 },
  { id: 'spell_celestial_remedy_clr', name: "Celestial Remedy", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'heal', value: 750 }, buyPrice: 10000 },
  { id: 'spell_daring_clr', name: "Daring", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'ac', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_endure_magic_clr', name: "Endure Magic", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'resist_magic', value: 48, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_extinguish_fatigue_clr', name: "Extinguish Fatigue", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'stamina', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_holy_might_clr', name: "Holy Might", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'damage_undead', value: 411 }, buyPrice: 10000 },
  { id: 'spell_reconstitution_clr', name: "Reconstitution", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'hp_regen', value: 8, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_spirit_armor_clr', name: "Spirit Armor", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'ac', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_ward_summoned_clr', name: "Ward Summoned", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'damage_undead', value: 411 }, buyPrice: 10000 },
  { id: 'spell_word_of_shadow_clr', name: "Word of Shadow", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'dot', value: 62 }, buyPrice: 10000 },
  { id: 'spell_yaulp_ii_clr', name: "Yaulp II", classId: 'cleric', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'attack', value: 39, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_brave_clr', name: "Brave", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'attack', value: 49, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_counteract_disease_clr', name: "Counteract Disease", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 16000 },
  { id: 'spell_counteract_poison_clr', name: "Counteract Poison", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 16000 },
  { id: 'spell_denounce_undead_clr', name: "Denounce Undead", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'damage_undead', value: 521 }, buyPrice: 16000 },
  { id: 'spell_divine_strength_clr', name: "Divine Strength", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'strength', value: 50, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_enduring_breath_clr', name: "Enduring Breath", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'breathe_water', value: 1, duration: 120000 }, buyPrice: 16000 },
  { id: 'spell_greater_healing_clr', name: "Greater Healing", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'heal', value: 950 }, buyPrice: 16000 },
  { id: 'spell_pacify_clr', name: "Pacify", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'calm', duration: 22000 }, buyPrice: 16000 },
  { id: 'spell_retribution_clr', name: "Retribution", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_upheaval_clr', name: "Upheaval", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_word_of_souls_clr', name: "Word of Souls", classId: 'cleric', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_dismiss_undead_clr', name: "Dismiss Undead", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'damage_undead', value: 631 }, buyPrice: 25000 },
  { id: 'spell_divine_barrier_clr', name: "Divine Barrier", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'ac', value: 75, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_immobilize_clr', name: "Immobilize", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'root', duration: 19500 }, buyPrice: 25000 },
  { id: 'spell_infuse_clr', name: "Infuse", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'mana_regen', value: 12, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_resolution_clr', name: "Resolution", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'cure', ailment: 'all' }, buyPrice: 25000 },
  { id: 'spell_revive_clr', name: "Revive", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'rez', value: 96 }, buyPrice: 25000 },
  { id: 'spell_symbol_of_naltron_clr', name: "Symbol of Naltron", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'heal', value: 1150 }, buyPrice: 25000 },
  { id: 'spell_temperance_clr', name: "Temperance", classId: 'cleric', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'ac', value: 75, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_banish_undead_clr', name: "Banish Undead", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'damage_undead', value: 741 }, buyPrice: 38000 },
  { id: 'spell_bedlam_clr', name: "Bedlam", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'fear', duration: 15200 }, buyPrice: 38000 },
  { id: 'spell_chloroplast_clr', name: "Chloroplast", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'hp_regen', value: 14, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_dexterous_aura_clr', name: "Dexterous Aura", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'dexterity', value: 30, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_instrument_of_nife_clr', name: "Instrument of Nife", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_magnify_clr', name: "Magnify", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'ac', value: 87, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_quell_clr', name: "Quell", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'calm', duration: 27000 }, buyPrice: 38000 },
  { id: 'spell_superior_healing_clr', name: "Superior Healing", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'heal', value: 1350 }, buyPrice: 38000 },
  { id: 'spell_symbol_of_ryltan_clr', name: "Symbol of Ryltan", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'heal', value: 1350 }, buyPrice: 38000 },
  { id: 'spell_valor_clr', name: "Valor", classId: 'cleric', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'ac', value: 87, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_brilliant_aura_clr', name: "Brilliant Aura", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'ac', value: 100, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_column_of_frost_clr', name: "Column of Frost", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_desperate_hope_clr', name: "Desperate Hope", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'heal', value: 1550 }, buyPrice: 55000 },
  { id: 'spell_expel_undead_clr', name: "Expel Undead", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'damage_undead', value: 851 }, buyPrice: 55000 },
  { id: 'spell_force_of_akera_clr', name: "Force of Akera", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'strength', value: 70, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_heroism_clr', name: "Heroism", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'attack', value: 79, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_nullify_magic_clr', name: "Nullify Magic", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'dispel', value: 3 }, buyPrice: 55000 },
  { id: 'spell_symbol_of_pinzar_clr', name: "Symbol of Pinzar", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'heal', value: 1550 }, buyPrice: 55000 },
  { id: 'spell_visions_of_grandeur_clr', name: "Visions of Grandeur", classId: 'cleric', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'ac', value: 100, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_ancient_hallowed_light_clr', name: "Ancient: Hallowed Light", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'heal', value: 1750 }, buyPrice: 75000 },
  { id: 'spell_blessing_of_piety_clr', name: "Blessing of Piety", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'ac', value: 112, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_creed_of_antiquity_clr', name: "Creed of Antiquity", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'attack', value: 89, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_desperate_renewal_clr', name: "Desperate Renewal", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'heal', value: 1750 }, buyPrice: 75000 },
  { id: 'spell_divine_favor_clr', name: "Divine Favor", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'all_resist', value: 30, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_exile_undead_clr', name: "Exile Undead", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'damage_undead', value: 961 }, buyPrice: 75000 },
  { id: 'spell_purify_mana_clr', name: "Purify Mana", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'utility', effect: 'purify_mana' }, buyPrice: 75000 },
  { id: 'spell_symbol_of_kazad_clr', name: "Symbol of Kazad", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'heal', value: 1750 }, buyPrice: 75000 },
  { id: 'spell_turning_of_the_unnatural_clr', name: "Turning of the Unnatural", classId: 'cleric', level: 44, manaCost: 289, effect: { type: 'damage_undead', value: 961 }, buyPrice: 75000 },
  { id: 'spell_complete_heal_clr', name: "Complete Heal", classId: 'cleric', level: 49, manaCost: 322, effect: { type: 'heal', value: 2000 }, buyPrice: 100000 },
  { id: 'spell_fetter_clr', name: "Fetter", classId: 'cleric', level: 49, manaCost: 322, effect: { type: 'root', duration: 29500 }, buyPrice: 100000 },
  { id: 'spell_holy_wrath_clr', name: "Holy Wrath", classId: 'cleric', level: 49, manaCost: 322, effect: { type: 'damage_undead', value: 1071 }, buyPrice: 100000 },
  { id: 'spell_quivering_veil_of_xarn_clr', name: "Quivering Veil of Xarn", classId: 'cleric', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_symbol_of_marzin_clr', name: "Symbol of Marzin", classId: 'cleric', level: 49, manaCost: 322, effect: { type: 'heal', value: 1950 }, buyPrice: 100000 },
  { id: 'spell_yaulp_iv_clr', name: "Yaulp IV", classId: 'cleric', level: 49, manaCost: 322, effect: { type: 'buff', stat: 'attack', value: 99, duration: 60000 }, buyPrice: 100000 },
  { id: 'spell_aegolism_clr', name: "Aegolism", classId: 'cleric', level: 51, manaCost: 335, effect: { type: 'buff', stat: 'ac', value: 130, duration: 60000 }, buyPrice: 130000 },
  { id: 'spell_arch_shielding_clr', name: "Arch Shielding", classId: 'cleric', level: 54, manaCost: 354, effect: { type: 'buff', stat: 'ac', value: 137, duration: 60000 }, buyPrice: 160000 },
  { id: 'spell_celestial_healing_clr', name: "Celestial Healing", classId: 'cleric', level: 54, manaCost: 354, effect: { type: 'heal', value: 2150 }, buyPrice: 160000 },
  { id: 'spell_ancient_cry_of_chaos_clr', name: "Ancient: Cry of Chaos", classId: 'cleric', level: 54, manaCost: 354, effect: { type: 'damage', value: 1181 }, buyPrice: 160000 },
  { id: 'spell_divine_intervention_clr', name: "Divine Intervention", classId: 'cleric', level: 57, manaCost: 374, effect: { type: 'heal', value: 2770 }, buyPrice: 200000 },
  { id: 'spell_mark_of_karn_clr', name: "Mark of Karn", classId: 'cleric', level: 57, manaCost: 374, effect: { type: 'dot', value: 176 }, buyPrice: 200000 },
  { id: 'spell_supernal_remedy_clr', name: "Supernal Remedy", classId: 'cleric', level: 60, manaCost: 393, effect: { type: 'heal', value: 2390 }, buyPrice: 250000 },
  { id: 'spell_symbol_of_sevalak_clr', name: "Symbol of Sevalak", classId: 'cleric', level: 60, manaCost: 393, effect: { type: 'heal', value: 2390 }, buyPrice: 250000 },

  // DRUID
  { id: 'spell_burst_of_flame_dru', name: "Burst of Flame", classId: 'druid', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_skin_like_wood_dru', name: "Skin like Wood", classId: 'druid', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_lull_animal_dru', name: "Lull Animal", classId: 'druid', level: 1, manaCost: 10, effect: { type: 'calm', duration: 10500 }, buyPrice: 500 },
  { id: 'spell_panic_animal_dru', name: "Panic Animal", classId: 'druid', level: 1, manaCost: 10, effect: { type: 'fear', duration: 5300 }, buyPrice: 500 },
  { id: 'spell_snare_dru', name: "Snare", classId: 'druid', level: 1, manaCost: 10, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 5300 }, buyPrice: 500 },
  { id: 'spell_true_north_dru', name: "True North", classId: 'druid', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'direction' }, buyPrice: 500 },
  { id: 'spell_camouflage_dru', name: "Camouflage", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 35000 }, buyPrice: 1500 },
  { id: 'spell_endure_fire_dru', name: "Endure Fire", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'resist_fire', value: 20, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_flame_lick_dru', name: "Flame Lick", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'dot', value: 20 }, buyPrice: 1500 },
  { id: 'spell_grasping_roots_dru', name: "Grasping Roots", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'root', duration: 7500 }, buyPrice: 1500 },
  { id: 'spell_harmony_dru', name: "Harmony", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'calm', duration: 12500 }, buyPrice: 1500 },
  { id: 'spell_nullify_magic_dru', name: "Nullify Magic", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'dispel', value: 1 }, buyPrice: 1500 },
  { id: 'spell_regeneration_dru', name: "Regeneration", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'hp_regen', value: 2, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_skin_like_rock_dru', name: "Skin like Rock", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'ac', value: 15, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_cure_poison_dru', name: "Cure Poison", classId: 'druid', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 1500 },
  { id: 'spell_bind_affinity_dru', name: "Bind Affinity", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'utility', effect: 'bind' }, buyPrice: 3500 },
  { id: 'spell_careless_lightning_dru', name: "Careless Lightning", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'damage', value: 191 }, buyPrice: 3500 },
  { id: 'spell_ensnare_dru', name: "Ensnare", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 7700 }, buyPrice: 3500 },
  { id: 'spell_endure_cold_dru', name: "Endure Cold", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'resist_cold', value: 28, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_fire_dru', name: "Fire", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'damage', value: 191 }, buyPrice: 3500 },
  { id: 'spell_invoke_lightning_dru', name: "Invoke Lightning", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'damage', value: 191 }, buyPrice: 3500 },
  { id: 'spell_okeils_radiation_dru', name: "O'Keil's Radiation", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'dot', value: 32 }, buyPrice: 3500 },
  { id: 'spell_skin_like_steel_dru', name: "Skin like Steel", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'ac', value: 25, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_spirit_of_wolf_dru', name: "Spirit of Wolf", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'speed', value: 40, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_summon_drink_dru', name: "Summon Drink", classId: 'druid', level: 9, manaCost: 62, effect: { type: 'summon', summon: 'drink' }, buyPrice: 3500 },
  { id: 'spell_blaze_dru', name: "Blaze", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'damage', value: 301 }, buyPrice: 6000 },
  { id: 'spell_combust_dru', name: "Combust", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'dot', value: 47 }, buyPrice: 6000 },
  { id: 'spell_conjure_corpse_dru', name: "Conjure Corpse", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'utility', effect: 'corpse_summon' }, buyPrice: 6000 },
  { id: 'spell_endure_magic_dru', name: "Endure Magic", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'resist_magic', value: 38, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_gate_dru', name: "Gate", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'utility', effect: 'gate' }, buyPrice: 6000 },
  { id: 'spell_invigor_dru', name: "Invigor", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'stamina', value: 30, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_lightning_strike_dru', name: "Lightning Strike", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'damage', value: 301 }, buyPrice: 6000 },
  { id: 'spell_scale_skin_dru', name: "Scale Skin", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'ac', value: 37, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_thistlecoat_dru', name: "Thistlecoat", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'thorns', value: 47, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_winged_death_dru', name: "Winged Death", classId: 'druid', level: 14, manaCost: 94, effect: { type: 'dot', value: 47 }, buyPrice: 6000 },
  { id: 'spell_calm_animal_dru', name: "Calm Animal", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'calm', duration: 19500 }, buyPrice: 10000 },
  { id: 'spell_endure_disease_dru', name: "Endure Disease", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'resist_disease', value: 48, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_fire_strike_dru', name: "Fire Strike", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'damage', value: 411 }, buyPrice: 10000 },
  { id: 'spell_frenzy_dru', name: "Frenzy", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'attack', value: 39, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_inferno_of_alkabor_dru', name: "Inferno of Al'Kabor", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'damage', value: 411 }, buyPrice: 10000 },
  { id: 'spell_ring_of_commons_dru', name: "Ring of Commons", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'teleport', destination: 'commons' }, buyPrice: 10000 },
  { id: 'spell_skin_like_diamond_dru', name: "Skin like Diamond", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'ac', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_strength_of_stone_dru', name: "Strength of Stone", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'strength', value: 40, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_superior_camouflage_dru', name: "Superior Camouflage", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 49000 }, buyPrice: 10000 },
  { id: 'spell_word_of_health_dru', name: "Word of Health", classId: 'druid', level: 19, manaCost: 127, effect: { type: 'heal', value: 750 }, buyPrice: 10000 },
  { id: 'spell_counteract_poison_dru', name: "Counteract Poison", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 16000 },
  { id: 'spell_drones_of_doom_dru', name: "Drones of Doom", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_firestrike_dru', name: "Firestrike", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_greater_healing_dru', name: "Greater Healing", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'heal', value: 950 }, buyPrice: 16000 },
  { id: 'spell_immobilize_dru', name: "Immobilize", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'root', duration: 17000 }, buyPrice: 16000 },
  { id: 'spell_inferno_dru', name: "Inferno", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_ring_of_karana_dru', name: "Ring of Karana", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'teleport', destination: 'karana' }, buyPrice: 16000 },
  { id: 'spell_thorncoat_dru', name: "Thorncoat", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'thorns', value: 77, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_upheaval_dru', name: "Upheaval", classId: 'druid', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_conflagration_dru', name: "Conflagration", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_counteract_disease_dru', name: "Counteract Disease", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 25000 },
  { id: 'spell_earthquake_dru', name: "Earthquake", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_enduring_breath_dru', name: "Enduring Breath", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'breathe_water', value: 1, duration: 120000 }, buyPrice: 25000 },
  { id: 'spell_lightning_bolt_dru', name: "Lightning Bolt", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_natures_touch_dru', name: "Nature's Touch", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'heal', value: 1150 }, buyPrice: 25000 },
  { id: 'spell_ring_of_ro_dru', name: "Ring of Ro", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'teleport', destination: 'ro' }, buyPrice: 25000 },
  { id: 'spell_shield_of_thistles_dru', name: "Shield of Thistles", classId: 'druid', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'thorns', value: 92, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_barbcoat_dru', name: "Barbcoat", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'thorns', value: 107, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_blizzard_dru', name: "Blizzard", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_chloroplast_dru', name: "Chloroplast", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'hp_regen', value: 14, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_column_of_lightning_dru', name: "Column of Lightning", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_superior_healing_dru', name: "Superior Healing", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'heal', value: 1350 }, buyPrice: 38000 },
  { id: 'spell_succor_dru', name: "Succor", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'utility', effect: 'succor' }, buyPrice: 38000 },
  { id: 'spell_swarming_death_dru', name: "Swarming Death", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_tunares_request_dru', name: "Tunare's Request", classId: 'druid', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'all_resist', value: 20, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_circle_of_commons_dru', name: "Circle of Commons", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'teleport', destination: 'commons_group' }, buyPrice: 55000 },
  { id: 'spell_column_of_frost_dru', name: "Column of Frost", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_deaths_door_dru', name: "Death's Door", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'dot', value: 122 }, buyPrice: 55000 },
  { id: 'spell_drifting_death_dru', name: "Drifting Death", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'dot', value: 122 }, buyPrice: 55000 },
  { id: 'spell_firestorm_dru', name: "Firestorm", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_force_of_nature_dru', name: "Force of Nature", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_haze_dru', name: "Haze", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'calm', duration: 29500 }, buyPrice: 55000 },
  { id: 'spell_howling_winds_dru', name: "Howling Winds", classId: 'druid', level: 39, manaCost: 257, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 12800 }, buyPrice: 55000 },
  { id: 'spell_circle_of_karana_dru', name: "Circle of Karana", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'teleport', destination: 'karana_group' }, buyPrice: 75000 },
  { id: 'spell_convergence_dru', name: "Convergence", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'heal', value: 1750 }, buyPrice: 75000 },
  { id: 'spell_dire_charm_dru', name: "Dire Charm", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'charm', duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_nature_walkers_behest_dru', name: "Nature Walker's Behest", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'damage', value: 961 }, buyPrice: 75000 },
  { id: 'spell_seasons_wrath_dru', name: "Season's Wrath", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'dot', value: 137 }, buyPrice: 75000 },
  { id: 'spell_storm_strike_dru', name: "Storm Strike", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'damage', value: 961 }, buyPrice: 75000 },
  { id: 'spell_wrath_of_alkabor_dru', name: "Wrath of Al'Kabor", classId: 'druid', level: 44, manaCost: 289, effect: { type: 'damage', value: 961 }, buyPrice: 75000 },
  { id: 'spell_circle_of_ro_dru', name: "Circle of Ro", classId: 'druid', level: 49, manaCost: 322, effect: { type: 'teleport', destination: 'ro_group' }, buyPrice: 100000 },
  { id: 'spell_jolt_dru', name: "Jolt", classId: 'druid', level: 49, manaCost: 322, effect: { type: 'damage', value: 1071 }, buyPrice: 100000 },
  { id: 'spell_nature_touch_dru', name: "Nature Touch", classId: 'druid', level: 49, manaCost: 322, effect: { type: 'heal', value: 1950 }, buyPrice: 100000 },
  { id: 'spell_shield_of_barbs_dru', name: "Shield of Barbs", classId: 'druid', level: 49, manaCost: 322, effect: { type: 'buff', stat: 'thorns', value: 152, duration: 60000 }, buyPrice: 100000 },
  { id: 'spell_superior_camouflage_ii_dru', name: "Superior Camouflage", classId: 'druid', level: 49, manaCost: 322, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 79000 }, buyPrice: 100000 },
  { id: 'spell_breath_of_karana_dru', name: "Breath of Karana", classId: 'druid', level: 51, manaCost: 335, effect: { type: 'damage', value: 1115 }, buyPrice: 130000 },
  { id: 'spell_ros_smoldering_disjunction_dru', name: "Ro's Smoldering Disjunction", classId: 'druid', level: 54, manaCost: 354, effect: { type: 'dot', value: 167 }, buyPrice: 160000 },
  { id: 'spell_superior_regeneration_dru', name: "Superior Regeneration", classId: 'druid', level: 54, manaCost: 354, effect: { type: 'buff', stat: 'hp_regen', value: 22, duration: 60000 }, buyPrice: 160000 },
  { id: 'spell_circle_of_misty_dru', name: "Circle of Misty", classId: 'druid', level: 57, manaCost: 374, effect: { type: 'teleport', destination: 'misty_group' }, buyPrice: 200000 },
  { id: 'spell_natureskin_dru', name: "Natureskin", classId: 'druid', level: 57, manaCost: 374, effect: { type: 'buff', stat: 'ac', value: 145, duration: 60000 }, buyPrice: 200000 },
  { id: 'spell_firestrike_ii_dru', name: "Firestrike", classId: 'druid', level: 60, manaCost: 393, effect: { type: 'damage', value: 1313 }, buyPrice: 250000 },
  { id: 'spell_swarm_of_pain_dru', name: "Swarm of Pain", classId: 'druid', level: 60, manaCost: 393, effect: { type: 'dot', value: 185 }, buyPrice: 250000 },

  // SHAMAN
  { id: 'spell_burst_of_flame_shm', name: "Burst of Flame", classId: 'shaman', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_drowsy_shm', name: "Drowsy", classId: 'shaman', level: 1, manaCost: 10, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 5200 }, buyPrice: 500 },
  { id: 'spell_inner_fire_shm', name: "Inner Fire", classId: 'shaman', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_sense_animals_shm', name: "Sense Animals", classId: 'shaman', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'sense_animals' }, buyPrice: 500 },
  { id: 'spell_spirit_strike_shm', name: "Spirit Strike", classId: 'shaman', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_talisman_of_tnarg_shm', name: "Talisman of Tnarg", classId: 'shaman', level: 1, manaCost: 10, effect: { type: 'heal', value: 30 }, buyPrice: 500 },
  { id: 'spell_affliction_shm', name: "Affliction", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'dot', value: 20 }, buyPrice: 1500 },
  { id: 'spell_cure_disease_shm', name: "Cure Disease", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 1500 },
  { id: 'spell_cure_poison_shm', name: "Cure Poison", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 1500 },
  { id: 'spell_endure_fire_shm', name: "Endure Fire", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'resist_fire', value: 20, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_endure_magic_shm', name: "Endure Magic", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'resist_magic', value: 20, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_enduring_breath_shm', name: "Enduring Breath", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'breathe_water', value: 1, duration: 120000 }, buyPrice: 1500 },
  { id: 'spell_furious_strength_shm', name: "Furious Strength", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'strength', value: 20, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_listless_power_shm', name: "Listless Power", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 6000 }, buyPrice: 1500 },
  { id: 'spell_mending_shm', name: "Mending", classId: 'shaman', level: 5, manaCost: 36, effect: { type: 'heal', value: 190 }, buyPrice: 1500 },
  { id: 'spell_bind_affinity_shm', name: "Bind Affinity", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'utility', effect: 'bind' }, buyPrice: 3500 },
  { id: 'spell_dexterous_aura_shm', name: "Dexterous Aura", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'dexterity', value: 20, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_disease_cloud_shm', name: "Disease Cloud", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'dot', value: 32 }, buyPrice: 3500 },
  { id: 'spell_fleeting_fury_shm', name: "Fleeting Fury", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'attack', value: 19, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_frost_strike_shm', name: "Frost Strike", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'damage', value: 191 }, buyPrice: 3500 },
  { id: 'spell_gate_shm', name: "Gate", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'utility', effect: 'gate' }, buyPrice: 3500 },
  { id: 'spell_invoke_fear_shm', name: "Invoke Fear", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'fear', duration: 7700 }, buyPrice: 3500 },
  { id: 'spell_scale_skin_shm', name: "Scale Skin", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'ac', value: 25, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_spirit_of_bear_shm', name: "Spirit of Bear", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'hp_max', value: 50, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_spirit_sight_shm', name: "Spirit Sight", classId: 'shaman', level: 9, manaCost: 62, effect: { type: 'utility', effect: 'see_invisible' }, buyPrice: 3500 },
  { id: 'spell_counteract_poison_shm', name: "Counteract Poison", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 6000 },
  { id: 'spell_invigor_shm', name: "Invigor", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'stamina', value: 30, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_malo_shm', name: "Malo", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'debuff', stat: 'magic', value: 38, duration: 30000 }, buyPrice: 6000 },
  { id: 'spell_okeils_radiation_shm', name: "O'Keil's Radiation", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'dot', value: 47 }, buyPrice: 6000 },
  { id: 'spell_poison_storm_shm', name: "Poison Storm", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'dot', value: 47 }, buyPrice: 6000 },
  { id: 'spell_rabies_shm', name: "Rabies", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'dot', value: 47 }, buyPrice: 6000 },
  { id: 'spell_spirit_of_cat_shm', name: "Spirit of Cat", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'dexterity', value: 30, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_spirit_of_wolf_shm', name: "Spirit of Wolf", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'speed', value: 40, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_summon_drink_shm', name: "Summon Drink", classId: 'shaman', level: 14, manaCost: 94, effect: { type: 'summon', summon: 'drink' }, buyPrice: 6000 },
  { id: 'spell_cannibalize_shm', name: "Cannibalize", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'mana_regen', value: 8, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_counteract_disease_shm', name: "Counteract Disease", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 10000 },
  { id: 'spell_envenomed_bolt_shm', name: "Envenomed Bolt", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'dot', value: 62 }, buyPrice: 10000 },
  { id: 'spell_extinguish_fatigue_shm', name: "Extinguish Fatigue", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'stamina', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_guard_shm', name: "Guard", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'ac', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_healing_shm', name: "Healing", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'heal', value: 750 }, buyPrice: 10000 },
  { id: 'spell_quickness_shm', name: "Quickness", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'haste', value: 20, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_regeneration_shm', name: "Regeneration", classId: 'shaman', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'hp_regen', value: 8, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_frenzied_spirit_shm', name: "Frenzied Spirit", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'hp_regen', value: 10, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_frost_shm', name: "Frost", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_greater_healing_shm', name: "Greater Healing", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'heal', value: 950 }, buyPrice: 16000 },
  { id: 'spell_insidious_fever_shm', name: "Insidious Fever", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_insidious_malady_shm', name: "Insidious Malady", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 9800 }, buyPrice: 16000 },
  { id: 'spell_malisi_shm', name: "Malisi", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'debuff', stat: 'magic', value: 58, duration: 30000 }, buyPrice: 16000 },
  { id: 'spell_poison_bolt_shm', name: "Poison Bolt", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_spirit_of_ox_shm', name: "Spirit of Ox", classId: 'shaman', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'hp_max', value: 100, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_cannibalize_ii_shm', name: "Cannibalize II", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'mana_regen', value: 12, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_chloroplast_shm', name: "Chloroplast", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'hp_regen', value: 12, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_drones_of_doom_shm', name: "Drones of Doom", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'dot', value: 92 }, buyPrice: 25000 },
  { id: 'spell_eye_of_tallon_shm', name: "Eye of Tallon", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'utility', effect: 'see_invisible' }, buyPrice: 25000 },
  { id: 'spell_glamour_of_kintaz_shm', name: "Glamour of Kintaz", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'charisma', value: 40, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_insidious_fever_ii_shm', name: "Insidious Fever", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'dot', value: 92 }, buyPrice: 25000 },
  { id: 'spell_insidious_malady_ii_shm', name: "Insidious Malady", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 10800 }, buyPrice: 25000 },
  { id: 'spell_raging_strength_shm', name: "Raging Strength", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'strength', value: 60, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_spirit_of_wolf_ii_shm', name: "Spirit of Wolf", classId: 'shaman', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'speed', value: 40, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_cripple_shm', name: "Cripple", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 11800 }, buyPrice: 38000 },
  { id: 'spell_envenomed_bolt_ii_shm', name: "Envenomed Bolt", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_furious_strength_ii_shm', name: "Furious Strength", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'strength', value: 80, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_insidious_decay_shm', name: "Insidious Decay", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_insidious_malady_iii_shm', name: "Insidious Malady", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 11800 }, buyPrice: 38000 },
  { id: 'spell_spirit_of_cheetah_shm', name: "Spirit of Cheetah", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'speed', value: 60, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_talisman_of_altuna_shm', name: "Talisman of Altuna", classId: 'shaman', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'ac', value: 87, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_blizzard_blast_shm', name: "Blizzard Blast", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_cannibalize_iii_shm', name: "Cannibalize III", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'mana_regen', value: 16, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_color_shift_shm', name: "Color Shift", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'ac', value: 100, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_companion_spirit_shm', name: "Companion Spirit", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'all_stats', value: 20, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_kraggs_arm_shm', name: "Kragg's Arm", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'strength', value: 80, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_kraggs_mind_shm', name: "Kragg's Mind", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'intelligence', value: 40, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_talisman_of_epuur_shm', name: "Talisman of Epuur", classId: 'shaman', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'ac', value: 100, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_avatar_shm', name: "Avatar", classId: 'shaman', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'attack', value: 80, duration: 30000 }, buyPrice: 75000 },
  { id: 'spell_cannibalize_iv_shm', name: "Cannibalize IV", classId: 'shaman', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'mana_regen', value: 18, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_cloud_shm', name: "Cloud", classId: 'shaman', level: 44, manaCost: 289, effect: { type: 'debuff', stat: 'magic', value: 98, duration: 30000 }, buyPrice: 75000 },
  { id: 'spell_malosi_shm', name: "Malosi", classId: 'shaman', level: 44, manaCost: 289, effect: { type: 'debuff', stat: 'magic', value: 98, duration: 30000 }, buyPrice: 75000 },
  { id: 'spell_talisman_of_kragg_shm', name: "Talisman of Kragg", classId: 'shaman', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'ac', value: 112, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_torpor_shm', name: "Torpor", classId: 'shaman', level: 49, manaCost: 322, effect: { type: 'heal', value: 1500 }, buyPrice: 100000 },
  { id: 'spell_malos_shm', name: "Malos", classId: 'shaman', level: 49, manaCost: 322, effect: { type: 'debuff', stat: 'magic', value: 108, duration: 30000 }, buyPrice: 100000 },
  { id: 'spell_spirit_of_keshuval_shm', name: "Spirit of Keshuval", classId: 'shaman', level: 49, manaCost: 322, effect: { type: 'buff', stat: 'all_stats', value: 40, duration: 60000 }, buyPrice: 100000 },
  { id: 'spell_venom_of_the_snake_shm', name: "Venom of the Snake", classId: 'shaman', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_blessing_of_the_theurgist_shm', name: "Blessing of the Theurgist", classId: 'shaman', level: 51, manaCost: 335, effect: { type: 'buff', stat: 'ac', value: 130, duration: 60000 }, buyPrice: 130000 },
  { id: 'spell_chloroplast_ii_shm', name: "Chloroplast II", classId: 'shaman', level: 54, manaCost: 354, effect: { type: 'buff', stat: 'hp_regen', value: 20, duration: 60000 }, buyPrice: 160000 },
  { id: 'spell_riotous_health_shm', name: "Riotous Health", classId: 'shaman', level: 57, manaCost: 374, effect: { type: 'heal', value: 2270 }, buyPrice: 200000 },
  { id: 'spell_shamanic_empowerment_shm', name: "Shamanic Empowerment", classId: 'shaman', level: 60, manaCost: 393, effect: { type: 'buff', stat: 'all_stats', value: 60, duration: 60000 }, buyPrice: 250000 },

  // WIZARD
  { id: 'spell_minor_shielding_wiz', name: "Minor Shielding", classId: 'wizard', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_shock_of_frost_wiz', name: "Shock of Frost", classId: 'wizard', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_tiny_companion_wiz', name: "Tiny Companion", classId: 'wizard', level: 1, manaCost: 10, effect: { type: 'summon', summon: 'pet', power: 2 }, buyPrice: 500 },
  { id: 'spell_shock_of_fire_wiz', name: "Shock of Fire", classId: 'wizard', level: 4, manaCost: 29, effect: { type: 'damage', value: 81 }, buyPrice: 1250 },
  { id: 'spell_true_north_wiz', name: "True North", classId: 'wizard', level: 4, manaCost: 29, effect: { type: 'utility', effect: 'direction' }, buyPrice: 1250 },
  { id: 'spell_fire_bolt_wiz', name: "Fire Bolt", classId: 'wizard', level: 8, manaCost: 55, effect: { type: 'damage', value: 169 }, buyPrice: 3000 },
  { id: 'spell_lesser_shielding_wiz', name: "Lesser Shielding", classId: 'wizard', level: 8, manaCost: 55, effect: { type: 'buff', stat: 'ac', value: 22, duration: 60000 }, buyPrice: 3000 },
  { id: 'spell_shock_of_ice_wiz', name: "Shock of Ice", classId: 'wizard', level: 8, manaCost: 55, effect: { type: 'damage', value: 169 }, buyPrice: 3000 },
  { id: 'spell_taper_enchantment_wiz', name: "Taper Enchantment", classId: 'wizard', level: 8, manaCost: 55, effect: { type: 'dispel', value: 1 }, buyPrice: 3000 },
  { id: 'spell_fleeting_fury_wiz', name: "Fleeting Fury", classId: 'wizard', level: 12, manaCost: 81, effect: { type: 'buff', stat: 'attack', value: 25, duration: 60000 }, buyPrice: 5000 },
  { id: 'spell_gate_wiz', name: "Gate", classId: 'wizard', level: 12, manaCost: 81, effect: { type: 'utility', effect: 'gate' }, buyPrice: 5000 },
  { id: 'spell_shock_of_lightning_wiz', name: "Shock of Lightning", classId: 'wizard', level: 12, manaCost: 81, effect: { type: 'damage', value: 257 }, buyPrice: 5000 },
  { id: 'spell_bind_affinity_wiz', name: "Bind Affinity", classId: 'wizard', level: 16, manaCost: 107, effect: { type: 'utility', effect: 'bind' }, buyPrice: 7600 },
  { id: 'spell_flame_shock_wiz', name: "Flame Shock", classId: 'wizard', level: 16, manaCost: 107, effect: { type: 'damage', value: 345 }, buyPrice: 7600 },
  { id: 'spell_greater_shielding_wiz', name: "Greater Shielding", classId: 'wizard', level: 16, manaCost: 107, effect: { type: 'buff', stat: 'ac', value: 42, duration: 60000 }, buyPrice: 7600 },
  { id: 'spell_inferno_of_alkabor_wiz', name: "Inferno of Al'Kabor", classId: 'wizard', level: 16, manaCost: 107, effect: { type: 'damage', value: 345 }, buyPrice: 7600 },
  { id: 'spell_force_shock_wiz', name: "Force Shock", classId: 'wizard', level: 20, manaCost: 133, effect: { type: 'damage', value: 433 }, buyPrice: 11200 },
  { id: 'spell_calefaction_wiz', name: "Calefaction", classId: 'wizard', level: 20, manaCost: 133, effect: { type: 'dot', value: 65 }, buyPrice: 11200 },
  { id: 'spell_teleport_commons_wiz', name: "Teleport: Commons", classId: 'wizard', level: 20, manaCost: 133, effect: { type: 'teleport', destination: 'commons' }, buyPrice: 11200 },
  { id: 'spell_frost_shock_wiz', name: "Frost Shock", classId: 'wizard', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_fire_strike_wiz', name: "Fire Strike", classId: 'wizard', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_translocate_wiz', name: "Translocate", classId: 'wizard', level: 24, manaCost: 159, effect: { type: 'utility', effect: 'translocate' }, buyPrice: 16000 },
  { id: 'spell_inferno_shock_wiz', name: "Inferno Shock", classId: 'wizard', level: 29, manaCost: 192, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_thunder_strike_wiz', name: "Thunder Strike", classId: 'wizard', level: 29, manaCost: 192, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_arch_shielding_wiz', name: "Arch Shielding", classId: 'wizard', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'ac', value: 75, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_ice_shock_wiz', name: "Ice Shock", classId: 'wizard', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_calefaction_ii_wiz', name: "Calefaction", classId: 'wizard', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_teleport_ro_wiz', name: "Teleport: Ro", classId: 'wizard', level: 34, manaCost: 224, effect: { type: 'teleport', destination: 'ro' }, buyPrice: 38000 },
  { id: 'spell_lightning_shock_wiz', name: "Lightning Shock", classId: 'wizard', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_sunstrike_wiz', name: "Sunstrike", classId: 'wizard', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_force_strike_wiz', name: "Force Strike", classId: 'wizard', level: 44, manaCost: 289, effect: { type: 'damage', value: 961 }, buyPrice: 75000 },
  { id: 'spell_conflagration_wiz', name: "Conflagration", classId: 'wizard', level: 44, manaCost: 289, effect: { type: 'damage', value: 961 }, buyPrice: 75000 },
  { id: 'spell_teleport_felwithe_wiz', name: "Teleport: Felwithe", classId: 'wizard', level: 44, manaCost: 289, effect: { type: 'teleport', destination: 'felwithe' }, buyPrice: 75000 },
  { id: 'spell_ice_comet_wiz', name: "Ice Comet", classId: 'wizard', level: 49, manaCost: 322, effect: { type: 'damage', value: 1100 }, buyPrice: 100000 },
  { id: 'spell_rend_wiz', name: "Rend", classId: 'wizard', level: 49, manaCost: 322, effect: { type: 'damage', value: 1071 }, buyPrice: 100000 },
  { id: 'spell_draught_of_fire_wiz', name: "Draught of Fire", classId: 'wizard', level: 51, manaCost: 335, effect: { type: 'damage', value: 1115 }, buyPrice: 130000 },
  { id: 'spell_draught_of_jiva_wiz', name: "Draught of Jiva", classId: 'wizard', level: 54, manaCost: 354, effect: { type: 'damage', value: 1181 }, buyPrice: 160000 },
  { id: 'spell_draught_of_ice_wiz', name: "Draught of Ice", classId: 'wizard', level: 57, manaCost: 374, effect: { type: 'damage', value: 1247 }, buyPrice: 200000 },
  { id: 'spell_sunstrike_ii_wiz', name: "Sunstrike", classId: 'wizard', level: 60, manaCost: 393, effect: { type: 'damage', value: 1313 }, buyPrice: 250000 },
  { id: 'spell_ice_spear_of_solist_wiz', name: "Ice Spear of Solist", classId: 'wizard', level: 60, manaCost: 393, effect: { type: 'damage', value: 1513 }, buyPrice: 250000 },

  // MAGICIAN
  { id: 'spell_burst_of_flame_mag', name: "Burst of Flame", classId: 'magician', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_minor_shielding_mag', name: "Minor Shielding", classId: 'magician', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_summon_food_mag', name: "Summon Food", classId: 'magician', level: 1, manaCost: 10, effect: { type: 'summon', summon: 'food' }, buyPrice: 500 },
  { id: 'spell_summon_drink_mag', name: "Summon Drink", classId: 'magician', level: 1, manaCost: 10, effect: { type: 'summon', summon: 'drink' }, buyPrice: 500 },
  { id: 'spell_tiny_companion_mag', name: "Tiny Companion", classId: 'magician', level: 1, manaCost: 10, effect: { type: 'summon', summon: 'pet', power: 2 }, buyPrice: 500 },
  { id: 'spell_endure_fire_mag', name: "Endure Fire", classId: 'magician', level: 4, manaCost: 29, effect: { type: 'buff', stat: 'resist_fire', value: 18, duration: 60000 }, buyPrice: 1250 },
  { id: 'spell_true_north_mag', name: "True North", classId: 'magician', level: 4, manaCost: 29, effect: { type: 'utility', effect: 'direction' }, buyPrice: 1250 },
  { id: 'spell_lesser_shielding_mag', name: "Lesser Shielding", classId: 'magician', level: 8, manaCost: 55, effect: { type: 'buff', stat: 'ac', value: 22, duration: 60000 }, buyPrice: 3000 },
  { id: 'spell_monster_summoning_i_mag', name: "Monster Summoning I", classId: 'magician', level: 8, manaCost: 55, effect: { type: 'summon', summon: 'pet', power: 16 }, buyPrice: 3000 },
  { id: 'spell_shock_of_blades_mag', name: "Shock of Blades", classId: 'magician', level: 8, manaCost: 55, effect: { type: 'damage', value: 169 }, buyPrice: 3000 },
  { id: 'spell_burn_mag', name: "Burn", classId: 'magician', level: 12, manaCost: 81, effect: { type: 'dot', value: 41 }, buyPrice: 5000 },
  { id: 'spell_gate_mag', name: "Gate", classId: 'magician', level: 12, manaCost: 81, effect: { type: 'utility', effect: 'gate' }, buyPrice: 5000 },
  { id: 'spell_shock_of_steel_mag', name: "Shock of Steel", classId: 'magician', level: 12, manaCost: 81, effect: { type: 'damage', value: 257 }, buyPrice: 5000 },
  { id: 'spell_bind_affinity_mag', name: "Bind Affinity", classId: 'magician', level: 16, manaCost: 107, effect: { type: 'utility', effect: 'bind' }, buyPrice: 7600 },
  { id: 'spell_burst_of_fire_mag', name: "Burst of Fire", classId: 'magician', level: 16, manaCost: 107, effect: { type: 'damage', value: 345 }, buyPrice: 7600 },
  { id: 'spell_greater_shielding_mag', name: "Greater Shielding", classId: 'magician', level: 16, manaCost: 107, effect: { type: 'buff', stat: 'ac', value: 42, duration: 60000 }, buyPrice: 7600 },
  { id: 'spell_summon_elemental_defender_mag', name: "Summon Elemental Defender", classId: 'magician', level: 16, manaCost: 107, effect: { type: 'summon', summon: 'pet', power: 32 }, buyPrice: 7600 },
  { id: 'spell_monster_summoning_ii_mag', name: "Monster Summoning II", classId: 'magician', level: 20, manaCost: 133, effect: { type: 'summon', summon: 'pet', power: 40 }, buyPrice: 11200 },
  { id: 'spell_rain_of_molten_lava_mag', name: "Rain of Molten Lava", classId: 'magician', level: 20, manaCost: 133, effect: { type: 'damage', value: 433 }, buyPrice: 11200 },
  { id: 'spell_teleport_freeport_mag', name: "Teleport: Freeport", classId: 'magician', level: 20, manaCost: 133, effect: { type: 'teleport', destination: 'freeport' }, buyPrice: 11200 },
  { id: 'spell_elemental_armor_mag', name: "Elemental Armor", classId: 'magician', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'ac', value: 62, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_expel_summoned_mag', name: "Expel Summoned", classId: 'magician', level: 24, manaCost: 159, effect: { type: 'damage_summoned', value: 521 }, buyPrice: 16000 },
  { id: 'spell_greater_fire_elemental_mag', name: "Greater Fire Elemental", classId: 'magician', level: 24, manaCost: 159, effect: { type: 'summon', summon: 'pet', power: 48 }, buyPrice: 16000 },
  { id: 'spell_shock_of_spikes_mag', name: "Shock of Spikes", classId: 'magician', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_monster_summoning_iii_mag', name: "Monster Summoning III", classId: 'magician', level: 29, manaCost: 192, effect: { type: 'summon', summon: 'pet', power: 58 }, buyPrice: 25000 },
  { id: 'spell_reclaim_energy_mag', name: "Reclaim Energy", classId: 'magician', level: 29, manaCost: 192, effect: { type: 'utility', effect: 'reclaim_energy' }, buyPrice: 25000 },
  { id: 'spell_shock_of_swords_mag', name: "Shock of Swords", classId: 'magician', level: 29, manaCost: 192, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_elemental_simulacrum_mag', name: "Elemental Simulacrum", classId: 'magician', level: 34, manaCost: 224, effect: { type: 'summon', summon: 'pet', power: 68 }, buyPrice: 38000 },
  { id: 'spell_greater_earth_elemental_mag', name: "Greater Earth Elemental", classId: 'magician', level: 34, manaCost: 224, effect: { type: 'summon', summon: 'pet', power: 68 }, buyPrice: 38000 },
  { id: 'spell_surge_of_wind_mag', name: "Surge of Wind", classId: 'magician', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_monster_summoning_iv_mag', name: "Monster Summoning IV", classId: 'magician', level: 39, manaCost: 257, effect: { type: 'summon', summon: 'pet', power: 78 }, buyPrice: 55000 },
  { id: 'spell_rage_of_zomm_mag', name: "Rage of Zomm", classId: 'magician', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_summon_heatstone_mag', name: "Summon Heatstone", classId: 'magician', level: 39, manaCost: 257, effect: { type: 'summon', summon: 'heatstone' }, buyPrice: 55000 },
  { id: 'spell_dagger_of_symbols_mag', name: "Dagger of Symbols", classId: 'magician', level: 44, manaCost: 289, effect: { type: 'damage', value: 961 }, buyPrice: 75000 },
  { id: 'spell_elemental_armor_ii_mag', name: "Elemental Armor", classId: 'magician', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'ac', value: 112, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_greater_air_elemental_mag', name: "Greater Air Elemental", classId: 'magician', level: 44, manaCost: 289, effect: { type: 'summon', summon: 'pet', power: 88 }, buyPrice: 75000 },
  { id: 'spell_monster_summoning_v_mag', name: "Monster Summoning V", classId: 'magician', level: 44, manaCost: 289, effect: { type: 'summon', summon: 'pet', power: 88 }, buyPrice: 75000 },
  { id: 'spell_planar_ally_mag', name: "Planar Ally", classId: 'magician', level: 49, manaCost: 322, effect: { type: 'summon', summon: 'pet', power: 98 }, buyPrice: 100000 },
  { id: 'spell_shock_of_swords_ii_mag', name: "Shock of Swords", classId: 'magician', level: 49, manaCost: 322, effect: { type: 'damage', value: 1071 }, buyPrice: 100000 },
  { id: 'spell_greater_vocaration_earth_mag', name: "Greater Vocaration: Earth", classId: 'magician', level: 51, manaCost: 335, effect: { type: 'summon', summon: 'pet', power: 102 }, buyPrice: 130000 },
  { id: 'spell_greater_vocaration_fire_mag', name: "Greater Vocaration: Fire", classId: 'magician', level: 54, manaCost: 354, effect: { type: 'summon', summon: 'pet', power: 108 }, buyPrice: 160000 },
  { id: 'spell_greater_vocaration_air_mag', name: "Greater Vocaration: Air", classId: 'magician', level: 57, manaCost: 374, effect: { type: 'summon', summon: 'pet', power: 114 }, buyPrice: 200000 },
  { id: 'spell_servant_of_marr_mag', name: "Servant of Marr", classId: 'magician', level: 60, manaCost: 393, effect: { type: 'summon', summon: 'pet', power: 120 }, buyPrice: 250000 },
  { id: 'spell_elementalkin_water_mag', name: "Elementalkin: Water", classId: 'magician', level: 60, manaCost: 393, effect: { type: 'summon', summon: 'pet', power: 120 }, buyPrice: 250000 },

  // ENCHANTER
  { id: 'spell_mesmerize_enc', name: "Mesmerize", classId: 'enchanter', level: 1, manaCost: 10, effect: { type: 'mez', duration: 10400 }, buyPrice: 500 },
  { id: 'spell_minor_shielding_enc', name: "Minor Shielding", classId: 'enchanter', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_pendrils_animation_enc', name: "Pendril's Animation", classId: 'enchanter', level: 1, manaCost: 10, effect: { type: 'summon', summon: 'pet', power: 2 }, buyPrice: 500 },
  { id: 'spell_color_flux_enc', name: "Color Flux", classId: 'enchanter', level: 1, manaCost: 10, effect: { type: 'mez', duration: 10400 }, buyPrice: 500 },
  { id: 'spell_true_north_enc', name: "True North", classId: 'enchanter', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'direction' }, buyPrice: 500 },
  { id: 'spell_bind_affinity_enc', name: "Bind Affinity", classId: 'enchanter', level: 4, manaCost: 29, effect: { type: 'utility', effect: 'bind' }, buyPrice: 1250 },
  { id: 'spell_radiant_visage_enc', name: "Radiant Visage", classId: 'enchanter', level: 4, manaCost: 29, effect: { type: 'buff', stat: 'charisma', value: 20, duration: 60000 }, buyPrice: 1250 },
  { id: 'spell_befriend_animal_enc', name: "Befriend Animal", classId: 'enchanter', level: 8, manaCost: 55, effect: { type: 'charm', duration: 30000 }, buyPrice: 3000 },
  { id: 'spell_enthrall_enc', name: "Enthrall", classId: 'enchanter', level: 8, manaCost: 55, effect: { type: 'mez', duration: 13200 }, buyPrice: 3000 },
  { id: 'spell_lesser_shielding_enc', name: "Lesser Shielding", classId: 'enchanter', level: 8, manaCost: 55, effect: { type: 'buff', stat: 'ac', value: 22, duration: 60000 }, buyPrice: 3000 },
  { id: 'spell_shallow_breath_enc', name: "Shallow Breath", classId: 'enchanter', level: 8, manaCost: 55, effect: { type: 'dot', value: 29 }, buyPrice: 3000 },
  { id: 'spell_color_shift_enc', name: "Color Shift", classId: 'enchanter', level: 12, manaCost: 81, effect: { type: 'mez', duration: 14800 }, buyPrice: 5000 },
  { id: 'spell_gate_enc', name: "Gate", classId: 'enchanter', level: 12, manaCost: 81, effect: { type: 'utility', effect: 'gate' }, buyPrice: 5000 },
  { id: 'spell_sanity_warp_enc', name: "Sanity Warp", classId: 'enchanter', level: 12, manaCost: 81, effect: { type: 'damage', value: 257 }, buyPrice: 5000 },
  { id: 'spell_breeze_enc', name: "Breeze", classId: 'enchanter', level: 16, manaCost: 107, effect: { type: 'buff', stat: 'mana_regen', value: 7, duration: 60000 }, buyPrice: 7600 },
  { id: 'spell_greater_shielding_enc', name: "Greater Shielding", classId: 'enchanter', level: 16, manaCost: 107, effect: { type: 'buff', stat: 'ac', value: 42, duration: 60000 }, buyPrice: 7600 },
  { id: 'spell_illusion_barbarian_enc', name: "Illusion: Barbarian", classId: 'enchanter', level: 16, manaCost: 107, effect: { type: 'buff', stat: 'illusion', value: 1, duration: 60000 }, buyPrice: 7600 },
  { id: 'spell_languid_pace_enc', name: "Languid Pace", classId: 'enchanter', level: 16, manaCost: 107, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 8200 }, buyPrice: 7600 },
  { id: 'spell_clarity_enc', name: "Clarity", classId: 'enchanter', level: 20, manaCost: 133, effect: { type: 'buff', stat: 'mana_regen', value: 7, duration: 60000 }, buyPrice: 11200 },
  { id: 'spell_illusion_dark_elf_enc', name: "Illusion: Dark Elf", classId: 'enchanter', level: 20, manaCost: 133, effect: { type: 'buff', stat: 'illusion', value: 1, duration: 60000 }, buyPrice: 11200 },
  { id: 'spell_paralyzing_earth_enc', name: "Paralyzing Earth", classId: 'enchanter', level: 20, manaCost: 133, effect: { type: 'root', duration: 15000 }, buyPrice: 11200 },
  { id: 'spell_rune_i_enc', name: "Rune I", classId: 'enchanter', level: 20, manaCost: 133, effect: { type: 'buff', stat: 'damage_shield', value: 50, duration: 60000 }, buyPrice: 11200 },
  { id: 'spell_beguile_enc', name: "Beguile", classId: 'enchanter', level: 24, manaCost: 159, effect: { type: 'charm', duration: 45000 }, buyPrice: 16000 },
  { id: 'spell_color_skew_enc', name: "Color Skew", classId: 'enchanter', level: 24, manaCost: 159, effect: { type: 'mez', duration: 19600 }, buyPrice: 16000 },
  { id: 'spell_enveloping_roots_enc', name: "Enveloping Roots", classId: 'enchanter', level: 24, manaCost: 159, effect: { type: 'root', duration: 17000 }, buyPrice: 16000 },
  { id: 'spell_illusion_human_enc', name: "Illusion: Human", classId: 'enchanter', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'illusion', value: 1, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_arch_shielding_enc', name: "Arch Shielding", classId: 'enchanter', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'ac', value: 75, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_cloud_enc', name: "Cloud", classId: 'enchanter', level: 29, manaCost: 192, effect: { type: 'debuff', stat: 'magic', value: 68, duration: 30000 }, buyPrice: 25000 },
  { id: 'spell_illusionary_spikes_enc', name: "Illusionary Spikes", classId: 'enchanter', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'thorns', value: 92, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_mesmerize_ii_enc', name: "Mesmerize", classId: 'enchanter', level: 29, manaCost: 192, effect: { type: 'mez', duration: 21600 }, buyPrice: 25000 },
  { id: 'spell_rune_ii_enc', name: "Rune II", classId: 'enchanter', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'damage_shield', value: 100, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_blanket_of_forgetfulness_enc', name: "Blanket of Forgetfulness", classId: 'enchanter', level: 34, manaCost: 224, effect: { type: 'mez', duration: 23600 }, buyPrice: 38000 },
  { id: 'spell_clarity_iii_enc', name: "Clarity", classId: 'enchanter', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'mana_regen', value: 7, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_illusion_wood_elf_enc', name: "Illusion: Wood Elf", classId: 'enchanter', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'illusion', value: 1, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_rune_iii_enc', name: "Rune III", classId: 'enchanter', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'damage_shield', value: 160, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_suffocate_enc', name: "Suffocate", classId: 'enchanter', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_beguile_ii_enc', name: "Beguile", classId: 'enchanter', level: 39, manaCost: 257, effect: { type: 'charm', duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_enchant_air_enc', name: "Enchant: Air", classId: 'enchanter', level: 39, manaCost: 257, effect: { type: 'utility', effect: 'enchant_air' }, buyPrice: 55000 },
  { id: 'spell_illusion_halfling_enc', name: "Illusion: Halfling", classId: 'enchanter', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'illusion', value: 1, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_rune_iv_enc', name: "Rune IV", classId: 'enchanter', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'damage_shield', value: 220, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_clarity_ii_enc', name: "Clarity II", classId: 'enchanter', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'mana_regen', value: 15, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_color_cloud_enc', name: "Color Cloud", classId: 'enchanter', level: 44, manaCost: 289, effect: { type: 'mez', duration: 27600 }, buyPrice: 75000 },
  { id: 'spell_greater_calming_enc', name: "Greater Calming", classId: 'enchanter', level: 44, manaCost: 289, effect: { type: 'calm', duration: 30000 }, buyPrice: 75000 },
  { id: 'spell_illusion_gnome_enc', name: "Illusion: Gnome", classId: 'enchanter', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'illusion', value: 1, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_rapture_enc', name: "Rapture", classId: 'enchanter', level: 49, manaCost: 322, effect: { type: 'mez', duration: 29600 }, buyPrice: 100000 },
  { id: 'spell_rune_v_enc', name: "Rune V", classId: 'enchanter', level: 49, manaCost: 322, effect: { type: 'buff', stat: 'damage_shield', value: 350, duration: 60000 }, buyPrice: 100000 },
  { id: 'spell_wonderous_rapidity_enc', name: "Wonderous Rapidity", classId: 'enchanter', level: 49, manaCost: 322, effect: { type: 'buff', stat: 'haste', value: 40, duration: 60000 }, buyPrice: 100000 },
  { id: 'spell_enchant_earth_enc', name: "Enchant: Earth", classId: 'enchanter', level: 51, manaCost: 335, effect: { type: 'utility', effect: 'enchant_earth' }, buyPrice: 130000 },
  { id: 'spell_gift_of_pure_thought_enc', name: "Gift of Pure Thought", classId: 'enchanter', level: 54, manaCost: 354, effect: { type: 'buff', stat: 'mana_regen', value: 20, duration: 60000 }, buyPrice: 160000 },
  { id: 'spell_mass_mesmerization_enc', name: "Mass Mesmerization", classId: 'enchanter', level: 54, manaCost: 354, effect: { type: 'mez', duration: 31600 }, buyPrice: 160000 },
  { id: 'spell_mana_sieve_enc', name: "Mana Sieve", classId: 'enchanter', level: 57, manaCost: 374, effect: { type: 'debuff', stat: 'mana_drain', value: 200, duration: 30000 }, buyPrice: 200000 },
  { id: 'spell_beguile_iii_enc', name: "Beguile", classId: 'enchanter', level: 60, manaCost: 393, effect: { type: 'charm', duration: 90000 }, buyPrice: 250000 },
  { id: 'spell_color_cloud_ii_enc', name: "Color Cloud", classId: 'enchanter', level: 60, manaCost: 393, effect: { type: 'mez', duration: 34000 }, buyPrice: 250000 },

  // NECROMANCER
  { id: 'spell_chill_sight_nec', name: "Chill Sight", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'see_invisible' }, buyPrice: 500 },
  { id: 'spell_lifetap_nec', name: "Lifetap", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'lifetap', value: 10 }, buyPrice: 500 },
  { id: 'spell_locate_corpse_nec', name: "Locate Corpse", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'locate_corpse' }, buyPrice: 500 },
  { id: 'spell_minor_shielding_nec', name: "Minor Shielding", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_reclaim_energy_nec', name: "Reclaim Energy", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'reclaim_energy' }, buyPrice: 500 },
  { id: 'spell_sense_the_dead_nec', name: "Sense the Dead", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'sense_undead' }, buyPrice: 500 },
  { id: 'spell_vampiric_embrace_nec', name: "Vampiric Embrace", classId: 'necromancer', level: 1, manaCost: 10, effect: { type: 'dot', value: 8 }, buyPrice: 500 },
  { id: 'spell_bind_affinity_nec', name: "Bind Affinity", classId: 'necromancer', level: 4, manaCost: 29, effect: { type: 'utility', effect: 'bind' }, buyPrice: 1250 },
  { id: 'spell_bone_walk_nec', name: "Bone Walk", classId: 'necromancer', level: 4, manaCost: 29, effect: { type: 'buff', stat: 'speed', value: 20, duration: 60000 }, buyPrice: 1250 },
  { id: 'spell_clinging_darkness_nec', name: "Clinging Darkness", classId: 'necromancer', level: 4, manaCost: 29, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 6200 }, buyPrice: 1250 },
  { id: 'spell_conglaciation_of_bone_nec', name: "Conglaciation of Bone", classId: 'necromancer', level: 8, manaCost: 55, effect: { type: 'damage', value: 169 }, buyPrice: 3000 },
  { id: 'spell_disease_cloud_nec', name: "Disease Cloud", classId: 'necromancer', level: 8, manaCost: 55, effect: { type: 'dot', value: 29 }, buyPrice: 3000 },
  { id: 'spell_engulfing_darkness_nec', name: "Engulfing Darkness", classId: 'necromancer', level: 8, manaCost: 55, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 7400 }, buyPrice: 3000 },
  { id: 'spell_gate_nec', name: "Gate", classId: 'necromancer', level: 8, manaCost: 55, effect: { type: 'utility', effect: 'gate' }, buyPrice: 3000 },
  { id: 'spell_leach_nec', name: "Leach", classId: 'necromancer', level: 8, manaCost: 55, effect: { type: 'lifetap', value: 118 }, buyPrice: 3000 },
  { id: 'spell_lesser_shielding_nec', name: "Lesser Shielding", classId: 'necromancer', level: 8, manaCost: 55, effect: { type: 'buff', stat: 'ac', value: 22, duration: 60000 }, buyPrice: 3000 },
  { id: 'spell_animate_dead_nec', name: "Animate Dead", classId: 'necromancer', level: 12, manaCost: 81, effect: { type: 'summon', summon: 'pet', power: 24 }, buyPrice: 5000 },
  { id: 'spell_fear_nec', name: "Fear", classId: 'necromancer', level: 12, manaCost: 81, effect: { type: 'fear', duration: 8600 }, buyPrice: 5000 },
  { id: 'spell_heat_blood_nec', name: "Heat Blood", classId: 'necromancer', level: 12, manaCost: 81, effect: { type: 'dot', value: 41 }, buyPrice: 5000 },
  { id: 'spell_invoke_fear_nec', name: "Invoke Fear", classId: 'necromancer', level: 12, manaCost: 81, effect: { type: 'fear', duration: 8600 }, buyPrice: 5000 },
  { id: 'spell_numb_the_dead_nec', name: "Numb the Dead", classId: 'necromancer', level: 12, manaCost: 81, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 7400 }, buyPrice: 5000 },
  { id: 'spell_chilling_embrace_nec', name: "Chilling Embrace", classId: 'necromancer', level: 16, manaCost: 107, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 9800 }, buyPrice: 7600 },
  { id: 'spell_convoke_shadow_nec', name: "Convoke Shadow", classId: 'necromancer', level: 16, manaCost: 107, effect: { type: 'summon', summon: 'pet', power: 32 }, buyPrice: 7600 },
  { id: 'spell_greater_shielding_nec', name: "Greater Shielding", classId: 'necromancer', level: 16, manaCost: 107, effect: { type: 'buff', stat: 'ac', value: 42, duration: 60000 }, buyPrice: 7600 },
  { id: 'spell_screaming_terror_nec', name: "Screaming Terror", classId: 'necromancer', level: 16, manaCost: 107, effect: { type: 'fear', duration: 9800 }, buyPrice: 7600 },
  { id: 'spell_torbas_acid_blast_nec', name: "Torbas' Acid Blast", classId: 'necromancer', level: 16, manaCost: 107, effect: { type: 'dot', value: 53 }, buyPrice: 7600 },
  { id: 'spell_dark_empathy_nec', name: "Dark Empathy", classId: 'necromancer', level: 20, manaCost: 133, effect: { type: 'lifetap', value: 303 }, buyPrice: 11200 },
  { id: 'spell_heart_flutter_nec', name: "Heart Flutter", classId: 'necromancer', level: 20, manaCost: 133, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 9000 }, buyPrice: 11200 },
  { id: 'spell_poison_bolt_nec', name: "Poison Bolt", classId: 'necromancer', level: 20, manaCost: 133, effect: { type: 'dot', value: 65 }, buyPrice: 11200 },
  { id: 'spell_restless_bones_nec', name: "Restless Bones", classId: 'necromancer', level: 20, manaCost: 133, effect: { type: 'summon', summon: 'pet', power: 40 }, buyPrice: 11200 },
  { id: 'spell_arch_shielding_nec', name: "Arch Shielding", classId: 'necromancer', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'ac', value: 62, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_lifedraw_nec', name: "Lifedraw", classId: 'necromancer', level: 24, manaCost: 159, effect: { type: 'lifetap', value: 364 }, buyPrice: 16000 },
  { id: 'spell_shadow_compact_nec', name: "Shadow Compact", classId: 'necromancer', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'mana_regen', value: 10, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_shock_of_poison_nec', name: "Shock of Poison", classId: 'necromancer', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_dooming_darkness_nec', name: "Dooming Darkness", classId: 'necromancer', level: 29, manaCost: 192, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 13700 }, buyPrice: 25000 },
  { id: 'spell_drain_soul_nec', name: "Drain Soul", classId: 'necromancer', level: 29, manaCost: 192, effect: { type: 'lifetap', value: 441 }, buyPrice: 25000 },
  { id: 'spell_harmshield_nec', name: "Harmshield", classId: 'necromancer', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'invulnerable', value: 1, duration: 5000 }, buyPrice: 25000 },
  { id: 'spell_ignite_bones_nec', name: "Ignite Bones", classId: 'necromancer', level: 29, manaCost: 192, effect: { type: 'dot', value: 92 }, buyPrice: 25000 },
  { id: 'spell_malaise_nec', name: "Malaise", classId: 'necromancer', level: 29, manaCost: 192, effect: { type: 'debuff', stat: 'magic', value: 68, duration: 30000 }, buyPrice: 25000 },
  { id: 'spell_asystole_nec', name: "Asystole", classId: 'necromancer', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_call_of_bones_nec', name: "Call of Bones", classId: 'necromancer', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'mana_regen', value: 14, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_expulse_summoned_nec', name: "Expulse Summoned", classId: 'necromancer', level: 34, manaCost: 224, effect: { type: 'damage_summoned', value: 741 }, buyPrice: 38000 },
  { id: 'spell_haunting_corpse_nec', name: "Haunting Corpse", classId: 'necromancer', level: 34, manaCost: 224, effect: { type: 'summon', summon: 'pet', power: 68 }, buyPrice: 38000 },
  { id: 'spell_terror_nec', name: "Terror", classId: 'necromancer', level: 34, manaCost: 224, effect: { type: 'fear', duration: 15200 }, buyPrice: 38000 },
  { id: 'spell_death_peace_nec', name: "Death Peace", classId: 'necromancer', level: 39, manaCost: 257, effect: { type: 'mez', duration: 25600 }, buyPrice: 55000 },
  { id: 'spell_exile_summoned_nec', name: "Exile Summoned", classId: 'necromancer', level: 39, manaCost: 257, effect: { type: 'damage_summoned', value: 851 }, buyPrice: 55000 },
  { id: 'spell_shadow_vortex_nec', name: "Shadow Vortex", classId: 'necromancer', level: 39, manaCost: 257, effect: { type: 'dot', value: 122 }, buyPrice: 55000 },
  { id: 'spell_venom_of_the_snake_nec', name: "Venom of the Snake", classId: 'necromancer', level: 39, manaCost: 257, effect: { type: 'dot', value: 122 }, buyPrice: 55000 },
  { id: 'spell_lich_nec', name: "Lich", classId: 'necromancer', level: 44, manaCost: 289, effect: { type: 'buff', stat: 'mana_regen', value: 18, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_paralyzing_earth_nec', name: "Paralyzing Earth", classId: 'necromancer', level: 44, manaCost: 289, effect: { type: 'root', duration: 27000 }, buyPrice: 75000 },
  { id: 'spell_servant_of_bones_nec', name: "Servant of Bones", classId: 'necromancer', level: 44, manaCost: 289, effect: { type: 'summon', summon: 'pet', power: 88 }, buyPrice: 75000 },
  { id: 'spell_splurt_nec', name: "Splurt", classId: 'necromancer', level: 44, manaCost: 289, effect: { type: 'dot', value: 137 }, buyPrice: 75000 },
  { id: 'spell_quivering_veil_of_xarn_nec', name: "Quivering Veil of Xarn", classId: 'necromancer', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_pyrocruor_nec', name: "Pyrocruor", classId: 'necromancer', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_bond_of_death_nec', name: "Bond of Death", classId: 'necromancer', level: 51, manaCost: 335, effect: { type: 'dot', value: 158 }, buyPrice: 130000 },
  { id: 'spell_acrid_death_nec', name: "Acrid Death", classId: 'necromancer', level: 54, manaCost: 354, effect: { type: 'dot', value: 167 }, buyPrice: 160000 },
  { id: 'spell_cascading_darkness_nec', name: "Cascading Darkness", classId: 'necromancer', level: 57, manaCost: 374, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 20000 }, buyPrice: 200000 },
  { id: 'spell_demi_lich_nec', name: "Demi Lich", classId: 'necromancer', level: 60, manaCost: 393, effect: { type: 'buff', stat: 'mana_regen', value: 24, duration: 60000 }, buyPrice: 250000 },
  { id: 'spell_ignite_blood_nec', name: "Ignite Blood", classId: 'necromancer', level: 60, manaCost: 393, effect: { type: 'dot', value: 185 }, buyPrice: 250000 },

  // PALADIN
  { id: 'spell_minor_healing_pal', name: "Minor Healing", classId: 'paladin', level: 1, manaCost: 10, effect: { type: 'heal', value: 30 }, buyPrice: 500 },
  { id: 'spell_flash_of_light_pal', name: "Flash of Light", classId: 'paladin', level: 1, manaCost: 10, effect: { type: 'stun', duration: 2100 }, buyPrice: 500 },
  { id: 'spell_courage_pal', name: "Courage", classId: 'paladin', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_holy_armor_pal', name: "Holy Armor", classId: 'paladin', level: 1, manaCost: 10, effect: { type: 'buff', stat: 'ac', value: 5, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_light_healing_pal', name: "Light Healing", classId: 'paladin', level: 5, manaCost: 36, effect: { type: 'heal', value: 190 }, buyPrice: 1500 },
  { id: 'spell_cure_poison_pal', name: "Cure Poison", classId: 'paladin', level: 5, manaCost: 36, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 1500 },
  { id: 'spell_stun_pal', name: "Stun", classId: 'paladin', level: 5, manaCost: 36, effect: { type: 'stun', duration: 2500 }, buyPrice: 1500 },
  { id: 'spell_ward_undead_pal', name: "Ward Undead", classId: 'paladin', level: 5, manaCost: 36, effect: { type: 'damage_undead', value: 103 }, buyPrice: 1500 },
  { id: 'spell_healing_pal', name: "Healing", classId: 'paladin', level: 9, manaCost: 62, effect: { type: 'heal', value: 350 }, buyPrice: 3500 },
  { id: 'spell_fear_undead_pal', name: "Fear Undead", classId: 'paladin', level: 9, manaCost: 62, effect: { type: 'fear_undead', duration: 10000 }, buyPrice: 3500 },
  { id: 'spell_expulse_undead_pal', name: "Expulse Undead", classId: 'paladin', level: 9, manaCost: 62, effect: { type: 'damage_undead', value: 191 }, buyPrice: 3500 },
  { id: 'spell_center_pal', name: "Center", classId: 'paladin', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'mana_regen', value: 4, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_blessed_armor_of_the_risen_pal', name: "Blessed Armor of the Risen", classId: 'paladin', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'ac', value: 37, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_cancel_magic_pal', name: "Cancel Magic", classId: 'paladin', level: 14, manaCost: 94, effect: { type: 'dispel', value: 1 }, buyPrice: 6000 },
  { id: 'spell_symbol_of_transal_pal', name: "Symbol of Transal", classId: 'paladin', level: 14, manaCost: 94, effect: { type: 'heal', value: 550 }, buyPrice: 6000 },
  { id: 'spell_denounce_undead_pal', name: "Denounce Undead", classId: 'paladin', level: 14, manaCost: 94, effect: { type: 'damage_undead', value: 301 }, buyPrice: 6000 },
  { id: 'spell_holy_might_pal', name: "Holy Might", classId: 'paladin', level: 19, manaCost: 127, effect: { type: 'damage_undead', value: 411 }, buyPrice: 10000 },
  { id: 'spell_counteract_poison_pal', name: "Counteract Poison", classId: 'paladin', level: 19, manaCost: 127, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 10000 },
  { id: 'spell_force_of_akera_pal', name: "Force of Akera", classId: 'paladin', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'strength', value: 40, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_spirit_armor_pal', name: "Spirit Armor", classId: 'paladin', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'ac', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_extinguish_fatigue_pal', name: "Extinguish Fatigue", classId: 'paladin', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'stamina', value: 50, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_counteract_disease_pal', name: "Counteract Disease", classId: 'paladin', level: 24, manaCost: 159, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 16000 },
  { id: 'spell_retribution_pal', name: "Retribution", classId: 'paladin', level: 24, manaCost: 159, effect: { type: 'damage', value: 521 }, buyPrice: 16000 },
  { id: 'spell_true_north_pal', name: "True North", classId: 'paladin', level: 24, manaCost: 159, effect: { type: 'utility', effect: 'direction' }, buyPrice: 16000 },
  { id: 'spell_resolution_pal', name: "Resolution", classId: 'paladin', level: 29, manaCost: 192, effect: { type: 'cure', ailment: 'all' }, buyPrice: 25000 },
  { id: 'spell_purify_pal', name: "Purify", classId: 'paladin', level: 29, manaCost: 192, effect: { type: 'cure', ailment: 'all' }, buyPrice: 25000 },
  { id: 'spell_symbol_of_naltron_pal', name: "Symbol of Naltron", classId: 'paladin', level: 29, manaCost: 192, effect: { type: 'heal', value: 1150 }, buyPrice: 25000 },
  { id: 'spell_revive_pal', name: "Revive", classId: 'paladin', level: 29, manaCost: 192, effect: { type: 'rez', value: 96 }, buyPrice: 25000 },
  { id: 'spell_superior_healing_pal', name: "Superior Healing", classId: 'paladin', level: 34, manaCost: 224, effect: { type: 'heal', value: 1350 }, buyPrice: 38000 },
  { id: 'spell_symbol_of_ryltan_pal', name: "Symbol of Ryltan", classId: 'paladin', level: 34, manaCost: 224, effect: { type: 'heal', value: 1350 }, buyPrice: 38000 },
  { id: 'spell_guard_pal', name: "Guard", classId: 'paladin', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'ac', value: 87, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_valor_pal', name: "Valor", classId: 'paladin', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'ac', value: 87, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_heroism_pal', name: "Heroism", classId: 'paladin', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'attack', value: 79, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_force_of_akera_ii_pal', name: "Force of Akera", classId: 'paladin', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'strength', value: 70, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_symbol_of_pinzar_pal', name: "Symbol of Pinzar", classId: 'paladin', level: 39, manaCost: 257, effect: { type: 'heal', value: 1550 }, buyPrice: 55000 },
  { id: 'spell_symbol_of_kazad_pal', name: "Symbol of Kazad", classId: 'paladin', level: 44, manaCost: 289, effect: { type: 'heal', value: 1750 }, buyPrice: 75000 },
  { id: 'spell_holy_wrath_pal', name: "Holy Wrath", classId: 'paladin', level: 44, manaCost: 289, effect: { type: 'damage_undead', value: 961 }, buyPrice: 75000 },
  { id: 'spell_turning_of_the_unnatural_pal', name: "Turning of the Unnatural", classId: 'paladin', level: 44, manaCost: 289, effect: { type: 'damage_undead', value: 961 }, buyPrice: 75000 },
  { id: 'spell_complete_heal_pal', name: "Complete Heal", classId: 'paladin', level: 49, manaCost: 322, effect: { type: 'heal', value: 2000 }, buyPrice: 100000 },
  { id: 'spell_symbol_of_marzin_pal', name: "Symbol of Marzin", classId: 'paladin', level: 49, manaCost: 322, effect: { type: 'heal', value: 1950 }, buyPrice: 100000 },
  { id: 'spell_holy_intervention_pal', name: "Holy Intervention", classId: 'paladin', level: 51, manaCost: 335, effect: { type: 'heal', value: 2330 }, buyPrice: 130000 },
  { id: 'spell_supernal_remedy_pal', name: "Supernal Remedy", classId: 'paladin', level: 54, manaCost: 354, effect: { type: 'heal', value: 2150 }, buyPrice: 160000 },
  { id: 'spell_mark_of_the_righteous_pal', name: "Mark of the Righteous", classId: 'paladin', level: 57, manaCost: 374, effect: { type: 'damage_undead', value: 1247 }, buyPrice: 200000 },
  { id: 'spell_holy_order_pal', name: "Holy Order", classId: 'paladin', level: 60, manaCost: 393, effect: { type: 'buff', stat: 'all_stats', value: 40, duration: 60000 }, buyPrice: 250000 },

  // SHADOWKNIGHT
  { id: 'spell_lifetap_sk', name: "Lifetap", classId: 'shadowknight', level: 1, manaCost: 10, effect: { type: 'lifetap', value: 10 }, buyPrice: 500 },
  { id: 'spell_clinging_darkness_sk', name: "Clinging Darkness", classId: 'shadowknight', level: 1, manaCost: 10, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 5300 }, buyPrice: 500 },
  { id: 'spell_spook_the_dead_sk', name: "Spook the Dead", classId: 'shadowknight', level: 1, manaCost: 10, effect: { type: 'fear_undead', duration: 8000 }, buyPrice: 500 },
  { id: 'spell_fear_sk', name: "Fear", classId: 'shadowknight', level: 1, manaCost: 10, effect: { type: 'fear', duration: 5300 }, buyPrice: 500 },
  { id: 'spell_disease_cloud_sk', name: "Disease Cloud", classId: 'shadowknight', level: 5, manaCost: 36, effect: { type: 'dot', value: 20 }, buyPrice: 1500 },
  { id: 'spell_invoke_fear_sk', name: "Invoke Fear", classId: 'shadowknight', level: 5, manaCost: 36, effect: { type: 'fear', duration: 6500 }, buyPrice: 1500 },
  { id: 'spell_leach_sk', name: "Leach", classId: 'shadowknight', level: 5, manaCost: 36, effect: { type: 'lifetap', value: 72 }, buyPrice: 1500 },
  { id: 'spell_engulfing_darkness_sk', name: "Engulfing Darkness", classId: 'shadowknight', level: 9, manaCost: 62, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 7700 }, buyPrice: 3500 },
  { id: 'spell_feign_death_sk', name: "Feign Death", classId: 'shadowknight', level: 9, manaCost: 62, effect: { type: 'utility', effect: 'feign_death' }, buyPrice: 3500 },
  { id: 'spell_vampiric_embrace_sk', name: "Vampiric Embrace", classId: 'shadowknight', level: 9, manaCost: 62, effect: { type: 'dot', value: 32 }, buyPrice: 3500 },
  { id: 'spell_numb_the_dead_sk', name: "Numb the Dead", classId: 'shadowknight', level: 14, manaCost: 94, effect: { type: 'debuff', stat: 'slow', value: 30, duration: 7800 }, buyPrice: 6000 },
  { id: 'spell_dark_empathy_sk', name: "Dark Empathy", classId: 'shadowknight', level: 14, manaCost: 94, effect: { type: 'lifetap', value: 210 }, buyPrice: 6000 },
  { id: 'spell_harmshield_sk', name: "Harmshield", classId: 'shadowknight', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'invulnerable', value: 1, duration: 5000 }, buyPrice: 6000 },
  { id: 'spell_dooming_darkness_sk', name: "Dooming Darkness", classId: 'shadowknight', level: 19, manaCost: 127, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 10700 }, buyPrice: 10000 },
  { id: 'spell_screaming_terror_sk', name: "Screaming Terror", classId: 'shadowknight', level: 19, manaCost: 127, effect: { type: 'fear', duration: 10700 }, buyPrice: 10000 },
  { id: 'spell_shadow_compact_sk', name: "Shadow Compact", classId: 'shadowknight', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'mana_regen', value: 8, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_drain_soul_sk', name: "Drain Soul", classId: 'shadowknight', level: 24, manaCost: 159, effect: { type: 'lifetap', value: 364 }, buyPrice: 16000 },
  { id: 'spell_ignite_bones_sk', name: "Ignite Bones", classId: 'shadowknight', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_terror_sk', name: "Terror", classId: 'shadowknight', level: 24, manaCost: 159, effect: { type: 'fear', duration: 12200 }, buyPrice: 16000 },
  { id: 'spell_cascading_darkness_sk', name: "Cascading Darkness", classId: 'shadowknight', level: 29, manaCost: 192, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 13700 }, buyPrice: 25000 },
  { id: 'spell_asystole_sk', name: "Asystole", classId: 'shadowknight', level: 29, manaCost: 192, effect: { type: 'dot', value: 92 }, buyPrice: 25000 },
  { id: 'spell_call_of_bones_sk', name: "Call of Bones", classId: 'shadowknight', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'mana_regen', value: 12, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_leech_sk', name: "Leech", classId: 'shadowknight', level: 34, manaCost: 224, effect: { type: 'lifetap', value: 518 }, buyPrice: 38000 },
  { id: 'spell_death_peace_sk', name: "Death Peace", classId: 'shadowknight', level: 34, manaCost: 224, effect: { type: 'mez', duration: 23600 }, buyPrice: 38000 },
  { id: 'spell_bond_of_death_sk', name: "Bond of Death", classId: 'shadowknight', level: 34, manaCost: 224, effect: { type: 'dot', value: 107 }, buyPrice: 38000 },
  { id: 'spell_dread_gaze_sk', name: "Dread Gaze", classId: 'shadowknight', level: 39, manaCost: 257, effect: { type: 'fear', duration: 16700 }, buyPrice: 55000 },
  { id: 'spell_paralyzing_earth_sk', name: "Paralyzing Earth", classId: 'shadowknight', level: 39, manaCost: 257, effect: { type: 'root', duration: 24500 }, buyPrice: 55000 },
  { id: 'spell_shadow_vortex_sk', name: "Shadow Vortex", classId: 'shadowknight', level: 39, manaCost: 257, effect: { type: 'dot', value: 122 }, buyPrice: 55000 },
  { id: 'spell_splurt_sk', name: "Splurt", classId: 'shadowknight', level: 44, manaCost: 289, effect: { type: 'dot', value: 137 }, buyPrice: 75000 },
  { id: 'spell_servant_of_bones_sk', name: "Servant of Bones", classId: 'shadowknight', level: 44, manaCost: 289, effect: { type: 'summon', summon: 'pet', power: 88 }, buyPrice: 75000 },
  { id: 'spell_torment_of_argli_sk', name: "Torment of Argli", classId: 'shadowknight', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_pyrocruor_sk', name: "Pyrocruor", classId: 'shadowknight', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_vexing_mordinia_sk', name: "Vexing Mordinia", classId: 'shadowknight', level: 51, manaCost: 335, effect: { type: 'dot', value: 158 }, buyPrice: 130000 },
  { id: 'spell_spear_of_disease_sk', name: "Spear of Disease", classId: 'shadowknight', level: 54, manaCost: 354, effect: { type: 'dot', value: 167 }, buyPrice: 160000 },
  { id: 'spell_cascading_darkness_ii_sk', name: "Cascading Darkness", classId: 'shadowknight', level: 57, manaCost: 374, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 20000 }, buyPrice: 200000 },
  { id: 'spell_malignant_dead_sk', name: "Malignant Dead", classId: 'shadowknight', level: 60, manaCost: 393, effect: { type: 'dot', value: 185 }, buyPrice: 250000 },

  // BARD
  { id: 'spell_anthem_de_arms_brd', name: "Anthem de Arms", classId: 'bard', level: 1, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 3, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_chant_of_battle_brd', name: "Chant of Battle", classId: 'bard', level: 1, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 3, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_bruscos_boastful_bellow_brd', name: "Brusco's Boastful Bellow", classId: 'bard', level: 1, manaCost: 0, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_elemental_rhythms_brd', name: "Elemental Rhythms", classId: 'bard', level: 1, manaCost: 0, effect: { type: 'buff', stat: 'resist_fire', value: 12, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_jonthans_whistling_warsong_brd', name: "Jonthan's Whistling Warsong", classId: 'bard', level: 1, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 3, duration: 60000 }, buyPrice: 500 },
  { id: 'spell_ervajs_lullaby_brd', name: "Ervaj's Lullaby", classId: 'bard', level: 5, manaCost: 0, effect: { type: 'mez', duration: 12000 }, buyPrice: 1500 },
  { id: 'spell_kellins_lucid_lullaby_brd', name: "Kellin's Lucid Lullaby", classId: 'bard', level: 5, manaCost: 0, effect: { type: 'mez', duration: 12000 }, buyPrice: 1500 },
  { id: 'spell_lyssas_solidarity_of_vision_brd', name: "Lyssa's Solidarity of Vision", classId: 'bard', level: 5, manaCost: 0, effect: { type: 'buff', stat: 'ac', value: 15, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_selos_accelerando_brd', name: "Selo's Accelerando", classId: 'bard', level: 5, manaCost: 0, effect: { type: 'buff', stat: 'speed', value: 60, duration: 30000 }, buyPrice: 1500 },
  { id: 'spell_shauris_sonorous_clouding_brd', name: "Shauri's Sonorous Clouding", classId: 'bard', level: 5, manaCost: 0, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 35000 }, buyPrice: 1500 },
  { id: 'spell_cassindras_chant_of_clarity_brd', name: "Cassindra's Chant of Clarity", classId: 'bard', level: 9, manaCost: 0, effect: { type: 'buff', stat: 'mana_regen', value: 4, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_elemental_chorus_brd', name: "Elemental Chorus", classId: 'bard', level: 9, manaCost: 0, effect: { type: 'buff', stat: 'resist_fire', value: 28, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_hymn_of_restoration_brd', name: "Hymn of Restoration", classId: 'bard', level: 9, manaCost: 0, effect: { type: 'buff', stat: 'hp_regen', value: 4, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_jonthans_inspiration_brd', name: "Jonthan's Inspiration", classId: 'bard', level: 9, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 19, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_nivs_harmonic_brd', name: "Niv's Harmonic", classId: 'bard', level: 9, manaCost: 0, effect: { type: 'buff', stat: 'ac', value: 25, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_angstlichs_assonance_brd', name: "Angstlich's Assonance", classId: 'bard', level: 14, manaCost: 0, effect: { type: 'mez', duration: 15600 }, buyPrice: 6000 },
  { id: 'spell_cassindras_chorus_of_clarity_brd', name: "Cassindra's Chorus of Clarity", classId: 'bard', level: 14, manaCost: 0, effect: { type: 'buff', stat: 'mana_regen', value: 6, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_denons_disruptive_discord_brd', name: "Denon's Disruptive Discord", classId: 'bard', level: 14, manaCost: 0, effect: { type: 'damage', value: 301 }, buyPrice: 6000 },
  { id: 'spell_jonthans_mightful_caretaking_brd', name: "Jonthan's Mightful Caretaking", classId: 'bard', level: 14, manaCost: 0, effect: { type: 'buff', stat: 'hp_regen', value: 6, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_nivs_melody_of_preservation_brd', name: "Niv's Melody of Preservation", classId: 'bard', level: 14, manaCost: 0, effect: { type: 'buff', stat: 'ac', value: 37, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_agilmentes_aria_of_eagles_brd', name: "Agilmente's Aria of Eagles", classId: 'bard', level: 19, manaCost: 0, effect: { type: 'buff', stat: 'dexterity', value: 30, duration: 30000 }, buyPrice: 10000 },
  { id: 'spell_angstlichs_appalling_screech_brd', name: "Angstlich's Appalling Screech", classId: 'bard', level: 19, manaCost: 0, effect: { type: 'fear', duration: 10700 }, buyPrice: 10000 },
  { id: 'spell_cantata_of_soothing_brd', name: "Cantata of Soothing", classId: 'bard', level: 19, manaCost: 0, effect: { type: 'buff', stat: 'hp_regen', value: 8, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_chant_of_disease_brd', name: "Chant of Disease", classId: 'bard', level: 19, manaCost: 0, effect: { type: 'dot', value: 62 }, buyPrice: 10000 },
  { id: 'spell_jonthans_provocation_brd', name: "Jonthan's Provocation", classId: 'bard', level: 19, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 39, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_cassindras_elegy_brd', name: "Cassindra's Elegy", classId: 'bard', level: 24, manaCost: 0, effect: { type: 'buff', stat: 'mana_regen', value: 10, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_denons_desperate_dirge_brd', name: "Denon's Desperate Dirge", classId: 'bard', level: 24, manaCost: 0, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_nivs_lullaby_brd', name: "Niv's Lullaby", classId: 'bard', level: 24, manaCost: 0, effect: { type: 'mez', duration: 19600 }, buyPrice: 16000 },
  { id: 'spell_selos_consonant_chain_brd', name: "Selo's Consonant Chain", classId: 'bard', level: 24, manaCost: 0, effect: { type: 'buff', stat: 'speed', value: 70, duration: 30000 }, buyPrice: 16000 },
  { id: 'spell_angstlichs_appalling_screech_ii_brd', name: "Angstlich's Appalling Screech", classId: 'bard', level: 29, manaCost: 0, effect: { type: 'fear', duration: 13700 }, buyPrice: 25000 },
  { id: 'spell_aria_of_refreshment_brd', name: "Aria of Refreshment", classId: 'bard', level: 29, manaCost: 0, effect: { type: 'buff', stat: 'hp_regen', value: 12, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_battlecry_of_the_vah_shir_brd', name: "Battlecry of the Vah Shir", classId: 'bard', level: 29, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 59, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_chant_of_frost_brd', name: "Chant of Frost", classId: 'bard', level: 29, manaCost: 0, effect: { type: 'damage', value: 631 }, buyPrice: 25000 },
  { id: 'spell_ervajs_lost_composition_brd', name: "Ervaj's Lost Composition", classId: 'bard', level: 34, manaCost: 0, effect: { type: 'buff', stat: 'all_stats', value: 20, duration: 30000 }, buyPrice: 38000 },
  { id: 'spell_hymn_of_restoration_ii_brd', name: "Hymn of Restoration II", classId: 'bard', level: 34, manaCost: 0, effect: { type: 'buff', stat: 'hp_regen', value: 14, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_lyssas_locating_lyric_brd', name: "Lyssa's Locating Lyric", classId: 'bard', level: 34, manaCost: 0, effect: { type: 'utility', effect: 'locate' }, buyPrice: 38000 },
  { id: 'spell_purifying_rhythm_brd', name: "Purifying Rhythm", classId: 'bard', level: 34, manaCost: 0, effect: { type: 'cure', ailment: 'all' }, buyPrice: 38000 },
  { id: 'spell_cassindras_chant_of_clarity_ii_brd', name: "Cassindra's Chant of Clarity II", classId: 'bard', level: 39, manaCost: 0, effect: { type: 'buff', stat: 'mana_regen', value: 16, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_denons_disruptive_discord_ii_brd', name: "Denon's Disruptive Discord II", classId: 'bard', level: 39, manaCost: 0, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_jonthans_whistling_warsong_ii_brd', name: "Jonthan's Whistling Warsong II", classId: 'bard', level: 39, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 79, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_agilmentes_aria_of_eagles_ii_brd', name: "Agilmente's Aria of Eagles II", classId: 'bard', level: 44, manaCost: 0, effect: { type: 'buff', stat: 'dexterity', value: 50, duration: 30000 }, buyPrice: 75000 },
  { id: 'spell_battlecry_of_the_vah_shir_ii_brd', name: "Battlecry of the Vah Shir", classId: 'bard', level: 44, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 89, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_cantata_of_soothing_ii_brd', name: "Cantata of Soothing II", classId: 'bard', level: 44, manaCost: 0, effect: { type: 'buff', stat: 'hp_regen', value: 18, duration: 60000 }, buyPrice: 75000 },
  { id: 'spell_nivs_harmonic_ii_brd', name: "Niv's Harmonic II", classId: 'bard', level: 49, manaCost: 0, effect: { type: 'buff', stat: 'ac', value: 125, duration: 60000 }, buyPrice: 100000 },
  { id: 'spell_selos_consonant_chain_ii_brd', name: "Selo's Consonant Chain", classId: 'bard', level: 49, manaCost: 0, effect: { type: 'buff', stat: 'speed', value: 80, duration: 30000 }, buyPrice: 100000 },
  { id: 'spell_angstlichs_appalling_screech_iii_brd', name: "Angstlich's Appalling Screech II", classId: 'bard', level: 51, manaCost: 0, effect: { type: 'fear', duration: 20000 }, buyPrice: 130000 },
  { id: 'spell_chorus_of_replenishment_brd', name: "Chorus of Replenishment", classId: 'bard', level: 54, manaCost: 0, effect: { type: 'buff', stat: 'mana_regen', value: 22, duration: 60000 }, buyPrice: 160000 },
  { id: 'spell_cassindras_chorus_of_clarity_ii_brd', name: "Cassindra's Chorus of Clarity", classId: 'bard', level: 57, manaCost: 0, effect: { type: 'buff', stat: 'mana_regen', value: 23, duration: 60000 }, buyPrice: 200000 },
  { id: 'spell_blade_of_thymidine_brd', name: "Blade of Thymidine", classId: 'bard', level: 60, manaCost: 0, effect: { type: 'damage', value: 1313 }, buyPrice: 250000 },
  { id: 'spell_warsong_of_the_vah_shir_brd', name: "Warsong of the Vah Shir", classId: 'bard', level: 60, manaCost: 0, effect: { type: 'buff', stat: 'attack', value: 121, duration: 60000 }, buyPrice: 250000 },

  // RANGER
  { id: 'spell_burst_of_flame_rng', name: "Burst of Flame", classId: 'ranger', level: 1, manaCost: 10, effect: { type: 'damage', value: 15 }, buyPrice: 500 },
  { id: 'spell_snare_rng', name: "Snare", classId: 'ranger', level: 1, manaCost: 10, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 5300 }, buyPrice: 500 },
  { id: 'spell_sense_animals_rng', name: "Sense Animals", classId: 'ranger', level: 1, manaCost: 10, effect: { type: 'utility', effect: 'sense_animals' }, buyPrice: 500 },
  { id: 'spell_lull_animal_rng', name: "Lull Animal", classId: 'ranger', level: 1, manaCost: 10, effect: { type: 'calm', duration: 10500 }, buyPrice: 500 },
  { id: 'spell_calm_animal_rng', name: "Calm Animal", classId: 'ranger', level: 5, manaCost: 36, effect: { type: 'calm', duration: 12500 }, buyPrice: 1500 },
  { id: 'spell_endure_fire_rng', name: "Endure Fire", classId: 'ranger', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'resist_fire', value: 20, duration: 60000 }, buyPrice: 1500 },
  { id: 'spell_harmony_rng', name: "Harmony", classId: 'ranger', level: 5, manaCost: 36, effect: { type: 'calm', duration: 12500 }, buyPrice: 1500 },
  { id: 'spell_camouflage_rng', name: "Camouflage", classId: 'ranger', level: 5, manaCost: 36, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 35000 }, buyPrice: 1500 },
  { id: 'spell_endure_cold_rng', name: "Endure Cold", classId: 'ranger', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'resist_cold', value: 28, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_grasping_roots_rng', name: "Grasping Roots", classId: 'ranger', level: 9, manaCost: 62, effect: { type: 'root', duration: 9500 }, buyPrice: 3500 },
  { id: 'spell_spirit_of_wolf_rng', name: "Spirit of Wolf", classId: 'ranger', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'speed', value: 40, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_skin_like_rock_rng', name: "Skin like Rock", classId: 'ranger', level: 9, manaCost: 62, effect: { type: 'buff', stat: 'ac', value: 25, duration: 60000 }, buyPrice: 3500 },
  { id: 'spell_bind_affinity_rng', name: "Bind Affinity", classId: 'ranger', level: 14, manaCost: 94, effect: { type: 'utility', effect: 'bind' }, buyPrice: 6000 },
  { id: 'spell_counteract_poison_rng', name: "Counteract Poison", classId: 'ranger', level: 14, manaCost: 94, effect: { type: 'cure', ailment: 'poison' }, buyPrice: 6000 },
  { id: 'spell_fire_strike_rng', name: "Fire Strike", classId: 'ranger', level: 14, manaCost: 94, effect: { type: 'damage', value: 301 }, buyPrice: 6000 },
  { id: 'spell_thistlecoat_rng', name: "Thistlecoat", classId: 'ranger', level: 14, manaCost: 94, effect: { type: 'buff', stat: 'thorns', value: 47, duration: 60000 }, buyPrice: 6000 },
  { id: 'spell_ensnare_rng', name: "Ensnare", classId: 'ranger', level: 19, manaCost: 127, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 10700 }, buyPrice: 10000 },
  { id: 'spell_firefist_rng', name: "Firefist", classId: 'ranger', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'attack', value: 39, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_skin_like_steel_rng', name: "Skin like Steel", classId: 'ranger', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'ac', value: 50, duration: 60000 }, buyPrice: 10000 },
  { id: 'spell_superior_camouflage_rng', name: "Superior Camouflage", classId: 'ranger', level: 19, manaCost: 127, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 49000 }, buyPrice: 10000 },
  { id: 'spell_counteract_disease_rng', name: "Counteract Disease", classId: 'ranger', level: 24, manaCost: 159, effect: { type: 'cure', ailment: 'disease' }, buyPrice: 16000 },
  { id: 'spell_drifting_death_rng', name: "Drifting Death", classId: 'ranger', level: 24, manaCost: 159, effect: { type: 'dot', value: 77 }, buyPrice: 16000 },
  { id: 'spell_natures_touch_rng', name: "Nature's Touch", classId: 'ranger', level: 24, manaCost: 159, effect: { type: 'heal', value: 950 }, buyPrice: 16000 },
  { id: 'spell_thorncoat_rng', name: "Thorncoat", classId: 'ranger', level: 24, manaCost: 159, effect: { type: 'buff', stat: 'thorns', value: 77, duration: 60000 }, buyPrice: 16000 },
  { id: 'spell_barbcoat_rng', name: "Barbcoat", classId: 'ranger', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'thorns', value: 92, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_firefist_ii_rng', name: "Firefist", classId: 'ranger', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'attack', value: 59, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_chloroplast_rng', name: "Chloroplast", classId: 'ranger', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'hp_regen', value: 12, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_shield_of_thistles_rng', name: "Shield of Thistles", classId: 'ranger', level: 29, manaCost: 192, effect: { type: 'buff', stat: 'thorns', value: 92, duration: 60000 }, buyPrice: 25000 },
  { id: 'spell_ensnare_ii_rng', name: "Ensnare", classId: 'ranger', level: 34, manaCost: 224, effect: { type: 'debuff', stat: 'slow', value: 50, duration: 15200 }, buyPrice: 38000 },
  { id: 'spell_firestrike_rng', name: "Firestrike", classId: 'ranger', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_nettlecoat_rng', name: "Nettlecoat", classId: 'ranger', level: 34, manaCost: 224, effect: { type: 'buff', stat: 'thorns', value: 107, duration: 60000 }, buyPrice: 38000 },
  { id: 'spell_nature_walkers_behest_rng', name: "Nature Walker's Behest", classId: 'ranger', level: 34, manaCost: 224, effect: { type: 'damage', value: 741 }, buyPrice: 38000 },
  { id: 'spell_jolt_rng', name: "Jolt", classId: 'ranger', level: 39, manaCost: 257, effect: { type: 'damage', value: 851 }, buyPrice: 55000 },
  { id: 'spell_shield_of_barbs_rng', name: "Shield of Barbs", classId: 'ranger', level: 39, manaCost: 257, effect: { type: 'buff', stat: 'thorns', value: 122, duration: 60000 }, buyPrice: 55000 },
  { id: 'spell_rathes_son_rng', name: "Rathe's Son", classId: 'ranger', level: 39, manaCost: 257, effect: { type: 'heal', value: 1550 }, buyPrice: 55000 },
  { id: 'spell_drifting_death_ii_rng', name: "Drifting Death", classId: 'ranger', level: 44, manaCost: 289, effect: { type: 'dot', value: 137 }, buyPrice: 75000 },
  { id: 'spell_enveloping_roots_rng', name: "Enveloping Roots", classId: 'ranger', level: 44, manaCost: 289, effect: { type: 'root', duration: 27000 }, buyPrice: 75000 },
  { id: 'spell_storm_strike_rng', name: "Storm Strike", classId: 'ranger', level: 49, manaCost: 322, effect: { type: 'damage', value: 1071 }, buyPrice: 100000 },
  { id: 'spell_ros_smoldering_disjunction_rng', name: "Ro's Smoldering Disjunction", classId: 'ranger', level: 49, manaCost: 322, effect: { type: 'dot', value: 152 }, buyPrice: 100000 },
  { id: 'spell_mask_of_the_forest_rng', name: "Mask of the Forest", classId: 'ranger', level: 51, manaCost: 335, effect: { type: 'buff', stat: 'invisibility', value: 1, duration: 81000 }, buyPrice: 130000 },
  { id: 'spell_shield_of_spike_rng', name: "Shield of Spike", classId: 'ranger', level: 54, manaCost: 354, effect: { type: 'buff', stat: 'thorns', value: 167, duration: 60000 }, buyPrice: 160000 },
  { id: 'spell_swarm_of_pain_rng', name: "Swarm of Pain", classId: 'ranger', level: 57, manaCost: 374, effect: { type: 'dot', value: 176 }, buyPrice: 200000 },
  { id: 'spell_natures_recovery_rng', name: "Nature's Recovery", classId: 'ranger', level: 60, manaCost: 393, effect: { type: 'heal', value: 2390 }, buyPrice: 250000 },
];

// ─── Coin Formatting ──────────────────────────────────────────────────────────

/**
 * Converts a copper integer amount to a formatted coin string like "2g 3s 5c".
 * @param {number} copper - Total amount in copper pieces.
 * @returns {string} Formatted coin string.
 */
function formatCoins(copper) {
  if (!copper || copper <= 0) return '0c';
  const gold   = Math.floor(copper / 1000);
  const silver = Math.floor((copper % 1000) / 100);
  const cop    = copper % 100;
  const parts  = [];
  if (gold   > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (cop    > 0) parts.push(`${cop}c`);
  return parts.join(' ') || '0c';
}

// ─── City Logic Functions ─────────────────────────────────────────────────────

/**
 * Returns the guild object for the given class ID, or null if none exists.
 * @param {string} classId - The class identifier (e.g. 'warrior', 'cleric').
 * @returns {object|null} Guild info object or null.
 */
function getGuildForClass(classId) {
  return GUILDS[classId] || null;
}

/**
 * Returns spells available to a class at or below the given level.
 * @param {string} classId - The class identifier.
 * @param {number} level   - The character's current level.
 * @returns {Array<object>} Filtered array of matching spell objects.
 */
function getAvailableSpells(classId, level) {
  return GUILD_SPELLS.filter(s => s.classId === classId && s.level <= level);
}

/**
 * Returns the party's total wealth expressed in copper from GameState gold/silver/copper.
 * @returns {number} Total copper value.
 */
function getTotalCopper() {
  return ((GameState.gold || 0) * 1000) + ((GameState.silver || 0) * 100) + (GameState.copper || 0);
}

/**
 * Deducts the given copper amount from GameState, redistributing across gold/silver/copper.
 * @param {number} amount - Amount in copper to deduct.
 * @returns {boolean} True if the deduction succeeded, false if insufficient funds.
 */
function deductCopper(amount) {
  let total = getTotalCopper() - amount;
  if (total < 0) return false;
  GameState.gold   = Math.floor(total / 1000);
  total %= 1000;
  GameState.silver = Math.floor(total / 100);
  GameState.copper = total % 100;
  return true;
}

/**
 * Purchases a spell from the guild and adds it to the learned spells list.
 * @param {string} spellId - The ID of the spell to purchase.
 * @returns {boolean} True if the purchase succeeded, false otherwise.
 */
function buySpell(spellId) {
  const spell = GUILD_SPELLS.find(s => s.id === spellId);
  if (!spell) { addCombatLog('Unknown spell.', 'system'); return false; }

  GameState.learnedSpells = GameState.learnedSpells || [];
  if (GameState.learnedSpells.includes(spellId)) {
    addCombatLog(`You already know ${spell.name}.`, 'system');
    return false;
  }

  const char = GameState.party[GameState.inspectedCharIndex || 0];
  if (!char || char.classId !== spell.classId) {
    addCombatLog(`Your character cannot learn ${spell.name}.`, 'system');
    return false;
  }
  if (char.level < spell.level) {
    addCombatLog(`You need to be level ${spell.level} to learn ${spell.name}.`, 'system');
    return false;
  }

  if (!deductCopper(spell.buyPrice)) {
    addCombatLog(`Not enough coin to buy ${spell.name} (${formatCoins(spell.buyPrice)}).`, 'system');
    return false;
  }

  GameState.learnedSpells.push(spellId);
  addCombatLog(`You learned ${spell.name}!`, 'levelup');
  if (typeof renderTopBar === 'function') renderTopBar();
  // Achievement hook
  if (typeof checkAchievements === 'function') checkAchievements('spell_buy', {});
  return true;
}

/**
 * Purchases an item from the city vendor and adds it to the party inventory.
 * @param {string} itemId - The ID of the item to purchase.
 * @returns {boolean} True if the purchase succeeded, false otherwise.
 */
function buyFromVendor(itemId) {
  const entry = CITY_VENDORS.find(v => v.itemId === itemId);
  if (!entry) { addCombatLog('Item not available.', 'system'); return false; }

  const item = typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;
  if (!item) { addCombatLog('Unknown item.', 'system'); return false; }

  if (!deductCopper(entry.buyPrice)) {
    addCombatLog(`Not enough coin to buy ${item.name} (${formatCoins(entry.buyPrice)}).`, 'system');
    return false;
  }

  if (typeof addToInventory === 'function') {
    addToInventory(itemId, 1);
  }
  addCombatLog(`You purchased ${item.name}.`, 'loot');
  if (typeof renderTopBar === 'function') renderTopBar();
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
  return true;
}

/**
 * Sells a quantity of an item from the party inventory to the vendor.
 * @param {string} itemId   - The ID of the item to sell.
 * @param {number} quantity - Number of items to sell.
 * @returns {boolean} True if the sale succeeded, false otherwise.
 */
function sellToVendor(itemId, quantity) {
  quantity = quantity || 1;

  const vendorEntry = CITY_VENDORS.find(v => v.itemId === itemId);
  const item = typeof ITEMS !== 'undefined' ? ITEMS[itemId] : null;

  // Only allow selling items that have a buy price reference; unknown items get 1c each
  const basePrice = vendorEntry ? vendorEntry.buyPrice : 2;
  const sellPrice = Math.max(1, Math.floor(basePrice * 0.5)) * quantity;

  if (!item) { addCombatLog('Unknown item.', 'system'); return false; }
  if (item.nodrop) { addCombatLog(`${item.name} is no-drop and cannot be sold.`, 'system'); return false; }

  // Remove from inventory
  if (!GameState.inventory) { addCombatLog('Nothing to sell.', 'system'); return false; }
  const stack = GameState.inventory.find(s => s && s.itemId === itemId);
  if (!stack || stack.quantity < quantity) {
    addCombatLog(`You don't have enough ${item.name} to sell.`, 'system');
    return false;
  }
  stack.quantity -= quantity;
  if (stack.quantity <= 0) {
    const idx = GameState.inventory.indexOf(stack);
    GameState.inventory.splice(idx, 1);
  }

  // Add coin
  let total = getTotalCopper() + sellPrice;
  GameState.gold   = Math.floor(total / 1000);
  total %= 1000;
  GameState.silver = Math.floor(total / 100);
  GameState.copper = total % 100;

  addCombatLog(`Sold ${item.name} x${quantity} for ${formatCoins(sellPrice)}.`, 'loot');
  if (typeof renderTopBar === 'function') renderTopBar();
  if (typeof updateInventoryUI === 'function') updateInventoryUI();
  return true;
}

// ─── Bank Operations ──────────────────────────────────────────────────────────

/**
 * Deposits an item from the party inventory into the bank.
 * @param {string} itemId             - The ID of the item to deposit.
 * @param {number} fromInventoryIndex - Index of the item in GameState.inventory.
 * @returns {boolean} True if the deposit succeeded, false otherwise.
 */
function depositItemToBank(itemId, fromInventoryIndex) {
  if (!GameState.inventory) return false;
  const stack = GameState.inventory[fromInventoryIndex];
  if (!stack || stack.itemId !== itemId) return false;
  const item = ITEMS[itemId];
  if (item && item.nodrop) {
    addCombatLog(`${item ? item.name : itemId} is no-drop and cannot be banked.`, 'system');
    return false;
  }
  const success = addToBank(itemId, stack.quantity);
  if (!success) {
    addCombatLog('Bank is full!', 'system');
    return false;
  }
  GameState.inventory.splice(fromInventoryIndex, 1);
  addCombatLog(`Deposited ${item ? item.name : itemId} to bank.`, 'loot');
  // Achievement hook
  if (typeof checkAchievements === 'function') {
    checkAchievements('bank_deposit', { bankSize: (GameState.bank || []).filter(Boolean).length });
  }
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
  if (typeof renderCityTabContent === 'function') renderCityTabContent('bank');
  return true;
}

/**
 * Withdraws an item from the bank into the party inventory.
 * @param {number} bankSlotIndex - Index of the bank slot to withdraw from.
 * @returns {boolean} True if the withdrawal succeeded, false otherwise.
 */
function withdrawItemFromBank(bankSlotIndex) {
  if (!GameState.bank) return false;
  const stack = GameState.bank[bankSlotIndex];
  if (!stack) return false;
  const item = ITEMS[stack.itemId];
  if (typeof addToInventory === 'function') {
    addToInventory(stack.itemId, stack.quantity);
  } else {
    if (!GameState.inventory) GameState.inventory = [];
    GameState.inventory.push({ itemId: stack.itemId, quantity: stack.quantity });
  }
  GameState.bank[bankSlotIndex] = null;
  // Compact nulls from end
  while (GameState.bank.length > 0 && GameState.bank[GameState.bank.length - 1] === null) {
    GameState.bank.pop();
  }
  addCombatLog(`Withdrew ${item ? item.name : stack.itemId} from bank.`, 'loot');
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryPanel === 'function') renderInventoryPanel();
  if (typeof renderCityTabContent === 'function') renderCityTabContent('bank');
  return true;
}

// ─── Zone Travel ──────────────────────────────────────────────────────────────

/**
 * Moves the party to the specified zone, stopping combat and refreshing all zone UI.
 * @param {string} zoneId - The ID of the zone to travel to.
 * @returns {void}
 */
function travelToZone(zoneId) {
  const zone = typeof ZONES !== 'undefined' ? ZONES[zoneId] : null;
  if (!zone) { addCombatLog('Unknown zone.', 'system'); return; }

  // Stop combat when leaving any zone
  if (typeof stopCombat === 'function') stopCombat();
  GameState.combatActive = false;
  GameState.currentEnemy = null;
  GameState.selectedEnemyId = null;

  GameState.zone = zoneId;

  // Track visited zones
  if (!GameState.visitedZones) GameState.visitedZones = [];
  if (!GameState.visitedZones.includes(zoneId)) {
    GameState.visitedZones.push(zoneId);
  }

  // Achievement hook: zone_change
  if (typeof checkAchievements === 'function') {
    checkAchievements('zone_change', { zoneId, visitedZones: new Set(GameState.visitedZones) });
  }
  // Safe zone: reach_qeynos
  if (zone.isSafeZone && typeof checkAchievements === 'function') {
    checkAchievements('zone_change', { zoneId: 'qeynos', visitedZones: new Set(GameState.visitedZones) });
  }

  if (typeof renderZonePanel === 'function') renderZonePanel();
  if (typeof renderEnemySelector === 'function') renderEnemySelector();
  if (typeof renderCityPanel === 'function') renderCityPanel();
  if (typeof updateEnemyDisplay === 'function') updateEnemyDisplay();
  if (typeof renderTopBar === 'function') renderTopBar();

  addCombatLog(`You have entered ${zone.name}.`, 'system');
}

// ─── Module Export ────────────────────────────────────────────────────────────

if (typeof module !== 'undefined') module.exports = {
  GUILDS, CITY_VENDORS, GUILD_SPELLS,
  formatCoins, getGuildForClass, getAvailableSpells,
  buySpell, buyFromVendor, sellToVendor, travelToZone,
  depositItemToBank, withdrawItemFromBank,
};
