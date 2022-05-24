<template>
  <SettingsBar/>
  <div class="gridContainer">
    <div class="battle">Battle</div>
    <div class="chat">Chat</div>
    <div class="elecciones">Elecciones</div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";

export default defineComponent({
  name: 'BattleView',
  components: {
    SettingsBar,
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
    "elecciones chat";
}
.battle {
  grid-area: battle;
}
.chat {
  grid-area: chat;
}
.elecciones {
   grid-area: elecciones;
}


</style>
