import {Team} from "@/interfaces/Team";

export interface IBattleUser {
    username: string;
    id: string;
    avatar: string;
    team: Team;
}

export class BattleUser implements IBattleUser {
    username = '';
    id = '';
    avatar = '';
    team = {pokemon: []};
    //team = {pokemon: [{active: false, baseAbility: '', condition: '', details: '', ident: '', item: '', moves: {move1: '', move2: '', move3: '', move4: ''}, pokeball: '', stats: {atk: 0, def: 0, spa: 0, spd: 0, spe: 0}}]};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

    }
}
