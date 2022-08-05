//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
//import "./patches/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "./interfaces/IVault.sol";
import "./library/SharedStructures.sol";

contract Vault is Initializable, IVault, ERC2771ContextUpgradeable {
    IERC20Upgradeable token;

    address immutable _registry;

    modifier onlyRegistry() {
        require(_msgSender() == _registry, "Can only be called by registry");
        _;
    }

    // This contract is upgradeable, but we can use constructor instead of initializer for optimisation benefits for immutables.
    constructor (address unicoinRegistry, address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) initializer {
        _registry = unicoinRegistry;
    }

    function initialize(address _tokenAddress) public initializer {
        token = IERC20Upgradeable(_tokenAddress);
    }

    function canAddressPay(address _address, uint256 amount) public view returns (bool) {
        uint256 userBalance = token.balanceOf(_address);
        uint256 userContractApproval = token.allowance(_address, address(this));
        return (userBalance >= amount) && (userContractApproval >= amount);
    }

    function _settlePayment(address sender, address receiver, uint256 amount) public onlyRegistry returns (bool) {
        return token.transferFrom(sender, receiver, amount);
    }

    function _settleBulkPayment(
        address sender,
        address ownerAddress,
        SharedStructures.Contribution[] calldata contributors,
        uint256 paymentAmount
    ) public onlyRegistry returns (bool success) {
        uint256 totalPaidToContributors = 0;

        success = false;

        for (uint256 i = 0; i < contributors.length; i++) {
            uint256 amountToPay = (paymentAmount * contributors[i].weighting) / 1e2;
            totalPaidToContributors += contributors[i].weighting;
            require(token.transferFrom(sender, contributors[i].contributorAddress, amountToPay), "Component of bulk payment failed");
        }

        /*for (uint256 i = 0; i < _contributorAddresses.length; i++) {
            uint256 amountToPay = (_paymentAmount * _contributorWeightings[i]) / 1e2;
            totalPaidToContributors += _contributorWeightings[i];
            token.transferFrom(sender, _contributorAddresses[i], amountToPay);
        }*/

        uint256 authorAmount = ((1e2 - totalPaidToContributors) * paymentAmount) / 1e2;
        token.transferFrom(sender, ownerAddress, authorAmount);
        return true;
    }
}
