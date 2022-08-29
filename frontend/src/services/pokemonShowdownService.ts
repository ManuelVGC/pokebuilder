/**
 * Este archivo implementa diferentes funciones que son usadas para el inicio de sesión en Pokémon Showdown.
 */

import {axiosInstanceMyServer} from "../services/axios";

import {IUser} from "../interfaces/User";

/** Inicio de sesión en Pokémon Showdown, puede ser exitoso o no, lo indicará la assertion recibida. */
export const logInShowdown = async (user: IUser) => await axiosInstanceMyServer.post('/logInShowdown/', user);





