<template>
  <div class="background">
    <SettingsBar class="settingsBar"/>
    <div class="grid">
      <div class="gridLeft">
        <div class="battle" style="overflow: hidden">
          <!--<iframe ref="battleIframe" :src="src" width="650" height="416" style="position: relative; left: -101px; top: -56px; right: -10000px"></iframe>-->
        </div>

        <div class="timerForfeit" v-if="!battleFinished" >
          <div class="timer">
            <button v-if="timer < 0" @click="setTimer('on')" class="buttonTimer" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">Timer</button>
            <button v-if="timer >= 0" @click="setTimer('off')" class="buttonTimer" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">{{timerInMinutes}}</button>
          </div>
          <p class="questionText">What will you do?</p>
          <div class="forfeit">
            <button @click="manageForfeit()" class="buttonForfeit" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">Forfeit</button>
          </div>
        </div>

        <div v-if="!battleFinished" class="move-Pokemon">
          <div class="fight" v-if="!fightFlag && !pokemonFlag && !choiseSent" >
            <button type="button" class="buttonFight" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;" @click="changeFightFlag(true)">Fight</button>
          </div>

          <div class="switch" v-if="!fightFlag && !pokemonFlag && !choiseSent" >
            <button type="button" class="buttonSwitch" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;" @click="changePokemonFlag(true)">Pokémon</button>
          </div>


          <div class="switchPokemon" v-if="pokemonFlag && !choiseSent">
            <div class="pokemonButtons" v-for="pokemon in pokemonToSwitchIn" :key="pokemon">
              <button type="button" :disabled="pokemonTrapped" class="buttonPokemon" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;" @click="sendChosenPokemon(pokemon)">
                <div class="pokemonSprite">
                  <img :src="pokemonURL + pokemon.toLowerCase() + extension">
                </div>
                <p class="pokemonNameText">{{pokemon}}</p>
              </button>
            </div>
            <button v-if="!forceSwitch" @click="changePokemonFlag(false)" class="buttonCancelSwitch" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">Cancel</button>
          </div>

          <div class="fightMoves" v-if="fightFlag && !choiseSent">
            <div class="movesButtons" v-for="move in activeMoves" :key="move">
              <button type="button" :disabled="move.disabled" class="buttonMove" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;" @click="sendChosenMove(move.move)">{{move.move}}</button>
            </div>
            <button @click="changeFightFlag(false)" class="buttonCancelFight" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">Cancel</button>
          </div>

          <div v-if="choiseSent">
            <h1>Waiting for opponent...</h1>
            <div class="loader"></div>
            <button @click="cancelChoice()" class="buttonCancelAction" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">Cancel</button>
          </div>
        </div>
        <div v-if="battleFinished" class="mainMenu">
          <button type="button" class="buttonMainMenu" @click="returnToMenu()" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">Main menu</button>
        </div>
      </div>

      <div class="gridRight">
        <div class="gridChat">
          <div class="chat">
            <div v-for="msg in chatMessages" :key="msg">
              <div v-if="msg.toLowerCase().startsWith('turn')">
                <div class="messageTurn">
                  {{msg}}
                </div>
              </div>
              <div v-if="!msg.toLowerCase().startsWith('turn')">
                <p class="message">{{msg}}</p>
              </div>
            </div>
          </div>
          <form class="writeInChat" @submit.prevent="sendMessageToChat()">
            <input class="form-control inputChat" type="text" placeHolder="Write your message here" v-model="chatMessage" >
            <input class="buttonChat" type="submit" value="Send" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7); border-radius: 0.5em;">
          </form>
        </div>
      </div>
    </div>
    <div v-if="forfeitFlag" class="popUpContainer">
      <div class="popUp">
        <p class="errorTitle">Warning!</p>
        <div class="errorDescription">Do you really want to forfeit?</div>
        <div>
          <button @click="forfeit()" class="button" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Forfeit</button>
          <button @click="cancel()" class="button" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** View para la página de batalla.  */

import {defineComponent} from "vue";
import SettingsBar from "../components/SettingsBar.vue";
import {send} from "../services/websocket";
import {mapState} from "vuex";

export default defineComponent({
  name: 'BattleView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      chatMessage: '' as string,
      //src: "https://play.pokemonshowdown.com/battle-gen8anythinggoes-1632918427" as string,
      src: "https://play.pokemonshowdown.com/" + this.$store.state.battleInfo as string,
      forfeitFlag: false as boolean, /** Flag que controla la rendición en una batalla. */

      pokemonURL: 'https://play.pokemonshowdown.com/sprites/gen3/' as string,  /** URL donde se encuentran los iconos de los Pokémon. */
      extension: '.png' as string, /** Extensión de los iconos. */
    }
  },
  methods: {
    /** Intentar rendición en una batalla. */
    manageForfeit() {
      this.forfeitFlag = true;
    },

    /** Rendición en una batalla. */
    forfeit() {
      const data = this.$store.state.battleInfo + '|/forfeit';
      send(data);
      this.$store.commit('SET_BATTLEFINISHED', true);
      this.forfeitFlag = false;
    },

    /** Cancelar rendición. */
    cancel() {
      this.forfeitFlag = false;
    },

    /** Cambiar el flag de mostrar ataques o no. */
    changeFightFlag(flag: boolean) {
      this.$store.commit('SET_FIGHTFLAG', flag);
    },

    /** Cambiar el flag de mostrar Pokémon para cambiar o no. */
    changePokemonFlag(flag: boolean) {
      this.$store.commit('SET_POKEMONFLAG', flag);
    },

    /** Cancelar decisión del turno (la decisión puede ser elegir un movimiento del Pokémon activo o cambiar de Pokémon). */
    cancelChoice() {
      const data = this.$store.state.battleInfo + '|/undo';
      send(data);
      this.$store.commit('SET_CHOISESENT', false);
    },

    /** Enviar a Pokémon Showdown la decisión de movimiento elegido. */
    sendChosenMove(chosenMove: string) {
      const data = this.$store.state.battleInfo + '|/choose move ' + chosenMove;
      send(data);
      this.$store.commit('SET_CHOISESENT', true);
    },

    /** Enviar a Pokémon Showdown la decisión de cambio por el Pokémon elegido. */
    sendChosenPokemon(chosenPokemon: string) {
      const data = this.$store.state.battleInfo + '|/choose switch ' + chosenPokemon;
      send(data);
      this.$store.commit('SET_CHOISESENT', true);
    },

    returnToMenu() {
      this.$store.commit('EMPTY_CHATMESSAGES');
      this.$router.push({name: "home"});
    },

    /** Mandar mensaje al chat. */
    sendMessageToChat() {
      const data = this.$store.state.battleInfo + '|' + this.chatMessage;
      send(data);
      this.chatMessage = '';
    },

    /** Activar el timer de la batalla. */
    setTimer(status: string) {
      const data = this.$store.state.battleInfo + '|/timer ' + status;
      send(data);
    },
  },
  computed: {
    ...mapState([
        'activeMoves',
        'pokemonToSwitchIn',
        'choiseSent',
               'timer',
               'battleFinished',
               'pokemonTrapped',
               'forceSwitch',
               'fightFlag',
               'pokemonFlag',
               'chatMessages',
               'battleUser',
               'battleRival',
               'userSideConditions',
               'rivalSideConditions',
               'fieldConditions',
    ]),

    /** Cambiar el tiempo restante del timer al formato 'minutos:segundos'. */
    timerInMinutes() {
      let minutes = Math.floor(this.timer / 60);
      let seconds = Math.floor(this.timer % 60);

      if (seconds.toString().length === 1) {
        return (minutes + ':0' + seconds);
      } else {
        return (minutes + ':' + seconds);
      }
    }
  },
  watch: {
    timer: { /** Watcher para controlar cuándo cambia el valor de la variable timer. */
      handler(value) {

        if (value > 0) {
          setTimeout(() => {
            this.$store.commit('SET_TIMERRESET', this.timer - 1);
            console.log(this.timer);
          }, 1000);
        }
      },
      immediate: true
    }
  },
})
</script>

<style scoped>
.background {
  background-image: url("../assets/home/pokemonWallpaper20Anniversary.jpg");
  min-height: 100vh;
  height: auto;
}

.settingsBar {
  border-bottom: 0.3em solid #1e1e1e;
  height: 10vh;
}

.grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  height: 90vh;
}

.gridLeft {
  display: grid;
  grid-template-rows: 5fr 0.4fr 1.5fr;
}

.battle {
  background-color: #d7313e;
}

.timerForfeit {
  border-bottom: 0.3em solid #1e1e1e;
  border-top: 0.3em solid #1e1e1e;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
}

.move-Pokemon {
  background-color: #58e88a;

}

.questionText {
  padding-top: 1em;
  color: #1e1e1e;
  font-size: large;
  font-weight: bold;
}


.buttonTimer {
  height: 3em;
  width: 7em;
  background-color: #d7313e;
  color: white;
  font-size: small;
}

.buttonTimer:hover {
  background-color: #e85660;
}

.buttonTimer:active {
  background-color: #d7313e;
}


.buttonForfeit {
  height: 3em;
  width: 7em;
  background-color: #d7313e;
  color: white;
  font-size: small;
}

.buttonForfeit:hover {
  background-color: #e85660;
}

.buttonForfeit:active {
  background-color: #d7313e;
}

.move-Pokemon {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.fight {
  justify-self: center;
  align-self: center;
}

.switch {
  justify-self: center;
  align-self: center;
}

.fightMoves {
  grid-column: 1/3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  justify-items: center;
}

.switchPokemon {
  grid-column: 1/3;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  justify-items: center;

}

.movesButtons {

}

.buttonCancelFight {
  margin: 0em 1em 1.2em 0em;

  position: fixed;
  justify-self: end;
  align-self: end;

  height: 2em;
  width: 4em;
  background-color: #d7313e;
  color: white;
  font-size: medium;
}

.buttonCancelSwitch {
  margin: 0em 1em 1.2em 0em;

  grid-column: 3;
  grid-row: 2;
  justify-self: end;
  align-self: end;

  height: 2em;
  width: 4em;
  background-color: #d7313e;
  color: white;
  font-size: medium;
}

.buttonCancelSwitch:hover {
  background-color: #e85660;
}

.buttonCancelSwitch:active {
  background-color: #d7313e;
}

.movesButtons {

}

.buttonCancelAction {
  height: 1em;
  width: 3em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonCancelAction:hover {
  background-color: #e85660;
}

.buttonCancelAction:active {
  background-color: #d7313e;
}

.buttonFight {
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonFight:hover {
  background-color: #e85660;
}

.buttonFight:active {
  background-color: #d7313e;
}


.buttonSwitch {
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonSwitch:hover {
  background-color: #e85660;
}

.buttonSwitch:active {
  background-color: #d7313e;
}


.buttonMove {
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonMove:hover {
  background-color: #e85660;
}

.buttonMove:active {
  background-color: #d7313e;
}


.buttonPokemon {
  height: 4em;
  width: 12em;
  background-color: #d7313e;
  color: white;
  font-size: medium;
  padding: 0.5em;
  display: grid;
  grid-template-columns: 1fr 4fr;
  justify-items: center;
  align-items: center;
}

.buttonPokemon:hover {
  background-color: #e85660;
}

.buttonPokemon:active {
  background-color: #d7313e;
}

.card-tooltip .card-tooltip.text{
  visibility: hidden;
}

.card-tooltip:hover .card-tooltip.text{
  visibility: visible;
  opacity: 1;
}

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

.mainMenu {
  background-color: #58e88a;
  grid-row: 2/4;
  display: grid;
  justify-items: center;
  align-items: center;
}


.buttonMainMenu {
  height: 3em;
  width: 7em;
  background-color: #d7313e;
  color: white;
  font-size: x-large;
}

.buttonMainMenu:hover {
  background-color: #e85660;
}

.buttonMainMenu:active {
  background-color: #d7313e;
}

.gridRight {

}

.gridChat {
  display: grid;
  grid-template-rows: 8fr 1fr;
  height: 90vh;
}

.chat {
  overflow-y: scroll;
  padding: 1.5em 0em;
  color: #1e1e1e;
  background: white;
}

.writeInChat {
  background-color: #d7313e;
  display: grid;
  grid-template-columns: 4fr 1fr;
  padding: 1em;
}

.buttonChat {
  margin-left: 1em;
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonChat:hover {
  background-color: #e85660;
}

.buttonChat:active {
  background-color: #d7313e;
}

.messageTurn {
  background-color: #A4A4A4;
  font-size: x-large;
  font-weight: bold;
  padding: 0.25em;
  margin-bottom: 1em;
}

.message {
  padding: 0em 1.25em;
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

.button {
  margin-top: 2em;
  height: 4em;
  width: 20em;
  background-color: #4b88c3;
  color: white;
  font-size: large;
}

.button:hover {
  background-color: #5397d9;
}

.button:active {
  background-color: #4b88c3;
}

.pokemonSprite img {
  width: 3em;
}
</style>
