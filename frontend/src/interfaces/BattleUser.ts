import {IBattlePokemon} from "../interfaces/BattlePokemon";

/**
 * Interface IBattleUser.
 *
 * Esta interface define el tipo IBattleUser, el cual es utilizado para los usuarios que participan en una batalla.
 */
export interface IBattleUser {
    /**
     * Nombre de usuario.
     */
    username: string;

    /**
     * Id del usuario dentro de la batalla, podrá ser p1 ó p2.
     */
    id: string;

    /**
     * Avatar usado por el usuario (el avatar en este caso es un personaje de la saga de Pokémon).
     */
    avatar: string;

    /**
     * Equipo usado por el usuario.
     */
    team: IBattlePokemon[];
}

/**
 * Clase BattleUser.
 *
 * Clase utilizada para crear dos objetos para guardar la información de los dos usuarios de una batalla.
 */
export class BattleUser implements IBattleUser {
    username = '';
    id = '';
    avatar = '';
    team: IBattlePokemon[] = [];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}
