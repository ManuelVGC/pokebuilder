import axios from "./axios"

import {User} from "@/interfaces/User";

//Logeo en Pokémon Showdown, puede ser exitoso o no, lo indicará la assertion
export const logInShowdown = async (user: User) => {
    const act = 'login';
    const data = 'act=' + act + '&name=' + user.username + '&pass=' + user.password + '&challstr=' + user.challstr;
    const response = await axios.post('', data);
    const assertion = parseAssertion(response.data);
    return checkAssertion(assertion);
}

//Funciones auxiliares para el logeo en Pokémon Showdown
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





