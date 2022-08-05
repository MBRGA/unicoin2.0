/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace SharedStructures {
  export type TaxObjectStruct = {
    licenceId: PromiseOrValue<BigNumberish>;
    ratePerBlock: PromiseOrValue<BigNumberish>;
    lastPayment: PromiseOrValue<BigNumberish>;
    numberOfOutBids: PromiseOrValue<BigNumberish>;
    currentAssignedValue: PromiseOrValue<BigNumberish>;
    buyOuts: PromiseOrValue<BigNumberish>[];
    status: PromiseOrValue<BigNumberish>;
  };

  export type TaxObjectStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber[],
    number
  ] & {
    licenceId: BigNumber;
    ratePerBlock: BigNumber;
    lastPayment: BigNumber;
    numberOfOutBids: BigNumber;
    currentAssignedValue: BigNumber;
    buyOuts: BigNumber[];
    status: number;
  };
}

export interface IHarbergerTaxManagerInterface extends utils.Interface {
  functions: {
    "_createTaxObject(uint256,uint256)": FunctionFragment;
    "_finalizeBuyOutOffer(uint256)": FunctionFragment;
    "_revokeTaxObject(uint256)": FunctionFragment;
    "_submitBuyOut(uint256,uint256,address)": FunctionFragment;
    "_updateTaxObjectLastPayment(uint256)": FunctionFragment;
    "_updateTaxObjectValuation(uint256,uint256)": FunctionFragment;
    "calcFutureValue(uint256,uint256,uint256,uint256)": FunctionFragment;
    "calcOptimalExp(uint256)": FunctionFragment;
    "calculateMinBuyOutPrice(uint256)": FunctionFragment;
    "calculateOutstandingTax(uint256)": FunctionFragment;
    "capFunction(uint256,uint256,uint256)": FunctionFragment;
    "getBuyOutLicenceId(uint256)": FunctionFragment;
    "getBuyOutOwnerAddress(uint256)": FunctionFragment;
    "getLicenceTaxObjectId(uint256)": FunctionFragment;
    "getTaxObject(uint256)": FunctionFragment;
    "getTaxObjectLength()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "_createTaxObject"
      | "_finalizeBuyOutOffer"
      | "_revokeTaxObject"
      | "_submitBuyOut"
      | "_updateTaxObjectLastPayment"
      | "_updateTaxObjectValuation"
      | "calcFutureValue"
      | "calcOptimalExp"
      | "calculateMinBuyOutPrice"
      | "calculateOutstandingTax"
      | "capFunction"
      | "getBuyOutLicenceId"
      | "getBuyOutOwnerAddress"
      | "getLicenceTaxObjectId"
      | "getTaxObject"
      | "getTaxObjectLength"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "_createTaxObject",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_finalizeBuyOutOffer",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_revokeTaxObject",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_submitBuyOut",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "_updateTaxObjectLastPayment",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_updateTaxObjectValuation",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "calcFutureValue",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "calcOptimalExp",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateMinBuyOutPrice",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateOutstandingTax",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "capFunction",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getBuyOutLicenceId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBuyOutOwnerAddress",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getLicenceTaxObjectId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTaxObject",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTaxObjectLength",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "_createTaxObject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_finalizeBuyOutOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_revokeTaxObject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_submitBuyOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_updateTaxObjectLastPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_updateTaxObjectValuation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calcFutureValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calcOptimalExp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateMinBuyOutPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateOutstandingTax",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "capFunction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBuyOutLicenceId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBuyOutOwnerAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLicenceTaxObjectId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTaxObject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTaxObjectLength",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IHarbergerTaxManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IHarbergerTaxManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    _createTaxObject(
      _licence_Id: PromiseOrValue<BigNumberish>,
      _currentAssignedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _finalizeBuyOutOffer(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _revokeTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _submitBuyOut(
      taxObject: PromiseOrValue<BigNumberish>,
      offer: PromiseOrValue<BigNumberish>,
      buyOutOwnerAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _updateTaxObjectLastPayment(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _updateTaxObjectValuation(
      taxObjectId: PromiseOrValue<BigNumberish>,
      assignedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    calcFutureValue(
      N: PromiseOrValue<BigNumberish>,
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calcOptimalExp(
      x: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculateMinBuyOutPrice(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculateOutstandingTax(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    capFunction(
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getBuyOutLicenceId(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getBuyOutOwnerAddress(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getLicenceTaxObjectId(
      licenceId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[SharedStructures.TaxObjectStructOutput]>;

    getTaxObjectLength(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  _createTaxObject(
    _licence_Id: PromiseOrValue<BigNumberish>,
    _currentAssignedValue: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _finalizeBuyOutOffer(
    buyOutId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _revokeTaxObject(
    taxObjectId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _submitBuyOut(
    taxObject: PromiseOrValue<BigNumberish>,
    offer: PromiseOrValue<BigNumberish>,
    buyOutOwnerAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _updateTaxObjectLastPayment(
    taxObjectId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _updateTaxObjectValuation(
    taxObjectId: PromiseOrValue<BigNumberish>,
    assignedValue: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  calcFutureValue(
    N: PromiseOrValue<BigNumberish>,
    r: PromiseOrValue<BigNumberish>,
    t1: PromiseOrValue<BigNumberish>,
    t2: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calcOptimalExp(
    x: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateMinBuyOutPrice(
    taxObjectId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateOutstandingTax(
    taxObjectId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  capFunction(
    r: PromiseOrValue<BigNumberish>,
    t1: PromiseOrValue<BigNumberish>,
    t2: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBuyOutLicenceId(
    buyOutId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBuyOutOwnerAddress(
    buyOutId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getLicenceTaxObjectId(
    licenceId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTaxObject(
    taxObjectId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<SharedStructures.TaxObjectStructOutput>;

  getTaxObjectLength(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    _createTaxObject(
      _licence_Id: PromiseOrValue<BigNumberish>,
      _currentAssignedValue: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _finalizeBuyOutOffer(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    _revokeTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    _submitBuyOut(
      taxObject: PromiseOrValue<BigNumberish>,
      offer: PromiseOrValue<BigNumberish>,
      buyOutOwnerAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _updateTaxObjectLastPayment(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    _updateTaxObjectValuation(
      taxObjectId: PromiseOrValue<BigNumberish>,
      assignedValue: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    calcFutureValue(
      N: PromiseOrValue<BigNumberish>,
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcOptimalExp(
      x: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateMinBuyOutPrice(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateOutstandingTax(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    capFunction(
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBuyOutLicenceId(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBuyOutOwnerAddress(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getLicenceTaxObjectId(
      licenceId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<SharedStructures.TaxObjectStructOutput>;

    getTaxObjectLength(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    _createTaxObject(
      _licence_Id: PromiseOrValue<BigNumberish>,
      _currentAssignedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _finalizeBuyOutOffer(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _revokeTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _submitBuyOut(
      taxObject: PromiseOrValue<BigNumberish>,
      offer: PromiseOrValue<BigNumberish>,
      buyOutOwnerAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _updateTaxObjectLastPayment(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _updateTaxObjectValuation(
      taxObjectId: PromiseOrValue<BigNumberish>,
      assignedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    calcFutureValue(
      N: PromiseOrValue<BigNumberish>,
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcOptimalExp(
      x: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateMinBuyOutPrice(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateOutstandingTax(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    capFunction(
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBuyOutLicenceId(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBuyOutOwnerAddress(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getLicenceTaxObjectId(
      licenceId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTaxObjectLength(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    _createTaxObject(
      _licence_Id: PromiseOrValue<BigNumberish>,
      _currentAssignedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _finalizeBuyOutOffer(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _revokeTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _submitBuyOut(
      taxObject: PromiseOrValue<BigNumberish>,
      offer: PromiseOrValue<BigNumberish>,
      buyOutOwnerAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _updateTaxObjectLastPayment(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _updateTaxObjectValuation(
      taxObjectId: PromiseOrValue<BigNumberish>,
      assignedValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    calcFutureValue(
      N: PromiseOrValue<BigNumberish>,
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calcOptimalExp(
      x: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateMinBuyOutPrice(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateOutstandingTax(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    capFunction(
      r: PromiseOrValue<BigNumberish>,
      t1: PromiseOrValue<BigNumberish>,
      t2: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBuyOutLicenceId(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBuyOutOwnerAddress(
      buyOutId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLicenceTaxObjectId(
      licenceId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTaxObject(
      taxObjectId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTaxObjectLength(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
