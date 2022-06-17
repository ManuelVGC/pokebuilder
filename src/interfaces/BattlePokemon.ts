import {Move} from "@/interfaces/Move";

export interface BattlePokemon {
    ident: string; //pertenencia del Pokémon (si es del jugador 1 o el 2) y mote --> Ej: p2: Pyukumuku
    details: string; //nombre del Pokémon, nivel y género --> Ej: Pyukumuku, L83, F
    condition: string; //vida del Pokémon y status --> Ej: 227/227 tox
    active: boolean; //si el Pokémon está actualmente en campo o no
    stats: {
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
    }
    moves: Move[];
    baseAbility: string; //habilidad
    item: string;
    pokeball: string;
}
