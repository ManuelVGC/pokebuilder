import store from "@/store";

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
        case 'updatesearch':
            break;
        default:
            console.log('se ha metido por donde no debía');
    }
    //parte de mensajes globales
    //parte de batallas
}
