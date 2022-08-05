// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '../library/SharedStructures.sol';

interface IVault {
    //function initialize(address _tokenAddress, address _unicoinRegistry, address _trustedForwarder)
    //    external;

    function canAddressPay(address queryAddress, uint256 amount)
        external
        view
        returns (bool);

    function _settlePayment(address sender, address reciver, uint256 amount)
        external
        returns (bool);

    function _settleBulkPayment(
        address sender,
        address ownerAddress,
        SharedStructures.Contribution[] calldata contributors,
        uint256 paymentAmount
    ) external returns (bool);
}
