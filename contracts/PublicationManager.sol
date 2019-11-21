pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract PublicationManager is Initializable {
    enum PricingStratergy {fixedRate, controlledAuction, privateAuction}

    struct Publication {
        uint256 author_id; //id of the auther
        string publication_uri; //IPFS blob address of the publication
        uint256[] auction_ids; //ids of bids on the publication
        PricingStratergy pricingStratergy;
        uint256 sell_price;
        uint256[] contributors;
        uint256[] contributors_weightings;
    }
    /// @notice Creates an array of publications for every published document
    Publication[] public publications;

    /// @notice The mapping below will map the addresses of all the successful bidders' addresses to the ID of their owned publications
    mapping(uint256 => uint256[]) public publicationOwners;

    address registry;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    event NewPublication(
        uint256 indexed _author_id,
        string _publication_uri,
        PricingStratergy _pricingStratergy,
    );

    function initialize(address _unicoinRegistry) public initializer {
        registry = _unicoinRegistry;
    }

    function _createPublication(
        string memory _publication_uri,
        uint256 _author_id,
        uint8 _pricing_stratergy,
        uint256[] memory _contributors,
        uint256[] memory _contributors_weightings
    ) public onlyRegistry returns (uint256) {
        require(
            bytes(_publication_uri).length > 0,
            "Publication URI should not be empty."
        );

        uint256[] memory auction_ids;
        Publication memory _publication = Publication(
            _author_id,
            _publication_uri,
            auction_ids,
            PricingStratergy(_pricing_stratergy),
            _contributors,
            _contributors_weightings
        );
        uint256 publicationId = publications.push(_publication) - 1;
        publicationOwners[_author_id].push(publicationId);

        emit NewPublication(
            _author_id,
            _publication_uri,
            PricingStratergy(_pricing_stratergy),

        );

        return (publicationId);
    }

    function _addAuctionToPublication(uint256 _publicationId, uint256 _auctionId) public onlyRegistry{
        publications[_publicationId].auction_ids.push(_auctionId);
    }
}
