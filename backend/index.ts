/**
 * Archivo principal del backend.
 */

import app from "./app";
import {startConnection} from "./database";

/** Inicio de la base de datos. */
startConnection();

/** Inicio del servidor backend. */
app.listen(3000);
console.log('Servidor runneando en el puerto 3000...')


