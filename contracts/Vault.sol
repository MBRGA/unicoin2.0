pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract Vault is Initializable {
    ERC20Upgradeable token;

    address registry;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    function initialize(address _tokenAddress, address _unicoinRegistry) public initializer {
        token = ERC20(_tokenAddress);
        registry = _unicoinRegistry;
    }

    function canAddressPay(address _address, uint256 _amount) public view returns (bool) {
        uint256 userBalance = token.balanceOf(_address);
        uint256 userContractAproval = token.allowance(_address, address(this));
        return (userBalance >= _amount) && (userContractAproval >= _amount);
    }

    function settlePayment(address _sender, address _reciver, uint256 _amount) public onlyRegistry returns (uint256) {
        token.transferFrom(_sender, _reciver, _amount);
    }

    function settleBulkPayment(
        address _sender,
        address _authorAddress,
        address[] memory _contributorAddresses,
        uint256[] memory _contributorWeightings,
        uint256 _paymentAmount
    ) public returns (bool) {
        uint256 totalPaidToContributors = 0;
        for (uint256 i = 0; i < _contributorAddresses.length; i++) {
            uint256 amountToPay = (_paymentAmount * _contributorWeightings[i]) / 1e2;
            totalPaidToContributors += _contributorWeightings[i];
            token.transferFrom(_sender, _contributorAddresses[i], amountToPay);
        }

        uint256 authorAmount = ((1e2 - totalPaidToContributors) * _paymentAmount) / 1e2;
        token.transferFrom(_sender, _authorAddress, authorAmount);
        return true;
    }
}
