<template>
  <SettingsBar/>
  <h1>Main window</h1>
  <button @click="searchGame()">Search game</button>
  <button v-if="searchingGame" @click="cancelSearch()">Cancel search</button>
  <button @click="this.$router.push('/teams')">Create team</button>
  <div v-if="searchingGame">
    <h1>Searching for a game...</h1>
    <div class="loader"></div>
  </div>
</template>

<script lang="ts">
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
      searchingGame: false as boolean,
      team: ['Skarmory||leftovers|keeneye|spikes,whirlwind,toxic,protect|Impish|252,,4,,252,|||||]'
      + 'Dugtrio||choiceband|arenatrap|earthquake,rockslide,aerialace,substitute|Jolly|4,252,,,,252|||||]'
      + 'Castform||leftovers|forecast|raindance,blizzard,bodyslam,doubleedge|Timid|4,,,252,,252|||||]'
      + 'Swampert||leftovers|torrent|earthquake,icebeam,hydropump,roar|Relaxed|252,,216,40,,|||||]'
      + 'Salamence||choiceband|intimidate|crunch,rockslide,earthquake,fireblast|Adamant|4,252,,,,252|||||]'
      + 'Celebi||leftovers|naturalcure|calmmind,gigadrain,psychic,recover|Timid|252,,80,,,176|||||'],
    }
  },
  methods: {
    //Búsqueda de partida en la ladder
    /*searchGame() {
      const format = "gen3ou";
      send('|/utm ' + this.team);
      send('|/search ' + format);
      this.searchingGame = true;
      console.log("Searching for a game...");
    },*/
    searchGame() {
      const format = "gen3ou";
      send('|/utm ' + this.team);
      send('|/challenge Smile DD, ' + format);
      this.searchingGame = true;
      console.log("Searching for a game...");
    },

    //Cancelación de búsqueda de partida
    cancelSearch() {
      send('|/cancelsearch');
      this.searchingGame = false;
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
