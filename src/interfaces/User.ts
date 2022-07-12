/**
 * Interface IUser.
 *
 * Esta interface define el tipo IUser, el cual es utilizado para los usuarios que entren en la aplicación.
 */

export interface IUser {
    username: string;
    password: string; /** Contraseña del usuario. Falta hacer el cifrado. */
    challstr: string; /** Cadena de números y letras que envía el servidor de Pokémon Showdown para poder logearte en el mismo. */
}
