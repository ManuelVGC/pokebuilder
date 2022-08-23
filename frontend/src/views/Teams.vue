<template>
  <div class="background">
    <SettingsBar class="settingsBar"/>
    <div class="grid">
      <div class="gridMenu">
        <p class="myCreatedTeamsText">My created teams</p>
        <div class="buttons">
          <button type="button" class="buttonCreateTeam" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="this.$router.push({name: 'teambuilder', params: {id: 'newTeam'}});">Create team</button>
          <button type="button" class="buttonGoBack" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="this.$router.push('/home')">Go back to home</button>
        </div>
      </div>

      <div v-if="userTeams.length > 0">
        <div class="teams">
          <div v-for="team in userTeams" :key="team" class="team">
            <p class="teamName">{{team.name}}</p>
            <div class="pokemonInTeam">
              <div class="pokemonSprite" v-for="pokemon in team.pokemon" :key="pokemon">
                <img :src="pokemonURL + pokemon.name.toLowerCase() + extension">
              </div>
            </div>
            <div class="deleteEditButtons">
              <button type="button" class="buttonDelete" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="tryDeleteTeam()">Delete team</button>
              <button type="button" class="buttonEdit" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="editTeam(team._id)">Edit team</button>
            </div>
            <div v-if="deleteTeamFlag" class="popUpContainer">
              <div class="popUp">
                <p class="errorTitle">Warning!</p>
                <div class="errorDescription">Are you sure you want to delete this team?</div>
                <div>
                  <button @click="deleteTeam(team._id)" class="buttonConfirmDelete" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Delete</button>
                  <button @click="cancel()" class="buttonCancelDelete" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="noTeams" v-if="userTeams.length <= 0">
        You have no teams yet!
      </p>
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

      pokemonURL: 'https://play.pokemonshowdown.com/sprites/gen3/' as string,  /** URL donde se encuentran los iconos de los Pokémon. */
      extension: '.png' as string, /** Extensión de los iconos. */

      deleteTeamFlag: false as boolean,
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

    /** Intentar borrar un equipo de entre la lista de los equipos creados. */
    async tryDeleteTeam() {
      this.deleteTeamFlag = true;
    },

    /** Borrar un equipo de entre la lista de los equipos creados tras confirmación del usuario. */
    async deleteTeam(teamID: string) {
      await deleteTeam(this.$store.state.user.username, teamID);
      this.loadUserTeams();
      this.deleteTeamFlag = false;
    },

    /** Cancelar acción de borrar equipo. */
    cancel() {
      this.deleteTeamFlag = false;
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
  min-height: 100vh;
  height: auto;
}

.settingsBar {
  border-bottom: 0.3em solid #1e1e1e;
  height: 10vh;
}

.grid {
  display: grid;
  grid-template-rows: 1fr 5fr;
  justify-items: center;
}

.gridMenu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: white;
  box-shadow: 0em 0.01em 4em rgba(0, 0, 0, 0.2);
}

.teams {
  padding: 3em 0em;
}

.team {
  background-color: white;
  display: grid;
  grid-template-columns: 1fr 5fr 2fr;
  border-bottom: 0.2em solid rgba(0, 0, 0, 0.3);
  padding: 1.5em;
  align-items: center;
  justify-items: center;
}

.teamName {
  grid-column: 1;
  font-weight: bold;
  color: #1e1e1e;
  overflow: auto;
}

.pokemonInTeam {
  grid-column: 2;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
}

.pokemonSprite {
  margin-left: 2em;
}

.deleteEditButtons {
  grid-column: 3;
  padding: 0em 1.5em;
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

.buttonGoBack {
  margin-left: 1em;
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonGoBack:hover {
  background-color: #e85660;
}

.buttonGoBack:active {
  background-color: #d7313e;
}

.buttonCreateTeam {
  height: 3em;
  width: 10em;
  background-color: #4bbf73;
  color: #1e1e1e;
  font-size: large;
}

.buttonCreateTeam:hover {
  background-color: #58e88a;
}

.buttonCreateTeam:active {
  background-color: #4bbf73;
}

.buttonDelete {
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: medium;
}

.buttonDelete:hover {
  background-color: #e85660;
}

.buttonDelete:active {
  background-color: #d7313e;
}

.buttonEdit {
  margin-left: 1em;
  height: 3em;
  width: 10em;
  background-color: #1768AC;
  color: white;
  font-size: medium;
}

.buttonEdit:hover {
  background-color: #5397f9;
}

.buttonEdit:active {
  background-color: #1768AC;
}

.noTeams {
  font-weight: bold;
  font-size: xxx-large;
  color: black;
}


.popUpContainer {
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}

.popUp {
  background-color: white;
  width: 30em;
  padding: 3em;
  border-radius: 0.5em;
  box-shadow: 0 1em 1em rgba(0, 0, 0, 0.3);
  text-align: center;
}

.errorTitle {
  color: red;
  font-weight: bold;
  font-size: xx-large;
}

.errorDescription {
  color: red;
  font-weight: bold;
  margin-bottom: 1em;
}


.buttonConfirmDelete {
  margin: 1em 0em;
  height: 4em;
  width: 20em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonConfirmDelete:hover {
  background-color: #e85660;
}

.buttonConfirmDelete:active {
  background-color: #d7313e;
}

.buttonCancelDelete {
  margin: 1em 0em;
  height: 4em;
  width: 20em;
  background-color: #1768AC;
  color: white;
  font-size: large;
}

.buttonCancelDelete:hover {
  background-color: #5397f9;
}

.buttonCancelDelete:active {
  background-color: #1768AC;
}

</style>
