/**
 * Interface IBattlePokemon.
 *
 * Esta interface define el tipo IBattlePokemon, el cual es utilizado para los Pokémon en las batallas.
 */

import {IMove} from "../interfaces/Move";

export interface IBattlePokemon {
    ident: string; /** Pertenencia del Pokémon (si es del jugador 1 o el 2) y mote. --> Ej: p2: Charizard */
    details: string; /** Especie del Pokémon, nivel y género (si lo tiene). --> Ej: Charizard, L83, F */
    condition: string; /** Vida del Pokémon y status. --> Ej: 227/227 tox */
    active: boolean; /** Si el Pokémon está actualmente en campo o no. */
    stats: { /** Estadísticas del Pokémon. */
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
    }
    moves: IMove[]; /** Pool de movimientos del Pokémon, con un máximo de 4 movimientos. */
    baseAbility: string; /** Habilidad del Pokémon. */
    item: string; /** Item que porta el Pokémon. */
}

/*
export class BattlePokemon {
    ident = '';
    details = '';
    condition = '';
    active = false;
    stats = {
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
    }
    moves = [];
    baseAbility = '';
    item = '';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}*/
