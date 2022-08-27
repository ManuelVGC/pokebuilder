/**
 * Archivo que se encarga del manejo de Axios para las llamadas HTTP.
 * Concretamente hay dos instancias: una necesaria para conectar con Pokémon Showdown y otra para conectar con el sistema recomendador.
 */

import axios, { AxiosInstance} from 'axios'

export const axiosInstanceShowdown: AxiosInstance = axios.create({
    baseURL: 'https://play.pokemonshowdown.com/action.php',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; encoding=UTF-8',
        'Access-Control-Allow-Origin': '*',
    }
});

export const axiosInstanceRecommendationSystem: AxiosInstance = axios.create({
    baseURL: 'http://144.24.193.216:8888/v1/recommend',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
