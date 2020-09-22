<template>
  <div class="container-fluid" style="overflow: hidden">
    <div class="row" style="height: 10%">
      <div class="col bg-primary">
        <h1>Bienvenido a </h1>
      </div>
    </div>
    <div class="row" style="height: 90%">
      <div class="col-12 col-md-8">
        <div class="row bg-secondary" style="height: 65%; min-height: 65%">
        </div>
        <!--<div class="row" style="height: 35%; min-height: 35%" ref="optionsDiv">
          <div class="col bg-success divButton" ref="fightDiv">
            <Button class="buttonStyle" @click="showMoves">Fight</Button>
          </div>
          <div class="col bg-danger divButton" ref="pokemonDiv">
            <Button class="buttonStyle">Pokémon</Button>
          </div>
        </div>-->
        <div class="row bg-danger" style="height: 35%; min-height: 35%" ref="teamPreview">
        </div>s
      </div>
      <div class="col-12 col-md-4 bg-warning" id="chat" ref="chat"
           style="overflow-y: auto; height: 100%; max-height: 100%">

      </div>
    </div>
  </div>
</template>

<script>

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Home',
  components: {

  },
  data() {
    return {

    };
  },
  methods: {
    ...mapMutations('webSocket', ['searchBattleWithTeam', 'setStateRef']),
    showMoves() {
      // eslint-disable-next-line
      const fightDiv = this.$refs.fightDiv;
      // eslint-disable-next-line
      const pokemonDiv = this.$refs.pokemonDiv;
      // eslint-disable-next-line
      const optionsDiv = this.$refs.optionsDiv;
      // fightDiv.style.display = 'none';
      // pokemonDiv.style.display = 'none';
      const movesMenu = document.createElement('div');

      movesMenu.classList.add('row');
      movesMenu.classList.add('bg-danger');
      movesMenu.style.height = '35%';
      movesMenu.style.minHeight = '35%';

      if (this.userNumber === 'p1') {
        this.userTeam.forEach((pokemon) => {
          console.log(pokemon);
          if (pokemon.name === this.currentPokemonP1) {
            console.log(pokemon);
            pokemon.moves.forEach((move) => {
              const button = document.createElement('button');
              button.innerHTML = move.moveName;
              movesMenu.appendChild(button);
            });
          }
        });
      } else if (this.userNumber === 'p2') {
        this.userTeam.forEach((pokemon) => {
          if (pokemon.name === this.currentPokemonP2) {
            console.log(pokemon);
            pokemon.moves.forEach((move) => {
              const button = document.createElement('button');
              button.innerHTML = move.moveName;
              movesMenu.appendChild(button);
            });
          }
        });
      }

      optionsDiv.replaceWith(movesMenu);
    },
  },
  mounted() {
    this.setStateRef(this.$refs);
  },
  computed: {
    ...mapState('webSocket', ['userTeam', 'rivalTeam', 'currentPokemonP1', 'currentPokemonP2', 'userNumber']),
  },
};
</script>

<style lang="scss" scoped>
  .buttonStyle {
    font-size: 2rem;
    border-radius: 0.3em;
  }
  .divButton {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
