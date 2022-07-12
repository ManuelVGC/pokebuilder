/**
 * Archivo que se encarga del manejo de Axios para las llamadas HTTP.
 * Actualmente hay dos instancias: una necesaria para conectar con Pokémon Showdown; y otra necesaria para conectar con mi servidor backend.
 */

import axios, { AxiosInstance} from 'axios'

export const axiosInstanceShowdown: AxiosInstance = axios.create({
    baseURL: 'https://play.pokemonshowdown.com/action.php',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; encoding=UTF-8',
    }
});

export const axiosInstanceMyServer: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});


