import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";

//import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    development: {
      url: "localhost:7545",
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      chainId: 5,
      gas: 7000000,
      gasPrice: 6000000000,
    },
    kovan: {
      url: process.env.KOVAN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      chainId: 42,
      gas: 7000000,
      gasPrice: 6000000000,
    },
  },
  solidity: {
    version: "0.8.15",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 500,
      },
    },
  },
};

export default config;
