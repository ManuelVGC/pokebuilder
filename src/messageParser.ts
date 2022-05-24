import store from "@/store";
import router from "@/router";

export const messageParser = (data: string) => {
    console.log('El data es: ' + data);
    let parts : string[];
    // eslint-disable-next-line prefer-const
    parts = data.substring(1).split('|');
    switch(parts[0]){
        case 'challstr':
            store.commit('SET_CHALLSTR', parts[1] + '|' + (parts[2]));
            break;
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
            console.log('se ha metido por donde no debía');
    }
    //parte de mensajes globales
    //parte de batallas
}
