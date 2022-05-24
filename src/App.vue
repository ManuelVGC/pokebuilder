<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {onOpen,messageListener} from "@/services/websocket";

export default defineComponent({
  name: 'App',
  components: {

  },
  created() {
    onOpen();
    messageListener();
  }
});
</script>

<style>

</style>
