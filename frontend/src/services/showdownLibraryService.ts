/**
 * Este archivo implementa diferentes funciones para acceder a la información que aporta la biblioteca de pokemon-showdown, la cual se encuentra en el backend.
 */

import {axiosInstanceMyServer} from "../services/axios";
import {AxiosResponse} from "axios";

export const getPokemonListDex = async () => await axiosInstanceMyServer.get('/dex/');
