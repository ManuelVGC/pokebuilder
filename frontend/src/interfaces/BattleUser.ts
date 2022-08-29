/**
 * Interface IBattleUser y clase BattleUser.
 *
 * Esta interface define el tipo IBattleUser, el cual es utilizado para los usuarios que participan en una batalla.
 *
 * La clase correspondiente es utilizada para crear dos objetos para guardar la información de los dos usuarios de una batalla.
 */

import {IBattlePokemon} from "../interfaces/BattlePokemon";

export interface IBattleUser {
    username: string; /** Nombre de usuario. */
    id: string; /** Id del usuario dentro de la batalla, podrá ser p1 ó p2. */
    avatar: string; /** Avatar usado por el usuario (el avatar en este caso es un personaje de la saga de Pokémon). */
    team: IBattlePokemon[]; /** Equipo usado por el usuario. */
}

export class BattleUser implements IBattleUser {
    username = '';
    id = '';
    avatar = '';
    team: IBattlePokemon[] = [];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}
