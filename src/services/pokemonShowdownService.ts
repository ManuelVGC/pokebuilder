import axios from "./axios"

import {User} from "@/interfaces/User";

export const logInShowdown = async (user: User) => {
    console.log(user.username + " " + user.password);
    const act = 'login';
    const data = 'act=' + act + '&name=' + user.username + '&pass=' + user.password + '&challstr=' + user.challstr;
    const response = await axios.post('', data);
    const assertion = parseAssertion(response.data);
    return checkAssertion(assertion);
}

const parseAssertion = (data: string) => {
    const message = JSON.parse(data.substring(1));
    return message;
}

const checkAssertion = (assertion: string) => {
    if(assertion.substring(0, 2) === ';;') {
        return -1;
    } else {
        return assertion;
    }
}





