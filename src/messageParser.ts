import store from "@/store";
import router from "@/router";
import {BattleUser} from "@/interfaces/BattleUser";

//Este .ts es el que se encarga de realizar la labor de traducir los mensajes que llegan desde Showdown e interpretar dicha información

const battleUser1 = new BattleUser();
const battleUser2 = new BattleUser();

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
                if (message[i+1] === 'p1') {
                    battleUser1.id = message[i+1];
                    battleUser1.username = message[i+2];
                    battleUser1.avatar = message[i+3];
                    store.commit('SET_BATTLEUSER1', battleUser1);
                    showUserDetails();
                } else if (message[i+1] === 'p2') {
                    battleUser2.id = message[i+1];
                    battleUser2.username = message[i+2];
                    battleUser2.avatar = message[i+3];
                    store.commit('SET_BATTLEUSER2', battleUser2);
                    showUserDetails();
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
                    if (request.side.id === 'p1') {
                        battleUser1.team = request.side.pokemon;
                        store.commit('SET_BATTLEUSER1', battleUser1);
                        showUserDetails();
                    } else if (request.side.id === 'p2') {
                        battleUser2.team = request.side.pokemon;
                        store.commit('SET_BATTLEUSER2', battleUser2);
                        showUserDetails();
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
            case 'switch': case 'drag': {
                break;
            }
            case 'detailschange': {
                break;
            }
            case 'replace': {
                break;
            }
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
    console.log('BATTLE USER 1: ');
    console.log(store.state.battleUser1);
    console.log('BATTLE USER 2: ');
    console.log(store.state.battleUser2);
}
