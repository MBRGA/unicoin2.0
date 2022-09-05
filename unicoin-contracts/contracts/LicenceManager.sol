// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
//import "./patches/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "./interfaces/ILicenceManager.sol";
import "./library/SharedStructures.sol";

contract LicenceManager is Initializable, ERC721Upgradeable, ILicenceManager, ERC2771ContextUpgradeable {

    SharedStructures.Licence[] public licences;
    // user Id to their array of licences
    mapping(address => uint256[]) public licenceOwners;
    // publication Id to array of licence IDs
    mapping(uint256 => uint256[]) public publicationLicences;

    modifier onlyRegistry() {
        require(_msgSender() == _registry, "Can only be called by registry");
        _;
    }

    address immutable _registry;
    
    // This contract is upgradeable, but we can use constructor instead of initializer for optimisation benefits for immutables.
    constructor(address unicoinRegistry, address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) initializer {
        _registry = unicoinRegistry;
    }

    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);

        //ERC721Enumerable.initialize();
        //ERC721Metadata.initialize(_name, _symbol);
        //ERC721Mintable.initialize(_unicoinRegistry);
    }

    function _msgSender()
        internal
        view
        virtual
        override(ERC2771ContextUpgradeable, ContextUpgradeable)
        returns (address sender)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(ERC2771ContextUpgradeable, ContextUpgradeable)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }

    function _registerNewLicence(
        address ownerAddress,
        //uint256 _ownerId,
        uint256 publicationId,
        uint256 publicationLicenceNo
    ) public onlyRegistry returns (uint256) {
        SharedStructures.Licence memory licence = SharedStructures.Licence(ownerAddress, publicationId, publicationLicenceNo, SharedStructures.LicenceStatus.Active);

        licences.push(licence);
        uint256 licenceId = licences.length - 1;

        //uint256 licenceId = licences.push(licence) - 1;

        licenceOwners[ownerAddress].push(licenceId);

        publicationLicences[publicationId].push(licenceId);

        _safeMint(ownerAddress, licenceId);
        approve(_registry, licenceId);

        //require(ERC721Mintable.mint(ownerAddress, licenceId), "Licence minting failed");

        return licenceId;
    }

    function _revokeLicence(uint256 licenceId) public onlyRegistry {
        licences[licenceId].status = SharedStructures.LicenceStatus.Revoked;
        licences[licenceId].publicationLicenceNo -= 1;
    }

    function getLicenceForUser(address _userAddress) public view returns (uint256[] memory) {
        return licenceOwners[_userAddress];
    }

    function _allocateLicenceToNewOwner(
        uint256 licenceId,
        //uint256 _newOwnerId,
        address _oldOwnerAddress,
        address _newOwnerAddress
    ) public onlyRegistry {
        licences[licenceId].ownerAddress = _newOwnerAddress;
        transferFrom(_oldOwnerAddress, _newOwnerAddress, licenceId);
    }

    function getLicence(uint256 licenceId) public view returns (SharedStructures.Licence memory) {
        //Licence memory _licence = licences[licenceId];
        //return (_licence.ownerAddress, _licence.publicationId, _licence.publicationLicenceNo, uint8(_licence.status));
        return licences[licenceId];
    }

    function getLicenceOwnerAddress(uint256 licenceId) public view returns (address) {
        return licences[licenceId].ownerAddress;
    }

    function getPublicationLicences(uint256 publicationId) public view returns (uint256[] memory) {
        return publicationLicences[publicationId];
    }

    function getMostRecentPublicationLicence(uint256 publicationId) public view returns (uint256) {
        uint256 numberOfLicences = getPublicationLicences(publicationId).length;

        require(numberOfLicences > 0, "no licences found");

        return getPublicationLicences(publicationId)[numberOfLicences - 1];

    }
}