<template>
  <SettingsBar/>
  <button style="margin: 1em" type="button" class="btn btn-outline-secondary btn-sm" @click="this.$router.push('/teams')">Go back to the team list</button>
  <h1 style="margin: 1em">Welcome to the teambuilder!</h1>
  <div class="autocomplete">
    <input style="margin: 1em" class="form-control me-sm-2" type="text" placeholder="Type the name of a Pokémon to add" v-model="pokemonSpecies" @input="onChange()">
    <ul v-show="isOpen" class="autocomplete-results">
      <li v-for="(pokemon, i) in resultListAutocomplete" :key="i" class="autocomplete-result" @click="addPokemon(pokemon)">
        {{pokemon}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
/** View para la página de creación de equipos. */

import {defineComponent} from "vue";
import SettingsBar from "../components/SettingsBar.vue";
import { getPokemonListDex } from "../services/showdownLibraryService";

export default defineComponent({
  name: 'TeambuilderView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      pokemonSpecies: '' as string, /** Palabra introducida por el usuario en la barra de búsqueda */
      resultListAutocomplete: [] as string[], /** Lista con los resultados autocompletados a partir de la palabra introducida por el usuario. */
      pokemonNameList: [] as string[], /** Lista con todos los Pokémon que se pueden utilizar. */
      isOpen: false as boolean, /** Flag que maneja cuándo se ve la lista de resultados autocompletados. */
    }
  },
  methods: {
    /** Conseguir una lista con todos los Pokémon que se pueden utilizar. */
    async getPokemonList() {
      const res = await getPokemonListDex();
      console.log(res.data);
      this.pokemonNameList = res.data;
    },

    /** Filtrar resultados autocompletados a partir de la palabra introducida por el usuario en la barra de búsqueda. */
    filterResults() {
      this.resultListAutocomplete = this.pokemonNameList.filter(pokemon => pokemon.toLowerCase().indexOf(this.pokemonSpecies.toLowerCase()) > -1);
    },

    /** Evento que se activa cuando el usuario cambia el contenido de la barra de búsqueda. */
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },

    /** Añadir Pokémon seleccionado al equipo. */
    addPokemon(pokemon: string) {
      this.pokemonSpecies = pokemon;
      this.isOpen = false;
    },

    /** Función que maneja cuándo el usuario pulsa fuera de la lista de resultados autocompletados para cerrarla. */
    handleClickOutside(event: MouseEvent) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    this.getPokemonList();
    document.addEventListener('click', this.handleClickOutside)
  },
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
