import Web3 from "web3";
import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import moment from "moment";

import {
  getEtherscanAddress,
  getNetIdString,
}
from "@/utils/lookupTools";

import {
  uploadFile,
  viewFile,
} from "@/utils/ipfsUploader";

// import getTokenInfo from "@/utils/TokenInfo.js"

import * as actions from "./actions";
import * as mutations from "./mutation-types";

import truffleContract from "truffle-contract";

import UnicoinRegistryABI from "../../build/contracts/UnicoinRegistry.json"

const Registry = truffleContract(UnicoinRegistryABI);

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    web3: null,
    account: null,
    currentNetwork: null,
    etherscanBase: null,
    registry: null,
    userNumber: 1,
    numberOfPublications: 0,
    listedPublications: []
  },
  mutations: {
    //WEB3 Stuff
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3]: async function (state, {
      web3,
      contract
    }) {
      state.web3 = web3;
      state.registry = contract;
    },
    [mutations.SET_NUMBER_OF_PUBLICATIONS](state, numberOfPublications) {
      state.numberOfPublications = numberOfPublications;
    },
  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function ({
      commit,
      dispatch,
      state
    }) {
      getNetIdString().then(currentNetwork => {
        commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
      });
      getEtherscanAddress().then(etherscanBase => {
        commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
      });
    },

    [actions.INIT_APP]: async function ({
      commit,
      dispatch,
      state
    }, web3) {

      Registry.setProvider(web3.currentProvider)

      dispatch(actions.GET_CURRENT_NETWORK);

      let registry = await Registry.deployed();
      let accounts = await web3.eth.getAccounts();
      let account = accounts[0];
      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }

      commit(mutations.SET_WEB3, {
        web3,
        contract: registry
      })

      let numberOfPublications = await state.registry.getPublicationLength()
      if (numberOfPublications) {
        commit(mutations.SET_NUMBER_OF_PUBLICATIONS, numberOfPublications.toNumber());
      }

    },
    [actions.CREATE_USER]: async function ({
      commit,
      dispatch,
      state
    }, params) {
      console.log("IN create user CALL")
      console.log(params)

      console.log("IPFS")
      let ipfsHash = await uploadFile(params)
      console.log(ipfsHash.toString())
      await state.registry.registerUser(ipfsHash.toString(), {
        from: state.account
      })
    },
    [actions.LIST_PUBLICATION]: async function ({
      commit,
      dispatch,
      state
    }, params) {
      console.log("IN list publication call")
      console.log(params)

      let ipfsBlob = params
      ipfsBlob['userNumber'] = state.userNumber
      console.log(ipfsBlob)
      let ipfsHash = await uploadFile(ipfsBlob)
      console.log(ipfsHash.toString())
      await state.registry.createPublication(ipfsHash.toString(), params.isAuction, true, params.sellPrice, params.contributors, params.contributorsWeightings, {
        from: state.account
      })
    },
    [actions.GET_ALL_PUBLICATIONS]: async function ({
      commit,
      dispatch,
      state
    }) {

    }
  }
})