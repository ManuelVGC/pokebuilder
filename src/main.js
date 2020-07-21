import Vue from 'vue';
import Vuelidate from 'vuelidate';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  BootstrapVue,
  Vuelidate,
  store,
  render: (h) => h(App),
}).$mount('#app');
