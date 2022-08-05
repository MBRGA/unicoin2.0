<template>
  <v-app>
    <v-sheet class="text-center pa-4">
      <v-card-title class="text-h4 text-center"><h1>View all publications on the marketplace🦄</h1></v-card-title>
      <v-card-text class="pa-10 text-h6">
        <h2>
          All publications on UniCoin are available freely for download for academic or personal use. Please see
          individual publications for commercial licencing details.
        </h2>
      </v-card-text>
    </v-sheet>
    <v-scroll-y-transition group>
      <browse-publication-row-item
        v-for="publication in store.listedPublications"
        :publicationInformation="publication"
        class="ma-4"
        :key="publication.publicationId.toNumber()"
      />
    </v-scroll-y-transition>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@/store/piniastore";
import BrowsePublicationRowItem from "@/components/BrowsePublicationRowItem.vue";

const store = useStore();

onMounted(() => store.loadAllPublications());
</script>
