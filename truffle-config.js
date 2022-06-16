//import HDWalletProvider from "@truffle/hdwallet-provider";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraApikey = "323a28006e7f4470ae14d3670fe2e655";
// eslint-disable-next-line @typescript-eslint/no-var-requires
let mnemonic = require("./mnemonic");

//import * as mnemonic from "./mnemonic";
//import * as ts_node from "ts-node";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("ts-node").register({
  files: true,
});

/*require("ts-node").register({
  files: true,
});*/

module.exports = {
  test_file_extension_regexp: /.*\.ts$/,
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Any network (default: none)
    },
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Any network (default: none)
      gas: 7000000000,
    },
    coverage: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraApikey}`);
      },
      network_id: 3,
      gas: 7000000, // default = 4712388
      gasPrice: 6000000000, // default = 100 gwei = 100000000000
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraApikey}`);
      },
      network_id: 42,
      gas: 7000000, // default = 4712388
      gasPrice: 6000000000, // default = 100 gwei = 100000000000
    },
  },
  mocha: {},
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.15",
      settings: {
        viaIR: true,
        optimizer: {
          enabled: true,
          runs: 500,
        },
      },
    },
  },
};
