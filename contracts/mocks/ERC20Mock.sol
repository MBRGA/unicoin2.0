pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
  function mint(address _recepient, uint256 _supply) public {
    _mint(_recepient, _supply);
  }
}
