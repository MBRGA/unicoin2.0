// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IUserManager {
    //function initialize(address _unicoinRegistry) external;

    function _registerUser(string calldata _profile_uri, address userAddress)
        external
        returns (uint256);

    function isAddressRegistered(address userAddress)
        external
        view
        returns (bool);

    function getUserId(address userAddress) external view returns (uint256);

    function getUserProfileUri(address userAddress) external view returns(string memory);

    /*function getUserAddress(uint256 _user_Id) external view returns (address);

    function getAddressArray(uint256[] calldata _user_Ids)
        external
        view
        returns (address[] memory returnedAddresses_);*/
}
