// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../library/SharedStructures.sol";

interface IAuctionManager {
    //function initialize(address _unicoinRegistry, address _trustedForwarder) external;
    
    function _createAuction(
        uint256 publicationId,
        uint256 auctionFloor,
        uint256 auctionStartTime,
        uint256 auctionDuration
    ) external returns (uint256);

    function _commitSealedBid(
        bytes32 bidHash,
        uint256 auctionId,
        address bidderAddress
    ) external returns (uint256);

    function _revealSealedBid(
        uint256 bidAmount,
        uint256 salt,
        uint256 auctionId,
        uint256 bidId,
        address bidderAddress
    ) external;

    function _finalizeAuction(uint256 auctionId)
        external
        returns (SharedStructures.AuctionResult memory);

    function getAuctionStatus(uint256 auctionId)
        external
        returns (SharedStructures.AuctionStatus);

    function getBidderBids(address bidderAddress)
        external
        view
        returns (uint256[] memory);

    function _updateAuctionStartTime(uint256 auctionId, uint256 newStartTime)
        external;

    function getAuctionBids(uint256 auctionId)
        external
        view
        returns (uint256[] memory);

    /*function getBid(uint256 _bid_Id)
        external
        view
        returns (bytes32, uint256, uint256, uint8, uint256, uint256, uint256);*/
    function getBid(uint256 bidId)
        external
        view
        returns (SharedStructures.Bid memory);

    function getNumberOfBidsInAuction(uint256 auctionId)
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

    function getAuction(uint256 auctionId)
        external
        view 
        returns (SharedStructures.Auction memory);
}
