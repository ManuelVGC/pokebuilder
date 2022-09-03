<template>
  <div class="mainGrid">
    <div class="gridAddElements">
      <div class="mainGridLeft">
        <div class="containerSpriteTypes">
          <div class="pokemonSprite">
            <img :src="pokemonURL + pokemon.name.toLowerCase() + extension">
          </div>
          <div class="pokemonTypes" >
            <img v-for="type in pokemonTypes" :key="type" :src="typesURL + type + extension">
          </div>
        </div>
        <div class="pokemonName">{{pokemon.name}}</div>
        <div class="addItemAbilityNature">
          <div class="buttonLeft" @click="addItem()" v-if="pokemon.item === ''">
            <font-awesome-icon class="addDeleteIconLeft" icon="fas fa-plus-square" />
            <p class="addDeleteTextLeft">Add item</p>
          </div>
          <div v-else>
            <font-awesome-icon icon="fas fa-minus-square" @click="deleteItem()" class="buttonDeleteLeft addDeleteIconLeft"/>
            <p class="addDeleteTextLeft">{{pokemon.item}}</p>
          </div>
        </div>
        <div class="addItemAbilityNature">
          <div class="buttonLeft" @click="addAbility()" v-if="pokemon.ability === ''">
            <font-awesome-icon class="addDeleteIconLeft" icon="fas fa-plus-square" />
            <p class="addDeleteTextLeft">Add ability</p>
          </div>
          <div v-else>
            <font-awesome-icon icon="fas fa-minus-square" @click="deleteAbility()" class="buttonDeleteLeft addDeleteIconLeft"/>
            <p class="addDeleteTextLeft">{{pokemon.ability}}</p>
          </div>
        </div>
        <div class="addItemAbilityNature">
          <div class="buttonLeft" @click="addNature()" v-if="pokemon.nature === ''">
            <font-awesome-icon class="addDeleteIconLeft" icon="fas fa-plus-square" />
            <p class="addDeleteTextLeft">Add nature</p>
          </div>
          <div v-else>
            <font-awesome-icon icon="fas fa-minus-square" @click="deleteNature()" class="buttonDeleteLeft addDeleteIconLeft"/>
            <p class="addDeleteTextLeft">{{pokemon.nature}}</p>
          </div>
        </div>
      </div>

      <div class="mainGridRight">
        <div v-if="pokemon.moves.length > 0" >
          <div v-for="move in pokemon.moves" :key="move" class="buttonAddMove">
            <font-awesome-icon icon="fas fa-minus-square" @click="deleteMove(move)" class="buttonDeleteRight addDeleteIconRight"/>
            <p class="addDeleteTextRight">{{move}}</p>
          </div>
        </div>
        <div class="buttonRight" @click="addMove()" v-if="pokemon.moves.length <= 3">
          <font-awesome-icon class="addDeleteIconRight" icon="fas fa-plus-square" />
          <p class="addDeleteTextRight">Add move</p>
        </div>
      </div>
    </div>

    <div class="evsIvs">
      <div class="stat">
        <p class="statName">HP</p>
        <div class="inputEVsIVsGrid">
          <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="hpEVs">
          <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="hpIVs">
        </div>
        <p class="finalStat">{{finalHP}}</p>
      </div>
      <div class="stat">
        <p class="statName">ATK</p>
        <div class="inputEVsIVsGrid">
          <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="atkEVs">
          <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="atkIVs">
        </div>
        <p class="finalStat">{{finalAttack}}</p>
      </div>
      <div class="stat">
        <p class="statName">DEF</p>
        <div class="inputEVsIVsGrid">
          <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="defEVs">
          <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="defIVs">
        </div>
        <p class="finalStat">{{finalDefense}}</p>
      </div>
      <div class="stat">
        <p class="statName">SPA</p>
        <div class="inputEVsIVsGrid">
          <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="spaEVs">
          <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="spaIVs">
        </div>
        <p class="finalStat">{{finalSpecialAttack}}</p>
      </div>
      <div class="stat">
        <p class="statName">SPD</p>
        <div class="inputEVsIVsGrid">
          <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="spdEVs">
          <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="spdIVs">
        </div>
        <p class="finalStat">{{finalSpecialDefense}}</p>
      </div>
      <div class="stat">
        <p class="statName">SPE</p>
        <div class="inputEVsIVsGrid">
          <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="speEVs">
          <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="speIVs">
        </div>
        <p class="finalStat">{{finalSpeed}}</p>
      </div>
    </div>


    <div @click="removePokemon()" class="deletePokemonButton">
      <font-awesome-icon class="addDeleteIconLeft" icon="fas fa-minus-square"/>
      <p class="deletePokemonText">Remove Pokémon</p>
    </div>
  </div>
</template>

<script lang="ts">
/** Componente para las tarjetas de los Pokémon en el constructor de equipos. */

import {defineComponent} from "vue";
import {IPokemon} from "@/interfaces/Pokemon";
import {getPokemonData} from "@/services/showdownLibraryService";

export default defineComponent({
  name: "PokemonCard",
  props: {
    pokemon: { /** Pokémon cuya información se muestra en la tarjeta. */
      type: Object as () => IPokemon,
      required: true,
    }
  },
  data() {
    return {
      modifiedPokemon: {} as IPokemon, /** Pokémon con los valores modificados para pasarlo al constructor de equipos. */

      baseStats: { /** Estadísticas base del Pokémon de la tarjeta. */
        hp: 0 as number,
        atk: 0 as number,
        def: 0 as number,
        spa: 0 as number,
        spd: 0 as number,
        spe: 0 as number,
      },

      hpEVs: 0 as number, /** Número de EVs en vida introducidos. */
      hpIVs: 0 as number, /** Número de IVs en vida introducidos. */
      atkEVs: 0 as number, /** Número de EVs en ataque introducidos. */
      atkIVs: 0 as number, /** Número de IVs en ataque introducidos. */
      defEVs: 0 as number, /** Número de EVs en defensa introducidos. */
      defIVs: 0 as number, /** Número de IVs en defensa introducidos. */
      spaEVs: 0 as number, /** Número de EVs en ataque especial introducidos. */
      spaIVs: 0 as number, /** Número de IVs en ataque especial introducidos. */
      spdEVs: 0 as number, /** Número de EVs en defensa especial introducidos. */
      spdIVs: 0 as number, /** Número de IVs en defensa especial introducidos. */
      speEVs: 0 as number, /** Número de EVs en velocidad introducidos. */
      speIVs: 0 as number, /** Número de IVs en velocidad introducidos. */

      finalHP: 0 as number, /** Estadística final de vida del Pokémon. */
      finalAttack: 0 as number, /** Estadística final de ataque del Pokémon. */
      finalDefense: 0 as number, /** Estadística final de defensa del Pokémon. */
      finalSpecialAttack: 0 as number, /** Estadística final de ataque especial del Pokémon. */
      finalSpecialDefense: 0 as number, /** Estadística final de defensa especial del Pokémon. */
      finalSpeed: 0 as number, /** Estadística final de velocidad del Pokémon. */

      maxEVs: 508 as number, /** Número máximo de EVs que se pueden distribuir entre las diferentes estadísticas del Pokémon. */

      pokemonURL: 'https://play.pokemonshowdown.com/sprites/gen3/' as string,  /** URL donde se encuentran los iconos de los Pokémon. */
      typesURL: 'https://play.pokemonshowdown.com/sprites/types/' as string,  /** URL donde se encuentran los iconos de los tipos de Pokémon. */
      extension: '.png' as string, /** Extensión de los iconos. */

      pokemonTypes: [] as string[], /** Tipos del Pokémon de la tarjeta. */
    }
  },
  computed: {
    pokemonNature() { /** Naturaleza del Pokémon de la tarjeta. */
      return this.pokemon.nature;
    },
    totalEVs() { /** Total de EVs distribuidos en las diferentes estadísticas del Pokémon. */
      const totalEVsDistributed = this.hpEVs + this.atkEVs + this.defEVs + this.spaEVs + this.spdEVs + this.speEVs;
      return totalEVsDistributed;
    },
    pokemonName() { /** Nombre del Pokémon de la tarjeta. */
      return this.pokemon.name;
    }
  },
  methods: {
    /** Añadir habilidad. */
    addAbility() {
      this.$emit('addAbility', this.pokemon);
    },

    /** Añadir movimiento. */
    addMove() {
      this.$emit('addMove', this.pokemon);
    },

    /** Añadir item. */
    addItem() {
      this.$emit('addItem', this.pokemon);
    },

    /** Añadir naturaleza. */
    addNature() {
      this.$emit('addNature', this.pokemon);
    },

    /** Borrar item. */
    deleteItem(){
      this.modifiedPokemon = this.pokemon;
      this.modifiedPokemon.item = '';
      this.$emit('deleteItemAbilityMoveNature', this.modifiedPokemon);
    },

    /** Borrar habilidad. */
    deleteAbility() {
      this.modifiedPokemon = this.pokemon;
      this.modifiedPokemon.ability = '';
      this.$emit('deleteItemAbilityMoveNature', this.modifiedPokemon);
    },

    /** Borrar movimiento. */
    deleteMove(moveName: string) {
      this.modifiedPokemon = this.pokemon;
      for (let i = 0; i < this.modifiedPokemon.moves.length; i++) {
        if (this.modifiedPokemon.moves[i] === moveName) {
          this.modifiedPokemon.moves.splice(i, 1);
        }
      }
      this.$emit('deleteItemAbilityMoveNature', this.modifiedPokemon);
    },

    /** Borrar naturaleza. */
    deleteNature() {
      this.modifiedPokemon = this.pokemon;
      this.modifiedPokemon.nature = '';
      this.$emit('deleteItemAbilityMoveNature', this.modifiedPokemon);
    },

    /** Calcular multiplicador de la naturaleza. */
    calculateNatureMultiplier(statName: string, pokemon: IPokemon) {
      let natureMultiplier = 0;

      if (statName === 'atk') {
        if (pokemon.nature === 'Adamant' || pokemon.nature === 'Brave' || pokemon.nature === 'Lonely' || pokemon.nature === 'Naughty') {
          natureMultiplier = 1.10;
        } else if (pokemon.nature === 'Bold' || pokemon.nature === 'Calm' || pokemon.nature === 'Modest' || pokemon.nature === 'Timid') {
          natureMultiplier = 0.90;
        } else {
          natureMultiplier = 1;
        }
      } else if (statName === 'def') {
        if (pokemon.nature === 'Bold' || pokemon.nature === 'Relaxed' || pokemon.nature === 'Impish' || pokemon.nature === 'Lax') {
          natureMultiplier = 1.10;
        } else if (pokemon.nature === 'Lonely' || pokemon.nature === 'Hasty' || pokemon.nature === 'Mild' || pokemon.nature === 'Gentle') {
          natureMultiplier = 0.90;
        } else {
          natureMultiplier = 1;
        }
      } else if (statName === 'spa') {
        if (pokemon.nature === 'Modest' || pokemon.nature === 'Mild' || pokemon.nature === 'Quiet' || pokemon.nature === 'Rash') {
          natureMultiplier = 1.10;
        } else if (pokemon.nature === 'Adamant' || pokemon.nature === 'Impish' || pokemon.nature === 'Jolly' || pokemon.nature === 'Careful') {
          natureMultiplier = 0.90;
        } else {
          natureMultiplier = 1;
        }
      } else if (statName === 'spd') {
        if (pokemon.nature === 'Calm' || pokemon.nature === 'Gentle' || pokemon.nature === 'Sassy' || pokemon.nature === 'Careful') {
          natureMultiplier = 1.10;
        } else if (pokemon.nature === 'Naughty' || pokemon.nature === 'Lax' || pokemon.nature === 'Naive' || pokemon.nature === 'Rash') {
          natureMultiplier = 0.90;
        } else {
          natureMultiplier = 1;
        }
      } else if (statName === 'spe') {
        if (pokemon.nature === 'Timid' || pokemon.nature === 'Hasty' || pokemon.nature === 'Jolly' || pokemon.nature === 'Naive') {
          natureMultiplier = 1.10;
        } else if (pokemon.nature === 'Brave' || pokemon.nature === 'Relaxed' || pokemon.nature === 'Quiet' || pokemon.nature === 'Sassy') {
          natureMultiplier = 0.90;
        } else {
          natureMultiplier = 1;
        }
      }
      return natureMultiplier;
    },

    /** Conseguir estadísticas base del Pokémon de la tarjeta. */
    async getBaseStats (pokemonName: string) {
      const res = await getPokemonData(pokemonName, 'baseStats');
      this.baseStats = res.data;

      this.finalHP = Math.floor(this.calculateFinalValue('HP', this.baseStats.hp, this.hpEVs, this.hpIVs, this.pokemon));
      this.finalAttack = Math.floor(this.calculateFinalValue('atk', this.baseStats.atk, this.atkEVs, this.atkIVs, this.pokemon));
      this.finalDefense = Math.floor(this.calculateFinalValue('def', this.baseStats.def, this.defEVs, this.defIVs, this.pokemon));
      this.finalSpecialAttack = Math.floor(this.calculateFinalValue('spa', this.baseStats.spa, this.spaEVs, this.spaIVs, this.pokemon));
      this.finalSpecialDefense = Math.floor(this.calculateFinalValue('spd', this.baseStats.spd, this.spdEVs, this.spdIVs, this.pokemon));
      this.finalSpeed = Math.floor(this.calculateFinalValue('spe', this.baseStats.spe, this.speEVs, this.speIVs, this.pokemon));
    },

    /** Conseguir tipos del Pokémon de la tarjeta. */
    async getTypes (pokemonName: string) {
      const res = await getPokemonData(pokemonName, 'types');
      this.pokemonTypes = res.data;
    },

    /** Calcular valor final de una estadística del Pokémon de la tarjeta. */
    calculateFinalValue(statName: string, baseStat: number, evs: number, ivs: number, pokemon: IPokemon) {
      let finalValue = 0;

      const natureMultiplier = this.calculateNatureMultiplier(statName, pokemon);

      if (statName === 'HP') {
        finalValue = 10 + (100 / 100 * ((baseStat * 2) + ivs + evs/4)) + 100;
      } else {
        finalValue = (5 + (100 / 100 * ((baseStat * 2) + ivs + evs/4))) * natureMultiplier;
      }

      return finalValue;
    },

    /** Borrar tarjeta del Pokémon del equipo en construcción. */
    removePokemon() {
      this.$emit('deletePokemon', this.pokemon);
    },

    /** Pasar Pokémon con los EVs e IVs actualizados al constructor de equipos. */
    emitEVsIVs() {
      this.modifiedPokemon = this.pokemon;
      this.modifiedPokemon.evs.hp = this.hpEVs;
      this.modifiedPokemon.evs.atk = this.atkEVs;
      this.modifiedPokemon.evs.def = this.defEVs;
      this.modifiedPokemon.evs.spa = this.spaEVs;
      this.modifiedPokemon.evs.spd = this.spdEVs;
      this.modifiedPokemon.evs.spe = this.speEVs;

      this.modifiedPokemon.ivs.hp = this.hpIVs;
      this.modifiedPokemon.ivs.atk = this.atkIVs;
      this.modifiedPokemon.ivs.def = this.defIVs;
      this.modifiedPokemon.ivs.spa = this.spaIVs;
      this.modifiedPokemon.ivs.spd = this.spdIVs;
      this.modifiedPokemon.ivs.spe = this.speIVs;

      this.$emit('updateEVsIVs' , this.modifiedPokemon);
    },

    /** Actualizar valores de EVs e IVs del Pokémon pasado a la tarjeta cuando se está editando un equipo. */
    updateInitialEVsIVs() {
      this.hpEVs = this.pokemon.evs.hp;
      this.hpIVs = this.pokemon.ivs.hp;
      this.atkEVs = this.pokemon.evs.atk;
      this.atkIVs = this.pokemon.ivs.atk;
      this.defEVs = this.pokemon.evs.def;
      this.defIVs = this.pokemon.ivs.def;
      this.spaEVs = this.pokemon.evs.spa;
      this.spaIVs = this.pokemon.ivs.spa;
      this.spdEVs = this.pokemon.evs.spd;
      this.spdIVs = this.pokemon.ivs.spd;
      this.speEVs = this.pokemon.evs.spe;
      this.speIVs = this.pokemon.ivs.spe;
    }

  },
  watch: {
    pokemonName: {
      handler(value) {
        this.getBaseStats(this.pokemon.name);
        this.getTypes(this.pokemon.name);
      }
    },
    pokemonNature: {
      handler(value) {
        this.finalHP = Math.floor(this.calculateFinalValue('HP', this.baseStats.hp, this.hpEVs, this.hpIVs, this.pokemon));
        this.finalAttack = Math.floor(this.calculateFinalValue('atk', this.baseStats.atk, this.atkEVs, this.atkIVs, this.pokemon));
        this.finalDefense = Math.floor(this.calculateFinalValue('def', this.baseStats.def, this.defEVs, this.defIVs, this.pokemon));
        this.finalSpecialAttack = Math.floor(this.calculateFinalValue('spa', this.baseStats.spa, this.spaEVs, this.spaIVs, this.pokemon));
        this.finalSpecialDefense = Math.floor(this.calculateFinalValue('spd', this.baseStats.spd, this.spdEVs, this.spdIVs, this.pokemon));
        this.finalSpeed = Math.floor(this.calculateFinalValue('spe', this.baseStats.spe, this.speEVs, this.speIVs, this.pokemon));
      }
    },

    hpEVs: {
      handler(newValue, oldValue) {
        if (this.totalEVs > 508) {
          this.hpEVs = oldValue;
        } else {
          if (newValue > 252) {
            newValue = 252;
          } else if (newValue < 0) {
            newValue = 0;
          }
        }
        this.finalHP = Math.floor(this.calculateFinalValue('HP', this.baseStats.hp, newValue, this.hpIVs, this.pokemon));
        this.emitEVsIVs();
      }
    },

    hpIVs: {
      handler(newValue) {
        if (newValue > 31) {
          newValue = 31;
        } else if (newValue < 0) {
          newValue = 0;
        }
        this.finalHP = Math.floor(this.calculateFinalValue('HP', this.baseStats.hp, this.hpEVs, newValue, this.pokemon));
        this.emitEVsIVs();
      }
    },

    atkEVs: {
      handler(newValue, oldValue) {
        if (this.totalEVs > 508) {
          this.atkEVs = oldValue;
        } else {
          if (newValue > 252) {
            newValue = 252;
          } else if (newValue < 0) {
            newValue = 0;
          }
        }
        this.finalAttack = Math.floor(this.calculateFinalValue('atk', this.baseStats.atk, newValue, this.atkIVs, this.pokemon));
        this.emitEVsIVs();
      }
    },

    atkIVs: {
      handler(newValue) {
        if (newValue > 31) {
          newValue = 31;
        } else if (newValue < 0) {
          newValue = 0;
        }
        this.finalAttack = Math.floor(this.calculateFinalValue('atk', this.baseStats.atk, this.atkEVs, newValue, this.pokemon));
        this.emitEVsIVs();
      }
    },

    defEVs: {
      handler(newValue, oldValue) {
        if (this.totalEVs > 508) {
          this.defEVs = oldValue;
        } else {
          if (newValue > 252) {
            newValue = 252;
          } else if (newValue < 0) {
            newValue = 0;
          }
        }
        this.finalDefense = Math.floor(this.calculateFinalValue('def', this.baseStats.def, newValue, this.defIVs, this.pokemon));
        this.emitEVsIVs();
      }
    },

    defIVs: {
      handler(newValue) {
        if (newValue > 31) {
          newValue = 31;
        } else if (newValue < 0) {
          newValue = 0;
        }
        this.finalDefense = Math.floor(this.calculateFinalValue('def', this.baseStats.def, this.defEVs, newValue, this.pokemon));
        this.emitEVsIVs();
      }
    },

    spaEVs: {
      handler(newValue, oldValue) {
        if (this.totalEVs > 508) {
          this.spaEVs = oldValue;
        } else {
          if (newValue > 252) {
            newValue = 252;
          } else if (newValue < 0) {
            newValue = 0;
          }
        }
        this.finalSpecialAttack = Math.floor(this.calculateFinalValue('spa', this.baseStats.spa, newValue, this.spaIVs, this.pokemon));
        this.emitEVsIVs();
      }
    },

    spaIVs: {
      handler(newValue) {
        if (newValue > 31) {
          newValue = 31;
        } else if (newValue < 0) {
          newValue = 0;
        }
        this.finalSpecialAttack = Math.floor(this.calculateFinalValue('spa', this.baseStats.spa, this.spaEVs, newValue, this.pokemon));
        this.emitEVsIVs();
      }
    },

    spdEVs: {
      handler(newValue, oldValue) {
        if (this.totalEVs > 508) {
          this.spdEVs = oldValue;
        } else {
          if (newValue > 252) {
            newValue = 252;
          } else if (newValue < 0) {
            newValue = 0;
          }
        }
        this.finalSpecialDefense = Math.floor(this.calculateFinalValue('spd', this.baseStats.spd, newValue, this.spdIVs, this.pokemon));
        this.emitEVsIVs();
      }
    },

    spdIVs: {
      handler(newValue) {
        if (newValue > 31) {
          newValue = 31;
        } else if (newValue < 0) {
          newValue = 0;
        }
        this.finalSpecialDefense = Math.floor(this.calculateFinalValue('spd', this.baseStats.spd, this.spdEVs, newValue, this.pokemon));
        this.emitEVsIVs();
      }
    },

    speEVs: {
      handler(newValue, oldValue) {
        if (this.totalEVs > 508) {
          this.speEVs = oldValue;
        } else {
          if (newValue > 252) {
            newValue = 252;
          } else if (newValue < 0) {
            newValue = 0;
          }
        }
        this.finalSpeed = Math.floor(this.calculateFinalValue('spe', this.baseStats.spe, newValue, this.speIVs, this.pokemon));
        this.emitEVsIVs();
      }
    },

    speIVs: {
      handler(newValue) {
        if (newValue > 31) {
          newValue = 31;
        } else if (newValue < 0) {
          newValue = 0;
        }
        this.finalSpeed = Math.floor(this.calculateFinalValue('spe', this.baseStats.spe, this.speEVs, newValue, this.pokemon));
        this.emitEVsIVs();
      }
    }
  },
  mounted() {
    this.updateInitialEVsIVs();
    this.getBaseStats(this.pokemon.name);
    this.getTypes(this.pokemon.name);
  }
})
</script>

<style scoped>

div {
  color: white;
}

.mainGrid {
  display: grid;
  grid-template-rows: 1fr 0.5fr 0.1fr;
  grid-template-columns: 1fr;
  width: 30em;
  box-shadow: 0.3em 0.3em 0.2em grey;
  height: min-content;
}

.gridAddElements {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.mainGridLeft {
  display:grid;
  grid-template-rows: 1fr 0.5fr 0.5fr 0.5fr 0.5fr;
  padding: 1em 2em 0em 2em;
  background: #4b88c3;
  align-items: center;
}

.buttonLeft:hover {
  color: #1e1e1e;
  cursor: pointer;
}

.buttonRight {
  cursor: pointer;
  color: #1e1e1e;
}

.buttonRight:hover {
  cursor: pointer;
  color: #4b88c3;
}

.buttonAddMove {
  color: #1e1e1e;
}

.buttonDeleteLeft:hover {
  color: #d7313e;
  cursor: pointer;
}

.buttonDeleteRight {
  color: #1e1e1e;
}

.buttonDeleteRight:hover {
  color: #d7313e;
  cursor: pointer;
}

.mainGridRight {
  padding: 2em 2em;
  background: white;
}

.containerSpriteTypes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
}

.pokemonSprite img{
  width: 5em;
}

.pokemonTypes {
  display: grid;
  grid-template-rows: 1fr 1fr;
}

.pokemonName {
  height: 1em;
}

.addItemAbilityNature {
  padding-top: 1em;
}

.evsIvs {
  background: #5397d9;
  border-top: 0.2em solid #1e1e1e;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 0em 1.5em;
}

.stat {
  color: black;
  display: grid;
  grid-template-rows: 0.5fr 1fr 0.5fr;
  justify-items: center;
}

.statName {
  font-size: small;
  padding-top: 1em;
}

.inputEVsIVsGrid {
  display: grid;
}

.inputEVsIVs {
  background: white;
  width: 3em;
}

.finalStat {
  padding-top: 1em;
  font-size: small;
}

.deletePokemonButton {
  display: flex;
  background: #d7313e;
  align-items: center;
  justify-content: center;
  padding: 1em;
}

.deletePokemonButton:hover {
  color: #1e1e1e;
  cursor: pointer;
}

.deletePokemonText {
  margin: 0em 0em 0em 1em;
}

.addDeleteIconLeft {
  display: inline-block;
}

.addDeleteIconRight {
  display: inline-block;

}

.addDeleteTextLeft {
  display: inline-block;
  margin-left: 0.5em;
}

.addDeleteTextRight {
  display: inline-block;
  margin-left: 0.5em;
}

</style>
