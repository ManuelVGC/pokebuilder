import { createStore } from 'vuex'
import {User} from "@/interfaces/User";
import {IBattleUser} from "@/interfaces/BattleUser";

export default createStore({
    state: {
        user: {} as User,
        battleUser1: {} as IBattleUser,
        battleUser2: {} as IBattleUser,
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
        SET_BATTLEUSER1(state: any, battleUser: IBattleUser){
            state.battleUser1 = battleUser;
        },
        SET_BATTLEUSER2(state: any, battleUser: IBattleUser){
            state.battleUser2 = battleUser;
        },
    }
})


