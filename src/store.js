import Vue from 'vue';
import Vuex from 'vuex';

import webSocket from './vuexModules/webSocket';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    webSocket,
  },
});
