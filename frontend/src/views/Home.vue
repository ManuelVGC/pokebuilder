<template>
  <SettingsBar class="settingsBar"/>
  <div class="grid">
    <div class="leftGrid">
      <img class="imageForm" src="../assets/home/pokemonWallpaper20Anniversary.jpg" alt="loginImage">
      <p class="welcome">Welcome to Pokebuilder, {{this.$store.state.user.username}}!</p>
    </div>
    <div class="rightGrid">
      <div class="battle">
        <div class="selectTeam">
          <select class="form-select" v-model="teamSelected" name="teams">
            <option v-for="(team, index) in packedTeams" :key="index" :value="team.team">
              <div>{{team.name}}</div>
              <div v-for="(pokemon, index2) in team.team" :key="index2">{{pokemon.name}}</div>
            </option>
          </select>
        </div>
        <button type="button" class="button2 searchGame" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.6); border-radius: 0.5em;" @click="searchGame()">Search game</button>
        <div v-if="searchingGame">
          <b>Searching for a game...</b>
          <div class="loader" style="margin: 1em"></div>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="cancelSearch()">Cancel search</button>
        </div>
      </div>
      <button type="button" class="button teambuilder" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="this.$router.push('/teams')">Teambuilder</button>
    </div>
  </div>
  <div v-if="error" class="popUpContainer">
    <div class="popUp">
      <p class="errorTitle">Error</p>
      <p class="errorDescription">You need a team to battle!</p>
      <button @click="closeError()" class="button" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
/** View para el menú principal de la página web. */

import {defineComponent} from "vue";
import SettingsBar from "../components/SettingsBar.vue";
import {send} from "../services/websocket";
import {ITeam} from "@/interfaces/Team";
import {getUserTeams} from "@/services/teambuilderService";
import {IPokemon} from "@/interfaces/Pokemon";
import {convertToPacked} from "@/services/showdownLibraryService";

export default defineComponent({
  name: 'HomeView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      searchingGame: false as boolean, /** Flag que indica si se está buscando batalla. */

      userTeams: [] as ITeam[], /** Equipos del usuario. */
      packedTeams: [{ /** Equipos del usuario en formato packed. */
        name: '' as string,
        team: '' as string,
      }],

      teamSelected: [] as string[], /** Equipo Pokémon que se enviará a Showdown para jugarlo en una batalla. */
      error: false as boolean, /** Indica cuando se ha producido un error a la hora de intentar buscar una partida. */
    }
  },
  methods: {
    /** Búsqueda de partida en la ladder. */
    searchGame() {
      const format = "gen3ou";
      if (this.teamSelected.length != 0) {
        send('|/utm ' + this.teamSelected);
        send('|/search ' + format);
        this.searchingGame = true;
        console.log("Searching for a game...");
      } else {
        this.error = true;
      }
    },

    /** Búsqueda de partida contra una cuenta de Showdown específica (Smile DD) para hacer pruebas porque en la ladder normal no hay excesiva gente jugando. */
    /*searchGame() {
      const format = "gen3ou";
      send('|/utm ' + this.team);
      send('|/challenge Smile DD, ' + format);
      this.searchingGame = true;
      console.log("Searching for a game...");
    },*/

    /** Cancelación de búsqueda de partida. */
    cancelSearch() {
      send('|/cancelsearch');
      this.searchingGame = false;
    },

    /** Cargar desde el backend los equipos creados por el usuario y convertirlos a formato packed */
    async loadUserTeams() {
      let packedTeams = [];

      const res = await getUserTeams(this.$store.state.user.username);

      this.userTeams = res.data;

      for (let i = 0; i < this.userTeams.length; i++) {
        let team = await this.convertToPackedTeam(this.userTeams[i].pokemon);
        let packedTeam = {
          name: '' as string,
          team: '' as string,
        };
        packedTeam.name = this.userTeams[i].name;
        packedTeam.team = team;

        packedTeams.push(packedTeam);

      }
      this.packedTeams = packedTeams;
    },

    /** Conversión de un equipo Pokémon a formato packed. */
    async convertToPackedTeam(team: IPokemon[]) {
      const packedTeam = await convertToPacked(team);
      return packedTeam.data;
    },

    /** Cerrar el cuadro de texto que nos indica error en la búsqueda de partida. */
    closeError() {
      this.error = false;
    },
  },
  mounted() {
    this.$store.commit('SET_BATTLEFINISHED', true);
    this.loadUserTeams();
  }
})
</script>

<style scoped>
.settingsBar {
  border-bottom: 0.3em solid #1e1e1e;
  position: fixed;
}

.grid {
  display: grid;
  grid-template-columns: 1.75fr 1fr;
  height: 100vh;
}

.rightGrid {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  background: rgba(0, 0, 0, 0.6);
  border-left: 0.2em solid #1e1e1e;
  height: 100vh;
}
.leftGrid {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.imageForm {
  height: 100vh;
}

.welcome {
  position: fixed;
  font-weight: bold;
  font-size: xxx-large;
  color: black;
}

.battle {
  grid-row-start: 2.5;
  grid-row-end: 4;
  background-color: #e6ebf1;
  display: grid;
  grid-template-rows: 1fr 1fr;
  border-radius: 0.5em;
  width: 30em;
  justify-self: center;
  padding: 2em;
  filter: drop-shadow(0.1em 0em 0.2em #1e1e1e);
}

.selectTeam {
  justify-self: center;
  align-self: center;
}

.searchGame {
  justify-self: center;
  align-self: center;
}

.form-select {
  filter: drop-shadow(0 0.2em 0.1em #1e1e1e);
}

.teambuilder {
  grid-row-start: 6;
  justify-self: center;
}

.button2 {
  margin-top: 2em;
  height: 4em;
  width: 20em;
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
  margin-top: 2em;
  height: 4em;
  width: 20em;
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

.popUpContainer {
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
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
}



.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
