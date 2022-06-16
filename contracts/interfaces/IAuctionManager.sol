// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "../library/SharedStructures.sol";

interface IAuctionManager {
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
        returns (SharedStructures.AuctionResult memory);

    function getAuctionStatus(uint256 _auctionId)
        external
        returns (SharedStructures.AuctionStatus);

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
        returns (SharedStructures.Bid memory);

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
        returns (SharedStructures.Auction memory);
}
