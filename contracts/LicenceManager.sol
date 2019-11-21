pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Mintable.sol";
contract LicenceManager is Initializable, ERC721Full, ERC721Mintable {

    modifier onlyRegistry(){
        require(msg.sender == registry,"Can only be called by registry");
        _;
    }

    address registry;
    function initialize(string memory _name, string memory _symbol, address _unicoinRegistry) public initializer {
        ERC721.initialize();
        ERC721Enumerable.initialize();
        ERC721Metadata.initialize(_name, _symbol);
        ERC721Mintable.initialize(msg.sender);

        registry = _unicoinRegistry;
    }
}