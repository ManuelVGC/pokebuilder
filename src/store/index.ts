import { createStore } from 'vuex'
import {User} from "@/interfaces/User";
import {IBattleUser} from "@/interfaces/BattleUser";
import {IFieldConditions} from "@/interfaces/FieldConditions";
import {ISideConditions} from "@/interfaces/SideConditions";

export default createStore({
    state: {
        user: {} as User,

        battleInfo: '' as string,
        battleUser: {} as IBattleUser,
        battleRival: {} as IBattleUser,
        chatMessages: [] as string[],
        fieldConditions: {} as IFieldConditions,
        userSideConditions: {} as ISideConditions,
        rivalSideConditions: {} as ISideConditions,

        activeMoves: [] as string[],
        pokemonToSwitchIn: [] as string[],

        choiseSent: false as boolean,
        pokemonFlag: false as boolean,
        fightFlag: false as boolean,
        forceSwitch: false as boolean,
        pokemonTrapped: false as boolean,

        battleFinished: false as boolean,

        timer: -1 as number,

    },
    getters: {},
    actions: {},
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
        },
        SET_FIELDCONDITIONS(state: any, fieldConditions: IFieldConditions){
            state.fieldConditions = fieldConditions;
        },
        SET_USERSIDECONDITIONS(state: any, userSideConditions: ISideConditions){
            state.userSideConditions = userSideConditions;
        },
        SET_RIVALSIDECONDITIONS(state: any, rivalSideConditions: ISideConditions){
            state.rivalSideConditions = rivalSideConditions;
        },


        SET_ACTIVEMOVES(state: any, activeMoves: string[]) {
            state.activeMoves = activeMoves;
        },
        SET_POKEMONTOSWITCHIN(state: any, pokemonToSwitchIn: string[]) {
            state.pokemonToSwitchIn = pokemonToSwitchIn;
        },


        SET_CHOISESENT(state: any, sent: boolean) {
            state.choiseSent = sent;
        },
        SET_POKEMONFLAG(state: any, flag: boolean) {
            state.pokemonFlag = flag;
        },
        SET_FIGHTFLAG(state: any, flag: boolean) {
            state.fightFlag = flag;
        },
        SET_FORCESWITCH(state: any, flag: boolean) {
            state.forceSwitch = flag;
        },
        SET_POKEMONTRAPPED(state: any, flag: boolean) {
            state.pokemonTrapped = flag;
        },
        SET_BATTLEFINISHED(state: any, flag: boolean) {
            state.battleFinished = flag;
        },


        SET_TIMERRESET(state: any, number: number) {
            state.timer = number;
        },
    }
})


