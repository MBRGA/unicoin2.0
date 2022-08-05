<template>
  <div id="app">
    <v-app>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon @click.stop="menuVisible = !menuVisible"></v-app-bar-nav-icon>

        <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-title class="text-subtitle-2" v-if="store.userProfile">{{
          `${store.userProfile.firstName} ${store.userProfile.lastName}`
        }}</v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer v-model="menuVisible" absolute temporary>
        <v-list nav dense>
          <v-list-item v-for="item in menuItems" :key="item.label" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                <!-- Any non-relative links will be opened in a new tab -->
                <router-link :to="item.path" v-if="isRelativeLink(item.path)">
                  {{ item.label }}
                </router-link>
                <a v-else :href="item.path" target="_blank">{{ item.label }}</a>
              </v-list-item-title>
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
          {{ currentNetwork }}<clickable-address :light="false" :icon="false" :eth-address="store.contractAddress"
        /></v-col>
      </v-row>
    </v-app>
  </div>
</template>

<script setup lang="ts">
import ClickableAddress from "./components/widgets/ClickableAddress.vue";
import MiningTransaction from "./components/widgets/MiningTransaction.vue";

import { ref, onMounted } from "vue";

import { useStore } from "@/store/piniastore";

const menuVisible = ref(false);

const store = useStore();

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

const menuItems: Array<MenuItem> = [
  { label: "Home", path: "/", icon: "mdi-home" },
  { label: "Profile", path: "/Profile", icon: "mdi-account-box" },
  { label: "Create New User", path: "/CreateProfile", icon: "mdi-account-plus" },
  { label: "Browse Publications", path: "/BrowsePublications", icon: "mdi-search" },
  { label: "List New Publication", path: "/ListPublication", icon: "mdi-publish" },
  { label: "Manage Publications", path: "/ManagePublications", icon: "mdi-format-list-bulleted" },
  { label: "My Bids", path: "/MyBids", icon: "mdi-attach-money" },
  { label: "My Licences", path: "/MyLicences", icon: "mdi-key" },
  { label: "Github", path: "https://github.com/unicoinlicences/unicoindapp", icon: "mdi-github" },
  {
    label: "Documentation",
    path: "https://github.com/unicoinlicences/unicoindapp/tree/master/Documentation/TechnicalArchitecture.md",
    icon: "mdi-chat",
  },
  { label: "Contact Us", path: "/ContactUs", icon: "mdi-chat" },
];

function isRelativeLink(url: string) {
  return !/^(?:[a-z]+:)\/\//i.test(url);
}

onMounted(() => {
  store.initApp();
});
</script>

<script lang="ts">
/*import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default Vue.extend({
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
});*/
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Space+Mono");
@import "~vue-material/dist/theme/engine"; // Import the theme engine
@include md-register-theme(
  "default",
  (
    primary: #828ec6,
    // The primary color of your brand
      accent: #dd688c // The secondary color of your brand
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
