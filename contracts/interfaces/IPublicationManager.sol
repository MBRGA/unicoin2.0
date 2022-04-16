// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IPublicationManager {

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

    /** @notice Stores the details of a cited paper, so that credit may be allocted to it.
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
        Contribution[] contributors;
        uint256[] donations;
        Citation[] citations;
        uint256 lifetimeEarnings;
    }

    /** @notice Creates a new publication
        @param pricingStrategy a PricingStrategy enum specifying how licenses will be sold for this publication
        @param publicationUri the IPFS address of the uploaded paper
        @param ownerAddress The blockchain address of the user performing the upload
        @param fixedSellPrice If this publication is to be sold at a fixed price, the price that has been set
        @param maxNumberOfLicences The total number of licenses allowed to be in force at a given time
        @param contributors An array of `Contribution`s for this publication
        @param citations An array of `Citation`s for this publication
        @return publicationId Unique identifier for the newly created publication
     */

    function _createPublication(
        PricingStrategy pricingStrategy,
        string calldata publicationUri,
        address ownerAddress,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        Contribution[] calldata contributors,
        Citation[] calldata citations
    ) external returns (uint256);

    /** @notice Creates a new version of a publication, and marks the old version as replaced
        @param publicationId The publication being replaced
        @param pricingStrategy a PricingStrategy enum specifying how licenses will be sold for this publication. NULL indicates the value should be unchanged.
        @param publicationUri the IPFS address of the uploaded paper. An empty string indicates the value should be unchanged.
        @param fixedSellPrice If this publication is to be sold at a fixed price, the price that has been set. A value of type(uint256).max indicates the value should be unchanged
        @param maxNumberOfLicences The total number of licenses allowed to be in force at a given time. A value of type(uint256).max indicates the value should be unchanged
        @param contributors An array of `Contribution`s for this publication. An empty array will cause there to be no changes.
        @param citations An array of `Citation`s for this publication. An empty array will cause there to be no changes.
        @return newPublicationId The identifier for the new version of the publication.
     */

    function _replacePublication(
        uint256 publicationId,
        PricingStrategy pricingStrategy,
        string calldata publicationUri,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        Contribution[] calldata contributors,
        Citation[] calldata citations
    ) external returns (uint256);

    /** @notice Replaces a publication with a new version, with a change in ownership
        @param publicationId The publication being updated
        @param newOwner The address of the new owner of the publication
        @return newPublicationId The identifier for the new version of the publication
     */

    function _changeOwner(
        uint256 publicationId,
        address newOwner
    ) external returns (uint256);

    function _addAuctionToPublication(
        uint256 _publicationId,
        uint256 _auctionId
    ) external;

    function addNewLicenceToPublication(uint256 _publicationId)
        external
        returns (uint256);

    function revokeLicence(uint256 _publicationId) external returns (uint256);

    /*function getAuthorId(uint256 _publication_Id)
        external
        view
        returns (uint256);*/

    function getOwnerAddress(uint256 _publicationId) external view returns (address);

    function _getContributors(uint256 _publicationId)
        external
        view
        returns (Contribution[] memory);

    function getLatestAuctionId(uint256 _publicationId)
        external
        view
        returns (uint256);

    /*function getPublication(uint256 _publication_Id)
        external
        view
        returns (
            uint8,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        );*/

    function getPublication(uint256 _publicationId) 
        external
        view
        returns (Publication memory);

    function getPublicationLength() external view returns (uint256);

    function getPublicationAuctions(uint256 _publicationId)
        external
        view
        returns (uint256[] memory);

    function GetPublicationPricingStrategy(uint256 _publicationId)
        external
        view
        returns (uint8);

    function getAllPublications(address _authorId)
        external
        view
        returns (uint256[] memory);

    function recordDonation(uint256 _publicationId, uint256 _donationAmount)
        external;
}
