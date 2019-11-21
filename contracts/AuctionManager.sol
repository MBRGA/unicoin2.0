pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract AuctionManager is Initializable {
    ERC20 daiContract;

    enum AuctionType {controlledAuction, privateAuction}

    enum BidStatus {
        committed,
        revealed,
        winner,
        pending,
        accepted,
        rejected,
        sale,
        cancelled
    }

    enum AuctionStatus {pending, commit, reveal, finalized, open, closed}

    struct Auction {
        uint256 publicationId;
        AuctionType auctionType;
        uint256 auctionFloor;
        uint256 starting_time;
        uint256 duration;
        uint256[] auction_bid_ids;
        AuctionStatus status;
    }

    Auction[] public auctions;

    address registry;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    function initialize(address _daiContractAddress, address _unicoinRegistry)
        public
        initializer
    {
        daiContract = ERC20(_daiContractAddress);
        registry = _unicoinRegistry;
    }

    function _createAuction(
        uint256 _publicationId,
        uint8 _auctionType,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration
    ) public returns (uint256) {
        require(
            _auctionType <= 1,
            "AuctionManager::Invalid auction type spesified"
        );
        require(
            _auctionStartTime >= now,
            "AuctionManager::Invalid auction start time"
        );
        require(
            _auctionDuration >= 0,
            "AuctionManager::Invalid auction duration"
        );

        uint256[] memory auction_bid_ids;
        Auction memory auction = Auction(
            _publicationId,
            AuctionType(_auctionType),
            _auctionFloor,
            _auctionStartTime,
            _auctionDuration,
            auction_bid_ids,
            AuctionStatus.pending
        );

        uint256 auctionId = auctions.push(auction) - 1;
        return auctionId;
    }

    function makeBidPublicBid(uint256 offer) public returns (uint256) {
        return 0;
    }
}
