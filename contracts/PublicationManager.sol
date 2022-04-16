// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./patches/ERC2771ContextUpgradeable.sol";
import "./interfaces/IPublicationManager.sol";

contract PublicationManager is IPublicationManager, Initializable, ERC2771ContextUpgradeable {
    // Need a flag for unset values where 0 is a valid option
    uint256 constant ID_NONE = type(uint256).max;

    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter _pubIds;

    address registry;

    modifier onlyRegistry() {
        require(_msgSender() == registry, "Can only be called by registry");
        _;
    }

    Publication[] public publications;

    mapping(address => uint256[]) public publicationOwners;

    event NewPublication(address indexed _publisherAddress, string _publicationUri, PricingStrategy _pricingStrategy);

    event PublicationUpdated(address indexed _ownerId, uint256 oldPubId, uint256 newPubId);

    event PublicationOwnerUpdated(address oldOwner, address newOwner, uint256 oldPubId, uint256 newPubId);

    function initialize(address _unicoinRegistry, address _trustedForwarder) public initializer {
        __ERC2771Context_init(_trustedForwarder);

        registry = _unicoinRegistry;
    }

    function _createPublication(
        PricingStrategy _pricingStrategy,
        string calldata _publicationUri,
        address _ownerAddress,
        uint256 _fixedSellPrice,
        uint8 _maxNumberOfLicences,
        Contribution[] calldata _contributors,
        Citation[] calldata _citations
    ) public onlyRegistry returns (uint256 publicationId) {
        require(bytes(_publicationUri).length > 0, "Publication URI should not be empty.");
        require(_pricingStrategy != PricingStrategy.NULL, "The NULL pricing strategy cannot be used to create a publication");

        if (_pricingStrategy == PricingStrategy.FixedRate) {
            require(_fixedSellPrice > 0, "Fixed sell price cant be zero");
        } else {
            require(_fixedSellPrice == 0, "Fixed sell price must be zero for auction");
        }

        uint256[] memory auctionIds;
        uint256[] memory donations;

        Publication memory publication = Publication(
            _pricingStrategy,
            _publicationUri, //IPFS blob address of the publication
            PublicationStatus.Published,
            _ownerAddress, // Address of publisher of this version
            _fixedSellPrice,
            _maxNumberOfLicences,
            0, // number of licenses issued starts as 0
            ID_NONE, // No previous version
            auctionIds, //ids of bids on the publication
            _contributors,
            donations,
            _citations,
            0 // No earnings to date
        );

        publications.push(publication);
        _pubIds.increment();
        publicationId = _pubIds.current();

        publicationOwners[_ownerAddress].push(publicationId);

        // Referencing pub properties due to stack depth
        emit NewPublication(
            publication.ownerAddress, 
            publication.publicationUri, 
            publication.pricingStrategy
        );

        return publicationId;
    }

    function _replacePublication(
        uint256 publicationId,
        PricingStrategy pricingStrategy,
        string calldata publicationUri,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        Contribution[] calldata contributors,
        Citation[] calldata citations
    ) public onlyRegistry returns (uint256 newPublicationId) {

        Publication storage oldpub = publications[publicationId];

        require(oldpub.publicationStatus != PublicationStatus.Unitialized &&
            oldpub.publicationStatus != PublicationStatus.Replaced,
            "Contract is in an invalid state to be updated");

        Publication memory newpub = Publication(
            oldpub.pricingStrategy,
            oldpub.publicationUri,
            oldpub.publicationStatus,
            oldpub.ownerAddress,
            oldpub.sellPrice,
            oldpub.maxNumberOfLicences,
            oldpub.licencesIssued,
            publicationId,
            oldpub.auctionIds,
            oldpub.contributors,
            oldpub.donations,
            oldpub.citations,
            oldpub.lifetimeEarnings
        );

        if (pricingStrategy != PricingStrategy.NULL) newpub.pricingStrategy = pricingStrategy;
        if (bytes(publicationUri).length != 0) newpub.publicationUri = publicationUri;
        if (fixedSellPrice != ID_NONE) newpub.sellPrice = fixedSellPrice;
        if (maxNumberOfLicences != ID_NONE) newpub.maxNumberOfLicences = maxNumberOfLicences;
        if (contributors.length != 0) newpub.contributors = contributors;
        if (citations.length != 0) newpub.citations = citations;

        publications.push(newpub);
        _pubIds.increment();
        newPublicationId = _pubIds.current();

        emit PublicationUpdated(oldpub.ownerAddress, publicationId, newPublicationId);

        return newPublicationId;
    }

    function _changeOwner(
        uint256 publicationId,
        address newOwner
    ) public onlyRegistry returns (uint256 newPublicationId) {

        Publication storage oldpub = publications[publicationId];

        require(oldpub.publicationStatus != PublicationStatus.Unitialized &&
            oldpub.publicationStatus != PublicationStatus.Replaced,
            "Contract is in an invalid state to be updated");

        require(newOwner != address(0), "New owner must be a valid address");

        Publication memory newpub = Publication(
            oldpub.pricingStrategy,
            oldpub.publicationUri,
            oldpub.publicationStatus,
            newOwner,
            oldpub.sellPrice,
            oldpub.maxNumberOfLicences,
            oldpub.licencesIssued,
            publicationId,
            oldpub.auctionIds,
            oldpub.contributors,
            oldpub.donations,
            oldpub.citations,
            oldpub.lifetimeEarnings
        );

        publications.push(newpub);
        _pubIds.increment();
        newPublicationId = _pubIds.current();

        publicationOwners[newOwner].push(newPublicationId);

        emit PublicationOwnerUpdated(oldpub.ownerAddress, newOwner, publicationId, newPublicationId);

        return newPublicationId;
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

    function getOwnerAddress(uint256 _publicationId) external view returns (address) {
        return publications[_publicationId].ownerAddress;
    }

    function _getContributors(uint256 _publicationId) external view returns (Contribution[] memory) {
        return publications[_publicationId].contributors;
    }

    function getLatestAuctionId(uint256 _publicationId) public view returns (uint256) {
        return publications[_publicationId].auctionIds[publications[_publicationId].auctionIds.length - 1];
    }

    function getPublication(uint256 _publicationId)
        public
        view
        returns (Publication memory)
        /*returns (
            uint8,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        )*/
    {
        return publications[_publicationId];

        /*Publication memory publication = publications[_publicationId];
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
        );*/
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

    function getAllPublications(address _publisherAddress) public view returns (uint256[] memory) {
        return publicationOwners[_publisherAddress];
    }

    function recordDonation(uint256 _publicationId, uint256 _donationAmount) public onlyRegistry {
        publications[_publicationId].donations.push(_donationAmount);
    }
}
