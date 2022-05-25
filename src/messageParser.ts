import store from "@/store";
import router from "@/router";
import {BattleUser} from "@/interfaces/BattleUser";
import {isMemoSame} from "vue";

export const messageParser = (data: string) => {
    console.log('El data es: ' + data);
    let parts : string[];
    // eslint-disable-next-line prefer-const
    parts = data.substring(1).split('|');
    switch(parts[0]){
        //mensajes globales
        case 'challstr': {
            store.commit('SET_CHALLSTR', parts[1] + '|' + (parts[2]));
            break;
        }
        case 'updateuser':
            break;
        case 'updatesearch': {
            const data = JSON.parse(parts[1]);
            if (data.games != null) { //cuando se encuentra una partida pasamos a Battle.vue
                const gameInfo = Object.keys(data.games)[0];
                const battleID = gameInfo.split('-')[2];
                router.push('/battle/' + battleID);
            }
            break;
        }
        default:
            battleMessagesParser(parts);
    }
}

const battleMessagesParser = (message : string[]) => {
    //inicio los dos usuarios sin datos:
    const battleUser1 = new BattleUser();
    const battleUser2 = new BattleUser();

    //recorro el mensaje y voy buscando las partes que me interesan
    for (let i = 0; i <= message.length; i++) {
        switch (message[i]) {
            case 'player': { //llega un mensaje del tipo |player|PLAYER|USERNAME|AVATAR|RATING
                if (message[i+1] === 'p1') {
                    battleUser1.id = message[i+1];
                    battleUser1.username = message[i+2];
                    battleUser1.avatar = message[i+3];
                    store.commit('SET_BATTLEUSER1', battleUser1);
                } else if (message[i+1] === 'p2') {
                    battleUser2.id = message[i+1];
                    battleUser2.username = message[i+2];
                    battleUser2.avatar = message[i+3];
                    store.commit('SET_BATTLEUSER2', battleUser2);
                }
                break;
            }
            case 'rules': {
                //lo construyo más adelante pero la idea sería coger el mensaje que me pasan y ponerlo en el chat
                break;
            }
            case 'request': { //llega un mensaje del tipo |request|REQUEST, donde REQUEST es un JSON con la información de mi usuario
                const request = JSON.parse(message[i+1]);
                if (request.side.id === 'p1') {
                    battleUser1.team = request.side.pokemon;
                }
            }

        }
    }
    console.log(message);
}
