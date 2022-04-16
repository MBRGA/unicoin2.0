// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface ILicenceManager is IERC721Upgradeable {
    /*function initialize(
        string calldata _name,
        string calldata _symbol,
        address _unicoinRegistry
    ) external;*/

    enum LicenceStatus { Active, Revoked }

    struct Licence {
        address ownerAddress;
        uint256 publicationId;
        uint256 publicationLicenceNo;
        LicenceStatus status;
    }

    function registerNewLicence(
        address _ownerAddress,
        //uint256 _ownerId,
        uint256 _publicationId,
        uint256 _publicationLicenceNo
    ) external returns (uint256);

    function revokeLicence(uint256 _licenceId) external;

    function getLicenceForUser(address _userAddress)
        external
        view
        returns (uint256[] memory);

    function allocateLicenceToNewOwner(
        uint256 _licenceId,
        address _oldOwnerAddress,
        address _newOwner_address
    ) external;

    function getLicence(uint256 _licenceId)
        external
        view
        returns (Licence memory);

    function getLicenceOwnerAddress(uint256 _licenceId)
        external
        view
        returns (address);

    function getPublicationLicences(uint256 _publicationId)
        external
        view
        returns (uint256[] memory);

    function getMostRecentPublicationLicence(uint256 _publicationId)
        external
        view
        returns (uint256);

    //function ownerOf(uint256 _licence_Id) external view returns (address);
}
