import {IPokemon} from "@/interfaces/Pokemon";

/**
 * Interface ITeam.
 *
 * Esta interface define el tipo ITeam, el cual es utilizado para los equipos creados en el Teambuilder.
 */
export interface ITeam {
    /**
     * Usuario que ha creado el equipo.
     */
    user: string,

    /**
     * Nombre del equipo elegido por el usuario.
     */
    name: string,

    /**
     * Pokémon que conforman el equipo.
     */
    pokemon: IPokemon[],
}
