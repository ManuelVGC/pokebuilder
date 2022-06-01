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
