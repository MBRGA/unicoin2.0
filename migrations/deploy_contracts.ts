import Web3 from "web3";

import Truffle from "truffle";

//const Web3 = require("web3");
import HDWalletProvider from "@truffle/hdwallet-provider";

//const HDWalletProvider = require("truffle-hdwallet-provider");
const infuraApikey = "9542ce9f96be4ae08225dcde36ff1638";

i//mport { artifacts } from "truffle";

import { scripts, ConfigManager } from "@openzeppelin/cli"

//const { scripts, ConfigManager } = require("@openzeppelin/cli");
const { add, push, create, call } = scripts;

const UnicoinRegistry = artifacts.require("UnicoinRegistry");
const daiContractMock = artifacts.require("ERC20Mock");

async function deploy(options, daiContractAddress) {
  // Register contract versions with openzeppelin
  add({
    contractsData: [
      {
        name: "UnicoinRegistry",
        alias: "UnicoinRegistry",
      },
      {
        name: "AuctionManager",
        alias: "AuctionManager",
      },
      {
        name: "HarbergerTaxManager",
        alias: "HarbergerTaxManager",
      },
      {
        name: "PublicationManager",
        alias: "PublicationManager",
      },
      {
        name: "UserManager",
        alias: "UserManager",
      },
      {
        name: "Vault",
        alias: "Vault",
      },
      {
        name: "LicenceManager",
        alias: "LicenceManager",
      },
    ],
  });

  // deploys your project
  console.log("pushing UnicoinRegistry settings");
  await push(options);
  console.log("Deploying UnicoinRegistry");

  //create contract instances and init upgradable contracts
  let unicoinRegistry = await create(
    Object.assign(
      {
        contractAlias: "UnicoinRegistry",
      },
      options
    )
  );

  console.log("Deploying AuctionManager");
  let auctionManager = await create(
    Object.assign(
      {
        contractAlias: "AuctionManager",
        methodName: "initialize",
        methodArgs: [unicoinRegistry.address],
      },
      options
    )
  );

  console.log("Deploying HarbergerTaxManager");
  let harbergerTaxManager = await create(
    Object.assign(
      {
        contractAlias: "HarbergerTaxManager",
        methodName: "initialize",
        methodArgs: [unicoinRegistry.address],
      },
      options
    )
  );

  console.log("Deploying PublicationManager");
  let publicationManager = await create(
    Object.assign(
      {
        contractAlias: "PublicationManager",
        methodName: "initialize",
        methodArgs: [unicoinRegistry.address],
      },
      options
    )
  );

  console.log("Deploying UserManager");
  let userManager = await create(
    Object.assign(
      {
        contractAlias: "UserManager",
        methodName: "initialize",
        methodArgs: [unicoinRegistry.address],
      },
      options
    )
  );

  console.log("Deploying Vault");
  let vault = await create(
    Object.assign(
      {
        contractAlias: "Vault",
        methodName: "initialize",
        methodArgs: [daiContractAddress, unicoinRegistry.address],
      },
      options
    )
  );

  console.log("Deploying LicenceManager");
  let licenceManager = await create(
    Object.assign(
      {
        contractAlias: "LicenceManager",
        methodName: "initialize",
        methodArgs: ["UniCoin NFT Licence", "UNI", unicoinRegistry.address],
      },
      options
    )
  );

  console.log("Initing UnicoinRegistry");
  const unicoinRegistryInstance = await UnicoinRegistry.at(unicoinRegistry.address);
  await unicoinRegistryInstance.initialize(
    auctionManager.address,
    licenceManager.address,
    publicationManager.address,
    userManager.address,
    harbergerTaxManager.address,
    vault.address
  );
}

module.exports = function (deployer, networkName, accounts) {
  deployer.then(async () => {
    if (networkName === "test") {
      //we dont want to run migrations when running unit tests
      console.log("Running in test network! migrations skipped");
      // unicoinRegistry = await deployer.deploy(UnicoinRegistry);
      return;
    }

    let account = accounts[0];
    let daiContractAddress;
    if (networkName === "kovan" || networkName === "kovan-fork") {
      daiContractAddress = "0xc4375b7de8af5a38a93548eb8453a498222c4ff2";
      account = new HDWalletProvider(
        require("../mnemonic.js"),
        `https://${networkName}.infura.io/v3/${infuraApikey}`,
        0
      ).getAddress();
    }

    if (networkName === "live" || networkName === "live-fork") {
      daiContractAddress = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";
      account = new HDWalletProvider(
        require("../mnemonic_live.js"),
        `https://mainnet.infura.io/v3/${infuraApikey}`,
        0
      ).getAddress();
    }

    if (networkName === "development" || networkName === "live-fork") {
      console.log("Running in development network! deploying mock Dai contract");
      daiContract = await deployer.deploy(daiContractMock);
      daiContractAddress = daiContract.address;
      daiContract.mint(account, "100000000000000000000000");
    }

    if (networkName != "kovan" && networkName != "live" && networkName != "development") {
      console.log("Invalid network selected");
    }

    const { network, txParams } = await ConfigManager.initNetworkConfiguration({
      network: networkName,
      from: account,
    });

    await deploy(
      {
        network,
        txParams,
      },
      daiContractAddress
    );
  });
};
