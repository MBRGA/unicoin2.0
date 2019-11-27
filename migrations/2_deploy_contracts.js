const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = '9542ce9f96be4ae08225dcde36ff1638';

const {
    scripts,
    ConfigManager
} = require('@openzeppelin/cli');
const {
    add,
    push,
    create
} = scripts;

var daiContractMock = artifacts.require("ERC20Mock")

async function deploy(options, daiContractAddress) {
    // Register contract versions with openzeplin
    add({
        contractsData: [{
                name: 'UnicoinRegistry',
                alias: 'UnicoinRegistry'
            },
            {
                name: 'AuctionManager',
                alias: 'AuctionManager'
            },
            {
                name: 'PublicationManager',
                alias: 'PublicationManager'
            },
            {
                name: 'UserManager',
                alias: 'UserManager'
            },
            {
                name: 'Vault',
                alias: 'Vault'
            },
            {
                name: 'LicenceManager',
                alias: 'LicenceManager'
            }
        ]
    });

    // deploys your project
    await push(options);
    console.log("Deploying UnicoinRegistry")

    //create contract instances and init upgradable contracts
    let unicoinRegistry = await create(Object.assign({
        contractAlias: 'UnicoinRegistry'
    }, options));

    console.log("Deploying AuctionManager")
    let auctionManager = await create(Object.assign({
        contractAlias: 'AuctionManager',
        methodName: 'initialize',
        methodArgs: [unicoinRegistry.address]
    }, options));

    console.log("Deploying PublicationManager")
    let publicationManager = await create(Object.assign({
        contractAlias: 'PublicationManager',
        methodName: 'initialize',
        methodArgs: [unicoinRegistry.address]
    }, options));

    console.log("Deploying UserManager")
    let userManager = await create(Object.assign({
        contractAlias: 'UserManager',
        methodName: 'initialize',
        methodArgs: [unicoinRegistry.address]
    }, options));

    console.log("Deploying Vault")
    let vault = await create(Object.assign({
        contractAlias: 'Vault',
        methodName: 'initialize',
        methodArgs: [daiContractAddress, unicoinRegistry.address]
    }, options));

    console.log("Deploying LicenceManager")
    let licenceManager = await create(Object.assign({
        contractAlias: 'LicenceManager',
        methodName: 'initialize',
        methodArgs: ["UniCoin NFT Licence", "UNI", unicoinRegistry.address]
    }, options));

    console.log("Initing UnicoinRegistry")
    let unicoinRegistryInit = await call(Object.assign({
        contractAlias: 'UnicoinRegistry',
        methodName: 'initialize',
        methodArgs: [auctionManager.address,
            licenceManager.address,
            publicationManager.address,
            userManager.address,
            vault.address
        ]
    }, options));
}

module.exports = function (deployer, networkName, accounts) {
    deployer.then(async () => {
        let account = accounts[0];
        const {
            network,
            txParams
        } = await ConfigManager.initNetworkConfiguration({
            network: networkName,
            from: account
        })

        let daiContractAddress
        if (networkName === 'kovan' || networkName === 'kovan-fork') {
            daiContractAddress = '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
            account = new HDWalletProvider(require('../mnemonic.js'), `https://${networkName}.infura.io/v3/${infuraApikey}`, 0).getAddress();
        }

        if (networkName === 'live' || networkName === 'live-fork') {
            daiContractAddress = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'
            account = new HDWalletProvider(require('../mnemonic_live.js'), `https://mainnet.infura.io/v3/${infuraApikey}`, 0).getAddress();
        }

        if (networkName === 'development' || networkName === 'live-fork') {
            console.log("Running in development network! deploying mock Dai contract")
            daiContract = await deployer.deploy(daiContractMock);
            daiContractAddress = daiContract.address
            daiContract.mint(account, "100000000000000000000000")
        }

        if (networkName != 'kovan' && networkName != 'live' && networkName != 'development') {
            console.log("Invalid network selected")
        }
        await deploy({
            network,
            txParams
        }, daiContractAddress)
    })
}