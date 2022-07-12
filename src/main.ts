/**
 * Archivo principal del frontend.
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";

import 'bootswatch/dist/lux/bootstrap.min.css'

createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
