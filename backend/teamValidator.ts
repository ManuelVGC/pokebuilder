/**
 * Archivo para el manejo de los módulos Teams y TeamValidator de la biblioteca pokemon-showdown.
 */

import {Teams, TeamValidator} from "pokemon-showdown";
import {Team} from "./models/Team";
import {PokemonSet} from "pokemon-showdown/.sim-dist/teams";

const validator = new TeamValidator('gen3ou');

/** Validar el equipo pasado como parámetro. */
export const validateTeam = (team: PokemonSet[]) => {
    const output = validator.validateTeam(team);
    return output;
}

/** Convertir el equipo pasado como parámetro de formato JSON a formato packed. */
export const convertFromJSONToPacked = (team: PokemonSet[]) => {
    const output = Teams.pack(team);
    return output;
}

/** Convertir el equipo pasado como parámetro a formato JSON. */
export const convertFromStringToJSON = (team: Team) => {
    const output = Teams.import(JSON.stringify(team));
    return output;
}
