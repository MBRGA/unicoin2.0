pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

contract Vault is Initializable {

    ERC20 token;

    address registry;

    modifier onlyRegistry(){
        require(msg.sender == registry,"Can only be called by registry");
        _;
    }

    function initialize(address _tokenAddress, address _unicoinRegistry) public initializer {
        token = ERC20(_tokenAddress);
        registry = _unicoinRegistry;
    }

    function canBidderPay(address _address, uint256 _amount) public view returns (bool) {
        uint256 userBalance = token.balanceOf(_address);
        uint256 userContractAproval = token.allowance(_address, address(this));
        return (userBalance >= _amount) && (userContractAproval >= _amount);
    }

    function settlePayment(address _sender, address _reciver, uint256 _amount) public onlyRegistry returns (uint256) {
        token.transferFrom(_sender, _reciver, _amount);
    }
}