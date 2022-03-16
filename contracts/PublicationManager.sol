// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./patches/ERC2771ContextUpgradeable.sol";
import "./interfaces/IPublicationManager.sol";

contract PublicationManager is IPublicationManager, Initializable, ERC2771ContextUpgradeable {
    // Need a flag for unset Ids
    uint256 constant ID_NONE = type(uint256).max;

    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter _pubIds;

    address registry;

    modifier onlyRegistry() {
        require(_msgSender() == registry, "Can only be called by registry");
        _;
    }

    struct Publication {
        PricingStrategy pricingStrategy;
        string publicationUri; //IPFS blob address of the publication
        uint256 authorId; //id of the auther
        uint256 sellPrice;
        uint256 maxNumberOfLicences;
        uint256 licencesIssued;
        uint256 nextVersion;
        uint256 previousVersion;
        uint256[] auctionIds; //ids of bids on the publication
        uint256[] contributors;
        uint256[] contributorsWeightings; //scaled by 1e2 to repres entat
        uint256[] donations;
    }

    Publication[] public publications;

    mapping(uint256 => uint256[]) public publicationOwners;

    event NewPublication(uint256 indexed _authorId, string _publicationUri, PricingStrategy _pricingStrategy);

    event PublicationUpdated(uint256 indexed _authorId, string _oldUri, string _newUri);

    function initialize(address _unicoinRegistry, address _trustedForwarder) public initializer {
        __ERC2771Context_init(_trustedForwarder);

        registry = _unicoinRegistry;
    }

    function _createPublication(
        PricingStrategy _pricingStrategy,
        string calldata _publicationUri,
        uint256 _authorId,
        uint256 _fixedSellPrice,
        uint256 _maxNumberOfLicences,
        uint256[] calldata _contributors,
        uint256[] calldata _contributorsWeightings
    ) public onlyRegistry returns (uint256) {
        require(bytes(_publicationUri).length > 0, "Publication URI should not be empty.");

        if (PricingStrategy(_pricingStrategy) == PricingStrategy.FixedRate) {
            require(_fixedSellPrice > 0, "Fixed sell price cant be zero");
        } else {
            require(_fixedSellPrice == 0, "Fixed sell price must be zero for auction");
        }

        uint256[] memory auctionIds;
        uint256[] memory donations;

        Publication memory publication = Publication(
            _pricingStrategy,
            _publicationUri,
            _authorId,
            _fixedSellPrice,
            _maxNumberOfLicences,
            ID_NONE, // New publication has no next or prior versions
            ID_NONE,
            0, //start with no licences issued
            auctionIds,
            _contributors,
            _contributorsWeightings,
            donations
        );

        publications.push(publication);
        _pubIds.increment();
        uint256 publicationId = _pubIds.current();

        publicationOwners[_authorId].push(publicationId);

        // Referencing pub properties due to stack depth
        emit NewPublication(publication.authorId, publication.publicationUri, publication.pricingStrategy);

        return publicationId;
    }

    function _addAuctionToPublication(uint256 _publicationId, uint256 _auctionId) public onlyRegistry {
        uint256 licenceNo = publications[_publicationId].licencesIssued;
        require(
            licenceNo < publications[_publicationId].maxNumberOfLicences,
            "Max number of licences have been issued. Cant create a new auction"
        );
        publications[_publicationId].auctionIds.push(_auctionId);
    }

    function addNewLicenceToPublication(uint256 _publicationId) public onlyRegistry returns (uint256) {
        uint256 licenceNo = publications[_publicationId].licencesIssued + 1;
        require(
            licenceNo <= publications[_publicationId].maxNumberOfLicences,
            "Max number of licences have been issued."
        );
        publications[_publicationId].licencesIssued = licenceNo;
        return licenceNo;
    }

    function revokeLicence(uint256 _publication_Id) public onlyRegistry returns (uint256) {
        uint256 licenceNo = publications[_publication_Id].licencesIssued - 1;
        publications[_publication_Id].licencesIssued = licenceNo;
        return licenceNo;
    }

    function getAuthorId(uint256 _publicationId) public view returns (uint256) {
        return publications[_publicationId].authorId;
    }

    function _getContributers(uint256 _publicationId) public view returns (uint256[] memory, uint256[] memory) {
        return (publications[_publicationId].contributors, publications[_publicationId].contributorsWeightings);
    }

    function getLatestAuctionId(uint256 _publicationId) public view returns (uint256) {
        return publications[_publicationId].auctionIds[publications[_publicationId].auctionIds.length - 1];
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
        Publication memory publication = publications[_publicationId];
        return (
            uint8(publication.pricingStrategy),
            publication.publicationUri,
            publication.authorId,
            publication.sellPrice,
            publication.maxNumberOfLicences,
            publication.licencesIssued,
            publication.auctionIds,
            publication.contributors,
            publication.contributorsWeightings
        );
    }

    function getPublicationLength() public view returns (uint256) {
        return publications.length;
    }

    function getPublicationAuctions(uint256 _publicationId) public view returns (uint256[] memory) {
        return publications[_publicationId].auctionIds;
    }

    function GetPublicationPricingStrategy(uint256 _publicationId) public view returns (uint8) {
        return uint8(publications[_publicationId].pricingStrategy);
    }

    function getAuthorPublications(uint256 _authorId) public view returns (uint256[] memory) {
        return publicationOwners[_authorId];
    }

    function recordDonation(uint256 _publicationId, uint256 _donationAmount) public onlyRegistry {
        publications[_publicationId].donations.push(_donationAmount);
    }
}
