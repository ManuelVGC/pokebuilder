/**
 * Archivo para el manejo del módulo Dex de la biblioteca pokemon-showdown.
 */

import {Dex} from 'pokemon-showdown';

const gen = 'gen3';

/** Función que devuelve una lista de los nombres de los Pokémon presentes en la tercera generación de Pokémon y formato OU. */
export const getAllPokemon = () => {
    const allPokemonFromSelectedGen = Dex.mod(gen).species.all();
    let pokemonListFilteredByOU = allPokemonFromSelectedGen.filter(pokemon => (pokemon.num >= 1 && pokemon.num <= 386) && pokemon.tier != 'Illegal' && pokemon.tier != 'Uber');
    pokemonListFilteredByOU = pokemonListFilteredByOU.sort((a, b) => (a.num > b.num) ? 1 : -1);

    const pokemonNameList : string[] = [];
    for (let i = 0; i < pokemonListFilteredByOU.length; i++) {
        pokemonNameList.push(pokemonListFilteredByOU[i].name);
    }

    return pokemonNameList;
}

/** Función que devuelve una lista con los movimientos que puede aprender el Pokémon pasado como parámetro. */
export const getPokemonLearnset = (pokemonName: string) => {
    let learnset3gen = [];
    let learnset = [];

    const fullLearnsetRaw = Dex.data.Learnsets[pokemonName.toLowerCase()].learnset;

    for (const move in fullLearnsetRaw) {
        for (let i = 0; i < fullLearnsetRaw[move].length; i++) {
            if (fullLearnsetRaw[move][i].startsWith('3')) {
                learnset3gen.push(move);
                break;
            }
        }
    }

    for (let j = 0; j < learnset3gen.length; j++) {
        learnset.push(Dex.mod(gen).moves.get(learnset3gen[j]));
    }
    return learnset;
}

/** Función que devuelve una lista con las habilidades del Pokémon pasado como parámetro. */
export const getPokemonAbilities = (pokemonName: string) => {
    let abilitiesFiltered = [];
    let abilities = [];

    const abilitiesRaw = Dex.mod(gen).species.get(pokemonName).abilities;

    const numberOfAbilities = Object.keys(abilitiesRaw).length;
    if (numberOfAbilities === 1) {
        abilitiesFiltered.push(abilitiesRaw[0]);
    } else if (numberOfAbilities === 2) {
        abilitiesFiltered.push(abilitiesRaw[0]);
        abilitiesFiltered.push(abilitiesRaw[1]);
    }

    for (let j = 0; j < abilitiesFiltered.length; j++) {
        abilities.push(Dex.mod(gen).abilities.get(abilitiesFiltered[j]));
    }

    return abilities;
}

/** Función que devuelve una lista con los items que puede llevar un Pokémon. */
export const getItems = () => {
    let itemsFiltered = [];
    const itemsBanned = ['Fast Ball', 'Heavy Ball', 'Level Ball', 'Love Ball', 'Lure Ball', 'Moon Ball', 'Safari Ball', 'Sport Ball', ]
    const allItems = Dex.mod(gen).items.all();

    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].gen <= 3 && allItems[i].isNonstandard === null && itemsBanned.indexOf(allItems[i].name) === -1) {
            itemsFiltered.push(allItems[i]);
        }
    }
    return itemsFiltered;
}

/** Función que devuelve una lista con las posibles naturalezas que puede tener un Pokémon. */
export const getNatures = () => {
    const natures = [
        {
            name: 'Adamant',
            description: 'Increases Attack decreases Special Attack',
        },
        {
            name: 'Bashful',
            description: 'No stat changes',
        },
        {
            name: 'Bold',
            description: 'Increases Defend decreases Attack',
        },
        {
            name: 'Brave',
            description: 'Increases Attack decreases Speed',
        },
        {
            name: 'Calm',
            description: 'Increases Special Defense decreases Attack',
        },
        {
            name: 'Careful',
            description: 'Increases Special Defense decreases Special Attack',
        },
        {
            name: 'Docile',
            description: 'No stat changes',
        },
        {
            name: 'Gentle',
            description: 'Increases Special Defense decreases Defense',
        },
        {
            name: 'Hardy',
            description: 'No stat changes',
        },
        {
            name: 'Hasty',
            description: 'Increases Speed decreases Defense',
        },
        {
            name: 'Impish',
            description: 'Increases Defense decreases Special Attack',
        },
        {
            name: 'Jolly',
            description: 'Increases Speed decreases Special Attack',
        },
        {
            name: 'Lax',
            description: 'Increases Defense decreases Special Defense',
        },
        {
            name: 'Lonely',
            description: 'Increases Attack decreases Defense',
        },
        {
            name: 'Mild',
            description: 'Increases Special Attack decreases Defense',
        },
        {
            name: 'Modest',
            description: 'Increases Special Attack decreases Attack',
        },
        {
            name: 'Naive',
            description: 'Increases Speed decreases Special Defense',
        },
        {
            name: 'Naughty',
            description: 'Increases Attack decreases Special Defense',
        },
        {
            name: 'Quiet',
            description: 'Increases Special Attack decreases Speed',
        },
        {
            name: 'Quirky',
            description: 'No stat changes',
        },
        {
            name: 'Rash',
            description: 'Increases Special Attack decreases Special Defense',
        },
        {
            name: 'Relaxed',
            description: 'Increases Defense decreases Speed',
        },
        {
            name: 'Sassy',
            description: 'Increases Special Defense decreases Speed',
        },
        {
            name: 'Serious',
            description: 'No stat changes',
        },
        {
            name: 'Timid',
            description: 'Increases Speed decreases Attack',
        }
    ]
    return natures;
}

/** Función que devuelve las estadísticas base del Pokémon pasado como parámetro. */
export const getPokemonBaseStats = (pokemonName: string) => {
    const baseStats = Dex.mod(gen).species.get(pokemonName).baseStats;
    return baseStats;
}

/** Función que devuelve el tipo del Pokémon pasado como parámetro. */
export const getPokemonType = (pokemonName: string) => {
    const types = Dex.mod(gen).species.get(pokemonName).types;
    return types;
}

/** Función que devuelve la información del movimiento pasado como parámetro. */
export const getMoveInfo = (moveName: string) => {
    const moveInfo = Dex.mod(gen).moves.get(moveName);
    return moveInfo;
}

/** Función que devuelve el tipo del Pokémon pasado como parámetro. */
export const getPokemonID = (pokemonName: string) => {
    const id = Dex.mod(gen).species.get(pokemonName);
    console.log(id);
    return id;
}
