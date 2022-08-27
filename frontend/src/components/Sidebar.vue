<template>
  <div class="sidebarContainer">
    <div class="sidebar">
      <div class="pokemonInfo">
        <div>
          <div class="pokemonSelected">
            <img :src="pokemonURL + pokemonSelected.name.toLowerCase() + extension">
          </div>
          <div class="pokemonTypes" >
            <img v-for="type in pokemonTypes" :key="type" :src="typesURL + type + extension">
          </div>
        </div>
        <font-awesome-icon @click="closeSidebar()" class="close" icon="fa-solid fa-xmark"/>
      </div>

      <div class="tableContainer">
        <table class="table" v-if="actionType === 'ability'">
          <thead>
          <tr class="table-head">
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="ability in abilitiesList" :key="ability" class="table-primary">
            <td style="font-weight: bold">{{ability.name}}</td>
            <td>{{ability.desc}}</td>
            <td>
              <button type="button" class="button" @click="addAbility(ability.name)">Add</button>
            </td>
          </tr>
          </tbody>
        </table>

        <table class="table" v-if="actionType === 'item'">
          <thead>
          <tr class="table-head">
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in itemsList" :key="item" class="table-primary">
            <td style="font-weight: bold">{{item.name}}</td>
            <td>{{item.desc}}</td>
            <td>
              <button type="button" class="button" @click="addItem(item.name)">Add</button>
            </td>
          </tr>
          </tbody>
        </table>

        <table class="table" v-if="actionType === 'move'">
          <thead>
          <tr class="table-head">
            <th scope="col">Type</th>
            <th scope="col" style="font-weight: bold">Name</th>
            <th scope="col">Power</th>
            <th scope="col">Accuracy</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="move in movesList" :key="move" class="table-primary">
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">
              <img :src="typesURL + move.type + extension">
            </td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.name}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.basePower}}</td>
            <td v-if="(this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)) && move.accuracy == true">100</td>
            <td v-if="(this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)) && move.accuracy != true">{{move.accuracy}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.shortDesc}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">
              <button type="button" class="button" @click="addMove(move.name)">Add</button>
            </td>
          </tr>
          </tbody>
        </table>

        <table class="table" v-if="actionType === 'nature'">
          <thead>
          <tr class="table-head">
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="nature in naturesList" :key="nature" class="table-primary">
            <td style="font-weight: bold">{{nature.name}}</td>
            <td>{{nature.description}}</td>
            <td>
              <button type="button" class="button" @click="addNature(nature.name)">Add</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** Componente que muestra diferentes listas (de items, movimientos, ...) para poder añadirlos al Pokémon elegido. */

import {IPokemon} from "@/interfaces/Pokemon";
import {defineComponent} from "vue";
import {getList, getPokemonData} from "@/services/showdownLibraryService";

export default defineComponent({
  name: "SideBar",
  props: { /** Pokémon seleccionado. */
    pokemonSelected: {
      type: Object as () => IPokemon,
      required: true,
    },
    actionType: { /** Tipo de acción que se requiere. Puede ser 'ability', 'item', 'move' o 'nature' dependiendo de qué se quiera añadir al Pokémon seleccionado. */
      type: String,
      required: true,
    }
  },
  data() {
    return {
      abilitiesList: [], /** Lista de posibles habilidades del Pokémon seleccionado. */
      movesList: [], /** Lista de posibles movimientos del Pokémon seleccionado. */
      itemsList: [], /** Lista de posibles items que puede llevar Pokémon seleccionado. */
      naturesList: [], /** Lista de posibles naturalezas del Pokémon seleccionado. */
      modifiedPokemon: {} as IPokemon, /** Pokémon modificado con los nuevos valores. */

      pokemonURL: 'https://play.pokemonshowdown.com/sprites/gen3/' as string,  /** URL donde se encuentran los iconos de los Pokémon. */
      typesURL: 'https://play.pokemonshowdown.com/sprites/types/' as string,  /** URL donde se encuentran los iconos de los tipos de Pokémon. */
      extension: '.png' as string, /** Extensión de los iconos. */

      pokemonTypes: [] as string[], /** Tipos del Pokémon seleccionado. */
    }
  },
  methods: {
    /** Conseguir la lista de posibles habilidades que puede tener el Pokémon seleccionado. */
    async getAbilitiesList(pokemonName: string) {
      const res = await getPokemonData(pokemonName, 'abilities');
      this.abilitiesList = res.data;
    },

    /** Conseguir la lista de posibles movimientos que puede tener el Pokémon seleccionado. */
    async getMovesList(pokemonName: string) {
      const res = await getPokemonData(pokemonName, 'learnset');
      this.movesList = res.data;
    },

    /** Conseguir la lista de posibles items que puede tener el Pokémon seleccionado. */
    async getItemsList() {
      const res = await getList('itemsList');
      this.itemsList = res.data;
    },

    /** Conseguir la lista de posibles naturalezas que puede tener el Pokémon seleccionado. */
    async getNaturesList() {
      const res = await getList('naturesList');
      this.naturesList = res.data;
    },

    /** Añadir habilidad al Pokémon seleccionado. */
    addAbility(abilityName: string) {
      this.modifiedPokemon = this.pokemonSelected;
      this.modifiedPokemon.ability = abilityName;
      this.$emit('abilityItemMoveNatureAdded', this.modifiedPokemon);
    },

    /** Añadir item al Pokémon seleccionado. */
    addItem(itemName: string) {
      this.modifiedPokemon = this.pokemonSelected;
      this.modifiedPokemon.item = itemName;
      this.$emit('abilityItemMoveNatureAdded', this.modifiedPokemon);
    },

    /** Añadir movimiento al Pokémon seleccionado. */
    addMove(moveName: string) {
      this.modifiedPokemon = this.pokemonSelected;
      this.modifiedPokemon.moves.push(moveName);
      this.$emit('abilityItemMoveNatureAdded', this.modifiedPokemon);
    },

    /** Añadir naturaleza al Pokémon seleccionado. */
    addNature(natureName: string) {
      this.modifiedPokemon = this.pokemonSelected;
      this.modifiedPokemon.nature = natureName;
      this.$emit('abilityItemMoveNatureAdded', this.modifiedPokemon);
    },

    /** Cerrar el sidebar. */
    closeSidebar() {
      this.$emit('closeSidebar');
    },

    /** Conseguir tipos del Pokémon de la tarjeta. */
    async getTypes (pokemonName: string) {
      const res = await getPokemonData(pokemonName, 'types');
      this.pokemonTypes = res.data;
    },
  },
  mounted() {
    this.getAbilitiesList(this.pokemonSelected.name);
    this.getMovesList(this.pokemonSelected.name);
    this.getItemsList();
    this.getNaturesList();
    this.getTypes(this.pokemonSelected.name);
  }
})
</script>

<style scoped>
.sidebarContainer {
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: end;
  align-items: start;
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}

.sidebar {
  width: 50%;
  background: white;
}

.tableContainer {
  padding: 1.5em;
}

.pokemonSelected {
  display: inline-block;
}

.pokemonTypes {
  display: inline-block;
  margin-left: 1em;
}

.pokemonTypes img {
  margin-right: 0.5em;
}

.pokemonInfo {
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 1.5em 1.5em 0em 1.5em;
  font-size: large;
  color: #1e1e1e;
  font-weight: bold;
}

.button {
  height: 4em;
  width: 5em;
  background-color: #4bbf73;
  color: #1e1e1e;
  font-weight: bold;
  border-radius: 0.5em;
}

.button:hover {
  background-color: #58e88a;
}

.button:active {
  background-color: #4bbf73;
}

.table-head {
  background-color: #3498db;
  color: #1e1e1e;
}

.table {
  border: 0.1em solid #1e1e1e;
}

.close {
  justify-self: end;
  margin-right: 0.5em;
  align-self: center;
  cursor: pointer;
}
</style>
