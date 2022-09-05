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

export declare namespace SharedStructures {
  export type ContributionStruct = {
    contributorAddress: PromiseOrValue<string>;
    weighting: PromiseOrValue<BigNumberish>;
    balance: PromiseOrValue<BigNumberish>;
    lifetimeAllocations: PromiseOrValue<BigNumberish>;
  };

  export type ContributionStructOutput = [
    string,
    number,
    BigNumber,
    BigNumber
  ] & {
    contributorAddress: string;
    weighting: number;
    balance: BigNumber;
    lifetimeAllocations: BigNumber;
  };
}

export interface VaultInterface extends utils.Interface {
  functions: {
    "_settleBulkPayment(address,address,(address,uint16,uint256,uint256)[],uint256)": FunctionFragment;
    "_settlePayment(address,address,uint256)": FunctionFragment;
    "canAddressPay(address,uint256)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "_settleBulkPayment"
      | "_settlePayment"
      | "canAddressPay"
      | "initialize"
      | "isTrustedForwarder"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "_settleBulkPayment",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      SharedStructures.ContributionStruct[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "_settlePayment",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "canAddressPay",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "_settleBulkPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_settlePayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canAddressPay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface Vault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VaultInterface;

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
    _settleBulkPayment(
      sender: PromiseOrValue<string>,
      ownerAddress: PromiseOrValue<string>,
      contributors: SharedStructures.ContributionStruct[],
      paymentAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _settlePayment(
      sender: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    canAddressPay(
      _address: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    initialize(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  _settleBulkPayment(
    sender: PromiseOrValue<string>,
    ownerAddress: PromiseOrValue<string>,
    contributors: SharedStructures.ContributionStruct[],
    paymentAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _settlePayment(
    sender: PromiseOrValue<string>,
    receiver: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  canAddressPay(
    _address: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  initialize(
    _tokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isTrustedForwarder(
    forwarder: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    _settleBulkPayment(
      sender: PromiseOrValue<string>,
      ownerAddress: PromiseOrValue<string>,
      contributors: SharedStructures.ContributionStruct[],
      paymentAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    _settlePayment(
      sender: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    canAddressPay(
      _address: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initialize(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    _settleBulkPayment(
      sender: PromiseOrValue<string>,
      ownerAddress: PromiseOrValue<string>,
      contributors: SharedStructures.ContributionStruct[],
      paymentAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _settlePayment(
      sender: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    canAddressPay(
      _address: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _settleBulkPayment(
      sender: PromiseOrValue<string>,
      ownerAddress: PromiseOrValue<string>,
      contributors: SharedStructures.ContributionStruct[],
      paymentAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _settlePayment(
      sender: PromiseOrValue<string>,
      receiver: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    canAddressPay(
      _address: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}