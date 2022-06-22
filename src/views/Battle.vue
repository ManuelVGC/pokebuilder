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
    <div style= "overflow: scroll; max-height: 500px;" class="chat">
      <ul>
        <li v-for="msg in chatMessages" :key="msg">
          {{ msg }}
        </li>
      </ul>
    </div>
    <div class="move-Pokemon">Move-pokemon</div>
  </div>
  <button @click="manageForfeit()">Forfeit</button>
</template>

<script>
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";
import {send} from "@/services/websocket";
import store from "@/store";
import {mapState} from "vuex";

export default defineComponent({
  name: 'BattleView',
  components: {
    SettingsBar,
  },
  methods: {
    //Rendición en una batalla
    manageForfeit() {
      const data = this.$store.state.battleInfo + '|/forfeit';
      send(data);
      this.$router.push({name: "home"});
    }
  },
  computed: mapState([
      'chatMessages',
      'battleUser',
      'battleRival',
      'userSideConditions',
      'rivalSideConditions',
      'fieldConditions'
  ])
})
</script>

<style scoped>
.gridContainer {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 2fr 1fr;
  grid-template-areas:
    "battle chat"
    "move-Pokemon chat";
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

.card-tooltip .card-tooltip.text{
  visibility: hidden;
}

.card-tooltip:hover .card-tooltip.text{
  visibility: visible;
  opacity: 1;
}

</style>
