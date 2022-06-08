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

                switch (message[2]) {
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
                    default: {
                        store.commit('ADD_MESSAGE', BattleText.fail.replace('[POKEMON]', pokemonName));
                        break;
                    }
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
                    console.log('la reason es: ' + reason);
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
                        case 'Leech Seed': {
                            addMessageToChat(BattleText.leechseed.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        case 'Spikes': {
                            addMessageToChat(BattleText.spikes.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
                            break;
                        }
                        default: {
                            if (reason.split(' ')[0].trim() === 'ability:') { //si la reason es por una habilidad de un pokemon se hace un caso aparte
                                const pokemonActiveAbility = message[4].split(' ')[2].trim();
                                const playerIDActiveAbility = message[4].split(' ')[1].substring(0,2).trim()
                                const ability = message[3].substring(16).trim();
                                const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', pokemonActiveAbility).replace('[ABILITY]', ability);

                                addMessageToChatAbility(messageToChat, playerIDActiveAbility);

                                if (ability === 'Liquid Ooze') {
                                    addMessageToChat(BattleText.liquidooze.damage.replace('[POKEMON]', pokemonName).replace('[PERCENTAGE]', damage + '%'), playerID);
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
            case '-heal': {
                break;
            }
            case '-sethp': {
                break;
            }
            case '-status': {
                break;
            }
            case '-curestatus': {
                break;
            }
            case '-cureteam': {
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
            case '-start': {
                break;
            }
            case '-end': {
                break;
            }
            case '-crit': {
                break;
            }
            case '-supereffective': {
                break;
            }
            case '-resisted': {
                break;
            }
            case '-immune': {
                break;
            }
            case '-item': {
                break;
            }
            case '-enditem': {
                break;
            }
            case '-ability': {
                break;
            }
            case '-endability': {
                break;
            }
            case '-transform': {
                break;
            }
            case '-mega': {
                break;
            }
            case '-primal': {
                break;
            }
            case '-burst': {
                break;
            }
            case '-zpower': {
                break;
            }
            case '-zbroken': {
                break;
            }
            case '-activate': {
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

