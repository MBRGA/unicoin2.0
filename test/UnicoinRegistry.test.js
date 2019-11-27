// Import all required modules from openzeppelin-test-helpers
const {
    BN,
    constants,
    expectEvent,
    expectRevert,
    ether
} = require("@openzeppelin/test-helpers");
const {
    expect
} = require("chai");

const BigNumber = require('bignumber.js');

let Decimal = require("decimal.js");
Decimal.set({
    precision: 100,
    rounding: Decimal.ROUND_DOWN
});

// UniCoin Contracts
const UnicoinRegistry = artifacts.require("./UnicoinRegistry.sol");
const AuctionManager = artifacts.require("./AuctionManager.sol")
const LicenceManager = artifacts.require("./LicenceManager.sol")
const PublicationManager = artifacts.require("./PublicationManager.sol")
const UserManager = artifacts.require("./UserManager.sol")
const Vault = artifacts.require("./Vault.sol")

// Mock Contracts
const Erc20Mock = artifacts.require("./Mocks/ERC20Mock.sol");

contract("Unicoin Registry", (accounts) => {
    const registryOwner = accounts[0]
    const tokenOwner = accounts[1]
    const publisher = accounts[2]
    const bidder1 = accounts[3]
    const bidder2 = accounts[4]
    const randomAddress = accounts[5]

    const exampleUserProfileURI = "QmeWUs9YdymQVpsme3MLQdWFW5GjdM4XDFYMi3YJvUFiaq"
    const examplePublicationURI = "QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph"

    before(async function () {
        daiContract = await Erc20Mock.new({
            from: tokenOwner
        });

        // Mints tokens in a modified ERC20 for the fund
        await daiContract.mint(tokenOwner, 10000, {
            from: tokenOwner
        });

        let balance = await daiContract.balanceOf(tokenOwner);
        assert.equal(balance.toNumber(), 10000, "Balance not set");

        unicoinRegistry = await UnicoinRegistry.new({
            from: registryOwner
        })
        auctionManager = await AuctionManager.new({
            from: registryOwner
        })
        await auctionManager.initialize(unicoinRegistry.address, {
            from: registryOwner
        })
        licenceManager = await LicenceManager.new({
            from: registryOwner
        })
        licenceManager.initialize("Unicoin NFT Licence",
            "NFT",
            unicoinRegistry.address, {
                from: registryOwner
            })
        publicationManager = await PublicationManager.new({
            from: registryOwner
        })
        publicationManager.initialize(unicoinRegistry.address, {
            from: registryOwner
        })
        userManager = await UserManager.new({
            from: registryOwner
        })
        userManager.initialize(unicoinRegistry.address, {
            from: registryOwner
        })
        vault = await Vault.new({
            from: registryOwner
        })
        await vault.initialize(daiContract.address,
            unicoinRegistry.address, {
                from: registryOwner
            })




    });

    beforeEach(async function () {

    })
    // Tests correct registration of users
    context("Contract setup", function () {
        it("Can register a new user", async () => {

        });
        it("Reverts if invalid user added", async () => {

        });
    })

})