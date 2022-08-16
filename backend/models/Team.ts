/**
 * Schema de un equipo para guardar en MongoDB. La estructura es la misma que la de la interface Team del frontend.
 */

import {Schema, model, InferSchemaType} from 'mongoose';

const pokemonSchema = new Schema({
    name: String,
    species: String,
    gender: String,
    item: String,
    ability: String,
    evs: {
        hp: Number,
        atk: Number,
        def: Number,
        spa: Number,
        spd: Number,
        spe: Number,
    },
    nature: String,
    ivs: {
        hp: Number,
        atk: Number,
        def: Number,
        spa: Number,
        spd: Number,
        spe: Number,
    },
    moves: {
        type: Array,
        default: [],
    },
    happiness: Number,
}, {
   _id: false,
});


const teamSchema = new Schema({
    user: String,
    name: String,
    pokemon: [pokemonSchema],
}, {
    versionKey: false,
});

export type Team = InferSchemaType<typeof teamSchema>

export default model('Team', teamSchema);


