pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract PublicationManager is Initializable {
    enum PricingStrategy {PrivateAuction, FixedRate}

    struct Publication {
        PricingStrategy pricingStrategy;
        string publication_uri; //IPFS blob address of the publication
        uint256 author_id; //id of the auther
        uint256 sell_price;
        uint256 maxNumberOfLicences;
        uint256 licencesIssued;
        uint256[] auction_ids; //ids of bids on the publication
        uint256[] contributors;
        uint256[] contributors_weightings; //scaled by 1e2 to repres entat
        uint256[] donations;
    }

    Publication[] public publications;

    mapping(uint256 => uint256[]) public publicationOwners;

    address registry;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    event NewPublication(
        uint256 indexed _author_Id,
        string _publication_uri,
        PricingStrategy _pricingStrategy
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

        if (PricingStrategy(_pricing_stratergy) == PricingStrategy.FixedRate) {
            require(_fixed_sell_price >= 0, "Fixed sell price cant be zero");
        } else {
            require(
                _fixed_sell_price == 0,
                "Fixed sell price must be zero for auction"
            );
        }

        uint256[] memory auction_ids;
        uint256[] memory donations;
        Publication memory publication = Publication(
            PricingStrategy(_pricing_stratergy),
            _publication_uri,
            _author_Id,
            _fixed_sell_price,
            _maxNumberOfLicences,
            0, //start with no licences issued
            auction_ids,
            _contributors,
            _contributors_weightings,
            donations
        );
        uint256 publicationId = publications.push(publication) - 1;
        publicationOwners[_author_Id].push(publicationId);

        emit NewPublication(
            _author_Id,
            _publication_uri,
            PricingStrategy(_pricing_stratergy)
        );

        return (publicationId);
    }

    function _addAuctionToPublication(
        uint256 _publication_Id,
        uint256 _auction_Id
    ) public onlyRegistry {
        uint256 licenceNo = publications[_publication_Id].licencesIssued;
        require(
            licenceNo < publications[_publication_Id].maxNumberOfLicences,
            "Max number of licences have been issued. Cant create a new auction"
        );
        publications[_publication_Id].auction_ids.push(_auction_Id);
    }

    function addNewLicenceToPublication(uint256 _publication_Id)
        public
        onlyRegistry
        returns (uint256)
    {
        uint256 licenceNo = publications[_publication_Id].licencesIssued + 1;
        require(
            licenceNo <= publications[_publication_Id].maxNumberOfLicences,
            "Max number of licences have been issued."
        );
        publications[_publication_Id].licencesIssued = licenceNo;
        return licenceNo;
    }

    function getAuthorId(uint256 _publication_Id)
        public
        view
        returns (uint256)
    {
        return publications[_publication_Id].author_id;
    }

    function _getContributers(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory, uint256[] memory)
    {
        return (
            publications[_publication_Id].contributors,
            publications[_publication_Id].contributors_weightings
        );
    }

    function getLatestAuctionId(uint256 _publication_Id)
        public
        view
        returns (uint256)
    {
        return
            publications[_publication_Id]
                .auction_ids[publications[_publication_Id].auction_ids.length -
                1];
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
        Publication memory publication = publications[_publication_Id];
        return (
            uint8(publication.pricingStrategy),
            publication.publication_uri,
            publication.author_id,
            publication.sell_price,
            publication.maxNumberOfLicences,
            publication.licencesIssued,
            publication.auction_ids,
            publication.contributors,
            publication.contributors_weightings
        );
    }

    function getPublicationLength() public view returns (uint256) {
        return publications.length;
    }

    function getPublicationAuctions(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publications[_publication_Id].auction_ids;
    }

    function getAuthorPublications(uint256 _author_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publicationOwners[_author_Id];
    }

    function recordDonation(uint256 _publication_Id, uint256 _donationAmount)
        public
        onlyRegistry
    {
        publications[_publication_Id].donations.push(_donationAmount);
    }
}
