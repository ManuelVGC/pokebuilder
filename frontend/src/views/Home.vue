<template>
  <SettingsBar/>
  <div style="margin: 1em">
    <div>
      <button style="margin: 1em" type="button" class="btn btn-danger" @click="searchGame()">Search game</button>
      <button style="margin: 1em" type="button" class="btn btn-info" @click="this.$router.push('/teams')">Teambuilder</button>
    </div>
    <div style="margin: 1em" v-if="searchingGame">
      <b style="margin: 1em">Searching for a game...</b>
      <div class="loader" style="margin: 1em"></div>
      <button style="margin: 1em" type="button" class="btn btn-outline-secondary btn-sm" @click="cancelSearch()">Cancel search</button>
    </div>
    <div>
      <select v-model="teamSelected" name="teams">
        <option v-for="(team, index) in packedTeams" :key="index" :value="team.team">
          <div>{{team.name}}</div>
          <div v-for="(pokemon, index2) in team.team" :key="index2">{{pokemon.name}}</div>
        </option>
      </select>
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
    }
  },
  methods: {
    /** Búsqueda de partida en la ladder. */
    searchGame() {
      const format = "gen3ou";
      console.log(this.teamSelected);
      if (this.teamSelected.length != 0) {
        send('|/utm ' + this.teamSelected);
        send('|/search ' + format);
        this.searchingGame = true;
        console.log("Searching for a game...");
      } else {
        console.log('You need a team to battle!');
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
  },
  mounted() {
    this.$store.commit('SET_BATTLEFINISHED', true);
    this.loadUserTeams();
  }
})
</script>

<style scoped>
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
