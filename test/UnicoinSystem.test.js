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
        let contractTime = await unicoinRegistry.getBlockTime.call()
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
                    from: randomAddress
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
                    from: randomAddress
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
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid publication: invalid start time", async () => {
            await time.increase(200) //current time is now ahead of the start time
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_FixedRate._pricing_Strategy,
                samplePublication_FixedRate._publication_uri,
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                samplePublication_FixedRate._fixed_sell_price,
                samplePublication_FixedRate._auctionDuration,
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: randomAddress
                }
            ))
        })
        it("Reverts if invalid publication: invalid duration time", async () => {
            await expectRevert.unspecified(unicoinRegistry.createPublication(
                samplePublication_FixedRate._pricing_Strategy,
                samplePublication_FixedRate._publication_uri,
                samplePublication_FixedRate._auctionFloor,
                samplePublication_FixedRate._auctionStartTime,
                0, //auction duration cant be zero
                samplePublication_FixedRate._fixed_sell_price,
                samplePublication_FixedRate._maxNumberOfLicences,
                samplePublication_FixedRate._contributors,
                samplePublication_FixedRate._contributors_weightings, {
                    from: randomAddress
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
                2: 1 // publicationLicenceNo
            }
            let licence = await unicoinRegistry.getLicence.call(1)
            Object.keys(licence).forEach(function (key) {
                assert.equal(licence[key].toString(), expectedObject[key], "Key value error on" + key)
            });

            let ownerOfLicence = await unicoinRegistry.ownerOf.call(1)
            assert(ownerOfLicence, bidder1, "incorrect asigment of licence owner")
        })
        it("Can get licenses associated with a publication", async () => {
            let publicationLicences = await unicoinRegistry.getPublicationLicences(1);
            console.log(publicationLicences)
        })
    })
})