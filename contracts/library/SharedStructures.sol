// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

library SharedStructures {

    struct User {
        bool valid;
        uint256 userId;
        //address owned_address;
        string profileUri;
    }

    enum PricingStrategy { PrivateAuction, FixedRate, PrivateAuctionHarberger, None, NULL }

    enum PublicationStatus { Published, Replaced, Withdrawn, Licensed, Unitialized, NULL }

    /** @notice Stores the details of the contributors to a paper (authors, and other direct contributors)
        @member contributorAddress The address identifies the contributor, and is the destination for any funds payable
        @member weighting The share of credit to be allocated to this contributor
        @member balance The unclaimed funds for this contributor
        @member lifetimeAllocations The total amount due to this contributor since publication
     */
    struct Contribution {
        address contributorAddress;
        uint16 weighting;
        uint256 balance;
        uint256 lifetimeAllocations;
    }

    /** @notice Stores the details of a cited paper, so that credit may be allocated to it.
        @member publicationId The ID of the cited publication. Will have to have been created beforehand
        @member weighting The share of credit to be allocated to this publication
     */
    struct Citation {
        uint256 publicationId;
        uint16 weighting;
    }

    /** @notice Stores the details of a particular publication
        @member pricingStrategy a PricingStrategy enum specifying how the publication has been priced
        @member publicationURI IPFS address of this publication
        @member publicationStatus Tracks the current status of this version of the publication
        @member ownerAddress The address of the creator/person with rights to control this publication
        @member sellPrice The price at which the publication is sold (if fixed price)
        @member maxNumberOfLicenses The maximum number of licenses allowed to be issued
        @member licencesIssued The number of valid licenses current in force
        @member auctionIds IDs of bids on the publication
        @member contributors Tracks who has contributed to the current publication
        @member donations Donations made to the authors of this publication
        @member citations Tracks papers cited by this one
        @member lifetimeEarnings The total income attributed to this publication since it was created
     */
    struct Publication {
        PricingStrategy pricingStrategy;
        string publicationUri; //IPFS blob address of the publication
        PublicationStatus publicationStatus;
        address ownerAddress; //id of the auther
        uint256 sellPrice;
        uint8 maxNumberOfLicences;
        uint256 licencesIssued;
        uint256 previousVersion;
        uint256[] auctionIds; //ids of bids on the publication
        uint256 contributionsId;
        //Contribution[] contributors;
        uint256[] donations;
        uint256 citationsId;
        //Citation[] citations;
        uint256 lifetimeEarnings;
    }

    enum BuyOutStatus { Pending, Successful, OutBid }

    enum TaxObjectStatus { Active, Revoked }

    struct BuyOut {
        uint256 taxObjectId;
        address buyOutOwnerAddress;
        uint256 buyOutAmount;
        uint256 buyOutExpiration;
        BuyOutStatus status;
    }

    struct TaxObject {
        uint256 licenceId;
        uint256 ratePerBlock;
        uint256 lastPayment;
        uint256 numberOfOutBids;
        uint256 currentAssignedValue;
        uint256[] buyOuts;//BuyOut[] buyOuts;
        TaxObjectStatus status;
    }

    enum LicenceStatus { Active, Revoked }

    struct Licence {
        address ownerAddress;
        uint256 publicationId;
        uint256 publicationLicenceNo;
        LicenceStatus status;
    }

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


}