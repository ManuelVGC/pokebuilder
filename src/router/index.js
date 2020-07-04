import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import DataForm from '../views/dataForm.vue';

Vue.use(VueRouter);
Vue.use(Vuelidate);

const routes = [
  {
    path: '/',
    name: 'DataForm',
    component: DataForm,
  },
  {
    path: '/mainWindow',
    name: 'MainWindow',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
