<template>
  <h1>Página de login</h1>
  <div>
    <form @submit.prevent="logIn()">
      <h1>Log in to Pokémon Showdown</h1>
      <input type="text" placeholder="Usuario" v-model="username"> <!--aquí iria el v-model="user"-->
      <input type="password"  placeholder="Contraseña" v-model="password"/>
      <button>Guardar</button>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {logInShowdown} from "@/services/pokemonShowdownService";
import {send} from "@/services/websocket";

export default defineComponent({
  data(){
    return{
    }
  },
  methods: {
    async logIn() {
      const assertion = await logInShowdown(this.$store.state.user);
      console.log(assertion);
      if (assertion == -1) {
        console.log("Usuario o contraseña incorrectos");
      } else {
        send('|/trn ' + this.$store.state.user.username + ',0,' + assertion);
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
