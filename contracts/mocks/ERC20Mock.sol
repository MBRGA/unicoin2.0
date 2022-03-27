pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract ERC20Mock is ERC20Upgradeable {
    function mint(address _recepient, uint256 _supply) public {
        _mint(_recepient, _supply);
    }
}
