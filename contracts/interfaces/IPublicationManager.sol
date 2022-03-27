// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IPublicationManager {
    enum PricingStrategy { PrivateAuction, FixedRate, PrivateAuctionHarberger, None }

    enum PublicationStatus { Published, Replaced, Withdrawn, Licensed }

    struct Contribution {
        address contributor;
        uint16 weighting;
    }

    struct Publication {
        PricingStrategy pricingStrategy;
        string publicationUri; //IPFS blob address of the publication
        PublicationStatus publicationStatus;
        address publisherAddress; //id of the auther
        uint256 sellPrice;
        uint8 maxNumberOfLicences;
        uint256 licencesIssued;
        uint256 previousVersion;
        uint256[] auctionIds; //ids of bids on the publication
        Contribution[] contributors;
        uint256[] donations;
    }

    function _createPublication(
        PricingStrategy _pricing_stratergy,
        string calldata _publication_uri,
        uint256 _author_Id,
        uint256 _fixed_sell_price,
        uint256 _maxNumberOfLicences,
        uint256[] calldata _contributors,
        uint256[] calldata _contributors_weightings
    ) external returns (uint256);

    function _addAuctionToPublication(
        uint256 _publication_Id,
        uint256 _auction_Id
    ) external;

    function addNewLicenceToPublication(uint256 _publication_Id)
        external
        returns (uint256);

    function revokeLicence(uint256 _publication_Id) external returns (uint256);

    /*function getAuthorId(uint256 _publication_Id)
        external
        view
        returns (uint256);*/

    function _getContributors(uint256 _publication_Id)
        external
        view
        returns (uint256[] memory, uint256[] memory);

    function getLatestAuctionId(uint256 _publication_Id)
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

    function getPublicationAuctions(uint256 _publication_Id)
        external
        view
        returns (uint256[] memory);

    function GetPublicationPricingStrategy(uint256 _publication_Id)
        external
        view
        returns (uint8);

    function getAllPublications(address _author_Id)
        external
        view
        returns (uint256[] memory);

    function recordDonation(uint256 _publication_Id, uint256 _donationAmount)
        external;
}
