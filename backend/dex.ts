import {Dex} from 'pokemon-showdown';

export const getAllPokemon = () => {
    //let pokemonList: string[];

    const pokemonList = Dex.mod('gen1').species.all();
    console.log(pokemonList);
    return pokemonList;
}

