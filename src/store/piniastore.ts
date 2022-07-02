import { defineStore } from "pinia";
import { UnicoinRegistry } from "typechain-types/contracts/UnicoinRegistry";
import { Signer } from "ethers";
import { getEtherscanAddress, getNetIdString } from "@/utils/lookupTools";
import { ethers, network, upgrades } from "hardhat";
import { GET_ALL_PUBLICATIONS, GET_USER_BIDS, GET_USER_PROFILE } from "./actions";
import { state } from "@openzeppelin/upgrades/lib/utils/Transactions";
import { IPFSPublication, viewFile, IPFSProfile } from "@/utils/ipfsUploader";

export enum transactionStatus {
  pending,
  uploading,
  done,
}

class UserBid {
  id = 0;
  offer = 0;
  bidStatus = "";
  ownerId = 0;
  ownerAddress = "";
  bidderFirstName = "";
  bidderLastName = "";
  bidderAccountType = 0;
  bidderCompanyName = "";
}

interface State {
  //web3?: Web3;
  //account?: string;
  currentNetwork: string;
  etherscanBase: string;
  registry?: UnicoinRegistry;
  //userNumber: number;
  userAddress: string;
  numberOfPublications: number;
  listedPublications: Array<string>;
  contractAddress: string;
  signer?: Signer;
  userBids: Array<UserBid>;
  userProfile?: IPFSPublication;
  userLicences: Array<string>;
  miningTransactionObject?: {
    status?: transactionStatus;
    txHash: string;
  };
}

export const useStore = defineStore("main", {
  state: (): State => ({
    currentNetwork: "",
    etherscanBase: "",
    registry: undefined,
    userNumber: -1,
    numberOfPublications: -1,
    listedPublications: [],
    contractAddress: "",
    signer: undefined,
    userBids: [],
    userProfile: undefined,
    userLicences: [],
    miningTransactionObject: undefined,
  }),
  getters: {},
  actions: {
    async initApp() {
      const Registry = await ethers.getContractFactory("UnicoinFactory");

      const registry = await (() => {
        if (network.name === "hardhat") {
          return upgrades.deployProxy(Registry);
        } else {
          return Registry.attach("0x0");
        }
      })() as UnicoinRegistry;

      await registry.deployed();

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);

      this.currentNetwork = getNetIdString();
      this.etherscanBase = getEtherscanAddress();

      if (registry.address) {
        this.contractAddress = registry.address;
      }

      await provider.send("eth_requestAccounts", []);

      this.signer = provider.getSigner();

      GET_USER_PROFILE();
      GET_USER_BIDS();

      const numberOfPublications = await registry.getPublicationLength();
      if (numberOfPublications) {
        console.log(`Length ${numberOfPublications.toNumber()}`);
        GET_ALL_PUBLICATIONS();
      }
    },
    async getUserProfile() {
      const userProfile = await this.registry?.get;
      const ipfsBlob: IPFSProfile = await viewFile(userProfile.profile_uri);
      this.userProfile = ipfsBlob;
    },
    async getUserBids() {
      console.assert(this.signer);

      if (this.signer) {
        const usersBids = await this.registry?.getBids(this.signer.getAddress());
      }

    }
  },
});
