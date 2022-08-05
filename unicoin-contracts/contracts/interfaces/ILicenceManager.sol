// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

import "../library/SharedStructures.sol";

interface ILicenceManager is IERC721Upgradeable {
    /*function initialize(
        string calldata _name,
        string calldata _symbol,
        address _unicoinRegistry
    ) external;*/

    function _registerNewLicence(
        address ownerAddress,
        //uint256 _ownerId,
        uint256 publicationId,
        uint256 publicationLicenceNo
    ) external returns (uint256);

    function _revokeLicence(uint256 licenceId) external;

    function getLicenceForUser(address userAddress)
        external
        view
        returns (uint256[] memory);

    function _allocateLicenceToNewOwner(
        uint256 licenceId,
        address oldOwnerAddress,
        address newOwner_address
    ) external;

    function getLicence(uint256 licenceId)
        external
        view
        returns (SharedStructures.Licence memory);

    function getLicenceOwnerAddress(uint256 licenceId)
        external
        view
        returns (address);

    function getPublicationLicences(uint256 publicationId)
        external
        view
        returns (uint256[] memory);

    function getMostRecentPublicationLicence(uint256 publicationId)
        external
        view
        returns (uint256);

    //function ownerOf(uint256 _licence_Id) external view returns (address);
}
