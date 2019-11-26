pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract UserManager is Initializable {

    /// @notice struct for users of the plaform, needs their Ethereum address and profile URL
    struct User {
        address owned_address;
        string profile_uri;
    }
    /// @notice Array of regististred users
    User[] public users;


    /// @notice maps all users' addresses to their userID
    mapping(address => uint256) public userAddresses;

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

    function _registerUser(string memory _profile_uri) public onlyRegistry {
        require(
            bytes(_profile_uri).length > 0,
            "Profile URI should not be empty."
        );
        require(userAddresses[msg.sender] == 0, "User already registered.");
        uint256 id = users.push(User(msg.sender, _profile_uri));
        userAddresses[msg.sender] = id - 1;
    }

    function _isAddressRegistered(address _userAddress) public view returns (bool){
        return userAddresses[_userAddress] != 0;
    }

    function _getUserId(address _userAddress) public view returns (uint256) {
        return userAddresses[_userAddress];
    }
}