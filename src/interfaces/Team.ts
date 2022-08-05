/**
 * Interface ITeam.
 *
 * Esta interface define el tipo ITeam, el cual es utilizado para los equipos creados en el Teambuilder.
 */

export interface ITeam {
    user: string, /** Usuario que ha creado el equipo. */
    name: string, /** Nombre del equipo elegido por el usuario. */
    _id: string, /** Id generado por MongoDB para identificar el equipo. */
    pokemon: [{ /** Pokémon que conforman el equipo. */
        name: string, /** Mote del Pokémon (puede coincidir con la especie del Pokémon). */
        species: string, /** Especie del Pokémon. --> Ej: Charizard */
        gender: string, /** Género del Pokémon. */
        item: string, /** Item que porta el Pokémon. */
        ability: string, /** Habilidad del Pokémon. */
        evs: { /** Puntos de esfuerzo del Pokémon. Determinan las estadísticas finales del mismo. (https://pokemon.fandom.com/es/wiki/Puntos_de_esfuerzo). */
            hp: number,
            atk: number,
            def: number,
            spa: number,
            spd: number,
            spe: number,
        },
        nature: string, /** Naturaleza del Pokémon. */
        ivs: { /** Valores individuales del Pokémon. Son los "genes" del Pokémon. Determinan las estadísticas finales del mismo. (https://pokemon.fandom.com/es/wiki/Gen%C3%A9tica_Pok%C3%A9mon). */
            hp: number,
            atk: number,
            def: number,
            spa: number,
            spd: number,
            spe: number,
        },
        moves: string[], /** Pool de movimientos con los que cuenta el Pokémon, con un máximo de 4. */
        happiness: number, /** Nivel de felicidad del Pokémon, relevante para ciertos movimientos. */
    }]
}
