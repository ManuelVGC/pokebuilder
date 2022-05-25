<template>
  <SettingsBar/>
  <div class="gridContainer">
    <div class="battle">Battle</div>
    <div class="chat">Chat</div>
    <div class="move-Pokemon">Move-pokemon</div>
  </div>
  <button @click="manageForfeit()">Forfeit</button>
</template>

<script>
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";
import {send} from "@/services/websocket";

export default defineComponent({
  name: 'BattleView',
  components: {
    SettingsBar,
  },
  methods: {
    manageForfeit() {
      send('battle-gen3ou-' + this.$route.params.id + '|/forfeit');
      //this.$router.push({name: "home"});
    }
  }
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
