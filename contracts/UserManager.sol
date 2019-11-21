pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract UserNamanger is Initializable {

    /// @notice struct for users of the plaform, needs their Ethereum address and profile URL
    struct User {
        address owned_address;
        string profile_uri;
    }
    /// @notice Array of regististred users
    User[] public users;

    function initialize()  public initializer {
        //set the zeroth user to null.
        users.push(User(address(0), ""));
    }
}