export interface ISideConditions {
    boosts: {
        atk: number,
        def: number,
        spa: number,
        spd: number,
        spe: number,
        acc: number,
    },
    lightscreen: boolean,
    reflect: boolean,
    mist: boolean,
    safeguard: boolean,
    spikes: number,
    leechseed: boolean,
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
