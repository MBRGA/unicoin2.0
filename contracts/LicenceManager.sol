pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Mintable.sol";

contract LicenceManager is Initializable, ERC721Full, ERC721Mintable {
    enum LicenceStatus {Active, Revoked}
    struct Licence {
        uint256 owner_Id;
        uint256 publication_Id;
        uint256 publicationLicenceNo;
        LicenceStatus status;
    }

    Licence[] public licences;
    // user Id to their array of licences
    mapping(uint256 => uint256[]) public licenceOwners;
    // licence Id to get the publication Id
    mapping(uint256 => uint256[]) public publicationLicences;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    address registry;
    function initialize(
        string memory _name,
        string memory _symbol,
        address _unicoinRegistry
    ) public initializer {
        ERC721.initialize();
        ERC721Enumerable.initialize();
        ERC721Metadata.initialize(_name, _symbol);
        ERC721Mintable.initialize(_unicoinRegistry);

        registry = _unicoinRegistry;
        //TODO: decide if you need this
        licences.push(Licence(0, 0, 0, LicenceStatus.Revoked));
    }

    function registerNewLicence(
        address _ownerAddress,
        uint256 _owner_Id,
        uint256 _publication_Id,
        uint256 _publicationLicenceNo
    ) public onlyRegistry returns (uint256) {
        Licence memory licence = Licence(
            _owner_Id,
            _publication_Id,
            _publicationLicenceNo,
            LicenceStatus.Active
        );
        uint256 licence_Id = licences.push(licence) - 1;

        licenceOwners[_owner_Id].push(licence_Id);
        publicationLicences[_publication_Id].push(licence_Id);

        require(
            ERC721Mintable.mint(_ownerAddress, licence_Id),
            "Licence minting failed"
        );
        return licence_Id;
    }

    function revokeLicence(uint256 _licence_Id) public onlyRegistry {
        licences[_licence_Id].status = LicenceStatus.Revoked;
    }

    function getLicenceForUser(uint256 _user_Id)
        public
        view
        returns (uint256[] memory)
    {
        return licenceOwners[_user_Id];
    }

    function allocateLicenceToNewOwner(
        uint256 _licence_Id,
        uint256 _newOwner_Id,
        address _oldNFTOwner_address,
        address _newNFTOwner_address
    ) public onlyRegistry {
        licences[_licence_Id].owner_Id = _newOwner_Id;
        ERC721.transferFrom(
            _oldNFTOwner_address,
            _newNFTOwner_address,
            _licence_Id
        );
    }

    function getLicence(uint256 _licence_Id)
        public
        view
        returns (uint256, uint256, uint256, uint8)
    {
        require(_licence_Id > 0, "Zeroth licence is not valid");
        Licence memory _licence = licences[_licence_Id];
        return (
            _licence.owner_Id,
            _licence.publication_Id,
            _licence.publicationLicenceNo,
            uint8(_licence.status)
        );
    }

    function getLicenceOwnerId(uint256 _licence_Id)
        public
        view
        returns (uint256)
    {
        return licences[_licence_Id].owner_Id;
    }

    function getPublicationLicences(uint256 _publication_Id)
        public
        view
        returns (uint256[] memory)
    {
        return publicationLicences[_publication_Id];
    }

    function getMostRecentPublicationLicence(uint256 _publication_Id)
        public
        view
        returns (uint256)
    {
        uint256 numberOfPublications = publicationLicences[_publication_Id]
            .length;
        return publicationLicences[_publication_Id][numberOfPublications - 1];
    }
}
