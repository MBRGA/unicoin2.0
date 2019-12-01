pragma solidity ^0.5.12;

interface IPublicationManager {
    function initialize(address _unicoinRegistry) external;

    function _createPublication(
        uint8 _pricing_stratergy,
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

    function getAuthorId(uint256 _publication_Id)
        external
        view
        returns (uint256);

    function _getContributers(uint256 _publication_Id)
        external
        view
        returns (uint256[] memory, uint256[] memory);

    function getLatestAuctionId(uint256 _publication_Id)
        external
        view
        returns (uint256);

    function getPublication(uint256 _publication_Id)
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
        );

    function getPublicationLength() external view returns (uint256);

    function getPublicationAuctions(uint256 _publication_Id)
        external
        view
        returns (uint256[] memory);

    function GetPublicationPricingStrategy(uint256 _publication_Id)
        external
        view
        returns (uint8);

    function getAuthorPublications(uint256 _author_Id)
        external
        view
        returns (uint256[] memory);

    function recordDonation(uint256 _publication_Id, uint256 _donationAmount)
        external;
}
