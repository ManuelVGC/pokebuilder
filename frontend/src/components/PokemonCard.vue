<template>
  <div class="mainGrid">
    <div class="mainGridLeft">
      <div class="containerSpriteTypes">
        <div class="pokemonSprite">Pokémon Sprite</div>
        <div>Pokémon type</div>
      </div>
      <div>{{pokemon.name}}</div>
      <div class="button" @click="addItem()" v-if="pokemon.item === ''">
        <font-awesome-icon icon="fas fa-plus-square" />
        <p>Add item</p>
      </div>
      <div v-else>
        <font-awesome-icon icon="fas fa-minus-square" @click="deleteItem()" class="button"/>
        <p>{{pokemon.item}}</p>
      </div>
      <div class="button" @click="addAbility()" v-if="pokemon.ability === ''">
        <font-awesome-icon icon="fas fa-plus-square" />
        <p>Add ability</p>
      </div>
      <div v-else>
        <font-awesome-icon icon="fas fa-minus-square" @click="deleteAbility()" class="button"/>
        <p>{{pokemon.ability}}</p>
      </div>
      <div class="button" @click="addNature()" v-if="pokemon.nature === ''">
        <font-awesome-icon icon="fas fa-plus-square" />
        <p>Add nature</p>
      </div>
      <div v-else>
        <font-awesome-icon icon="fas fa-minus-square" @click="deleteNature()" class="button"/>
        <p>{{pokemon.nature}}</p>
      </div>
    </div>


    <div class="mainGridRight">
      <div v-if="pokemon.moves.length > 0" >
        <div v-for="move in pokemon.moves" :key="move">
          <font-awesome-icon icon="fas fa-minus-square" @click="deleteMove(move)" class="button"/>
          <p>{{move}}</p>
        </div>
      </div>
      <div class="button" @click="addMove()" v-if="pokemon.moves.length <= 3">
        <font-awesome-icon icon="fas fa-plus-square" />
        <p>Add move</p>
      </div>
    </div>


    <div class="evsIvs">
      <div class="stat">
        <p>HP</p>
        <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="hpEVs">
        <input class="inputEVsIVs" placeholder="0" type="number" step="1" max="31" min="0" v-model="hpIVs">
        <p class="finalStat">{{finalHP}}</p>
      </div>
      <div class="stat">
        <p>ATK</p>
        <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="atkEVs">
        <input class="inputEVsIVs" placeholder="0" type="number" step="1" max="31" min="0" v-model="atkIVs">
        <p class="finalStat">{{finalAttack}}</p>
      </div>
      <div class="stat">
        <p>DEF</p>
        <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="defEVs">
        <input class="inputEVsIVs" placeholder="0" type="number" step="1" max="31" min="0" v-model="defIVs">
        <p class="finalStat">{{finalDefense}}</p>
      </div>
      <div class="stat">
        <p>SPA</p>
        <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="spaEVs">
        <input class="inputEVsIVs" placeholder="0" type="number" step="1" max="31" min="0" v-model="spaIVs">
        <p class="finalStat">{{finalSpecialAttack}}</p>
      </div>
      <div class="stat">
        <p>SPD</p>
        <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="spdEVs">
        <input class="inputEVsIVs" placeholder="0" type="number" step="1" max="31" min="0" v-model="spdIVs">
        <p class="finalStat">{{finalSpecialDefense}}</p>
      </div>
      <div class="stat">
        <p>SPE</p>
        <input class="inputEVsIVs" placeholder="0" type="number" step="4" max="252" min="0" v-model="speEVs">
        <input class="inputEVsIVs" placeholder="31" type="number" step="1" max="31" min="0" v-model="speIVs">
        <p class="finalStat">{{finalSpeed}}</p>
      </div>
    </div>


    <div @click="removePokemon()" class="deletePokemonButton button">
      <font-awesome-icon icon="fas fa-minus-square"/>
      <p>Remove Pokémon</p>
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
    }
  },
  computed: {
    pokemonNature() { /** Naturaleza del Pokémon de la tarjeta. */
      return this.pokemon.nature;
    },
    totalEVs() { /** Total de EVs distribuidos en las diferentes estadísticas del Pokémon. */
      const totalEVsDistributed = this.hpEVs + this.atkEVs + this.defEVs + this.spaEVs + this.spdEVs + this.speEVs;
      return totalEVsDistributed;
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

  }
})
</script>

<style scoped>

div {
  color: white;
}

.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 3fr 1fr 0.5fr;
  margin: 2em;
  width: 30em; /*esto no sé si será min-contend o width Xem, de momento lo dejo en 30em*/
  box-shadow: 3px 3px 5px 0px rgba(0,0,0,0.7);
}
.mainGridLeft {
  display:grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  padding: 2em;
  background: cadetblue;
  align-items: center;
}

.button:hover {
  color: black;
  cursor: pointer;
}

.mainGridRight {
  padding: 2em;
  background: #3498db;
}
.containerSpriteTypes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1em;
}

.pokemonSprite {
  margin-right: 1em;
}

.deletePokemonButton {
  grid-column: 1/3;
  background: firebrick;
  text-align: center;
  padding-top: 1em;
}

.evsIvs {
  grid-column: 1/3;
  background: orange;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1em;
}

.inputEVsIVs {
  background: #3498db;
  outline: none;
}

.stat {
  color: black;
}

.finalStat {
  padding-top: 0.75em;
}

</style>
