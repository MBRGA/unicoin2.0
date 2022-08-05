// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "./patches/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "./interfaces/IUserManager.sol";
import "./library/SharedStructures.sol";

contract UserManager is Initializable, IUserManager, ERC2771ContextUpgradeable {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    //Array of registered users
    //User[] public users;

    CountersUpgradeable.Counter userIds;

    //all users' addresses to their userID
    mapping(address => SharedStructures.User) public users;

    address immutable _registry;

    modifier onlyRegistry() {
        require(_msgSender() == _registry, "Can only be called by registry");
        _;
    }

    
    // This contract is upgradeable, but we can use constructor instead of initializer for optimisation benefits for immutables.
    constructor(address unicoinRegistry, address trustedForwarder) ERC2771ContextUpgradeable(trustedForwarder) initializer {
        _registry = unicoinRegistry;
    }


    function initialize( ) public initializer {
        // Make sure first user is user 1, so we can test for 0s.
        userIds.increment();
    }

    function _registerUser(string calldata profileUri, address userAddress) public onlyRegistry returns (uint256) {
        require(bytes(profileUri).length > 0, "Profile URI should not be empty.");
        require(!users[userAddress].valid, "A user is already registered to this address.");

        //users.push(User(userAddress, _profileUri));

        uint256 id = userIds.current();

        users[userAddress] = SharedStructures.User(true, id, profileUri);
        
        userIds.increment();

        return id;
    }

    function isAddressRegistered(address userAddress) public view returns (bool) {
        return users[userAddress].valid;
    }

    function getUserId(address userAddress) public view returns (uint256) {
        return users[userAddress].userId;
    }

    function getUserProfileUri(address userAddress) public view returns (string memory) {
        return users[userAddress].profileUri;
    }

    /*function getUserAddress(uint256 _user_Id) public view returns (address) {
        return users[_user_Id].owned_address;
    }*/

    /*function getAddressArray(uint256[] memory _user_Ids) public view returns (address[] memory returnedAddresses_) {
        returnedAddresses_ = new address[](_user_Ids.length);
        for (uint256 i = 0; i < _user_Ids.length; i++) {
            returnedAddresses_[i] = getUserAddress(_user_Ids[i]);
        }
        return returnedAddresses_;
    }*/
}
