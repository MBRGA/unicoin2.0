<template>
  <span v-if="transaction" class="small">
    <a class="token-id" :href="buildLink" target="_blank">here</a>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useStore } from "@/store/piniastore";

const store = useStore();

const props = defineProps(["transaction"]);

const dotDotDot = computed(() => {
  if (props.transaction) {
    return (
      props.transaction.substring(0, 5) +
      "..." +
      props.transaction.substring(props.transaction.length - 6, props.transaction.length)
    );
  }
  return "";
});
const buildLink = computed(() => {
  return `${store.etherscanBase}/address/${props.transaction}`;
});
</script>

<script>
/* global web3:true */
/*import { mapGetters, mapState } from "vuex";

export default {
  name: "clickableTransaction",
  components: {},
  props: {
    transaction: {
      type: String,
    },
  },
  computed: {
    ...mapState(["etherscanBase"]),
    dotDotDot: function () {
      if (this.transaction) {
        return (
          this.transaction.substr(0, 6) +
          "..." +
          this.transaction.substr(this.transaction.length - 6, this.transaction.length)
        );
      }
      return "";
    },
    buildLink: function () {
      return `${this.etherscanBase}/tx/${this.transaction}`;
    },
  },
};*/
</script>

<style></style>
