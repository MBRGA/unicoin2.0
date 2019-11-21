pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

import "openzeppelin-solidity/contracts/token/ERC721/ERC72Mintable.sol";
contract LicenceManager is Initializable, ERC721Full, ERC721Mintable {
    function initialize(string memory _name, string memory _symbol) public initializer {
        ERC721.initialize();
        ERC721Enumerable.initialize();
        ERC721Metadata.initialize(_name, _symbol);
        ERC721Mintable.initialize(msg.sender);
    }
}