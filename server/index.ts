import app from "./app";
import {startConnection} from "./database";

//inicio de la base de datos
startConnection();

//inicio del servidor
app.listen(3000);
console.log('Servidor runneando en el puerto 3000...')



