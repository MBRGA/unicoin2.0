// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/// @title UniCoin smart contract
/// @author Chris Maree

import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";

import "./interfaces/IAuctionManager.sol";
import "./interfaces/ILicenceManager.sol";
import "./interfaces/IPublicationManager.sol";
import "./interfaces/IUserManager.sol";
import "./interfaces/IVault.sol";
import "./interfaces/IHarbergerTaxManager.sol";

import "./library/SharedStructures.sol";

contract UnicoinRegistry is Initializable, ERC2771ContextUpgradeable {

    IAuctionManager private auctionManager;
    ILicenceManager private licenceManager;
    IPublicationManager private publicationManager;
    IUserManager private userManager;
    IHarbergerTaxManager private harbergerTaxManager;
    IVault private vault;

    address owner;

    //string public override versionRecipient = "2.2.6+opengsn.unicoinregistry";

    constructor (address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) initializer {

    }

    function initialize(
        address auctionManagerContract,
        address licenceManagerContract,
        address publicationManagerContract,
        address userManagerContract,
        address harbergerTaxManagerContract,
        address vaultContract
    ) public initializer {
        owner = _msgSender();

        //GSNRecipient.initialize();

        auctionManager = IAuctionManager(auctionManagerContract);
        licenceManager = ILicenceManager(licenceManagerContract);
        publicationManager = IPublicationManager(publicationManagerContract);
        userManager = IUserManager(userManagerContract);
        harbergerTaxManager = IHarbergerTaxManager(harbergerTaxManagerContract);
        vault = IVault(vaultContract);

        //trustedForwarder = _forwarder;
    }

    // accept all requests
    /*function acceptRelayedCall(
        address,
        address,
        bytes calldata,
        uint256,
        uint256,
        uint256,
        uint256,
        bytes calldata,
        uint256
    ) external view returns (uint256, bytes memory) {
        return _approveRelayedCall();
    }*/

    function _preRelayedCall(bytes memory context) internal returns (bytes32) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function _postRelayedCall(
        bytes memory context,
        bool,
        uint256 actualCharge,
        bytes32
    ) internal {
        // solhint-disable-previous-line no-empty-blocks
    }

    function setOwner(address ownerAddress) public {
        require(owner == _msgSender(), "Only owner can change the owner address");
        owner = ownerAddress;
    }

    function registerUser(string memory profileUri) public returns (uint256) {
        uint256 userId = userManager._registerUser(profileUri, _msgSender());
        return userId;
    }

    function getUserProfileUri(address userAddress) public view returns (string memory) {
        return userManager.getUserProfileUri(userAddress);
    }

    function getUserId(address userAddress) public view returns (uint256) {
        return userManager.getUserId(userAddress);
    }

    function createPublication(
        SharedStructures.PricingStrategy _pricingStrategy,
        string calldata publicationUri,
        uint256 auctionFloor,
        uint256 auctionStartTime,
        uint256 auctionDuration,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        SharedStructures.Contribution[] calldata contributors,
        SharedStructures.Citation[] calldata citations
    ) public {
        require(isCallerRegistered(), "Can't create a publication if you are not registered");

        //uint256 authorId = getCallerId();

        uint256 publicationId = publicationManager._createPublication(
            _pricingStrategy,
            publicationUri,
            _msgSender(),
            fixedSellPrice,
            maxNumberOfLicences,
            contributors,
            citations
        );

        if (_pricingStrategy != SharedStructures.PricingStrategy.FixedRate) {
            uint256 auctionId = auctionManager._createAuction(
                publicationId,
                auctionFloor,
                auctionStartTime,
                auctionDuration
            );
            publicationManager._addAuctionToPublication(publicationId, auctionId);
        }
    }

    function commitSealedBid(bytes32 bidHash, uint256 publicationId) public {
        uint256 auctionId = publicationManager.getLatestAuctionId(publicationId);
        address bidderAddress = _msgSender();

        auctionManager._commitSealedBid(bidHash, auctionId, bidderAddress);
    }

    function revealSealedBid(
        uint256 bid,
        uint256 salt,
        uint256 publicationId,
        uint256 bidId
    ) public {
        uint256 auctionId = publicationManager.getLatestAuctionId(publicationId);
        address bidderAddress = _msgSender();

        auctionManager._revealSealedBid(bid, salt, auctionId, bidId, bidderAddress);
    }

    function finalizeAuction(uint256 auctionId) public returns (uint256) {
        //(uint256 winningBidAmount, address winningBidderAddress, uint256 publicationId) = auctionManager.finalizeAuction(
        //    auctionId
        //);

        SharedStructures.AuctionResult memory auctionRes = auctionManager._finalizeAuction(auctionId);

        if (auctionRes.winningAmount == 0) {
            return 0; //no one won the auction
        }
        require(auctionRes.winnerAddress != address(0), "Invalid winning bid Id");
        require(auctionRes.publicationId > 0, "Invalid publication Id");

        address ownerAddress = publicationManager.getOwnerAddress(auctionRes.publicationId);
        //address authorAddress = userManager.getUserAddress(authorId);
        //address winningBidderAddress = userManager.getUserAddress(winningBidderId);

        // (uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager._getContributers(
        //    publicationId
        //);

        SharedStructures.Contribution[] memory contributors = publicationManager.getContributors(
            auctionRes.publicationId
        );

        //address[] memory contributorAddresses = userManager.getAddressArray(contributorIds);

        require(
            vault._settleBulkPayment(auctionRes.winnerAddress, ownerAddress, contributors, auctionRes.winningAmount),
            "Bulk auction settlement failed"
        );

        uint256 publicationLicenceNo = publicationManager._addNewLicenceToPublication(auctionRes.publicationId);

        uint256 licenceId = licenceManager._registerNewLicence(
            auctionRes.winnerAddress,
            //winningBidderId,
            auctionRes.publicationId,
            publicationLicenceNo
        );
        if (
            publicationManager.getPublicationPricingStrategy(auctionRes.publicationId) ==
            uint8(SharedStructures.PricingStrategy.PrivateAuctionHarberger)
        ) {
            harbergerTaxManager._createTaxObject(licenceId, auctionRes.winningAmount);
        }
        return auctionRes.winningAmount;
    }

    function buyLicenceFixedRate() public {}

    function claimHarbergerTax(uint256 publicationId) public returns (uint256) {
        uint256 licenceId = licenceManager.getMostRecentPublicationLicence(publicationId);
        uint256 taxObjectId = harbergerTaxManager.getLicenceTaxObjectId(licenceId);
        uint256 outstandingTax = harbergerTaxManager.calculateOutstandingTax(taxObjectId);
        address licenceOwner = licenceManager.ownerOf(licenceId);
        bool licenceOwnerSolvent = vault.canAddressPay(licenceOwner, outstandingTax);

        if (licenceOwnerSolvent) {
            //the licence owner can pay the tax and all contributers are paid
            address authorAddress = publicationManager.getOwnerAddress(publicationId);
            //address authorAddress = userManager.getUserAddress(authorId);

            //(uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager
            //    ._getContributers(publicationId);

            SharedStructures.Contribution[] memory contributors = publicationManager.getContributors(publicationId);

            //address[] memory contributorAddresses = userManager.getAddressArray(contributorIds);

            require(
                vault._settleBulkPayment(
                    licenceOwner,
                    authorAddress,
                    contributors,
                    //contributorAddresses,
                    //contributorWeightings,
                    outstandingTax
                ),
                "Bulk harberger settlement failed"
            );

            harbergerTaxManager._updateTaxObjectLastPayment(taxObjectId);

            return outstandingTax; //returns the total tax sent
        }
        // the licence owner cant pay the tax. they lose their licence which is placed for auction again
        else {
            licenceManager._revokeLicence(licenceId);
            publicationManager._revokeLicence(publicationId);
            harbergerTaxManager._revokeTaxObject(taxObjectId);

            //create a new auction
            uint256 auctionId = auctionManager._createAuction(
                publicationId,
                0, //auction floor
                block.timestamp, //auction start time
                60 * 60 * 24 * 30 // one month duration for the auction
            );
            publicationManager._addAuctionToPublication(publicationId, auctionId);
            return 0;
        }
    }

    function updateLicenceHarbergerValuation(uint256 licenceId, uint256 newValuation) public {
        address licenceOwnerAddress = licenceManager.getLicenceOwnerAddress(licenceId);

        require(licenceOwnerAddress == _msgSender(), "Only the current licence owner can update the  valuation");

        uint256 taxObjectId = harbergerTaxManager.getLicenceTaxObjectId(licenceId);

        harbergerTaxManager._updateTaxObjectValuation(taxObjectId, newValuation);
    }

    function createHarbergerBuyOut(uint256 licenceId, uint256 buyOutAmount) public returns (uint256) {
        uint256 taxObjectId = harbergerTaxManager.getLicenceTaxObjectId(licenceId);
        address buyOutOwnerId = _msgSender();

        uint256 buyOutId = harbergerTaxManager._submitBuyOut(taxObjectId, buyOutAmount, buyOutOwnerId);
        return buyOutId;
    }

    function finalizeBuyoutOffer(uint256 buyOutId) public returns (bool) {
        bool offerSucceeded = harbergerTaxManager._finalizeBuyOutOffer(buyOutId);

        if (offerSucceeded) {
            uint256 licenceId = harbergerTaxManager.getBuyOutLicenceId(buyOutId);

            //uint256 buyOutOwnerId = harbergerTaxManager.getBuyOutOwnerId(buyOutId);

            //address buyOutOwnerAddress = userManager.getUserAddress(buyOutOwnerId);

            address buyoutOwnerAddress = harbergerTaxManager.getBuyOutOwnerAddress(buyOutId);

            address previousOwnerAddress = licenceManager.getLicenceOwnerAddress(licenceId);

            licenceManager._allocateLicenceToNewOwner(
                licenceId,
                // buyOutOwnerId,
                previousOwnerAddress,
                buyoutOwnerAddress
            );

            return true;
        }

        return false;
    }

    function getTaxObject(uint256 taxObjectId) public view returns (SharedStructures.TaxObject memory) {
        return (harbergerTaxManager.getTaxObject(taxObjectId));
    }

    /*function getBuyOut(uint256 buyOutId) public view returns (uint256, uint256, uint256, uint256, uint8) {
        return (harbergerTaxManager.getBuyOut(buyOutId));
    }*/

    function getTaxObjectLength() public view returns (uint256) {
        return harbergerTaxManager.getTaxObjectLength();
    }

    function getMinBuyOutAmount(uint256 publicationId) public view returns (uint256) {}

    function getPublicationsAuthorAddress(address authorAddress) public view returns (uint256[] memory) {
        return publicationManager.getAllPublications(authorAddress);
    }

    /*function getPublicationsAuthorId(uint256 _authorId) public view returns (uint256[] memory) {
        return publicationManager.getAuthorPublications(_authorId);
    }*/

    function getPublicationLicences(uint256 publicationId) public view returns (uint256[] memory) {
        return licenceManager.getPublicationLicences(publicationId);
    }

    function getBids(address bidderAddress) public view returns (uint256[] memory) {
        return auctionManager.getBidderBids(bidderAddress);
    }

    function getPublicationAuctions(uint256 publicationId) public view returns (uint256[] memory) {
        return publicationManager.getPublicationAuctions(publicationId);
    }

    function getPublicationLength() public view returns (uint256) {
        return publicationManager.getPublicationLength();
    }

    function getPublication(uint256 publicationId) public view returns (SharedStructures.Publication memory) {
        return (publicationManager.getPublication(publicationId));
    }

    function getPublicationContributors(uint256 publicationId) public view returns (SharedStructures.Contribution[] memory) {
        return (publicationManager.getContributors(publicationId));
    }

    function getLicenceForAddress(address userAddress) public view returns (uint256[] memory) {
        return licenceManager.getLicenceForUser(userAddress);
    }

    /*function getLicenceForUserId(uint256 _userId) public view returns (uint256[] memory) {
        return licenceManager.getLicenceForUser(_userId);
    }*/

    function getLicence(uint256 licenceId) public view returns (SharedStructures.Licence memory) {
        return (licenceManager.getLicence(licenceId));
    }

    function donate(uint256 publicationId, uint256 value) public {
        address authorAddress = publicationManager.getOwnerAddress(publicationId);

        SharedStructures.Contribution[] memory contributors = publicationManager.getContributors(publicationId);

        require(
            vault._settleBulkPayment(_msgSender(), authorAddress, contributors, value),
            "Bulk auction settlement failed"
        );
    }

    function isCallerRegistered() public view returns (bool) {
        return userManager.isAddressRegistered(_msgSender());
    }

    /*function getCallerId() public view returns (uint256) {
        uint256 callerId = userManager.getUserId(_msgSender());
        require(callerId != 0, "Caller is not registered!");
        return callerId;
    }*/

    /*function getUserAddress(uint256 _userId) public view returns (address) {
        return userManager.getUserAddress(_userId);
    }*/

    function canAddressPay(address userAddress, uint256 amount) public view returns (bool) {
        return vault.canAddressPay(userAddress, amount);
    }

    function getBidderBids(address bidderAddress) public view returns (uint256[] memory) {
        return auctionManager.getBidderBids(bidderAddress);
    }

    function getBlockTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getAuctionStatus(uint256 auctionId) public returns (uint256) {
        return uint256(auctionManager.getAuctionStatus(auctionId));
    }

    function updateAuctionStartTime(uint256 publicationId, uint256 newStartTime) public {
        //address callerAddress = _msgSender();

        require(
            _msgSender() == publicationManager.getOwnerAddress(publicationId),
            "Only the publisher can modify the start time"
        );

        uint256 auctionId = publicationManager.getLatestAuctionId(publicationId);

        auctionManager._updateAuctionStartTime(auctionId, newStartTime);
    }

    function getPublicationBids(uint256 publicationId) public view returns (uint256[] memory) {
        uint256 auctionId = publicationManager.getLatestAuctionId(publicationId);
        return (auctionManager.getAuctionBids(auctionId));
    }

    function getPublicationLatestAuction(uint256 publicationId) public view returns (SharedStructures.Auction memory) {
        uint256 auctionId = publicationManager.getLatestAuctionId(publicationId);
        return (auctionManager.getAuction(auctionId));
    }

    function getBid(uint256 bidId) public view returns (SharedStructures.Bid memory) {
        return (auctionManager.getBid(bidId));
    }

    function getPublicationAuctionBidLength(uint256 publicationId) public view returns (uint256) {
        uint256 auctionId = publicationManager.getLatestAuctionId(publicationId);
        return auctionManager.getNumberOfBidsInAuction(auctionId);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return licenceManager.ownerOf(tokenId);
    }

    function getOutstandingTax(uint256 taxObjectId) public view returns (uint256) {
        return harbergerTaxManager.calculateOutstandingTax(taxObjectId);
    }

    function getMinBuyOutPrice(uint256 taxObjectId) public view returns (uint256) {
        return harbergerTaxManager.calculateMinBuyOutPrice(taxObjectId);
    }

    function getLicenceTaxObjectId(uint256 licenceId) public view returns (uint256) {
        return harbergerTaxManager.getLicenceTaxObjectId(licenceId);
    }

    /*function getLicenceBuyOuts(uint256 licenceId)
        public
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory,
            IHarbergerTaxManager.BuyOutStatus[] memory
        )
    {
        return (harbergerTaxManager.getLicenceBuyOuts(licenceId));
    }*/

    function getMostRecentPublicationLicence(uint256 publicationId) public view returns (uint256) {
        return licenceManager.getMostRecentPublicationLicence(publicationId);
    }

    function getAuction(uint256 auctionId) public view returns (SharedStructures.Auction memory) {
        return (auctionManager.getAuction(auctionId));
    }

    // TODO: Implement cancelBid
    function cancelBid(uint256 bidId) public returns (bool) {
        return false;
    }
}
