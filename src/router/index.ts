import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
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
    routes: routes, //se podría haber puesto solo routes y ya está, sin el : routes.
});

export default router;