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
  </div>
</template>

<script lang="ts">
/** View para el menú principal de la página web. */

import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar.vue";
import {send} from "@/services/websocket";

export default defineComponent({
  name: 'HomeView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      searchingGame: false as boolean, /** Flag que indica si se está buscando batalla. */

      /** Equipo Pokémon que se enviará a Showdown para jugarlo en una batalla. De momento está puesto a mano pero la idea final es poder escoger uno de los equipos creados en el Teambuilder. */
      team: ['Swampert||leftovers|torrent|earthquake,icebeam,hydropump,roar|Relaxed|252,,216,40,,|||||]'
      + 'Skarmory||leftovers|keeneye|spikes,whirlwind,toxic,protect|Impish|252,,4,,252,|||||]'
      + 'Dugtrio||choiceband|arenatrap|earthquake,rockslide,aerialace,substitute|Jolly|4,252,,,,252|||||]'
      + 'Castform||leftovers|forecast|raindance,blizzard,bodyslam,doubleedge|Timid|4,,,252,,252|||||]'
      + 'Salamence||choiceband|intimidate|crunch,rockslide,earthquake,fireblast|Adamant|4,252,,,,252|||||]'
      + 'Celebi||leftovers|naturalcure|batonpass,gigadrain,psychic,recover|Timid|252,,80,,,176|||||'],
    }
  },
  methods: {
    /** Búsqueda de partida en la ladder. */
    /*searchGame() {
      const format = "gen3ou";
      send('|/utm ' + this.team);
      send('|/search ' + format);
      this.searchingGame = true;
      console.log("Searching for a game...");
    },*/

    /** Búsqueda de partida contra una cuenta de Showdown específica (Smile DD) para hacer pruebas porque en la ladder normal no hay excesiva gente jugando. */
    searchGame() {
      const format = "gen3ou";
      send('|/utm ' + this.team);
      send('|/challenge Smile DD, ' + format);
      this.searchingGame = true;
      console.log("Searching for a game...");
    },

    /** Cancelación de búsqueda de partida. */
    cancelSearch() {
      send('|/cancelsearch');
      this.searchingGame = false;
    },
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
