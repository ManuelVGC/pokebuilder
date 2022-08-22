/**
 * Archivo que se encarga del manejo de Axios para las llamadas HTTP.
 * Concretamente hay una instancia, necesaria para conectar con mi servidor backend.
 */

import axios, { AxiosInstance} from 'axios'

export const axiosInstanceMyServer: AxiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});


