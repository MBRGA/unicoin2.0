// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Full.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Mintable.sol";

contract LicenceManager is Initializable, ERC721URIStorageUpgradeable {
    enum LicenceStatus { Active, Revoked }
    struct Licence {
        uint256 ownerId;
        uint256 publicationId;
        uint256 publicationLicenceNo;
        LicenceStatus status;
    }

    Licence[] public licences;
    // user Id to their array of licences
    mapping(uint256 => uint256[]) public licenceOwners;
    // publication Id to array of licnces IDs
    mapping(uint256 => uint256[]) public publicationLicences;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    address registry;
    function initialize(string memory _name, string memory _symbol, address _unicoinRegistry) public initializer {

        __ERC721_init_unchained(_name, _symbol);

        //ERC721.initialize();
        //ERC721Enumerable.initialize();
        //ERC721Metadata.initialize(_name, _symbol);
        //ERC721Mintable.initialize(_unicoinRegistry);

        registry = _unicoinRegistry;
    }

    function registerNewLicence(
        address _ownerAddress,
        uint256 _ownerId,
        uint256 _publicationId,
        uint256 _publicationLicenceNo
    ) public onlyRegistry returns (uint256) {

        Licence memory licence = Licence(_ownerId, _publicationId, _publicationLicenceNo, LicenceStatus.Active);

        licences.push(licence);

        uint256 licenceId = licences.length - 1;

        //uint256 licenceId = licences.push(licence) - 1;

        licenceOwners[_ownerId].push(licenceId);
        publicationLicences[_publicationId].push(licenceId);

        //require(_safeMint(_ownerAddress, licenceId), "Licence minting failed");
        _safeMint(_ownerAddress, licenceId);
        return licenceId;
    }

    function revokeLicence(uint256 _licenceId) public onlyRegistry {
        licences[_licenceId].status = LicenceStatus.Revoked;
        licences[_licenceId].publicationLicenceNo -= 1;
    }

    function getLicenceForUser(uint256 _userId) public view returns (uint256[] memory) {
        return licenceOwners[_userId];
    }

    function allocateLicenceToNewOwner(
        uint256 _licenceId,
        uint256 _newOwnerId,
        address _oldNFTOwner_address,
        address _newNFTOwner_address
    ) public onlyRegistry {
        licences[_licenceId].ownerId = _newOwnerId;
        transferFrom(_oldNFTOwner_address, _newNFTOwner_address, _licenceId);
    }

    function getLicence(uint256 _licenceId) public view returns (uint256, uint256, uint256, uint8) {
        Licence memory _licence = licences[_licenceId];
        return (_licence.ownerId, _licence.publicationId, _licence.publicationLicenceNo, uint8(_licence.status));
    }

    function getLicenceOwnerId(uint256 _licenceId) public view returns (uint256) {
        return licences[_licenceId].ownerId;
    }

    function getPublicationLicences(uint256 _publicationId) public view returns (uint256[] memory) {
        return publicationLicences[_publicationId];
    }

    function getMostRecentPublicationLicence(uint256 _publicationId) public view returns (uint256) {
        uint256 numberOfLicences = getPublicationLicences(_publicationId).length;
        require(numberOfLicences > 0, "no licences found");
        return getPublicationLicences(_publicationId)[numberOfLicences - 1];
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId) || _msgSender() == registry,
            "ERC721: transfer caller is not owner nor approved nor registry"
        );
        safeTransferFrom(from, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId) || _msgSender() == registry,
            "ERC721: transfer caller is not owner nor approved nor registry"
        );
        transferFrom(from, to, tokenId);
        //_transfer(from, to, tokenId);
    }
}
