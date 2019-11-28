pragma solidity ^0.5.12;

/// @title UniCoin smart contract
/// @author Chris Maree

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "./AuctionManager.sol";
import "./LicenceManager.sol";
import "./PublicationManager.sol";
import "./UserManager.sol";
import "./Vault.sol";

contract UnicoinRegistry is Initializable, GSNRecipient {
    address owner;

    AuctionManager private auctionManager;
    LicenceManager private licenceManager;
    PublicationManager private publicationManager;
    UserManager private userManager;
    Vault private vault;

    enum PricingStrategy {PrivateAuction, FixedRate}

    function initialize(
        address _auctionManager,
        address _licenceManager,
        address _publicationManager,
        address _userManager,
        address _vault
    ) public initializer {
        owner = msg.sender;

        GSNRecipient.initialize();

        auctionManager = AuctionManager(_auctionManager);
        licenceManager = LicenceManager(_licenceManager);
        publicationManager = PublicationManager(_publicationManager);
        userManager = UserManager(_userManager);
        vault = Vault(_vault);

    }

    // accept all requests
    function acceptRelayedCall(
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
    }

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

    function setOwner(address _owner) public {
        require(owner == msg.sender, "Only owner can change the owner address");
        owner = _owner;
    }

    function registerUser(string memory _profile_uri) public {
        userManager._registerUser(_profile_uri, msg.sender);
    }
    function createPublication(
        uint8 _pricing_Strategy,
        string memory _publication_uri,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration,
        uint256 _fixed_sell_price,
        uint256 _maxNumberOfLicences,
        uint256[] memory _contributors,
        uint256[] memory _contributors_weightings
    ) public {
        require(
            isCallerRegistered(),
            "Cant create a publication if you are not registered"
        );
        uint256 author_id = getCallerId();
        uint256 publicationId = publicationManager._createPublication(
            _pricing_Strategy,
            _publication_uri,
            author_id,
            _fixed_sell_price,
            _maxNumberOfLicences,
            _contributors,
            _contributors_weightings
        );

        if (PricingStrategy(_pricing_Strategy) != PricingStrategy.FixedRate) {
            uint256 auctionId = auctionManager._createAuction(
                publicationId,
                _auctionFloor,
                _auctionStartTime,
                _auctionDuration
            );
            publicationManager._addAuctionToPublication(
                publicationId,
                auctionId
            );
        }
    }

    function commitSealedBid(bytes32 _bidHash, uint256 _publication_Id) public {
        uint256 auction_Id = publicationManager.getLatestAuctionId(
            _publication_Id
        );
        uint256 bidder_Id = getCallerId();
        auctionManager._commitSealedBid(_bidHash, auction_Id, bidder_Id);
    }

    function revealSealedBid(
        uint256 _bid,
        uint256 _salt,
        uint256 _publication_Id,
        uint256 _bid_Id
    ) public returns (uint256) {
        uint256 auction_Id = publicationManager.getLatestAuctionId(
            _publication_Id
        );
        uint256 bidder_Id = getCallerId();
        auctionManager.revealSealedBid(
            _bid,
            _salt,
            auction_Id,
            _bid_Id,
            bidder_Id
        );
    }

    function finalizeAuction(uint256 _auction_Id) public returns (uint256) {
        (uint256 winningBidAmount, uint256 winningBiderId, uint256 publicationId) = auctionManager
            .finalizeAuction(_auction_Id);

        require(winningBidAmount > 0, "Invalid winning bid amount");
        require(winningBiderId > 0, "Invalid winning bid Id");
        require(publicationId > 0, "Invalid publication Id");

        uint256 authorId = publicationManager.getAuthorId(publicationId);
        address authorAddress = userManager.getUserAddress(authorId);
        address winningBidderAddress = userManager.getUserAddress(
            winningBiderId
        );

        (uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager
            ._getContributers(publicationId);

        address[] memory contributorAddresses = userManager.getAddressArray(
            contributorIds
        );

        require(
            vault.settleBulkPayment(
                winningBidderAddress,
                authorAddress,
                contributorAddresses,
                contributorWeightings,
                winningBidAmount
            ),
            "Bulk auction settlement failed"
        );

        uint256 publicationLicenceNo = publicationManager
            .addNewLicenceToPublication(publicationId);

        licenceManager.registerNewLicence(
            winningBidderAddress,
            winningBiderId,
            publicationId,
            publicationLicenceNo
        );
    }

    function buyLicenceFixedRate() public {}

    function getPublicationsAuthorAddress(address _address)
        public
        view
        returns (uint256[] memory)
    {
        uint256 author_Id = userManager.getUserId(_address);
        return publicationManager.getAuthorPublications(author_Id);
    }

    function getPublicationsAuthorId(uint256 _author_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publicationManager.getAuthorPublications(_author_Id);
    }

    function getPublicationLicences(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory)
    {
        return licenceManager.getPublicationLicences(_publication_Id);
    }

    function getBids(address _address) public view returns (uint256[] memory) {
        uint256 userAddress = userManager.getUserId(_address);
        return auctionManager.getBidderBids(userAddress);
    }

    function getPublicationAuctions(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publicationManager.getPublicationAuctions(_publication_Id);
    }

    function getPublicationLength() public view returns (uint256) {
        return publicationManager.getPublicationLength();
    }

    function getPublication(uint256 _publication_Id)
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
        return (publicationManager.getPublication(_publication_Id));
    }

    function getLicenceForAddress(address _address)
        public
        view
        returns (uint256[] memory)
    {
        uint256 user_Id = userManager.getUserId(_address);
        return getLicenceForUserId(user_Id);
    }

    function getLicenceForUserId(uint256 _user_Id)
        public
        view
        returns (uint256[] memory)
    {
        return licenceManager.getLicenceForUser(_user_Id);
    }

    function getLicence(uint256 _licence_Id)
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (licenceManager.getLicence(_licence_Id));
    }

    function donate(uint256 _publication_Id, uint256 _value) public {
        uint256 authorId = publicationManager.getAuthorId(_publication_Id);
        address authorAddress = userManager.getUserAddress(authorId);

        (uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager
            ._getContributers(_publication_Id);

        address[] memory contributorAddresses = userManager.getAddressArray(
            contributorIds
        );

        require(
            vault.settleBulkPayment(
                msg.sender,
                authorAddress,
                contributorAddresses,
                contributorWeightings,
                _value
            ),
            "Bulk auction settlement failed"
        );
    }

    function isCallerRegistered() public view returns (bool) {
        return userManager.isAddressRegistered(msg.sender);
    }

    function getCallerId() public view returns (uint256) {
        uint256 callerId = userManager.getUserId(msg.sender);
        require(callerId != 0, "Caller is not registered!");
        return callerId;
    }

    function getUserAddress(uint256 _user_Id) public view returns (address) {
        return userManager.getUserAddress(_user_Id);
    }

    function canBidderPay(uint256 _user_Id, uint256 _amount)
        public
        view
        returns (bool)
    {
        address userAddress = getUserAddress(_user_Id);
        return vault.canBidderPay(userAddress, _amount);
    }

    function getBidderBids(uint256 _bidder_Id)
        public
        view
        returns (uint256[] memory)
    {
        return auctionManager.getBidderBids(_bidder_Id);
    }

    function getBlockTime() public view returns (uint256) {
        return now;
    }

    function getAuctionStatus(uint256 _auction_Id) public returns (uint256) {
        return uint256(auctionManager.getAuctionStatus(_auction_Id));
    }

    function updateAuctionStartTime(
        uint256 _publication_Id,
        uint256 _newStartTime
    ) public {
        uint256 caller_Id = getCallerId();
        require(
            caller_Id == publicationManager.getAuthorId(_publication_Id),
            "Only the publisher can modify the start time"
        );
        uint256 auction_Id = publicationManager.getLatestAuctionId(
            _publication_Id
        );
        auctionManager.updateAuctionStartTime(auction_Id, _newStartTime);
    }
}
