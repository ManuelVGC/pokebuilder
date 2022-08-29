/**
 * Este archivo implementa la función que llama al sistema de recomendación en busca de recomendaciones.
 */

import {axiosInstanceMyServer} from "@/services/axios";

/** Conseguir recomendaciones de Pokémon a partir de unos Pokémon dados. */
export const getRecommendations = async (ids: { 'sequence': string[], 'topk': number }) => await axiosInstanceMyServer.post('/recommendationSystem/', ids);

