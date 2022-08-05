// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../library/SharedStructures.sol";

interface IPublicationManager {

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
        SharedStructures.PricingStrategy pricingStrategy,
        string calldata publicationUri,
        address ownerAddress,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        SharedStructures.Contribution[] calldata contributors,
        SharedStructures.Citation[] calldata citations
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
        SharedStructures.PricingStrategy pricingStrategy,
        string calldata publicationUri,
        uint256 fixedSellPrice,
        uint8 maxNumberOfLicences,
        SharedStructures.Contribution[] calldata contributors,
        SharedStructures.Citation[] calldata citations
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

    function _addNewLicenceToPublication(uint256 _publicationId)
        external
        returns (uint256);

    function _revokeLicence(uint256 publicationId) external returns (uint256);

    function _recordDonation(uint256 publicationId, uint256 donationAmount)
        external;

    /*function getAuthorId(uint256 _publication_Id)
        external
        view
        returns (uint256);*/

    function getOwnerAddress(uint256 publicationId) external view returns (address);

    function getContributors(uint256 publicationId)
        external
        view
        returns (SharedStructures.Contribution[] memory);

    function getLatestAuctionId(uint256 publicationId)
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

    function getPublication(uint256 publicationId) 
        external
        view
        returns (SharedStructures.Publication memory);

    function getPublicationLength() external view returns (uint256);

    function getPublicationAuctions(uint256 publicationId)
        external
        view
        returns (uint256[] memory);

    function getPublicationPricingStrategy(uint256 publicationId)
        external
        view
        returns (uint8);

    function getAllPublications(address publisherAddress)
        external
        view
        returns (uint256[] memory);
}
