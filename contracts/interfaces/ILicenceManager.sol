pragma solidity ^0.8.0;

interface ILicenceManager {
    function initialize(
        string calldata _name,
        string calldata _symbol,
        address _unicoinRegistry
    ) external;

    function registerNewLicence(
        address _ownerAddress,
        uint256 _ownerId,
        uint256 _publicationId,
        uint256 _publicationLicenceNo
    ) external returns (uint256);

    function revokeLicence(uint256 _licenceId) external;

    function getLicenceForUser(uint256 _userId)
        external
        view
        returns (uint256[] memory);

    function allocateLicenceToNewOwner(
        uint256 _licenceId,
        uint256 _newOwnerId,
        address _oldNFTOwner_address,
        address _newNFTOwner_address
    ) external;

    function getLicence(uint256 _licenceId)
        external
        view
        returns (uint256, uint256, uint256, uint8);

    function getLicenceOwnerId(uint256 _licenceId)
        external
        view
        returns (uint256);
    function getPublicationLicences(uint256 _publicationId)
        external
        view
        returns (uint256[] memory);

    function getMostRecentPublicationLicence(uint256 _publicationId)
        external
        view
        returns (uint256);

    function ownerOf(uint256 _licenceId) external view returns (address);
}
