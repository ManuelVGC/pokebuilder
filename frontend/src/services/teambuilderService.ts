/**
 * Este archivo implementa diferentes funciones para hacer el CRUD de los equipos del Teambuilder en el backend.
 */

import {axiosInstanceMyServer} from "../services/axios";
import {AxiosResponse} from "axios";

import { ITeam } from "../interfaces/Team";

export const createTeam = async (team: ITeam) => await axiosInstanceMyServer.post('/teams', team);

export const getUserTeams = async (user: string) : Promise<AxiosResponse<ITeam[]>> => await axiosInstanceMyServer.get('/teams/' + user);

export const getTeam = async (user: string, id: string) : Promise<AxiosResponse<ITeam>> => await axiosInstanceMyServer.get("/teams/" + user + "/" + id);

export const updateTeam = async (user: string, id: string, team: ITeam) => await axiosInstanceMyServer.put("/teams/" + user + "/" + id, team);

export const deleteTeam = async (user: string, id: string)  : Promise<AxiosResponse<ITeam>> => await axiosInstanceMyServer.delete("/teams/" + user + "/" + id);
