/**
 * Define una API REST para poder manipular los datos de la base de datos.
 * Además permite pasar datos de la biblioteca pokemon-showdown al frontend.
 * (Archivo que indica las rutas del backend y qué hará cada una cuando sea accedida de una determinada forma).
 */

import {Router} from "express";
import Team from "../models/Team";
import {
    getAllPokemon,
    getPokemonLearnset,
    getPokemonAbilities,
    getItems,
    getNatures,
    getPokemonBaseStats,
    getPokemonType,
    getMoveInfo,
    getPokemonID,
    getPokemonListFiltered
} from "../dex";
import {convertFromJSONToPacked, convertFromStringToJSON, validateTeam} from "../teamValidator";
import {axiosInstanceShowdown} from "../axios";

const router = Router();

/** Recuperar los equipos creados por un determinado usuario. */
router.get('/teams/:user', async (req, res) => {
    const teams = await Team.find({user: req.params.user});

    res.send(teams);
});

/** Añadir un equipo y validarlo. */
router.post('/teams', async (req, res) => {
    const teamReceived = req.body;
    const validation = validateTeam(teamReceived.pokemon);

    if (validation == null) {
        const team = new Team(teamReceived);
        await team.save();
    }
    res.send(validation);

});

/** Recuperar un equipo de entre los equipos creados por un determinado usuario. */
router.get('/teams/:user/:id', async(req, res) => {
   try {
       const team = await Team.findById(req.params.id);
       if (!team) {
           res.status(404).json({message: "Team not found"});
       }
       res.send(team);
   } catch (error) {}
});

/** Borrar un equipo creado por un determinado usuario. */
router.delete('/teams/:user/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            res.status(404).json({message: "Team not found"});
        }
        res.json(team);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/** Actualizar un equipo creado por un determinado usuario. */
router.put('/teams/:user/:id', async(req, res) => {
    const teamReceived = req.body;
    const validation = validateTeam(teamReceived.pokemon);

    if (validation == null) {
        try {
            const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updatedTeam) {
                res.status(404).json({message: "Team not found"});
            }
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    res.send(validation);
});

/** Recuperar una lista con información acerca de Pokémon. Ya sea una lista con los Pokémon usables, lista de Pokémon de
 *  3gen, lista de items o lista de naturalezas. */
router.get('/dex/:list', async (req, res) => {

    if(req.params.list === 'pokemonListFiltered') {
        const pokemonListFiltered = getPokemonListFiltered();
        res.send(pokemonListFiltered);
    } else if (req.params.list === 'pokemonFullList') {
        const fullPokemonList = getAllPokemon();
        res.send(fullPokemonList);
    } else if (req.params.list === 'itemsList') {
        const items = getItems();
        res.send(items);
    } else if (req.params.list === 'naturesList') {
        const natures = getNatures();
        res.send(natures);
    }

});

/** Recuperar una información determinada de un Pokémon en concreto. */
router.get('/dex/:pokemonName/:info', async (req, res) => {
    /** Recuperar habilidades del Pokémon. */
    if (req.params.info === 'abilities') {
        const abilities = getPokemonAbilities(req.params.pokemonName);
        res.send(abilities);
    }

    /** Recuperar movimientos que puede aprender el Pokémon. */
    else if (req.params.info === 'learnset') {
        const learnset = getPokemonLearnset(req.params.pokemonName);
        res.send(learnset);
    }

    /** Recuperar stats base del Pokémon. */
    else if (req.params.info === 'baseStats') {
        const baseStats = getPokemonBaseStats(req.params.pokemonName);
        res.send(baseStats);
    }

    /** Recuperar tipos del Pokémon. */
    else if (req.params.info === 'types') {
        const types = getPokemonType(req.params.pokemonName);
        res.send(types);
    }

    /** Recuperar id del Pokémon en la Pokédex. */
    else if (req.params.info === 'id') {
        const id = getPokemonID(req.params.pokemonName);
        res.send(id);
    }
});

/** Convertir el equipo pasado como parámetro a formato JSON. */
router.post('/teamValidator/json', async (req, res) => {
    let convertedTeam = req.body;

    convertedTeam = convertFromStringToJSON(convertedTeam);

    res.send(convertedTeam);
});

/** Convertir el equipo pasado como parámetro de formato JSON a formato packed. */
router.post('/teamValidator/packed', async (req, res) => {
    let convertedTeam = req.body;

    convertedTeam = convertFromJSONToPacked(convertedTeam);

    res.send(convertedTeam);
});

/** Inicio de sesión en Pokémon Showdown. */
router.post('/logInShowdown/', async (req, res) => {
    const user = req.body;
    let checkAssertion;

    const act = 'login';
    const data = 'act=' + act + '&name=' + user.username + '&pass=' + user.password + '&challstr=' + user.challstr;

    const response = await axiosInstanceShowdown.post('', data);
    const message = JSON.parse(response.data.substring(1));
    const assertion = message.assertion;

    if(assertion.substring(0, 2) === ';;') {
        checkAssertion = -1;
    } else {
        checkAssertion = assertion;
    }

    res.send(checkAssertion);
});

/** Recuperar la información de un movimiento en concreto. */
router.get('/move/:moveName/', async (req, res) => {
    const moveInfo = getMoveInfo(req.params.moveName);
    res.send(moveInfo);
});


/** Conseguir recomendaciones de Pokémon del sistema recomendador a partir de unos Pokémon dados. */
router.post('/recommendationSystem/', async (req, res) => {
    const ids = req.body;
    const axios = require('axios');

    const response = await axios.post(
        'http://144.24.193.216:8888/v1/recommend',
        ids,
        {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    );

    res.send(response.data);
});


export default router;
