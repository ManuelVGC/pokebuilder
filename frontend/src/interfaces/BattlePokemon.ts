import {IMove} from "../interfaces/Move";

/**
 * Interface IBattlePokemon.
 *
 * Esta interface define el tipo IBattlePokemon, el cual es utilizado para los Pokémon en las batallas.
 */
export interface IBattlePokemon {
    /**
     * Pertenencia del Pokémon (si es del jugador 1 o el 2) y mote. --> Ej: p2: Charizard
     */
    ident: string;

    /**
     * Especie del Pokémon, nivel y género (si lo tiene). --> Ej: Charizard, L83, F
     */
    details: string;

    /**
     * Vida del Pokémon y status. --> Ej: 227/227 tox
     */
    condition: string;

    /**
     * Si el Pokémon está actualmente en campo o no.
     */
    active: boolean;

    /**
     * Estadísticas del Pokémon.
     */
    stats: {
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
    }

    /**
     * Pool de movimientos del Pokémon, con un máximo de 4 movimientos.
     */
    moves: IMove[];

    /**
     * Habilidad del Pokémon.
     */
    baseAbility: string;

    /**
     * Item que porta el Pokémon.
     */
    item: string;
}
