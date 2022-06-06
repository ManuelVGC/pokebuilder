import { createStore } from 'vuex'
import {User} from "@/interfaces/User";
import {IBattleUser} from "@/interfaces/BattleUser";

export default createStore({
    state: {
        user: {} as User,
        battleInfo: '' as string,
        battleUser: {} as IBattleUser,
        battleRival: {} as IBattleUser,
        chatMessages: [] as string[],
    },
    getters: {},
    actions: {

    },
    mutations: {
        SET_CHALLSTR(state: any, challstr: string) {
            state.user.challstr = challstr;
        },
        SET_USERNAME(state: any, username: string) {
            state.user.username = username;
        },
        SET_PASSWORD(state: any, password: string) {
            state.user.password = password;
        },
        SET_BATTLEINFO(state: any, battleInfo: string) {
            state.battleInfo = battleInfo;
        },
        SET_BATTLEUSER(state: any, battleUser: IBattleUser){
            state.battleUser = battleUser;
        },
        SET_BATTLERIVAL(state: any, battleRival: IBattleUser){
            state.battleRival = battleRival;
        },
        ADD_MESSAGE(state: any, message: string){
            state.chatMessages.push(message);
        }
    }
})


