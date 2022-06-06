import store from "@/store";
import router from "@/router";
import {BattleUser} from "@/interfaces/BattleUser";
import {BattlePokemon} from "@/interfaces/BattlePokemon";
import {BattleText} from "@/assets/battleText";

//Este .ts es el que se encarga de realizar la labor de traducir los mensajes que llegan desde Showdown e interpretar dicha información

const battleUser = new BattleUser();
const battleRival = new BattleUser();


//Manejo de mensajes globales, en caso de no tratarse de un mensaje global, se tratará de un mensaje propio de una batalla
export const messageParser = (data: string) => {
    console.log('El data es: ' + data);
    let parts : string[];
    // eslint-disable-next-line prefer-const
    parts = data.substring(1).split('|');
    switch(parts[0]){
        //mensajes globales
        case 'challstr': { //mensaje que nos da el challstr, necesario para el logeo en Pokémon Showdown
            store.commit('SET_CHALLSTR', parts[1] + '|' + (parts[2]));
            break;
        }
        case 'updateuser':
            break;
        case 'updatesearch': { //mensaje que indica el estado de búsqueda de una batalla
            const data = JSON.parse(parts[1]);
            if (data.games != null) { //cuando se encuentra una partida pasamos a Battle.vue
                const battleInfo = Object.keys(data.games)[0];
                console.log('La battle info es: ');
                console.log(battleInfo);
                const battleID = battleInfo.split('-')[2];
                store.commit('SET_BATTLEINFO', battleInfo);
                router.push('/battle/' + battleID);
            }
            break;
        }
        //mensajes de batalla
        default:
            battleMessagesParser(parts);
    }
}

//Manejo de mensajes de batalla
const battleMessagesParser = (message : string[]) => {
    if (message[0].startsWith(store.state.battleInfo) && message[0].trim() != store.state.battleInfo) { //a veces showdown añade una subcadena a la info de batalla original, así que lo que hago aquí es cambiarla para que funcione correctamente la batalla
        store.commit('SET_BATTLEINFO', message[0].trim());
    }
    //recorro el mensaje y voy buscando las partes que me interesan
    for (let i = 0; i <= message.length; i++) {
        switch (message[i]) {
            //Mensajes que llegan al inicio de la batalla
            case 'player': { //llega un mensaje del tipo |player|PLAYER|USERNAME|AVATAR|RATING, nos da la información básica de cada usuario de la batalla
                if (message[i+2] === store.state.user.username) {
                    battleUser.id = message[i+1];
                    battleUser.username = message[i+2];
                    battleUser.avatar = message[i+3];
                    store.commit('SET_BATTLEUSER', battleUser);
                } else {
                    battleRival.id = message[i+1];
                    battleRival.username = message[i+2];
                    battleRival.avatar = message[i+3];
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
                if (message[i+1] != '') {
                    const request = JSON.parse(message[i+1]);
                    if (request.side.id === battleUser.id) {
                        battleUser.team = request.side.pokemon;
                        store.commit('SET_BATTLEUSER', battleUser);
                    } else if (request.side.id === battleRival.id) {
                        battleRival.team = request.side.pokemon;
                        store.commit('SET_BATTLERIVAL', battleRival);
                    }
                }
                break;
            }
            case 'inactive': {
                //lo contruyo más adelante, mensaje relacionado con el timer de la batalla
                break;
            }
            case 'turn': { //turno en el que se encuentra la batalla. Es un mensaje del tipo |turn|NUMBER
                //lo contruyo más adelante con el chat
                store.commit('ADD_MESSAGE', 'Turn ' + message[i+1]);
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
                if (message[i+1].substring(0,2) === battleUser.id) {
                    messageToChat = BattleText.switchIn.replace('[TRAINER]', battleUser.username).replace('[POKEMON]', message[i+1].substring(4));
                } else if (message[i+1].substring(0,2) === battleRival.id) {
                    const pokemonSwitchedIn : BattlePokemon = {
                        ident : message[i+1],
                        details : message[i+2],
                        condition : message[i+3],
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
                    messageToChat = BattleText.switchIn.replace('[TRAINER]', battleRival.username).replace('[POKEMON]', message[i+1].substring(4));
                }
                store.commit('ADD_MESSAGE', messageToChat);
                break;
            }
            //case 'detailschange':
            case '-formechange': { //|detailschange|POKEMON|DETAILS|HP STATUS ó |-formechange|POKEMON|SPECIES|FROM
                //FROMABILITY
                if (message[i+4].startsWith('[from] ability')) {
                    const ability = message[i+4].substring(16).trim();
                    const messageToChat = BattleText.abilityActivation.replace('[POKEMON]', message[i+1].split(' ')[1]).replace('[ABILITY]', ability);
                    addMessageToChat(messageToChat, message[i+1].substring(0,2));
                }

                //Pokemon transformed!
                addMessageToChat(BattleText.pokemonTransformed.replace('[POKEMON]', message[i+1].split(' ')[1]), message[i+1].substring(0,2));
                break;
            }
            //case 'replace': {break;}
            case 'swap': {
                break;
            }
            case 'cant': {
                break;
            }
            case 'faint': {
                break;
            }

            //Acciones menores
            case '-fail': {
                break;
            }
            case '-block': {
                break;
            }
            case '-notarget': {
                break;
            }
            case '-miss': {
                break;
            }
            case '-damage': {
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

const updateRivalTeam = (pokemonSwitchedIn: BattlePokemon) => {
    let alreadyInTeam = false;
    let index = 0;
    for (let i = 0; i < battleRival.team.length; i++){
        if (battleRival.team[i].details === pokemonSwitchedIn.details) { //si se añade el detailschange quizá esto se cambiaría por .ident en vez de .details
            alreadyInTeam = true;
            index = i;
        }
    }

    if (alreadyInTeam === false) { //Si el Pokémon no estaba en el equipo, se añade
        battleRival.team.push(pokemonSwitchedIn);
    } else { //Si el Pokémon sí estaba en el equipo, se actualiza su condition, es decir, su vida
        battleRival.team[index].condition = pokemonSwitchedIn.condition;
    }
}

