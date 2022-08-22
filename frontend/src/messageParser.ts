/**
 * Archivo que se encarga de parsear e interpretar todos los mensajes que llegan desde Pokémon Showdown, tanto fuera de las batallas como dentro de ellas.
 *
 * Los tipos de mensajes que me llegan de Showdown son los siguientes:
 * https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md
 */

import store from "./store";
import router from "./router";
import {BattleUser} from "./interfaces/BattleUser";
import {IBattlePokemon} from "./interfaces/BattlePokemon";
import {BattleText} from "./assets/battleText";
import {IMove} from "./interfaces/Move";
import {FieldConditions} from "./interfaces/FieldConditions";
import {SideConditions} from "./interfaces/SideConditions";
import {getMoveData} from "@/services/showdownLibraryService";

const battleUser = new BattleUser();
const battleRival = new BattleUser();

const fieldConditions = new FieldConditions();
const userSideConditions = new SideConditions();
const rivalSideConditions = new SideConditions();

/** Variables auxiliares que voy utilizando a lo largo del código. */
let pokemonName: string;
let playerID: string;
let move: string;

let lastMove = '';
let userLastPokemonActive = '';
let rivalLastPokemonActive = '';

export const messageParser = (messageData: string) => {
    console.log('El data es: ' + messageData);
    let messages: string[];
    let parts : string[];
    // eslint-disable-next-line prefer-const
    parts = messageData.substring(1).split('|');

    /** Manejo de mensajes globales, en caso de no tratarse de un mensaje global, se tratará de un mensaje propio de una batalla. */
    switch(parts[0]){
        case 'challstr': { /** Mensaje que nos da el challstr, necesario para el logeo en Pokémon Showdown. */
            store.commit('SET_CHALLSTR', parts[1] + '|' + (parts[2]));
            break;
        }
        case 'updateuser':
            break;
        case 'updatesearch': { /** Mensaje que indica el estado de búsqueda de una batalla. */
            const searchData = JSON.parse(parts[1]);
            if (searchData.games != null) { //cuando se encuentra una partida pasamos a Battle.vue
                const battleInfo = Object.keys(searchData.games)[0];
                console.log('La battle info es: ');
                console.log(battleInfo);
                const battleID = battleInfo.split('-')[2];
                store.commit('SET_BATTLEINFO', battleInfo);

                store.commit('SET_BATTLEUSER', battleUser);
                store.commit('SET_BATTLERIVAL', battleRival);

                store.commit('SET_USERSIDECONDITIONS', userSideConditions);
                store.commit('SET_RIVALSIDECONDITIONS', rivalSideConditions);

                store.commit('SET_FIELDCONDITIONS', fieldConditions);

                store.commit('SET_BATTLEFINISHED', false);

                router.push('/battle/' + battleID);
            }
            break;
        }
        /** Mensajes de batalla. */
        default: //divido el mensaje por \n para guardar todos los mensajes individuales que se mandan dentro de este
            messages = messageData.substring(1).split('\n');
            battleMessagesParser(messages);
    }
}

/** Manejo de mensajes de batalla. */
const battleMessagesParser = async (messages : string[]) => {
    let message: string[];

    if (messages[0].startsWith(store.state.battleInfo) && messages[0].trim() != store.state.battleInfo) { /** A veces showdown añade una subcadena a la info de batalla original, así que lo que hago aquí es cambiarla para que funcione correctamente la batalla. */
        store.commit('SET_BATTLEINFO', messages[0].trim());
    }

    for (let i = 0; i < messages.length; i++) {
        message = messages[i].substring(1).split('|'); //divido cada mensaje por '|' para tener todos sus campos en el array
        switch (message[0]){ //comprobamos el primer campo de cada mensaje para ver qué nos indica
            /** Mensajes que llegan al inicio de la batalla. */

            case 'player': { /** Llega un mensaje del tipo |player|PLAYER|USERNAME|AVATAR|RATING, nos da la información básica de cada usuario de la batalla. */
                if (message[2] === store.state.user.username) {
                    battleUser.id = message[1];
                    battleUser.username = message[2];
                    battleUser.avatar = message[3];
                    //store.commit('SET_BATTLEUSER', battleUser);
                } else {
                    battleRival.id = message[1];
                    battleRival.username = message[2];
                    battleRival.avatar = message[3];
                    //store.commit('SET_BATTLERIVAL', battleRival);
                }
                break;
            }
            case 'rule': { /** Llega un mensaje del tipo |rule|RULE: DESCRIPTION. */
                const rule = message[1].trim();
                store.commit('ADD_MESSAGE', rule);
                break;
            }

            /** Mensajes que tienen que ver con el progreso de la batalla. */

            case 'request': { /** Llega un mensaje del tipo |request|REQUEST, donde REQUEST es un JSON con la información de mi usuario. */
                if (message[1] != '' && message[1] != 'null') {

                    const request = JSON.parse(message[1]);

                    store.commit('SET_CHOISESENT', false);
                    store.commit('SET_POKEMONTRAPPED', false);

                    if (Object.keys(request)[0] != 'forceSwitch') {
                        store.commit('SET_FORCESWITCH', false);
                        const activeData = request.active[0];

                        store.commit('SET_FIGHTFLAG', false);
                        store.commit('SET_POKEMONFLAG', false);

                        for (let i = 0; i < activeData.moves.length; i++) {
                            activeData.moves[i].moveType = await getMoveType(activeData.moves[i].move);
                        }

                        store.commit('SET_ACTIVEMOVES', activeData.moves);

                        setPokemonToSwitchIn(message[1]);

                        if (store.state.battleUser.team.length === 0) {
                            battleUser.team = request.side.pokemon;
                            //store.commit('SET_BATTLEUSER', battleUser);
                        } else {
                            setActivePokemon(message[1]);
                            updatePPsUserTeam(message[1]);
                        }
                    } else {
                        store.commit('SET_FIGHTFLAG', false);
                        store.commit('SET_POKEMONFLAG', true);
                        store.commit('SET_FORCESWITCH', true);
                    }
                }
                break;
            }
            case 'inactive': case 'inactiveoff': { /** Llega un mensaje del tipo |inactive|MESSAGE e |inactiveoff|MESSAGE. */
                const timerMessage = message[1].trim();

                store.commit('ADD_MESSAGE', timerMessage);

                if (message[0] === 'inactive') {
                    if (message[1].startsWith('Time left:')) {
                        const timeLeft = parseInt(message[1].split(' ')[2]);
                        store.commit('SET_TIMERRESET', timeLeft);
                    }
                } else if (message[0] === 'inactiveoff') {
                    store.commit('SET_TIMERRESET', -1);
                }
                break;
            }
            case 'turn': { /** Turno en el que se encuentra la batalla. Es un mensaje del tipo |turn|NUMBER. */
                store.commit('ADD_MESSAGE', 'Turn ' + message[1]);
                showUserDetails();
                showFieldConditionsDetails();
                showSideConditionsDetails();
                break;
            }
            case 'win': { /** Ganador de la batalla. Es un mensaje del tipo |win|USER. */
                const trainer = message[1].trim();

                store.commit('ADD_MESSAGE', BattleText.winBattle.replace('[TRAINER]', trainer));
                store.commit('SET_BATTLEFINISHED', true);
                break;
            }
            case 'tie': { /** La batalla termina en empate. */
                store.commit('ADD_MESSAGE', BattleText.tieBattle);
                break;
            }
            case 'start': { /** Comienzo de la batalla. */
                store.commit('ADD_MESSAGE', BattleText.startBattle.replace('[TRAINER1]', battleUser.username).replace('[TRAINER2]', battleRival.username));
                break;
            }

            case 'c': { /** Mensajes del chat */
                const user = message[1].trim();
                const chatMessage = message[2].trim();

                store.commit('ADD_MESSAGE', user + ': ' + chatMessage);
                break;
            }

            case 'error': { /** Errores */
                const errorMessage = message[1].trim();

                store.commit('ADD_MESSAGE', errorMessage);
                store.commit('SET_POKEMONTRAPPED', true);
                store.commit('SET_CHOISESENT', false);
                store.commit('SET_FIGHTFLAG', false);
                store.commit('SET_POKEMONFLAG', false);
                break;
            }

            /** Mensajes de acciones dentro de una batalla */
            /** Acciones mayores */

            case  'move': { /** Llega un mensaje del tipo |move|POKEMON|MOVE|TARGET. El Pokémon POKEMON ataca a TARGET con MOVE. */
                const pokemonIdent = message[1].trim();
                pokemonName = pokemonIdent.split(' ')[1].trim();
                playerID = pokemonIdent.substring(0,2);
                const move = message[2].trim();

                if (move === 'Struggle') { /** El Pokémon usa este movimiento cuando no le quedan más PP en el resto de movimientos, así que no se añade al pool de movimientos del Pokémon. */
                    addMessageToChat(BattleText.struggle.activate.replace('[POKEMON]', pokemonName), playerID);
                } else {
                    if (playerID === battleRival.id) {
                        updateRivalMoves(pokemonIdent, move);
                    }
                }

                lastMove = move;

                if (message[4] != null) {
                    const fromEffect = message[4].trim();
                    switch (fromEffect) {
                        case '[from]Metronome': {
                            store.commit('ADD_MESSAGE', BattleText.metronome.move.replace('[MOVE]', move));
                            break;
                        }
                        case '[from]Magic Coat': {
                            addMessageToChat(BattleText.magiccoat.move.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                            break;
                        }
                        case '[from]Nature Power': {
                            store.commit('ADD_MESSAGE', BattleText.naturepower.move.replace('[MOVE]', move));
                            break;
                        }
                        default: {
                            addMessageToChat(BattleText.move.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                            break;
                        }
                    }
                } else {
                    addMessageToChat(BattleText.move.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                }

                switch (move) {
                    case 'Perish Song': {
                        store.commit('ADD_MESSAGE', BattleText.perishsong.start);
                        break;
                    }
                    case 'Aromatherapy': {
                        store.commit('ADD_MESSAGE', BattleText.aromatherapy.activate);
                        break;
                    }
                }

                break;
            }
            case 'switch': case 'drag': { /** Llega un mensaje del tipo |switch|POKEMON|DETAILS|HP STATUS y |drag|POKEMON|DETAILS|HP STATUS. */
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);

                if (lastMove != 'Baton Pass') {
                    clearBoosts(playerID);
                }

                if (playerID === battleUser.id) {
                    if (userLastPokemonActive === '' || message[0] === 'drag') {
                        if (message[0] === 'drag') {
                            store.commit('ADD_MESSAGE', BattleText.drag.replace('[POKEMON]', pokemonName));
                        } else {
                            store.commit('ADD_MESSAGE', BattleText.switchIn.replace('[TRAINER]', battleUser.username).replace('[POKEMON]', pokemonName));
                        }
                        userLastPokemonActive = pokemonName;
                    } else {
                        store.commit('ADD_MESSAGE', BattleText.switchOut.replace('[TRAINER]', battleUser.username).replace('[POKEMON]', userLastPokemonActive));
                        store.commit('ADD_MESSAGE', BattleText.switchIn.replace('[TRAINER]', battleUser.username).replace('[POKEMON]', pokemonName));
                        userLastPokemonActive = pokemonName;
                    }
                } else if (playerID === battleRival.id) {
                    const pokemonSwitchedIn : IBattlePokemon = {
                        ident : message[1],
                        details : message[2],
                        condition : message[3],
                        active : true,
                        stats : {
                            atk : 0,
                            def : 0,
                            spa : 0,
                            spd : 0,
                            spe : 0,
                        },
                        moves : [],
                        baseAbility : '',
                        item : '',
                    };
                    updateRivalTeam(pokemonSwitchedIn);
                    if (rivalLastPokemonActive === '' || message[0] === 'drag') {
                        if (message[0] === 'drag') {
                            store.commit('ADD_MESSAGE', BattleText.drag.replace('[POKEMON]', pokemonName));
                        } else {
                            store.commit('ADD_MESSAGE', BattleText.switchIn.replace('[TRAINER]', battleRival.username).replace('[POKEMON]', pokemonName));
                        }
                        rivalLastPokemonActive = pokemonName;
                    } else {
                        store.commit('ADD_MESSAGE', BattleText.switchOut.replace('[TRAINER]', battleRival.username).replace('[POKEMON]', rivalLastPokemonActive));
                        store.commit('ADD_MESSAGE', BattleText.switchIn.replace('[TRAINER]', battleRival.username).replace('[POKEMON]', pokemonName));
                        rivalLastPokemonActive = pokemonName;
                    }
                }
                break;
            }
            //case 'detailschange':
            case '-formechange': { /** Llega un mensaje del tipo |detailschange|POKEMON|DETAILS|HP STATUS ó |-formechange|POKEMON|SPECIES|FROM. */
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);

                //FROMABILITY
                if (message[4].startsWith('[from] ability')) {
                    const ability = message[4].substring(16).trim();
                    const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);
                    addMessageToChatAbility(messageToChat, playerID);
                }

                //Pokemon transformed!
                addMessageToChat(BattleText.pokemonTransformed.replace('[POKEMON]', pokemonName), playerID);
                break;
            }
            //case 'replace': {break;}
            //case 'swap': {break;}
            case 'cant': { /** Llega un mensaje del tipo |cant|POKEMON|REASON ó |cant|POKEMON|REASON|MOVE. */
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);
                if (message[3] != null) {
                    move = message[3].trim();
                }

                switch(message[2].trim()) {
                    case 'par': {
                        addMessageToChat(BattleText.par.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'slp': {
                        addMessageToChat(BattleText.slp.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'frz': {
                        addMessageToChat(BattleText.frz.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'flinch': {
                        addMessageToChat(BattleText.flinch.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'nopp': {
                        addMessageToChat(BattleText.nopp.cant.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    case 'recharge': {
                        addMessageToChat(BattleText.recharge.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    //case 'move: Gravity': {break;}
                    case 'Attract': {
                        addMessageToChat(BattleText.attract.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }case 'Focus Punch': {
                        addMessageToChat(BattleText.focuspunch.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Disable': {
                        addMessageToChat(BattleText.cant.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    //case 'Shell Trap': {break;}
                    case 'move: Taunt': {
                        addMessageToChat(BattleText.taunt.cant.replace('[POKEMON]',pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    //case 'move: Throat Chop': {break;}
                    case 'move: Imprison': {
                        addMessageToChat(BattleText.imprison.cant.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    case 'ability: Truant': {
                        addMessageToChatAbility(BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', 'Truant'), message[1]);
                        addMessageToChat(BattleText.truant.cant.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'ability: Damp': {
                        addMessageToChatAbility(BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', 'Damp'), message[1]);
                        addMessageToChat(BattleText.damp.block.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    default: {
                        store.commit('ADD_MESSAGE', BattleText.cantNoMove.replace('[POKEMON]', pokemonName));
                        break;
                    }
                }
                break;
            }
            case 'faint': { /** Llega un mensaje del tipo |faint|POKEMON. */
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);

                addMessageToChat(BattleText.faint.replace('[POKEMON]', pokemonName), playerID);
                break;
            }

            /** Acciones menores. */

            case '-fail': { /** Llega un mensaje del tipo |-fail|POKEMON|ACTION. */
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);

                if (message[2] != null) {
                    switch (message[2].trim()) {
                        case 'heal': { //falla si la vida está al máximo y se intenta curar
                            addMessageToChat(BattleText.healFailed.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'unboost': { //falla al intentar hacer unboost a Pokémon con habilidades como Cuerpo puro
                            if (message[3].startsWith('[from] ability')) {
                                const ability = message[3].substring(16).trim();
                                const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);
                                addMessageToChatAbility(messageToChat, playerID);
                            }
                            addMessageToChat(BattleText.unboostFail.fail.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'move: Substitute': { //falla o bien por no tener vida suficiente para hacerlo o bien por tener ya un sustituto activo
                            if (message[3] != null) {
                                if (message[3].trim() === '[weak]') {
                                    addMessageToChat(BattleText.substitute.fail.replace('[POKEMON]', pokemonName), playerID);
                                }
                            } else {
                                addMessageToChat(BattleText.substitute.alreadyStarted.replace('[POKEMON]', pokemonName), playerID);
                            }
                            break;
                        }
                        case '[from] Uproar': {
                            addMessageToChat(BattleText.uproar.block.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'brn': {
                            addMessageToChat(BattleText.brn.alreadyStarted.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'psn':
                        case 'tox': {
                            addMessageToChat(BattleText.psn.alreadyStarted.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'par': {
                            addMessageToChat(BattleText.par.alreadyStarted.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'slp': {
                            addMessageToChat(BattleText.slp.alreadyStarted.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'frz': {
                            addMessageToChat(BattleText.frz.alreadyStarted.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        default: {
                            store.commit('ADD_MESSAGE', BattleText.fail.replace('[POKEMON]', pokemonName));
                            break;
                        }
                    }
                } else {
                    store.commit('ADD_MESSAGE', BattleText.fail.replace('[POKEMON]', pokemonName));
                }
                break;
            }
            //case '-block': {break;}
            case '-notarget': { /** Llega un mensaje del tipo |-notarget|POKEMON. */
                store.commit('ADD_MESSAGE', BattleText.noTarget);
                break;
            }
            case '-miss': { /** Llega un mensaje del tipo |-miss|SOURCE|TARGET. */
                pokemonName = message[2].split(' ')[1].trim();
                playerID = message[2].substring(0,2);

                addMessageToChat(BattleText.miss.replace('[POKEMON]', pokemonName), playerID);
                break;
            }
            case '-damage': { /** Llega un mensaje del tipo |-damage|POKEMON|HP STATUS|REASON. */
                pokemonName = message[1].split(' ')[1].trim()
                playerID = message[1].substring(0,2);
                const pokemonIdent = message[1].trim();
                const condition = message[2].trim();
                let reason: string;
                const {HPpreUpdate, maxHP} = updatePokemonHP(pokemonIdent, playerID, condition); /** Actualizamos la vida del Pokémon y recuperamos su vida antes del daño. */
                const HPpostDamage = parseInt(condition.split(' ')[0].split('/')[0]);
                const damage = ((HPpreUpdate-HPpostDamage)/maxHP*100).toFixed(1);

                if (message[3] != null) { /** Si el daño no es causado por un ataque directo. */
                    reason = message[3].substring(7).trim(); /** La reason es del tipo [from] psn. */
                    switch (reason) {
                        case 'psn': case 'tox': {
                            addMessageToChat(BattleText.psn.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'brn': {
                            addMessageToChat(BattleText.brn.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'confusion': {
                            addMessageToChat(BattleText.confusion.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Recoil': {
                            addMessageToChat(BattleText.recoil.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Sandstorm': {
                            addMessageToChat(BattleText.sandstorm.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Hail': {
                            addMessageToChat(BattleText.hail.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Curse': {
                            addMessageToChat(BattleText.curse.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Leech Seed': {
                            addMessageToChat(BattleText.leechseed.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Spikes': {
                            addMessageToChat(BattleText.spikes.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Nightmare': {
                            addMessageToChat(BattleText.nightmare.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'move: Whirlpool': case 'move: Bind': case 'move: Sand Tomb': case 'move: Wrap': case 'move: Fire Spin': case 'move: Clamp': {
                            const move = reason.substring(6).trim();
                            addMessageToChat(BattleText.damageFromPartialTrapping.replace('[POKEMON]', pokemonName).replace('[MOVE]', move). replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        default: {
                            if (reason.split(' ')[0] != null) {
                                if (reason.split(' ')[0].trim() === 'ability:') { //si la reason es por una habilidad de un pokemon se hace un caso aparte
                                    const pokemonActiveAbility = message[4].split(' ')[2].trim();
                                    const playerIDActiveAbility = message[4].split(' ')[1].substring(0, 2).trim()
                                    const ability = message[3].substring(16).trim();
                                    const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonActiveAbility).replace('[ABILITY]', ability);

                                    addMessageToChatAbility(messageToChat, playerIDActiveAbility);

                                    if (ability === 'Liquid Ooze') {
                                        addMessageToChat(BattleText.liquidooze.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                                    } else if (ability === 'Rough Skin') {
                                        addMessageToChat(BattleText.roughskin.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                                    }
                                }
                            }
                        }
                    }

                } else { /** Si el daño es causado por un ataque directo. */
                    addMessageToChat(BattleText.damagePercentage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                }

                /*if(condition === '0 fnt') { //el Pokémon se debilita
                    addMessageToChat(BattleText.faint.replace('[POKEMON]', pokemonName), playerID);
                }*/

                break;
            }
            case '-heal': { /** Llega un mensaje del tipo |-heal|POKEMON|HP STATUS. */
                pokemonName = message[1].split(' ')[1].trim()
                playerID = message[1].substring(0,2);
                const pokemonIdent = message[1].trim();
                const condition = message[2].trim();
                let reason: string;
                const {HPpreUpdate, maxHP} = updatePokemonHP(pokemonIdent, playerID, condition); /** Actualizamos la vida del Pokémon y recuperamos su vida antes del daño. */
                const HPpostDamage = parseInt(condition.split(' ')[0].split('/')[0]);
                const heal = ((HPpostDamage-HPpreUpdate)/maxHP*100).toFixed(1);

                if (message[3] != null && message[3].split(' ')[1] != null) { /** Si Showdown te indica de qué fuente obtiene el Pokémon la curación. */
                    reason = message[3].split(' ')[1].trim(); /** La reason es del tipo [from] item: Leftovers. */

                    switch (reason) {
                        case 'item:': {
                            const item = message[3].substring(13).trim()
                            addMessageToChat(BattleText.itemHeal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', heal + '%').replace('[ITEM]', item), playerID);
                            break;
                        }
                        case 'Ingrain': {
                            addMessageToChat(BattleText.ingrain.heal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', heal + '%'), playerID);
                            break;
                        }
                        case 'move:': {
                            const move = message[3].split(' ')[2].trim();
                            switch(move){
                                case 'Wish': {
                                    const wisher = message[4].split(' ')[1].trim();
                                    addMessageToChat(BattleText.wish.heal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', heal + '%').replace('[WISHER]', wisher), playerID);
                                    break;
                                }
                            }
                            break;
                        }
                        case 'ability:': {
                            const ability = message[3].substring(16).trim();
                            const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                            addMessageToChatAbility(messageToChat, playerID);
                            addMessageToChat(BattleText.heal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', heal + '%'), playerID);
                        }
                    }

                } else { /** Si Showdown no te indica de qué fuente obtiene el Pokémon la curación. */
                    addMessageToChat(BattleText.heal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', heal + '%'), playerID);
                }
                break;
            }
            case '-sethp': { /** Llega un mensaje del tipo |-sethp|POKEMON|HP. */
                pokemonName = message[1].split(' ')[1].trim()
                playerID = message[1].substring(0,2);
                const pokemonIdent = message[1].trim();
                const condition = message[2].trim();
                let HPdifference: string;

                const {HPpreUpdate, maxHP} = updatePokemonHP(pokemonIdent, playerID, condition); /** Actualizamos la vida del Pokémon y recuperamos su vida antes del daño. */
                const HPpostDamage = parseInt(condition.split(' ')[0].split('/')[0]);

                if (HPpostDamage > HPpreUpdate) {
                    HPdifference = ((HPpostDamage-HPpreUpdate)/maxHP*100).toFixed(1);
                    addMessageToChat(BattleText.heal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', HPdifference + '%'), playerID);
                } else {
                    HPdifference = ((HPpreUpdate-HPpostDamage)/maxHP*100).toFixed(1);
                    addMessageToChat(BattleText.damagePercentage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', HPdifference + '%'), playerID);
                }
                break;
            }
            case '-status': { /** Llega un mensaje del tipo |-status|POKEMON|STATUS. */
                const status = message[2].trim();
                const pokemonIdent = message[1].trim();
                playerID = message[1].substring(0,2);

                switch (status) {
                    case 'brn': {
                        addMessageToChat(BattleText.brn.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'psn': {
                        addMessageToChat(BattleText.psn.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'tox': {
                        addMessageToChat(BattleText.tox.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'par': {
                        addMessageToChat(BattleText.par.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'slp': {
                        addMessageToChat(BattleText.slp.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'frz': {
                        addMessageToChat(BattleText.frz.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                }
                addStatus(pokemonIdent, status, playerID);

                if (message[3] != null) {
                    if (message[3].trim() === '[from] ability: Synchronize'){
                        const ability = 'Synchronize';
                        const pokemonActivatedAbility = message[4].split(' ')[2].trim();
                        const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonActivatedAbility).replace('[ABILITY]', ability);

                        addMessageToChatAbility(messageToChat, playerID);
                    }
                }
                break;
            }
            case '-curestatus': { /** Llega un mensaje del tipo |-curestatus|POKEMON|STATUS. */
                const status = message[2].trim();
                const pokemonIdent = message[1].trim();
                playerID = message[1].substring(0,2);

                switch (status) {
                    case 'brn': {
                        addMessageToChat(BattleText.brn.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'psn': {
                        addMessageToChat(BattleText.psn.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'tox': {
                        addMessageToChat(BattleText.tox.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'par': {
                        addMessageToChat(BattleText.par.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'slp': {
                        addMessageToChat(BattleText.slp.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'frz': {
                        addMessageToChat(BattleText.frz.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                }
                if (message[3].trim() === '[from] ability: Natural Cure') {
                    const ability = 'Natural Cure';
                    const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                    addMessageToChatAbility(messageToChat, playerID);
                    addMessageToChat(BattleText.naturalcure.activate.replace('[POKEMON]', pokemonName), playerID);
                }
                removeStatus(pokemonIdent, status, playerID);
                break;
            }
            case '-cureteam': { /** Llega un mensaje del tipo |-cureteam|POKEMON. */
                playerID = message[1].substring(0,2);
                pokemonName = message[1].split(' ')[1];

                removeAllStatus(playerID);
                store.commit('ADD_MESSAGE', BattleText.teamcured.replace('[POKEMON]', pokemonName));

                break;
            }
            case '-boost': case '-unboost': case '-setboost': { /** Llega un mensaje del tipo |-boost|POKEMON|STAT|AMOUNT ó |-unboost|POKEMON|STAT|AMOUNT. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const statSimplified = message[2].trim();
                let statName = '';
                let amount = 0;

                switch (statSimplified) {
                    case 'atk': {
                        statName = BattleText.stats.atk.statName;
                        break;
                    }
                    case 'def': {
                        statName = BattleText.stats.def.statName;
                        break;
                    }
                    case 'spa': {
                        statName = BattleText.stats.spa.statName;
                        break;
                    }
                    case 'spd': {
                        statName = BattleText.stats.spd.statName;
                        break;
                    }
                    case 'spe': {
                        statName = BattleText.stats.spe.statName;
                        break;
                    }
                    case 'accuracy': {
                        statName = BattleText.stats.acc.statName;
                        break;
                    }
                }

                if (message[0] === '-boost' || message[0] === '-setboost') {
                    amount = parseInt(message[3].trim());
                    if (amount === 1) {
                        addMessageToChat(BattleText.boost.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    } else if (amount === 2) {
                        addMessageToChat(BattleText.boost2.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    } else if (amount === 6) {
                        addMessageToChat(BattleText.boost6.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    } else if (amount === 0) {
                        addMessageToChat(BattleText.boost0.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    }
                } else if (message[0] === '-unboost'){
                    amount = -parseInt(message[3].trim());
                    if (amount === -1) {
                        addMessageToChat(BattleText.unboost.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    } else if (amount === -2) {
                        addMessageToChat(BattleText.unboost2.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    } else if (amount === -6) {
                        addMessageToChat(BattleText.unboost6.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    } else if (amount === 0) {
                        addMessageToChat(BattleText.unboost0.replace('[POKEMON]', pokemonName).replace('[STAT]', statName), playerID);
                    }
                }

                if (playerID === battleUser.id) {
                    switch (statSimplified) {
                        case 'atk': {
                            if (amount === 6) {
                                userSideConditions.boosts.atk = 6;
                            } else {
                                userSideConditions.boosts.atk = userSideConditions.boosts.atk + amount;
                            }
                            break;
                        }
                        case 'def': {
                            if (amount === 6) {
                                userSideConditions.boosts.def = 6;
                            } else {
                                userSideConditions.boosts.def = userSideConditions.boosts.def + amount;
                            }
                            break;
                        }
                        case 'spa': {
                            if (amount === 6) {
                                userSideConditions.boosts.spa = 6;
                            } else {
                                userSideConditions.boosts.spa = userSideConditions.boosts.spa + amount;
                            }
                            break;
                        }
                        case 'spd': {
                            if (amount === 6) {
                                userSideConditions.boosts.spd = 6;
                            } else {
                                userSideConditions.boosts.spd = userSideConditions.boosts.spd + amount;
                            }
                            break;
                        }
                        case 'spe': {
                            if (amount === 6) {
                                userSideConditions.boosts.spe = 6;
                            } else {
                                userSideConditions.boosts.spe = userSideConditions.boosts.spe + amount;
                            }
                            break;
                        }
                        case 'accuracy': {
                            if (amount === 6) {
                                userSideConditions.boosts.acc = 6;
                            } else {
                                userSideConditions.boosts.acc = userSideConditions.boosts.acc + amount;
                            }
                            break;
                        }
                    }
                    //store.commit('SET_USERSIDECONDITIONS', userSideConditions);
                } else if (playerID === battleRival.id) {
                    switch (statSimplified) {
                        case 'atk': {
                            if (amount === 6) {
                                rivalSideConditions.boosts.atk = 6;
                            } else {
                                rivalSideConditions.boosts.atk = rivalSideConditions.boosts.atk + amount;
                            }
                            break;
                        }
                        case 'def': {
                            if (amount === 6) {
                                rivalSideConditions.boosts.def = 6;
                            } else {
                                rivalSideConditions.boosts.def = rivalSideConditions.boosts.def + amount;
                            }
                            break;
                        }
                        case 'spa': {
                            if (amount === 6) {
                                rivalSideConditions.boosts.spa = 6;
                            } else {
                                rivalSideConditions.boosts.spa = rivalSideConditions.boosts.spa + amount;
                            }
                            break;
                        }
                        case 'spd': {
                            if (amount === 6) {
                                rivalSideConditions.boosts.spd = 6;
                            } else {
                                rivalSideConditions.boosts.spd = rivalSideConditions.boosts.spd + amount;
                            }
                            break;
                        }
                        case 'spe': {
                            if (amount === 6) {
                                rivalSideConditions.boosts.spe = 6;
                            } else {
                                rivalSideConditions.boosts.spe = rivalSideConditions.boosts.spe + amount;
                            }
                            break;
                        }
                        case 'accuracy': {
                            if (amount === 6) {
                                rivalSideConditions.boosts.acc = 6;
                            } else {
                                rivalSideConditions.boosts.acc = rivalSideConditions.boosts.acc + amount;
                            }
                            break;
                        }
                    }
                    //store.commit('SET_RIVALSIDECONDITIONS', rivalSideConditions);
                }
                break;
            }
            //case '-swapboost': {break;}
            //case '-invertboost': {break;}
            // case '-clearboost': {break;}
            case '-clearallboost': { /** Llega un mensaje del tipo |-clearallboost|POKEMON. */
                clearBoosts('p1');
                clearBoosts('p2');
                store.commit('ADD_MESSAGE', BattleText.clearAllBoost);
                break;
            }
            //case '-clearpositiveboost': {break;}
            //case '-clearnegativeboost': {break;}
            case '-copyboost': { /** Llega un mensaje del tipo |-copyboost|SOURCE|TARGET. */
                playerID = message[1].substring(0,2);
                pokemonName = message[1].split(' ')[1];
                const targetName = message[2].split(' ')[1];

                if (playerID === battleUser.id) {
                    userSideConditions.boosts = rivalSideConditions.boosts;
                } else if (playerID === battleRival.id) {
                    rivalSideConditions.boosts = userSideConditions.boosts;
                }

                store.commit('ADD_MESSAGE', BattleText.copyBoost.replace('[POKEMON]', pokemonName).replace('[TARGET]', targetName));
                break;
            }
            case '-weather': { /** Llega un mensaje del tipo |-weather|WEATHER. */
                const weather = message[1].trim();

                if (message[2] != null) {
                    if (message[2].startsWith('[from] ability:')) {
                        const ability = message[2].substring(16).trim();
                        const pokemonActivatedAbility = message[3].split(' ')[2].trim();
                        playerID = message[3].substring(5,7);
                        const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonActivatedAbility).replace('[ABILITY]', ability);

                        addMessageToChatAbility(messageToChat, playerID);
                    }
                }

                switch (weather) {
                    case 'RainDance': {
                        if (message[2] != null) {
                            if (message[2].trim() === '[upkeep]') { //si el clima sigue activado
                                store.commit('ADD_MESSAGE', BattleText.raindance.upkeep.replace('[POKEMON]', pokemonName));
                            } else if (message[2].startsWith('[from] ability:')) { //si el clima acaba de empezar por una habilidad
                                store.commit('ADD_MESSAGE', BattleText.raindance.start.replace('[POKEMON]', pokemonName));
                                setFieldConditions(true, 'RainDance');
                            }
                        } else { //si el clima acaba de empezar
                            store.commit('ADD_MESSAGE', BattleText.raindance.start.replace('[POKEMON]', pokemonName));
                            setFieldConditions(true, 'RainDance');
                        }
                        break;
                    }
                    case 'SunnyDay': {
                        if (message[2] != null) {
                            if (message[2].trim() === '[upkeep]') {
                                store.commit('ADD_MESSAGE', BattleText.sunnyday.upkeep.replace('[POKEMON]', pokemonName));
                            } else if (message[2].startsWith('[from] ability:')) {
                                store.commit('ADD_MESSAGE', BattleText.sunnyday.start.replace('[POKEMON]', pokemonName));
                                setFieldConditions(true, 'SunnyDay');
                            }
                        } else {
                            store.commit('ADD_MESSAGE', BattleText.sunnyday.start.replace('[POKEMON]', pokemonName));
                            setFieldConditions(true, 'SunnyDay');
                        }
                        break;
                    }
                    case 'Sandstorm': {
                        if (message[2] != null) {
                            if (message[2].trim() === '[upkeep]') {
                                store.commit('ADD_MESSAGE', BattleText.sandstorm.upkeep.replace('[POKEMON]', pokemonName));
                            } else if (message[2].startsWith('[from] ability:')) {
                                store.commit('ADD_MESSAGE', BattleText.sandstorm.start.replace('[POKEMON]', pokemonName));
                                setFieldConditions(true, 'Sandstorm');
                            }
                        } else {
                            store.commit('ADD_MESSAGE', BattleText.sandstorm.start.replace('[POKEMON]', pokemonName));
                            setFieldConditions(true, 'Sandstorm');
                        }
                        break;
                    }
                    case 'Hail': {
                        if (message[2] != null) {
                            if (message[2].trim() === '[upkeep]') {
                                store.commit('ADD_MESSAGE', BattleText.hail.upkeep.replace('[POKEMON]', pokemonName));
                            } else if (message[2].startsWith('[from] ability:')) {
                                store.commit('ADD_MESSAGE', BattleText.hail.start.replace('[POKEMON]', pokemonName));
                                setFieldConditions(true, 'Hail');
                            }
                        } else {
                            store.commit('ADD_MESSAGE', BattleText.hail.start.replace('[POKEMON]', pokemonName));
                            setFieldConditions(true, 'Hail');
                        }
                        break;
                    }
                    case 'none': {
                        if (fieldConditions.weather.type === 'RainDance') {
                            store.commit('ADD_MESSAGE', BattleText.raindance.end.replace('[POKEMON]', pokemonName));
                        } else if (fieldConditions.weather.type === 'SunnyDay') {
                            store.commit('ADD_MESSAGE', BattleText.sunnyday.end.replace('[POKEMON]', pokemonName));
                        } else if (fieldConditions.weather.type === 'Sandstorm') {
                            store.commit('ADD_MESSAGE', BattleText.sandstorm.end.replace('[POKEMON]', pokemonName));
                        } else if (fieldConditions.weather.type === 'Hail') {
                            store.commit('ADD_MESSAGE', BattleText.hail.end.replace('[POKEMON]', pokemonName));
                        }
                        setFieldConditions(false, '');
                    }
                }
                break;
            }
            //case '-fieldstart': {break;}
            //case '-fieldend': {break;}
            case '-fieldactivate': {
                if (message[1] != null) {
                    if (message[1].trim() === 'move: Pay Day') {
                        store.commit('ADD_MESSAGE', BattleText.payday.activate);
                    }
                }
                break;
            }
            case '-sidestart': { /** Llega un mensaje del tipo |-sidestart|SIDE|CONDITION. */
                playerID = message[1].substring(0,2);
                const condition = message[2].trim();
                let team = '';

                if (playerID === battleUser.id) {
                    team = 'your team';
                } else if (playerID === battleRival.id) {
                    team = 'the opposing team';
                }

                switch (condition) {
                    case 'Reflect': {
                        if (playerID === battleUser.id) {
                            userSideConditions.reflect = true;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.reflect = true;
                        }
                        store.commit('ADD_MESSAGE', BattleText.reflect.start.replace('[TEAM]', team));
                        break;
                    }
                    case 'Light Screen': {
                        if (playerID === battleUser.id) {
                            userSideConditions.lightscreen = true;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.lightscreen = true;
                        }
                        store.commit('ADD_MESSAGE', BattleText.lightscreen.start.replace('[TEAM]', team));
                        break;
                    }
                    case 'Safeguard': {
                        if (playerID === battleUser.id) {
                            userSideConditions.safeguard = true;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.safeguard = true;
                        }
                        store.commit('ADD_MESSAGE', BattleText.safeguard.start.replace('[TEAM]', team));
                        break;
                    }
                    case 'Mist': {
                        if (playerID === battleUser.id) {
                            userSideConditions.mist = true;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.mist = true;
                        }
                        store.commit('ADD_MESSAGE', BattleText.mist.start.replace('[TEAM]', team));
                        break;
                    }
                    case 'Spikes': {
                        if (playerID === battleUser.id) {
                            userSideConditions.spikes += 1;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.spikes += 1;
                        }
                        store.commit('ADD_MESSAGE', BattleText.spikes.start.replace('[TEAM]', team));
                        break;
                    }
                }
                /*if (playerID === battleUser.id) {
                    store.commit('SET_USERSIDECONDITIONS', userSideConditions);
                } else if (playerID === battleRival.id) {
                    store.commit('SET_RIVALSIDECONDITIONS', rivalSideConditions);
                }*/
                break;
            }
            case '-sideend': { /** Llega un mensaje del tipo |-sideend|SIDE|CONDITION. */
                playerID = message[1].substring(0,2);
                const condition = message[2].trim();
                let team = '';

                if (playerID === battleUser.id) {
                    team = 'Your team';
                } else if (playerID === battleRival.id) {
                    team = 'The opposing team';
                }

                switch (condition) {
                    case 'Reflect': {
                        if (playerID === battleUser.id) {
                            userSideConditions.reflect = false;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.reflect = false;
                        }
                        store.commit('ADD_MESSAGE', BattleText.reflect.end.replace('[TEAM]', team));
                        break;
                    }
                    case 'Light Screen': {
                        if (playerID === battleUser.id) {
                            userSideConditions.lightscreen = false;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.lightscreen = false;
                        }
                        store.commit('ADD_MESSAGE', BattleText.lightscreen.end.replace('[TEAM]', team));
                        break;
                    }
                    case 'Safeguard': {
                        if (playerID === battleUser.id) {
                            userSideConditions.safeguard = false;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.safeguard = false;
                        }
                        store.commit('ADD_MESSAGE', BattleText.safeguard.end.replace('[TEAM]', team));
                        break;
                    }
                    case 'Mist': {
                        if (playerID === battleUser.id) {
                            userSideConditions.mist = false;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.mist = false;
                        }
                        store.commit('ADD_MESSAGE', BattleText.mist.end.replace('[TEAM]', team));
                        break;
                    }
                    case 'Spikes': {
                        if (playerID === battleUser.id) {
                            userSideConditions.spikes = 0;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.spikes = 0;
                        }
                        store.commit('ADD_MESSAGE', BattleText.spikes.end.replace('[TEAM]', team));
                        break;
                    }
                }
                break;
            }
            //case '-swapsideconditions': {break;}
            case '-start': { /** Llega un mensaje del tipo |-start|POKEMON|EFFECT. Empieza un efecto volatil sobre un Pokémon. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const effect = message[2];

                switch (effect.trim()) {
                    case 'Attract': {
                        addMessageToChat(BattleText.attract.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Curse': {
                        const pokemonCauseEffect = message[3].split(' ')[2].trim();
                        addMessageToChat(BattleText.curse.start.replace('[SOURCE]', pokemonCauseEffect).replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Disable': {
                        const move = message[3].trim();
                        addMessageToChat(BattleText.disable.start.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    case 'Nightmare': {
                        addMessageToChat(BattleText.nightmare.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Imprison': {
                        addMessageToChat(BattleText.imprison.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Doom Desire': {
                        addMessageToChat(BattleText.doomdesire.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Encore': {
                        addMessageToChat(BattleText.encore.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Focus Energy': {
                        addMessageToChat(BattleText.focusenergy.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Future Sight': {
                        addMessageToChat(BattleText.futuresight.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Ingrain': {
                        addMessageToChat(BattleText.ingrain.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Leech Seed': {
                        if (playerID === battleUser.id) {
                            userSideConditions.leechseed = true;
                            //store.commit('SET_USERSIDECONDITIONS', userSideConditions);
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.leechseed = true;
                            //store.commit('SET_RIVALSIDECONDITIONS', rivalSideConditions);
                        }
                        addMessageToChat(BattleText.leechseed.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Mimic': {
                        const move = message[3].trim();
                        addMessageToChat(BattleText.mimic.start.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                        break;
                    }
                    case 'Foresight': {
                        addMessageToChat(BattleText.foresight.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'perish3': {
                        if (message[3] == null){
                            addMessageToChat(BattleText.perishsong.activate.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '3'), playerID);
                        }
                        break;
                    }
                    case 'perish2': {
                        if (message[3] == null){
                            addMessageToChat(BattleText.perishsong.activate.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '2'), playerID);
                        }
                        break;
                    }
                    case 'perish1': {
                        if (message[3] == null){
                            addMessageToChat(BattleText.perishsong.activate.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '1'), playerID);
                        }
                        break;
                    }
                    case 'perish0': {
                        if (message[3] == null){
                            addMessageToChat(BattleText.perishsong.activate.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '0'), playerID);
                        }
                        break;
                    }
                    case 'stockpile1': {
                        addMessageToChat(BattleText.stockpile.start.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '1'), playerID);
                        break;
                    }
                    case 'stockpile2': {
                        addMessageToChat(BattleText.stockpile.start.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '2'), playerID);
                        break;
                    }
                    case 'stockpile3': {
                        addMessageToChat(BattleText.stockpile.start.replace('[POKEMON]', pokemonName).replace('[NUMBER]', '3'), playerID);
                        break;
                    }
                    case 'Substitute': {
                        addMessageToChat(BattleText.substitute.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Taunt': {
                        addMessageToChat(BattleText.taunt.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Torment': {
                        addMessageToChat(BattleText.torment.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Uproar': {
                        if (message[3] == null) {
                            addMessageToChat(BattleText.uproar.start.replace('[POKEMON]', pokemonName), playerID);
                        } else {
                            addMessageToChat(BattleText.uproar.upkeep.replace('[POKEMON]', pokemonName), playerID);
                        }
                        break;
                    }
                    case 'confusion': {
                        if (message[3] != null) {
                            if (message[3].trim() === '[fatigue]') {
                                addMessageToChat(BattleText.confusion.startFromFatigue.replace('[POKEMON]', pokemonName), playerID);
                            }
                        } else {
                            addMessageToChat(BattleText.confusion.start.replace('[POKEMON]', pokemonName), playerID);
                        }
                        break;
                    }
                    case 'move: Yawn': {
                        addMessageToChat(BattleText.yawn.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Mud Sport': {
                        store.commit('ADD_MESSAGE', BattleText.mudsport.start);
                        break;
                    }
                    case 'move: Water Sport': {
                        store.commit('ADD_MESSAGE', BattleText.watersport.start);
                        break;
                    }
                    case 'move: Bide': {
                        addMessageToChat(BattleText.bide.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'ability: Flash Fire': {
                        const ability = 'Flash Fire';
                        const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                        addMessageToChatAbility(messageToChat, playerID);
                        store.commit('ADD_MESSAGE', BattleText.flashfire.start.replace('[POKEMON]', pokemonName));
                        break;
                    }
                    case 'typechange': {
                        const newType = message[3].trim();

                        if (message[4].trim() === '[from] ability: Color Change'){
                            const ability = 'Color Change';
                            const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                            addMessageToChatAbility(messageToChat, playerID);
                        }
                        addMessageToChat(BattleText.typeChange.replace('[POKEMON]', pokemonName).replace('[TYPE]', newType), playerID);
                        break;
                    }
                }
                break;
            }
            case '-end': { /** Llega un mensaje del tipo |-end|POKEMON|EFFECT. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const effect = message[2];

                switch (effect) {
                    case 'Attract': {
                        addMessageToChat(BattleText.attract.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Disable': {
                        addMessageToChat(BattleText.disable.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Doom Desire': {
                        addMessageToChat(BattleText.doomdesire.activate.replace('[TARGET]', pokemonName), playerID);
                        break;
                    }
                    case 'Encore': {
                        addMessageToChat(BattleText.encore.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Future Sight': {
                        addMessageToChat(BattleText.futuresight.activate.replace('[TARGET]', pokemonName), playerID);
                        break;
                    }
                    case 'Leech Seed': {
                        if (playerID === battleUser.id) {
                            userSideConditions.leechseed = false;
                        } else if (playerID === battleRival.id) {
                            rivalSideConditions.leechseed = false;
                        }
                        addMessageToChat(BattleText.leechseed.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Stockpile': {
                        addMessageToChat(BattleText.stockpile.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Substitute': {
                        addMessageToChat(BattleText.substitute.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Taunt': {
                        addMessageToChat(BattleText.taunt.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Uproar': {
                        addMessageToChat(BattleText.uproar.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'confusion': {
                        addMessageToChat(BattleText.confusion.end.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Bide': {
                        if (message[3] != null) {
                            if (message[3].trim() != '[silent]') {
                                addMessageToChat(BattleText.bide.end.replace('[POKEMON]', pokemonName), playerID);
                            }
                        } else {
                            addMessageToChat(BattleText.bide.end.replace('[POKEMON]', pokemonName), playerID);
                        }

                        break;
                    }
                }
                break;
            }
            case '-crit': { /** Llega un mensaje del tipo |-crit|POKEMON. */
                store.commit('ADD_MESSAGE', BattleText.crit);
                break;
            }
            case '-supereffective': { /** Llega un mensaje del tipo |-supereffective|POKEMON. */
                store.commit('ADD_MESSAGE', BattleText.superEffective);
                break;
            }
            case '-resisted': { /** Llega un mensaje del tipo |-resisted|POKEMON. */
                store.commit('ADD_MESSAGE', BattleText.resisted);
                break;
            }
            case '-immune': { /** Llega un mensaje del tipo |-immune|POKEMON. */
                pokemonName = message[1].split(' ')[1];

                if (message[3] != null) {
                    const immuneFrom = message[3].trim();
                    if (immuneFrom.startsWith('[from] ability:')) {
                        const ability = immuneFrom.substring(16).trim();
                        const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                        addMessageToChatAbility(messageToChat, playerID);
                    }
                }

                store.commit('ADD_MESSAGE', BattleText.immune.replace('[POKEMON]', pokemonName));
                break;
            }
            case '-item': { /** Llega un mensaje del tipo |-item|POKEMON|ITEM|[from]EFFECT. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const item = message[2].trim();
                const effect = message[3].substring(7);

                switch (effect) {
                    case 'move: Recycle': {
                        addMessageToChat(BattleText.recycle.addItem.replace('[POKEMON]', pokemonName).replace('[ITEM]', item), playerID);
                        break;
                    }
                    case 'move: Thief': {
                        const pokemonSource = message[4].split(' ')[2].trim();
                        addMessageToChat(BattleText.takeItem.replace('[POKEMON]', pokemonName).replace('[SOURCE]', pokemonSource).replace('[ITEM]', item), playerID);
                        break;
                    }
                    case 'move: Trick': {
                        addMessageToChat(BattleText.addItem.replace('[POKEMON]', pokemonName).replace('[ITEM]', item), playerID);
                        break;
                    }
                }
                break;
            }
            case '-enditem': { /** Llega un mensaje del tipo |-enditem|POKEMON|ITEM|[from]EFFECT. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const item = message[2].trim();

                if (item === 'White Herb') {
                    addMessageToChat(BattleText.whiteherb.end.replace('[POKEMON]', pokemonName), playerID);
                } else if (message[3].trim() === '[from] move: Knock Off') {
                    addMessageToChat(BattleText.knockoff.removeItem.replace('[POKEMON]', pokemonName).replace('[ITEM]', item), playerID);
                } else if (message[3].trim() === '[eat]') {
                    addMessageToChat(BattleText.eatItem.replace('[POKEMON]', pokemonName).replace('[ITEM]', item), playerID);
                }
                break;
            }
            case '-ability': { /** Llega un mensaje del tipo |-ability|POKEMON|ABILITY|[from]EFFECT. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const ability = message[2].trim();

                if (ability === 'Intimidate') {
                    const ability = 'Intimidate';
                    const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                    addMessageToChatAbility(messageToChat, playerID);
                } else if (ability === 'Pressure') {
                    const ability = 'Pressure';
                    const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                    addMessageToChatAbility(messageToChat, playerID);
                    addMessageToChat(BattleText.pressure.start.replace('[POKEMON]', pokemonName), playerID);
                } else {
                    const reason = message[3].substring(7);
                    const pokemonSource = message[4].split(' ')[2];

                    switch (reason) {
                        case 'ability: Trace': {
                            const ability = 'Trace';
                            const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                            addMessageToChatAbility(messageToChat, playerID);
                            addMessageToChat(BattleText.trace.changeAbility.replace('[POKEMON]', pokemonName).replace('[SOURCE]', pokemonSource).replace('[ABILITY]', ability), playerID);
                            break;
                        }
                        case 'move: Role Play': {
                            addMessageToChat(BattleText.roleplay.changeAbility.replace('[POKEMON]', pokemonName).replace('[SOURCE]', pokemonSource).replace('[ABILITY]', ability), playerID);
                            break;
                        }
                    }
                }
                break;
            }
            case '-endability': { /** Llega un mensaje del tipo |-endability|POKEMON. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const ability = message[2].trim();

                addMessageToChat(BattleText.changeAbility.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability), playerID);
                break;
            }
            case '-transform': { /** Llega un mensaje del tipo |-transform|POKEMON|SPECIES. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const newPokemonName = message[2].split(' ')[1];

                addMessageToChat(BattleText.transform.transform.replace('[POKEMON]', pokemonName).replace('[SPECIES]', newPokemonName), playerID);
                break;
            }
            //case '-mega': {break;}
            //case '-primal': {break;}
            //case '-burst': {break;}
            //case '-zpower': {break;}
            //case '-zbroken': {break;}
            case '-activate': { /** Llega un mensaje del tipo |-activate|POKEMON|EFFECT. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const effect = message[2].trim();

                if (effect.split(' ')[0].trim() === 'move:') {
                    const move = effect.substring(6).trim();
                    switch (move) {
                        case 'Ingrain': {
                            addMessageToChat(BattleText.ingrain.block.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Mist': {
                            addMessageToChat(BattleText.mist.block.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Safeguard': {
                            addMessageToChat(BattleText.safeguard.block.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Bind': {
                            const pokemonSource = message[3].split(' ')[2].trim();
                            addMessageToChat(BattleText.bind.start.replace('[POKEMON]', pokemonName).replace('[SOURCE]', pokemonSource), playerID);
                            break;
                        }
                        case 'Charge': {
                            addMessageToChat(BattleText.charge.start.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Destiny Bond': {
                            addMessageToChat(BattleText.destinybond.activate.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Fire Spin': {
                            addMessageToChat(BattleText.firespin.start.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Whirlpool': {
                            addMessageToChat(BattleText.whirlpool.start.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Wrap': {
                            const pokemonSource = message[3].split(' ')[2];
                            addMessageToChat(BattleText.wrap.start.replace('[POKEMON]', pokemonName).replace('[SOURCE]', pokemonSource), playerID);
                            break;
                        }
                        case 'Grudge': {
                            const move = message[3].trim();
                            addMessageToChat(BattleText.grudge.activate.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                            break;
                        }
                        case 'Sand Tomb': {
                            addMessageToChat(BattleText.sandtomb.start.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Lock-On': case 'Mind Reader': {
                            const pokemonTarget = message[3].split(' ')[2].trim();
                            addMessageToChat(BattleText.lockon.start.replace('[POKEMON]', pokemonTarget).replace('[SOURCE]', pokemonName), playerID);
                            break;
                        }
                        case 'Trick': {
                            addMessageToChat(BattleText.trick.activate.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Attract': {
                            const target = message[3].split(' ')[2].trim();
                            addMessageToChat(BattleText.attract.activate.replace('[POKEMON]', pokemonName).replace('[TARGET]', target), playerID);
                            break;
                        }
                        case 'Endure': {
                            addMessageToChat(BattleText.endure.activate.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Heal Bell': {
                            store.commit('ADD_MESSAGE', BattleText.healbell.activate.replace('[POKEMON]', pokemonName));
                            break;
                        }
                        case 'Spite': {
                            const move = message[3].trim();
                            const number = message[4].trim();
                            store.commit('ADD_MESSAGE', BattleText.spite.activate.replace('[TARGET]', pokemonName).replace('[MOVE]', move).replace('[NUMBER]', number));
                            break;
                        }
                        case 'Bide': {
                            addMessageToChat(BattleText.bide.activate.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Clamp': {
                            const pokemonSource = message[3].split(' ')[2];
                            const pokemonSourceID = message[3].substring(5,7);
                            addMessageToChat(BattleText.clamp.start.replace('[SOURCE]', pokemonSource).replace('[POKEMON]', pokemonName), pokemonSourceID);
                            break;
                        }
                        case 'Magnitude': {
                            const number = message[3].trim();
                            store.commit('ADD_MESSAGE', BattleText.magnitude.activate.replace('[NUMBER]', number));
                            break;
                        }
                        case 'Pursuit': {
                            addMessageToChat(BattleText.pursuit.activate.replace('[TARGET]', pokemonName), playerID);
                            break;
                        }
                        case 'Skill Swap': {
                            addMessageToChat(BattleText.skillswap.activate.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Snatch': {
                            const pokemonTarget = message[3].split(' ')[2];
                            addMessageToChat(BattleText.snatch.activate.replace('[POKEMON]', pokemonName).replace('[TARGET]', pokemonTarget), playerID);
                            break;
                        }
                    }
                } else if (effect.split(' ')[0].trim() === 'ability:') {
                    const ability = effect.substring(9).trim();
                    switch (ability) {
                        case 'Sticky Hold': {
                            const ability = 'Sticky Hold';
                            const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                            addMessageToChatAbility(messageToChat, playerID);
                            addMessageToChat(BattleText.stickyhold.block.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Suction Cups': {
                            const ability = 'Suction Cups';
                            const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                            addMessageToChatAbility(messageToChat, playerID);
                            addMessageToChat(BattleText.suctioncups.block.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                    }
                } else if (effect.split(' ')[0].trim() === 'item:') {
                    const item = effect.substring(6).trim();
                    switch (item) {
                        case 'Focus Band': {
                            addMessageToChat(BattleText.focusband.activate.replace('[POKEMON]', pokemonName), playerID);
                            break;
                        }
                        case 'Leppa Berry': {
                            const move = message[3].trim();
                            addMessageToChat(BattleText.leppaberry.activate.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                            break;
                        }
                    }
                } else if (effect === 'trapped') {
                    addMessageToChat(BattleText.trapped.start.replace('[POKEMON]', pokemonName), playerID);
                } else if (effect === 'confusion') {
                    addMessageToChat(BattleText.confusion.activate.replace('[POKEMON]', pokemonName), playerID);
                } else if (effect === 'Substitute') {
                    store.commit('ADD_MESSAGE', BattleText.substitute.activate.replace('[POKEMON]', pokemonName));
                } else if (effect === 'Protect') {
                    addMessageToChat(BattleText.protect.block.replace('[POKEMON]', pokemonName), playerID);
                }
                break;
            }
            case '-hint': { /** Llega un mensaje del tipo |-hint|MESSAGE. */
                const hint = message[1].trim();
                store.commit('ADD_MESSAGE', '(' + hint + ')');
                break;
            }
            //case '-center': {break;}
            case '-message': { /** Llega un mensaje del tipo |-message|MESSAGE. */
                const messageReceived = message[1].trim();

                store.commit('ADD_MESSAGE', messageReceived);
                break;
            }
            //case '-combine': {break;}
            //case '-waiting': {break;}
            case '-prepare': { /** Llega un mensaje del tipo |-prepare|ATTACKER|MOVE. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const move = message[2].trim();

                switch (move) {
                    case 'Bounce': {
                        addMessageToChat(BattleText.bounce.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Dig': {
                        addMessageToChat(BattleText.dig.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Dive': {
                        addMessageToChat(BattleText.dive.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Fly': {
                        addMessageToChat(BattleText.fly.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Skull Bash': {
                        addMessageToChat(BattleText.skullbash.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Sky Attack': {
                        addMessageToChat(BattleText.skyattack.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Solar Beam': {
                        addMessageToChat(BattleText.solarbeam.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Razor Wind': {
                        addMessageToChat(BattleText.razorwind.prepare.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                }
                break;
            }
            case '-mustrecharge': { /** Llega un mensaje del tipo |-mustrecharge|POKEMON. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);

                addMessageToChat(BattleText.recharge.nextTurn.replace('[POKEMON]', pokemonName), playerID);
                break;
            }
            case '-nothing': {
                store.commit('ADD_MESSAGE', BattleText.splash.activate);
                break;
            }
            case '-hitcount': { /** Llega un mensaje del tipo |-hitcount|POKEMON|NUM. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const num = parseInt(message[2].trim());
                const numString = message[2].trim();

                if (num > 1) {
                    addMessageToChat(BattleText.hitCount.replace('[POKEMON]', pokemonName).replace('[NUMBER]', numString), playerID);
                } else {
                    addMessageToChat(BattleText.hitCountSingular.replace('[POKEMON]', pokemonName).replace('[NUMBER]', numString), playerID);
                }
                break;
            }
            case '-singlemove': { /** Llega un mensaje del tipo |-singlemove|POKEMON|MOVE. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const move = message[2].trim();

                switch (move) {
                    case 'Grudge': {
                        addMessageToChat(BattleText.grudge.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Destiny Bond': {
                        addMessageToChat(BattleText.destinybond.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                }
                break;
            }
            case '-singleturn': { /** Llega un mensaje del tipo |-singleturn|POKEMON|MOVE. */
                pokemonName = message[1].split(' ')[1];
                playerID = message[1].substring(0,2);
                const move = message[2].trim();

                switch (move) {
                    case 'Protect': {
                        addMessageToChat(BattleText.protect.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Endure': {
                        addMessageToChat(BattleText.endure.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Focus Punch': {
                        addMessageToChat(BattleText.focuspunch.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Snatch': {
                        addMessageToChat(BattleText.snatch.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                }
                break;
            }
        }
    }
}

/** Función auxiliar que utilizo para trackear los cambios en los usuarios. */
const showUserDetails = () => {
    console.log('BATTLE USER: ');
    console.log(store.state.battleUser);
    console.log('BATTLE RIVAL: ');
    console.log(store.state.battleRival);
}

/** Función auxiliar que utilizo para trackear las fieldConditions. */
const showFieldConditionsDetails = () => {
    console.log('FIELD CONDITIONS: ');
    console.log(store.state.fieldConditions);
}

/** Función auxiliar que utilizo para trackear las sideConditions. */
const showSideConditionsDetails = () => {
    console.log('USER SIDE CONDITIONS: ');
    console.log(store.state.userSideConditions);
    console.log('RIVAL SIDE CONDITIONS: ');
    console.log(store.state.rivalSideConditions);
}


/** Añadir mensaje al chat. */
const addMessageToChat = (message: string, id: string) => {
    const rivalText = 'The opposing ';
    if (id === battleRival.id) {
        message = rivalText.concat(message);
    }
    store.commit('ADD_MESSAGE', message);
}

/** Añadir mensaje al chat indicando que la habilidad de un Pokémon se ha activado. */
const addMessageToChatAbility = (message: string, id: string) => {
    const rivalText = '[The opposing ';
    if (id === battleRival.id) {
        message = message.substring(1);
        message = rivalText.concat(message);
    }
    store.commit('ADD_MESSAGE', message);
}

/** Llenar el equipo rival con los Pokémon del equipo rival que van saliendo al campo de batalla; ó actualizar la condition de los Pokémon que ya están metidos en el equipo rival. */
const updateRivalTeam = (pokemonSwitchedIn: IBattlePokemon) => {
    let alreadyInTeam = false;
    let index = 0;
    for (let i = 0; i < battleRival.team.length; i++){
        if (battleRival.team[i].ident === pokemonSwitchedIn.ident) {
            alreadyInTeam = true;
            index = i;
        }
    }

    if (!alreadyInTeam) { /** Si el Pokémon no estaba en el equipo, se añade. */
        battleRival.team.push(pokemonSwitchedIn);
    } else { /** Si el Pokémon sí estaba en el equipo, se actualiza su condition. */
        battleRival.team[index].condition = pokemonSwitchedIn.condition;
    }
}

/** Actualizar la vida de los Pokémon, tanto del usuario como del rival. */
const updatePokemonHP = (pokemonIdent: string, playerID: string, newCondition: string) => {
    let HPpreUpdate = 0;
    let maxHP = 0;

    if(playerID === battleUser.id) {
        for (let i = 0; i < battleUser.team.length; i++) {
            if (battleUser.team[i].ident.split(' ')[1] === pokemonIdent.split(' ')[1]) {
                HPpreUpdate = parseInt(battleUser.team[i].condition.split(' ')[0].split('/')[0]);
                maxHP = parseInt(battleUser.team[i].condition.split(' ')[0].split('/')[1])
                battleUser.team[i].condition = newCondition;
            }
        }
    } else if (playerID === battleRival.id){
        for (let i = 0; i < battleRival.team.length; i++) {
            if (battleRival.team[i].ident === pokemonIdent) {
                HPpreUpdate = parseInt(battleRival.team[i].condition.split(' ')[0].split('/')[0]);
                maxHP = parseInt(battleRival.team[i].condition.split(' ')[0].split('/')[1])
                battleRival.team[i].condition = newCondition;
            }
        }
    }

    return {HPpreUpdate, maxHP};
}

/** Añadir status a la condition de un Pokémon. */
const addStatus = (pokemonIdent: string, pokemonStatus: string, playerID: string) => {
    let newCondition: string;

    if(playerID === battleUser.id) {
        for (let i = 0; i < battleUser.team.length; i++) {
            if (battleUser.team[i].ident.split(' ')[1] === pokemonIdent.split(' ')[1]) {
                newCondition = battleUser.team[i].condition.concat(' ', pokemonStatus);
                battleUser.team[i].condition = newCondition;
            }
        }
    } else if (playerID === battleRival.id){
        for (let i = 0; i < battleRival.team.length; i++) {
            if (battleRival.team[i].ident === pokemonIdent) {
                newCondition = battleRival.team[i].condition.concat(' ', pokemonStatus);
                battleRival.team[i].condition = newCondition;
            }
        }
    }
}

/** Eliminar status de la condition de un Pokémon. */
const removeStatus = (pokemonIdent: string, pokemonStatus: string, playerID: string) => {
    let newCondition: string;

    if(playerID === battleUser.id) {
        for (let i = 0; i < battleUser.team.length; i++) {
            if (battleUser.team[i].ident.split(' ')[1] === pokemonIdent.split(' ')[1]) {
                newCondition = battleUser.team[i].condition.split(' ')[0];
                battleUser.team[i].condition = newCondition;
            }
        }
    } else if (playerID === battleRival.id){
        for (let i = 0; i < battleRival.team.length; i++) {
            if (battleRival.team[i].ident === pokemonIdent) {
                newCondition = battleRival.team[i].condition.split(' ')[0];
                battleRival.team[i].condition = newCondition;
            }
        }
    }
}

/** Quitar todos los status de un equipo entero, ya sea el del usuario o el del rival. */
const removeAllStatus = (playerID: string) => {
    let newCondition: string;

    if(playerID === battleUser.id) {
        for (let i = 0; i < battleUser.team.length; i++) {
            if (battleUser.team[i].condition.split(' ')[1] != null && battleUser.team[i].condition.split(' ')[1] != 'fnt') {
                newCondition = battleUser.team[i].condition.split(' ')[0];
                battleUser.team[i].condition = newCondition;
            }
        }
    } else if (playerID === battleRival.id){
        for (let i = 0; i < battleRival.team.length; i++) {
            if (battleRival.team[i].condition.split(' ')[1] != null && battleRival.team[i].condition.split(' ')[1] != 'fnt') {
                newCondition = battleRival.team[i].condition.split(' ')[0];
                battleRival.team[i].condition = newCondition;
            }
        }
    }
}

/** Actualizar PPs de los Pokémon del equipo del usuario. */
const updatePPsUserTeam = (request: string) => {
    const requestJSON = JSON.parse(request);
    const activeData = requestJSON.active[0];

    for (let j = 0; j < battleUser.team.length; j++) {
        if (battleUser.team[j].active === true) {
            battleUser.team[j].moves = activeData.moves;
        }
    }
}

/** Añadir los movimientos de los Pokémon del equipo rival. */
const updateRivalMoves = (pokemonIdent: string, move: string) => {
    let moveAlreadyAdded = false;
    let pokemonIndex = 0;

    for (let i = 0; i < battleRival.team.length; i++) {
        if (battleRival.team[i].ident === pokemonIdent) {
            pokemonIndex = i;
            for (let j = 0; j < battleRival.team[i].moves.length; j++) {
                if (battleRival.team[i].moves[j].move === move) {
                    moveAlreadyAdded = true;
                }
            }
        }
    }

    if (moveAlreadyAdded === false) {
        const newMove: IMove = {
            move: move,
            id: '',
            pp: 0,
            maxpp: 0,
            target: '',
            disabled: false,
        }
        battleRival.team[pokemonIndex].moves.push(newMove);
    }

}

/** Establecer las fieldConditions. */
const setFieldConditions = (active: boolean, type: string) => {
    fieldConditions.weather.active = active;
    fieldConditions.weather.type = type;
    //store.commit('SET_FIELDCONDITIONS', fieldConditions);
}

/** Poner a 0 todos los boosts de un side. */
const clearBoosts = (playerID: string) => {
    if (playerID === battleUser.id) {
        userSideConditions.boosts.atk = 0;
        userSideConditions.boosts.def = 0;
        userSideConditions.boosts.spa = 0;
        userSideConditions.boosts.spd = 0;
        userSideConditions.boosts.spe = 0;
        userSideConditions.boosts.acc = 0;
    } else if (playerID === battleRival.id) {
        rivalSideConditions.boosts.atk = 0;
        rivalSideConditions.boosts.def = 0;
        rivalSideConditions.boosts.spa = 0;
        rivalSideConditions.boosts.spd = 0;
        rivalSideConditions.boosts.spe = 0;
        rivalSideConditions.boosts.acc = 0;
    }
}

/** Establecer qué Pokémon del usuario está activo en cada momento. */
const setActivePokemon = (request: string) => {
    const requestJSON = JSON.parse(request);
    let pokemonIdentActive = '';

    for (let i = 0; i < requestJSON.side.pokemon.length; i++) {
        if (requestJSON.side.pokemon[i].active === true) {
            pokemonIdentActive = requestJSON.side.pokemon[i].ident;
        }
    }

    for (let i = 0; i < battleUser.team.length; i++) {
        if (battleUser.team[i].ident === pokemonIdentActive) {
            battleUser.team[i].active = true;
        } else {
            battleUser.team[i].active = false;
        }
    }
}

/** Establecer a qué Pokémon se pueden cambiar cuando el usuario está obligado a hacer un cambio del Pokémon activo. */
const setPokemonToSwitchIn = (request: string) => {
    const requestJSON = JSON.parse(request);
    const pokemonToSwitchIn : string[] = [];

    for (let i = 0; i<requestJSON.side.pokemon.length; i++) {
        if (requestJSON.side.pokemon[i].condition != '0 fnt' && requestJSON.side.pokemon[i].active === false) {
            pokemonToSwitchIn.push(requestJSON.side.pokemon[i].details.split(',')[0]);
        }
    }

    store.commit('SET_POKEMONTOSWITCHIN', pokemonToSwitchIn);
}



/** Añadir tipo del movimiento a los movimientos del Pokémon activo en la batalla. */
const getMoveType = async (moveName: string) => {
    const moveData = await getMoveData(moveName);
    const moveType = moveData.data.baseMoveType;
    return moveType;
}

