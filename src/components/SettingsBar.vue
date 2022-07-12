<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link to="/home" class="navbar-brand">Pokémon Showdown</router-link>
      <div>
        <ul class="navbar-nav">
          <li class="nav-item">{{this.$store.state.user.username}}</li>
          <li class="nav-item">Settings</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
/**
 * Barra de navegación de la página web.
 */

import {defineComponent} from "vue";

export default defineComponent({
  name: "SettingsBar",
})
</script>

<style scoped>

</style>
