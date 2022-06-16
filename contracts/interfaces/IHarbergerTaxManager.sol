// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "../library/SharedStructures.sol";

interface IHarbergerTaxManager {

    function createTaxObject(
        uint256 _licence_Id,
        // uint256 _ratePerBlock,
        uint256 _currentAssignedValue
    ) external returns (uint256);

    function calculateOutstandingTax(uint256 _taxObjectId)
        external
        view
        returns (uint256);

    function calculateMinBuyOutPrice(uint256 _taxObjectId)
        external
        view
        returns (uint256);

    function _updateTaxObjectLastPayment(uint256 _taxObjectId) external;

    function _updateTaxObjectValuation(
        uint256 _taxObjectId,
        uint256 _assignedValue
    ) external;

    function submitBuyOut(
        uint256 _taxObject,
        uint256 _offer,
        address _buyOutOwnerAddress
    ) external 
    returns (uint256);

    function finalizeBuyOutOffer(uint256 _buyOutId) external returns (bool);

    function revokeTaxObject(uint256 _taxObjectId) external;

    function getLicenceTaxObjectId(uint256 _licenceId)
        external
        view
        returns (uint256);

    function getTaxObject(uint256 _taxObjectId)
        external
        view
        returns (SharedStructures.TaxObject memory);

    /*function getBuyOut(uint256 _buyOutId)
        external
        view
        returns (uint256, uint256, uint256, uint256, uint8);*/

    function getBuyOutLicenceId(uint256 _buyOutId)
        external
        view
        returns (uint256);

    function getBuyOutOwnerAddress(uint256 _buyOutId)
        external
        view
        returns (address);

    function getTaxObjectLength() external view returns (uint256);

    /*function getLicenceBuyOuts(uint256 _licenceId)
        external
        view
        returns (BuyOut[] memory);*/

    function optimalExp(uint256 x) external pure returns (uint256);

    function capFunction(uint256 r, uint256 t1, uint256 t2)
        external
        pure
        returns (uint256);

    function futureValue(uint256 N, uint256 r, uint256 t1, uint256 t2)
        external
        pure
        returns (uint256);
}
