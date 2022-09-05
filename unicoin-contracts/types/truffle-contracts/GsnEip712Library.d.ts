/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface GsnEip712LibraryContract
  extends Truffle.Contract<GsnEip712LibraryInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<GsnEip712LibraryInstance>;
}

type AllEvents = never;

export interface GsnEip712LibraryInstance extends Truffle.ContractInstance {
  EIP712DOMAIN_TYPEHASH(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  GENERIC_PARAMS(txDetails?: Truffle.TransactionDetails): Promise<string>;

  RELAYDATA_TYPE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  RELAYDATA_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

  RELAY_REQUEST_NAME(txDetails?: Truffle.TransactionDetails): Promise<string>;

  RELAY_REQUEST_SUFFIX(txDetails?: Truffle.TransactionDetails): Promise<string>;

  RELAY_REQUEST_TYPE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  RELAY_REQUEST_TYPEHASH(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  methods: {
    EIP712DOMAIN_TYPEHASH(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    GENERIC_PARAMS(txDetails?: Truffle.TransactionDetails): Promise<string>;

    RELAYDATA_TYPE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    RELAYDATA_TYPEHASH(txDetails?: Truffle.TransactionDetails): Promise<string>;

    RELAY_REQUEST_NAME(txDetails?: Truffle.TransactionDetails): Promise<string>;

    RELAY_REQUEST_SUFFIX(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    RELAY_REQUEST_TYPE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    RELAY_REQUEST_TYPEHASH(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
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