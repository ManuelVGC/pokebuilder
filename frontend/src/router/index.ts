/**
* Define las rutas con las que va a contar el frontend de la aplicación.
* @module
*/

import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import store from "@/store";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/home',
        name: 'home',
        beforeEnter(to, from, next) {
            if (store.state.user.username == null) {
                next('/');
            }
            else {
                next();
            }
        },
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/battle/:id',
        name: 'battle',
        beforeEnter(to, from, next) {
            if (store.state.user.username == null) {
                next('/');
            }
            else {
                next();
            }
        },
        component: () => import('../views/Battle.vue'),
    },
    {
        path: '/teams',
        name: 'teams',
        beforeEnter(to, from, next) {
            if (store.state.user.username == null) {
                next('/');
            }
            else {
                next();
            }
        },
        component: () => import('../views/Teams.vue'),
    },
    {
        path: '/teambuilder/:id',
        name: 'teambuilder',
        beforeEnter(to, from, next) {
            if (store.state.user.username == null) {
                next('/');
            }
            else {
                next();
            }
        },
        component: () => import('../views/Teambuilder.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
