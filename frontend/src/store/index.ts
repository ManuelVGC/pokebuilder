/**
 * Store de Vuex.
 */

import { createStore} from 'vuex'
import {IUser} from "../interfaces/User";
import {IBattleUser} from "../interfaces/BattleUser";
import {IFieldConditions} from "../interfaces/FieldConditions";
import {ISideConditions} from "../interfaces/SideConditions";

export default createStore({
    state: {
        user: {} as IUser, /** Usuario que se logea en la aplicación */

        battleInfo: '' as string, /** Información sobre la batalla. Es del tipo battle-gen3ou-1615773440 (a veces Showdown añade un guión más y más números durante la batalla). */
        battleUser: {} as IBattleUser, /** Información del usuario en la batalla. */
        battleRival: {} as IBattleUser, /** Información del rival en la batalla. */
        chatMessages: [] as string[], /** Array de mensajes del chat. Estos mensajes se imprimen por pantalla en Battle.vue. */
        fieldConditions: {} as IFieldConditions, /** Condiciones de campo de la batalla. */
        userSideConditions: {} as ISideConditions, /** Condiciones del lado del usuario en la batalla. */
        rivalSideConditions: {} as ISideConditions, /** Condiciones del lado del rival en la batalla. */

        activeMoves: [] as string[], /** Movimientos del Pokémon del usuario activo en campo. Se usa para mostrar los posibles movimientos que puede elegir el usuario en cada turno de la batalla. */
        pokemonToSwitchIn: [] as string[], /** Array de Pokémon a los cuales puede cambiar el usuario en cambio de que llegue un mensaje de forceSwitch. */

        choiseSent: false as boolean, /** Flag para controlar cuándo se ha enviado la decisión del usuario a Showdown (cambiar a X Pokémon o usar Y movimiento). */
        pokemonFlag: false as boolean, /** Flag para controlar cuándo hay que mostrar los Pokémon del equipo del usuario para un posible cambio del Pokémon activo en campo. */
        fightFlag: false as boolean, /** Flag para controlar cuándo hay que mostrar los ataques del Pokémon activo para que el usuario escoja uno si es su decisión en el turno. */
        forceSwitch: false as boolean, /** Flag que indica cuándo el usuario está obligado a cambiar su Pokémon activo por otro. */
        pokemonTrapped: false as boolean, /** Flag que indica si el Pokémon activo del usuario está atrapado o no (si está atrapado no puede ser cambiado por otro Pokémon). */

        battleFinished: false as boolean, /** Flag que indica si la batalla ha terminado o no. */

        timer: -1 as number, /** Variable que sirve para controlar el timer de las batallas. Si es -1 significa que el timer no está activo. */

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
        EMPTY_CHATMESSAGES(state: any) {
            state.chatMessages = [];
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


