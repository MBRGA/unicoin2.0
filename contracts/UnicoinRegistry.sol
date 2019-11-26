pragma solidity ^0.5.0;

/// @title UniCoin smart contract
/// @author Chris Maree

/// @dev import contracts from openzeppelin related to ownable and ERC20, ERC721 tokens

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "./AuctionManager.sol";
import "./LicenceManager.sol";
import "./PublicationManager.sol";
import "./UserManager.sol";

contract UnicoinRegistry is Initializable, GSNRecipient {
    address owner;

    AuctionManager private auctionManager;
    LicenceManager private licenceManager;
    PublicationManager private publicationManager;
    UserManager private userManager;

    enum PricingStratergy {controlledAuction, privateAuction, fixedRate}

    enum AuctionType {controlledAuction, privateAuction}

    /// @notice struct for users of the plaform, needs their Ethereum address and profile URL
    struct User {
        address owned_address;
        string profile_uri;
    }
    /// @notice Creates an array of users that a registered
    User[] public users;

    /// @notice The mapping below maps all users' addresses to their userID
    mapping(address => uint256) public userAddresses;

    /// @notice Creates user defined type
    enum bidStatus {Pending, Accepted, Rejected, Sale, Cancelled}

    /// @notice Creates a struct for all bids, takes in the offer (amount of the bid), one of the enum parameters, publication Id and owner Id
    struct Bid {
        uint256 offer;
        bidStatus status;
        uint256 publication_Id;
        uint256 owner_Id; // owner of the bid
    }
    /// @notice Creates an array of bids that have been placed
    Bid[] public bids;

    /// @notice The mapping below maps all bidders' IDs to their userID
    mapping(uint256 => uint256[]) public bidOwners;

    struct Publication {
        uint256 author_Id;
        string publication_uri;
        uint256[] publication_bids;
        bool isAuction;
        bool isRunning;
        uint256 sell_price;
        uint256[] contributors;
        uint256[] contributors_weightings;
    }
    /// @notice Creates an array of publications for every published document
    Publication[] public publications;

    /// @notice The mapping below will map the addresses of all the successful bidders' addresses to the ID of their owned publications
    mapping(uint256 => uint256[]) public publicationOwners;

    /// @notice Creates a struct for licencing
    /// @param buyer_Id of each publication's buyer
    /// @param publication_Id of the publication being bought
    /// @param bid_Id The bid's Id for the publication
    struct LicenceDesign {
        uint256 buyer_Id;
        uint256 publication_Id;
        uint256 bid_Id;
    }
    /// @notice Creates an array of purchased licences
    LicenceDesign[] public licences;
    /// @notice Mapping of licence Id to get the licence owners
    mapping(uint256 => uint256[]) public licenceOwners;
    /// @notice Mapping of licence Id to get the publication Id
    mapping(uint256 => uint256[]) public publicationLicences;

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
        address _userManager
    ) public initializer {
        // users.push(User(address(0), ""));
        // licences.push(LicenceDesign(0, 0, 0));

        owner = msg.sender;

        auctionManager = AuctionManager(_auctionManager);
        licenceManager = LicenceManager(_licenceManager);
        publicationManager = PublicationManager(_publicationManager);
        userManager = UserManager(_userManager);

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
                _pricing_stratergy,
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

    function commitSealedBid(uint256 _bidHash, uint256 _publication_Id)
        public
        returns (uint256)
    {
        return 0;
    }

    function revealSealedBid(uint256 _bidHash, uint256 _publication_Id)
        public
        returns (uint256)
    {
        return 0;
    }

    function makeBid(uint256 _offer, uint256 _publication_Id) public {
        // auctionManager.makeBid
        // require(
        //     publications[_publication_Id].author_Id != 0,
        //     "Publication not enlisted."
        // );
        // require(
        //     userAddresses[msg.sender] != 0,
        //     "Bidder address is not registered."
        // );
        // if (publications[_publication_Id].isAuction) {
        //     require(
        //         publications[_publication_Id].isRunning,
        //         "Auction is not running."
        //     );
        //     uint256 _id = bids.push(
        //         Bid(
        //             _offer,
        //             bidStatus.Pending,
        //             _publication_Id,
        //             userAddresses[msg.sender]
        //         )
        //     );
        //     publications[_publication_Id].publication_bids.push(_id - 1);
        //     bidOwners[userAddresses[msg.sender]].push(_id - 1);
        //     emit NewBid(msg.sender, _publication_Id, _offer);
        // }
        // if (!publications[_publication_Id].isAuction) {
        //     require(
        //         _offer == publications[_publication_Id].sell_price,
        //         "Incorrect funds sent."
        //     );
        //     uint256 _id = bids.push(
        //         Bid(
        //             _offer,
        //             bidStatus.Sale,
        //             _publication_Id,
        //             userAddresses[msg.sender]
        //         )
        //     ) -
        //         1;
        //     publications[_publication_Id].publication_bids.push(_id);
        //     bidOwners[userAddresses[msg.sender]].push(_id);
        //     require(
        //         daiContract.allowance(msg.sender, address(this)) >= _offer,
        //         "Insufficient fund allowance"
        //     );
        //     address publisherAddress = users[publications[_publication_Id]
        //         .author_Id]
        //         .owned_address;
        //     require(
        //         daiContract.transferFrom(msg.sender, publisherAddress, _offer),
        //         "dai Transfer failed"
        //     );
        //     uint256 _licence_Id = licences.push(
        //         LicenceDesign(bids[_id].owner_Id, _publication_Id, _id)
        //     );
        //     licenceOwners[bids[_id].owner_Id].push(_licence_Id);
        //     publicationLicences[_publication_Id].push(_licence_Id);
        //     // licenceNFT._mint(users[bids[_id].owner_Id].owned_address, _licence_Id);
        //     emit NewBid(msg.sender, _publication_Id, _offer);
        // }
    }

    /// @notice This function allows the auctioneer to accept the bids
    /// @dev parameters of licence design: buyer_id, publication id, bid_id
    /// @notice This function allows the auctioneer to reject the bids
    /// @param _id is the bid Id
    function acceptBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id,
            "User not the author of this publication"
        );
        require(
            publications[_publication_Id].isAuction,
            "Publication not an auction."
        );
        require(
            publications[_publication_Id].isRunning,
            "Auction is not running."
        );
        bids[_id].status = bidStatus.Accepted;

        uint256 _licence_Id = licences.push(
            LicenceDesign(bids[_id].owner_Id, _publication_Id, _id)
        );
        licenceOwners[bids[_id].owner_Id].push(_licence_Id);
        publicationLicences[_publication_Id].push(_licence_Id);
        // licenceNFT._mint(users[bids[_id].owner_Id].owned_address, _licence_Id);

        emit AcceptedBid(msg.sender, _id);
    }

    /// @notice This function allows the auctioneer to reject the bids
    /// @param _id is the bid Id
    function rejectBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id,
            "User not the author of this publication"
        );
        require(
            publications[_publication_Id].isAuction,
            "Publication not an auction."
        );
        require(
            publications[_publication_Id].isRunning,
            "Auction not running."
        );
        bids[_id].status = bidStatus.Rejected;

        emit RejectedBid(msg.sender, _id);
    }

    /// @notice This function allows the auctioneer to cancel the bids
    /// @param _id is the bid Id
    function cancelBid(uint256 _id) public {
        uint256 _publication_Id = bids[_id].publication_Id;
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id ||
                userAddresses[msg.sender] == bids[_id].owner_Id,
            "User not the author of this publication"
        );
        require(
            publications[_publication_Id].isAuction,
            "Publication not an auction."
        );
        require(
            publications[_publication_Id].isRunning,
            "Auction not running."
        );
        bids[_id].status = bidStatus.Cancelled;

        emit CancelledBid(msg.sender, _id);
    }

    /// @notice This function allows the auctioneer to change from an auction to a sale
    /// @param _publication_Id publication id number
    /// @param _sell_price for the research
    function changeToSale(uint256 _publication_Id, uint256 _sell_price) public {
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id,
            "User not the author of this publication"
        );
        require(
            publications[_publication_Id].isAuction,
            "Publication is not an auction"
        );
        publications[_publication_Id].sell_price = _sell_price;
        publications[_publication_Id].isAuction = false;

        emit ChangeToSale(msg.sender, _publication_Id, _sell_price);
    }

    /// @notice This function allows the auctioneer to change from a sale to an auction
    /// @param _publication_Id publication id number
    function changeToAuction(uint256 _publication_Id) public {
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id,
            "User not the author of this publication"
        );
        require(
            !publications[_publication_Id].isAuction,
            "Publication is already on auction"
        );
        publications[_publication_Id].sell_price = 0;
        publications[_publication_Id].isAuction = true;

        emit ChangeToAuction(msg.sender, _publication_Id);
    }

    /// @notice This function allows the auctioneer to change the sell price
    /// @param _publication_Id publication id number
    /// @param _sell_price for the research
    function changeSellPrice(uint256 _publication_Id, uint256 _sell_price)
        public
    {
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id,
            "User not the author of this publication"
        );
        require(
            !publications[_publication_Id].isAuction,
            "Publication is on auction."
        );
        publications[_publication_Id].sell_price = _sell_price;

        emit ChangeSellPrice(msg.sender, _publication_Id, _sell_price);

    }

    /// @notice This function allows the auctioneer to change the running status
    /// @param _publication_Id publication id number
    function changeRunningStatus(uint256 _publication_Id) public {
        require(
            userAddresses[msg.sender] ==
                publications[_publication_Id].author_Id,
            "User not the author of this publication"
        );
        publications[_publication_Id].isRunning = !publications[_publication_Id]
            .isRunning;

        emit ChangeRunningStatus(
            msg.sender,
            _publication_Id,
            publications[_publication_Id].isRunning
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
        uint256 _userAddress = userAddresses[_address];
        return bidOwners[_userAddress];
    }

    // From the user ID, get a list of all publications owned by the user ()
    // function getPublications(uint256 _user_Id) public view returns(uint256[] memory) {
    //     return publicationOwners[_user_Id];
    // }

    // function getBids(uint256 _user_Id) public view returns(uint256[] memory) {
    //     return bidOwners[_user_Id];
    // }

    /// @return This function allows anyone to get list of bids per publication
    /// @param _publication_Id publication id number
    function getPublicationBids(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publications[_publication_Id].publication_bids;
    }

    /// @return This function allows the return of the total number of publications
    function getPublicationLength() public view returns (uint256 count) {
        return publications.length;
    }

    /// @return Returns information about a spesific publication ID
    /// @param _publication_Id publication id number
    function getPublication(uint256 _publication_Id)
        public
        view
        returns (
            uint256,
            string memory,
            uint256[] memory,
            bool,
            bool,
            uint256,
            uint256[] memory,
            uint256[] memory
        )
    {
        Publication memory _publication = publications[_publication_Id];
        return (
            _publication.author_Id,
            _publication.publication_uri,
            _publication.publication_bids,
            _publication.isAuction,
            _publication.isRunning,
            _publication.sell_price,
            _publication.contributors,
            _publication.contributors_weightings
        );
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
        return userManager._getUserId(msg.sender);
    }
}
