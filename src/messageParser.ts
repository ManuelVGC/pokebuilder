import store from "@/store";
import router from "@/router";
import {BattleUser} from "@/interfaces/BattleUser";
import {BattlePokemon} from "@/interfaces/BattlePokemon";
import {BattleText} from "@/assets/battleText";

//Este .ts es el que se encarga de realizar la labor de traducir los mensajes que llegan desde Showdown e interpretar dicha información

const battleUser = new BattleUser();
const battleRival = new BattleUser();

let pokemonName: string;
let playerID: string;
let move: string;

//Manejo de mensajes globales, en caso de no tratarse de un mensaje global, se tratará de un mensaje propio de una batalla
export const messageParser = (messageData: string) => {
    console.log('El data es: ' + messageData);
    let messages: string[];
    let parts : string[];
    // eslint-disable-next-line prefer-const
    parts = messageData.substring(1).split('|');
    switch(parts[0]){
        //mensajes globales
        case 'challstr': { //mensaje que nos da el challstr, necesario para el logeo en Pokémon Showdown
            store.commit('SET_CHALLSTR', parts[1] + '|' + (parts[2]));
            break;
        }
        case 'updateuser':
            break;
        case 'updatesearch': { //mensaje que indica el estado de búsqueda de una batalla
            const searchData = JSON.parse(parts[1]);
            if (searchData.games != null) { //cuando se encuentra una partida pasamos a Battle.vue
                const battleInfo = Object.keys(searchData.games)[0];
                console.log('La battle info es: ');
                console.log(battleInfo);
                const battleID = battleInfo.split('-')[2];
                store.commit('SET_BATTLEINFO', battleInfo);
                router.push('/battle/' + battleID);
            }
            break;
        }
        //mensajes de batalla
        default: //divido el mensaje por \n para guardar todos los mensajes individuales que se mandan dentro de este
            messages = messageData.substring(1).split('\n');
            battleMessagesParser(messages);
    }
}

//Manejo de mensajes de batalla
const battleMessagesParser = (messages : string[]) => {
    let message: string[];

    if (messages[0].startsWith(store.state.battleInfo) && messages[0].trim() != store.state.battleInfo) { //a veces showdown añade una subcadena a la info de batalla original, así que lo que hago aquí es cambiarla para que funcione correctamente la batalla
        store.commit('SET_BATTLEINFO', messages[0].trim());
    }

    for (let i = 0; i < messages.length; i++) {
        message = messages[i].substring(1).split('|'); //divido cada mensaje por '|' para tener todos sus campos en el array
        switch (message[0]){ //comprobamos el primer campo de cada mensaje para ver qué nos indica
            //Mensajes que llegan al inicio de la batalla
            case 'player': { //llega un mensaje del tipo |player|PLAYER|USERNAME|AVATAR|RATING, nos da la información básica de cada usuario de la batalla
                if (message[2] === store.state.user.username) {
                    battleUser.id = message[1];
                    battleUser.username = message[2];
                    battleUser.avatar = message[3];
                    store.commit('SET_BATTLEUSER', battleUser);
                } else {
                    battleRival.id = message[1];
                    battleRival.username = message[2];
                    battleRival.avatar = message[3];
                    store.commit('SET_BATTLERIVAL', battleRival);
                }
                break;
            }
            case 'rules': {
                //lo construyo más adelante pero la idea sería coger el mensaje que me pasan y ponerlo en el chat
                break;
            }

            //Mensajes que tienen que ver con el progreso de la batalla
            case 'request': { //llega un mensaje del tipo |request|REQUEST, donde REQUEST es un JSON con la información de mi usuario
                if (message[1] != '' && store.state.battleUser.team.length === 0) {
                    const request = JSON.parse(message[1]);

                    battleUser.team = request.side.pokemon;
                    store.commit('SET_BATTLEUSER', battleUser);
                }
                break;
            }
            case 'inactive': {
                //lo contruyo más adelante, mensaje relacionado con el timer de la batalla
                break;
            }
            case 'turn': { //turno en el que se encuentra la batalla. Es un mensaje del tipo |turn|NUMBER
                //lo contruyo más adelante con el chat
                store.commit('ADD_MESSAGE', 'Turn ' + message[1]);
                showUserDetails();
                break;
            }
            case 'win': { //ganador de la batalla. Es un mensaje del tipo |win|USER
                //lo contruyo más adelante con el chat
                break;
            }


            //Mensajes de acciones dentro de una batalla
            //Acciones mayores
            case  'move': { //llega un mensaje del tipo |move|POKEMON|MOVE|TARGET. El Pokémon POKEMON ataca a TARGET con MOVE.
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);
                const move = message[2].trim();

                addMessageToChat(BattleText.move.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
                break;
            }
            case 'switch': case 'drag': { //|switch|POKEMON|DETAILS|HP STATUS y |drag|POKEMON|DETAILS|HP STATUS
                let messageToChat = '';
                pokemonName = message[1].split(' ')[1].trim();

                if (message[1].substring(0,2) === battleUser.id) {
                    messageToChat = BattleText.switchIn.replace('[TRAINER]', battleUser.username).replace('[POKEMON]', pokemonName);
                } else if (message[1].substring(0,2) === battleRival.id) {
                    const pokemonSwitchedIn : BattlePokemon = {
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
                        moves : {
                            move1 : '',
                            move2 : '',
                            move3 : '',
                            move4 : '',
                        },
                        baseAbility : '',
                        item : '',
                        pokeball : '',
                    };
                    updateRivalTeam(pokemonSwitchedIn);
                    messageToChat = BattleText.switchIn.replace('[TRAINER]', battleRival.username).replace('[POKEMON]', pokemonName);
                }
                store.commit('ADD_MESSAGE', messageToChat);
                break;
            }
            //case 'detailschange':
            case '-formechange': { //|detailschange|POKEMON|DETAILS|HP STATUS ó |-formechange|POKEMON|SPECIES|FROM
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
            case 'cant': { //|cant|POKEMON|REASON ó |cant|POKEMON|REASON|MOVE
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
                        store.commit('ADD_MESSAGE', BattleText.fail);
                        break;
                    }
                }
                break;
            }
            case 'faint': { //|faint|POKEMON
                pokemonName = message[1].split(' ')[1].trim();
                playerID = message[1].substring(0,2);

                addMessageToChat(BattleText.faint.replace('[POKEMON]', pokemonName), playerID);
                break;
            }

            //Acciones menores
            case '-fail': { //|-fail|POKEMON|ACTION
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
                            console.log(message.length);
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
            //case '-notarget': {break;}
            case '-miss': { //|-miss|SOURCE|TARGET
                pokemonName = message[2].split(' ')[1].trim();
                playerID = message[2].substring(0,2);

                addMessageToChat(BattleText.miss.replace('[POKEMON]', pokemonName), playerID);
                break;
            }
            case '-damage': { //|-damage|POKEMON|HP STATUS|REASON
                pokemonName = message[1].split(' ')[1].trim()
                playerID = message[1].substring(0,2);
                const pokemonIdent = message[1].trim();
                const condition = message[2].trim();
                let reason: string;
                const {HPpreUpdate, maxHP} = updatePokemonHP(pokemonIdent, playerID, condition); //actualizamos la vida del Pokémon y recuperamos su vida antes del daño
                const HPpostDamage = parseInt(condition.split(' ')[0].split('/')[0]);
                const damage = ((HPpreUpdate-HPpostDamage)/maxHP*100).toFixed(1);

                if (message[3] != null) { //Si el daño no es causado por un ataque directo
                    reason = message[3].substring(7).trim(); //la reason es del tipo [from] psn
                    switch (reason) {
                        case 'psn': {
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
                        case 'Leech Seed': { //este caso es la razón por la que no se hace simplemente un split(' ')[1] para sacar la reason, porque saldría Leech
                            addMessageToChat(BattleText.leechseed.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Spikes': {
                            addMessageToChat(BattleText.spikes.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
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
                                    }
                                }
                            }
                        }
                    }

                } else { //Si el daño es causado por un ataque directo
                    addMessageToChat(BattleText.damagePercentage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                }

                /*if(condition === '0 fnt') { //el Pokémon se debilita
                    addMessageToChat(BattleText.faint.replace('[POKEMON]', pokemonName), playerID);
                }*/

                break;
            }
            case '-heal': { //|-heal|POKEMON|HP STATUS
                pokemonName = message[1].split(' ')[1].trim()
                playerID = message[1].substring(0,2);
                const pokemonIdent = message[1].trim();
                const condition = message[2].trim();
                let reason: string;
                const {HPpreUpdate, maxHP} = updatePokemonHP(pokemonIdent, playerID, condition); //actualizamos la vida del Pokémon y recuperamos su vida antes del daño
                const HPpostDamage = parseInt(condition.split(' ')[0].split('/')[0]);
                const heal = ((HPpostDamage-HPpreUpdate)/maxHP*100).toFixed(1);

                if (message[3] != null && message[3].split(' ')[1] != null) { //Si Showdown te indica de qué fuente obtiene el Pokémon la curación
                    reason = message[3].split(' ')[1].trim(); //la reason es del tipo [from] item: Leftovers

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

                } else { //Si Showdown no te indica de qué fuente obtiene el Pokémon la curación
                    addMessageToChat(BattleText.heal.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', heal + '%'), playerID);
                }
                break;
            }
            case '-sethp': { //|-sethp|POKEMON|HP
                pokemonName = message[1].split(' ')[1].trim()
                playerID = message[1].substring(0,2);
                const pokemonIdent = message[1].trim();
                const condition = message[2].trim();
                let reason: string;
                let HPdifference: string;

                const {HPpreUpdate, maxHP} = updatePokemonHP(pokemonIdent, playerID, condition); //actualizamos la vida del Pokémon y recuperamos su vida antes del daño
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
            case '-status': { //|-status|POKEMON|STATUS
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
            case '-curestatus': { //|-curestatus|POKEMON|STATUS
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
            case '-cureteam': { //|-cureteam|POKEMON
                playerID = message[1].substring(0,2);
                pokemonName = message[1].split(' ')[1];

                removeAllStatus(playerID);
                store.commit('ADD_MESSAGE', BattleText.teamcured.replace('[POKEMON]', pokemonName));

                break;
            }
            case '-boost': {
                break;
            }
            case '-unboost': {
                break;
            }
            case '-setboost': {
                break;
            }
            case '-swapboost': {
                break;
            }
            case '-invertboost': {
                break;
            }
            case '-clearboost': {
                break;
            }
            case '-clearallboost': {
                break;
            }
            case '-clearpositiveboost': {
                break;
            }
            case '-clearnegativeboost': {
                break;
            }
            case '-copyboost': {
                break;
            }
            case '-weather': {
                break;
            }
            case '-fieldstart': {
                break;
            }
            case '-fieldend': {
                break;
            }
            case '-sidestart': {
                break;
            }
            case '-sideend': {
                break;
            }
            case '-swapsideconditions': {
                break;
            }
            case '-start': { //|-start|POKEMON|EFFECT empieza un efecto volatil sobre un Pokémon
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
                        addMessageToChat(BattleText.leechseed.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'Mimic': {
                        const move = message[3].trim();
                        addMessageToChat(BattleText.mimic.start.replace('[POKEMON]', pokemonName).replace('[MOVE]', move), playerID);
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
                        addMessageToChat(BattleText.confusion.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'move: Yawn': {
                        addMessageToChat(BattleText.yawn.start.replace('[POKEMON]', pokemonName), playerID);
                        break;
                    }
                    case 'ability: Flash Fire': {
                        const ability = 'Flash Fire';
                        const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonName).replace('[ABILITY]', ability);

                        addMessageToChatAbility(messageToChat, playerID);
                        addMessageToChat(BattleText.flashfire.start.replace('[POKEMON]', pokemonName), playerID);
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
            case '-end': { //|-end|POKEMON|EFFECT
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
                }
                break;
            }
            case '-crit': { //|-crit|POKEMON
                store.commit('ADD_MESSAGE', BattleText.crit);
                break;
            }
            case '-supereffective': { //|-supereffective|POKEMON
                store.commit('ADD_MESSAGE', BattleText.superEffective);
                break;
            }
            case '-resisted': { //|-resisted|POKEMON
                store.commit('ADD_MESSAGE', BattleText.resisted);
                break;
            }
            case '-immune': { //|-immune|POKEMON
                pokemonName = message[1].split(' ')[1];
                store.commit('ADD_MESSAGE', BattleText.immune.replace('[POKEMON]', pokemonName));
                break;
            }
            case '-item': { //|-item|POKEMON|ITEM|[from]EFFECT
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
            case '-enditem': { //|-enditem|POKEMON|ITEM|[from]EFFECT
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
            case '-ability': { //|-ability|POKEMON|ABILITY|[from]EFFECT
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
            //case '-endability': {break;}
            case '-transform': { //|-transform|POKEMON|SPECIES
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
            case '-activate': { //|-activate|POKEMON|EFFECT
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
                        case 'Protect': {
                            addMessageToChat(BattleText.protect.block.replace('[POKEMON]', pokemonName), playerID);
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
                        case 'Lock-On': {
                            const pokemonSource = message[3].split(' ')[2].trim();
                            addMessageToChat(BattleText.lockon.start.replace('[POKEMON]', pokemonSource).replace('[SOURCE]', pokemonName), playerID);
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
                            addMessageToChat(BattleText.endure.start.replace('[POKEMON]', pokemonName), playerID);
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
                    addMessageToChat(BattleText.substitute.activate.replace('[POKEMON]', pokemonName), playerID);
                }
                break;
            }
            case '-hint': {
                break;
            }
            case '-center': {
                break;
            }
            case '-message': {
                break;
            }
            case '-combine': {
                break;
            }
            case '-waiting': {
                break;
            }
            case '-prepare': {
                break;
            }
            case '-mustrecharge': {
                break;
            }
            case '-nothing': {
                break;
            }
            case '-hitcount': {
                break;
            }
            case '-singlemove': {
                break;
            }
            case '-singleturn': {
                break;
            }
        }
    }
}

//Función que utilizo para trackear los cambios en los usuarios
const showUserDetails = () => {
    console.log('BATTLE USER: ');
    console.log(store.state.battleUser);
    console.log('BATTLE RIVAL: ');
    console.log(store.state.battleRival);
}

const addMessageToChat = (message: string, id: string) => {
    const rivalText = 'The opposing ';
    if (id === battleRival.id) {
        message = rivalText.concat(message);
    }
    store.commit('ADD_MESSAGE', message);
}

const addMessageToChatAbility = (message: string, id: string) => {
    console.log(message);
    const rivalText = '[The opposing ';
    if (id === battleRival.id) {
        message = message.substring(1);
        message = rivalText.concat(message);
    }
    store.commit('ADD_MESSAGE', message);
}

const updateRivalTeam = (pokemonSwitchedIn: BattlePokemon) => {
    let alreadyInTeam = false;
    let index = 0;
    for (let i = 0; i < battleRival.team.length; i++){
        if (battleRival.team[i].details === pokemonSwitchedIn.details) { //si se añade el detailschange quizá esto se cambiaría por .ident en vez de .details
            alreadyInTeam = true;
            index = i;
        }
    }

    if (!alreadyInTeam) { //Si el Pokémon no estaba en el equipo, se añade
        battleRival.team.push(pokemonSwitchedIn);
    } else { //Si el Pokémon sí estaba en el equipo, se actualiza su condition, es decir, su vida
        battleRival.team[index].condition = pokemonSwitchedIn.condition;
    }
}

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

