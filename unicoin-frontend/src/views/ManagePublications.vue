<template>
  <div class="page-container">
    <v-container>
      <v-row>
        <v-col>
          <v-sheet>
            <div class="pa-16">
              <span class="text-heading-4"> Manage your publications </span>
              <p class="text-center text-heading-5">
                View all of your uploaded publications, review bids for your licences, and change your key settings.
              </p>
            </div>
          </v-sheet>
          <div v-if="store.listedPublications">
            <manage-publication-row-item
              v-for="publication in store.listedPublications.filter((x) => x.authorAddress === store.userAddress)"
              :publicationInformation="publication"
              :key="publication.publicationId.toNumber()"
              style="margin: 20px"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@/store/piniastore";
import ManagePublicationRowItem from "@/components/ManagePublicationRowItem.vue";

const store = useStore();

onMounted(() => store.loadAllPublications());
</script>

<script>
/*import { mapActions, mapState } from "vuex";

import managePublicationRowItem from "@/components/managePublicationRowItem";
import { onMounted } from "vue";

export default {
  name: "manage",
  components: { managePublicationRowItem },
  data: () => ({}),
  methods: {
    ...mapActions(["GET_ALL_PUBLICATIONS"])
  },
  mounted() {
    this.GET_ALL_PUBLICATIONS();
  },

  computed: {
    ...mapState(["numberOfPublications", "listedPublications", "userNumber"])
  }
};*/
</script>
