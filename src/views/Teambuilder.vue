<template>
  <SettingsBar/>
  <button @click="this.$router.push('/teams')">Go back to the team list</button>
  <h1>Welcome to the teambuilder!</h1>
</template>

<script>
import {defineComponent} from "vue";
import SettingsBar from "@/components/SettingsBar";

export default defineComponent({
  name: 'TeambuilderView',
  components: {
    SettingsBar,
  }
})
</script>

<style scoped>

</style>
