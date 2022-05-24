<template>
  <SettingsBar/>
  <h1>Página principal</h1>
  <button @click="searchGame()">Buscar partida</button>
  <button>Crear equipo</button>
  <div v-if="searchingGame">
    <h1>Buscando partida...</h1>
    <div class="loader"></div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";
import {send} from "@/services/websocket";

export default defineComponent({
  name: 'HomeView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      searchingGame: false as boolean,
      team: ['Skarmory||leftovers|keeneye|spikes,whirlwind,toxic,protect|Impish|252,,4,,252,|||||]'
      + 'Dugtrio||choiceband|arenatrap|earthquake,rockslide,aerialace,substitute|Jolly|4,252,,,,252|||||]'
      + 'Gengar||leftovers|levitate|thunderbolt,icepunch,gigadrain,firepunch|Timid|4,,,252,,252|||||]'
      + 'Swampert||leftovers|torrent|earthquake,icebeam,hydropump,roar|Relaxed|252,,216,40,,|||||]'
      + 'Salamence||choiceband|intimidate|crunch,rockslide,earthquake,fireblast|Adamant|4,252,,,,252|||||]'
      + 'Celebi||leftovers|naturalcure|calmmind,gigadrain,psychic,recover|Timid|252,,80,,,176|||||'],
    }
  },
  methods: {
    searchGame() {
      const format = "gen3ou";
      send('|/utm ' + this.team);
      send('|/search ' + format);
      this.searchingGame = true;
      console.log("BUSCANDO PARTIDA...");
    }
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
