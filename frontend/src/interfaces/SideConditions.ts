/**
 * Interface ISideConditions.
 *
 * Esta interface define el tipo ISideConditions, el cual es utilizado para los efectos que afectan a uno de los lados del campo de batalla, ya sea del rival o del usuario.
 */
export interface ISideConditions {
    /**
     * Cambios en las estadísticas del Pokémon en campo. Estos cambios duran mientras el Pokémon esté en campo o
     * mientras no sean alterados con movimientos, por ejemplo.
     */
    boosts: {
        atk: number,
        def: number,
        spa: number,
        spd: number,
        spe: number,
        acc: number,
    },

    /**
     * Lightscreen activada o no.
     */
    lightscreen: boolean,

    /**
     * Reflect activado o no.
     */
    reflect: boolean,

    /**
     * Mist activada o no.
     */
    mist: boolean,

    /**
     * Safeguard activado o no.
     */
    safeguard: boolean,

    /**
     * Número de spikes en uno de los lados del campo de batalla.
     */
    spikes: number,

    /**
     * Si el Pokémon actual en campo tiene Leech Seed (que le van drenando la vida poco a poco) o no.
     */
    leechseed: boolean,
}

/**
 * Clase SideConditions.
 *
 * Clase utilizada para crear un objeto para guardar la información de los diferentes tipos SideConditions.
 */
export class SideConditions implements ISideConditions {
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
