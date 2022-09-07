/**
 * Archivo para el manejo de la conexión a MongoDB.
 */

import { connect } from 'mongoose'

export const startConnection = async () => {
    try {
        const db = await connect('mongodb://mongo/teams-database');
    } catch (error) {}
}
