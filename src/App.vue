<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click.stop="menuVisible = !menuVisible"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-title class="text-subtitle-2">{{
        "${userProfile.firstName} ${userProfile.lastName}"
      }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="menuVisible" absolute temporary>
      <v-list nav dense>
        <v-list-item v-for="item in menuItems" :key="item.label" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              ><router-link :to="item.path">{{ item.label }}</router-link></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <mining-transaction />
      <router-view />
    </v-main>
    <v-row>
      <v-col class="text-subtitle"><a href="/TermsOfService">Terms of service</a> </v-col>
      <v-col class="text-caption">
        {{ currentNetwork }}<clickable-address :light="false" :icon="false" :eth-address="contractAddress"
      /></v-col>
    </v-row>
  </v-app>
</template>

<script lang="ts">
/* global web3:true */
import Web3 from "web3";
import Vue from "vue";
import * as actions from "@/store/actions";
import * as mutations from "@/store/mutation-types";
import { mapActions, mapState } from "vuex";
import router from "@/router";
import MiningTransaction from "./components/widgets/MiningTransaction.vue";
import ClickableAddress from "./components/widgets/ClickableAddress.vue";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import provider from "web3";
import { ethers } from "hardhat";
import { ExternalProvider } from "@ethersproject/providers";
import * as dotenv from "dotenv";
import defineComponent from "vue";

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

interface AppData {
  web3Detected: boolean;
  menuVisible: boolean;
  menuItems: MenuItem[];
}

interface Unicoin {

}

export default class Unicoin extends Vue {
  name: "app",
  components: { ClickableAddress, MiningTransaction },
  data(): AppData {
    return {
      web3Detected: true,
      menuVisible: false,
      menuItems: [
        { label: "Home", path: "/", icon: "mdi-home" },
        { label: "Profile", path: "/Profile", icon: "mdi-account-box" },
        { label: "Create New User", path: "/CreateProfile", icon: "mdi-account-plus" },
      ],
    };
  },
  methods: {
    ...mapActions(["INIT_APP"]),
    redirect(_path: string) {
      router.push({ name: _path });
    },
  },

  // Make sure ESLint knows about ethereum global variable
  /* global ethereum */

  async mounted() {
    dotenv.config();

    const eth = await detectEthereumProvider();

    if (eth) {
      Vue.prototype.$provider = new ethers.providers.Web3Provider(eth as ExternalProvider);

      console.log("web3 provider detected!");
      (eth as any)
        .request({ method: "eth_requestAccounts" })
        .then((value: any) => {
          console.log("Bootstrapping web app - provider acknowledged", value);
        })
        .catch((error: any) => {
          console.log("User denied access, bootstrapping application using infura", error);

          Vue.prototype.$provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);
        });
      /*} else if (Vue.prototype.$web3) {
      console.log("Running legacy web3 provider");
      Vue.prototype.$web3 = new Web3(Vue.prototype.$web3.currentProvider);*/
    } else {
      Vue.prototype.$provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);

      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    this.INIT_APP(Vue.prototype.$provider);
  },
  computed: {
    ...mapState(["currentNetwork", "account", "contractAddress", "userProfile"]),
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Space+Mono");
@import "~vue-material/dist/theme/engine"; // Import the theme engine
@include md-register-theme(
  "default",
  (
    // The primary color of your brand
    primary: #828ec6,
    // The secondary color of your brand
    accent: #dd688c
  )
);
@import "~vue-material/dist/theme/all"; // Apply the theme
html,
body {
  font-family: "Space Mono", sans-serif;
}
#app {
  /* text-align: center; */
  color: #454a50;
}
#app {
  font-family: "Space Mono", sans-serif;
}
nav li:hover,
nav li.router-link-active,
nav li.router-link-exact-active {
  background-color: indianred;
  cursor: pointer;
}
.text-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
