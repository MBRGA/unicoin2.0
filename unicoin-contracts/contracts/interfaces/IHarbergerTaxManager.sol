// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../library/SharedStructures.sol";

interface IHarbergerTaxManager {

    function _createTaxObject(
        uint256 _licence_Id,
        // uint256 _ratePerBlock,
        uint256 _currentAssignedValue
    ) external returns (uint256);

    function calculateOutstandingTax(uint256 taxObjectId)
        external
        view
        returns (uint256);

    function calculateMinBuyOutPrice(uint256 taxObjectId)
        external
        view
        returns (uint256);

    function _updateTaxObjectLastPayment(uint256 taxObjectId) external;

    function _updateTaxObjectValuation(
        uint256 taxObjectId,
        uint256 assignedValue
    ) external;

    function _submitBuyOut(
        uint256 taxObject,
        uint256 offer,
        address buyOutOwnerAddress
    ) external 
    returns (uint256);

    function _finalizeBuyOutOffer(uint256 buyOutId) external returns (bool);

    function _revokeTaxObject(uint256 taxObjectId) external;

    function getLicenceTaxObjectId(uint256 licenceId)
        external
        view
        returns (uint256);

    function getTaxObject(uint256 taxObjectId)
        external
        view
        returns (SharedStructures.TaxObject memory);

    /*function getBuyOut(uint256 buyOutId)
        external
        view
        returns (uint256, uint256, uint256, uint256, uint8);*/

    function getBuyOutLicenceId(uint256 buyOutId)
        external
        view
        returns (uint256);

    function getBuyOutOwnerAddress(uint256 buyOutId)
        external
        view
        returns (address);

    function getTaxObjectLength() external view returns (uint256);

    /*function getLicenceBuyOuts(uint256 _licenceId)
        external
        view
        returns (BuyOut[] memory);*/

    function calcOptimalExp(uint256 x) external pure returns (uint256);

    function capFunction(uint256 r, uint256 t1, uint256 t2)
        external
        pure
        returns (uint256);

    function calcFutureValue(uint256 N, uint256 r, uint256 t1, uint256 t2)
        external
        pure
        returns (uint256);
}
