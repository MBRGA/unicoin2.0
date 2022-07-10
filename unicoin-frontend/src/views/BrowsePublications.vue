<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout">
        <div class="md-layout-item">
          <md-content style="padding: 20px">
            <md-card-header>
              <div class="md-title">
                <h1>View all publications on the marketplace🦄</h1>
              </div>
            </md-card-header>
            <md-content style="padding: 40px" class="text-center">
              <h2>
                All publications on UniCoin are available freely for download for academic or personal use. Please see
                individual publications for commercial licencing details.
              </h2>
            </md-content>
          </md-content>

          <transition-group name="fadeUp" tag="ul">
            <browse-publication-row-item
              v-for="publication in store.listedPublications"
              :publicationInformation="publication"
              style="margin: 20px"
              :key="publication.publicationId.toNumber()"
            />
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@/store/piniastore";
import browsePublicationRowItem from "@/components/browsePublicationRowItem.vue";

const store = useStore();

onMounted(() => store.loadAllPublications());
</script>
