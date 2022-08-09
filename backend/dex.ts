/**
 * Archivo para el manejo del módulo Dex de la biblioteca pokemon-showdown.
 */

import {Dex} from 'pokemon-showdown';

/** Función que exporta una lista de los nombres de los Pokémon presentes en la tercera generación de Pokémon y formato OU. */
export const getAllPokemon = () => {
    const gen = 'gen3';

    const allPokemonFromSelectedGen = Dex.mod(gen).species.all();
    let pokemonListFilteredByOU = allPokemonFromSelectedGen.filter(pokemon => (pokemon.num >= 1 && pokemon.num <= 386) && pokemon.tier != 'Illegal' && pokemon.tier != 'Uber');
    pokemonListFilteredByOU = pokemonListFilteredByOU.sort((a, b) => (a.num > b.num) ? 1 : -1);

    const pokemonNameList : string[] = [];
    for (let i = 0; i < pokemonListFilteredByOU.length; i++) {
        pokemonNameList.push(pokemonListFilteredByOU[i].name);
    }

    return pokemonNameList;
}

