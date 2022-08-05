// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
//import "./patches/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "./interfaces/IPublicationManager.sol";
import "./library/SharedStructures.sol";

contract PublicationManager is IPublicationManager, Initializable, ERC2771ContextUpgradeable {
    // Need a flag for unset values where 0 is a valid option
    uint256 constant ID_NONE = type(uint256).max;

    address immutable _registry;

    modifier onlyRegistry() {
        require(_msgSender() == _registry, "Can only be called by registry");
        _;
    }

    SharedStructures.Publication[] public publications;
    SharedStructures.Contribution[][] public  _contributions;
    SharedStructures.Citation[][] public _citations;

    mapping(address => uint256[]) public publicationOwners;

    event NewPublication(address indexed _publisherAddress, string _publicationUri, SharedStructures.PricingStrategy _pricingStrategy);

    event PublicationUpdated(address indexed _ownerId, uint256 oldPubId, uint256 newPubId);

    event PublicationOwnerUpdated(address oldOwner, address newOwner, uint256 oldPubId, uint256 newPubId);


    // This contract is upgradeable, but we can use constructor instead of initializer for optimisation benefits for immutables.
    constructor (address unicoinRegistry, address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) initializer {
        _registry = unicoinRegistry;
    }


    function _createPublication(
        SharedStructures.PricingStrategy _pricingStrategy,
        string calldata _publicationUri,
        address _ownerAddress,
        uint256 _fixedSellPrice,
        uint8 _maxNumberOfLicences,
        SharedStructures.Contribution[] calldata contributors,
        SharedStructures.Citation[] calldata citations
    ) public onlyRegistry returns (uint256 publicationId) {
        require(bytes(_publicationUri).length > 0, "Publication URI should not be empty.");
        require(_pricingStrategy != SharedStructures.PricingStrategy.NULL, "The NULL pricing strategy cannot be used to create a publication");

        if (_pricingStrategy == SharedStructures.PricingStrategy.FixedRate) {
            require(_fixedSellPrice > 0, "Fixed sell price cant be zero");
        } else {
            require(_fixedSellPrice == 0, "Fixed sell price must be zero for auction");
        }

        uint256[] memory auctionIds;
        uint256[] memory donations;

        //SharedStructures.Citation[] storage __citations = citations;

        _citations.push(citations);
        //uint256 citationsId = _citations.length - 1;

        _contributions.push(contributors);
        //uint256 contributionsId = _contributions.length - 1;
        

        SharedStructures.Publication memory publication = SharedStructures.Publication(
            _pricingStrategy,
            _publicationUri, //IPFS blob address of the publication
            SharedStructures.PublicationStatus.Published,
            _ownerAddress, // Address of publisher of this version
            _fixedSellPrice,
            _maxNumberOfLicences,
            0, // number of licenses issued starts as 0
            ID_NONE, // No previous version
            auctionIds, //ids of bids on the publication
            _contributions.length - 1, //contributionsId,
            donations,
            _citations.length - 1, //citationsId,
            0 // No earnings to date
        );

        publications.push(publication);
        //publicationId = publications.length - 1;

        // publications.length - 1 is the publication id
        publicationOwners[_ownerAddress].push(publications.length - 1);

        // Referencing pub properties due to stack depth
        emit NewPublication(
            publication.ownerAddress, 
            publication.publicationUri, 
            publication.pricingStrategy
        );

        return publications.length - 1;
    }

    function _replacePublication(
        uint256 publicationId,
        SharedStructures.PricingStrategy pricingStrategy,
        string calldata publicationUri,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        SharedStructures.Contribution[] calldata contributors,
        SharedStructures.Citation[] calldata citations
    ) public onlyRegistry returns (uint256 newPublicationId) {

        SharedStructures.Publication storage oldpub = publications[publicationId];

        require(oldpub.publicationStatus != SharedStructures.PublicationStatus.Unitialized &&
            oldpub.publicationStatus != SharedStructures.PublicationStatus.Replaced,
            "Contract is in an invalid state to be updated");

        SharedStructures.Publication memory newpub = SharedStructures.Publication(
            oldpub.pricingStrategy,
            oldpub.publicationUri,
            oldpub.publicationStatus,
            oldpub.ownerAddress,
            oldpub.sellPrice,
            oldpub.maxNumberOfLicences,
            oldpub.licencesIssued,
            publicationId,
            oldpub.auctionIds,
            oldpub.contributionsId,
            oldpub.donations,
            oldpub.citationsId,
            oldpub.lifetimeEarnings
        );

        if (pricingStrategy != SharedStructures.PricingStrategy.NULL) newpub.pricingStrategy = pricingStrategy;
        if (bytes(publicationUri).length != 0) newpub.publicationUri = publicationUri;
        if (fixedSellPrice != ID_NONE) newpub.sellPrice = fixedSellPrice;
        if (maxNumberOfLicences != ID_NONE) newpub.maxNumberOfLicences = maxNumberOfLicences;
        if (contributors.length != 0) {
            _contributions.push(contributors);
            newpub.contributionsId = _contributions.length - 1;
        }
        if (citations.length != 0) {
            _citations.push(citations);
            newpub.citationsId = citations.length - 1;
        }

        publications.push(newpub);
        newPublicationId = publications.length - 1;

        emit PublicationUpdated(oldpub.ownerAddress, publicationId, newPublicationId);

        return newPublicationId;
    }

    function _changeOwner(
        uint256 publicationId,
        address newOwner
    ) public onlyRegistry returns (uint256 newPublicationId) {

        SharedStructures.Publication storage oldpub = publications[publicationId];

        require(oldpub.publicationStatus != SharedStructures.PublicationStatus.Unitialized &&
            oldpub.publicationStatus != SharedStructures.PublicationStatus.Replaced,
            "Contract is in an invalid state to be updated");

        require(newOwner != address(0), "New owner must be a valid address");

        SharedStructures.Publication memory newpub = SharedStructures.Publication(
            oldpub.pricingStrategy,
            oldpub.publicationUri,
            oldpub.publicationStatus,
            newOwner,
            oldpub.sellPrice,
            oldpub.maxNumberOfLicences,
            oldpub.licencesIssued,
            publicationId,
            oldpub.auctionIds,
            oldpub.contributionsId,
            oldpub.donations,
            oldpub.citationsId,
            oldpub.lifetimeEarnings
        );

        publications.push(newpub);
        newPublicationId = publications.length - 1;

        publicationOwners[newOwner].push(newPublicationId);

        emit PublicationOwnerUpdated(oldpub.ownerAddress, newOwner, publicationId, newPublicationId);

        return newPublicationId;
    }

    function _addAuctionToPublication(uint256 publicationId, uint256 _auctionId) public onlyRegistry {
        uint256 licenceNo = publications[publicationId].licencesIssued;
        require(
            licenceNo < publications[publicationId].maxNumberOfLicences,
            "Max number of licences have been issued. Cant create a new auction"
        );
        publications[publicationId].auctionIds.push(_auctionId);
    }

    function _addNewLicenceToPublication(uint256 publicationId) public onlyRegistry returns (uint256) {
        uint256 licenceNo = publications[publicationId].licencesIssued + 1;
        require(
            licenceNo <= publications[publicationId].maxNumberOfLicences,
            "Max number of licences have been issued."
        );
        publications[publicationId].licencesIssued = licenceNo;
        return licenceNo;
    }

    function _revokeLicence(uint256 publicationId) public onlyRegistry returns (uint256) {
        uint256 licenceNo = publications[publicationId].licencesIssued - 1;
        publications[publicationId].licencesIssued = licenceNo;
        return licenceNo;
    }

    function _recordDonation(uint256 publicationId, uint256 donationAmount) public onlyRegistry {
        publications[publicationId].donations.push(donationAmount);
    }

    function getOwnerAddress(uint256 publicationId) external view returns (address) {
        return publications[publicationId].ownerAddress;
    }

    function getContributors(uint256 publicationId) external view returns (SharedStructures.Contribution[] memory) {
        uint256 contributionsId = publications[publicationId].contributionsId;

        return _contributions[contributionsId];
    }

    function getLatestAuctionId(uint256 publicationId) public view returns (uint256) {
        return publications[publicationId].auctionIds[publications[publicationId].auctionIds.length - 1];
    }

    function getPublication(uint256 publicationId)
        public
        view
        returns (SharedStructures.Publication memory)
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
        return publications[publicationId];

        /*Publication memory publication = publications[publicationId];
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

    function getPublicationAuctions(uint256 publicationId) public view returns (uint256[] memory) {
        return publications[publicationId].auctionIds;
    }

    function getPublicationPricingStrategy(uint256 publicationId) public view returns (uint8) {
        return uint8(publications[publicationId].pricingStrategy);
    }

    function getAllPublications(address _publisherAddress) public view returns (uint256[] memory) {
        return publicationOwners[_publisherAddress];
    }
}
