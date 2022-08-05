// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@opengsn/contracts/src/BasePaymaster.sol";

contract UnicoinPaymaster is BasePaymaster {

    function versionPaymaster() external override view returns (string memory) {
        return "3.0.0-alpha0+unicoin.paymaster";
    }
}