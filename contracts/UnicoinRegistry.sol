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

    event NewPublication(
        address indexed _from,
        string _publication_uri,
        bool _pricing_stratergy,
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
        uint8 _pricing_stratergy,
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
            _pricing_stratergy,
            _publication_uri,
            author_id,
            _fixed_sell_price,
            _maxNumberOfLicences,
            _contributors,
            _contributors_weightings
        );

        if (
            PricingStratergy(_pricing_stratergy) != PricingStratergy.fixedRate
        ) {
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
        address winningBidAddress = userManager._getUserAddress(winningBiderId);

        (uint256[] memory contributorIds, uint256[] memory contributorWeightings) = publicationManager
            ._getContributers(publicationId);

        address[] memory contributorAddresses = userManager.getAddressArray(
            contributorIds
        );

        uint256 totalPaidToContributors = 0;
        for (uint256 i = 0; i < contributorAddresses.length; i++) {
            uint256 amountToPay = (winningBidAmount *
                contributorWeightings[i]) /
                1e2;
            totalPaidToContributors += contributorWeightings[i];
            vault.settlePayment(
                winningBidAddress,
                contributorAddresses[i],
                amountToPay
            );
        }

        uint256 authorAmount = ((1e2 - totalPaidToContributors) *
            winningBidAmount) /
            1e2;
        vault.settlePayment(winningBidAddress, authorAddress, authorAmount);

        uint256 publicationLicenceNo = publicationManager
            .addNewLicenceToPublication(publicationId);

        licenceManager.registerNewLicence(
            winningBidAddress,
            winningBiderId,
            publicationId,
            publicationLicenceNo
        );
    }
    /// @return This function allows anyone to get the list of publications based on the address of the publisher
    /// @param _address eth address for the user
    function getPublications(address _address)
        public
        view
        returns (uint256[] memory)
    {
        uint256 _author_Id = userAddresses[_address];
        return publicationOwners[_author_Id];
    }

    /// @return This function allows anyone to get the list of bids based on address of the user
    function getBids(address _address) public view returns (uint256[] memory) {
        uint256 userAddress = userManager._getUserId(_address);
        return auctionManager.getBidderBids(userAddress);
    }

    function getPublicationAuctions(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publicationManager.getPublicationAuctions();
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
        uint256 _userNumber = userAddresses[_address];
        return licenceOwners[_userNumber];
    }

    function getLicence(uint256 _licenceId)
        public
        view
        returns (uint256, uint256, uint256)
    {
        LicenceDesign memory _licence = licences[_licenceId];
        return (_licence.buyer_Id, _licence.publication_Id, _licence.bid_Id);
    }

    /// @notice Donates funds to a research
    /// @param _publication_Id The id of the publication
    /// @param _value the amount that is being donated
    function donate(uint256 _publication_Id, uint256 _value) public {
        // require(
        //     userAddresses[msg.sender] != 0,
        //     "User address is not registered."
        // );
        // require(
        //     daiContract.allowance(msg.sender, address(this)) >= _value,
        //     "Insufficient fund allowance"
        // );
        // address publisherAddress = users[publications[_publication_Id]
        //     .author_Id]
        //     .owned_address;
        // daiContract.transferFrom(msg.sender, publisherAddress, _value);
    }

    function isCallerRegistered() public view returns (bool) {
        return userManager._isAddressRegistered(msg.sender);
    }

    function getCallerId() public view returns (uint256) {
        uint256 callerId = userManager._getUserId(msg.sender);
        require(callerId != 0, "Caller is not registred!");
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
