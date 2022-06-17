export interface IFieldConditions {
    weather: {
        activate: boolean,
        type: string,
    },
    //En la 3gen solo hay un tipo de condición de campo, que es el weather, pero en posteriores generaciones se añaden más
}

export class FieldConditions {
    weather = {
        activate: false,
        type: '',
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
    //En la 3gen solo hay un tipo de condición de campo, que es el weather, pero en posteriores generaciones se añaden más
}
