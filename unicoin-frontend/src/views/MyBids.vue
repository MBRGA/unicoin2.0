<template>
  <v-app>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> View all pending, cancelled, or accepted bids and purchases here </v-card-title>
        </v-card>
        <BrowseBidsRowItem v-for="bid in store.userBids" :bidInformation="bid" class="ma-4" :key="bid.id.toNumber()" />
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@/store/piniastore";
import BrowseBidsRowItem from "@/components/BrowseBidsRowItem.vue";

const store = useStore();

onMounted(() => {
  store.loadUserBids();
  store.loadAllPublications();
});
</script>

<script>
/*import { mapActions, mapState } from "vuex";
import BrowseBidsRowItem from "@/components/BrowseBidsRowItem.vue";
import browsePublicationRowItem from "@/components/browsePublicationRowItem.vue";
import { onMounted } from "vue";

export default {
  name: "viewbid",
  data: () => ({}),
  components: {
    browseBidsRowItem,
    browsePublicationRowItem,
  },
  methods: {
    ...mapActions(["GET_USER_BIDS", "GET_ALL_PUBLICATIONS"]),
  },
  mounted() {
    this.GET_USER_BIDS();
    this.GET_ALL_PUBLICATIONS();
  },
  computed: {
    ...mapState(["userBids"]),
    ...mapState(["numberOfPublications", "listedPublications"]),
  },
};*/
</script>
