/**
 * Interface IMove.
 *
 * Esta interface define el tipo IMove, el cual es utilizado para definir los campos que conforman un movimiento de un Pokémon en una batalla.
 */
export interface IMove {
    /**
     * Nombre del movimiento. --> Ej: Ice Beam
     */
    move: string;

    /**
     * Id del movimiento. --> Ej: icebeam
     */
    id: string;

    /**
     * Puntos de poder le quedan al movimiento (cantidad de veces que se podrá usar el movimiento).
     * --> Ej: si le quedan 9 PPs a Ice Beam, el Pokémon podrá usar Ice Beam 9 veces más
     */
    pp: number;

    /**
     * Máximos puntos de poder que tiene el movimiento.
     */
    maxpp: number;

    /**
     * A quién afecta el movimiento (esta información la utiliza Showdown, en mi caso es solo para tenerla presente).
     */
    target: string;

    /**
     * Si el movimiento ha sido desabilitado o no. Si el movimiento está desabilitado no se puede usar.
     */
    disabled: boolean;
}
