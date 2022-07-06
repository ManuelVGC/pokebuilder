import axios, { AxiosInstance} from 'axios'

//Instancia de axios necesaria para logearte en Pokémon Showdown
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


