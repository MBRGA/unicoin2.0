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
const HarbergerTaxManager = artifacts.require("./HarbergerTaxManager.sol")
const Vault = artifacts.require("./Vault.sol")

// Mock Contracts
const Erc20Mock = artifacts.require("./Mocks/ERC20Mock.sol");

contract("Unicoin Registry Full system test 🧪🔬", (accounts) => {
    //test accounts. The account number for publisher through contributor
    //will corespond to their account number in the UniCoin system when
    //they are registered. For example publisher will be account 1
    //and contributor1 will be account 4
    const registryOwner = accounts[0]
    const publisher = accounts[1]
    const bidder1 = accounts[2]
    const bidder2 = accounts[3]
    const contributor1 = accounts[4]
    const contributor2 = accounts[5]
    const randomAddress = accounts[6]
    const tokenOwner = accounts[8]
    //constants
    const exampleUserProfileURI = "QmeWUs9YdymQVpsme3MLQdWFW5GjdM4XDFYMi3YJvUFiaq"
    const examplePublicationURI1 = "QmPF7eAtGoaEgSAt9XCP2DuWfc8sbtQfraffDsx3svu4Ph"
    const examplePublicationURI2 = "QmQjkpEFWEWQz4KxUmG8U3hrJe5KmCTyWCVVXAjcQJST2N"

    const samplePublication_FixedRate = {
        _publication_uri: examplePublicationURI1,
        _pricing_Strategy: 1,
        _auctionFloor: 0,
        _auctionStartTime: 0,
        _auctionDuration: 0,
        _fixed_sell_price: 200,
        _maxNumberOfLicences: 5,
        _contributors: ["4", "5"], //contributors are the contributor user_Id.
        _contributors_weightings: [5, 10],
    }

    const samplePublication_PrivateAuction = {
        _publication_uri: examplePublicationURI2,
        _pricing_Strategy: 0,
        _auctionFloor: 100,
        _auctionStartTime: +parseInt(new Date() / 1000) + 100,
        _auctionDuration: 100,
        _fixed_sell_price: 0,
        _maxNumberOfLicences: 1,
        _contributors: ["4", "5"],
        _contributors_weightings: [5, 10],
    }
    const sealedBid1 = {
        bidAmount: 1000,
        salt: 12345,
        bidHash: web3.utils.soliditySha3(1000, 12345)
    }

    const sealedBid2 = {
        bidAmount: 1200,
        salt: 67890,
        bidHash: web3.utils.soliditySha3(1200, 67890)
    }

    const sealedBid3 = {
        bidAmount: 1250,
        salt: 13579,
        bidHash: web3.utils.soliditySha3(1250, 13579)
    }

    const startingHarbergerTaxPerBlock = parseInt((0.04 / (4 * 60 * 24 * 365)) * 10 ** 18)

    const oneMonthSeconds = 60 * 60 * 24 * 30

    before(async function () {
        daiContract = await Erc20Mock.new({
            from: tokenOwner
        });

        // Mints tokens in a modified ERC20 for the two bidders
        await daiContract.mint(bidder1, 100000, {
            from: tokenOwner
        });

        await daiContract.mint(bidder2, 100000, {
            from: tokenOwner
        });

        unicoinRegistry = await UnicoinRegistry.new()

        auctionManager = await AuctionManager.new()
        await auctionManager.initialize(unicoinRegistry.address, )

        licenceManager = await LicenceManager.new()
        licenceManager.initialize("Unicoin NFT Licence",
            "NFT",
            unicoinRegistry.address)

        publicationManager = await PublicationManager.new()
        publicationManager.initialize(unicoinRegistry.address, )

        userManager = await UserManager.new()
        userManager.initialize(unicoinRegistry.address, )

        harbergerTaxManager = await HarbergerTaxManager.new()
        await harbergerTaxManager.initialize(unicoinRegistry.address)

        vault = await Vault.new()
        await vault.initialize(daiContract.address,
            unicoinRegistry.address)

        await unicoinRegistry.initialize(auctionManager.address,
            licenceManager.address,
            publicationManager.address,
            userManager.address,
            harbergerTaxManager.address, vault.address)

        //approve the vault to spend the bidders dai
        await daiContract.approve(vault.address, 100000, {
            from: bidder1
        })
        await daiContract.approve(vault.address, 100000, {
            from: bidder2
        })
    });

    beforeEach(async function () {
        //before each test take the current blockchain time and set the auction 
        //to start 100 seconds later. This sets each test up in a consistent way
        contractTime = await unicoinRegistry.getBlockTime.call()
        samplePublication_PrivateAuction._auctionStartTime = contractTime.toNumber() + 100

        //if sales have been added on chain then we need to increment the auction
        //start time ti accomidate this
        let numberOfPublications = await unicoinRegistry.getPublicationLength()
        if (numberOfPublications.toNumber() >= 2) {
            await unicoinRegistry.updateAuctionStartTime(1, samplePublication_PrivateAuction._auctionStartTime, {
                from: publisher
            })
        }
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
            await unicoinRegistry.registerUser(exampleUserProfileURI, {
                from: contributor1
            })
            await unicoinRegistry.registerUser(exampleUserProfileURI, {
                from: contributor2
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

            let bidder1CallerId = await unicoinRegistry.getCallerId({
                from: bidder1
            })
            assert.equal(bidder1CallerId.toNumber(), 2, "bidder1 Id not set correctly")

            let returnedBidder1Address = await unicoinRegistry.getUserAddress(2)
            assert.equal(returnedBidder1Address, bidder1, "bidder1 address increctly returned")
        })
    })
    context("Publication Management: Creation ‍📚", function () {
        it("Can create a valid publication: FixedRate", async () => {
            await unicoinRegistry.createPublication(
                samplePublication_FixedRate._pricing_Strategy,
                samplePublication_FixedRate._publication_uri,
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                samplePublication_FixedRate._auctionDuration,
                samplePublication_FixedRate._fixed_sell_price,
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: publisher
                }
            );
        })
        it("Can create a valid publication: Private Auction", async () => {
            await unicoinRegistry.createPublication(
                samplePublication_PrivateAuction._pricing_Strategy,
                samplePublication_PrivateAuction._publication_uri,
                samplePublication_PrivateAuction._auctionFloor,
                samplePublication_PrivateAuction._auctionStartTime,
                samplePublication_PrivateAuction._auctionDuration,
                samplePublication_PrivateAuction._fixed_sell_price,
                samplePublication_PrivateAuction._maxNumberOfLicences,
                samplePublication_PrivateAuction._contributors,
                samplePublication_PrivateAuction._contributors_weightings, {
                    from: publisher
                }
            );
        })
    })
    context("Publication Management: Reject on negative input 🙅‍♂️‍", function () {
        it("Reverts if invalid publication: input non-registered user", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_FixedRate._pricing_Strategy,
                samplePublication_FixedRate._publication_uri,
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                samplePublication_FixedRate._auctionDuration,
                samplePublication_FixedRate._fixed_sell_price,
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid publication: input URI too short", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_FixedRate._pricing_Strategy,
                "",
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                samplePublication_FixedRate._auctionDuration,
                samplePublication_FixedRate._fixed_sell_price,
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: publisher
                }
            ))
        })
        it("Reverts if invalid publication: invalid Fixed price call", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_FixedRate._pricing_Strategy,
                samplePublication_FixedRate._publication_uri,
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                samplePublication_FixedRate._auctionDuration,
                0, //fixed price should not be zero in this case
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: publisher
                }
            ))
        })
        it("Reverts if invalid publication: invalid auction call (auction should not have fixed price)", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_PrivateAuction._pricing_Strategy,
                samplePublication_FixedRate._publication_uri,
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                samplePublication_FixedRate._auctionDuration,
                samplePublication_FixedRate._fixed_sell_price,
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: publisher
                }
            ))
        })
        it("Reverts if invalid publication(auction): invalid start time", async () => {
            await time.increase(200) //current time is now ahead of the start time
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_PrivateAuction._pricing_Strategy,
                samplePublication_PrivateAuction._publication_uri,
                samplePublication_PrivateAuction._auctionFloor,
                samplePublication_PrivateAuction._auctionStartTime,
                samplePublication_PrivateAuction._fixed_sell_price,
                samplePublication_PrivateAuction._auctionDuration,
                samplePublication_PrivateAuction._maxNumberOfLicences,
                samplePublication_PrivateAuction._contributors,
                samplePublication_PrivateAuction._contributors_weightings, {
                    from: publisher
                }
            ))
        })
        it("Reverts if invalid publication(auction): invalid duration time", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_PrivateAuction._pricing_Strategy,
                samplePublication_PrivateAuction._publication_uri,
                samplePublication_PrivateAuction._auctionFloor,
                samplePublication_PrivateAuction._auctionStartTime,
                0, //auction duration cant be zero
                samplePublication_PrivateAuction._fixed_sell_price,
                samplePublication_PrivateAuction._maxNumberOfLicences,
                samplePublication_PrivateAuction._contributors,
                samplePublication_PrivateAuction._contributors_weightings, {
                    from: publisher
                }
            ))
        })
    })
    context("Publication Management: retrieve publication information 🔎", function () {
        it("Correctly get publication length", async () => {
            let numberOfPublications = await unicoinRegistry.getPublicationLength()
            assert.equal(numberOfPublications, 2, "Incorrect number of publications")
        })

        it("Correctly getPublication auctions", async () => {
            let fixedRateAuctions = await unicoinRegistry.getPublicationAuctions.call(0)

            //fixed rate should not have an auction so undefined
            assert.equal(fixedRateAuctions[0], undefined, "fixed rate auction not set correcly")

            let PrivateAuctionAuctions = await unicoinRegistry.getPublicationAuctions.call(1)
            //private auction should have created an auction 0 for this sale
            assert.equal(PrivateAuctionAuctions[0], 0, "fixed rate auction not set correcly")

        })

        it("Correctly get publication information", async () => {
            let fixedRatePublication = await unicoinRegistry.getPublication.call(0)
            assert.equal(fixedRatePublication[0].toNumber(), samplePublication_FixedRate._pricing_Strategy, "Incorrectly set _pricing_Strategy for fixed sale")
            assert.equal(fixedRatePublication[1], samplePublication_FixedRate._publication_uri, "Incorrectly set _publication_uri for fixed sale")
            assert.equal(fixedRatePublication[2].toNumber(), 1, "Incorrectly set author_id for fixed sale")
            assert.equal(fixedRatePublication[3].toNumber(), samplePublication_FixedRate._fixed_sell_price, "Incorrectly set sell_price for fixed sale")
            assert.equal(fixedRatePublication[4].toNumber(), samplePublication_FixedRate._maxNumberOfLicences, "Incorrectly set maxNumberOfLicences for fixed sale")
            assert.equal(fixedRatePublication[5].toNumber(), 0, "Incorrectly set licencesIssued for fixed sale")
            assert.equal(fixedRatePublication[6][0], undefined, "Incorrectly set auction_ids for fixed sale")
            assert.equal(fixedRatePublication[7][0], samplePublication_FixedRate._contributors[0], "Incorrectly set _contributors for fixed sale")
            assert.equal(fixedRatePublication[7][1], samplePublication_FixedRate._contributors[1], "Incorrectly set _contributors for fixed sale")
            assert.equal(fixedRatePublication[8][0].toNumber(), samplePublication_FixedRate._contributors_weightings[0], "Incorrectly set _contributors_weightings for fixed sale")
            assert.equal(fixedRatePublication[8][1].toNumber(), samplePublication_FixedRate._contributors_weightings[1], "Incorrectly set _contributors_weightings for fixed sale")

            let auctionPublication = await unicoinRegistry.getPublication.call(1)
            assert.equal(auctionPublication[0].toNumber(), samplePublication_PrivateAuction._pricing_Strategy, "Incorrectly set _pricing_Strategy for auction")
            assert.equal(auctionPublication[1], samplePublication_PrivateAuction._publication_uri, "Incorrectly set _publication_uri for auction")
            assert.equal(auctionPublication[2].toNumber(), 1, "Incorrectly set author_id for auction")
            assert.equal(auctionPublication[3].toNumber(), samplePublication_PrivateAuction._fixed_sell_price, "Incorrectly set sell_price for auction")
            assert.equal(auctionPublication[4].toNumber(), samplePublication_PrivateAuction._maxNumberOfLicences, "Incorrectly set maxNumberOfLicences for auction")
            assert.equal(auctionPublication[5].toNumber(), 0, "Incorrectly set licencesIssued for auction")
            assert.equal(auctionPublication[6][0].toNumber(), 0, "Incorrectly set auction_ids for auction")
            assert.equal(auctionPublication[7][0], samplePublication_PrivateAuction._contributors[0], "Incorrectly set _contributors for auction")
            assert.equal(auctionPublication[7][1], samplePublication_PrivateAuction._contributors[1], "Incorrectly set _contributors for auction")
            assert.equal(auctionPublication[8][0].toNumber(), samplePublication_PrivateAuction._contributors_weightings[0], "Incorrectly set _contributors_weightings for auction")
            assert.equal(auctionPublication[8][1].toNumber(), samplePublication_PrivateAuction._contributors_weightings[1], "Incorrectly set _contributors_weightings for auction")
        })
    })
    context("Auction Bidding: Commit stage 🤝", function () {
        it("Reverts if invalid bid time", async () => {
            //this is before the auction has started. auction stats at now() + 100
            // and current time is now()
            await expectRevert.unspecified(
                unicoinRegistry.commitSealedBid(sealedBid1.bidHash, 0, {
                    from: bidder1
                })
            )
        })
        it("Auction Status set correctly", async () => {
            //current time is before the start of the auction
            let fetchedAuctionStatus = await unicoinRegistry.getAuctionStatus.call(0)

            assert.equal(fetchedAuctionStatus.toNumber(), 0, "Auction status not correctly set")

            //current time is now ahead of the start time
            await time.increase(150)
            fetchedAuctionStatus = await unicoinRegistry.getAuctionStatus.call(0)

            assert.equal(fetchedAuctionStatus.toNumber(), 1, "Auction status not correctly set")

            //set the time to after the auction. should be 2 for reveal
            await time.increase(100)
            fetchedAuctionStatus = await unicoinRegistry.getAuctionStatus.call(0)

            assert.equal(fetchedAuctionStatus.toNumber(), 2, "Auction status not correctly set")

        })

        it("Place bid in auction", async () => {
            //Create 3 bids: 2 from bidder1 and 1 from bidder2
            await time.increase(150) //set the time to an appropriate bidding window
            await unicoinRegistry.commitSealedBid(sealedBid1.bidHash, 1, {
                from: bidder1
            })

            await unicoinRegistry.commitSealedBid(sealedBid2.bidHash, 1, {
                from: bidder2
            })

            await unicoinRegistry.commitSealedBid(sealedBid3.bidHash, 1, {
                from: bidder1
            })
        })
    })
    context("Auction Bidding: retrieve bid information 🔎", function () {
        it("Can retrieve bids for publication", async () => {
            let publicationBidInformation = await unicoinRegistry.getPublicationBids(1)
            let counter = 0
            publicationBidInformation.map(function (bid) {
                assert.equal(bid.toNumber(), counter, "publication bids not correctly set")
                counter++
            })
        })

        it("Can retrieve bid Id information", async () => {
            let bidder1Id = await unicoinRegistry.getCallerId({
                from: bidder1
            })
            let bidder2Id = await unicoinRegistry.getCallerId({
                from: bidder2
            })
            let bidder1Bids = await unicoinRegistry.getBidderBids.call(bidder1Id)

            assert.equal(bidder1Bids[0].toNumber(), 0, "Bidder1's 1st bids not correctly set")
            assert.equal(bidder1Bids[1].toNumber(), 2, "Bidder1's 2nd bids not correctly set")

            let bidder2Bids = await unicoinRegistry.getBidderBids.call(bidder2Id)
            assert.equal(bidder2Bids[0].toNumber(), 1, "Bidder2's 1st bids not correctly set")
        })
        it("Can retrieve bider information", async () => {
            let bidder1Bids = await unicoinRegistry.getBids(bidder1)
            assert.equal(bidder1Bids[0].toNumber(), 0, "Bidder1's 1st bids not correctly set")
            assert.equal(bidder1Bids[1].toNumber(), 2, "Bidder1's 2nd bids not correctly set")
        })
        it("Can retrieve the number of publication auction bids", async () => {
            let numberOfBidsInAuction = await unicoinRegistry.getPublicationAuctionBidLength.call(1)
            assert.equal(numberOfBidsInAuction.toNumber(), 3, "Number of bids not correctly set")
        })

        it("Can retrieve bid information", async () => {
            let bidder1Id = await unicoinRegistry.getCallerId({
                from: bidder1
            })

            let bidder1Bid1 = await unicoinRegistry.getBid(0)
            assert.equal(bidder1Bid1[0], sealedBid1.bidHash, "Bid hash does not match")
            assert.equal(bidder1Bid1[1].toNumber(), 0, "revealed bid not correctly set")
            assert.equal(bidder1Bid1[2].toNumber(), 0, "salt not correctly set")
            assert.equal(bidder1Bid1[3].toNumber(), 0, "status not correctly set")
            assert.equal(bidder1Bid1[4].toNumber(), 1, "publication Id not correctly set")
            assert.equal(bidder1Bid1[5].toNumber(), 0, "auction Id Id not correctly set")
            assert.equal(bidder1Bid1[6].toNumber(), bidder1Id, "auction Id Id not correctly set")
        })
    })
    context("Auction Bidding: Reveal stage 💵", function () {
        it("Can correctly reveal bid", async () => {
            time.increase(250) //after the end of the auction

            await unicoinRegistry.revealSealedBid(sealedBid1.bidAmount, sealedBid1.salt, 1, 0, {
                from: bidder1
            })

            let bidder1Bid1 = await unicoinRegistry.getBid.call(0)

            let expectedObject = {
                0: sealedBid1.bidHash,
                1: sealedBid1.bidAmount,
                2: sealedBid1.salt,
                3: 1, //status(revealed)
                4: 1, //publication ID
                5: 0, //auction ID
                6: 2 //bidder ID
            }

            Object.keys(bidder1Bid1).forEach(function (key) {
                assert.equal(bidder1Bid1[key].toString(), expectedObject[key], "Key value error on" + key)
            });
        })

        it("Revert if wrong user tries to reveal bid", async () => {
            time.increase(250) //after the end of the auction

            await expectRevert.unspecified(unicoinRegistry.revealSealedBid(sealedBid2.bidAmount, sealedBid2.salt, 1, 0, {
                from: bidder2
            }))
        })

        it("Revert if wrong bid committed (both bid and salt)", async () => {
            time.increase(250) //after the end of the auction

            await expectRevert.unspecified(unicoinRegistry.revealSealedBid
                //input sealedBid1 bidder2. bidder2's bid is sealedBid2    
                (sealedBid1.bidAmount, sealedBid1.salt, 1, 0, {
                    from: bidder2
                }))
        })

        it("Can correctly reveal 2nd bid", async () => {
            time.increase(250) //after the end of the auction

            await unicoinRegistry.revealSealedBid(sealedBid2.bidAmount, sealedBid2.salt, 1, 1, {
                from: bidder2
            })

            let bidder1Bid1 = await unicoinRegistry.getBid.call(1)

            let expectedObject = {
                0: sealedBid2.bidHash,
                1: sealedBid2.bidAmount,
                2: sealedBid2.salt,
                3: 1, //status(revealed)
                4: 1, //publication ID
                5: 0, //auction ID
                6: 3 //bidder ID
            }

            Object.keys(bidder1Bid1).forEach(function (key) {
                assert.equal(bidder1Bid1[key].toString(), expectedObject[key], "Key value error on" + key)
            });
        })

        it("Revert if wrong time to reveal bid", async () => {
            time.increase(175) //after the end of the auction

            let auctionStatus = await unicoinRegistry.getAuctionStatus.call(0)
            assert.equal(auctionStatus.toNumber(), 1, "Auction should be in the commit phase")
            await expectRevert.unspecified(unicoinRegistry.revealSealedBid(sealedBid1.bidAmount, sealedBid1.salt, 1, 0, {
                from: bidder1
            }))
        })
    })
    context("Auction Bidding: finalize auction 🏁", function () {
        it("Can finalize auction correctly", async () => {
            //this is before the auction has started. auction stats at now() + 100
            // and current time is now()

            let publisherBalanceBefore = await daiContract.balanceOf(publisher)
            assert.equal(publisherBalanceBefore.toNumber(), 0, "Publisher should start with zero tokens")

            let contributor1BalanceBefore = await daiContract.balanceOf(contributor1)
            assert.equal(contributor1BalanceBefore.toNumber(), 0, "contributor1 should start with zero tokens")

            let contributor2BalanceBefore = await daiContract.balanceOf(contributor2)
            assert.equal(contributor2BalanceBefore.toNumber(), 0, "contributor2 should start with zero tokens")

            let bidder2BalanceBefore = await daiContract.balanceOf(bidder2)
            assert.equal(bidder2BalanceBefore.toNumber(), 100000, "bidder2 should start with 100000 tokens")

            let bidder2LicenceBalanceBefore = await licenceManager.balanceOf(bidder2)
            assert.equal(bidder2LicenceBalanceBefore.toNumber(), 0, "Bidder2 should not start with a licence")

            time.increase(250) //after the end of the auction
            await unicoinRegistry.finalizeAuction(0, {
                from: randomAddress
            })

            let publisherBalanceAfter = await daiContract.balanceOf(publisher)
            //the expected publisher balance is the total amount of the winning bid
            //(sealedBid2, submitted by bidder 2) minus the total amount 
            // sent to the contributors. this can be calculated by by 
            // subtracting the ratio of the amount sent to the contributers from 1
            // multiplied by the total bid amount
            let expectedPublisherBalanceAfter = sealedBid2.bidAmount * (1 - (samplePublication_PrivateAuction._contributors_weightings[0] + samplePublication_PrivateAuction._contributors_weightings[1]) / 100)
            assert.equal(publisherBalanceAfter.toNumber(), expectedPublisherBalanceAfter, "Publisher balance not correctly set")

            let contributor1BalanceAfter = await daiContract.balanceOf(contributor1)
            let expectedContributor1BalanceAfter = sealedBid2.bidAmount * (samplePublication_PrivateAuction._contributors_weightings[0]) / 100
            assert.equal(contributor1BalanceAfter.toNumber(), expectedContributor1BalanceAfter, "Contributor1 balance after wrong")

            let contributor2BalanceAfter = await daiContract.balanceOf(contributor2)
            let expectedContributor2BalanceAfter = sealedBid2.bidAmount * (samplePublication_PrivateAuction._contributors_weightings[1]) / 100
            assert.equal(contributor2BalanceAfter.toNumber(), expectedContributor2BalanceAfter, "Contributor2 balance after wrong")

            let bidder2BalanceAfter = await daiContract.balanceOf(bidder2)
            let expectedBidder2BalanceAfter = bidder2BalanceBefore - (expectedPublisherBalanceAfter + expectedContributor1BalanceAfter + expectedContributor2BalanceAfter)
            assert.equal(bidder2BalanceAfter.toNumber(), expectedBidder2BalanceAfter, "Bidder2 balance after not set correctly")
            let bidder2LicenceBalanceAfter = await licenceManager.balanceOf(bidder2)
            assert.equal(bidder2LicenceBalanceAfter.toNumber(), 1, "Bidder2 should end with a licence")

        })
        it("Reverts if invalid reveal time: before auction", async () => {
            await expectRevert.unspecified(
                unicoinRegistry.finalizeAuction(0, {
                    from: randomAddress
                })
            )
        })
        it("Reverts if invalid reveal time: during auction", async () => {
            time.increase(150)
            await expectRevert.unspecified(
                unicoinRegistry.finalizeAuction(0, {
                    from: randomAddress
                })
            )
        })
    })
    context("Auction Bidding: retrieve finalized bid information 🔎", function () {
        it("Can get information about loosing bid", async () => {
            let expectedObject = {
                0: sealedBid1.bidHash,
                1: sealedBid1.bidAmount,
                2: sealedBid1.salt,
                3: 1, // reveal bid status (not winner as this bid is second)
                4: 1, // publicationId
                5: 0, // auctionId
                6: 2, // bidder Id for bidder1
            }

            let bidder1Bid1 = await unicoinRegistry.getBid.call(0)
            Object.keys(bidder1Bid1).forEach(function (key) {
                assert.equal(bidder1Bid1[key].toString(), expectedObject[key], "Key value error on" + key)
            });
        })

        it("Can get information about winning bid", async () => {
            let expectedObject = {
                0: sealedBid2.bidHash,
                1: sealedBid2.bidAmount,
                2: sealedBid2.salt,
                3: 2, // winner bid status
                4: 1, // publicationId
                5: 0, // auctionId
                6: 3, // bidder Id for bidder2
            }

            let bidder2Bid1 = await unicoinRegistry.getBid.call(1)
            Object.keys(bidder2Bid1).forEach(function (key) {
                assert.equal(bidder2Bid1[key].toString(), expectedObject[key], "Key value error on" + key)
            });
        })
    })
    context("Licence Management: retrieve issued licence information 📝", function () {
        it("Can get information about issued licence", async () => {
            let expectedObject = {
                0: 3, // buyerId
                1: 1, // publicationId
                2: 1, // publicationLicenceNo
                3: 0 // licence status. 0 for active
            }
            let licence = await unicoinRegistry.getLicence.call(0)
            Object.keys(licence).forEach(function (key) {
                assert.equal(licence[key].toString(), expectedObject[key], "Key value error on " + key)
            });
        })
        it("Can get licenses associated with a publication", async () => {
            let publicationLicences = await unicoinRegistry.getPublicationLicences(1);
            assert.equal(publicationLicences, 0, "The 1st licence should be assicated with the publication")
        })

        it("Should be no licences associated with other publications", async () => {
            let publicationLicences = await unicoinRegistry.getPublicationLicences(0);
            assert.equal(publicationLicences[0], undefined, "There should be no licences with this publication")
        })
    })
    context("Licence Management: Interacting with NFT 💼", function () {
        it("Can get information about issued NFT", async () => {
            let ownerOfLicence = await unicoinRegistry.ownerOf.call(0)
            assert(ownerOfLicence, bidder1, "incorrect asigment of licence owner")
        })
        it("Can get info about a publication's licence", async () => {
            let mostRecentPublicationLicence = await unicoinRegistry.getMostRecentPublicationLicence(1)
            assert.equal(mostRecentPublicationLicence.toNumber(), 0, "Most recent publication licence is wrong")

            await expectRevert.unspecified(unicoinRegistry.getMostRecentPublicationLicence(0))
        })
    })

    context("Harberger Tax: publication management 📕", function () {
        it("Can correctly create a licence with harberger tax enabled", async () => {
            await unicoinRegistry.createPublication(
                2, //PricingStrategy of 2 is for a PrivateAuctionHarberger
                samplePublication_PrivateAuction._publication_uri,
                samplePublication_PrivateAuction._auctionFloor,
                samplePublication_PrivateAuction._auctionStartTime,
                samplePublication_PrivateAuction._auctionDuration,
                samplePublication_PrivateAuction._fixed_sell_price,
                samplePublication_PrivateAuction._maxNumberOfLicences,
                samplePublication_PrivateAuction._contributors,
                samplePublication_PrivateAuction._contributors_weightings, {
                    from: publisher
                }
            );
            let numOfPublications = await unicoinRegistry.getPublicationLength()
            assert.equal(numOfPublications.toNumber(), 3, "new publication was not created with the correct id")
        })

        it("Can bid (and win) auction on harberger tax", async () => {
            await time.increase(150) //current time is now ahead of the start time
            await unicoinRegistry.commitSealedBid(sealedBid2.bidHash, 2 //2 is the auction number for the just created publication
                , {
                    from: bidder2
                })

            await time.increase(250) //current time is now after the auction ends
            await unicoinRegistry.revealSealedBid(sealedBid2.bidAmount, sealedBid2.salt, 2, 3, {
                from: bidder2
            })

            await unicoinRegistry.finalizeAuction(1, {
                from: randomAddress
            })

            let mostRecentPublicationLicence = await unicoinRegistry.getMostRecentPublicationLicence(2)
            assert.equal(mostRecentPublicationLicence.toNumber(), 1, "Most recent publication licence is wrong")
        })

        it("Can get taxObjects length", async () => {
            let length = await unicoinRegistry.getTaxObjectLength.call()
            assert.equal(length.toNumber(), 1, "There should be 1 tax object");

        })

        it("Can get info about tax object", async () => {
            let taxObject = await unicoinRegistry.getTaxObject.call(0)
            let expectedObject = {
                0: 1, //licenceId
                1: startingHarbergerTaxPerBlock, //ratePerBlock
                2: contractTime.toNumber(), //last payment
                3: 0, //numberOfOutBids
                4: sealedBid2.bidAmount, //currentAssignedValue
                5: [], //buyout_Ids
                6: 0, //status. 0 = active
            }

            Object.keys(taxObject).forEach(function (key) {
                if (key != 2) {
                    assert.equal(taxObject[key].toString(), expectedObject[key], "Key value error on " + key)
                } else {
                    assert.equal(taxObject[key].toNumber() <= contractTime, true, "start time should be less than or equal to current time")
                }
            });
        })
        it("Can get licenses associated with harberger publication", async () => {
            let publicationLicences = await unicoinRegistry.getPublicationLicences(2);
            assert.equal(publicationLicences[0], 1, "The 1st licence should be associated with the publication")

        })
    })
    context("Harberger Tax: taxation calculations and payments 🤑", function () {
        it("Can correctly calculate outstanding tax", async () => {
            time.increase(oneMonthSeconds * 6)
            let taxToPay = await unicoinRegistry.getOutstandingTax.call(0)

            //exact tests of the tax amount paid are tested in another set of tests
            assert.equal(taxToPay.toNumber() > 0, true, "The tax should be bigger than 0");
        })

        it("Can correctly calculate min buy out price", async () => {
            let contractCalculatedValue = await unicoinRegistry.getMinBuyOutPrice(0);

            let expectedValue = sealedBid2.bidAmount * 1.05
            assert.equal(contractCalculatedValue, expectedValue, "wrong calculated raise prise value")
        })
    })
    context("Harberger Tax: claiming claimHarbergerTax 👮‍♂️", function () {
        it("correctly distributes tax to recipients", async () => {
            let publisherBalanceBefore = await daiContract.balanceOf(publisher)

            let contributor1BalanceBefore = await daiContract.balanceOf(contributor1)

            let contributor2BalanceBefore = await daiContract.balanceOf(contributor2)

            await unicoinRegistry.claimHarbergerTax(2)

            let publisherBalanceAfter = await daiContract.balanceOf(publisher)
            assert.equal(publisherBalanceAfter > publisherBalanceBefore, true, "Publisher balance did not increase")

            let contributor1BalanceAfter = await daiContract.balanceOf(contributor1)
            assert.equal(contributor1BalanceAfter > contributor1BalanceBefore, true, "contributor1 balance did not increase")

            let contributor2BalanceAfter = await daiContract.balanceOf(contributor2)
            assert.equal(contributor2BalanceAfter > contributor2BalanceBefore, true, "contributor2 balance did not increase")
        })
        it("correctly updates tax object after paying tax", async () => {
            let taxObject = await unicoinRegistry.getTaxObject.call(0)
            //the last payment was set 6 months ago from a few tests ago.
            //this assert checks that it was updated such that the current contract time
            //and the last payment time are within 5 seconds of each other
            // indicating that it has been updated
            assert.equal((contractTime.toNumber() - taxObject[2].toNumber()) < 5, true, "did not correctly update last payment date")
        })
    })
    context("Harberger Tax: buyout creation 💳", function () {
        it("Can correctly check if a licence has harberger tax", async () => {
            await expectRevert.unspecified(unicoinRegistry.getLicenceTaxObjectId(0))

            let harbergerTaxObjectId = await unicoinRegistry.getLicenceTaxObjectId.call(1)
            assert.equal(harbergerTaxObjectId.toNumber(), 0, "the 0th harbergertax object should have id 0")
        })
        it("Can correctly create a valid buyout request", async () => {
            await unicoinRegistry.createHarbergerBuyOut(1, sealedBid2.bidAmount * 1.10, {
                from: bidder1
            })

            let licenceTaxObjectId = await unicoinRegistry.getLicenceTaxObjectId.call(1)

            let taxObject = await unicoinRegistry.getTaxObject.call(licenceTaxObjectId)

            //this tax object is the same as tested before except we now have a buyout ID

            let buyOutId = taxObject[5][0].toNumber()
            assert.equal(buyOutId, 0, "There should be a buyout ID")

            let expectedObject = {
                0: 0, //taxObject_Id
                1: 2, //buyOutOwner_Id
                2: sealedBid2.bidAmount * 1.10, //buyOutAmount
                3: contractTime.toNumber() + 60 * 60 * 24 * 10, //buyOutExpiration
                4: 0
            }

            let buyout = await unicoinRegistry.getBuyOut(buyOutId)

            Object.keys(buyout).forEach(function (key) {
                if (key != 3) {
                    assert.equal(buyout[key].toString(), expectedObject[key], "Key value error on " + key)
                } else {
                    assert.equal(buyout[key] - expectedObject[key] < 5, true, "The delta between expected and actual time should be < 5")
                }
            });
        })

        it("Reverts if not a harberger tax licence", async () => {
            await expectRevert.unspecified(unicoinRegistry.createHarbergerBuyOut(0, sealedBid2.bidAmount * 1.10, {
                from: bidder1
            }))
        })
        it("Reverts if value sent less than min buyout price", async () => {
            await expectRevert.unspecified(unicoinRegistry.createHarbergerBuyOut(1, sealedBid2.bidAmount * 1.04, {
                from: bidder1
            }))
        })
    })
    context("Harberger Tax: buyout finilization 🏎", function () {
        it("reverts if invalid finilization time", async () => {
            await expectRevert.unspecified(unicoinRegistry.finalizeBuyoutOffer(0))
        })
        it("can finalize buyout", async () => {
            time.increase(60 * 60 * 24 * 10) // 10 days. specified as the buyout expiration

            let bidder1BalanceBefore = await licenceManager.balanceOf(bidder1)

            await unicoinRegistry.finalizeBuyoutOffer(0)

            let bidder1BalanceAfter = await licenceManager.balanceOf(bidder1)

            assert(bidder1BalanceAfter.toNumber(), bidder1BalanceBefore.toNumber() + 1, "Outbidder did not gain a licence")
        })
        it("reverts if buyout already finalized", async () => {
            await expectRevert.unspecified(unicoinRegistry.finalizeBuyoutOffer(0))
        })
        it("correctly updates buyout information", async () => {
            let buyout = await unicoinRegistry.getBuyOut(0)
            //check the status has been updated to successful
            assert.equal(buyout[4], 1, "Buyout should be successful")
        })

        it("correctly updates tax object information", async () => {
            let taxObject = await unicoinRegistry.getTaxObject.call(0)
            //number of outbids
            assert.equal(taxObject[3], 1, "Should be 1 out bid")
            //new private valuation
            assert.equal(taxObject[4], sealedBid2.bidAmount * 1.10, "Should have the correct outbid amount")
        })
        it("correctly updates licence information", async () => {
            //the new owner of licence 1 should be bidder1. this bidder
            //submitted the buyout and if this is correct then the licence
            //was transfered away from bidder2, the original owner
            let ownerOfLicence = await unicoinRegistry.ownerOf.call(1)
            assert(ownerOfLicence, bidder1, "incorrect asigment of licence owner")
        })

    })
    context("Harberger Tax: solvent licence owner 🔏", function () {
        it("places licence for auction if owner is underfunded", async () => {
            //start by advancing time so there is outstanding tax to be paid
            time.increase(oneMonthSeconds * 6)

            //then remove all the current owners tokens to simulate being insolvent
            // note that the current owner is bidder 1 from the 
            // buyout in the previous set of tests
            let currentBidder1Balance = await daiContract.balanceOf(bidder1)
            await daiContract.transfer(randomAddress, currentBidder1Balance.toNumber(), {
                from: bidder1
            })

            let newBidder1Balance = await daiContract.balanceOf(bidder1)
            assert.equal(newBidder1Balance, 0, "bidder 2 should have zero tokens")

            //the licence should not be revoked before the call
            let licenceInfoBefore = await unicoinRegistry.getLicence(1)
            assert.equal(licenceInfoBefore[3].toNumber(), 0, "The licence should not be revoked")

            //now try claim tax that the current owner has no tokens
            await unicoinRegistry.claimHarbergerTax(2)

            //the licence should now be revoked
            let licenceInfoAfter = await unicoinRegistry.getLicence(1)
            assert.equal(licenceInfoAfter[3].toNumber(), 1, "The licence should be revoked")

            //and a new auction is created for the publication
            let publicationAuctions = await unicoinRegistry.getPublicationAuctions(2)

            assert.equal(publicationAuctions.length, 2, "There should now be a second auction")

            //get the second auction information
            let newAuctionInformation = await unicoinRegistry.getAuction(publicationAuctions[1].toNumber())
            assert.equal(newAuctionInformation[0].toNumber(), 2, "publication Id error")
            assert.equal(newAuctionInformation[1].toNumber(), 0, "auction floor error")
            assert.equal(contractTime - newAuctionInformation[2].toNumber() < 5, true, "auction start time error")
            // one month duration for the auction,
            assert.equal(newAuctionInformation[3].toNumber(), 60 * 60 * 24 * 30,
                "auction duration error")
            assert.equal(newAuctionInformation[4][0], undefined,
                "there should be no bids associated with the auction")
            assert.equal(newAuctionInformation[5], 0,
                "currently no winning bid")
            assert.equal(newAuctionInformation[6], 0,
                "status should be commit")
        })
        it("can bid on auction and win new licence", async () => {
            // move auction into commit phase
            time.increase(10)

            //add a sealed bid
            await unicoinRegistry.commitSealedBid(sealedBid1.bidHash, 2, {
                from: bidder2
            })

            //move auction until after end of auction phase
            time.increase(60 * 60 * 24 * 30)

            //get the bids for user 2 (bidder1)
            let bidderBids = await unicoinRegistry.getBidderBids(3) //get all bids for bidder1

            //from this get the latest bid id to reveal
            let latestBidId = bidderBids[bidderBids.length - 1].toNumber()

            await unicoinRegistry.revealSealedBid(sealedBid1.bidAmount, sealedBid1.salt, 2, latestBidId, {
                from: bidder2
            })

            await unicoinRegistry.finalizeAuction(2)

            let publicationLicences = await unicoinRegistry.getPublicationLicences(2)
            assert.equal(publicationLicences[1].toNumber(), 2, "Licence number 2 should be added to the array of licences for the object")

            let ownerOfLicence = await unicoinRegistry.ownerOf.call(2)
            assert(ownerOfLicence, bidder2, "incorrect asigment of licence owner")

        })
    })
})