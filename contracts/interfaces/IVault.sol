// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

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
        address _authorAddress,
        address[] calldata _contributorAddresses,
        uint256[] calldata _contributorWeightings,
        uint256 _paymentAmount
    ) external returns (bool);
}
