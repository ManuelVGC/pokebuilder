import axios, { AxiosInstance} from 'axios'

//Instancia de axios necesaria para logearte en Pokémon Showdown
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://play.pokemonshowdown.com/action.php',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; encoding=UTF-8',
    }
});

export default axiosInstance;


