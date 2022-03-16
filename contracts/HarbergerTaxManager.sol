// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./patches/ERC2771ContextUpgradeable.sol";
import "./interfaces/IHarbergerTaxManager.sol";

contract HarbergerTaxManager is Initializable, IHarbergerTaxManager, ERC2771ContextUpgradeable {
    uint256 private constant FIXED_1 = 0x080000000000000000000000000000000;
    //percentage increase over previous price that must be paid to buy Out the licence
    uint256 constant MIN_BUYOUT_PRICE_INCREASE = 5;
    //a buyOut has an expiratory of 10 days for the owner to raize the price or loose the licence
    uint256 constant BUYOUT_TIMEOUT = 60 * 60 * 24 * 10;
    // 4% compounding per block, scaled 1e18
    uint256 constant FIXED_INTEREST_RATE_PER_BLOCK = 19025875190;

    using CountersUpgradeable for CountersUpgradeable.Counter;

    address registry;

    modifier onlyRegistry() {
        require(_msgSender() == registry, "Can only be called by registry");
        _;
    }

    CountersUpgradeable.Counter _taxObjectIds;
    CountersUpgradeable.Counter _buyoutIds;

    enum TaxObjectStatus { Active, Revoked }

    struct TaxObject {
        uint256 licenceId;
        uint256 ratePerBlock;
        uint256 lastPayment;
        uint256 numberOfOutBids;
        uint256 currentAssignedValue;
        uint256[] buyOutIds;
        TaxObjectStatus status;
    }

    TaxObject[] taxObjects;

    struct BuyOut {
        uint256 taxObjectId;
        uint256 buyOutOwnerId;
        uint256 buyOutAmount;
        uint256 buyOutExpiration;
        BuyOutStatus status;
    }

    BuyOut[] buyOuts;

    mapping(uint256 => uint256[]) public buyOutOwners;
    mapping(uint256 => uint256[]) public licenceTaxObjects;

    function initialize(address _registry, address _trustedForwarder) public initializer {
        __ERC2771Context_init(_trustedForwarder);

        registry = _registry;
    }

    /** @notice Creates a new Harberger Tax associated with a given licence
        @param _licenceId The licence with which to associate this tax
        @param _currentAssignedValue The current Harberger Tax valuation of the licence
        @return taxObjectId The ID of the newly created tax object
     */
    function createTaxObject(
        uint256 _licenceId,
        // uint256 _ratePerBlock,
        uint256 _currentAssignedValue
    ) public onlyRegistry returns (uint256) {
        require(_currentAssignedValue > 0, "Value needs to be larger than zero");

        //if there were previous tax objects then they must have been revoked
        if (licenceTaxObjects[_licenceId].length > 0) {
            require(
                taxObjects[licenceTaxObjects[_licenceId][licenceTaxObjects[_licenceId].length - 1]].status ==
                    TaxObjectStatus.Revoked,
                "Can only create tax object if previous revoked"
            );
        }

        uint256[] memory buyOutIds;

        TaxObject memory taxObject = TaxObject(
            _licenceId,
            FIXED_INTEREST_RATE_PER_BLOCK,
            block.timestamp,
            0,
            _currentAssignedValue,
            buyOutIds,
            TaxObjectStatus.Active
        );

        taxObjects.push(taxObject);
        _taxObjectIds.increment();
        uint256 taxObjectId = _taxObjectIds.current();

        licenceTaxObjects[_licenceId].push(taxObjectId);

        return taxObjectId;
    }

    /** @notice Calculates the amount of Harberger tax due on a licence
        @param _taxObjectId The valuation object on which the tax is to be calculated
        @return interestOutstanding The tax amount due
     */
    function calculateOutstandingTax(uint256 _taxObjectId) public view returns (uint256) {
        TaxObject storage taxObject = taxObjects[_taxObjectId]; /*memory*/

        uint256 _futureValue = futureValue(
            taxObject.currentAssignedValue,
            taxObject.ratePerBlock,
            taxObject.lastPayment,
            block.timestamp
        );

        uint256 interestOutstanding = _futureValue - taxObject.currentAssignedValue;
        return interestOutstanding;
    }

    function calculateMinBuyOutPrice(uint256 _taxObjectId) public view returns (uint256) {
        return (taxObjects[_taxObjectId].currentAssignedValue * (100 + MIN_BUYOUT_PRICE_INCREASE)) / 100;
    }

    function _updateTaxObjectLastPayment(uint256 _taxObjectId) public onlyRegistry {
        taxObjects[_taxObjectId].lastPayment = block.timestamp;
    }

    /** @notice Updates the valuation associated with the current Harberger Tax
        @param _taxObjectId ID of the Tax object
        @param _assignedValue The new value to be used for taxing this licence
     */
    function _updateTaxObjectValuation(uint256 _taxObjectId, uint256 _assignedValue) public onlyRegistry {
        taxObjects[_taxObjectId].currentAssignedValue = _assignedValue;
    }

    /** @notice Issue a bid to buy out a licence under Harberger Tax rules
        @param _offer The buyout amount - must be greater the minimum buyout amount based on current valuation
        @param _buyOutOwnerId The ID of the entity making the buyout offer.
        @return buyOutId The ID of the newly created buyout offer
     */
    function submitBuyOut(uint256 _taxObjectId, uint256 _offer, uint256 _buyOutOwnerId)
        public
        onlyRegistry
        returns (uint256)
    {
        require(_offer >= calculateMinBuyOutPrice(_taxObjectId), "Value sent is less than the minimum buyOut price");

        require(
            taxObjects[_taxObjectId].status == TaxObjectStatus.Active,
            "Can only submit a buyOut to an active active tax object"
        );

        BuyOut memory buyOut = BuyOut(
            _taxObjectId,
            _buyOutOwnerId,
            _offer,
            block.timestamp + BUYOUT_TIMEOUT,
            BuyOutStatus.Pending
        );

        buyOuts.push(buyOut);
        _buyoutIds.increment();
        uint256 buyOutId = _buyoutIds.current();

        taxObjects[_taxObjectId].buyOutIds.push(buyOutId);

        return buyOutId;
    }

    /** @notice Called by the Unicoin registry to perform the finalisation steps of a buy out
        @param _buyOutId The ID of the buyout being finalised
        @return success Returns true if the buyout was successful
        @dev Only valid for Pending buyouts, and where the buyout outbidding window has closed.
     */
    function finalizeBuyOutOffer(uint256 _buyOutId) public onlyRegistry returns (bool) {
        BuyOut memory buyOut = buyOuts[_buyOutId];
        require(buyOut.status == BuyOutStatus.Pending, "Can only finalize buyOut if buyOut is pending");
        require(
            buyOut.buyOutExpiration < block.timestamp,
            "can only finalize buyOut if it is past the expiration time"
        );

        if (buyOut.buyOutAmount < calculateMinBuyOutPrice(buyOut.taxObjectId)) {
            buyOuts[_buyOutId].status = BuyOutStatus.OutBid;

            return false; //the buyOut was not enough and so failed
        }

        buyOuts[_buyOutId].status = BuyOutStatus.Successful;
        taxObjects[buyOut.taxObjectId].currentAssignedValue = buyOut.buyOutAmount;
        taxObjects[buyOut.taxObjectId].numberOfOutBids += 1;
        taxObjects[buyOut.taxObjectId].lastPayment = block.timestamp;

        return true;
    }

    function revokeTaxObject(uint256 _taxObjectId) public onlyRegistry {
        taxObjects[_taxObjectId].status = TaxObjectStatus.Revoked;
    }

    function getLicenceTaxObjectId(uint256 _licenceId) public view returns (uint256) {
        uint256 numOfTaxObjects = licenceTaxObjects[_licenceId].length;
        require(numOfTaxObjects >= 1, "There is no tax object for this licence");
        return licenceTaxObjects[_licenceId][numOfTaxObjects - 1];
    }

    function getTaxObject(uint256 _taxObjectId)
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256[] memory, uint8)
    {
        TaxObject memory taxObject = taxObjects[_taxObjectId];

        return (
            taxObject.licenceId,
            taxObject.ratePerBlock,
            taxObject.lastPayment,
            taxObject.numberOfOutBids,
            taxObject.currentAssignedValue,
            taxObject.buyOutIds,
            uint8(taxObject.status)
        );
    }

    // taxObject_Id;
    //     uint256 buyOutOwner_Id;
    //     uint256 buyOutAmount;
    //     uint256 buyOutExpiration;
    //     BuyOutStatus status;

    function getBuyOut(uint256 _buyOutId) public view returns (uint256, uint256, uint256, uint256, uint8) {
        BuyOut memory buyOut = buyOuts[_buyOutId];
        return (
            buyOut.taxObjectId,
            buyOut.buyOutOwnerId,
            buyOut.buyOutAmount,
            buyOut.buyOutExpiration,
            uint8(buyOut.status)
        );
    }

    function getBuyOutLicenceId(uint256 _buyOutId) public view returns (uint256) {
        uint256 taxObject_Id = buyOuts[_buyOutId].taxObjectId;
        return taxObjects[taxObject_Id].licenceId;
    }

    function getBuyOutOwnerId(uint256 _buyOutId) public view returns (uint256) {
        return buyOuts[_buyOutId].buyOutOwnerId;
    }

    function getTaxObjectLength() public view returns (uint256) {
        return taxObjects.length;
    }

    /** @notice Provides details of all buyouts that have been made on this licence
        @param _licenceId The ID of the license being queried
        @return taxObjectId_ Array of IDs of tax objects associated with each buyout
        @return buyOutOwnerId_ Array of IDs of issuers of each buyout
        @return buyOutAmount_ The amount at which each buyout was bid
        @return buyOutExpiration_ The time at which each buyout became final
        @return status_ The status of each buyout
    */
    function getLicenceBuyOuts(uint256 _licenceId)
        public
        view
        returns (
            uint256[] memory taxObjectId_,
            uint256[] memory buyOutOwnerId_,
            uint256[] memory buyOutAmount_,
            uint256[] memory buyOutExpiration_,
            BuyOutStatus[] memory status_
        )
    {
        uint256 numberOfBuyOuts = licenceTaxObjects[_licenceId].length;

        taxObjectId_ = new uint256[](numberOfBuyOuts);
        buyOutOwnerId_ = new uint256[](numberOfBuyOuts);
        buyOutAmount_ = new uint256[](numberOfBuyOuts);
        buyOutExpiration_ = new uint256[](numberOfBuyOuts);
        status_ = new BuyOutStatus[](numberOfBuyOuts);

        for (uint256 i = 0; i < numberOfBuyOuts; i++) {
            uint256 buyOutId = licenceTaxObjects[_licenceId][i];
            taxObjectId_[i] = buyOuts[buyOutId].taxObjectId;
            buyOutOwnerId_[i] = buyOuts[buyOutId].buyOutOwnerId;
            buyOutAmount_[i] = buyOuts[buyOutId].buyOutAmount;
            buyOutExpiration_[i] = buyOuts[buyOutId].buyOutExpiration;
            status_[i] = buyOuts[buyOutId].status;
        }

        return (taxObjectId_, buyOutOwnerId_, buyOutAmount_, buyOutExpiration_, status_);
    }

    /**
      * @dev computes e ^ (x / FIXED_1) * FIXED_1
      * input range: 0 <= x <= OPT_EXP_MAX_VAL - 1
      * Detailed description:
      * - Rewrite the input as a sum of binary exponents and a single residual r, as small as possible
      * - The exponentiation of each binary exponent is given (pre-calculated)
      * - The exponentiation of r is calculated via Taylor series for e^x, where x = r
      * - The exponentiation of the input is calculated by multiplying the intermediate results above
      * - For example: e^5.521692859 = e^(4 + 1 + 0.5 + 0.021692859) = e^4 * e^1 * e^0.5 * e^0.021692859
    */
    function optimalExp(uint256 x) public pure returns (uint256) {
        uint256 res = 0;

        uint256 y;
        uint256 z;

        z = y = x % 0x10000000000000000000000000000000; // get the input modulo 2^(-3)
        z = (z * y) / FIXED_1;
        res += z * 0x10e1b3be415a0000; // add y^02 * (20! / 02!)
        z = (z * y) / FIXED_1;
        res += z * 0x05a0913f6b1e0000; // add y^03 * (20! / 03!)
        z = (z * y) / FIXED_1;
        res += z * 0x0168244fdac78000; // add y^04 * (20! / 04!)
        z = (z * y) / FIXED_1;
        res += z * 0x004807432bc18000; // add y^05 * (20! / 05!)
        z = (z * y) / FIXED_1;
        res += z * 0x000c0135dca04000; // add y^06 * (20! / 06!)
        z = (z * y) / FIXED_1;
        res += z * 0x0001b707b1cdc000; // add y^07 * (20! / 07!)
        z = (z * y) / FIXED_1;
        res += z * 0x000036e0f639b800; // add y^08 * (20! / 08!)
        z = (z * y) / FIXED_1;
        res += z * 0x00000618fee9f800; // add y^09 * (20! / 09!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000009c197dcc00; // add y^10 * (20! / 10!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000000e30dce400; // add y^11 * (20! / 11!)
        z = (z * y) / FIXED_1;
        res += z * 0x000000012ebd1300; // add y^12 * (20! / 12!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000000017499f00; // add y^13 * (20! / 13!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000000001a9d480; // add y^14 * (20! / 14!)
        z = (z * y) / FIXED_1;
        res += z * 0x00000000001c6380; // add y^15 * (20! / 15!)
        z = (z * y) / FIXED_1;
        res += z * 0x000000000001c638; // add y^16 * (20! / 16!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000000000001ab8; // add y^17 * (20! / 17!)
        z = (z * y) / FIXED_1;
        res += z * 0x000000000000017c; // add y^18 * (20! / 18!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000000000000014; // add y^19 * (20! / 19!)
        z = (z * y) / FIXED_1;
        res += z * 0x0000000000000001; // add y^20 * (20! / 20!)
        res = res / 0x21c3677c82b40000 + y + FIXED_1; // divide by 20! and then add y^1 / 1! + y^0 / 0!

        if ((x & 0x010000000000000000000000000000000) != 0)
            res = (res * 0x1c3d6a24ed82218787d624d3e5eba95f9) / 0x18ebef9eac820ae8682b9793ac6d1e776; // multiply by e^2^(-3)
        if ((x & 0x020000000000000000000000000000000) != 0)
            res = (res * 0x18ebef9eac820ae8682b9793ac6d1e778) / 0x1368b2fc6f9609fe7aceb46aa619baed4; // multiply by e^2^(-2)
        if ((x & 0x040000000000000000000000000000000) != 0)
            res = (res * 0x1368b2fc6f9609fe7aceb46aa619baed5) / 0x0bc5ab1b16779be3575bd8f0520a9f21f; // multiply by e^2^(-1)
        if ((x & 0x080000000000000000000000000000000) != 0)
            res = (res * 0x0bc5ab1b16779be3575bd8f0520a9f21e) / 0x0454aaa8efe072e7f6ddbab84b40a55c9; // multiply by e^2^(+0)
        if ((x & 0x100000000000000000000000000000000) != 0)
            res = (res * 0x0454aaa8efe072e7f6ddbab84b40a55c5) / 0x00960aadc109e7a3bf4578099615711ea; // multiply by e^2^(+1)
        if ((x & 0x200000000000000000000000000000000) != 0)
            res = (res * 0x00960aadc109e7a3bf4578099615711d7) / 0x0002bf84208204f5977f9a8cf01fdce3d; // multiply by e^2^(+2)
        if ((x & 0x400000000000000000000000000000000) != 0)
            res = (res * 0x0002bf84208204f5977f9a8cf01fdc307) / 0x0000003c6ab775dd0b95b4cbee7e65d11; // multiply by e^2^(+3)

        return res;
    }

    function capFunction(uint256 r, uint256 t1, uint256 t2) public pure returns (uint256) {
        uint256 t = t2 - t1;
        uint256 x = (r * t * FIXED_1) / (15 * 10**18);
        uint256 c = (optimalExp(x) * 10**18) / FIXED_1;
        return c;
    }

    function futureValue(uint256 N, uint256 r, uint256 t1, uint256 t2) public pure returns (uint256) {
        return (capFunction(r, t1, t2) * N) / 10**18;
    }
}
