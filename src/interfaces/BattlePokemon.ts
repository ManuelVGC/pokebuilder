export interface BattlePokemon {
    active: boolean;
    baseAbility: string;
    condition: string;
    details: string;
    ident: string;
    item: string;
    moves: {
        move1: string;
        move2: string;
        move3: string;
        move4: string;
    };
    pokeball: string;
    stats: {
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
    }

}
