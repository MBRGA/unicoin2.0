import { ethers, upgrades, network } from "hardhat";
import * as dotenv from "dotenv";

const networkName = network.name;
const chainId = network.config.chainId;

dotenv.config();

async function main() {

  console.log(`Deploying to network ${networkName}`);

  let daiContractAddress, forwarder;

  if (networkName === "goerli") {
    (daiContractAddress = process.env.GOERLI_NETWORK_DAI_TOKEN_ADDRESS), (forwarder = process.env.GOERLI_FORWARDER);
  } else if (networkName === "kovan") {
    (daiContractAddress = process.env.KOVAN_NETWORK_DAI_TOKEN_ADDRESS), (forwarder = process.env.KOVAN_FORWARDER);
  } else if (networkName === "mainnet") {
    (daiContractAddress = process.env.MAINNET_NETWORK_DAI_TOKEN_ADDRESS), (forwarder = process.env.MAINNET_FORWARDER);
  } else {
    console.error(`Bad network name: ${networkName}`);
    return null;
  }

  const UnicoinRegistry = await ethers.getContractFactory("UnicoinRegistry");
  const registry = await upgrades.deployProxy(UnicoinRegistry, [], {
    initializer: false,
  });

  const AuctionManager = await ethers.getContractFactory("AuctionManager");
  const auctionManager = await upgrades.deployProxy(AuctionManager, [], {
    constructorArgs: [registry.address, forwarder],
  });

  const HarbergerTaxManager = await ethers.getContractFactory("HarbergerTaxManager");
  const harbergerTaxManager = await upgrades.deployProxy(HarbergerTaxManager, [], {
    constructorArgs: [registry.address, forwarder],
  });

  const PublicationManager = await ethers.getContractFactory("PublicationManager");
  const publicationManager = await upgrades.deployProxy(PublicationManager, [], {
    constructorArgs: [registry.address, forwarder],
  });

  const UserManager = await ethers.getContractFactory("UserManager");
  const userManager = await upgrades.deployProxy(UserManager, [], {
    constructorArgs: [registry.address, forwarder],
  });

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await upgrades.deployProxy(Vault, [daiContractAddress], {
    constructorArgs: [registry.address, forwarder],
  });

  const LicenceManager = await ethers.getContractFactory("LicenceManager");
  const licenceManager = await upgrades.deployProxy(LicenceManager, ["Unicoin NFT Licence", "UNI"], {
    constructorArgs: [registry.address, forwarder],
  });

  const initRegistryTx = await registry.initialize(
    auctionManager.address,
    licenceManager.address,
    publicationManager.address,
    userManager.address,
    harbergerTaxManager.address,
    vault.address
  );

  console.log(`UnicoinRegistry deployed to ${registry.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
