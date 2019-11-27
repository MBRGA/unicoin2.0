// Import all required modules from openzeppelin-test-helpers


const {
    BN,
    constants,
    expectEvent,
    expectRevert,
    ether,
    time
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
    //test accounts
    const registryOwner = accounts[0]
    const tokenOwner = accounts[1]
    const publisher = accounts[2]
    const bidder1 = accounts[3]
    const bidder2 = accounts[4]
    const contributor1 = accounts[5]
    const contributor2 = accounts[6]
    const randomAddress = accounts[7]

    //constants
    const exampleUserProfileURI = "QmeWUs9YdymQVpsme3MLQdWFW5GjdM4XDFYMi3YJvUFiaq"
    const examplePublicationURI = "QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph"

    const samplePublication = {
        _publication_uri: examplePublicationURI,
        _pricing_Strategy: 1,
        _auctionFloor: 100,
        _auctionStartTime: +parseInt(new Date() / 1000) + 300,
        _auctionDuration: 100,
        _fixed_sell_price: 0,
        _maxNumberOfLicences: 1,
        _contributors: [contributor1, contributor2],
        _contributors_weightings: ["5", "10"],
    }
    console.log("time", +new Date())
    const sealedBid = {
        bidAmount: 1000,
        salt: 12345,
        bidHash: web3.utils.keccak256("1000" + "12345")
    }

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
        await unicoinRegistry.initialize(auctionManager.address,
            licenceManager.address,
            publicationManager.address,
            userManager.address,
            vault.address, {
                from: registryOwner
            })
    });

    beforeEach(async function () {

    })
    // Tests correct registration of users
    context("User Management 💁‍♂️", function () {
        it("Reverts if invalid user input", async () => {
            await expectRevert.unspecified(unicoinRegistry.registerUser("", {
                from: publisher
            }))
        });
        it("Can add new user", async () => {
            await unicoinRegistry.registerUser(exampleUserProfileURI, {
                from: publisher
            })
            await unicoinRegistry.registerUser(exampleUserProfileURI, {
                from: bidder1
            })
            await unicoinRegistry.registerUser(exampleUserProfileURI, {
                from: bidder2
            })
        });
        it("Revert if user already added", async () => {
            await expectRevert.unspecified(unicoinRegistry.registerUser(exampleUserProfileURI, {
                from: publisher
            }))
        });
        it("Can retrieve user profile information", async () => {
            let isAddressRegistered = await unicoinRegistry.isCallerRegistered.call({
                from: publisher
            })
            assert.equal(isAddressRegistered, true, "User should be registered")

            isAddressRegistered = await unicoinRegistry.isCallerRegistered.call({
                from: randomAddress
            })
            assert.equal(isAddressRegistered, false, "User should not be registered")

            let publisherCallerId = await unicoinRegistry.getCallerId({
                from: bidder1
            })
            assert.equal(publisherCallerId.toNumber(), 2, "Publisher Id not set correctly")

            let returnedPublisherAddress = await unicoinRegistry.getUserAddress(2)
            assert.equal(returnedPublisherAddress, bidder1, "Publisher address increctly returned")
        })
    })
    context("Publication Management ‍📚", function () {
        it("Can create a valid publication", async () => {
            await unicoinRegistry.createPublication(
                samplePublication._pricing_Strategy,
                samplePublication._publication_uri,
                samplePublication._auctionFloor,
                samplePublication._auctionStartTime,
                samplePublication._auctionDuration,
                samplePublication._fixed_sell_price,
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: publisher
                }
            );
        })
        it("Reverts if invalid Publication: input non-registered user", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication._pricing_Strategy,
                samplePublication._publication_uri,
                samplePublication._auctionFloor,
                samplePublication._auctionStartTime,
                samplePublication._auctionDuration,
                samplePublication._fixed_sell_price,
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid Publication: input URI too short", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication._pricing_Strategy,
                "",
                samplePublication._auctionFloor,
                samplePublication._auctionStartTime,
                samplePublication._auctionDuration,
                samplePublication._fixed_sell_price,
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid Publication: invalid Fixed price call", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                1, //price stratergy 1 = fixed price
                samplePublication._publication_uri,
                samplePublication._auctionFloor,
                samplePublication._auctionStartTime,
                samplePublication._auctionDuration,
                0, //fixed price should not be zero in this case
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid Publication: invalid auction call (auction should not have fixed price)", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                0, //auction stratergy 1 = fixed price
                samplePublication._publication_uri,
                samplePublication._auctionFloor,
                samplePublication._auctionStartTime,
                samplePublication._auctionDuration,
                10, //auction should have a fixed price of zero
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid Publication: invalid start time", async () => {
            await time.increase(200)
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication._pricing_Strategy,
                samplePublication._publication_uri,
                samplePublication._auctionFloor,
                20, //start time less than the spesified auction time
                samplePublication._fixed_sell_price,
                samplePublication._auctionDuration,
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: randomAddress
                }
            ))
            //advance time to catch up with the starting increase
            samplePublication._auctionStartTime += 200
        })
        it("Reverts if invalid Publication: invalid duration time", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication._pricing_Strategy,
                samplePublication._publication_uri,
                samplePublication._auctionFloor,
                samplePublication._auctionStartTime,
                0, //auction duration cant be zero
                samplePublication._fixed_sell_price,
                samplePublication._maxNumberOfLicences,
                samplePublication._contributors,
                samplePublication._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Correctly get publication length", async () => {
            let numberOfPublications = await unicoinRegistry.getPublicationLength()
            console.log("length", numberOfPublications.toNumber())
            assert.equal(numberOfPublications, 1, "Incorrect number of publications")
        })

        it("Correctly getPublication auctions", async () => {
            let publicationAuctions = await unicoinRegistry.getPublicationAuctions.call(0)
            console.log(publicationAuctions)
        })

        it("Correctly get publication information", async () => {
            let publication = await unicoinRegistry.getPublication.call(0)
            console.log(publication)
            assert.equal(publication[0].toNumber(), samplePublication._pricing_Strategy, "Incorrectly set _pricing_Strategy")
            assert.equal(publication[1], samplePublication._publication_uri, "Incorrectly set _publication_uri")
            assert.equal(publication[2].toNumber(), 1, "Incorrectly set author_id")
            assert.equal(publication[3].toNumber(), samplePublication._fixed_sell_price, "Incorrectly set sell_price")
            assert.equal(publication[4].toNumber(), samplePublication._maxNumberOfLicences, "Incorrectly set maxNumberOfLicences")
            assert.equal(publication[5].toNumber(), 0, "Incorrectly set licencesIssued")
            assert.equal(publication[6], [], "Incorrectly set auction_ids") //this is wrong. should be a 1 in here from the auction
            assert.equal(publication[7][0], samplePublication._contributors[0], "Incorrectly set _contributors")
            assert.equal(publication[7][1], samplePublication._contributors[1], "Incorrectly set _contributors")
            assert.equal(publication[8][0], samplePublication._contributors_weightings[0], "Incorrectly set _contributors_weightings")
            assert.equal(publication[8][1], samplePublication._contributors_weightings[1], "Incorrectly set _contributors_weightings")
        })
    })
    context("Auction Bidding 🧾", function () {
        it("Reverts if invalid bid time", async () => {
            //this is before the auction has started. current time is now() +200
            //and auction starts at now +300
            // await expectRevert.unspecified(
            unicoinRegistry.commitSealedBid(sealedBid.bidHash, 0, {
                from: bidder1
            })
            // )
        })

        it("Place bid in auction", async () => {
            unicoinRegistry.commitSealedBid(sealedBid.bidHash, 0, {
                from: bidder1
            })
        })
    })
})