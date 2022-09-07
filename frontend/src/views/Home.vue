<template>
  <SettingsBar class="settingsBar"/>
  <div class="background">
    <div class="grid">
      <div class="leftGrid">
        <div class="welcome">
          <p class="welcomeText" >Welcome to Pokebuilder, {{this.$store.state.user.username}}!</p>
        </div>
      </div>
      <div class="rightGrid">
        <div class="battle">
          <div class="selectTeam">
            <select class="form-select" v-model="teamSelected" name="teams">
              <option class="selectOption" v-for="(team, index) in packedTeams" :key="index" :value="team.team">
                <div>{{team.name}}</div>
              </option>
            </select>
          </div>
          <div v-if="!searchingGame" class="searchGame">
            <button type="button" class="buttonSearch" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.6); border-radius: 0.5em;" @click="searchGame()">Search game</button>
          </div>
          <div v-if="searchingGame" class="searchingGame">
            <button type="button" class="buttonSearching" style="border-radius: 0.5em;" @click="cancelSearch()">Searching game... Click to cancel.</button>
          </div>
        </div>
        <button type="button" class="buttonTeambuilder teambuilder" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;" @click="this.$router.push('/teams')">Teambuilder</button>
      </div>
    </div>
    <div v-if="error" class="popUpContainer">
      <div class="popUp">
        <p class="errorTitle">Error</p>
        <p class="errorDescription">You need a team to battle!</p>
        <button @click="closeError()" class="buttonError" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Close</button>
      </div>
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
        this.$store.commit('SET_TEAMSELECTED', this.teamSelected);
        send('|/utm ' + this.teamSelected);
        send('|/search ' + format);
        this.searchingGame = true;
      } else {
        this.error = true;
      }
    },

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
    send('|/hidenext off');
    this.$store.commit('SET_BATTLEFINISHED', true);
    this.loadUserTeams();
  }
})
</script>

<style scoped>
.settingsBar {
  border-bottom: 0.3em solid #1e1e1e;
  position: fixed;
  height: 10vh;
}

.background {
  background-image: url("../assets/home/pokemonWallpaperBackground.jpg");
  min-height: 100vh;
  height: auto;
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
  display: grid;
  justify-content: center;
  align-items: center;
}

.welcomeText {
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
  justify-items: center;
  align-items: center;
  justify-self: center;
  padding: 2em;
  box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.6);
}

.selectTeam {
  justify-self: center;
  align-self: center;

}

.selectOption {
  color: #1e1e1e;
}

.searchGame {
  display: grid;
  justify-items: center;
  align-items: center;
}

.searchingGame {
  display: grid;
  justify-items: center;
  align-items: center;
}

.form-select {
  box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.6);
}

.teambuilder {
  grid-row-start: 6;
  justify-self: center;
}

.buttonSearch {
  margin: 1em 0em;
  height: 4em;
  width: 20em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonSearch:hover {
  background-color: #e85660;
}

.buttonSearch:active {
  background-color: #d7313e;
}

.buttonSearching {
  margin: 1em 0em;
  height: 4em;
  width: 20em;
  background-color: #A4A4A4;
  color: white;
  font-size: large;
}

.buttonSearching:hover {
  background-color: #e85660;
}

.buttonSearching:active {
  background-color: #A4A4A4;
}

.buttonTeambuilder {
  margin: 1em 0em;
  height: 4em;
  width: 20em;
  background-color: #1768AC;
  color: white;
  font-size: large;
}

.buttonTeambuilder:hover {
  background-color: #5397f9;
  color: white;
}

.buttonTeambuilder:active {
  background-color: #1768AC;
}


.buttonError {
  margin-top: 2em;
  height: 4em;
  width: 20em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonError:hover {
  background-color: #e85660;
}

.buttonError:active {
  background-color: #d7313e;
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
  z-index: 3;
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

@media screen and (max-width: 1400px) {
  .battle {
    padding: 2em;
    width: 80%;

  }

  .buttonSearch {
    width:90%;
  }

  .buttonSearching {
    width:90%;
  }

  .buttonTeambuilder {
    width:90%;
  }
}
</style>
