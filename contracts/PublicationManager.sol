pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract PublicationManager is Initializable {
    enum PricingStratergy {PrivateAuction, FixedRate}

    struct Publication {
        PricingStratergy pricingStratergy;
        string publication_uri; //IPFS blob address of the publication
        uint256 author_id; //id of the auther
        uint256 sell_price;
        uint256 maxNumberOfLicences;
        uint256[] auction_ids; //ids of bids on the publication
        uint256[] contributors;
        uint256[] contributors_weightings; //scaled by 1e2 to repres entat
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
        uint256 indexed _author_Id,
        string _publication_uri,
        PricingStratergy _pricingStratergy
    );

    function initialize(address _unicoinRegistry) public initializer {
        registry = _unicoinRegistry;
    }

    function _createPublication(
        uint8 _pricing_stratergy,
        string memory _publication_uri,
        uint256 _author_Id,
        uint256 _fixed_sell_price,
        uint256 _maxNumberOfLicences,
        uint256[] memory _contributors,
        uint256[] memory _contributors_weightings
    ) public onlyRegistry returns (uint256) {
        require(
            bytes(_publication_uri).length > 0,
            "Publication URI should not be empty."
        );

        if(PricingStratergy(_pricing_stratergy) == PricingStratergy.FixedRate){
            require(_fixed_sell_price >= 0, "Fixed sell price cant be zero");
        }
        else {
            require(_fixed_sell_price == 0, "Fixed sell price must be zero for auction");
        }
        
        uint256[] memory auction_ids;
        Publication memory publication = Publication(
            PricingStratergy(_pricing_stratergy),
            _publication_uri,
            _author_Id,
            _fixed_sell_price,
            _maxNumberOfLicences,
            auction_ids,
            _contributors,
            _contributors_weightings
        );
        uint256 publicationId = publications.push(publication) - 1;
        publicationOwners[_author_Id].push(publicationId);

        emit NewPublication(
            _author_Id,
            _publication_uri,
            PricingStratergy(_pricing_stratergy)
        );

        return (publicationId);
    }

    function _addAuctionToPublication(uint256 _publicationId, uint256 _auctionId) public onlyRegistry{
        publications[_publicationId].auction_ids.push(_auctionId);
    }

    function _getAuthorId(uint256 _publication_Id) public view returns (uint256) {
        return publications[_publication_Id].author_id;
    }

    function _getContributers(uint256 _publication_Id) public view returns (uint256[] memory, uint256[] memory) {
        return (publications[_publication_Id].contributors, publications[_publication_Id].contributors_weightings);
    }
}
