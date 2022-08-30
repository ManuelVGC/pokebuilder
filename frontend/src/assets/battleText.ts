/**
 * Textos que aparecerán en el chat durante las batallas. El correspondiente texto se elegirá dependiendo de qué mensaje llegue desde Pokémon Showdown.
 */

export const BattleText = {
    startBattle: "Battle started between [TRAINER1] and [TRAINER2]!",
    winBattle: "[TRAINER] won the battle!",
    tieBattle: "The battle end with a tie!",

    switchIn: "[TRAINER] sent out [POKEMON]!",
    switchOut: "[TRAINER] withdrew [POKEMON]!",
    drag: "[POKEMON] was dragged out!",
    faint: "[POKEMON] fainted!",

    abilityActivation: "[[POKEMON]'s [ABILITY]]",

    move: "[POKEMON] used [MOVE]!",
    cant: "[POKEMON] can't use [MOVE]!",
    cantNoMove: "[POKEMON] can't move!",
    fail: "But it failed!",

    pokemonTransformed: "[POKEMON] transformed!",
    typeChange: "[POKEMON]'s type changed to [TYPE]!",

    changeAbility: "[POKEMON] change it's [ABILITY] with it's rival!",
    addItem: "[POKEMON] obtained one [ITEM].", // Trick, Switcheroo
    takeItem: "[POKEMON] stole [SOURCE]'s [ITEM]!", // Thief, Covet, Magician, Pickpocket
    eatItem: "[POKEMON] ate its [ITEM]!",

    damagePercentage: "[POKEMON] lost [PERCENTAGE] of its health!",
    damageFromPartialTrapping: "[POKEMON] was hurt by [MOVE] and lost [PERCENTAGE] of its health!",
    heal: "[POKEMON] restored [PERCENTAGE] of its health!",
    healFailed: "[POKEMON]'s HP is full!",
    itemHeal: "[POKEMON] restored [PERCENTAGE] of HP using its [ITEM]!",

    boost: "[POKEMON]'s [STAT] rose!",
    boost2: "[POKEMON]'s [STAT] rose sharply!",
    boost0: "[POKEMON]'s [STAT] won't go any higher!",
    boost6: "[POKEMON] maximized its [STAT]!",

    unboost: "[POKEMON]'s [STAT] fell!",
    unboost2: "[POKEMON]'s [STAT] sharply fell!",
    unboost6: "[POKEMON] minimized its [STAT]!",
    unboost0: "[POKEMON]'s [STAT] won't go any lower!",

    copyBoost: "[POKEMON] copied [TARGET]'s stat changes!",
    clearAllBoost: "All stat changes were eliminated!",

    superEffective: "It's super effective!",
    resisted: "It's not very effective...",
    crit: "A critical hit!",
    immune: "It doesn't affect [POKEMON]...",
    miss: "[POKEMON] avoided the attack!",

    noTarget: "But there was no target...",
    hitCount: "[POKEMON] was hit [NUMBER] times!",
    hitCountSingular: "[POKEMON] was hit [NUMBER] time!",

    stats: {
        hp: {
            statName: "HP",
        },
        atk: {
            statName: "attack",
        },
        def: {
            statName: "defense",
        },
        spa: {
            statName: "special attack",
        },
        spd: {
            statName: "special defense",
        },
        spe: {
            statName: "speed",
        },
        acc: {
            statName: "accuracy",
        },
        eva: {
            statName: "evasiveness",
        },
    },

    brn: {
        start: "[POKEMON] was burned!",
        alreadyStarted: "[POKEMON] already has a burn.",
        end: "[POKEMON]'s burn was healed.",
        damage: "[POKEMON] was hurt by its burn and lost [PERCENTAGE] of its health!",
    },
    frz: {
        start: "[POKEMON] was frozen solid!",
        alreadyStarted: "[POKEMON] is already frozen solid!",
        end: "[POKEMON] thawed out!",
        cant: "[POKEMON] is frozen solid!",
    },
    par: {
        start: "[POKEMON] is paralyzed! It may be unable to move!",
        alreadyStarted: "[POKEMON] is already paralyzed.",
        end: "[POKEMON] was cured of paralysis.",
        cant: "[POKEMON] is paralyzed! It can't move!",
    },
    psn: {
        start: "[POKEMON] was poisoned!",
        alreadyStarted: "[POKEMON] is already poisoned.",
        end: "[POKEMON] was cured of its poisoning.",
        damage: "[POKEMON] was hurt by poison and lost [PERCENTAGE] of its health!",
    },
    tox: {
        start: "[POKEMON] was badly poisoned!",
        end: "[POKEMON] was cured of its poisoning.",
    },
    slp: {
        start: "[POKEMON] fell asleep!",
        alreadyStarted: "[POKEMON] is already asleep!",
        end: "[POKEMON] woke up!",
        cant: "[POKEMON] is fast asleep.",
    },

    teamcured: "All Pokémon in [POKEMON]'s team have been cured of its condition!",

    confusion: {
        start: "[POKEMON] became confused!",
        startFromFatigue: "[POKEMON] became confused due to fatigue!",
        end: "[POKEMON] snapped out of its confusion!",
        activate: "[POKEMON] is confused!",
        damage: "[POKEMON] hurt itself in its confusion and lost [PERCENTAGE] of its health!",
    },
    flinch: {
        cant: "[POKEMON] flinched and couldn't move!",
    },
    nopp: {
        cant: "[POKEMON] used [MOVE]!\n  But there was no PP left for the move!",
    },
    recharge: {
        cant: "[POKEMON] must recharge!",
        nextTurn: "[POKEMON] must recharge the next turn!"
    },
    recoil: {
        damage: "[POKEMON] is damaged by the recoil and loses [PERCENTAGE] of its health!",
    },
    unboostFail: {
        fail: "[POKEMON]'s stats were not lowered!",
    },
    struggle: {
        activate: "[POKEMON] has no moves left!",
    },
    trapped: {
        start: "[POKEMON] can no longer escape!",
    },


    sandstorm: {
        start: "A sandstorm kicked up!",
        end: "The sandstorm subsided.",
        upkeep: "(The sandstorm is raging.)",
        damage: "[POKEMON] is buffeted by the sandstorm and loses [PERCENTAGE] of its health!",
    },
    sunnyday: {
        start: "The sunlight turned harsh!",
        end: "The sunlight faded.",
        upkeep: "(The sunlight is strong!)",
    },
    raindance: {
        start: "It started to rain!",
        end: "The rain stopped.",
        upkeep: "(Rain continues to fall!)",
    },
    hail: {
        start: "It started to hail!",
        end: "The hail stopped.",
        upkeep: "(The hail is crashing down.)",
        damage: "[POKEMON] is buffeted by the hail and loses [PERCENTAGE] of its health!",
    },

    mudsport: {
        start: "Electricity's power was weakened!",
    },
    watersport: {
        start: "Fire's power was weakened!",
    },

    aromatherapy: {
        activate: "A soothing aroma wafted through the area!",
    },
    attract: {
        start: "[POKEMON] fell in love!",
        //startFromItem: "[POKEMON] fell in love from the [ITEM]!",
        end: "[POKEMON] got over its infatuation!",
        //endFromItem: "[POKEMON] cured its infatuation using its [ITEM]!",
        activate: "[POKEMON] is in love with [TARGET]!",
        cant: "[POKEMON] is immobilized by love!",
    },
    bide: {
        start: "[POKEMON] is storing energy!",
        end: "[POKEMON] unleashed its energy!",
        activate: "[POKEMON] is storing energy!",
    },
    bind: {
        start: "[POKEMON] was squeezed by [SOURCE]!",
    },
    bounce: {
        prepare: "[POKEMON] sprang up!",
    },
    charge: {
        start: "[POKEMON] began charging power!",
    },
    clamp: {
        start: "[SOURCE] clamped down on [POKEMON]!",
    },
    curse: {
        start: "[SOURCE] cut its own HP and put a curse on [POKEMON]!",
        damage: "[POKEMON] is afflicted by the curse and loses [PERCENTAGE] of its health!",
    },
    destinybond: {
        start: "[POKEMON] is hoping to take its attacker down with it!",
        activate: "[POKEMON] took its attacker down with it!",
    },
    dig: {
        prepare: "[POKEMON] burrowed its way under the ground!",
    },
    disable: {
        start: "[POKEMON]'s [MOVE] was disabled!",
        end: "[POKEMON]'s move is no longer disabled!",
    },
    dive: {
        prepare: "[POKEMON] hid underwater!",
    },
    doomdesire: {
        start: "[POKEMON] chose Doom Desire as its destiny!",
        activate: "[TARGET] took the Doom Desire attack!",
    },
    encore: {
        start: "[POKEMON] received an encore!",
        end: "[POKEMON]'s encore ended!",
    },
    endure: {
        start: "[POKEMON] braced itself!",
        activate: "[POKEMON] endured the hit!",
    },
    firespin: {
        start: "[POKEMON] became trapped in the fiery vortex!",
    },
    fly: {
        prepare: "[POKEMON] flew up high!",
    },
    focusenergy: {
        start: "[POKEMON] is getting pumped!",
    },
    focuspunch: {
        start: "[POKEMON] is tightening its focus!",
        cant: "[POKEMON] lost its focus and couldn't move!",
    },
    foresight: {
        start: "[POKEMON] was identified!",
    },
    futuresight: {
        start: "[POKEMON] foresaw an attack!",
        activate: "[TARGET] took the Future Sight attack!",
    },
    grudge: {
        activate: "[POKEMON]'s [MOVE] lost all of its PP due to the grudge!",
        start: "[POKEMON] wants its target to bear a grudge!",
    },
    healbell: {
        activate: "A bell chimed!",
    },
    imprison: {
        start: "[POKEMON] sealed any moves its target shares with it!",
        cant: "[POKEMON] can't use its sealed [MOVE]!",
    },
    ingrain: {
        start: "[POKEMON] planted its roots!",
        block: "[POKEMON] anchored itself with its roots!",
        heal: "[POKEMON] absorbed nutrients with its roots and restored [PERCENTAGE] of its health!",
    },
    knockoff: {
        removeItem: "[POKEMON]'s [ITEM] was knocked off!",
    },
    leechseed: {
        start: "[POKEMON] was seeded!",
        end: "[POKEMON] was freed from Leech Seed!",
        damage: "[POKEMON]'s health is sapped by Leech Seed, losing [PERCENTAGE] of its health!",
    },
    lightscreen: {
        start: "Light Screen made [TEAM] stronger against special moves!",
        end: "[TEAM]'s Light Screen wore off!",
    },
    lockon: {
        start: "[SOURCE] took aim at [POKEMON]!",
    },
    magiccoat: {
        move: "[POKEMON] bounced the [MOVE] back!",
    },
    magnitude: {
        activate: "Magnitude [NUMBER]!",
    },
    metronome: {
        move: "Waggling a finger let it use [MOVE]!",
    },
    mimic: {
        start: "[POKEMON] learned [MOVE]!",
    },
    mist: {
        start: "Mist shrouded [TEAM]!",
        end: "[TEAM] is no longer protected by mist!",
        block: "[POKEMON] is protected by the mist!",
    },
    naturepower: {
        move: "Nature Power turned into [MOVE]!",
    },
    nightmare: {
        start: "[POKEMON] began having a nightmare!",
        damage: "[POKEMON] is locked in a nightmare and loses [PERCENTAGE] of its health!",
    },
    payday: {
        activate: "Coins were scattered everywhere!",
    },
    perishsong: {
        start: "All Pok\u00E9mon that heard the song will faint in three turns!",
        activate: "[POKEMON]'s perish count fell to [NUMBER].",
    },
    protect: {
        start: "[POKEMON] protected itself!",
        block: "[POKEMON] protected itself!",
    },
    pursuit: {
        activate: "[TARGET] is being withdrawn...",
    },
    razorwind: {
        prepare: "[POKEMON] whipped up a whirlwind!",
    },
    recycle: {
        addItem: "[POKEMON] found one [ITEM]!",
    },
    reflect: {
        start: "Reflect made [TEAM] stronger against physical moves!",
        end: "[TEAM]'s Reflect wore off!",
        //startGen1: "[POKEMON] gained armor!", // gen 1
    },
    roleplay: {
        changeAbility: "[POKEMON] copied [SOURCE]'s [ABILITY] ability!",
    },
    safeguard: {
        start: "A mystical veil cloaked [TEAM]!",
        end: "[TEAM] is no longer protected by Safeguard!",
        block: "[POKEMON] is protected by Safeguard!",
    },
    sandtomb: {
        start: "[POKEMON] became trapped by the quicksand!",
    },
    skillswap: {
        activate: "[POKEMON] swapped Abilities with its target!",
    },
    skullbash: {
        prepare: "[POKEMON] tucked in its head!",
    },
    skyattack: {
        prepare: "[POKEMON] became cloaked in a harsh light!",
    },
    snatch: {
        start: "[POKEMON] waits for a target to make a move!",
        activate: "[POKEMON] snatched [TARGET]'s move!",
    },
    solarbeam: {
        prepare: "[POKEMON] absorbed light!",
    },
    spikes: {
        start: "Spikes were scattered on the ground all around [TEAM]!",
        end: "The spikes disappeared from the ground around [TEAM]!",
        damage: "[POKEMON] is hurt by the spikes and loses [PERCENTAGE] of its health!",
    },
    spite: {
        activate: "It reduced the PP of [TARGET]'s [MOVE] by [NUMBER]!",
    },
    splash: {
        activate: "But nothing happened!",
    },
    stockpile: {
        start: "[POKEMON] stockpiled [NUMBER]!",
        end: "[POKEMON]'s stockpiled effect wore off!",
    },
    substitute: {
        start: "[POKEMON] put in a substitute!",
        alreadyStarted: "[POKEMON] already has a substitute!",
        end: "[POKEMON]'s substitute faded!",
        fail: "[POKEMON] does not have enough HP left to make a substitute!",
        activate: "The substitute took damage for [POKEMON]!",
    },
    taunt: {
        start: "[POKEMON] fell for the taunt!",
        end: "[POKEMON]'s taunt wore off!",
        cant: "[POKEMON] can't use [MOVE] after the taunt!",
    },
    torment: {
        start: "[POKEMON] was subjected to torment!",
        //end: "[POKEMON]'s torment wore off!",
    },
    transform: {
        transform: "[POKEMON] transformed into [SPECIES]!",
    },
    trick: {
        activate: "[POKEMON] switched items with its target!",
    },
    uproar: {
        start: "[POKEMON] caused an uproar!",
        end: "[POKEMON] calmed down.",
        upkeep: "[POKEMON] is making an uproar!",
        block: "[POKEMON] kept awake by the uproar!",
    },
    whirlpool: {
        start: "[POKEMON] became trapped in the vortex!",
    },
    wish: {
        heal: "[POKEMON] restored [PERCENTAGE] of its health thanks to [WISHER]'s wish!",
    },
    wrap: {
        start: "[POKEMON] was wrapped by [SOURCE]!",
    },
    yawn: {
        start: "[POKEMON] grew drowsy!",
    },


    damp: {
        block: "[POKEMON] block the move [MOVE]!",
    },
    flashfire: {
        start: "The power of [POKEMON]'s Fire-type moves rose!",
    },
    liquidooze: {
        damage: "[POKEMON] sucked up the liquid ooze and lost [PERCENTAGE] of its health!",
    },
    naturalcure: {
        activate: "[POKEMON] is cured by its Natural Cure!",
    },
    owntempo: {
        block: "[POKEMON] doesn't become confused!",
    },
    pressure: {
        start: "[POKEMON] is exerting its pressure!",
    },
    roughskin: {
        damage: "[POKEMON] was hurt and lost [PERCENTAGE] of its health!",
    },
    stickyhold: {
        block: "[POKEMON]'s item cannot be removed!",
    },
    suctioncups: {
        block: "[POKEMON] anchors itself!",
    },
    trace: {
        changeAbility: "[POKEMON] traced [SOURCE]'s [ABILITY]!",
    },
    truant: {
        cant: "[POKEMON] is loafing around!",
    },


    focusband: {
        activate: "[POKEMON] hung on using its Focus Band!",
    },
    leppaberry: {
        activate: "[POKEMON] restored PP to its [MOVE] move using Leppa Berry!",
    },
    whiteherb: {
        end: "[POKEMON] returned its stats to normal using its White Herb!",
    }
};
