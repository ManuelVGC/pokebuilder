/**
 * Interface ITeam.
 *
 * Esta interface define el tipo ITeam, el cual es utilizado para los equipos creados en el Teambuilder.
 */

import {IPokemon} from "@/interfaces/Pokemon";

export interface ITeam {
    user: string, /** Usuario que ha creado el equipo. */
    name: string, /** Nombre del equipo elegido por el usuario. */
    pokemon: IPokemon[], /** Pokémon que conforman el equipo. */
}
