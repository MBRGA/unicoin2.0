// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IAuctionManager {
    enum AuctionStatus {Pending, Commit, Reveal, Finalized}

    enum BidStatus { Committed, Revealed, Winner }

    struct Auction {
        uint256 publicationId;
        uint256 auctionFloor;
        uint256 startingTime;
        uint256 duration;
        uint256[] auctionBidIds;
        uint256 winningBidId;
        AuctionStatus status;
    }

    struct AuctionResult {
        uint256 winningAmount;
        address winnerAddress;
        uint256 publicationId;
    }

    struct Bid {
        bytes32 commitBid;
        uint256 revealedBid;
        uint256 revealedSalt;
        BidStatus status;
        uint256 publicationId;
        uint256 auctionId;
        address bidderAddress; // owner of the bid
    }

    //function initialize(address _unicoinRegistry, address _trustedForwarder) external;
    
    function _createAuction(
        uint256 _publicationId,
        uint256 _auctionFloor,
        uint256 _auctionStartTime,
        uint256 _auctionDuration
    ) external returns (uint256);

    function _commitSealedBid(
        bytes32 _bidHash,
        uint256 _auctionId,
        address _bidderAddress
    ) external returns (uint256);

    function revealSealedBid(
        uint256 _bid,
        uint256 _salt,
        uint256 _auctionId,
        uint256 _bidId,
        address _bidderAddress
    ) external;

    function finalizeAuction(uint256 _auctionId)
        external
        returns (AuctionResult memory);

    function getAuctionStatus(uint256 _auctionId)
        external
        returns (AuctionStatus);

    function getBidderBids(address _bidderAddress)
        external
        view
        returns (uint256[] memory);

    function updateAuctionStartTime(uint256 _auctionId, uint256 _newStartTime)
        external;

    function getAuctionBids(uint256 _auctionId)
        external
        view
        returns (uint256[] memory);

    /*function getBid(uint256 _bid_Id)
        external
        view
        returns (bytes32, uint256, uint256, uint8, uint256, uint256, uint256);*/
    function getBid(uint256 _bidId)
        external
        view
        returns (Bid memory);

    function getNumberOfBidsInAuction(uint256 _auctionId)
        external
        view
        returns (uint256);

    /*function getAuction(uint256 _auction_Id)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256[] memory,
            uint256,
            uint8
        );*/

    function getAuction(uint256 _auctionId)
        external
        view 
        returns (Auction memory);
}
