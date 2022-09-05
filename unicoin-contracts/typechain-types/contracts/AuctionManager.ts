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
  export type AuctionResultStruct = {
    winningAmount: PromiseOrValue<BigNumberish>;
    winnerAddress: PromiseOrValue<string>;
    publicationId: PromiseOrValue<BigNumberish>;
  };

  export type AuctionResultStructOutput = [BigNumber, string, BigNumber] & {
    winningAmount: BigNumber;
    winnerAddress: string;
    publicationId: BigNumber;
  };

  export type AuctionStruct = {
    publicationId: PromiseOrValue<BigNumberish>;
    auctionFloor: PromiseOrValue<BigNumberish>;
    startingTime: PromiseOrValue<BigNumberish>;
    duration: PromiseOrValue<BigNumberish>;
    auctionBidIds: PromiseOrValue<BigNumberish>[];
    winningBidId: PromiseOrValue<BigNumberish>;
    status: PromiseOrValue<BigNumberish>;
  };

  export type AuctionStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber[],
    BigNumber,
    number
  ] & {
    publicationId: BigNumber;
    auctionFloor: BigNumber;
    startingTime: BigNumber;
    duration: BigNumber;
    auctionBidIds: BigNumber[];
    winningBidId: BigNumber;
    status: number;
  };

  export type BidStruct = {
    commitBid: PromiseOrValue<BytesLike>;
    revealedBid: PromiseOrValue<BigNumberish>;
    revealedSalt: PromiseOrValue<BigNumberish>;
    status: PromiseOrValue<BigNumberish>;
    publicationId: PromiseOrValue<BigNumberish>;
    auctionId: PromiseOrValue<BigNumberish>;
    bidderAddress: PromiseOrValue<string>;
  };

  export type BidStructOutput = [
    string,
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    BigNumber,
    string
  ] & {
    commitBid: string;
    revealedBid: BigNumber;
    revealedSalt: BigNumber;
    status: number;
    publicationId: BigNumber;
    auctionId: BigNumber;
    bidderAddress: string;
  };
}

export interface AuctionManagerInterface extends utils.Interface {
  functions: {
    "_commitSealedBid(bytes32,uint256,address)": FunctionFragment;
    "_createAuction(uint256,uint256,uint256,uint256)": FunctionFragment;
    "_finalizeAuction(uint256)": FunctionFragment;
    "_revealSealedBid(uint256,uint256,uint256,uint256,address)": FunctionFragment;
    "_updateAuctionStartTime(uint256,uint256)": FunctionFragment;
    "auctions(uint256)": FunctionFragment;
    "bidOwners(address,uint256)": FunctionFragment;
    "getAuction(uint256)": FunctionFragment;
    "getAuctionBids(uint256)": FunctionFragment;
    "getAuctionStatus(uint256)": FunctionFragment;
    "getBid(uint256)": FunctionFragment;
    "getBidderBids(address)": FunctionFragment;
    "getNumberOfBidsInAuction(uint256)": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "_commitSealedBid"
      | "_createAuction"
      | "_finalizeAuction"
      | "_revealSealedBid"
      | "_updateAuctionStartTime"
      | "auctions"
      | "bidOwners"
      | "getAuction"
      | "getAuctionBids"
      | "getAuctionStatus"
      | "getBid"
      | "getBidderBids"
      | "getNumberOfBidsInAuction"
      | "isTrustedForwarder"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "_commitSealedBid",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "_createAuction",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "_finalizeAuction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "_revealSealedBid",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "_updateAuctionStartTime",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "auctions",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "bidOwners",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAuction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAuctionBids",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAuctionStatus",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBid",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBidderBids",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getNumberOfBidsInAuction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "_commitSealedBid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_createAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_finalizeAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_revealSealedBid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_updateAuctionStartTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "auctions", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bidOwners", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAuction", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAuctionBids",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAuctionStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBid", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBidderBids",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNumberOfBidsInAuction",
    data: BytesLike
  ): Result;
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

export interface AuctionManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AuctionManagerInterface;

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
    _commitSealedBid(
      bidHash: PromiseOrValue<BytesLike>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _createAuction(
      _publicationId: PromiseOrValue<BigNumberish>,
      _auctionFloor: PromiseOrValue<BigNumberish>,
      _auctionStartTime: PromiseOrValue<BigNumberish>,
      _auctionDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _finalizeAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _revealSealedBid(
      bidAmount: PromiseOrValue<BigNumberish>,
      salt: PromiseOrValue<BigNumberish>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    _updateAuctionStartTime(
      auctionId: PromiseOrValue<BigNumberish>,
      _newStartTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    auctions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, number] & {
        publicationId: BigNumber;
        auctionFloor: BigNumber;
        startingTime: BigNumber;
        duration: BigNumber;
        winningBidId: BigNumber;
        status: number;
      }
    >;

    bidOwners(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[SharedStructures.AuctionStructOutput]>;

    getAuctionBids(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getAuctionStatus(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getBid(
      bidId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[SharedStructures.BidStructOutput]>;

    getBidderBids(
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getNumberOfBidsInAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  _commitSealedBid(
    bidHash: PromiseOrValue<BytesLike>,
    auctionId: PromiseOrValue<BigNumberish>,
    bidderAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _createAuction(
    _publicationId: PromiseOrValue<BigNumberish>,
    _auctionFloor: PromiseOrValue<BigNumberish>,
    _auctionStartTime: PromiseOrValue<BigNumberish>,
    _auctionDuration: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _finalizeAuction(
    auctionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _revealSealedBid(
    bidAmount: PromiseOrValue<BigNumberish>,
    salt: PromiseOrValue<BigNumberish>,
    auctionId: PromiseOrValue<BigNumberish>,
    bidId: PromiseOrValue<BigNumberish>,
    bidderAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  _updateAuctionStartTime(
    auctionId: PromiseOrValue<BigNumberish>,
    _newStartTime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  auctions(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, number] & {
      publicationId: BigNumber;
      auctionFloor: BigNumber;
      startingTime: BigNumber;
      duration: BigNumber;
      winningBidId: BigNumber;
      status: number;
    }
  >;

  bidOwners(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getAuction(
    auctionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<SharedStructures.AuctionStructOutput>;

  getAuctionBids(
    auctionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getAuctionStatus(
    auctionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getBid(
    bidId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<SharedStructures.BidStructOutput>;

  getBidderBids(
    bidderAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getNumberOfBidsInAuction(
    auctionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isTrustedForwarder(
    forwarder: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    _commitSealedBid(
      bidHash: PromiseOrValue<BytesLike>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _createAuction(
      _publicationId: PromiseOrValue<BigNumberish>,
      _auctionFloor: PromiseOrValue<BigNumberish>,
      _auctionStartTime: PromiseOrValue<BigNumberish>,
      _auctionDuration: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _finalizeAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<SharedStructures.AuctionResultStructOutput>;

    _revealSealedBid(
      bidAmount: PromiseOrValue<BigNumberish>,
      salt: PromiseOrValue<BigNumberish>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    _updateAuctionStartTime(
      auctionId: PromiseOrValue<BigNumberish>,
      _newStartTime: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    auctions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, number] & {
        publicationId: BigNumber;
        auctionFloor: BigNumber;
        startingTime: BigNumber;
        duration: BigNumber;
        winningBidId: BigNumber;
        status: number;
      }
    >;

    bidOwners(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<SharedStructures.AuctionStructOutput>;

    getAuctionBids(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getAuctionStatus(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<number>;

    getBid(
      bidId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<SharedStructures.BidStructOutput>;

    getBidderBids(
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getNumberOfBidsInAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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
    _commitSealedBid(
      bidHash: PromiseOrValue<BytesLike>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _createAuction(
      _publicationId: PromiseOrValue<BigNumberish>,
      _auctionFloor: PromiseOrValue<BigNumberish>,
      _auctionStartTime: PromiseOrValue<BigNumberish>,
      _auctionDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _finalizeAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _revealSealedBid(
      bidAmount: PromiseOrValue<BigNumberish>,
      salt: PromiseOrValue<BigNumberish>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    _updateAuctionStartTime(
      auctionId: PromiseOrValue<BigNumberish>,
      _newStartTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    auctions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bidOwners(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAuctionBids(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAuctionStatus(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getBid(
      bidId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBidderBids(
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNumberOfBidsInAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _commitSealedBid(
      bidHash: PromiseOrValue<BytesLike>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _createAuction(
      _publicationId: PromiseOrValue<BigNumberish>,
      _auctionFloor: PromiseOrValue<BigNumberish>,
      _auctionStartTime: PromiseOrValue<BigNumberish>,
      _auctionDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _finalizeAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _revealSealedBid(
      bidAmount: PromiseOrValue<BigNumberish>,
      salt: PromiseOrValue<BigNumberish>,
      auctionId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    _updateAuctionStartTime(
      auctionId: PromiseOrValue<BigNumberish>,
      _newStartTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    auctions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bidOwners(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAuctionBids(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAuctionStatus(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getBid(
      bidId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBidderBids(
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNumberOfBidsInAuction(
      auctionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}