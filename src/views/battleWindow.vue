<template>
  <div class="container-fluid" style="overflow: hidden">
    <div class="row" style="height: 10%">
      <div class="col bg-primary">
        <h1>Bienvenido a </h1>
      </div>
    </div>
    <div class="row" style="height: 90%">
      <div class="col-12 col-md-8">
        <div class="row bg-secondary" style="height: 65%; min-height: 65%">
        </div>
        <div class="row" style="height: 35%; min-height: 35%">
          <div class="col bg-success">
          </div>
          <div class="col bg-danger">
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 bg-warning" id="chat" ref="chat"
           style="overflow-y: auto; height: 100%; max-height: 100%">

      </div>
    </div>
  </div>
</template>

<script>

import { mapMutations } from 'vuex';

export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations('webSocket', ['searchBattleWithTeam', 'setStateRef']),
  },
  mounted() {
    this.setStateRef(this.$refs.chat);
  },
};
</script>

<style lang="scss" scoped>
</style>
