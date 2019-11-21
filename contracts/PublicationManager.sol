pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract PublicationManager is Initializable {

    enum SaleType {fixedRate, controlledAuction, privateAuction}

    enum SaleStatus {}
    
    struct Publication {
        uint256 author_Id;  //id of the auther
        string publication_uri; //IPFS blob address of the publication
        uint256[] publication_bids; //ids of bids on the publication
        SaleType saleType;
        bool isRunning;
        uint256 sell_price;
        uint256[] contributors;
        uint256[] contributors_weightings;
    }
    /// @notice Creates an array of publications for every published document
    Publication[] public publications;

    /// @notice The mapping below will map the addresses of all the successful bidders' addresses to the ID of their owned publications
    mapping(uint256 => uint256[]) public publicationOwners;
    
    function initialize () public initializer {
        
    }
}