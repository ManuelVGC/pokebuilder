<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col bg-primary">
        <h1>Bienvenido a </h1>
      </div>
    </div>
    <div class="row height100">
      <div class="col-12 col-md-8">
        <div class="row bg-secondary height65">
          <h1>Texto de ejemplo</h1>
        </div>
        <div class="row height35">
          <div class="col bg-success">
            <h1>Texto de ejemplo</h1>
          </div>
          <div class="col bg-danger">
            <h1>Texto de ejemplo</h1>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 bg-warning" id="chat" ref="chat">

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
  .height65 {
    height: 65%;
  }
  .height35 {
    height: 35%;
  }
  .height100 {
    height: 100%;
  }

</style>
