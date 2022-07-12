/**
 * Interface ISideConditions y clase SideConditions.
 *
 * Esta interface define el tipo ISideConditions, el cual es utilizado para los efectos que afectan a uno de los lados del campo de batalla, ya sea del rival o del usuario.
 *
 * La clase correspondiente es utilizada para crear un objeto para guardar la información de los diferentes tipos SideConditions.
 */

export interface ISideConditions {
    boosts: { /** Cambios en las estadísticas del Pokémon en campo. Estos cambios duran mientras el Pokémon esté en campo o mientras no sean alterados con movimientos, por ejemplo. */
        atk: number,
        def: number,
        spa: number,
        spd: number,
        spe: number,
        acc: number,
    },
    lightscreen: boolean, /** Lightscreen activada o no. */
    reflect: boolean, /** Reflect activado o no. */
    mist: boolean, /** Mist activada o no. */
    safeguard: boolean, /** Safeguard activado o no. */
    spikes: number, /** Número de spikes en uno de los lados del campo de batalla. */
    leechseed: boolean, /** Si el Pokémon actual en campo tiene Leech Seed (que le van drenando la vida poco a poco) o no. */
}

export class SideConditions {
    boosts =  {
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
        acc: 0,
    };
    lightscreen = false;
    reflect = false;
    mist = false;
    safeguard = false;
    spikes = 0;
    leechseed = false;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
    //En la 3gen solo hay un tipo de condición de campo, que es el weather, pero en posteriores generaciones se añaden más
}
