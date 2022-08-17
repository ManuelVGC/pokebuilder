<template>
  <div class="background">
    <SettingsBar class="settingsBar"/>
    <div class="grid">
      <div class="gridMenu">
        <p class="myCreatedTeamsText">My created teams</p>
        <div class="buttons">
          <button type="button" class="button" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="this.$router.push({name: 'teambuilder', params: {id: 'newTeam'}});">Create team</button>
          <button type="button" class="button2" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="this.$router.push('/home')">Go back to home</button>
        </div>
      </div>
      <div class="teams">
        <table v-if="userTeams.length > 0" class="table table-hover">
          <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="team in userTeams" :key="team" class="table-primary">
            <th scope="row">{{team.name}}</th>
            <td v-for="pokemon in team.pokemon" :key="pokemon">
              {{pokemon.name}}
            </td>
            <td>
              <button type="button" class="btn btn-danger" @click="deleteTeam(team._id)">Delete team</button>
              <button type="button" class="btn btn-info" @click="editTeam(team._id)">Edit team</button>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="noTeams" v-if="userTeams.length <= 0">
          You have no teams yet!
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** View donde se muestran los equipos creados por el usuario. */

import {defineComponent} from "vue";
import SettingsBar from "../components/SettingsBar.vue";
import {ITeam} from "../interfaces/Team";
import {deleteTeam, getUserTeams} from "../services/teambuilderService";

export default defineComponent({
  name: 'TeamsView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      userTeams: [] as ITeam[], /** Equipos creados por el usuario. */
    }
  },
  methods: {
    /** Cargar desde el backend los equipos creados por el usuario. */
    async loadUserTeams() {
      const res = await getUserTeams(this.$store.state.user.username);

      this.userTeams = res.data;
      console.log('Los teams son:');
      console.log(this.userTeams);
    },

    /** Borrar un equipo de entre la lista de los equipos creados. */
    async deleteTeam(teamID: string) {
      if(confirm("Do you really want to delete this team?")) {
        await deleteTeam(this.$store.state.user.username, teamID);
        this.loadUserTeams();
      }
    },

    /** Editar un equipo de la lista de equipos creados. */
    async editTeam(teamID: string) {
      this.$router.push({name: 'teambuilder', params: {id: teamID}});
      //aquí irá el push a la página de Teambuilder con el parámetro teamID para que se me muestre ese equipo para editarlo
    }
  },
  mounted() {
    this.loadUserTeams();
  }
})
</script>

<style scoped>
.background {
  background-image: url("../assets/home/pokemonWallpaper20Anniversary.jpg");
  height: 100vh;
}

.settingsBar {
  border-bottom: 0.3em solid #1e1e1e;
}

.grid {
  display: grid;
  grid-template-rows: 1fr 5fr;
}

.gridMenu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  align-items: center;
  background-color: white;
  box-shadow: 0em 0.01em 4em rgba(0, 0, 0, 0.2);
}

.teams {
  display: flex;
  justify-content: center;
  align-items: center;
}

.myCreatedTeamsText {
  font-size: xx-large;
  color: #1e1e1e;
  font-weight: bold;
  padding: 1em 0em 1em 1em;
}

.buttons {
  justify-self: end;
  margin-right: 2em;
}

.button2 {
  margin-left: 1em;
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.button2:hover {
  background-color: #e85660;
}

.button2:active {
  background-color: #d7313e;
}

.button {
  height: 3em;
  width: 10em;
  background-color: #4b88c3;
  color: white;
  font-size: large;
}

.button:hover {
  background-color: #5397d9;
}

.button:active {
  background-color: #4b88c3;
}

.noTeams {
  position: fixed;
  font-weight: bold;
  font-size: xxx-large;
  color: black;
}
</style>
