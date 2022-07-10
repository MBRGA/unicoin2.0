import Vue from "vue";
import { ethers } from "ethers";

/*export const getNetIdString = (provider: ethers.providers.Provider) => {
  //Vue.prototype.$web3.eth.net.getId().then((id: number) => {
  return provider.getNetwork().then((net) => {
    switch (net.chainId) {
      case 1:
        return "Main Ethereum Network";
      case 3:
        return "Ropsten Ethereum Test Network";
      case 4:
        return "Rinkeby Ethereum Test Network";
      case 5:
        return "Görli Ethereum Test Network";
      case 42:
        return "Kovan Ethereum Test Network";
      case 31337:
        return "Hardhat";
      case -1:
        return "loading..";
      // Will be some random number when connected locally
      default:
        return "Local Test Network";
    }
  });
};*/

export async function getNetIdString(provider: ethers.providers.Provider) {
  return provider.getNetwork().then((net) => {
    switch (net.chainId) {
      case 1:
        return "Main Ethereum Network";
      case 3:
        return "Ropsten Ethereum Test Network";
      case 4:
        return "Rinkeby Ethereum Test Network";
      case 5:
        return "Görli Ethereum Test Network";
      case 42:
        return "Kovan Ethereum Test Network";
      case 31337:
        return "Hardhat Local Test Network";
      case -1:
        return "loading..";
      // Will be some random number when connected locally
      default:
        return "Local Test Network";
    }
  });
}

/*export const getEtherscanAddress = (): string => {
  return Vue.prototype.$web3.eth.net
    .getId()
    .then((id: number) => {
      switch (id) {
        case 1:
          return "https://etherscan.io";
        case 3:
          return "https://ropsten.etherscan.io";
        case 4:
          return "https://rinkeby.etherscan.io";
        case 5:
          return "https://goerli.etherscan.io";
        case 42:
          return "https://kovan.etherscan.io";
        default:
          return "http://localhost";
      }
    })
    .then((etherScanAddress: string) => {
      console.log(`Setting etherscan address as ${etherScanAddress}`);
      return etherScanAddress;
    });
};*/

export async function getEtherscanAddress(provider: ethers.providers.Provider) {
  return provider
    .getNetwork()
    .then((net) => {
      switch (net.chainId) {
        case 1:
          return "https://etherscan.io";
        case 3:
          return "https://ropsten.etherscan.io";
        case 4:
          return "https://rinkeby.etherscan.io";
        case 5:
          return "https://goerli.etherscan.io";
        case 42:
          return "https://kovan.etherscan.io";
        default:
          return "http://localhost";
      }
    })
    .then((etherScanAddress: string) => {
      console.log(`Setting etherscan address as ${etherScanAddress}`);
      return etherScanAddress;
    });
}
