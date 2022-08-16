<template>
  <SettingsBar/>
  <div v-if="errorInTeam" class="alert alert-dismissible alert-warning">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    <h4 class="alert-heading">The team has the following errors:</h4>
    <div v-for="error in errosInTeam" :key="error">- {{error}}</div>
  </div>
  <SideBar v-if="pokemonSelectedProps.actionType != ''" v-bind="pokemonSelectedProps" @abilityItemMoveNatureAdded="handleAbilityItemMoveNatureAdded"/>
  <button style="margin: 1em" type="button" class="btn btn-outline-secondary btn-sm" @click="goBackToTeamList()">Go back to the team list</button>
  <button style="margin: 1em" type="button" class="btn btn-success" @click="saveTeam()">Save team</button>
  <h1 style="margin: 1em">Welcome to the teambuilder!</h1>
  <div class="teamName">
    <div>Team name: </div>
    <input class="inputTeamName" type="text" placeholder="Type the name of your Pokémon team!" v-model="pokemonTeamName">
  </div>
  <div class="autocomplete">
    <input style="margin: 1em" class="form-control me-sm-2" type="text" placeholder="Type the name of a Pokémon to add" v-model="search" @input="onChange()">
    <ul v-show="isOpen" class="autocomplete-results">
      <li v-for="(pokemon, i) in resultListAutocomplete" :key="i" class="autocomplete-result" @click="addPokemon(pokemon)">
       {{pokemon}}
      </li>
    </ul>
  </div>
  <PokemonCard v-for="(pokemon, index) in pokemonTeamArray" :key="index" :pokemon="pokemon" @addAbility="handleAddAbility" @addItem="handleAddItem" @addMove="handleAddMove" @addNature="handleAddNature" @deleteItemAbilityMoveNature="handleDeleteItemAbilityMoveNature" @deletePokemon="handleDeletePokemon" @updateEVsIVs="handleUpdateEVsIVs"></PokemonCard>
</template>

<script lang="ts">
/** View para la página de creación de equipos. */

import {defineComponent} from "vue";
import SettingsBar from "../components/SettingsBar.vue";
import {convertToJSON, getPokemonListDex} from "../services/showdownLibraryService";
import PokemonCard from "@/components/PokemonCard.vue";
import {IPokemon, Pokemon} from "@/interfaces/Pokemon";
import SideBar from "@/components/Sidebar.vue";
import {createTeam, getTeam, updateTeam} from "@/services/teambuilderService";
import {ITeam} from "@/interfaces/Team";

export default defineComponent({
  name: 'TeambuilderView',
  components: {
    SideBar,
    SettingsBar,
    PokemonCard,
  },
  data() {
    return {
      search: '' as string, /** Palabra introducida por el usuario en la barra de búsqueda */
      resultListAutocomplete: [] as string[], /** Lista con los resultados autocompletados a partir de la palabra introducida por el usuario. */
      pokemonNameList: [] as string[], /** Lista con todos los Pokémon que se pueden utilizar. */
      isOpen: false as boolean, /** Flag que maneja cuándo se ve la lista de resultados autocompletados. */

      pokemonSelectedProps: { /** Pokémon seleccionado para modificar y acción que se quiere realizar sobre él. */
        pokemonSelected: {} as IPokemon,
        actionType: '' as string,
      },
      pokemonTeamArray: [] as IPokemon[], /** Equipo Pokémon en construcción. */
      pokemonTeamName: '' as string, /** Nombre del equipo Pokémon en construcción. */

      errorInTeam: false as boolean, /** Flag que indica si ha habido algún error al intentar guardar el equipo. */
      errosInTeam: [] as string[], /** Errores que han surgido al intentar guardar el equipo. */
    }
  },
  computed: {
    /** Nombres de los Pokémon que forman el equipo en construcción. */
    pokemonTeamNames() {
      let pokemonTeamNames = [];
      let pokemonTeam = this.pokemonTeamArray as IPokemon[];

      for (let i = 0; i < pokemonTeam.length; i++) {
        let pokemonName = pokemonTeam[i].name;
        pokemonTeamNames.push(pokemonName);
      }
      return pokemonTeamNames;
    },
  },
  methods: {
    /** Volver a la vista Teams.vue. */
    goBackToTeamList(){
      if(confirm("Are you sure you want to go back to the teamlist without saving the current team?")) {
        this.$router.push('/teams')
      }
    },

    /** Validar y guardar el equipo en construcción. */
    async saveTeam() {
      let pokemonTeam = {} as ITeam;

      for (let i = 0; i < this.pokemonTeamArray.length; i++) {
        this.pokemonTeamArray[i].happiness = 100;
        this.pokemonTeamArray[i].species = this.pokemonTeamArray[i].name;
        for (let j = 0; j < this.pokemonTeamArray[i].moves.length; j++) {
          if (this.pokemonTeamArray[i].moves[j] === 'Frustration') {
            this.pokemonTeamArray[i].happiness = 0;
          }
        }
      }

      pokemonTeam.pokemon = this.pokemonTeamArray;
      pokemonTeam.user = this.$store.state.user.username;
      pokemonTeam.name = this.pokemonTeamName;

      const res = await convertToJSON(pokemonTeam.pokemon);
      pokemonTeam.pokemon = res.data;

      let validation;
      const id = this.$route.params.id as string;
      if (id === 'newTeam') {
        validation = await createTeam(pokemonTeam);
      } else {
        validation = await updateTeam(this.$store.state.user.username, id, pokemonTeam);
      }

      if (validation.data != '') {
        this.errorInTeam = true;
        this.errosInTeam = validation.data;
      } else {
        this.errorInTeam = false;
        this.errosInTeam = [];
        this.$router.push('/teams')
      }
    },

    /** Conseguir una lista con todos los Pokémon que se pueden utilizar. */
    async getPokemonList() {
      const res = await getPokemonListDex();
      this.pokemonNameList = res.data;
    },

    /** Filtrar resultados autocompletados a partir de la palabra introducida por el usuario en la barra de búsqueda. */
    filterResults() {
      this.resultListAutocomplete = this.pokemonNameList.filter(pokemon => pokemon.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
      for (let i = 0; i < this.pokemonTeamNames.length; i++) {
        if (this.resultListAutocomplete.indexOf(this.pokemonTeamNames[i]) != -1) {
          this.resultListAutocomplete.splice(this.resultListAutocomplete.indexOf(this.pokemonTeamNames[i]), 1);
        }
      }
    },

    /** Evento que se activa cuando el usuario cambia el contenido de la barra de búsqueda. */
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },

    /** Añadir Pokémon seleccionado al equipo. */
    addPokemon(pokemon: string) {
      /*this.pokemonCards.push({
        name: PokemonCard.name,
      });
      this.pokemonSpecies = pokemon;*/
      const newPokemon = new Pokemon();
      newPokemon.name = pokemon;
      this.pokemonTeamArray.push(newPokemon);
      this.search = '';
      this.isOpen = false;
    },

    /** Función que maneja cuándo el usuario pulsa fuera de la lista de resultados autocompletados para cerrarla. */
    handleClickOutside(event: MouseEvent) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },

    /** Manejo del evento addAbility. */
    handleAddAbility(pokemon: IPokemon) {
      this.pokemonSelectedProps.actionType = 'ability';
      this.pokemonSelectedProps.pokemonSelected = pokemon;
    },

    /** Manejo del evento addItem. */
    handleAddItem(pokemon: IPokemon) {
      this.pokemonSelectedProps.actionType = 'item';
      this.pokemonSelectedProps.pokemonSelected = pokemon;
    },

    /** Manejo del evento addMove. */
    handleAddMove(pokemon: IPokemon) {
      this.pokemonSelectedProps.actionType = 'move';
      this.pokemonSelectedProps.pokemonSelected = pokemon;
    },

    /** Manejo del evento addNature. */
    handleAddNature(pokemon: IPokemon) {
      this.pokemonSelectedProps.actionType = 'nature';
      this.pokemonSelectedProps.pokemonSelected = pokemon;
    },

    /** Manejo del evento abilityItemMoveNatureAdded. */
    handleAbilityItemMoveNatureAdded(pokemon: IPokemon) {
      this.pokemonSelectedProps.actionType = '';
      for (let i = 0; i < this.pokemonTeamArray.length; i++) {
        if (this.pokemonTeamArray[i].name === pokemon.name) {
          this.pokemonTeamArray[i] = pokemon;
        }
      }
    },

    /** Manejo del evento deleteItemAbilityMoveNature. */
    handleDeleteItemAbilityMoveNature(pokemon: IPokemon) {
      for (let i = 0; i < this.pokemonTeamArray.length; i++) {
        if (this.pokemonTeamArray[i].name === pokemon.name) {
          this.pokemonTeamArray[i] = pokemon;
        }
      }
    },

    /** Manejo del evento deletePokemon. */
    handleDeletePokemon(pokemon: IPokemon) {
      for (let i = 0; i < this.pokemonTeamArray.length; i++) {
        if (this.pokemonTeamArray[i].name === pokemon.name) {
          this.pokemonTeamArray.splice(i ,1);
        }
      }
    },

    /** Manejo del evento updateEVsIVs. */
    handleUpdateEVsIVs(pokemon: IPokemon) {
      for (let i = 0; i < this.pokemonTeamArray.length; i++) {
        if (this.pokemonTeamArray[i].name === pokemon.name) {
          this.pokemonTeamArray[i] = pokemon;
        }
      }
    },

    /** Recuperación del equipo en caso de haber pulsado editar en un equipo en Teams.vue. */
    async loadTeam() {
      if (this.$route.params.id != 'newTeam') {
        let id = this.$route.params.id as string;
        const res = await getTeam(this.$store.state.user.username, id);
        this.pokemonTeamArray = res.data.pokemon;
        this.pokemonTeamName = res.data.name;
      }
    }

  },
  mounted() {
    this.loadTeam();
    this.getPokemonList();
    document.addEventListener('click', this.handleClickOutside);
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

.teamName {
  display: grid;
  grid-template-columns: auto 1fr;
  margin-left: 2em;
}

.inputTeamName {
  margin-left: 1em;
  width: 50%;
}
</style>
