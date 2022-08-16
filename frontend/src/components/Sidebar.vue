<template>
  <div class="tableContainer">

    <div class="pokemonInfo">
      <div>{{pokemonSelected.name}}</div>
      <div>Pokemon types</div>
    </div>

    <div>
      <table style="margin: 1em" class="table table-hover" v-if="actionType === 'ability'">
        <thead>
        <tr class="table-info">
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ability in abilitiesList" :key="ability" class="table-primary">
          <td>{{ability.name}}</td>
          <td>{{ability.desc}}</td>
          <td>
            <button type="button" class="btn btn-danger" @click="addAbility(ability.name)">Add</button>
          </td>
        </tr>
        </tbody>
      </table>

      <table style="margin: 1em" class="table table-hover" v-if="actionType === 'item'">
        <thead>
        <tr class="table-info">
          <th scope="col"></th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in itemsList" :key="item" class="table-primary">
          <td>Icon</td>
          <td>{{item.name}}</td>
          <td>{{item.desc}}</td>
          <td>
            <button type="button" class="btn btn-danger" @click="addItem(item.name)">Add</button>
          </td>
        </tr>
        </tbody>
      </table>

      <table style="margin: 1em" class="table table-hover" v-if="actionType === 'move'">
        <thead>
          <tr class="table-info">
            <th scope="col">Type</th>
            <th scope="col">Name</th>
            <th scope="col">Power</th>
            <th scope="col">Accuracy</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="move in movesList" :key="move" class="table-primary">
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.type}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.name}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.basePower}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.accuracy}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">{{move.shortDesc}}</td>
            <td v-if="this.pokemonSelected.moves == null || (this.pokemonSelected.moves != null && this.pokemonSelected.moves.indexOf(move.name) === -1)">
              <button type="button" class="btn btn-danger" @click="addMove(move.name)">Add</button>
            </td>
          </tr>
        </tbody>
      </table>

      <table style="margin: 1em" class="table table-hover" v-if="actionType === 'nature'">
        <thead>
        <tr class="table-info">
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="nature in naturesList" :key="nature" class="table-primary">
          <td>{{nature.name}}</td>
          <td>{{nature.description}}</td>
          <td>
            <button type="button" class="btn btn-danger" @click="addNature(nature.name)">Add</button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script lang="ts">
/** Componente que muestra diferentes listas (de items, movimientos, ...) para poder añadirlos al Pokémon elegido. */

import {IPokemon} from "@/interfaces/Pokemon";
import {defineComponent} from "vue";
import {getItemList, getPokemonData, getNatureList} from "@/services/showdownLibraryService";

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
      const res = await getItemList();
      this.itemsList = res.data;
    },

    /** Conseguir la lista de posibles naturalezas que puede tener el Pokémon seleccionado. */
    async getNaturesList() {
      const res = await getNatureList();
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
    }
  },
  mounted() {
    this.getAbilitiesList(this.pokemonSelected.name);
    this.getMovesList(this.pokemonSelected.name);
    this.getItemsList();
    this.getNaturesList();
  }
})
</script>

<style scoped>
.tableContainer {
  width: 60%;
}
.pokemonInfo {
  padding: 1.5em;
}
</style>
