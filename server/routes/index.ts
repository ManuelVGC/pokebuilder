import {Router} from "express";
import Team from "../models/Team";

const router = Router();

//esta función la uso para depuración ,para saber todos los equipos que tengo guardados en la base datos
router.get('/teams/', async (req, res) => {
    const teams = await Team.find();

    res.send(teams);
});

router.get('/teams/:user', async (req, res) => {
    const teams = await Team.find({user: req.params.user});

    res.send(teams);
});

router.post('/teams', async (req, res) => {
    const teamReceived = req.body;
    const team = new Team(teamReceived);

    await team.save();
    res.json(team);
});

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
