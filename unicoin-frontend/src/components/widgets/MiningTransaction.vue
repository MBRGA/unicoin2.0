<template>
  <v-dialog v-model="showDialog" persistent>
    <v-card v-if="isUploading">
      <v-card-title> Uploading content to IPFS </v-card-title>
      <v-card-text>
        <img class="text-center" alt="step logo" style="height: 150px" src="../../assets/uploading.gif" />
        <p class="ma-8">Your content is being uploaded to IPFS. This could take a few seconds.</p>
      </v-card-text>
    </v-card>
    <v-card v-if="isPending">
      <v-card-title> Approve the transaction... </v-card-title>
      <v-card-text>
        <video
          class="text-center"
          alt="step logo"
          style="height: 200px"
          type="video/webm"
          src="../../assets/miningTransaction.webm"
          autoplay="true"
          loop="true"
        />
        <p class="ma-8">Approve the transaction in your web3 provider to submit it to the blockchain.</p>
      </v-card-text>
    </v-card>
    <v-card v-if="isDone">
      <v-card-title> Transaction mined </v-card-title>
      <v-card-text>
        <img class="text-center" alt="step logo" style="height: 200px" src="../../assets/unicorn_dabbing.gif" />
        <p class="ma-8">
          Transaction has been mined! You can view the transaction info on EtherScan
          <clickable-transaction :transaction="transactionHash" />.
        </p>
        <v-card-actions>
          <v-spacer>
            <v-btn @click="modalClosed()">Close</v-btn>
          </v-spacer>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useStore } from "@/store/piniastore";
import { ref, computed } from "vue";
import ClickableTransaction from "./ClickableTransaction.vue";
import { TransactionStatus } from "@/utils/enums";

// Have to duplicate this because Vue can't see the types
/*enum TransactionStatus {
  Pending,
  Uploading,
  Done,
  Failed,
  None,
}*/

const store = useStore();

store.$subscribe((mutation, state) => {
  if (state.miningTransactionObject) {
    if (state.miningTransactionObject.status != TransactionStatus.None) showDialog.value = true;
  }
});

const showDialog = ref(true);

// Need these computed props because Vue doesn't like us to try check for null within the condition attributes:

const isPending = computed(() => {
  return store.miningTransactionObject?.status && store.miningTransactionObject.status == TransactionStatus.Pending;
});

const isDone = computed(() => {
  return store.miningTransactionObject?.status && store.miningTransactionObject.status == TransactionStatus.Done;
});

const isUploading = computed(() => {
  return store.miningTransactionObject?.status && store.miningTransactionObject.status == TransactionStatus.Uploading;
});

const transactionHash = computed(() => {
  if (store.miningTransactionObject?.txHash) return store.miningTransactionObject.txHash;

  return "";
});

function modalClosed() {
  console.log("Closed transaction popup");
  if (!store.miningTransactionObject) return;
  store.miningTransactionObject.status = TransactionStatus.None;
  showDialog.value = false;
}
</script>

<script>
/* global web3:true */
/*import { mapActions, mapState } from "vuex";

import ClickableTransaction from "./ClickableAddress.vue";

export default {
  name: "miningTransaction",
  components: { ClickableTransaction },
  data: () => ({
    showDialog: true,
  }),
  methods: {
    ...mapActions(["CLOSE_MINING_DIALOG"]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    },
  },
  mounted() {},
  computed: {
    ...mapState(["etherscanBase", "miningTransactionObject"]),
  },
};*/
</script>

<style></style>
