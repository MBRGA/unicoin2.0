pragma solidity ^0.5.12;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract AuctionManager is Initializable {
    ERC20 daiContract;

    enum BidStatus {Committed, Revealed, Winner}

    enum AuctionStatus {Pending, Commit, Reveal, Finalized}

    struct Auction {
        uint256 publication_Id;
        uint256 auctionFloor;
        uint256 starting_time;
        uint256 duration;
        uint256[] auction_bid_ids;
        AuctionStatus status;
    }

    Auction[] public auctions;

    struct Bid {
        bytes32 commitBid;
        uint256 revealedBid;
        uint256 revealedSalt;
        BidStatus status;
        uint256 publication_Id;
        uint256 auction_Id;
        uint256 bidder_Id; // owner of the bid
    }
    /// @notice Creates an array of bids that have been placed
    Bid[] public bids;

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
        uint256 _publication_Id,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration
    ) public onlyRegistry returns (uint256) {
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
            _publication_Id,
            _auctionFloor,
            _auctionStartTime,
            _auctionDuration,
            auction_bid_ids,
            AuctionStatus.Pending
        );

        uint256 auctionId = auctions.push(auction) - 1;
        return auctionId;
    }

    function commitSealedBid(
        bytes32 _bidHash,
        uint256 _auction_Id,
        uint256 _bidder_Id
    ) public onlyRegistry returns (uint256) {
        Auction memory auction = auctions[_auction_Id];
        require(
            auction.status == AuctionStatus.Commit,
            "Can only commit during the commit phase"
        );
        Bid memory bid = Bid(
            _bidHash,
            0,
            0,
            BidStatus.Committed,
            auction.publication_Id,
            _auction_Id,
            _bidder_Id
        );
        uint256 bidId = bids.push(bid) - 1;
        auctions[_auction_Id].auction_bid_ids.push(bidId);
        // TODO: check that the toke aproval is sufficient for the bid
    }

    function revealSealedBid(
        uint256 _bid,
        uint256 _salt,
        uint256 _auction_Id,
        uint256 _bid_Id,
        uint256 _bidder_Id
    ) public onlyRegistry returns (uint256) {
        Auction memory auction = auctions[_auction_Id];
        Bid memory bid = bids[_bid_Id];
        require(
            auction.status == AuctionStatus.Reveal,
            "Can only commit during the commit phase"
        );
        require(
            bid.bidder_Id == _bidder_Id,
            "Only the bidder can reveal their bid"
        );
        require(
            bid.status == BidStatus.Committed,
            "Can only reveal a committed bid"
        );

        bytes32 revealedBidHash = keccak256(abi.encode(_bid, _salt));

        require(
            bid.commitBid == revealedBidHash,
            "Committed bid does not match the revealed bid"
        );

        bids[_bid_Id].revealedBid = _bid;
        bids[_bid_Id].revealedSalt = _salt;
        bids[_bid_Id].status = BidStatus.Revealed;
    }
}