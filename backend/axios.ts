/**
 * Archivo que se encarga del manejo de Axios para las llamadas HTTP.
 * Concretamente hay una instancia, necesaria para conectar con Pokémon Showdown.
 */

import axios, { AxiosInstance} from 'axios'

export const axiosInstanceShowdown: AxiosInstance = axios.create({
    baseURL: 'https://play.pokemonshowdown.com/action.php',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; encoding=UTF-8',
        'Access-Control-Allow-Origin': '*',
    }
});
