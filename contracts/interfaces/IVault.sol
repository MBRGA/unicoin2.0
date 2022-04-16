// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import './IPublicationManager.sol';

interface IVault {
    //function initialize(address _tokenAddress, address _unicoinRegistry, address _trustedForwarder)
    //    external;

    function canAddressPay(address _address, uint256 _amount)
        external
        view
        returns (bool);

    function settlePayment(address _sender, address _reciver, uint256 _amount)
        external
        returns (uint256);

    function settleBulkPayment(
        address _sender,
        address ownerAddress,
        IPublicationManager.Contribution[] calldata contributors,
        uint256 paymentAmount
    ) external returns (bool);
}
