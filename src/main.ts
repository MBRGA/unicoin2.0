import Vue from 'vue';

import { createApp } from 'vue';

import App from './App.vue';
import router from '@/router';
import store from './store';
import './registerServiceWorker';

import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

import VueMaterial from 'vue-material';
import VModal from 'vue-js-modal';
import Jazzicon from 'vue-jazzicon';



import VueSlider from 'vue-slider-component'

import 'vue-slider-component/theme/default.css'
import 'vue-material/dist/vue-material.min.css'
import "typeface-space-mono";

require('vue2-animate/dist/vue2-animate.min.css')

createApp(App)
  .use(router)
  .use(VueMaterial)
  .use(VModal)
  .use(Vuetify)
  .component('jazzicon', Jazzicon)
  .component('VueSlider', VueSlider)
  .mount("#app")

