//Este .ts es para conectarme a la base de datos de MongoDB

import { connect } from 'mongoose'

export const startConnection = async () => {
    try {
        const db = await connect('mongodb://127.0.0.1:27017/teams-database');
        console.log(db.connection.name);
    } catch (error) {
        console.log(error);
    }
}
