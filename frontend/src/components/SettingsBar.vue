<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="gridNavBar">
      <router-link to="/home" class="navbar-brand" @click="returnToMainMenu()">Pokémon Showdown</router-link>
      <div class="nameLogOut">
        <ul class="navbar-nav">
          <li class="nav-item name">{{this.$store.state.user.username}}</li>
          <li class="nav-item logout" @click="logOut()">Log out</li>
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
import {send} from "@/services/websocket";
import {deleteTeam} from "@/services/teambuilderService";
import store from "@/store";

export default defineComponent({
  name: "SettingsBar",
  methods: {
    logOut() {
      if(confirm("Do you really want to log out?")) {
        if (this.$store.state.battleFinished === false) {
          const data = store.state.battleInfo + '|/forfeit';
          send(data);
          store.commit('SET_BATTLEFINISHED', true);
        }
        send('|/logout');
        this.$store.commit('SET_USERNAME', '');
        this.$store.commit('SET_PASSWORD', '');
        this.$router.push({name: "login"});
      }
    },
    returnToMainMenu() {
        if (this.$store.state.battleFinished === false) {
          if(confirm("Do you really want to return to the main menu?")) {
            const data = store.state.battleInfo + '|/forfeit';
            send(data);
            store.commit('SET_BATTLEFINISHED', true);
          }
        }
    }
  }
})
</script>

<style scoped>
.navbar {
  background-color: #4b88c3;
}
.gridNavBar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  align-items: center;
}

.navbar-brand {
  margin-left: 2em;
  font-weight: bold;
}

.nameLogOut {
  margin-right: 2em;
  justify-self: end;
  color: white;
}

.name {
  color: #1e1e1e;
}

.logout {
  cursor: pointer;
}

.logout:hover {
  color: #1e1e1e;
}

.navbar-brand:hover {
  color: #1e1e1e;
}
</style>
