pragma solidity ^0.5.12;

/// @title UniCoin smart contract
/// @author Chris Maree

/// @dev import contracts from openzeppelin related to ownable and ERC20, ERC721 tokens

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

    event NewPublication(
        address indexed _from,
        string _publication_uri,
        bool _pricing_Strategy,
        uint256 _sell_price
    );

    event NewBid(
        address indexed _from,
        uint256 indexed _publication_Id,
        uint256 _offer
    );

    event AcceptedBid(address indexed _from, uint256 _id);

    event RejectedBid(address indexed _from, uint256 _id);

    event CancelledBid(address indexed _from, uint256 _id);

    event ChangeToSale(
        address indexed _from,
        uint256 indexed _publication_Id,
        uint256 _sell_price
    );

    event ChangeToAuction(
        address indexed _from,
        uint256 indexed _publication_Id
    );

    event ChangeSellPrice(
        address indexed _from,
        uint256 indexed _publication_Id,
        uint256 _sell_price
    );

    event ChangeRunningStatus(
        address indexed _from,
        uint256 indexed _publication_Id,
        bool _isRunning
    );
    function initialize(
        address _auctionManager,
        address _licenceManager,
        address _publicationManager,
        address _userManager,
        address _vault
    ) public initializer {
        owner = msg.sender;

        auctionManager = AuctionManager(_auctionManager);
        licenceManager = LicenceManager(_licenceManager);
        publicationManager = PublicationManager(_publicationManager);
        userManager = UserManager(_userManager);
        vault = Vault(_vault);

    }

    function setOwner(address _owner) public {
        require(owner == msg.sender, "Only owner can change the owner address");
        owner = _owner;
    }

    /// @notice This function registers a user on the platform by taking in their profile URL
    /// @param _profile_uri user profile url
    /// @dev If the user's addresowners is in position 0 of the userAddresses array, they are unregistered
    /// @dev Create an instance of the user and add the Id to their address
    function registerUser(string memory _profile_uri) public {
        userManager._registerUser(_profile_uri);
    }

    /// @notice This function creates a publication on the system, with blank arrays for publication bids and owners,
    /// @notice since no one has bidded for or bought a licence yet
    /// @dev The researcher only specifies the flat rate if they have chosen not to auction the work
    /// @dev Add instance to the respective arrays

    function createPublication(
        string memory _publication_uri,
        uint8 _pricing_Strategy,
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

        if (PricingStrategy(_pricing_Strategy) != PricingStrategy.fixedRate) {
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
        auctionManager.commitSealedBid(_bidHash, auction_Id, bidder_Id);
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

        uint256 authorId = publicationManager._getAuthorId(publicationId);
        address authorAddress = userManager._getUserAddress(authorId);
        address winningBidderAddress = userManager._getUserAddress(
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

    function buyLicenceFixedRate() public {

    }

    function getPublicationsAuthorAddress(address _address)
        public
        view
        returns (uint256[] memory)
    {
        uint256 author_Id = userManager._getUserId(_address);
        return publicationManager.getAuthorPublications(author_Id);
    }

    function getPublicationsAuthorId(uint256 _author_Id) public view returns(uint256[] memory) {
        return publicationManager.getAuthorPublications(_author_Id);
    }

    function getPublicationLicences(uint256 _publication_Id) public view returns (uint256[] memory) {
        return licenceManager.getPublicationLicences(_publication_Id);
    }

    function getBids(address _address) public view returns (uint256[] memory) {
        uint256 userAddress = userManager._getUserId(_address);
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

    /// @return get the licences per owner
    /// @param _address of the account holder
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

    function getLicence(uint256 _licenceId)
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (licenceManager.getLicence);
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
        return userManager._isAddressRegistered(msg.sender);
    }

    function getCallerId() public view returns (uint256) {
        uint256 callerId = userManager._getUserId(msg.sender);
        require(callerId != 0, "Caller is not registered!");
    }

    function getUserAddress(uint256 _user_Id) public view returns (address) {
        return userManager._getUserAddress(_user_Id);
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
        return auctionManager.getBidderBids;
    }
}
