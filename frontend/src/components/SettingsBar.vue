<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="gridNavBar">
      <div class="navbar-brand">Pokebuilder</div>
      <div class="nameLogOut">
        <ul class="navbar-nav">
          <li class="nav-item name">{{this.$store.state.user.username}}</li>
          <li class="nav-item logout" @click="tryLogOut()">Log out</li>
        </ul>
      </div>
    </div>
    <div v-if="logOutConfirmation" class="popUpContainer">
      <div class="popUp">
        <p class="errorTitle">Warning!</p>
        <div class="errorDescription">Do you really want to log out?"</div>
        <div>
          <button @click="logOut()" class="buttonLogOut" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Log out</button>
          <button @click="cancel()" class="buttonCancel" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Cancel</button>
        </div>
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
import store from "@/store";

export default defineComponent({
  name: "SettingsBar",
  data() {
    return {
      logOutConfirmation: false as boolean, /** Flag que indica si el jugador quiere cerrar sesión en la cuenta actual. */
    }
  },
  methods: {
    /** Intentar cerrar sesión. */
    tryLogOut() {
      this.logOutConfirmation = true;
    },

    /** Cierre de sesión con la confirmación del usuario. */
    logOut() {
      if (this.$store.state.battleFinished === false) {
        const data = store.state.battleInfo + '|/forfeit';
        send(data);
        store.commit('SET_BATTLEFINISHED', true);
      }
      send('|/logout');
      this.$store.commit('SET_USERNAME', '');
      this.$store.commit('SET_PASSWORD', '');
      this.$router.push({name: "login"});
    },

    /** Cancela el intento de cierre de sesión. */
    cancel() {
      this.logOutConfirmation = false;
    }
  }
})
</script>

<style scoped>
.navbar {
  background-color: #1768AC;
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
  z-index: 3;
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

.buttonLogOut {
  display: inline-block;
  margin-top: 2em;
  height: 3em;
  width: 10em;
  background-color: #d7313e;
  color: white;
  font-size: large;
}

.buttonLogOut:hover {
  background-color: #e85660;
}

.buttonLogOut:active {
  background-color: #d7313e;
}

.buttonCancel {
  display: inline-block;
  margin-top: 2em;
  height: 3em;
  width: 10em;
  background-color: #1768AC;
  color: white;
  font-size: large;
}

.buttonCancel:hover {
  background-color: #5397f9;
}

.buttonCancel:active {
  background-color: #1768AC;
}

</style>
