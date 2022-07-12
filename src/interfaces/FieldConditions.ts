/**
 * Interface IFieldConditions y clase FieldConditions.
 *
 * Esta interface define el tipo IFieldConditions, el cual es utilizado para los efectos que afectan al campo de batalla entero.
 * En generaciones posteriores hay varios tipos pero con la que trabajo solo está el weather.
 *
 * La clase correspondiente es utilizada para crear un objeto para guardar la información del weather durante una batalla.
 */

export interface IFieldConditions {
    weather: {
        activate: boolean, /** Weather activo o no. */
        type: string, /** Tipo de weather, podrá ser Rain, Sunnyday, Sandstorm, Hail o none. */
    },
}

export class FieldConditions {
    weather = {
        activate: false,
        type: 'none',
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}
