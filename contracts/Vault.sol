pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

contract Vault is Initializable {

    ERC20 daiContract;
    function initialize(address _daiContractAddress) public initializer {
        daiContract = ERC20(_daiContractAddress);
    }

    function canBidderPay(address _address, uint256 _amount) public view returns (bool) {
        uint256 userBalance = daiContract.balanceOf(_address);
        uint256 userContractAproval = daiContract.allowance(_address, address(this));
        return (userBalance >= _amount) && (userContractAproval >= _amount);
    }
}