<template>
  <div class="background">
    <SettingsBar class="settingsBar"/>
    <SideBar class="sideBar" v-if="pokemonSelectedProps.actionType !== ''" v-bind="pokemonSelectedProps" @abilityItemMoveNatureAdded="handleAbilityItemMoveNatureAdded"
             @closeSidebar="handleCloseSidebar"/>
    <div class="grid">
      <div class="teamNameButtons">
        <div class="teamName">
          <div class="teamNameText">Team name: </div>
          <input class="inputTeamName" type="text" placeholder=" Type the name of your Pokémon team!" v-model.trim="pokemonTeamName">
        </div>
        <div class="buttons">
          <button type="button" class="buttonGoBack" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.5); border-radius: 0.5em;" @click="goBackToTeamList()">Go back</button>
          <button type="button" class="buttonSaveTeam" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.5); border-radius: 0.5em;" @click="saveTeam()">Save team</button>
        </div>
      </div>
      <div class="autocomplete" v-if="pokemonTeamArray.length < 6">
        <input class="searchPokemonInput" type="text" placeholder=" Type the name of a Pokémon to add it to the team" v-model="search" @input="onChange()">
        <ul v-show="isOpen" class="autocomplete-results">
          <li v-for="(pokemon, i) in resultListAutocomplete" :key="i" class="autocomplete-result" @click="addPokemon(pokemon)">
            {{pokemon}}
          </li>
        </ul>
      </div>
      <div class="suggestions" v-if="pokemonTeamArray.length < 6">
        <!--<p class="sugerencias">Aquí irían las sugerencias de Pokémon</p>-->
        <button @click="showRecommendationsFromSystem()">RECOMENDACIONES</button>
      </div>

    </div>
    <div class="pokemonCards">
      <PokemonCard v-for="(pokemon, index) in pokemonTeamArray" :key="index" :pokemon="pokemon" class="pokemonCard" @addAbility="handleAddAbility"
                   @addItem="handleAddItem" @addMove="handleAddMove" @addNature="handleAddNature" @deleteItemAbilityMoveNature="handleDeleteItemAbilityMoveNature"
                   @deletePokemon="handleDeletePokemon" @updateEVsIVs="handleUpdateEVsIVs"></PokemonCard>
    </div>
    <div v-if="errorInTeam" class="popUpContainer">
      <div class="popUp">
        <p class="errorTitle">The team has the following errors:</p>
        <div class="errorDescription" v-for="error in errosInTeam" :key="error">- {{error}}</div>
        <button @click="closeErrorInTeam()" class="buttonCloseError" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Close</button>
      </div>
    </div>

    <div v-if="errorTeamNameEmpty" class="popUpContainer">
      <div class="popUp">
        <p class="errorTitle">The team has the following errors:</p>
        <div class="errorDescription">You have to introduce a team name.</div>
        <button @click="closeErrorTeamNameEmpty()" class="buttonCloseError" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Close</button>
      </div>
    </div>

    <div v-if="goBackConfirmation" class="popUpContainer">
      <div class="popUp">
        <p class="errorTitle">Warning!</p>
        <div class="errorDescription">Are you sure you want to go back to the teamlist without saving the current changes?</div>
        <div>
          <button @click="this.$router.push('/teams')" class="buttonGoBackConfirm" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Go back</button>
          <button @click="cancel()" class="buttonCancel" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Cancel</button>
        </div>
      </div>
    </div>
  </div>
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
import {getRecommendations} from "@/services/recommendationSystemService";

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
      errorTeamNameEmpty: false as boolean, /** Flag que indica que el usuario no ha introducido un nombre para el equipo. */
      goBackConfirmation: false as boolean, /** Flag que indica si el jugador quiere volver a la página anterior. */

      recommendations: [],
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
      this.goBackConfirmation = true;
    },

    /** Cancelar volver a la vista Teams.vue. */
    cancel() {
      this.goBackConfirmation = false;
    },

    /** Validar y guardar el equipo en construcción. */
    async saveTeam() {
      if (this.pokemonTeamName.trim() != '') {
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
      } else {
        this.errorTeamNameEmpty = true;
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

    handleCloseSidebar() {
      this.pokemonSelectedProps.actionType = '';
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
    },

    /** Cerrar el cuadro de texto que nos indica los errores en el equipo. */
    closeErrorInTeam() {
      this.errorInTeam = false;
    },

    /** Cerrar el cuadro de texto que nos indica que falta por introducir el nombre del equipo. */
    closeErrorTeamNameEmpty() {
      this.errorTeamNameEmpty = false;
    },


    async getRecommendationsFromSystem() {
      /*const ids =  {
        sequence: [1,2],
        topk: 20
      };
      console.log('Las ids son: ');
      console.log(ids);*/
      const res = await getRecommendations();
      this.recommendations = res.data;
      console.log('Las recomendaciones que me dan son: ');
      console.log(this.recommendations);
    },

    showRecommendationsFromSystem() {
      console.log(this.recommendations);
    },

  },
  mounted() {
    this.loadTeam();
    this.getPokemonList();
    document.addEventListener('click', this.handleClickOutside);
    this.getRecommendationsFromSystem();
  },
})
</script>

<style scoped>
.background {
  background-image: url("../assets/home/pokemonWallpaper20Anniversary.jpg");
  min-height: 100vh;
  height: auto;
}

.autocomplete-result:hover {
  background-color: #A4A4A4;
  color: white;
}

.settingsBar {
  border-bottom: 0.3em solid #1e1e1e;
  height: 10vh;
}

.sideBar {
  overflow-y: scroll;
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

.buttonCancel {
  margin-top: 2em;
  height: 4em;
  width: 20em;
  background-color: #4b88c3;
  color: white;
  font-size: large;
}

.buttonCancel:hover {
  background-color: #5397d9;
}

.buttonCancel:active {
  background-color: #4b88c3;
}

.buttonGoBackConfirm {
  margin-top: 2em;
  height: 4em;
  width: 20em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonGoBackConfirm:hover {
  background-color: #e85660;
}

.buttonGoBackConfirm:active {
  background-color: #d7313e;
}

.buttonCloseError {
  margin-top: 2em;
  height: 4em;
  width: 20em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonCloseError:hover {
  background-color: #e85660;
}

.buttonCloseError:active {
  background-color: #d7313e;
}

.buttonGoBack {
  height: 4em;
  width: 10em;
  background-color: #d7313e;
  color: white;
}

.buttonGoBack:hover {
  background-color: #e85660;
}

.buttonGoBack:active {
  background-color: #d7313e;
}


.buttonSaveTeam {
  height: 4em;
  width: 10em;
  background-color: #4bbf73;
  color: #1e1e1e;
  margin-left: 1em;
}

.buttonSaveTeam:hover {
  background-color: #58e88a;
}

.buttonSaveTeam:active {
  background-color: #4bbf73;
}

.grid {
  display: grid;
  grid-template-rows: 7em 1fr 7em;
}

.teamNameButtons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.teamName {
  background-color: white;
  border-radius: 0.5em;
  box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.5);
  margin: 1em 0em 1em 1.5em;
  padding: 1em 1.5em;
}

.teamNameText {
  font-size: x-large;
  font-weight: bold;
  color: #1e1e1e;
  display: inline-block;
}

.inputTeamName {
  border-radius: 0.3em;
  display: inline-block;
  margin-left: 1em;
  width: 82%;
  height: 2em;
}

.buttons {
  justify-self: end;
  margin-right: 1.5em;
}

.searchPokemonInput {
  width: 94vw;
  border-radius: 0.3em;
  height: 3em;
}


.autocomplete {
  background-color: white;
  border-radius: 0.5em;
  box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.5);
  margin: 0em 1.5em 1.5em 1.5em;
  padding: 1.5em;
  align-self: center;
}

.autocomplete-results {
  padding: 0;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
  background-color: white;
  margin: 0.5em 0em 0em 0em;
}

.autocomplete-result {
  border: 0.1em solid #1e1e1e;
  text-align: left;
  padding: 0.5em 0.5em;
  cursor: pointer;
  color: #1e1e1e;
}

.suggestions {
  background-color: #d7313e;
  display: grid;
  align-items: center;
  justify-content: center;
}

.sugerencias {
  font-weight: bold;
  color: black;
  font-size: x-large;
}

.pokemonCards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  margin-top: 3em;
}

.pokemonCard {
  margin-bottom: 2.5em;
  justify-self: center;
}
</style>
