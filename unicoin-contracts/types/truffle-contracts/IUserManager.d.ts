/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IUserManagerContract
  extends Truffle.Contract<IUserManagerInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IUserManagerInstance>;
}

type AllEvents = never;

export interface IUserManagerInstance extends Truffle.ContractInstance {
  _registerUser: {
    (
      _profile_uri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _profile_uri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      _profile_uri: string,
      _userAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _profile_uri: string,
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
    _registerUser: {
      (
        _profile_uri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _profile_uri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        _profile_uri: string,
        _userAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _profile_uri: string,
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