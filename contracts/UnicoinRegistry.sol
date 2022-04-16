// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

/// @title UniCoin smart contract
/// @author Chris Maree

import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./interfaces/IAuctionManager.sol";
import "./interfaces/ILicenceManager.sol";
import "./interfaces/IPublicationManager.sol";
import "./interfaces/IUserManager.sol";
import "./interfaces/IVault.sol";
import "./interfaces/IHarbergerTaxManager.sol";

contract UnicoinRegistry is BaseRelayRecipient, Initializable {
    function versionRecipient() public pure override returns (string memory) {
        return "3.0.0-alpha0+unicoin";
    }

    IAuctionManager private auctionManager;
    ILicenceManager private licenceManager;
    IPublicationManager private publicationManager;
    IUserManager private userManager;
    IHarbergerTaxManager private harbergerTaxManager;
    IVault private vault;

    address owner;

    //string public override versionRecipient = "2.2.6+opengsn.unicoinregistry";

    function initialize(
        address _auctionManager,
        address _licenceManager,
        address _publicationManager,
        address _userManager,
        address _harbergerTaxManager,
        address _vault,
        address _forwarder
    ) public initializer {
        owner = _msgSender();

        _setTrustedForwarder(_forwarder);

        //GSNRecipient.initialize();

        auctionManager = IAuctionManager(_auctionManager);
        licenceManager = ILicenceManager(_licenceManager);
        publicationManager = IPublicationManager(_publicationManager);
        userManager = IUserManager(_userManager);
        harbergerTaxManager = IHarbergerTaxManager(_harbergerTaxManager);
        vault = IVault(_vault);

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

    function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32) internal {
        // solhint-disable-previous-line no-empty-blocks
    }

    function setOwner(address _owner) public {
        require(owner == _msgSender(), "Only owner can change the owner address");
        owner = _owner;
    }

    function registerUser(string memory _profileUri) public returns (uint256) {
        uint256 userId = userManager._registerUser(_profileUri, _msgSender());
        return userId;
    }

    function createPublication(
        IPublicationManager.PricingStrategy _pricingStrategy,
        string calldata _publicationUri,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration,
        uint256 _fixedSellPrice,
        uint8 _maxNumberOfLicences,
        IPublicationManager.Contribution[] calldata _contributors,
        IPublicationManager.Citation[] calldata _citations
    ) public {
        require(isCallerRegistered(), "Can't create a publication if you are not registered");

        //uint256 authorId = getCallerId();

        uint256 publicationId = publicationManager._createPublication(
            _pricingStrategy,
            _publicationUri,
            _msgSender(),
            _fixedSellPrice,
            _maxNumberOfLicences,
            _contributors,
            _citations
        );

        if (_pricingStrategy != IPublicationManager.PricingStrategy.FixedRate) {
            uint256 auctionId = auctionManager._createAuction(
                publicationId,
                _auctionFloor,
                _auctionStartTime,
                _auctionDuration
            );
            publicationManager._addAuctionToPublication(publicationId, auctionId);
        }
    }

    function commitSealedBid(bytes32 _bidHash, uint256 _publicationId) public {

        uint256 auctionId = publicationManager.getLatestAuctionId(_publicationId);
        address bidderAddress = _msgSender();

        auctionManager._commitSealedBid(_bidHash, auctionId, bidderAddress);
    }

    function revealSealedBid(uint256 _bid, uint256 _salt, uint256 _publicationId, uint256 _bidId)
        public
        returns (uint256)
    {
        uint256 auctionId = publicationManager.getLatestAuctionId(_publicationId);
        address bidderAddress = _msgSender();

        auctionManager.revealSealedBid(_bid, _salt, auctionId, _bidId, bidderAddress);
    }

    function finalizeAuction(uint256 _auctionId) public returns (uint256) {
        //(uint256 winningBidAmount, address winningBidderAddress, uint256 publicationId) = auctionManager.finalizeAuction(
        //    _auctionId
        //);

        IAuctionManager.AuctionResult memory auctionRes = auctionManager.finalizeAuction(_auctionId);

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

        IPublicationManager.Contribution[] memory contributors = publicationManager._getContributors(auctionRes.publicationId);

        //address[] memory contributorAddresses = userManager.getAddressArray(contributorIds);

        require(
            vault.settleBulkPayment(
                auctionRes.winnerAddress,
                ownerAddress,
                contributors,
                auctionRes.winningAmount
            ),
            "Bulk auction settlement failed"
        );

        uint256 publicationLicenceNo = publicationManager.addNewLicenceToPublication(auctionRes.publicationId);

        uint256 licenceId = licenceManager.registerNewLicence(
            auctionRes.winnerAddress,
            //winningBidderId,
            auctionRes.publicationId,
            publicationLicenceNo
        );
        if (
            publicationManager.GetPublicationPricingStrategy(auctionRes.publicationId) ==
            uint8(IPublicationManager.PricingStrategy.PrivateAuctionHarberger)
        ) {
            harbergerTaxManager.createTaxObject(licenceId, auctionRes.winningAmount);
        }
        return auctionRes.winningAmount;
    }

    function buyLicenceFixedRate() public {}

    function claimHarbergerTax(uint256 _publicationId) public returns (uint256) {
        uint256 licenceId = licenceManager.getMostRecentPublicationLicence(_publicationId);
        uint256 taxObjectId = harbergerTaxManager.getLicenceTaxObjectId(licenceId);
        uint256 outstandingTax = harbergerTaxManager.calculateOutstandingTax(taxObjectId);
        address licenceOwner = licenceManager.ownerOf(licenceId);
        bool licenceOwnerSolvent = vault.canAddressPay(licenceOwner, outstandingTax);

        if (licenceOwnerSolvent) {
            //the licence owner can pay the tax and all contributers are paid
            address authorAddress = publicationManager.getOwnerAddress(_publicationId);
            //address authorAddress = userManager.getUserAddress(authorId);

            //(uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager
            //    ._getContributers(_publicationId);

            IPublicationManager.Contribution[] memory contributors = publicationManager._getContributors(_publicationId);

            //address[] memory contributorAddresses = userManager.getAddressArray(contributorIds);

            require(
                vault.settleBulkPayment(
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
        // the licence owner cant pay the tax. they loose their licence which is placed for auction again
        if (!licenceOwnerSolvent) {
            licenceManager.revokeLicence(licenceId);
            publicationManager.revokeLicence(_publicationId);
            harbergerTaxManager.revokeTaxObject(taxObjectId);

            //create a new auction
            uint256 auctionId = auctionManager._createAuction(
                _publicationId,
                0, //auction floor
                block.timestamp, //auction start time
                60 * 60 * 24 * 30 // one month duration for the auction
            );
            publicationManager._addAuctionToPublication(_publicationId, auctionId);
            return 0;
        }
    }

    function updateLicenceHarbergerValuation(uint256 _licenceId, uint256 _newValuation) public returns (uint256) {

        address licenceOwnerAddress = licenceManager.getLicenceOwnerAddress(_licenceId);

        require(licenceOwnerAddress == _msgSender(), "Only the current licence owner can update the  valuation");

        uint256 taxObjectId = harbergerTaxManager.getLicenceTaxObjectId(_licenceId);

        harbergerTaxManager._updateTaxObjectValuation(taxObjectId, _newValuation);
    }

    function createHarbergerBuyOut(uint256 _licenceId, uint256 _buyOutAmount) public returns (uint256) {
        uint256 taxObjectId = harbergerTaxManager.getLicenceTaxObjectId(_licenceId);
        address buyOutOwnerId = _msgSender();

        uint256 buyOutId = harbergerTaxManager.submitBuyOut(taxObjectId, _buyOutAmount, buyOutOwnerId);
        return buyOutId;
    }

    function finalizeBuyoutOffer(uint256 _buyOutId) public returns (bool) {
        bool offerSucceeded = harbergerTaxManager.finalizeBuyOutOffer(_buyOutId);

        if (offerSucceeded) {
            uint256 licenceId = harbergerTaxManager.getBuyOutLicenceId(_buyOutId);

            //uint256 buyOutOwnerId = harbergerTaxManager.getBuyOutOwnerId(_buyOutId);

            //address buyOutOwnerAddress = userManager.getUserAddress(buyOutOwnerId);

            address buyoutOwnerAddress = harbergerTaxManager.getBuyOutOwnerId(_buyOutId);

            uint256 previousOwnerId = licenceManager.getLicenceOwnerId(licenceId);

            address previousOwnerAddress = userManager.getUserAddress(previousOwnerId);

            licenceManager.allocateLicenceToNewOwner(
                licenceId,
                buyOutOwnerId,
                previousOwnerAddress,
                buyOutOwnerAddress
            );
        }
    }

    function getTaxObject(uint256 _taxObjectId)
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256[] memory, uint8)
    {
        return (harbergerTaxManager.getTaxObject(_taxObjectId));
    }

    /*function getBuyOut(uint256 _buyOutId) public view returns (uint256, uint256, uint256, uint256, uint8) {
        return (harbergerTaxManager.getBuyOut(_buyOutId));
    }*/

    function getTaxObjectLength() public view returns (uint256) {
        return harbergerTaxManager.getTaxObjectLength();
    }

    function getMinBuyOutAmount(uint256 _publicationId) public view returns (uint256) {}

    function getPublicationsAuthorAddress(address _address) public view returns (uint256[] memory) {
        uint256 authorId = userManager.getUserId(_address);
        return publicationManager.getAuthorPublications(authorId);
    }

    function getPublicationsAuthorId(uint256 _authorId) public view returns (uint256[] memory) {
        return publicationManager.getAuthorPublications(_authorId);
    }

    function getPublicationLicences(uint256 _publicationId) public view returns (uint256[] memory) {
        return licenceManager.getPublicationLicences(_publicationId);
    }

    function getBids(address _address) public view returns (uint256[] memory) {
        uint256 userAddress = userManager.getUserId(_address);
        return auctionManager.getBidderBids(userAddress);
    }

    function getPublicationAuctions(uint256 _publicationId) public view returns (uint256[] memory) {
        return publicationManager.getPublicationAuctions(_publicationId);
    }

    function getPublicationLength() public view returns (uint256) {
        return publicationManager.getPublicationLength();
    }

    function getPublication(uint256 _publicationId)
        public
        view
        returns (
            uint8,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        return (publicationManager.getPublication(_publicationId));
    }

    function getLicenceForAddress(address _address) public view returns (uint256[] memory) {
        uint256 userId = userManager.getUserId(_address);
        return getLicenceForUserId(userId);
    }

    function getLicenceForUserId(uint256 _userId) public view returns (uint256[] memory) {
        return licenceManager.getLicenceForUser(_userId);
    }

    function getLicence(uint256 _licenceId) public view returns (uint256, uint256, uint256, uint8) {
        return (licenceManager.getLicence(_licenceId));
    }

    function donate(uint256 _publicationId, uint256 _value) public {
        uint256 authorId = publicationManager.getAuthorId(_publicationId);
        address authorAddress = userManager.getUserAddress(authorId);

        (uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager._getContributers(
            _publicationId
        );

        address[] memory contributorAddresses = userManager.getAddressArray(contributorIds);

        require(
            vault.settleBulkPayment(_msgSender(), authorAddress, contributorAddresses, contributorWeightings, _value),
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

    function getUserAddress(uint256 _userId) public view returns (address) {
        return userManager.getUserAddress(_userId);
    }

    function canAddressPay(uint256 _userId, uint256 _amount) public view returns (bool) {
        address userAddress = getUserAddress(_userId);
        return vault.canAddressPay(userAddress, _amount);
    }

    function getBidderBids(uint256 _bidderId) public view returns (uint256[] memory) {
        return auctionManager.getBidderBids(_bidderId);
    }

    function getBlockTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getAuctionStatus(uint256 _auctionId) public returns (uint256) {
        return uint256(auctionManager.getAuctionStatus(_auctionId));
    }

    function updateAuctionStartTime(uint256 _publicationId, uint256 _newStartTime) public {

        //address callerAddress = _msgSender();

        require(
            _msgSender() == publicationManager.getOwnerAddress(_publicationId),
            "Only the publisher can modify the start time"
        );

        uint256 auctionId = publicationManager.getLatestAuctionId(_publicationId);

        auctionManager.updateAuctionStartTime(auctionId, _newStartTime);
    }

    function getPublicationBids(uint256 _publicationId) public view returns (uint256[] memory) {
        uint256 auctionId = publicationManager.getLatestAuctionId(_publicationId);
        return (auctionManager.getAuctionBids(auctionId));
    }

    function getBid(uint256 _bidId) public view returns (bytes32, uint256, uint256, uint8, uint256, uint256, uint256) {
        return (auctionManager.getBid(_bidId));
    }

    function getPublicationAuctionBidLength(uint256 _publicationId) public view returns (uint256) {
        uint256 auctionId = publicationManager.getLatestAuctionId(_publicationId);
        return auctionManager.getNumberOfBidsInAuction(auctionId);
    }
    function ownerOf(uint256 tokenId) public view returns (address) {
        return licenceManager.ownerOf(tokenId);
    }

    function getOutstandingTax(uint256 _taxObjectId) public view returns (uint256) {
        return harbergerTaxManager.calculateOutstandingTax(_taxObjectId);
    }

    function getMinBuyOutPrice(uint256 _taxObjectId) public view returns (uint256) {
        return harbergerTaxManager.calculateMinBuyOutPrice(_taxObjectId);
    }

    function getLicenceTaxObjectId(uint256 _licenceId) public view returns (uint256) {
        return harbergerTaxManager.getLicenceTaxObjectId(_licenceId);
    }

    /*function getLicenceBuyOuts(uint256 _licenceId)
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
        return (harbergerTaxManager.getLicenceBuyOuts(_licenceId));
    }*/

    function getMostRecentPublicationLicence(uint256 _publicationId) public view returns (uint256) {
        return licenceManager.getMostRecentPublicationLicence(_publicationId);
    }

    function getAuction(uint256 _auctionId)
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256[] memory, uint256, uint8)
    {
        return (auctionManager.getAuction(_auctionId));
    }
}
