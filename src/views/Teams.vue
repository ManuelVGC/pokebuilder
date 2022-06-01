<template>
  <SettingsBar/>
  <div>
    <h1>My created teams</h1>
    <button @click="this.$router.push('/teambuilder')">Create team</button>
  </div>
  <!--aquí ira un v-for con los equipos creados-->
</template>

<script>
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";

export default defineComponent({
  name: 'TeamsView',
  components: {
    SettingsBar,
  }
})
</script>

<style scoped>

</style>
