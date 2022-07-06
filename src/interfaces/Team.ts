export interface ITeam {
    user: string,
    name: string,
    _id: string,
    pokemon: [{
        name: string,
        species: string,
        gender: string,
        item: string,
        ability: string,
        evs: [{
            hp: number,
            atk: number,
            def: number,
            spa: number,
            spd: number,
            spe: number,
        }],
        nature: string,
        ivs: [{
            hp: number,
            atk: number,
            def: number,
            spa: number,
            spd: number,
            spe: number,
        }],
        moves: string[],
    }]
}
