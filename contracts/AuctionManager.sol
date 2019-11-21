pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "./ControlledAuction.sol";
import "./PrivateAuction.sol";
import "./fixedRateSale.sol";


contract AuctionManager is Initializable {

    ERC20 daiContract;

    enum AuctionType {controlledAuction, privateAuction}
    
    enum BidStatus {committed, revealed, winner,pending, accepted, rejected, sale, cancelled}

    enum AuctionStatus {commit, reveal, finalized, open, closed}

    struct Auction {
        uint256 publication_Id;
        uint256[] auction_bid_ids;
        AuctionStatus status;
    }

    function initialize(address _daiContractAddress)
        public
        initializer
    {
        daiContract = ERC20(_daiContractAddress);
    }

    function createAuction(AuctionType _auctionType, uint256 _auctionFloor, uint256 _auctionStartTime) public returns (uint256){
        return 0;
    }
}