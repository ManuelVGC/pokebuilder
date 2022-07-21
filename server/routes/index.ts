/**
 * Define una API REST para poder manipular los datos de la base de datos.
 * (Archivo que indica las rutas del backend y qué hará cada una cuando sea accedida de una determinada forma).
 */

import {Router} from "express";
import Team from "../models/Team";

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

/** Añadir un equipo. */
router.post('/teams', async (req, res) => {
    const teamReceived = req.body;
    const team = new Team(teamReceived);

    await team.save();
    res.json(team);
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
    console.log("hola");
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
    try {
        const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //de esta forma me devuelve el team actualizado
        });
        if (!updatedTeam) {
            res.status(404).json({message: "Team not found"});
        }
        res.json(updatedTeam);
    } catch (error) {
        return res.status(500).send(error); //el id no es un objectId
    }
});

export default router;
