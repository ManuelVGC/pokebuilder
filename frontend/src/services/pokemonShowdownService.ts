/**
 * Este archivo implementa diferentes funciones son usadas para el inicio de sesión en Pokémon Showdown.
 */

import {axiosInstanceShowdown} from "../services/axios";

import {IUser} from "../interfaces/User";

/** Inicio de sesión en Pokémon Showdown, puede ser exitoso o no, lo indicará la assertion */
export const logInShowdown = async (user: IUser) => {
    const act = 'login';
    const data = 'act=' + act + '&name=' + user.username + '&pass=' + user.password + '&challstr=' + user.challstr;
    const response = await axiosInstanceShowdown.post('', data);
    const assertion = parseAssertion(response.data);
    return checkAssertion(assertion);
}


/** Funciones auxiliares para el inicio de sesión en Pokémon Showdown */
const parseAssertion = (data: string) => {
    const message = JSON.parse(data.substring(1));
    console.log(message);
    return message.assertion;
}

const checkAssertion = (assertion: string) => {
    if(assertion.substring(0, 2) === ';;') {
        return -1;
    } else {
        return assertion;
    }
}





