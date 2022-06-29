<template>
  <h1>Página de login</h1>
  <div>
    <form @submit.prevent="logIn()">
      <h1>Log in to Pokémon Showdown</h1>
      <input type="text" placeholder="User" v-model="username"> <!--aquí iria el v-model="user"-->
      <input type="password" placeholder="Password" v-model="password"/>
      <button>Log in</button>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {logInShowdown} from "@/services/pokemonShowdownService";
import {send} from "@/services/websocket";

export default defineComponent({
  methods: {
    //Logeo en Pokémon Showdown
    async logIn() {
      const assertion = await logInShowdown(this.$store.state.user);
      if (assertion === -1) { //Fallo en el logeo
        console.log('Failed to log in: invalid username or password');
      } else { //Logeo correcto
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
