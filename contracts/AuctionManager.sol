pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract AuctionManager is Initializable {

    ERC20 daiContract;

    enum AuctionType {controlledAuction, privateAuction}
    
    enum BidStatus {committed, revealed, winner,pending, accepted, rejected, sale, cancelled}

    enum AuctionStatus {commit, reveal, finalized, open, closed}

    struct Auction {
        uint256 starting_time;
        uint256 duration;
        uint256 publication_Id;
        uint256[] auction_bid_ids;
        AuctionStatus status;
    }

    address registry;

    modifier onlyRegistry(){
        require(msg.sender == registry,"Can only be called by registry");
        _;
    }

    function initialize(address _daiContractAddress, address _unicoinRegistry)
        public
        initializer
    {
        daiContract = ERC20(_daiContractAddress);
        registry = _unicoinRegistry;
    }

    function _createAuction(uint8 _auctionType, uint256 _auctionFloor, uint256 _auctionStartTime) public returns (uint256){
        return 0;
    }

    function makeBidPublicBid(uint256 offer) public returns(uint256){
        return 0;
    }
}