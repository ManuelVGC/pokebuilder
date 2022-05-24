import { createStore } from 'vuex'
import {User} from "@/interfaces/User";

export default createStore({
    state: {
        user: {} as User,
    },
    getters: {},
    actions: {

    },
    mutations: {
        SET_CHALLSTR(state, challstr) {
            state.user.challstr = challstr;
        },
        SET_USERNAME(state, username) {
            state.user.username = username;
        },
        SET_PASSWORD(state, password) {
            state.user.password = password;
        }
    }
})
