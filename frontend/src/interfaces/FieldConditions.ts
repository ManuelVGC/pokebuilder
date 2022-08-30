import {IBattleUser} from "@/interfaces/BattleUser";

/**
 * Interface IFieldConditions.
 *
 * Esta interface define el tipo IFieldConditions, el cual es utilizado para los efectos que afectan al campo de batalla entero.
 * En generaciones posteriores hay varios tipos pero con la que trabajo solo está el weather.
 */
export interface IFieldConditions {
    weather: {
        /**
         * Weather activo o no.
         */
        active: boolean,

        /**
         * Tipo de weather, podrá ser Rain, Sunnyday, Sandstorm, Hail o none.
         */
        type: string,
    },
}

/**
 * Clase FieldConditions.
 *
 * Clase utilizada para crear un objeto para guardar la información del weather durante una batalla.
 */
export class FieldConditions implements IFieldConditions {
    weather = {
        active: false,
        type: 'none',
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}
