<template>
  <v-card class="mx-auto pa-7">
    <v-row>
      <v-col cols="9">
        <v-card-title class="text-heading-5"> {{ bidInformation.publicationTitle }}</v-card-title>
        <v-card-subtitle
          ><div class="text-subtitle-1">Bid ID: {{ bidInformation.id }}</div></v-card-subtitle
        >
        <v-card-text>
          <div class="py-2"><b class="font-weight-bold">Your offer:</b> {{ bidInformation.offer }} USD</div>
          <div class="py-2">
            <b class="font-weight-bold">Bid Status: </b
            ><span v-if="bidInformation.bidStatus == 1"
              ><v-chip color="primary">Accepted</v-chip> View your licence on your
              <a href="/MyLicences">Licences</a> page</span
            >
            <span v-else-if="bidInformation.bidStatus == 2"><v-chip color="accent">Rejected</v-chip></span>
            <span v-else-if="bidInformation.bidStatus == 3"
              ><v-chip color="primary">Sale</v-chip> Successfully purchased. View your licence on your
              <a href="/MyLicences">Licences</a> page</span
            >
            <span v-else-if="bidInformation.bidStatus == 4"><v-chip>Cancelled</v-chip></span>
            <span v-else><v-chip>Pending</v-chip></span>
          </div>
        </v-card-text>
        <v-card-actions class="pt-4">
          <v-btn
            v-if="bidInformation.bidStatus == 1 || bidInformation.bidStatus == 3"
            color="primary"
            :plain="bidInformation.bidStatus == 1"
            :href="bidInformation.pdfFile"
            >Download Paper</v-btn
          >
          <v-btn v-if="bidInformation.bidStatus == 1 || bidInformation.bidStatus == 3" color="primary" plain
            >Download Licence</v-btn
          >
          >
          <v-btn
            v-if="bidInformation.bidStatus == 1 || bidInformation.bidStatus == 0"
            color="primary"
            @click="cancelBid"
            >Cancel Bid</v-btn
          >
        </v-card-actions>
      </v-col>

      <v-col cols="3"
        ><pdf :src="pdfFile" :page="1" :resize="true">
          <template v-slot:loading>loading content here...</template>
        </pdf>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import pdf from "vue-pdf";
import { useStore, UserBid } from "@/store/piniastore";
import { BigNumber } from "ethers";

const store = useStore();

const props = defineProps<{
  bidInformation: UserBid;
}>();

const pdfFile;

function cancelBid() {
  store.cancelBid(BigNumber.from(props.bidInformation.id));
}
</script>

<script lang="ts">
/*import { mapActions, mapState } from "vuex";


export default {
  name: "browseBidsRowItem",
  components: { pdf },
  data: () => ({ offer: 0 }),
  props: {
    bidInformation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions(["CANCEL_BID"]),
    cancelBid() {
      this.CANCEL_BID({
        bidId: this.bidInformation.id,
      });
    },
  },
};*/
</script>
