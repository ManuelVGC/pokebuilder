<template>
  <div class="grid">
    <div class="leftGrid">
      <img class="imageForm" src="../assets/login/backgroundImageLeon.jpg" alt="loginImage">
    </div>
    <div class="rightGrid">
      <div class="gridForm">
        <form class="form" @submit.prevent="logIn()">
          <p class="logInText">Log in to Pokémon Showdown</p>
          <div>
            <div class="form-floating mb-3" style="box-sizing: border-box">
              <input type="text" placeholder="User" v-model="username" class="form-control" style="border-width: 0.1em;border-color: grey; border-radius: 0.3em" id="floatingUser" required/>
              <label for="floatingUser">User</label>
            </div>
            <div class="form-floating mb-3">
              <input type="password" placeholder="Password" v-model="password" class="form-control" style="border-width: 0.1em;border-color: grey; border-radius: 0.3em" id="floatingPassword" required/>
              <label for="floatingPassword">Password</label>
            </div>
            <button v-if="!loginIn" class="buttonLogIn" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Log in</button>
            <button v-if="loginIn" class="buttonLoginIn" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Login in...</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="error" class="popUpContainer">
    <div class="popUp">
      <p class="errorTitle">Error</p>
      <p class="errorDescription">Failed to log in: invalid username or password.</p>
      <button @click="closeError()" class="button2" style="box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.3); border-radius: 0.5em;">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
/** View para la página de inicio de sesión de la aplicación. */

import {defineComponent} from "vue";
import {logInShowdown} from "../services/pokemonShowdownService";
import {send} from "../services/websocket";

export default defineComponent({
  data() {
    return {
      error: false as boolean, /** Indica cuando se ha producido un error en el inicio de sesión. */

      loginIn: false as boolean /** Flag para controlar cuando se ha iniciado sesión. */
    }
  },
  methods: {
    /** Inicio de sesión en Pokémon Showdown. */
    async logIn() {
      this.loginIn = true;
      const assertion = await logInShowdown(this.$store.state.user);
      if (assertion.data === -1) { //Fallo en el logeo
        this.error = true;
        this.loginIn = false;
      } else { //Inicio de sesión correcto
        send('|/trn ' + this.$store.state.user.username + ',0,' + assertion.data);
        this.$router.push({name: "home"});
        this.loginIn = false;
      }
    },

    /** Cerrar el cuadro de texto que nos indica error en el inicio de sesión. */
    closeError() {
      this.error = false;
    },
  },

  computed: {
    username: {
      get () {
        return this.$store.state.user.username;
      },
      set (value) {
        this.$store.commit('SET_USERNAME', value)
      }
    },
    password: {
      get () {
        return this.$store.state.user.password;
      },
      set (value) {
        this.$store.commit('SET_PASSWORD', value)
      }
    }
  },
  name: 'LoginView',
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1.75fr 1fr;
}
.rightGrid {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  background: #ffffff;
  overflow: auto;
  height: 100vh;
}
.gridForm {
  grid-row-start: 2;
  grid-row-end: 6;
  padding: 7em 5em 5em 5em;
}
.leftGrid {
  overflow: hidden;
}

.imageForm {
  height: 100vh;
  width: 100vw;
}

.form {
  text-align: center;
}

.logInText {
  margin-bottom: 1.5em;
  color: #1e1e1e;
  font-weight: bold;
  font-size: xx-large;
}

.buttonLogIn {
  margin-top: 2em;
  height: 4em;
  width: 15em;
  background-color: #d7313e;
  color: white;
  font-size: large;
  font-weight: bold;
}

.buttonLogIn:hover {
  background-color: #e85660;
}

.buttonLogIn:active {
  background-color: #d7313e;
}

.buttonLoginIn {
  margin-top: 2em;
  height: 4em;
  width: 15em;
  background-color: #A4A4A4;
  color: white;
  font-size: large;
  font-weight: bold;
  cursor: default;
}

.button2 {
  margin-top: 2em;
  height: 3em;
  width: 10em;
  background: #d7313e;
  color: white;
  border: none;
}

.button2:hover {
  background-color: #e85660;
}

.button2:active {
  background-color: #d7313e;
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



</style>
