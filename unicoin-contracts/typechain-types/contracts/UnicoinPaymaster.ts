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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export declare namespace IForwarder {
  export type ForwardRequestStruct = {
    from: PromiseOrValue<string>;
    to: PromiseOrValue<string>;
    value: PromiseOrValue<BigNumberish>;
    gas: PromiseOrValue<BigNumberish>;
    nonce: PromiseOrValue<BigNumberish>;
    data: PromiseOrValue<BytesLike>;
    validUntil: PromiseOrValue<BigNumberish>;
  };

  export type ForwardRequestStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber
  ] & {
    from: string;
    to: string;
    value: BigNumber;
    gas: BigNumber;
    nonce: BigNumber;
    data: string;
    validUntil: BigNumber;
  };
}

export declare namespace GsnTypes {
  export type RelayDataStruct = {
    gasPrice: PromiseOrValue<BigNumberish>;
    pctRelayFee: PromiseOrValue<BigNumberish>;
    baseRelayFee: PromiseOrValue<BigNumberish>;
    relayWorker: PromiseOrValue<string>;
    paymaster: PromiseOrValue<string>;
    forwarder: PromiseOrValue<string>;
    paymasterData: PromiseOrValue<BytesLike>;
    clientId: PromiseOrValue<BigNumberish>;
  };

  export type RelayDataStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    string,
    BigNumber
  ] & {
    gasPrice: BigNumber;
    pctRelayFee: BigNumber;
    baseRelayFee: BigNumber;
    relayWorker: string;
    paymaster: string;
    forwarder: string;
    paymasterData: string;
    clientId: BigNumber;
  };

  export type RelayRequestStruct = {
    request: IForwarder.ForwardRequestStruct;
    relayData: GsnTypes.RelayDataStruct;
  };

  export type RelayRequestStructOutput = [
    IForwarder.ForwardRequestStructOutput,
    GsnTypes.RelayDataStructOutput
  ] & {
    request: IForwarder.ForwardRequestStructOutput;
    relayData: GsnTypes.RelayDataStructOutput;
  };
}

export declare namespace IPaymaster {
  export type GasAndDataLimitsStruct = {
    acceptanceBudget: PromiseOrValue<BigNumberish>;
    preRelayedCallGasLimit: PromiseOrValue<BigNumberish>;
    postRelayedCallGasLimit: PromiseOrValue<BigNumberish>;
    calldataSizeLimit: PromiseOrValue<BigNumberish>;
  };

  export type GasAndDataLimitsStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    acceptanceBudget: BigNumber;
    preRelayedCallGasLimit: BigNumber;
    postRelayedCallGasLimit: BigNumber;
    calldataSizeLimit: BigNumber;
  };
}

export interface UnicoinPaymasterInterface extends utils.Interface {
  functions: {
    "CALLDATA_SIZE_LIMIT()": FunctionFragment;
    "FORWARDER_HUB_OVERHEAD()": FunctionFragment;
    "PAYMASTER_ACCEPTANCE_BUDGET()": FunctionFragment;
    "POST_RELAYED_CALL_GAS_LIMIT()": FunctionFragment;
    "PRE_RELAYED_CALL_GAS_LIMIT()": FunctionFragment;
    "_verifyForwarder(((address,address,uint256,uint256,uint256,bytes,uint256),(uint256,uint256,uint256,address,address,address,bytes,uint256)))": FunctionFragment;
    "getGasAndDataLimits()": FunctionFragment;
    "getHubAddr()": FunctionFragment;
    "getRelayHubDeposit()": FunctionFragment;
    "initialize()": FunctionFragment;
    "owner()": FunctionFragment;
    "postRelayedCall(bytes,bool,uint256,(uint256,uint256,uint256,address,address,address,bytes,uint256))": FunctionFragment;
    "preRelayedCall(((address,address,uint256,uint256,uint256,bytes,uint256),(uint256,uint256,uint256,address,address,address,bytes,uint256)),bytes,bytes,uint256)": FunctionFragment;
    "registry()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setRelayHub(address)": FunctionFragment;
    "setTarget(address)": FunctionFragment;
    "setTrustedForwarder(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "trustedForwarder()": FunctionFragment;
    "versionPaymaster()": FunctionFragment;
    "withdrawRelayHubDepositTo(uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "CALLDATA_SIZE_LIMIT"
      | "FORWARDER_HUB_OVERHEAD"
      | "PAYMASTER_ACCEPTANCE_BUDGET"
      | "POST_RELAYED_CALL_GAS_LIMIT"
      | "PRE_RELAYED_CALL_GAS_LIMIT"
      | "_verifyForwarder"
      | "getGasAndDataLimits"
      | "getHubAddr"
      | "getRelayHubDeposit"
      | "initialize"
      | "owner"
      | "postRelayedCall"
      | "preRelayedCall"
      | "registry"
      | "renounceOwnership"
      | "setRelayHub"
      | "setTarget"
      | "setTrustedForwarder"
      | "transferOwnership"
      | "trustedForwarder"
      | "versionPaymaster"
      | "withdrawRelayHubDepositTo"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "CALLDATA_SIZE_LIMIT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "FORWARDER_HUB_OVERHEAD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PAYMASTER_ACCEPTANCE_BUDGET",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "POST_RELAYED_CALL_GAS_LIMIT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PRE_RELAYED_CALL_GAS_LIMIT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_verifyForwarder",
    values: [GsnTypes.RelayRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getGasAndDataLimits",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHubAddr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRelayHubDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postRelayedCall",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      GsnTypes.RelayDataStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "preRelayedCall",
    values: [
      GsnTypes.RelayRequestStruct,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRelayHub",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTarget",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTrustedForwarder",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "trustedForwarder",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "versionPaymaster",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawRelayHubDepositTo",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "CALLDATA_SIZE_LIMIT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "FORWARDER_HUB_OVERHEAD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PAYMASTER_ACCEPTANCE_BUDGET",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "POST_RELAYED_CALL_GAS_LIMIT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PRE_RELAYED_CALL_GAS_LIMIT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_verifyForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getGasAndDataLimits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getHubAddr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRelayHubDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "postRelayedCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "preRelayedCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRelayHub",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setTarget", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "trustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "versionPaymaster",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRelayHubDepositTo",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PostRelayed(uint256)": EventFragment;
    "PreRelayed(uint256)": EventFragment;
    "TargetSet(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PostRelayed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PreRelayed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TargetSet"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PostRelayedEventObject {
  arg0: BigNumber;
}
export type PostRelayedEvent = TypedEvent<[BigNumber], PostRelayedEventObject>;

export type PostRelayedEventFilter = TypedEventFilter<PostRelayedEvent>;

export interface PreRelayedEventObject {
  arg0: BigNumber;
}
export type PreRelayedEvent = TypedEvent<[BigNumber], PreRelayedEventObject>;

export type PreRelayedEventFilter = TypedEventFilter<PreRelayedEvent>;

export interface TargetSetEventObject {
  target: string;
}
export type TargetSetEvent = TypedEvent<[string], TargetSetEventObject>;

export type TargetSetEventFilter = TypedEventFilter<TargetSetEvent>;

export interface UnicoinPaymaster extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UnicoinPaymasterInterface;

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
    CALLDATA_SIZE_LIMIT(overrides?: CallOverrides): Promise<[BigNumber]>;

    FORWARDER_HUB_OVERHEAD(overrides?: CallOverrides): Promise<[BigNumber]>;

    PAYMASTER_ACCEPTANCE_BUDGET(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    POST_RELAYED_CALL_GAS_LIMIT(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    PRE_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<[BigNumber]>;

    _verifyForwarder(
      relayRequest: GsnTypes.RelayRequestStruct,
      overrides?: CallOverrides
    ): Promise<[void]>;

    getGasAndDataLimits(
      overrides?: CallOverrides
    ): Promise<
      [IPaymaster.GasAndDataLimitsStructOutput] & {
        limits: IPaymaster.GasAndDataLimitsStructOutput;
      }
    >;

    getHubAddr(overrides?: CallOverrides): Promise<[string]>;

    getRelayHubDeposit(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    postRelayedCall(
      context: PromiseOrValue<BytesLike>,
      success: PromiseOrValue<boolean>,
      gasUseWithoutPost: PromiseOrValue<BigNumberish>,
      relayData: GsnTypes.RelayDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    preRelayedCall(
      relayRequest: GsnTypes.RelayRequestStruct,
      signature: PromiseOrValue<BytesLike>,
      approvalData: PromiseOrValue<BytesLike>,
      maxPossibleGas: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registry(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRelayHub(
      hub: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTarget(
      target: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    trustedForwarder(overrides?: CallOverrides): Promise<[string]>;

    versionPaymaster(overrides?: CallOverrides): Promise<[string]>;

    withdrawRelayHubDepositTo(
      amount: PromiseOrValue<BigNumberish>,
      target: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  CALLDATA_SIZE_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

  FORWARDER_HUB_OVERHEAD(overrides?: CallOverrides): Promise<BigNumber>;

  PAYMASTER_ACCEPTANCE_BUDGET(overrides?: CallOverrides): Promise<BigNumber>;

  POST_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

  PRE_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

  _verifyForwarder(
    relayRequest: GsnTypes.RelayRequestStruct,
    overrides?: CallOverrides
  ): Promise<void>;

  getGasAndDataLimits(
    overrides?: CallOverrides
  ): Promise<IPaymaster.GasAndDataLimitsStructOutput>;

  getHubAddr(overrides?: CallOverrides): Promise<string>;

  getRelayHubDeposit(overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  postRelayedCall(
    context: PromiseOrValue<BytesLike>,
    success: PromiseOrValue<boolean>,
    gasUseWithoutPost: PromiseOrValue<BigNumberish>,
    relayData: GsnTypes.RelayDataStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  preRelayedCall(
    relayRequest: GsnTypes.RelayRequestStruct,
    signature: PromiseOrValue<BytesLike>,
    approvalData: PromiseOrValue<BytesLike>,
    maxPossibleGas: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registry(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRelayHub(
    hub: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTarget(
    target: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTrustedForwarder(
    forwarder: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  trustedForwarder(overrides?: CallOverrides): Promise<string>;

  versionPaymaster(overrides?: CallOverrides): Promise<string>;

  withdrawRelayHubDepositTo(
    amount: PromiseOrValue<BigNumberish>,
    target: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CALLDATA_SIZE_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    FORWARDER_HUB_OVERHEAD(overrides?: CallOverrides): Promise<BigNumber>;

    PAYMASTER_ACCEPTANCE_BUDGET(overrides?: CallOverrides): Promise<BigNumber>;

    POST_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    PRE_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    _verifyForwarder(
      relayRequest: GsnTypes.RelayRequestStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getGasAndDataLimits(
      overrides?: CallOverrides
    ): Promise<IPaymaster.GasAndDataLimitsStructOutput>;

    getHubAddr(overrides?: CallOverrides): Promise<string>;

    getRelayHubDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    postRelayedCall(
      context: PromiseOrValue<BytesLike>,
      success: PromiseOrValue<boolean>,
      gasUseWithoutPost: PromiseOrValue<BigNumberish>,
      relayData: GsnTypes.RelayDataStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    preRelayedCall(
      relayRequest: GsnTypes.RelayRequestStruct,
      signature: PromiseOrValue<BytesLike>,
      approvalData: PromiseOrValue<BytesLike>,
      maxPossibleGas: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, boolean] & { context: string; rejectOnRecipientRevert: boolean }
    >;

    registry(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setRelayHub(
      hub: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTarget(
      target: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    trustedForwarder(overrides?: CallOverrides): Promise<string>;

    versionPaymaster(overrides?: CallOverrides): Promise<string>;

    withdrawRelayHubDepositTo(
      amount: PromiseOrValue<BigNumberish>,
      target: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "PostRelayed(uint256)"(arg0?: null): PostRelayedEventFilter;
    PostRelayed(arg0?: null): PostRelayedEventFilter;

    "PreRelayed(uint256)"(arg0?: null): PreRelayedEventFilter;
    PreRelayed(arg0?: null): PreRelayedEventFilter;

    "TargetSet(address)"(target?: null): TargetSetEventFilter;
    TargetSet(target?: null): TargetSetEventFilter;
  };

  estimateGas: {
    CALLDATA_SIZE_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    FORWARDER_HUB_OVERHEAD(overrides?: CallOverrides): Promise<BigNumber>;

    PAYMASTER_ACCEPTANCE_BUDGET(overrides?: CallOverrides): Promise<BigNumber>;

    POST_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    PRE_RELAYED_CALL_GAS_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    _verifyForwarder(
      relayRequest: GsnTypes.RelayRequestStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getGasAndDataLimits(overrides?: CallOverrides): Promise<BigNumber>;

    getHubAddr(overrides?: CallOverrides): Promise<BigNumber>;

    getRelayHubDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    postRelayedCall(
      context: PromiseOrValue<BytesLike>,
      success: PromiseOrValue<boolean>,
      gasUseWithoutPost: PromiseOrValue<BigNumberish>,
      relayData: GsnTypes.RelayDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    preRelayedCall(
      relayRequest: GsnTypes.RelayRequestStruct,
      signature: PromiseOrValue<BytesLike>,
      approvalData: PromiseOrValue<BytesLike>,
      maxPossibleGas: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registry(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRelayHub(
      hub: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTarget(
      target: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    trustedForwarder(overrides?: CallOverrides): Promise<BigNumber>;

    versionPaymaster(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawRelayHubDepositTo(
      amount: PromiseOrValue<BigNumberish>,
      target: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CALLDATA_SIZE_LIMIT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    FORWARDER_HUB_OVERHEAD(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PAYMASTER_ACCEPTANCE_BUDGET(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    POST_RELAYED_CALL_GAS_LIMIT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PRE_RELAYED_CALL_GAS_LIMIT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _verifyForwarder(
      relayRequest: GsnTypes.RelayRequestStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getGasAndDataLimits(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getHubAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRelayHubDeposit(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    postRelayedCall(
      context: PromiseOrValue<BytesLike>,
      success: PromiseOrValue<boolean>,
      gasUseWithoutPost: PromiseOrValue<BigNumberish>,
      relayData: GsnTypes.RelayDataStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    preRelayedCall(
      relayRequest: GsnTypes.RelayRequestStruct,
      signature: PromiseOrValue<BytesLike>,
      approvalData: PromiseOrValue<BytesLike>,
      maxPossibleGas: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRelayHub(
      hub: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTarget(
      target: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    trustedForwarder(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    versionPaymaster(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawRelayHubDepositTo(
      amount: PromiseOrValue<BigNumberish>,
      target: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
