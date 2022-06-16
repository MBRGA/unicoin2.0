// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

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

    CountersUpgradeable.Counter _userIds;

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

        //__ERC2771Context_init(_trustedForwarder);

        //set the zeroth user to null.
        //users.push(User(address(0), ""));

        //registry = _unicoinRegistry;
    }

    function _registerUser(string calldata _profileUri, address _userAddress) public onlyRegistry returns (uint256) {
        require(bytes(_profileUri).length > 0, "Profile URI should not be empty.");
        require(!users[_userAddress].valid, "A user is already registered to this address.");

        //users.push(User(_userAddress, _profileUri));

        uint256 id = _userIds.current();

        users[_userAddress] = SharedStructures.User(true, id, _profileUri);
        
        _userIds.increment();

        return id;
    }

    function isAddressRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].valid;
    }

    function getUserId(address _userAddress) public view returns (uint256) {
        return users[_userAddress].userId;
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
