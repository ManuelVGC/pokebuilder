/**
 * Define las rutas con las que va a contar el frontend de la aplicación.
 */

import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/battle/:id',
        name: 'battle',
        component: () => import('@/views/Battle.vue'),
    },
    {
        path: '/teams',
        name: 'teams',
        component: () => import('@/views/Teams.vue'),
    },
    {
        path: '/teambuilder',
        name: 'teambuilder',
        component: () => import('@/views/Teambuilder.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
