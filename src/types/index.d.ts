import Web3 from "web3";

declare module "pdfvuer";
declare module "vue-material";
declare module "@metamask/jazzicon" {
  export default function (diameter: number, seed: number): HTMLElement;
}

interface Vue {
  $web3: import("web3").default;
}


declare module "@vue/runtime-core" {
  interface State {
    web3?: import("web3").default;
    account?: string;
    currentNetwork?: string;
    etherscanBase?: string;
    registry?: string;
    userNumber: number;
    numberOfPublications: number;
    listedPublications: Array<string>;
    contractAddress?: string;
    userProfile: Object;
    userBids: Array<number>;
    userLicences: Array<string>;
    miningTransactionObject: {
      status?: string;
      txHash: string;
    };
  }

  interface ComponentCustomProperties {
    $store: import("vuex").Store<State>;
  }
}
