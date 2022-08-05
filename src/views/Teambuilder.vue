<template>
  <SettingsBar/>
  <button style="margin: 1em" type="button" class="btn btn-outline-secondary btn-sm" @click="this.$router.push('/teams')">Go back to the team list</button>
  <h1 style="margin: 1em">Welcome to the teambuilder!</h1>
  <div class="autocomplete">
    <input style="margin: 1em" class="form-control me-sm-2" type="text" placeholder="Type the name of a Pokémon to add" v-model="pokemonSpecies">
    <ul class="autocomplete-results">
      <li class="autocomplete-result">

      </li>
    </ul>
  </div>
  <button style="margin: 1em" type="button" class="btn btn-outline-secondary btn-sm" @click="getTeams()">GET TEAMS</button>
</template>

<script lang="ts">
/** View para la página de creación de equipos. */

import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar.vue";
import { getDex } from "@/services/teambuilderService";

export default defineComponent({
  name: 'TeambuilderView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      //pokemonSpecies: [] as Dex.Species[],
    }
  },
  methods: {
    /*onChange() {
      getAllPokemon();
    }*/
    async getTeams() {
      const res = await getDex('hola');
      console.log(res);
    },
  }
})
</script>

<style scoped>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 1em;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 6px 6px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #A4A4A4;
  color: white;
}
</style>
