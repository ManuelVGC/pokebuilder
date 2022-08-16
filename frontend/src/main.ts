/**
 * Archivo principal del frontend.
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";

/** Importación del theme Lux de Bootswatch */
import 'bootswatch/dist/lux/bootstrap.min.css'

/** Importación de los iconos de Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add( fas, far, fab);


createApp(App)
    .use(router)
    .use(store)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
