<template>
  <div>
    <h1>Pokémon Showdown</h1>
    <div>
      <ul>
        <li>{{this.$store.state.user.username}}</li>
        <li>Ajustes</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "SettingsBar",
})
</script>

<style scoped>

</style>
