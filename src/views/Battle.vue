<template>
  <SettingsBar/>
  <div class="gridContainer">


    <div class="battle">
      <table class="table table-hover">
        <tr>
          <th scope="col">User team</th>
          <th scope="col">Rival team</th>
          <th scope="col">User side conditions</th>
          <th scope="col">Rival side conditions</th>
          <th scope="col">Field conditions</th>
        </tr>
        <tr>
          <td>
            <ul class="accordion list-group">
              <li class="accordion-item list-group-item d-flex justify-content-between align-items-center" v-for="pokemon in battleUser.team" :key="pokemon">
                <h6 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">{{pokemon.ident}}</button>
                </h6>
                <div class="accordion-collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
                  <div class="accordion-body">
                    <h6>Details: {{pokemon.details}}</h6>
                    <h6>Condition: {{pokemon.condition}}</h6>
                    <h6>Active: {{pokemon.active}} </h6>
                    <h6>Stats: {{pokemon.stats}}</h6>
                    <h6>Moves: {{pokemon.moves}}</h6>
                    <h6>Base ability: {{pokemon.baseAbility}}</h6>
                    <h6>Item: {{pokemon.item}}</h6>
                  </div>
                </div>
              </li>
            </ul>
          </td>
          <td>
            <ul class="accordion list-group">
              <li class="accordion-item list-group-item d-flex justify-content-between align-items-center" v-for="pokemon in battleRival.team" :key="pokemon">
                <h6 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">{{pokemon.ident}}</button>
                </h6>
                <div class="accordion-collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
                  <div class="accordion-body">
                    <h6>Details: {{pokemon.details}}</h6>
                    <h6>Condition: {{pokemon.condition}}</h6>
                    <h6>Active: {{pokemon.active}} </h6>
                    <h6>Stats: {{pokemon.stats}}</h6>
                    <h6>Moves: {{pokemon.moves}}</h6>
                    <h6>Base ability: {{pokemon.baseAbility}}</h6>
                    <h6>Item: {{pokemon.item}}</h6>
                  </div>
                </div>
              </li>
            </ul>
          </td>
          <td>
            <h6>Boosts: {{userSideConditions.boosts}}</h6>
            <h6>Lightscreen: {{userSideConditions.lightscreen}}</h6>
            <h6>Reflect: {{userSideConditions.reflect}} </h6>
            <h6>Mist: {{userSideConditions.mist}}</h6>
            <h6>Safeguard: {{userSideConditions.safeguard}}</h6>
            <h6>Spikes: {{userSideConditions.spikes}}</h6>
            <h6>Leech seed: {{userSideConditions.leechseed}}</h6>
          </td>
          <td>
            <h6>Boosts: {{rivalSideConditions.boosts}}</h6>
            <h6>Lightscreen: {{rivalSideConditions.lightscreen}}</h6>
            <h6>Reflect: {{rivalSideConditions.reflect}} </h6>
            <h6>Mist: {{rivalSideConditions.mist}}</h6>
            <h6>Safeguard: {{rivalSideConditions.safeguard}}</h6>
            <h6>Spikes: {{rivalSideConditions.spikes}}</h6>
            <h6>Leech seed: {{rivalSideConditions.leechseed}}</h6>
          </td>
          <td>
            <h6>Weather: {{fieldConditions.weather.type}}</h6>
          </td>
        </tr>
      </table>
    </div>


    <div class="chat">
      <div style= "overflow: auto; max-height: 500px;" >
        <h1>GAME CHAT</h1>
        <ul>
          <li v-for="msg in chatMessages" :key="msg">
            {{ msg }}
          </li>
        </ul>
      </div>
      <form @submit.prevent="sendMessageToChat()">
        <input type="text" placeHolder="Write your message here" v-model="chatMessage" class="form-control">
        <input type="submit" value="Send" class="btn btn-success">
      </form>
    </div>


    <div v-if="!battleFinished" class="move-Pokemon">
      <button v-if="!fightFlag && !pokemonFlag && !choiseSent" type="button" class="btn btn-danger" @click="changeFightFlag(true)">Fight</button>
      <button v-if="!fightFlag && !pokemonFlag && !choiseSent" type="button" class="btn btn-info" @click="changePokemonFlag(true)">Pokémon</button>
      <div v-if="fightFlag && !choiseSent">
        <ul>
          <li v-for="move in activeMoves" :key="move">
            <button type="button" :disabled="move.disabled" class="btn btn-outline-primary" @click="sendChosenMove(move.move)">{{move.move}}</button>
          </li>
        </ul>
        <button @click="changeFightFlag(false)">Cancel</button>
      </div>
      <div v-if="pokemonFlag && !choiseSent">
        <ul>
          <li v-for="pokemon in pokemonToSwitchIn" :key="pokemon">
            <button type="button" :disabled="pokemonTrapped" class="btn btn-outline-primary" @click="sendChosenPokemon(pokemon)">{{pokemon}}</button>
          </li>
        </ul>
        <button v-if="!forceSwitch" @click="changePokemonFlag(false)">Cancel</button>
      </div>
      <div v-if="choiseSent">
        <h1>Waiting for opponent...</h1>
        <div class="loader"></div>
        <button @click="cancelChoice()">Cancel</button>
      </div>
      <div>
        <button v-if="timer < 0" @click="setTimer('on')">Timer</button>
        <button v-if="timer >= 0" @click="setTimer('off')">{{timerInMinutes}}</button>
      </div>
    </div>
  </div>



  <div class="manageEndOfBattle" style="padding: 100px">
    <button v-if="!battleFinished" @click="manageForfeit()">Forfeit</button>
    <button type="button" class="btn btn-outline-primary" v-if="battleFinished" @click="returnToMenu()">Main menu</button>
  </div>
</template>

<script lang="ts">
/** View para la página de batalla.  */

import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar.vue";
import {send} from "@/services/websocket";
import {mapState} from "vuex";

export default defineComponent({
  name: 'BattleView',
  components: {
    SettingsBar,
  },
  data() {
    return {
      chatMessage: '' as string,
    }
  },
  methods: {
    /** Rendición en una batalla. */
    manageForfeit() {
      const data = this.$store.state.battleInfo + '|/forfeit';
      send(data);
      this.$store.commit('SET_BATTLEFINISHED', true);
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
  }
})
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "battle chat"
    "move-Pokemon chat"
    "endBattle chat";
  gap: 50px;
}
.battle {
  grid-area: battle;
}
.chat {
  grid-area: chat;
}
.move-Pokemon {
   grid-area: move-Pokemon;
}

.manageEndOfBattle {
  grid-area: endBattle;
}

.card-tooltip .card-tooltip.text{
  visibility: hidden;
}

.card-tooltip:hover .card-tooltip.text{
  visibility: visible;
  opacity: 1;
}

.move-Pokemon {
  padding: 100px;
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

</style>
