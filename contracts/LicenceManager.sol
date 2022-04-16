// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./patches/ERC2771ContextUpgradeable.sol";
import "./interfaces/ILicenceManager.sol";

contract LicenceManager is Initializable, ERC721Upgradeable, ILicenceManager, ERC2771ContextUpgradeable {
    using Counters for Counters.Counter;

    Counters.Counter private _licenceIds;

    Licence[] public licences;
    // user Id to their array of licences
    mapping(address => uint256[]) public licenceOwners;
    // publication Id to array of licence IDs
    mapping(uint256 => uint256[]) public publicationLicences;

    modifier onlyRegistry() {
        require(_msgSender() == registry, "Can only be called by registry");
        _;
    }

    address registry;

    function initialize(string memory _name, string memory _symbol, address _unicoinRegistry, address _trustedForwarder)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);
        __ERC2771Context_init(_trustedForwarder);

        //ERC721Enumerable.initialize();
        //ERC721Metadata.initialize(_name, _symbol);
        //ERC721Mintable.initialize(_unicoinRegistry);

        registry = _unicoinRegistry;
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

    function registerNewLicence(
        address _ownerAddress,
        //uint256 _ownerId,
        uint256 _publicationId,
        uint256 _publicationLicenceNo
    ) public onlyRegistry returns (uint256) {
        Licence memory licence = Licence(_ownerAddress, _publicationId, _publicationLicenceNo, LicenceStatus.Active);

        licences.push(licence);
        _licenceIds.increment();
        uint256 licenceId = _licenceIds.current();

        //uint256 licenceId = licences.push(licence) - 1;

        licenceOwners[_ownerAddress].push(licenceId);

        publicationLicences[_publicationId].push(licenceId);

        _safeMint(_ownerAddress, licenceId);
        approve(registry, licenceId);

        //require(ERC721Mintable.mint(_ownerAddress, licenceId), "Licence minting failed");

        return licenceId;
    }

    function revokeLicence(uint256 _licenceId) public onlyRegistry {
        licences[_licenceId].status = LicenceStatus.Revoked;
        licences[_licenceId].publicationLicenceNo -= 1;
    }

    function getLicenceForUser(address _userAddress) public view returns (uint256[] memory) {
        return licenceOwners[_userAddress];
    }

    function allocateLicenceToNewOwner(
        uint256 _licenceId,
        //uint256 _newOwnerId,
        address _oldOwnerAddress,
        address _newOwnerAddress
    ) public onlyRegistry {
        licences[_licenceId].ownerAddress = _newOwnerAddress;
        transferFrom(_oldOwnerAddress, _newOwnerAddress, _licenceId);
    }

    function getLicence(uint256 _licenceId) public view returns (Licence memory) {
        //Licence memory _licence = licences[_licenceId];
        //return (_licence.ownerAddress, _licence.publicationId, _licence.publicationLicenceNo, uint8(_licence.status));
        return licences[_licenceId];
    }

    function getLicenceOwnerAddress(uint256 _licenceId) public view returns (address) {
        return licences[_licenceId].ownerAddress;
    }

    function getPublicationLicences(uint256 _publicationId) public view returns (uint256[] memory) {
        return publicationLicences[_publicationId];
    }

    function getMostRecentPublicationLicence(uint256 _publicationId) public view returns (uint256) {
        uint256 numberOfLicences = getPublicationLicences(_publicationId).length;

        require(numberOfLicences > 0, "no licences found");

        return getPublicationLicences(_publicationId)[numberOfLicences - 1];

    }
}
