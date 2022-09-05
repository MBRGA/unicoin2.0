/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface UserManagerContract
  extends Truffle.Contract<UserManagerInstance> {
  "new"(
    unicoinRegistry: string,
    trustedForwarder: string,
    meta?: Truffle.TransactionDetails
  ): Promise<UserManagerInstance>;
}

export interface Initialized {
  name: "Initialized";
  args: {
    version: BN;
    0: BN;
  };
}

type AllEvents = Initialized;

export interface UserManagerInstance extends Truffle.ContractInstance {
  isTrustedForwarder(
    forwarder: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  users(
    arg0: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: boolean; 1: BN; 2: string }>;

  initialize: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  _registerUser: {
    (
      _profileUri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _profileUri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      _profileUri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _profileUri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  isAddressRegistered(
    _userAddress: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  getUserId(
    _userAddress: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  methods: {
    isTrustedForwarder(
      forwarder: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    users(
      arg0: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: boolean; 1: BN; 2: string }>;

    initialize: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    _registerUser: {
      (
        _profileUri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _profileUri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        _profileUri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _profileUri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    isAddressRegistered(
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    getUserId(
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}