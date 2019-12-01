pragma solidity ^0.5.12;

interface IHarbergerTaxManager {
    function initialize(address _unicoinRegistry) external;

    function createTaxObject(
        uint256 _licence_Id,
        // uint256 _ratePerBlock,
        uint256 _currentAssignedValue
    ) external returns (uint256);

    function calculateOutstandingTax(uint256 _taxObject_Id)
        external
        view
        returns (uint256);

    function calculateMinBuyOutPrice(uint256 _taxObject_Id)
        external
        view
        returns (uint256);

    function _updateTaxObjectLastPayment(uint256 _taxObject_Id) external;

    function _updateTaxObjectValuation(
        uint256 _taxObject_Id,
        uint256 _assignedValue
    ) external;

    function submitBuyOut(
        uint256 _taxObject,
        uint256 _offer,
        uint256 _buyOutOwner_Id
    ) external returns (uint256);

    function finalizeBuyOutOffer(uint256 _buyOut_Id) external returns (bool);

    function revokeTaxObject(uint256 _taxObject_Id) external;

    function getLicenceTaxObjectId(uint256 _licence_Id)
        external
        view
        returns (uint256);

    function getTaxObject(uint256 _taxObject_Id)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256[] memory,
            uint8
        );

    function getBuyOutLicenceId(uint256 _buyOut_Id)
        external
        view
        returns (uint256);

    function getBuyOutOwnerId(uint256 _buyOut_Id)
        external
        view
        returns (uint256);

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
