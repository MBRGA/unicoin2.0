pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Mintable.sol";
contract LicenceManager is Initializable, ERC721Full, ERC721Mintable {
    struct Licence {
        uint256 buyer_Id;
        uint256 publication_Id;
        uint256 publicationLicenceNo;
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
        ERC721Mintable.initialize(msg.sender);

        registry = _unicoinRegistry;

        licences.push(Licence(0, 0, 0));
    }

    function registerNewLicence(
        address _ownerAddress,
        uint256 _buyer_Id,
        uint256 _publication_Id,
        uint256 _publicationLicenceNo
    ) public onlyRegistry {
        Licence memory licence = Licence(
            _buyer_Id,
            _publication_Id,
            _publicationLicenceNo
        );
        uint256 licence_Id = licences.push(licence) - 1;

        licenceOwners[_buyer_Id].push(licence_Id);
        publicationLicences[_publication_Id].push(licence_Id);

        require(
            ERC721Mintable.mint(_ownerAddress, licence_Id),
            "Licence minting failed"
        );
    }

}
