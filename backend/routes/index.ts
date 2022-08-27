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
    getMoveInfo
} from "../dex";
import {convertFromJSONToPacked, convertFromStringToJSON, validateTeam} from "../teamValidator";
import {axiosInstanceShowdown, axiosInstanceRecommendationSystem} from "../axios";

const router = Router();

/** Esta función la uso para depuración ,para saber todos los equipos que tengo guardados en la base datos. */
router.get('/teams/', async (req, res) => {
    const teams = await Team.find();

    res.send(teams);
});

/** Recuperar los equipos creados por un determinado usuario. */
router.get('/teams/:user', async (req, res) => {
    const teams = await Team.find({user: req.params.user});

    res.send(teams);
});

/** Añadir un equipo y validarlo. */
router.post('/teams', async (req, res) => {
    const teamReceived = req.body;
    console.log(teamReceived.pokemon);
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
       if (!team) { //el id podría parecerse a un objectId pero el team no existe
           res.status(404).json({message: "Team not found"});
       }
       res.send(team);
   } catch (error) {
       console.log(error); //el id no es un objectId
   }
});

/** Borrar un equipo creado por un determinado usuario. */
router.delete('/teams/:user/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) { //el id podría parecerse a un objectId pero el team no existe
            res.status(404).json({message: "Team not found"});
        }
        res.json(team);
    } catch (error) {
        return res.status(500).send(error); //el id no es un objectId
    }
});

/** Actualizar un equipo creado por un determinado usuario. */
router.put('/teams/:user/:id', async(req, res) => {
    const teamReceived = req.body;
    const validation = validateTeam(teamReceived.pokemon);

    if (validation == null) {
        try {
            const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
                new: true, //de esta forma me devuelve el team actualizado
            });
            if (!updatedTeam) {
                res.status(404).json({message: "Team not found"});
            }
        } catch (error) {
            return res.status(500).send(error); //el id no es un objectId
        }
    }
    res.send(validation);
});

/** Recuperar una lista con todos los posibles Pokémon que se pueden utilizar. */
router.get('/dex/', async (req, res) => {
    const pokemonList = getAllPokemon();
    res.send(pokemonList);
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

    else if (req.params.info === 'types') {
        const types = getPokemonType(req.params.pokemonName);
        res.send(types);
    }
});

/** Recuperar lista de items que pueden llevar equipados los Pokémon. */
router.get('/dex/itemsList', async (req, res) => {
    const items = getItems();
    res.send(items);
});

/** Recuperar lista de posibles naturalezas que puede tener un Pokémon. */
router.get('/dex/naturesList', async (req, res) => {
    const natures = getNatures();
    res.send(natures);
});

/** Convertir el equipo pasado como parámetro a formato JSON. */
router.post('/teamValidator/json', async (req, res) => {
    let convertedTeam = req.body;

    convertedTeam = convertFromStringToJSON(convertedTeam);

    res.send(convertedTeam);
});

/*
router.post('/teamValidator/export', async (req, res) => {
    let convertedTeam = req.body;

    res.send(convertedTeam);
});*/

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
    const axios = require('axios');

    const response = await axios.post(
        'http://144.24.193.216:8888/v1/recommend',
        // '{\n  "sequence": [\n    22,23,24\n  ],\n  "topk": 5\n}',
        {
            'sequence': [
                22,
                23,
                24
            ],
            'topk': 5
        },
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
