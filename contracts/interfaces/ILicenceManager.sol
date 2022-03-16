// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface ILicenceManager is IERC721Upgradeable {
    /*function initialize(
        string calldata _name,
        string calldata _symbol,
        address _unicoinRegistry
    ) external;*/

    function registerNewLicence(
        address _ownerAddress,
        uint256 _owner_Id,
        uint256 _publication_Id,
        uint256 _publicationLicenceNo
    ) external returns (uint256);

    function revokeLicence(uint256 _licence_Id) external;

    function getLicenceForUser(uint256 _user_Id)
        external
        view
        returns (uint256[] memory);

    function allocateLicenceToNewOwner(
        uint256 _licence_Id,
        uint256 _newOwner_Id,
        address _oldNFTOwner_address,
        address _newNFTOwner_address
    ) external;

    function getLicence(uint256 _licence_Id)
        external
        view
        returns (uint256, uint256, uint256, uint8);

    function getLicenceOwnerId(uint256 _licence_Id)
        external
        view
        returns (uint256);
    function getPublicationLicences(uint256 _publication_Id)
        external
        view
        returns (uint256[] memory);

    function getMostRecentPublicationLicence(uint256 _publication_Id)
        external
        view
        returns (uint256);

    //function ownerOf(uint256 _licence_Id) external view returns (address);
}
