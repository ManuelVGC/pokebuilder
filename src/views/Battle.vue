<template>
  <SettingsBar/>
  <div class="gridContainer">
    <div class="battle">Battle</div>
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
      'chatMessages'
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


</style>
