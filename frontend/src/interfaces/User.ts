/**
 * Interface IUser.
 *
 * Esta interface define el tipo IUser, el cual es utilizado para los usuarios que entren en la aplicación.
 */
export interface IUser {
    username: string;

    /**
     * Contraseña del usuario.
     */
    password: string;

    /**
     * Cadena de números y letras que envía el servidor de Pokémon Showdown para poder logearte en el mismo.
     */
    challstr: string;
}
