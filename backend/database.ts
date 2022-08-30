/**
 * Archivo para el manejo de la conexión a MongoDB.
 */

import { connect } from 'mongoose'

export const startConnection = async () => {
    try {
        const db = await connect('mongodb://mongo/teams-database');
        //const db = await connect('mongodb+srv://pykia:pykia12345678@clusterpokebuilder.uqmls.mongodb.net/teams-database?retryWrites=true&w=majority');
        //const db = await connect('mongodb://127.0.0.1:27017/teams-database');
    } catch (error) {}
}
