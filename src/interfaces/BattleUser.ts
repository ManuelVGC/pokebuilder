import {Team} from "@/interfaces/Team";

export interface IBattleUser {
    username: string;
    id: string;
    avatar: string;
    team: Team;
}

export class BattleUser implements IBattleUser {
    username: string;
    id: string;
    avatar: string;
    team: Team;

    constructor(username: string, id: string, avatar: string, team: Team) {
        this.username = username;
        this.id = id;
        this.avatar = avatar;
        this.team = team;
    }
}
