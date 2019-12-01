pragma solidity ^0.5.12;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract HarbegerTaxManager is Initializable {
    uint256 private constant FIXED_1 = 0x080000000000000000000000000000000;
    //percentage increase over previous price that must be paid to buy out the licence
    uint256 minimumPriceIncreaseToBuyOut = 5;
    //a buyout has an expiratory of 10 days for the owner to raize the price or loose the licence
    uint256 buyOutExpiration = 60 * 60 * 24 * 10;

    address registry;

    struct TaxObject {
        uint256 licenceId;
        uint256 ratePerBlock;
        uint256 lastPayment;
        uint256 numberOfOutBids;
        uint256 currentAssignedValue;
        uint256[] buyout_Ids;
    }

    TaxObject[] taxObjects;

    enum BuyoutStatus {Pending, Successful, OutBid}

    struct BuyOut {
        uint256 taxObject_Id;
        uint256 buyoutOwner_Id;
        uint256 buyoutAmount;
        uint256 buyOutExpiration;
        BuyoutStatus status;
    }

    BuyOut[] buyOuts;

    mapping(uint256 => uint256[]) public buyOutOwners;

    modifier onlyRegistry() {
        require(msg.sender == registry, "Can only be called by registry");
        _;
    }

    function initialize(address _unicoinRegistry) public initializer {
        registry = _unicoinRegistry;

    }

    function createTaxObject(
        uint256 _licenceId,
        uint256 _ratePerBlock,
        uint256 _currentAssignedValue
    ) public onlyRegistry returns (uint256) {
        uint256[] memory buyOutIds;
        TaxObject memory taxObject = TaxObject(
            _licenceId,
            _ratePerBlock,
            now,
            0,
            _currentAssignedValue,
            buyOutIds
        );

        uint256 taxObjectId = taxObjects.push(taxObject) - 1;

        return taxObjectId;
    }

    function calculateOutstandingTax(uint256 _taxObject_Id)
        public
        view
        returns (uint256)
    {
        TaxObject memory taxObject = taxObjects[_taxObject_Id];
        uint256 futureValue = futureValue(
            taxObject.currentAssignedValue,
            taxObject.ratePerBlock,
            taxObject.lastPayment,
            now
        );

        uint256 interestOutstanding = futureValue -
            taxObject.currentAssignedValue;
        return interestOutstanding;
    }

    function calculateMinBuyOutPrice(uint256 _taxObject_Id)
        public
        view
        returns (uint256)
    {
        return
            (taxObjects[_taxObject_Id].currentAssignedValue *
                (100 + minimumPriceIncreaseToBuyOut)) /
            100;
    }

    function updateTaxObjectLastPayment(uint256 _taxObject_Id)
        public
        onlyRegistry
    {
        taxObjects[_taxObject_Id].lastPayment = now;
    }

    function updateTaxObjectPrivateValuation(
        uint256 _taxObject_Id,
        uint256 _assignedValue
    ) public onlyRegistry {
        taxObjects[_taxObject_Id].currentAssignedValue = _assignedValue;
    }

    function submitBuyOut(
        uint256 _taxObject,
        uint256 _offer,
        uint256 _buyOutOwner_Id
    ) public onlyRegistry returns (uint256) {
        require(
            _offer >=
                calculateMinBuyOutPrice(
                    taxObjects[_taxObject].currentAssignedValue
                ),
            "Value sent is less than the minimum buyout price"
        );

        BuyOut memory buyOut = BuyOut(
            _taxObject,
            _buyOutOwner_Id,
            _offer,
            now + buyOutExpiration,
            BuyoutStatus.Pending
        );

        uint256 buyOut_Id = buyOuts.push(buyOut) - 1;
        buyOutOwners[_buyOutOwner_Id].push(buyOut_Id);
        taxObjects[_taxObject].buyout_Ids.push(buyOut_Id);
    }

    function finalizeBuyOutOffer(uint256 _buyOut_Id)
        public
        onlyRegistry
        returns (bool)
    {
        BuyOut memory buyOut = buyOuts[_buyOut_Id];
        TaxObject memory taxObject = taxObjects[buyOut.taxObject_Id];
        require(
            buyOut.status == BuyoutStatus.Pending,
            "Can only finalize buyout if buyout is pending"
        );
        require(
            buyOut.buyOutExpiration < now,
            "can only finalize buyout if it is past the expiration time"
        );
        if (
            buyOut.buyoutAmount <
            calculateMinBuyOutPrice(taxObject.currentAssignedValue)
        ) {
            buyOuts[_buyOut_Id].status = BuyoutStatus.OutBid;
            return false; //the buyout was not enough and so failed
        }
        if (
            buyOut.buyoutAmount >
            calculateMinBuyOutPrice(taxObject.currentAssignedValue)
        ) {
            buyOuts[_buyOut_Id].status = BuyoutStatus.Successful;
            taxObjects[buyOut.taxObject_Id].currentAssignedValue = buyOut
                .buyoutAmount;
            taxObjects[buyOut.taxObject_Id].numberOfOutBids += 1;
            return true;
        }
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
            res =
                (res * 0x1c3d6a24ed82218787d624d3e5eba95f9) /
                0x18ebef9eac820ae8682b9793ac6d1e776; // multiply by e^2^(-3)
        if ((x & 0x020000000000000000000000000000000) != 0)
            res =
                (res * 0x18ebef9eac820ae8682b9793ac6d1e778) /
                0x1368b2fc6f9609fe7aceb46aa619baed4; // multiply by e^2^(-2)
        if ((x & 0x040000000000000000000000000000000) != 0)
            res =
                (res * 0x1368b2fc6f9609fe7aceb46aa619baed5) /
                0x0bc5ab1b16779be3575bd8f0520a9f21f; // multiply by e^2^(-1)
        if ((x & 0x080000000000000000000000000000000) != 0)
            res =
                (res * 0x0bc5ab1b16779be3575bd8f0520a9f21e) /
                0x0454aaa8efe072e7f6ddbab84b40a55c9; // multiply by e^2^(+0)
        if ((x & 0x100000000000000000000000000000000) != 0)
            res =
                (res * 0x0454aaa8efe072e7f6ddbab84b40a55c5) /
                0x00960aadc109e7a3bf4578099615711ea; // multiply by e^2^(+1)
        if ((x & 0x200000000000000000000000000000000) != 0)
            res =
                (res * 0x00960aadc109e7a3bf4578099615711d7) /
                0x0002bf84208204f5977f9a8cf01fdce3d; // multiply by e^2^(+2)
        if ((x & 0x400000000000000000000000000000000) != 0)
            res =
                (res * 0x0002bf84208204f5977f9a8cf01fdc307) /
                0x0000003c6ab775dd0b95b4cbee7e65d11; // multiply by e^2^(+3)

        return res;
    }

    function capFunction(uint256 r, uint256 t1, uint256 t2)
        public
        pure
        returns (uint256)
    {
        uint256 t = t2 - t1;
        uint256 x = (r * t * FIXED_1) / (15 * 10**18);
        uint256 c = (optimalExp(x) * 10**18) / FIXED_1;
        return c;
    }

    function futureValue(uint256 N, uint256 r, uint256 t1, uint256 t2)
        public
        view
        returns (uint256)
    {
        return (capFunction(r, t1, t2) * N) / 10**18;
    }
}
