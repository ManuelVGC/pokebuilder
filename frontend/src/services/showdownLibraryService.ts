/**
 * Este archivo implementa diferentes funciones para acceder a la información que aporta la biblioteca de pokemon-showdown, la cual se encuentra en el backend.
 */

import {axiosInstanceMyServer} from "../services/axios";
import {AxiosResponse} from "axios";
import {IPokemon} from "@/interfaces/Pokemon";

export const getPokemonListDex = async () : Promise<AxiosResponse> => await axiosInstanceMyServer.get('/dex/');

export const getPokemonData = async (pokemonName: string, info: string) : Promise<AxiosResponse> => await axiosInstanceMyServer.get('/dex/' + pokemonName + '/' + info);

export const getItemList = async () : Promise<AxiosResponse> => await axiosInstanceMyServer.get('/dex/itemsList');

export const getNatureList = async () : Promise<AxiosResponse> => await axiosInstanceMyServer.get('/dex/naturesList');

export const getMoveData = async (moveName: string) : Promise<AxiosResponse> => await axiosInstanceMyServer.get('/move/' + moveName);

export const convertToJSON = async (pokemonTeam: IPokemon[]) : Promise<AxiosResponse> => await axiosInstanceMyServer.post('/teamValidator/json', pokemonTeam);

//export const convertToExport = async (pokemonTeam: IPokemon[]) : Promise<AxiosResponse> => await axiosInstanceMyServer.post('/teamValidator/export', pokemonTeam);

export const convertToPacked = async (pokemonTeam: IPokemon[]) : Promise<AxiosResponse<string>> => await axiosInstanceMyServer.post('/teamValidator/packed', pokemonTeam);

