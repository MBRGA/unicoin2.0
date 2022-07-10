<template>
  <div v-if="ethAddress" class="md-layout">
    <jazzicon v-if="icon" :address="ethAddress" :diameter="25" />
    <a class="eth-address md-subheading" :href="buildLink" target="_blank" style="color: white" v-if="light == true">{{
      dotDotDot
    }}</a>
    <a class="eth-address" :href="buildLink" target="_blank" v-if="light == false">{{ dotDotDot }}</a>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  ethAddress: string;
  light: boolean;
  icon: boolean;
}

import { reactive, computed } from "vue";
import { useStore } from "@/store/piniastore";

const store = useStore();

const props = withDefaults(defineProps<Props>(), {
  icon: true,
});

const dotDotDot = computed(() => {
  if (props.ethAddress) {
    return (
      props.ethAddress.substring(0, 5) +
      "..." +
      props.ethAddress.substring(props.ethAddress.length - 6, props.ethAddress.length)
    );
  }
  return "";
});
const buildLink = computed(() => {
  return `${store.etherscanBase}/address/${props.ethAddress}`;
});
</script>

<script>
/* global web3:true */
/*
import { mapGetters, mapState } from "vuex";

export default {
  name: "clickableAddress",
  components: {},
  /*props: {
    ethAddress: {
      type: String,
    },
    light: {
      type: Boolean,
    },
    icon: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(["etherscanBase"]),
    dotDotDot: function () {
      if (this.ethAddress) {
        return (
          this.ethAddress.substr(0, 6) +
          "..." +
          this.ethAddress.substr(this.ethAddress.length - 6, this.ethAddress.length)
        );
      }
      return "";
    },
    buildLink: function () {
      return `${this.etherscanBase}/address/${this.ethAddress}`;
    },
  },
};*/
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

// Eth Address
.eth-address {
  display: inline-block;
  padding: 0.125rem 0.25rem;
  // background: rgba($darkgray, 0.05);

  &:hover {
    background: rgba($darkgray, 0.1);
    border-bottom: none;
  }
}
</style>
