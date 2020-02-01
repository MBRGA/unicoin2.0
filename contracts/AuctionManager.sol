pragma solidity ^0.5.12;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/upgrades/contracts/Initializable.sol";

// import "./UnicoinRegistry.sol";

contract AuctionManager is Initializable {
    enum BidStatus { Committed, Revealed, Winner }

    enum AuctionStatus { Pending, Commit, Reveal, Finalized }

    struct Auction {
        uint256 publication_Id;
        uint256 auctionFloor;
        uint256 starting_time;
        uint256 duration;
        uint256[] auction_bid_ids;
        uint256 winning_bid_Id;
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

    Bid[] bids;

    // Maps all bidders' IDs to their bids
    mapping(uint256 => uint256[]) public bidOwners;

    address registry;

    // UnicoinRegistry unicoinRegistry;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    function initialize(address _unicoinRegistry) public initializer {
        registry = _unicoinRegistry;
        // unicoinRegistry = UnicoinRegistry(_unicoinRegistry);
    }

    function _createAuction(
        uint256 _publication_Id,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration
    ) public onlyRegistry returns (uint256) {
        require(_auctionStartTime >= now, "AuctionManager::Invalid auction start time");
        require(_auctionDuration > 0, "AuctionManager::Invalid auction duration");

        uint256[] memory auction_bid_ids;
        Auction memory auction = Auction(
            _publication_Id,
            _auctionFloor,
            _auctionStartTime,
            _auctionDuration,
            auction_bid_ids,
            0, //No winning bid in the begining
            AuctionStatus.Pending
        );

        uint256 auctionId = auctions.push(auction) - 1;
        return auctionId;
    }

    function _commitSealedBid(bytes32 _bidHash, uint256 _auction_Id, uint256 _bidder_Id)
        public
        onlyRegistry
        returns (uint256)
    {
        Auction memory auction = auctions[_auction_Id];
        require(getAuctionStatus(_auction_Id) == AuctionStatus.Commit, "Can only commit during the commit phase");
        Bid memory bid = Bid(_bidHash, 0, 0, BidStatus.Committed, auction.publication_Id, _auction_Id, _bidder_Id);
        uint256 bidId = bids.push(bid) - 1;
        auctions[_auction_Id].auction_bid_ids.push(bidId);
        bidOwners[_bidder_Id].push(bidId);

        return bidId;
    }

    function revealSealedBid(uint256 _bid, uint256 _salt, uint256 _auction_Id, uint256 _bid_Id, uint256 _bidder_Id)
        public
        onlyRegistry
    {
        Bid memory bid = bids[_bid_Id];
        require(getAuctionStatus(_auction_Id) == AuctionStatus.Reveal, "Can only commit during the reveal phase");
        require(bid.bidder_Id == _bidder_Id, "Only the bidder can reveal their bid");
        require(bid.status == BidStatus.Committed, "Can only reveal a committed bid");

        bytes32 revealedBidHash = keccak256(abi.encode(_bid, _salt));

        require(bid.commitBid == revealedBidHash, "Committed bid does not match the revealed bid");

        bids[_bid_Id].revealedBid = _bid;
        bids[_bid_Id].revealedSalt = _salt;
        bids[_bid_Id].status = BidStatus.Revealed;
    }

    function finalizeAuction(uint256 _auction_Id) public onlyRegistry returns (uint256, uint256, uint256) {
        require(
            getAuctionStatus(_auction_Id) == AuctionStatus.Reveal,
            "Can only finalize an auction in the reveal stage"
        );

        Auction memory auction = auctions[_auction_Id];

        uint256 numOfBids = auction.auction_bid_ids.length;

        uint256 leadingBid = 0;
        uint256 leadingBidAmount = 0;

        for (uint256 i = 0; i < numOfBids; i++) {
            uint256 bidAmount = bids[auction.auction_bid_ids[i]].revealedBid;
            if (bidAmount > leadingBidAmount) {
                //need to check that the bidder has enough balance and enough allowance to be able to
                // win the auction. Ask the vault via the registrey for this information.
                // if (
                //     // unicoinRegistry.canAddressPay(
                //         bids[auction.auction_bid_ids[i]].bidder_Id,
                //         bidAmount
                //     )
                // ) {
                leadingBid = auction.auction_bid_ids[i];
                leadingBidAmount = bidAmount;
                // }
            }
        }

        if (leadingBid > 0) {
            auctions[_auction_Id].status = AuctionStatus.Finalized;
            auctions[_auction_Id].winning_bid_Id = leadingBid;
            bids[leadingBid].status = BidStatus.Winner;
        }

        return (leadingBidAmount, bids[leadingBid].bidder_Id, auction.publication_Id);
    }

    function getAuctionStatus(uint256 _auction_Id) public returns (AuctionStatus) {
        Auction memory auction = auctions[_auction_Id];
        if (now < auction.starting_time) {
            auctions[_auction_Id].status = AuctionStatus.Pending;
            return AuctionStatus.Pending;
        }

        if (now > auction.starting_time && now < (auction.starting_time + auction.duration)) {
            auctions[_auction_Id].status = AuctionStatus.Commit;
            return AuctionStatus.Commit;
        }

        if (now > (auction.starting_time + auction.duration)) {
            auctions[_auction_Id].status = AuctionStatus.Reveal;
            return AuctionStatus.Reveal;
        }
    }

    function getBidderBids(uint256 _bidder_Id) public view returns (uint256[] memory) {
        return bidOwners[_bidder_Id];
    }

    function updateAuctionStartTime(uint256 _auction_Id, uint256 _newStartTime) public onlyRegistry {
        auctions[_auction_Id].starting_time = _newStartTime;
    }

    function getAuctionBids(uint256 _auction_Id) public view returns (uint256[] memory) {
        return auctions[_auction_Id].auction_bid_ids;
    }

    function getBid(uint256 _bid_Id) public view returns (bytes32, uint256, uint256, uint8, uint256, uint256, uint256) {
        Bid memory bid = bids[_bid_Id];
        return (
            bid.commitBid,
            bid.revealedBid,
            bid.revealedSalt,
            uint8(bid.status),
            bid.publication_Id,
            bid.auction_Id,
            bid.bidder_Id
        );
    }

    function getNumberOfBidsInAuction(uint256 _auction_Id) public view returns (uint256) {
        return auctions[_auction_Id].auction_bid_ids.length;
    }

    function getAuction(uint256 _auction_Id)
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256[] memory, uint256, uint8)
    {
        Auction memory auction = auctions[_auction_Id];
        return (
            auction.publication_Id,
            auction.auctionFloor,
            auction.starting_time,
            auction.duration,
            auction.auction_bid_ids,
            auction.winning_bid_Id,
            uint8(auction.status)
        );
    }
}
