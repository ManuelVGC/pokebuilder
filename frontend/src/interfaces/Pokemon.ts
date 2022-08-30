/**
 * Interface IPokemon.
 *
 * Esta interface define el tipo IPokemon, el cual es utilizado para los Pokémon que forman un equipo en el teambuilder.
 */
export interface IPokemon {
    /**
     * Mote del Pokémon (puede coincidir con la especie del Pokémon).
     */
    name: string,

    /**
     * Especie del Pokémon. --> Ej: Charizard
     */
    species: string,

    /**
     * Género del Pokémon.
     */
    gender: string,

    /**
     * Objeto que porta el Pokémon.
     */
    item: string,

    /**
     * Habilidad del Pokémon.
     */
    ability: string,

    /**
     * Puntos de esfuerzo del Pokémon. Determinan las estadísticas finales del mismo.
     * (https://pokemon.fandom.com/es/wiki/Puntos_de_esfuerzo).
     */
    evs: {
        hp: number,
        atk: number,
        def: number,
        spa: number,
        spd: number,
        spe: number,
    },

    /**
     * Naturaleza del Pokémon.
     */
    nature: string,

    /** Valores individuales del Pokémon. Son los "genes" del Pokémon. Determinan las estadísticas finales del mismo.
     * (https://pokemon.fandom.com/es/wiki/Gen%C3%A9tica_Pok%C3%A9mon).
     */
    ivs: {
        hp: number,
        atk: number,
        def: number,
        spa: number,
        spd: number,
        spe: number,
    },

    /**
     * Pool de movimientos con los que cuenta el Pokémon, con un máximo de 4.
     */
    moves: string[],

    /**
     * Nivel de felicidad del Pokémon, relevante para ciertos movimientos.
     */
    happiness: number,
}

export class Pokemon implements IPokemon{
    name = '' as string;
    species = '';
    gender = '';
    item = '';
    ability = '';
    evs = {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
    };
    nature= '';
    ivs = {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
    };
    moves = [];
    happiness = 0;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}
