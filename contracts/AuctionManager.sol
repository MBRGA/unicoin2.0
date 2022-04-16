// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./patches/ERC2771ContextUpgradeable.sol";
import "./interfaces/IAuctionManager.sol";
// import "./UnicoinRegistry.sol";

contract AuctionManager is Initializable, IAuctionManager, ERC2771ContextUpgradeable {

    address registry;

    modifier onlyRegistry() {
        require(_msgSender() == registry, "Can only be called by registry");
        _;
    }

    Auction[] public auctions;

    Bid[] bids;

    // Maps all bidders' IDs to their bids
    mapping(address => uint256[]) public bidOwners;

    function initialize(address _unicoinRegistry, address _trustedForwarder) public initializer {
        __ERC2771Context_init(_trustedForwarder);

        registry = _unicoinRegistry;
        // unicoinRegistry = UnicoinRegistry(_unicoinRegistry);
    }

    function _createAuction(
        uint256 _publicationId,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration
    ) public onlyRegistry returns (uint256) {
        require(_auctionStartTime >= block.timestamp, "AuctionManager::Invalid auction start time");
        require(_auctionDuration > 0, "AuctionManager::Invalid auction duration");

        uint256[] memory auctionBidIds;
        Auction memory auction = Auction(
            _publicationId,
            _auctionFloor,
            _auctionStartTime,
            _auctionDuration,
            auctionBidIds,
            0, //No winning bid in the begining
            AuctionStatus.Pending
        );

        auctions.push(auction);

        return auctions.length - 1; // new auction Id
    }

    function _commitSealedBid(bytes32 _bidHash, uint256 _auctionId, address _bidderAddress)
        public
        onlyRegistry
        returns (uint256)
    {
        Auction memory auction = auctions[_auctionId];

        require(getAuctionStatus(_auctionId) == AuctionStatus.Commit, "Can only commit during the commit phase");

        Bid memory bid = Bid(_bidHash, 0, 0, BidStatus.Committed, auction.publicationId, _auctionId, _bidderAddress);

        bids.push(bid);
        uint256 bidId = bids.length - 1;

        auctions[_auctionId].auctionBidIds.push(bidId);

        bidOwners[_bidderAddress].push(bidId);

        return bidId;
    }

    function revealSealedBid(uint256 _bid, uint256 _salt, uint256 _auctionId, uint256 _bidId, address _bidderAddress)
        public
        onlyRegistry
    {
        Bid memory bid = bids[_bidId];

        require(getAuctionStatus(_auctionId) == AuctionStatus.Reveal, "Can only commit during the reveal phase");
        require(bid.bidderAddress == _bidderAddress, "Only the bidder can reveal their bid");
        require(bid.status == BidStatus.Committed, "Can only reveal a committed bid");

        bytes32 revealedBidHash = keccak256(abi.encode(_bid, _salt));

        require(bid.commitBid == revealedBidHash, "Committed bid does not match the revealed bid");

        bids[_bidId].revealedBid = _bid;
        bids[_bidId].revealedSalt = _salt;
        bids[_bidId].status = BidStatus.Revealed;
    }

    /** @notice After reveal, this determines which bid won the auction
        @param _auctionId Specifies which auction to finalise
        @return result An AuctionResult struct containing the details of the winning bid
     */

    function finalizeAuction(uint256 _auctionId) 
        public 
        onlyRegistry 
        returns (AuctionResult memory result) {
        require(
            getAuctionStatus(_auctionId) == AuctionStatus.Reveal,
            "Can only finalize an auction in the reveal stage"
        );

        Auction memory auction = auctions[_auctionId];

        uint256 numOfBids = auction.auctionBidIds.length;

        uint256 leadingBid = 0;
        //uint256 leadingBidAmount = 0;

        for (uint256 i = 0; i < numOfBids; i++) {
            uint256 bidAmount = bids[auction.auctionBidIds[i]].revealedBid;
            if (bidAmount > result.winningAmount) {
                //need to check that the bidder has enough balance and enough allowance to be able to
                // win the auction. Ask the vault via the registry for this information.
                // if (
                //     // unicoinRegistry.canAddressPay(
                //         bids[auction.auction_bid_ids[i]].bidder_Id,
                //         bidAmount
                //     )
                // ) {
                leadingBid = auction.auctionBidIds[i];
                result.winningAmount = bidAmount;
                // }
            }
        }

        if (leadingBid > 0) {
            auctions[_auctionId].status = AuctionStatus.Finalized;
            auctions[_auctionId].winningBidId = leadingBid;
            bids[leadingBid].status = BidStatus.Winner;
        }
    }

    function getAuctionStatus(uint256 _auctionId) public returns (AuctionStatus) {
        Auction memory auction = auctions[_auctionId];
        if (block.timestamp < auction.startingTime) {
            auctions[_auctionId].status = AuctionStatus.Pending;
            return AuctionStatus.Pending;
        } else if (
            block.timestamp >= auction.startingTime && block.timestamp < (auction.startingTime + auction.duration)
        ) {
            auctions[_auctionId].status = AuctionStatus.Commit;
            return AuctionStatus.Commit;
        } else {
            auctions[_auctionId].status = AuctionStatus.Reveal;
            return AuctionStatus.Reveal;
        }
    }

    function getBidderBids(address _bidderAddress) public view returns (uint256[] memory) {
        return bidOwners[_bidderAddress];
    }

    function updateAuctionStartTime(uint256 _auctionId, uint256 _newStartTime) public onlyRegistry {
        auctions[_auctionId].startingTime = _newStartTime;
    }

    function getAuctionBids(uint256 _auctionId) public view returns (uint256[] memory) {
        return auctions[_auctionId].auctionBidIds;
    }

    function getBid(uint256 _bidId) 
        public 
        view 
        //returns (bytes32, uint256, uint256, uint8, uint256, uint256, uint256)
        returns (Bid memory)
        {
        return bids[_bidId];    

        /*Bid memory bid = bids[_bidId];
        return (
            bid.commitBid,
            bid.revealedBid,
            bid.revealedSalt,
            uint8(bid.status),
            bid.publicationId,
            bid.auctionId,
            bid.bidderId
        );*/
    }

    function getNumberOfBidsInAuction(uint256 _auctionId) public view returns (uint256) {
        return auctions[_auctionId].auctionBidIds.length;
    }

    function getAuction(uint256 _auctionId)
        public
        view
        //returns (uint256, uint256, uint256, uint256, uint256[] memory, uint256, uint8)
        returns (Auction memory)
    {
        //Auction memory _auction = auctions[_auctionId];

        //return _auction;

        return auctions[_auctionId];
        //Auction memory auction = auctions[_auctionId];
        /*return (
            auction.publicationId,
            auction.auctionFloor,
            auction.startingTime,
            auction.duration,
            auction.auctionBidIds,
            auction.winningBidId,
            uint8(auction.status)
        );*/
    }
}
