import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'DataForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/dataForm.vue'),
  },
  // {
  //   path: '/',
  //   name: 'BattleWindow',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/battleWindow.vue'),
  // },
  {
    path: '/mainWindow',
    name: 'MainWindow',
    component: () => import(/* webpackChunkName: "about" */ '../views/mainWindow.vue'),
  },
  {
    path: '/battleWindow',
    name: 'BattleWindow',
    component: () => import(/* webpackChunkName: "about" */ '../views/battleWindow.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
