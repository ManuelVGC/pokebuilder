<template>
  <div style="margin: 1em">
    <form @submit.prevent="logIn()">
      <h1>Log in to Pokémon Showdown</h1>
      <div style="margin-top: 1em">
        <div class="form-floating mb-3">
          <input type="text" placeholder="User" v-model="username" class="form-control" id="floatingUser"/>
          <label for="floatingUser">User</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" placeholder="Password" v-model="password" class="form-control" id="floatingPassword"/>
          <label for="floatingPassword">Password</label>
        </div>
        <button class="btn btn-info">Log in</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
/** View para la página de inicio de sesión de la aplicación. */

import {defineComponent} from "vue";
import {logInShowdown} from "@/services/pokemonShowdownService";
import {send} from "@/services/websocket";

export default defineComponent({
  methods: {
    /** Inicio de sesión en Pokémon Showdown. */
    async logIn() {
      const assertion = await logInShowdown(this.$store.state.user);
      if (assertion === -1) { //Fallo en el logeo
        console.log('Failed to log in: invalid username or password');
      } else { //Inicio de sesión correcto
        send('|/trn ' + this.$store.state.user.username + ',0,' + assertion);
        console.log("Log in successful");
        this.$router.push({name: "home"});
      }
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

</style>
