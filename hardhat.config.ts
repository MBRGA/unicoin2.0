import * as dotenv from "dotenv";

import { HardhatUserConfig, subtask, task, types } from "hardhat/config";
import { GsnTestEnvironment } from "@opengsn/dev";
//import { ethers, upgrades } from "hardhat";

//import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

task("deploy", "Deploys Unicoin Contracts").setAction(async (taskArgs, hre) => {
  console.log(`Deploying to network ${hre.network.name}`);

  let daiContractAddress, forwarder;

  if (hre.network.name === "goerli") {
    (daiContractAddress = process.env.GOERLI_NETWORK_DAI_TOKEN_ADDRESS), (forwarder = process.env.GOERLI_FORWARDER);
  } else if (hre.network.name === "kovan") {
    (daiContractAddress = process.env.KOVAN_NETWORK_DAI_TOKEN_ADDRESS), (forwarder = process.env.KOVAN_FORWARDER);
  } else if (hre.network.name === "mainnet") {
    (daiContractAddress = process.env.MAINNET_NETWORK_DAI_TOKEN_ADDRESS), (forwarder = process.env.MAINNET_FORWARDER);
  } else {
    GsnTestEnvironment.startGsn("localhost");

    const { paymasterAddress, forwarderAddress } = GsnTestEnvironment.loadDeployment();

    forwarder = forwarderAddress;

    const ERC20Mock = await hre.ethers.getContractFactory("ERC20Mock");
    const daiContract = await ERC20Mock.deploy([100000000000000000000000]);
    (daiContractAddress = daiContract.address), (forwarder = "");
    //console.error(`Bad network name: ${hre.network.name}`);
    //return null;
  }

  const UnicoinRegistry = await hre.ethers.getContractFactory("UnicoinRegistry");
  const registry = await hre.upgrades.deployProxy(UnicoinRegistry, [], {
    initializer: false,
  });

  await registry.deployed();

  const auctionManagerAddress = hre.run("deploy-auction-manager", {
    registry,
    forwarder,
  });
  console.log(`AuctionManager deployed at ${auctionManagerAddress}`);

  const harbergerTaxManagerAddress = hre.run("deploy-harbergertax-manager", {
    registry,
    forwarder,
  });
  console.log(`HarbergerTaxManager deployed at ${harbergerTaxManagerAddress}`);

  const publicationManagerAddress = hre.run("deploy-publication-manager", {
    registry,
    forwarder,
  });
  console.log(`PublicationManager deployed at ${publicationManagerAddress}`);

  const userManagerAddress = hre.run("deploy-user-manager", {
    registry,
    forwarder,
  });
  console.log(`UserManager deployed at ${userManagerAddress}`);

  const vaultAddress = hre.run("deploy-vault", {
    registry,
    forwarder,
    daiContractAddress,
  });
  console.log(`Vault deployed at ${vaultAddress}`);

  const licenceManagerAddress = hre.run("deploy-licence-manager", {
    registry,
    forwarder,
  });
  console.log(`LicenceManager deployed at ${licenceManagerAddress}`);

  const initRegistryTx = await registry.initialize(
    auctionManagerAddress,
    licenceManagerAddress,
    publicationManagerAddress,
    userManagerAddress,
    harbergerTaxManagerAddress,
    vaultAddress
  );

  console.log(`UnicoinRegistry deployed to ${registry.address}`);
});

task("deploy-auction-manager")
  .addParam("registry", "Address of deployed UnicoinRegistry contract")
  .addParam("forwarder", "GSN Trusted Forwarder")
  .setAction(async (taskArgs, hre) => {
    const AuctionManager = await hre.ethers.getContractFactory("AuctionManager");
    const auctionManager = await hre.upgrades.deployProxy(AuctionManager, [], {
      constructorArgs: [taskArgs.registry, taskArgs.forwarder],
    });
    await auctionManager.deployed();
    return auctionManager.address;
  });

task("deploy-harbergertax-manager")
  .addParam("registry", "Address of deployed UnicoinRegistry contract")
  .addParam("forwarder", "GSN Trusted Forwarder")
  .setAction(async (taskArgs, hre) => {
    const HarbergerTaxManager = await hre.ethers.getContractFactory("HarbergerTaxManager");
    const harbergerTaxManager = await hre.upgrades.deployProxy(HarbergerTaxManager, [], {
      constructorArgs: [taskArgs.registry, taskArgs.forwarder],
    });
    await harbergerTaxManager.deployed();
    return harbergerTaxManager.address;
  });

task("deploy-publication-manager")
  .addParam("registry", "Address of deployed UnicoinRegistry contract")
  .addParam("forwarder", "GSN Trusted Forwarder")
  .setAction(async (taskArgs, hre) => {
    const PublicationManager = await hre.ethers.getContractFactory("PublicationManager");
    const publicationManager = await hre.upgrades.deployProxy(PublicationManager, [], {
      constructorArgs: [taskArgs.registry, taskArgs.forwarder],
    });
    await publicationManager.deployed();
    return publicationManager.address;
  });

task("deploy-user-manager")
  .addParam("registry", "Address of deployed UnicoinRegistry contract")
  .addParam("forwarder", "GSN Trusted Forwarder")
  .setAction(async (taskArgs, hre) => {
    const UserManager = await hre.ethers.getContractFactory("UserManager");
    const userManager = await hre.upgrades.deployProxy(UserManager, [], {
      constructorArgs: [taskArgs.registry, taskArgs.forwarder],
    });
    await userManager.deployed();
    return userManager.address;
  });

task("deploy-vault")
  .addParam("registry", "Address of deployed UnicoinRegistry contract")
  .addParam("forwarder", "GSN Trusted Forwarder")
  .addParam("daiAddress", "DAI Address on network")
  .setAction(async (taskArgs, hre) => {
    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await hre.upgrades.deployProxy(Vault, [taskArgs.dai_address], {
      constructorArgs: [taskArgs.registry, taskArgs.forwarder],
    });
    await vault.deployed();
    return vault.address;
  });

task("deploy-licence-manager")
  .addParam("registry", "Address of deployed UnicoinRegistry contract")
  .addParam("forwarder", "GSN Trusted Forwarder")
  .setAction(async (taskArgs, hre) => {
    const LicenceManager = await hre.ethers.getContractFactory("LicenceManager");
    const licenceManager = await hre.upgrades.deployProxy(LicenceManager, ["Unicoin NFT Licence", "UNI"], {
      constructorArgs: [taskArgs.registry, taskArgs.forwarder],
    });
    await licenceManager.deployed();
    return licenceManager.address;
  });

subtask("tree", "whoop")
  .addParam("test", "test param", 1, types.int)
  .setAction(async (taskArgs) => {
    return taskArgs.test + 1;
  });

task("moop", "meep").setAction(async (taskArgs, hre) => {
  console.log("bloop");
  const tval = await hre.run("tree", { test: 3 });
  console.log(tval);
  return "blee";
});

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
