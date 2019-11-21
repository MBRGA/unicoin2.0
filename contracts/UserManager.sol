pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract UserManager is Initializable {

    /// @notice struct for users of the plaform, needs their Ethereum address and profile URL
    struct User {
        address owned_address;
        string profile_uri;
    }
    /// @notice Array of regististred users
    User[] public users;

    address registry;

    modifier onlyRegistry(){
        require(msg.sender == registry,"Can only be called by registry");
        _;
    }

    function initialize(address _unicoinRegistry)  public initializer {
        //set the zeroth user to null.
        users.push(User(address(0), ""));

        registry = _unicoinRegistry;
    }
}