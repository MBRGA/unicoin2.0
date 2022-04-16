import Vue from "vue";
import vuetify from "@/plugins/vuetify";

import App from "./App.vue";
import router from "@/router";
import store from "./store";
import "./registerServiceWorker";
import VueRouter from "vue-router";

import Web3 from "web3";

//import colors from "vuetify/lib/util/colors";

//import pdf from "vue-pdf";

import VueMaterial from "vue-material";

//const VueMaterial = require("vue-material");

import VModal from "vue-js-modal";
//import Jazzicon from "vue-jazzicon";

import Jazzicon from "@metamask/jazzicon";

import VueSlider from "vue-slider-component";

import "vue-slider-component/theme/default.css";
import "vue-material/dist/vue-material.min.css";
import "typeface-space-mono";
import { Verify } from "crypto";

require("vue2-animate/dist/vue2-animate.min.css");

Vue.component("jazzicon", Jazzicon);
Vue.component("VueSlider", VueSlider);

Vue.use(VueMaterial);
Vue.use(VModal);
Vue.use(VueRouter);


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
