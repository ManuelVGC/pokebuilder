/**
 * Este archivo implementa la función que llama al sistema de recomendación en busca de recomendaciones.
 */


import {axiosInstanceMyServer} from "@/services/axios";



/** Conseguir recomendaciones de Pokémon a partir de unos Pokémon dados. */
export const getRecommendations = async () => await axiosInstanceMyServer.post('/recommendationSystem/');

//export const getRecommendations = async () => await axiosInstanceRecommenderSystem.post('/recommendationSystem/');
