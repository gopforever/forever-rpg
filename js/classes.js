/**
 * Registry of all playable classes, keyed by class ID string.
 *
 * Each entry defines the full configuration for a class, including its
 * archetype, combat role, stat growth, starting equipment, lore, and abilities.
 *
 * @type {Object.<string, {
 *   name: string,
 *   archetype: string,
 *   role: string,
 *   manaStat: string|null,
 *   hpPerSTA: number,
 *   primaryStats: Array<string>,
 *   baseStats: {STR: number, DEX: number, AGI: number, STA: number, WIS: number, INT: number, CHA: number},
 *   description: string,
 *   abilities: Array<{name: string, description: string, manaCost: number, castTime: number, recastTime: number, effect: object}>,
 *   startingWeapon: string,
 *   icon: string
 * }>}
 *
 * @property {string}        name           - Display name of the class.
 * @property {string}        archetype      - Broad combat archetype: 'Melee', 'Hybrid', 'Caster', or 'Priest'.
 * @property {string}        role           - Specific combat role, e.g. 'Tank', 'DPS', or 'Support'.
 * @property {string|null}   manaStat       - Stat used to determine the mana pool ('WIS', 'INT'), or null if the class has no mana.
 * @property {number}        hpPerSTA       - HP gained per point of STA each level.
 * @property {Array<string>} primaryStats   - Stats that receive +2 on level-up; all other stats receive +1.
 * @property {object}        baseStats      - Starting stat values (STR/DEX/AGI/STA/WIS/INT/CHA).
 * @property {string}        description    - Long lore/flavour description of the class.
 * @property {Array<object>} abilities      - Ability definitions. Each entry contains:
 *   - name {string}: ability name
 *   - description {string}: ability flavour text
 *   - manaCost {number}: mana consumed on use
 *   - castTime {number}: cast time in milliseconds
 *   - recastTime {number}: cooldown in milliseconds
 *   - effect {object}: structured effect payload (type, stat, value, etc.)
 * @property {string}        startingWeapon - Item ID of the weapon the class begins with.
 * @property {string}        icon           - Emoji icon representing the class in the UI.
 */
const CLASSES = {
  warrior: {
    name: 'Warrior',
    archetype: 'Melee',
    role: 'Tank',
    manaStat: null,
    hpPerSTA: 6,
    primaryStats: ['STR', 'STA', 'AGI'],
    baseStats: { STR: 110, DEX: 75, AGI: 90, STA: 110, WIS: 60, INT: 60, CHA: 55 },
    description: 'Warriors are the undisputed masters of melee combat and the backbone of any adventuring group. Clad in the heaviest armors and wielding weapons of every variety, they charge headlong into the fray to protect their companions. Warriors possess no magical ability whatsoever, but more than compensate with unmatched physical resilience and combat discipline. Their taunt abilities keep monsters focused on them rather than frailer allies, and their disciplines allow them to shrug off punishment that would fell lesser fighters. Veterans of countless battles, Warriors earn their reputation as the finest tanks in Norrath through sheer determination and skill at arms.',
    abilities: [
      { name: 'Taunt', description: 'Bellow a challenge at your enemy, forcing it to focus its attacks on you and pulling its attention away from allies.', manaCost: 0, castTime: 0, recastTime: 8000, effect: { type: 'taunt', value: 100 } },
      { name: 'Bash', description: 'Slam your shield or fist into the enemy with great force, dealing damage and briefly interrupting any spellcasting.', manaCost: 0, castTime: 0, recastTime: 6000, effect: { type: 'damage', value: 25 } },
      { name: 'Berserk', description: 'Enter a blood rage when your health drops low, dramatically increasing your melee damage output at the cost of defense.', manaCost: 0, castTime: 0, recastTime: 120000, effect: { type: 'buff', stat: 'damage', value: 50 } },
      { name: 'Defense Discipline', description: 'Focus your combat training entirely on defense, greatly increasing your armor class and damage mitigation for a short time.', manaCost: 0, castTime: 0, recastTime: 300000, effect: { type: 'buff', stat: 'ac', value: 100 } },
      { name: 'War Cry', description: 'Unleash a fearsome battle cry that unnerves nearby enemies, reducing their accuracy and combat effectiveness.', manaCost: 0, castTime: 0, recastTime: 60000, effect: { type: 'debuff', stat: 'accuracy', value: 25 } },
      { name: 'Kick', description: 'Drive your boot into the enemy with a powerful kick, dealing physical damage and momentarily staggering your foe.', manaCost: 0, castTime: 0, recastTime: 5000, effect: { type: 'damage', value: 18 } }
    ],
    startingWeapon: 'short_sword',
    icon: '⚔️'
  },

  paladin: {
    name: 'Paladin',
    archetype: 'Hybrid',
    role: 'Tank/Healer',
    manaStat: 'WIS',
    hpPerSTA: 5,
    primaryStats: ['STR', 'STA', 'WIS', 'CHA'],
    baseStats: { STR: 95, DEX: 70, AGI: 80, STA: 95, WIS: 85, INT: 60, CHA: 90 },
    description: 'Paladins are holy warriors who have pledged their lives and swords to the service of their deity and the forces of good. Drawing power from their unwavering faith, Paladins blend martial prowess with divine magic to become formidable defenders of the innocent. They wear heavy plate armor and wield weapons with righteous fury, while their prayers allow them to heal wounds, stun enemies, and call upon divine protection. Paladins are especially devastating against undead and other creatures of darkness. Though their spellcasting lags behind true priests and their combat behind pure warriors, the Paladin\'s combination of healing and tankability makes them invaluable in any group.',
    abilities: [
      { name: 'Holy Light', description: 'Channel divine radiance to smite an undead or evil creature with holy energy, dealing significant damage to creatures of darkness.', manaCost: 30, castTime: 2000, recastTime: 8000, effect: { type: 'damage_undead', value: 80 } },
      { name: 'Lay on Hands', description: 'Channel the full healing power of your deity through your hands to restore a massive amount of hit points to yourself or an ally. Usable only once per day.', manaCost: 0, castTime: 0, recastTime: 3600000, effect: { type: 'heal', value: 700 } },
      { name: 'Stun', description: 'Call upon divine power to momentarily stun an enemy, leaving them helpless and unable to act for several seconds.', manaCost: 20, castTime: 1500, recastTime: 12000, effect: { type: 'stun', duration: 3000 } },
      { name: 'Divine Aura', description: 'Surround yourself with a shimmering barrier of divine energy that renders you completely invulnerable to all damage for a brief time.', manaCost: 0, castTime: 0, recastTime: 300000, effect: { type: 'invulnerability', duration: 18000 } },
      { name: 'Undead Ward', description: 'Invoke a holy ward that repels undead creatures, sending them fleeing in terror from the power of your divine faith.', manaCost: 25, castTime: 2000, recastTime: 15000, effect: { type: 'turn_undead', value: 50 } },
      { name: 'Healing', description: 'Invoke a prayer of healing to restore hit points to yourself or a wounded ally, calling upon your deity to mend their injuries.', manaCost: 40, castTime: 3000, recastTime: 4000, effect: { type: 'heal', value: 120 } },
      { name: 'Revive', description: 'Revives a fallen ally with holy power, restoring them to life with a portion of their hit points.', manaCost: 60, castTime: 6000, recastTime: 90000, effect: { type: 'resurrect' } },
    ],
    startingWeapon: 'short_sword',
    icon: '🛡️'
  },

  shadowknight: {
    name: 'Shadow Knight',
    archetype: 'Hybrid',
    role: 'Tank/DPS',
    manaStat: 'INT',
    hpPerSTA: 5,
    primaryStats: ['STR', 'STA', 'INT'],
    baseStats: { STR: 100, DEX: 70, AGI: 80, STA: 100, WIS: 60, INT: 85, CHA: 55 },
    description: 'Shadow Knights are dark champions who have forsaken the light to embrace the powers of shadow, death, and fear. Once perhaps warriors or knights of renown, they made a fateful pact with dark forces and now serve the evil deities of Norrath. They don heavy armor just as their Paladin counterparts, but instead of healing and holy magic, Shadow Knights wield dark sorcery — draining life from their enemies, spreading fear, and summoning undead servants. Their infamous Harm Touch ability lets them unleash a devastating burst of necrotic energy that can cripple even powerful foes. Shadow Knights are cunning, patient, and utterly ruthless in pursuit of their goals.',
    abilities: [
      { name: 'Harm Touch', description: 'Channel the darkest necrotic energy through your touch to deal massive damage to a single target. The most feared ability of the Shadow Knight, usable once per day.', manaCost: 0, castTime: 0, recastTime: 3600000, effect: { type: 'damage', value: 500 } },
      { name: 'Siphon Strength', description: 'Drain the physical strength from your enemy, transferring it to yourself and leaving your foe weakened while you grow stronger.', manaCost: 35, castTime: 2500, recastTime: 30000, effect: { type: 'debuff', stat: 'STR', value: 20 } },
      { name: 'Fear', description: 'Project an aura of supernatural dread that sends your target fleeing in blind terror, unable to fight back while the fear holds.', manaCost: 45, castTime: 2000, recastTime: 20000, effect: { type: 'fear', duration: 30000 } },
      { name: 'Lifetap', description: 'Drain the life energy from your target, dealing necrotic damage while simultaneously restoring your own hit points.', manaCost: 50, castTime: 2500, recastTime: 10000, effect: { type: 'lifetap', value: 60 } },
      { name: 'Screaming Terror', description: 'Unleash a terrifying shriek of dark energy that causes all nearby enemies to flee in panic, breaking their concentration and sending them running.', manaCost: 60, castTime: 2000, recastTime: 45000, effect: { type: 'aoe_fear', duration: 15000 } },
      { name: 'Taunt', description: 'Draw the enemy\'s wrath upon yourself with a dark challenge, forcing it to direct its attacks at you and away from more vulnerable companions.', manaCost: 0, castTime: 0, recastTime: 8000, effect: { type: 'taunt', value: 100 } }
    ],
    startingWeapon: 'short_sword',
    icon: '💀'
  },

  ranger: {
    name: 'Ranger',
    archetype: 'Hybrid',
    role: 'DPS',
    manaStat: 'WIS',
    hpPerSTA: 4,
    primaryStats: ['DEX', 'STR', 'AGI'],
    baseStats: { STR: 100, DEX: 90, AGI: 100, STA: 90, WIS: 80, INT: 70, CHA: 70 },
    description: 'Rangers are the wardens of the wild places of Norrath, equally at home in dense forest, open plains, or treacherous swamp. They combine the skills of the warrior with the nature magic of the druid to become versatile outdoorsmen capable of handling any situation. Rangers excel with a bow, raining arrows upon enemies from a distance with deadly accuracy, but they are equally dangerous in close combat with their dual-wielding fighting style. Their nature magic lets them cast snares to slow fleeing prey, accelerate their companions\' movement, and call upon the spirits of the wild for aid. Rangers are indispensable scouts and trackers in any adventuring party.',
    abilities: [
      { name: 'Eagle Eye', description: 'Invoke the keen vision of an eagle to dramatically improve your ranged accuracy and attack speed with a bow for a sustained period.', manaCost: 20, castTime: 2000, recastTime: 60000, effect: { type: 'buff', stat: 'accuracy', value: 30 } },
      { name: 'Archery', description: 'Draw and fire an arrow with practiced precision, dealing significant ranged physical damage to a target at distance.', manaCost: 0, castTime: 0, recastTime: 4000, effect: { type: 'damage', value: 60 } },
      { name: 'Snare', description: 'Entangle your target\'s feet in thorny vines or magically slowing bonds, greatly reducing their movement speed.', manaCost: 30, castTime: 2500, recastTime: 10000, effect: { type: 'snare', value: 50 } },
      { name: 'Spirit of the Wolf', description: 'Call upon the spirit of the wolf to bless yourself and nearby allies, greatly increasing everyone\'s movement speed for an extended duration.', manaCost: 50, castTime: 3000, recastTime: 15000, effect: { type: 'buff', stat: 'speed', value: 40 } },
      { name: 'Forage', description: 'Apply your deep knowledge of wilderness survival to forage the surrounding area for food, water, or useful natural materials.', manaCost: 0, castTime: 3000, recastTime: 30000, effect: { type: 'forage', value: 1 } },
      { name: 'Tracking', description: 'Use your mastery of wilderness lore to detect and track the movements of creatures and enemies in the surrounding area.', manaCost: 0, castTime: 2000, recastTime: 20000, effect: { type: 'track', value: 1 } }
    ],
    startingWeapon: 'short_sword',
    icon: '🏹'
  },

  bard: {
    name: 'Bard',
    archetype: 'Hybrid',
    role: 'Support',
    manaStat: 'INT',
    hpPerSTA: 4,
    primaryStats: ['DEX', 'CHA', 'STR'],
    baseStats: { STR: 90, DEX: 100, AGI: 90, STA: 85, WIS: 70, INT: 75, CHA: 100 },
    description: 'Bards are the wandering minstrels and storytellers of Norrath, weaving powerful magic through music, song, and verse. Unlike any other class, Bards twist magic through a unique system of song-weaving, maintaining multiple songs simultaneously by cycling through them in rapid succession. Their vast repertoire includes songs that dramatically increase movement speed, enhance their allies\' combat abilities, resist spells, charm creatures, and even cause sleep. While not the strongest fighters or most powerful casters, the Bard\'s unparalleled versatility and buff stacking make them one of the most sought-after additions to any group. A skilled Bard can turn the tide of a difficult encounter with the right song at the right moment.',
    abilities: [
      { name: "Selo's Accelerando", description: "Compose Selo's legendary song of swiftness, dramatically increasing the movement speed of yourself and all nearby allies to an exhilarating pace.", manaCost: 15, castTime: 0, recastTime: 6000, effect: { type: 'buff', stat: 'speed', value: 60 } },
      { name: 'Anthem de Arms', description: 'Perform a stirring martial anthem that imbues nearby allies with increased strength and attack power, inspiring them to fight with greater ferocity.', manaCost: 15, castTime: 0, recastTime: 6000, effect: { type: 'buff', stat: 'STR', value: 15 } },
      { name: "Brell's Stalwart Song", description: "Invoke Brell Serilis's stoic endurance through song, granting nearby companions increased stamina and improved fortitude against physical attacks.", manaCost: 15, castTime: 0, recastTime: 6000, effect: { type: 'buff', stat: 'STA', value: 15 } },
      { name: 'Chant of Battle', description: 'Maintain a rhythmic battle chant that synchronizes the attacks of nearby allies, increasing their overall damage output in a sustained combat encounter.', manaCost: 15, castTime: 0, recastTime: 6000, effect: { type: 'buff', stat: 'damage', value: 20 } },
      { name: "Jonthan's Whistling Warsong", description: "Play Jonthan's famous warsong, a complex melody that boosts the attack rating of all nearby allies and inspires them with heroic confidence.", manaCost: 15, castTime: 0, recastTime: 6000, effect: { type: 'buff', stat: 'attack', value: 25 } },
      { name: 'Lullaby', description: 'Hum a soothing lullaby to charm a target into a mesmerized slumber, temporarily preventing them from acting or being aggroed.', manaCost: 20, castTime: 0, recastTime: 12000, effect: { type: 'mez', duration: 20000 } }
    ],
    startingWeapon: 'short_sword',
    icon: '🎵'
  },

  beastlord: {
    name: 'Beastlord',
    archetype: 'Hybrid',
    role: 'DPS/Support',
    manaStat: 'WIS',
    hpPerSTA: 4,
    primaryStats: ['STR', 'WIS', 'AGI'],
    baseStats: { STR: 100, DEX: 85, AGI: 90, STA: 90, WIS: 95, INT: 65, CHA: 65 },
    description: 'Beastlords are primal warriors who forge an unbreakable spiritual bond with a loyal animal companion called a Warder. This bond is more than simple pet ownership — it is a deep spiritual communion that allows Beastlord and Warder to fight as one, their combat instincts perfectly synchronized. Beastlords channel shamanistic magic to enhance themselves and their Warder, buff their allies, and debuff their enemies. They fight with claws and fists as readily as weapons, and their Warder adds significant additional damage to every encounter. Found primarily among the Vah Shir, Iksar, Ogre, and Troll races, Beastlords bridge the gap between warrior and shaman with unique and powerful results.',
    abilities: [
      { name: 'Warder Claw', description: 'Command your Warder to attack with its claws in a frenzied swipe, dealing significant damage to your target as your animal companion tears into them.', manaCost: 10, castTime: 0, recastTime: 8000, effect: { type: 'pet_attack', value: 40 } },
      { name: 'Spirit Strike', description: 'Focus the primal spiritual energy of your bond to strike your enemy with supernatural force, bypassing some of their physical defenses.', manaCost: 35, castTime: 1500, recastTime: 10000, effect: { type: 'damage', value: 55 } },
      { name: 'Share Wolf Form', description: 'Channel wolfblood magic to partially transform yourself and your companions, granting enhanced strength and regeneration.', manaCost: 50, castTime: 3000, recastTime: 60000, effect: { type: 'buff', stat: 'STR', value: 20 } },
      { name: 'Feral Swipe', description: 'Unleash a savage raking attack with feral ferocity, dealing heavy melee damage and potentially causing a bleed effect on your target.', manaCost: 0, castTime: 0, recastTime: 6000, effect: { type: 'damage', value: 70 } },
      { name: 'Primal Fury', description: 'Enter a primal fury state that dramatically increases your and your Warder\'s attack speed and damage for a sustained duration.', manaCost: 60, castTime: 2000, recastTime: 120000, effect: { type: 'buff', stat: 'attack', value: 30 } },
      { name: 'Mend Companion', description: 'Channel healing spiritual energy into your Warder to restore its hit points, keeping your loyal animal companion in fighting condition.', manaCost: 40, castTime: 2500, recastTime: 10000, effect: { type: 'heal_pet', value: 200 } }
    ],
    startingWeapon: 'crude_spear',
    icon: '🐾'
  },

  berserker: {
    name: 'Berserker',
    archetype: 'Melee',
    role: 'DPS',
    manaStat: null,
    hpPerSTA: 5,
    primaryStats: ['STR', 'STA', 'DEX'],
    baseStats: { STR: 115, DEX: 90, AGI: 90, STA: 105, WIS: 55, INT: 55, CHA: 55 },
    description: 'Berserkers are ferocious axe-wielding warriors who embrace a state of battle rage that makes them tremendously dangerous but difficult to control. Where Warriors fight with discipline and precision, Berserkers throw caution to the wind and surrender to primal fury, dealing massive damage at the cost of defensive awareness. They specialize in axes and two-handed weapons, using their Frenzy and Berserk abilities to achieve devastating attack combinations. Dwarven Berserkers are legendary, their battle hymns echoing through mountain halls before a charge. While they cannot match Warriors in terms of tanking ability, no class in Norrath can match the raw, terrifying damage output of a Berserker in full fury.',
    abilities: [
      { name: 'Frenzy', description: 'Enter a whirling frenzy of axe blows, rapidly striking your enemy multiple times in quick succession with reckless, furious abandon.', manaCost: 0, castTime: 0, recastTime: 8000, effect: { type: 'damage', value: 80 } },
      { name: 'Mighty Blow', description: 'Wind up and deliver a single enormous overhead blow with all your strength behind it, dealing massive damage that can stagger even large opponents.', manaCost: 0, castTime: 0, recastTime: 12000, effect: { type: 'damage', value: 120 } },
      { name: 'Berserk Fury', description: 'Surrender completely to berserk rage, dramatically increasing your damage output but leaving you less aware of incoming attacks.', manaCost: 0, castTime: 0, recastTime: 60000, effect: { type: 'buff', stat: 'damage', value: 40 } },
      { name: 'Blood Frenzy', description: 'The sight and smell of blood drives you into an accelerated fury, temporarily increasing your attack speed dramatically.', manaCost: 0, castTime: 0, recastTime: 45000, effect: { type: 'buff', stat: 'attack_speed', value: 25 } },
      { name: 'Reckless Abandon', description: 'Throw all caution aside and fight with absolutely no regard for personal safety, maximizing damage output at significant risk to yourself.', manaCost: 0, castTime: 0, recastTime: 300000, effect: { type: 'buff', stat: 'damage', value: 60 } },
      { name: 'Intimidate', description: 'Unleash a ferocious roar and display of violent intent that can unnerve your opponent and temporarily reduce their fighting effectiveness.', manaCost: 0, castTime: 0, recastTime: 30000, effect: { type: 'debuff', stat: 'accuracy', value: 20 } }
    ],
    startingWeapon: 'hatchet',
    icon: '🪓'
  },

  monk: {
    name: 'Monk',
    archetype: 'Melee',
    role: 'DPS',
    manaStat: null,
    hpPerSTA: 4,
    primaryStats: ['STR', 'AGI', 'DEX', 'WIS'],
    baseStats: { STR: 100, DEX: 100, AGI: 105, STA: 90, WIS: 80, INT: 75, CHA: 60 },
    description: 'Monks are disciplined martial artists who have spent years perfecting their bodies and minds into living weapons. Forgoing heavy armor entirely — indeed, they fight most effectively with as little equipment as possible — Monks rely on their extraordinary agility and extensive combat training to dodge attacks that would harm less nimble fighters. They fight primarily with their hands and feet, using devastating kicks and hand strikes that rival the power of many weapons. The Monk\'s signature Feign Death ability lets them drop to the ground and appear dead, causing enemies to lose interest, a tactic invaluable for escaping dangerous situations. Monks are among the fastest classes in Norrath and their pulling ability makes them prized group members.',
    abilities: [
      { name: 'Flying Kick', description: 'Launch yourself through the air and deliver a devastating flying kick to your target, dealing significant damage that scales with your martial arts skill.', manaCost: 0, castTime: 0, recastTime: 7000, effect: { type: 'damage', value: 70 } },
      { name: 'Tiger Claw', description: 'Strike with a precise raking claw technique, dealing damage and potentially unbalancing your opponent with the force of the blow.', manaCost: 0, castTime: 0, recastTime: 5000, effect: { type: 'damage', value: 55 } },
      { name: 'Feign Death', description: 'Drop instantly to the ground and perfectly mimic the appearance of death, causing enemies to believe you are slain and abandon their attacks against you.', manaCost: 0, castTime: 0, recastTime: 15000, effect: { type: 'feign_death', value: 1 } },
      { name: 'Mend', description: 'Apply your deep knowledge of the body and ki energy to accelerate the healing of your own wounds, restoring a significant portion of your hit points.', manaCost: 0, castTime: 0, recastTime: 360000, effect: { type: 'heal', value: 150 } },
      { name: 'Intimidation', description: 'Use your imposing martial presence and focused killing intent to unnerve an enemy, forcing them to focus on you rather than weaker companions.', manaCost: 0, castTime: 0, recastTime: 15000, effect: { type: 'taunt', value: 80 } },
      { name: 'Crane Stance', description: 'Assume the balanced crane fighting stance, significantly improving your defense and dodge chance for a sustained period of time.', manaCost: 0, castTime: 0, recastTime: 120000, effect: { type: 'buff', stat: 'ac', value: 50 } }
    ],
    startingWeapon: 'fists',
    icon: '🥋'
  },

  rogue: {
    name: 'Rogue',
    archetype: 'Melee',
    role: 'DPS',
    manaStat: null,
    hpPerSTA: 3,
    primaryStats: ['DEX', 'AGI', 'STR'],
    baseStats: { STR: 95, DEX: 110, AGI: 105, STA: 85, WIS: 60, INT: 75, CHA: 80 },
    description: 'Rogues are cunning and opportunistic fighters who rely on stealth, positioning, and precise strikes to deal devastating damage. Masters of shadow, they can slip through a room undetected, steal a purse from a distracted merchant, or slip a blade between an enemy\'s ribs before the foe realizes what has happened. The Rogue\'s signature ability, Backstab, delivers tremendous damage when striking an unaware or flanked opponent, far exceeding what most melee classes can achieve in a single hit. Rogues also excel at picking locks, disarming traps, and applying deadly poisons to their weapons. Though lightly armored and fragile in a direct fight, a Rogue who controls the flow of combat is a terrifying opponent.',
    abilities: [
      { name: 'Backstab', description: 'Strike a distracted or flanked enemy in a precise vital spot, dealing enormous damage that dwarfs a normal attack when executed from the correct position.', manaCost: 0, castTime: 0, recastTime: 8000, effect: { type: 'backstab', value: 150 } },
      { name: 'Evade', description: 'Use quick footwork and misdirection to shift threat away from yourself, convincing nearby enemies to focus their attention on your allies instead.', manaCost: 0, castTime: 0, recastTime: 15000, effect: { type: 'evade', value: 100 } },
      { name: 'Pick Pocket', description: 'Use your nimble fingers and sleight of hand to lift a coin or small item from an unsuspecting target without them noticing the theft.', manaCost: 0, castTime: 0, recastTime: 10000, effect: { type: 'pickpocket', value: 1 } },
      { name: 'Poison Weapon', description: 'Apply a prepared venom to your blade that will transfer to the target on a successful hit, dealing damage over time or applying a debilitating effect.', manaCost: 0, castTime: 1000, recastTime: 45000, effect: { type: 'poison', value: 40 } },
      { name: 'Sneak', description: 'Move with extraordinary quiet and care, effectively becoming invisible to enemies who are not directly watching you, allowing for safer movement.', manaCost: 0, castTime: 0, recastTime: 5000, effect: { type: 'sneak', value: 1 } },
      { name: 'Hide', description: 'Duck into the available shadows and conceal yourself completely from sight, becoming invisible to nearby enemies until you act or move too quickly.', manaCost: 0, castTime: 1000, recastTime: 5000, effect: { type: 'hide', value: 1 } }
    ],
    startingWeapon: 'dagger',
    icon: '🗡️'
  },

  wizard: {
    name: 'Wizard',
    archetype: 'Caster',
    role: 'DPS Caster',
    manaStat: 'INT',
    hpPerSTA: 2,
    primaryStats: ['INT', 'WIS'],
    baseStats: { STR: 60, DEX: 70, AGI: 70, STA: 70, WIS: 80, INT: 120, CHA: 75 },
    description: 'Wizards are the supreme masters of elemental destructive magic in Norrath, capable of unleashing blasts of fire, ice, and lightning that devastate single targets and groups of enemies alike. Blessed with the highest raw magical damage output of any class, a Wizard\'s spells can obliterate powerful enemies in seconds, but this comes at the cost of paper-thin physical defenses and a vast mana pool that drains quickly. Wizards are famous for their Gate and Teleport spells, which allow them to instantly travel across vast distances and bind themselves to safe locations for emergency escape. Intellectually driven and often eccentric, Wizards are students of pure arcane theory who push the limits of magical destruction.',
    abilities: [
      { name: 'Shock of Ice', description: 'Hurl a concentrated bolt of glacial energy at your target, encasing them in a burst of extreme cold that deals massive ice damage.', manaCost: 110, castTime: 3000, recastTime: 6000, effect: { type: 'damage', value: 200 } },
      { name: 'Fireball', description: 'Launch a roaring sphere of concentrated fire that erupts on impact, dealing heavy fire damage to the target and any enemies caught in the explosion.', manaCost: 95, castTime: 2500, recastTime: 6000, effect: { type: 'damage_aoe', value: 150 } },
      { name: 'Thunderclap', description: 'Invoke a focused thunderbolt of crackling electrical energy that strikes your target with tremendous voltage damage.', manaCost: 100, castTime: 2800, recastTime: 6000, effect: { type: 'damage', value: 175 } },
      { name: 'Gate', description: 'Open a magical gate that instantly transports you to your bind point, allowing immediate escape from deadly situations regardless of distance.', manaCost: 70, castTime: 6000, recastTime: 120000, effect: { type: 'gate', value: 1 } },
      { name: 'Teleport', description: 'Weave a complex teleportation matrix that instantly transports you and your group to a specified location anywhere on Norrath.', manaCost: 150, castTime: 8000, recastTime: 15000, effect: { type: 'teleport', value: 1 } },
      { name: 'Concussive Blast', description: 'Release a concussive wave of pure magical force energy, dealing moderate damage and briefly interrupting the target\'s actions.', manaCost: 60, castTime: 2000, recastTime: 4000, effect: { type: 'damage', value: 100 } }
    ],
    startingWeapon: 'gnarled_staff',
    icon: '🔮'
  },

  magician: {
    name: 'Magician',
    archetype: 'Caster',
    role: 'DPS Caster',
    manaStat: 'INT',
    hpPerSTA: 2,
    primaryStats: ['INT', 'WIS'],
    baseStats: { STR: 65, DEX: 70, AGI: 70, STA: 75, WIS: 75, INT: 115, CHA: 70 },
    description: 'Magicians are conjurers who specialize in summoning and commanding elemental beings from the planes of Fire, Water, Earth, and Air. Unlike Necromancers who raise the dead, Magicians forge pacts with elemental forces and call these powerful beings into service. Their elemental pets are among the most powerful summoned companions in Norrath, capable of tanking significant damage while the Magician supports them with damaging spells and pet-enhancing buffs like Burnout. Magicians can also conjure food, water, weapons, and magical items from thin air, making them uniquely self-sufficient. In groups they provide a powerful damage-dealing pet, solid nuking spells, and the invaluable ability to summon gear to replace what has been lost.',
    abilities: [
      { name: 'Summon Companion', description: 'Open a rift to the elemental planes and call forth a powerful elemental servant to fight by your side and obey your commands.', manaCost: 100, castTime: 8000, recastTime: 30000, effect: { type: 'summon_pet', value: 1 } },
      { name: 'Bolt of Flame', description: 'Hurl a searing bolt of pure elemental fire conjured from the Plane of Fire itself at your target, dealing significant fire damage.', manaCost: 90, castTime: 2500, recastTime: 6000, effect: { type: 'damage', value: 160 } },
      { name: 'Burnout', description: 'Infuse your elemental companion with searing power, dramatically increasing its damage output and combat effectiveness for an extended duration.', manaCost: 80, castTime: 3000, recastTime: 60000, effect: { type: 'pet_buff', stat: 'damage', value: 30 } },
      { name: 'Call of Fire', description: 'Invoke the raw power of elemental flame to rain conjured fire down upon your target, dealing moderate damage with reliable consistency.', manaCost: 75, castTime: 2000, recastTime: 5000, effect: { type: 'damage', value: 130 } },
      { name: 'Dismiss Elemental', description: 'Sever the conjuration binding your elemental companion, sending it back to its home plane and eliminating any threat it may have posed.', manaCost: 10, castTime: 1000, recastTime: 5000, effect: { type: 'dismiss_pet', value: 1 } },
      { name: 'Elemental Shield', description: 'Surround yourself with a swirling barrier of elemental energy that absorbs a portion of incoming magical damage for a sustained duration.', manaCost: 60, castTime: 3000, recastTime: 120000, effect: { type: 'buff', stat: 'magic_resist', value: 30 } }
    ],
    startingWeapon: 'gnarled_staff',
    icon: '🔥'
  },

  necromancer: {
    name: 'Necromancer',
    archetype: 'Caster',
    role: 'DPS Caster',
    manaStat: 'INT',
    hpPerSTA: 2,
    primaryStats: ['INT', 'WIS'],
    baseStats: { STR: 65, DEX: 75, AGI: 75, STA: 70, WIS: 80, INT: 115, CHA: 65 },
    description: 'Necromancers are dark scholars who study the boundary between life and death, wielding the forbidden magic of mortality itself. Shunned by most societies and feared by the living, Necromancers drain life energy from their foes, reanimate corpses as undead servants, and drain the life force of enemies with devastating damage-over-time spells. Their ability to Feign Death rivals the Monk\'s, allowing them to escape dangerous situations by collapsing and appearing dead. The infamous Lich form allows powerful Necromancers to sustain themselves on necrotic energy alone. Feared and distrusted, Necromancers bring incredible sustained damage, powerful pets, and mana-sustaining abilities that make them sought after despite their dark reputation.',
    abilities: [
      { name: 'Lifetap', description: 'Drain the very life essence from your target, dealing necrotic damage while simultaneously channeling a portion of that stolen energy to restore your own hit points.', manaCost: 50, castTime: 2500, recastTime: 8000, effect: { type: 'lifetap', value: 100 } },
      { name: 'Feign Death', description: 'Collapse and perfectly simulate death, causing enemies to believe you have fallen and break off their attacks, allowing you to safely reset an encounter.', manaCost: 0, castTime: 0, recastTime: 15000, effect: { type: 'feign_death', value: 1 } },
      { name: 'Dark Pact', description: 'Sacrifice a portion of your own hit points to instantly replenish a significant amount of mana, allowing you to continue casting at the cost of your health.', manaCost: 0, castTime: 2000, recastTime: 30000, effect: { type: 'hp_to_mana', value: 100 } },
      { name: 'Vampiric Curse', description: 'Afflict your target with a vampiric curse that drains their life energy over time, continuously siphoning health and restoring some to you with each tick.', manaCost: 80, castTime: 3000, recastTime: 15000, effect: { type: 'lifetap_dot', value: 30 } },
      { name: 'Animate Dead', description: 'Weave necromantic energies into a nearby corpse to reanimate it as an undead servant under your command, gaining a skeletal companion to fight for you.', manaCost: 120, castTime: 8000, recastTime: 30000, effect: { type: 'summon_undead', value: 1 } },
      { name: 'Poison Bolt', description: 'Launch a bolt of virulent necromantic poison that deals immediate damage and leaves a lingering toxic effect that continues to damage the target.', manaCost: 65, castTime: 2000, recastTime: 6000, effect: { type: 'damage_dot', value: 45 } }
    ],
    startingWeapon: 'gnarled_staff',
    icon: '💀'
  },

  enchanter: {
    name: 'Enchanter',
    archetype: 'Caster',
    role: 'Support Caster',
    manaStat: 'INT',
    hpPerSTA: 2,
    primaryStats: ['INT', 'CHA', 'WIS'],
    baseStats: { STR: 60, DEX: 75, AGI: 75, STA: 70, WIS: 80, INT: 120, CHA: 105 },
    description: 'Enchanters are masters of the mind and illusion, wielding magic that affects perception, thought, and the flow of mana itself. While they deal little direct damage, Enchanters are universally considered one of the most powerful and sought-after classes in the game due to their extraordinary utility. Their Mesmerize and Charm spells can take multiple enemies completely out of a fight, their Clarity line restores mana to casters allowing them to sustain longer encounters, and their Haste spell dramatically increases ally melee speed. Enchanters can also assume the appearance of other races and creatures with illusion magic, and their Tash debuff reduces enemy magic resistance, making all spells more effective. A skilled Enchanter transforms what would be an impossible fight into a manageable one.',
    abilities: [
      { name: 'Mesmerize', description: 'Weave an irresistible mental enchantment around your target\'s mind, trapping them in a compelling trance that prevents all action until the spell breaks.', manaCost: 45, castTime: 2500, recastTime: 8000, effect: { type: 'mez', duration: 30000 } },
      { name: 'Clarity', description: 'Suffuse an ally\'s mind with crystalline clarity, dramatically increasing their mana regeneration rate for an extended duration and enabling sustained casting.', manaCost: 60, castTime: 3000, recastTime: 10000, effect: { type: 'buff', stat: 'mana_regen', value: 10 } },
      { name: 'Haste', description: 'Infuse an ally with accelerated magical energy that dramatically increases their melee attack speed, allowing them to strike far more rapidly in combat.', manaCost: 75, castTime: 3000, recastTime: 15000, effect: { type: 'buff', stat: 'attack_speed', value: 40 } },
      { name: 'Tash', description: 'Afflict your target with a weakening enchantment that strips away their magical resistances, leaving them far more vulnerable to all subsequent spells.', manaCost: 50, castTime: 2000, recastTime: 10000, effect: { type: 'debuff', stat: 'magic_resist', value: 30 } },
      { name: 'Charm', description: 'Dominate the target\'s mind with overwhelming enchantment magic, compelling them to follow your will and fight as your ally until the charm breaks.', manaCost: 100, castTime: 3000, recastTime: 20000, effect: { type: 'charm', duration: 60000 } },
      { name: 'Rune', description: 'Weave a runic magical barrier around an ally that absorbs a fixed amount of incoming damage before shattering, acting as a protective shield.', manaCost: 80, castTime: 2500, recastTime: 10000, effect: { type: 'absorb_shield', value: 200 } }
    ],
    startingWeapon: 'gnarled_staff',
    icon: '✨'
  },

  cleric: {
    name: 'Cleric',
    archetype: 'Priest',
    role: 'Healer',
    manaStat: 'WIS',
    hpPerSTA: 3,
    primaryStats: ['WIS', 'STA', 'STR'],
    baseStats: { STR: 75, DEX: 65, AGI: 70, STA: 80, WIS: 115, INT: 75, CHA: 80 },
    description: 'Clerics are the chosen servants of Norrath\'s deities, granted divine healing power in exchange for their absolute devotion and faith. They are indisputably the finest healers in the game, possessing the Complete Heal spell — a massive single-target heal that can fully restore a tank\'s health — as well as powerful group heals, wards, and resurrection spells. Clerics can raise fallen companions back to life with a portion of their experience intact, an ability of incalculable value in dangerous dungeons. While not primarily combat-oriented, Clerics wear plate armor and wield blunt weapons with reasonable competence, and their divine magic is especially devastating against undead. No group in Norrath is truly complete without a skilled Cleric.',
    abilities: [
      { name: 'Healing', description: 'Call upon your deity\'s grace to channel healing light into a wounded ally, restoring a significant number of hit points through divine intervention.', manaCost: 40, castTime: 3000, recastTime: 4000, effect: { type: 'heal', value: 120 } },
      { name: 'Complete Heal', description: 'Invoke the most powerful healing prayer in the Cleric\'s arsenal, channeling an extended burst of divine energy that fully restores the target\'s hit points.', manaCost: 400, castTime: 10000, recastTime: 6000, effect: { type: 'heal', value: 2000 } },
      { name: 'Undead Ward', description: 'Invoke sacred power to repel undead creatures with holy force, sending them fleeing in terror from the divine light of your deity\'s wrath.', manaCost: 30, castTime: 2000, recastTime: 15000, effect: { type: 'turn_undead', value: 100 } },
      { name: 'Divine Aura', description: 'Surround yourself with an impenetrable aura of divine protection that renders you completely immune to all damage for a brief period.', manaCost: 0, castTime: 0, recastTime: 300000, effect: { type: 'invulnerability', duration: 18000 } },
      { name: 'Resurrection', description: 'Perform the sacred rite of resurrection on a fallen ally, restoring them to life and returning 96% of their lost experience from the death.', manaCost: 300, castTime: 10000, recastTime: 60000, effect: { type: 'resurrect', value: 96 } },
      { name: "Symbol of Naltron", description: "Inscribe a sacred divine symbol upon an ally that significantly increases their maximum hit points and provides regeneration for an extended duration.", manaCost: 100, castTime: 4000, recastTime: 15000, effect: { type: 'buff', stat: 'max_hp', value: 200 } }
    ],
    startingWeapon: 'crude_mace',
    icon: '⚕️'
  },

  druid: {
    name: 'Druid',
    archetype: 'Priest',
    role: 'Healer/DPS',
    manaStat: 'WIS',
    hpPerSTA: 3,
    primaryStats: ['WIS', 'INT'],
    baseStats: { STR: 70, DEX: 75, AGI: 75, STA: 75, WIS: 115, INT: 80, CHA: 75 },
    description: 'Druids are servants of nature who draw power from the living world around them, channeling the primal forces of the natural world into healing and destructive magic. Less focused on pure healing than Clerics, Druids compensate with significantly more offensive capability, including powerful damage over time spells, direct damage nukes, and snare magic to pin fleeing enemies. Druids possess the Spirit of Wolf and Teleport spells that allow rapid travel across Norrath, making them invaluable for group movement. Their nature-based healing and regeneration spells keep allies alive while their damage spells ensure enemies do not escape. Patient stewards of the wild, Druids represent the balance between restoration and destruction found in nature itself.',
    abilities: [
      { name: 'Healing', description: 'Channel the restorative power of nature through your hands, drawing on the life force of the living world to mend the wounds of an injured ally.', manaCost: 40, castTime: 3000, recastTime: 4000, effect: { type: 'heal', value: 100 } },
      { name: 'Snare', description: 'Call upon the tangling roots and vines of the earth to grasp your target\'s legs, greatly reducing their movement speed and preventing escape.', manaCost: 30, castTime: 2500, recastTime: 8000, effect: { type: 'snare', value: 50 } },
      { name: "Nature's Boon", description: "Invoke a boon of natural regeneration on an ally, accelerating their body's own healing processes to continuously restore hit points over time.", manaCost: 50, castTime: 3000, recastTime: 10000, effect: { type: 'buff', stat: 'hp_regen', value: 10 } },
      { name: 'Spirit of Wolf', description: 'Call upon the spirit of the wolf to grant yourself and nearby allies its legendary speed, dramatically increasing movement rate for an extended duration.', manaCost: 50, castTime: 3000, recastTime: 15000, effect: { type: 'buff', stat: 'speed', value: 40 } },
      { name: 'Entangle', description: 'Cause thick roots and vines to erupt from the ground and bind your target completely, rooting them in place and preventing all movement.', manaCost: 45, castTime: 2500, recastTime: 10000, effect: { type: 'root', duration: 30000 } },
      { name: 'Immolate', description: 'Surround your target in a swirling column of natural flame, dealing fire damage and leaving a burning damage-over-time effect from the scorching heat.', manaCost: 80, castTime: 2500, recastTime: 6000, effect: { type: 'damage_dot', value: 55 } },
      { name: 'Reincarnation', description: 'Returns a fallen ally to life through nature magic, restoring them with a portion of their hit points.', manaCost: 70, castTime: 7000, recastTime: 75000, effect: { type: 'resurrect' } },
    ],
    startingWeapon: 'crude_staff',
    icon: '🌿'
  },

  shaman: {
    name: 'Shaman',
    archetype: 'Priest',
    role: 'Healer/Support',
    manaStat: 'WIS',
    hpPerSTA: 3,
    primaryStats: ['WIS', 'STR', 'STA'],
    baseStats: { STR: 95, DEX: 75, AGI: 75, STA: 95, WIS: 110, INT: 70, CHA: 75 },
    description: 'Shamans are tribal spirit-callers who commune with the ancestors and spirit world to borrow power for the living. Physically among the sturdier priest classes, Shamans can take and deal more punishment than Clerics or Druids while also possessing a unique and powerful toolkit. Their Slow spell is one of the most impactful abilities in the entire game, dramatically reducing an enemy\'s attack speed and turning a dangerous boss into a manageable threat. Shamans also excel at buffing their allies with stat-enhancing spells and their Torpor spell provides extraordinary regeneration. The infamous Cannibalize ability lets them sacrifice their own hit points to restore mana, allowing near-infinite spellcasting. Shamans are the ultimate force multipliers, making everyone around them significantly more effective.',
    abilities: [
      { name: 'Slow', description: 'Invoke a spirit curse on your enemy that dramatically reduces their attack speed, transforming a fearsome opponent into a far more manageable threat.', manaCost: 70, castTime: 3000, recastTime: 10000, effect: { type: 'slow', value: 50 } },
      { name: 'Malise', description: 'Afflict your target with a weakening malison that reduces their magical resistances, making them far more susceptible to all subsequent spell effects.', manaCost: 60, castTime: 2500, recastTime: 10000, effect: { type: 'debuff', stat: 'magic_resist', value: 25 } },
      { name: 'Torpor', description: 'Cast the legendary Torpor spell, inducing a deep trance on an ally that dramatically accelerates their natural healing to an extraordinary degree.', manaCost: 350, castTime: 5000, recastTime: 30000, effect: { type: 'buff', stat: 'hp_regen', value: 60 } },
      { name: 'Spirit of the Wolf', description: 'Call upon the wolf spirit revered by shamanic tradition to bless nearby allies with the wolf\'s legendary speed and endurance.', manaCost: 50, castTime: 3000, recastTime: 15000, effect: { type: 'buff', stat: 'speed', value: 40 } },
      { name: 'Cannibalize', description: 'Sacrifice a portion of your own life energy, converting hit points directly into mana through a painful spiritual ritual that sustains your spellcasting.', manaCost: 0, castTime: 2000, recastTime: 10000, effect: { type: 'mana_from_hp', value: 100 } },
      { name: 'Healing', description: 'Channel the healing power of the spirit world through your body to mend the wounds of an injured ally, drawing on ancestor spirits to restore health.', manaCost: 40, castTime: 3000, recastTime: 4000, effect: { type: 'heal', value: 110 } }
    ],
    startingWeapon: 'crude_staff',
    icon: '🪄'
  }
};

if (typeof module !== 'undefined') module.exports = { CLASSES };
