// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./patches/ERC2771ContextUpgradeable.sol";
import "./interfaces/IUserManager.sol";

contract UserManager is Initializable, IUserManager, ERC2771ContextUpgradeable {
    using Counters for Counters.Counter;

    Counters.Counter _userIds;

    struct User {
        address owned_address;
        string profile_uri;
    }

    //Array of registered users
    User[] public users;

    //all users' addresses to their userID
    mapping(address => uint256) public userAddresses;

    address registry;

    modifier onlyRegistry() {
        require(_msgSender() == registry, "Can only be called by registry");
        _;
    }

    function initialize(address _unicoinRegistry, address _trustedForwarder) public initializer {

        __ERC2771Context_init(_trustedForwarder);

        //set the zeroth user to null.
        users.push(User(address(0), ""));

        registry = _unicoinRegistry;
    }

    function _registerUser(string calldata _profileUri, address _userAddress) public onlyRegistry returns (uint256) {
        require(bytes(_profileUri).length > 0, "Profile URI should not be empty.");
        require(userAddresses[_userAddress] == 0, "User already registered.");

        users.push(User(_userAddress, _profileUri));
        _userIds.increment();
        uint256 id = _userIds.current();

        userAddresses[_userAddress] = id - 1;

        return id;
    }

    function isAddressRegistered(address _userAddress) public view returns (bool) {
        return userAddresses[_userAddress] != 0;
    }

    function getUserId(address _userAddress) public view returns (uint256) {
        return userAddresses[_userAddress];
    }

    function getUserAddress(uint256 _user_Id) public view returns (address) {
        return users[_user_Id].owned_address;
    }

    function getAddressArray(uint256[] memory _user_Ids) public view returns (address[] memory returnedAddresses_) {
        returnedAddresses_ = new address[](_user_Ids.length);
        for (uint256 i = 0; i < _user_Ids.length; i++) {
            returnedAddresses_[i] = getUserAddress(_user_Ids[i]);
        }
        return returnedAddresses_;
    }
}
