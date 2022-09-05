/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IVaultContract extends Truffle.Contract<IVaultInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IVaultInstance>;
}

type AllEvents = never;

export interface IVaultInstance extends Truffle.ContractInstance {
  canAddressPay(
    _address: string,
    _amount: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  settlePayment: {
    (
      _sender: string,
      _reciver: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _sender: string,
      _reciver: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
    sendTransaction(
      _sender: string,
      _reciver: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _sender: string,
      _reciver: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  settleBulkPayment: {
    (
      _sender: string,
      ownerAddress: string,
      contributors: {
        contributorAddress: string;
        weighting: number | BN | string;
        balance: number | BN | string;
        lifetimeAllocations: number | BN | string;
      }[],
      paymentAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _sender: string,
      ownerAddress: string,
      contributors: {
        contributorAddress: string;
        weighting: number | BN | string;
        balance: number | BN | string;
        lifetimeAllocations: number | BN | string;
      }[],
      paymentAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      _sender: string,
      ownerAddress: string,
      contributors: {
        contributorAddress: string;
        weighting: number | BN | string;
        balance: number | BN | string;
        lifetimeAllocations: number | BN | string;
      }[],
      paymentAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _sender: string,
      ownerAddress: string,
      contributors: {
        contributorAddress: string;
        weighting: number | BN | string;
        balance: number | BN | string;
        lifetimeAllocations: number | BN | string;
      }[],
      paymentAmount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    canAddressPay(
      _address: string,
      _amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    settlePayment: {
      (
        _sender: string,
        _reciver: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _sender: string,
        _reciver: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<BN>;
      sendTransaction(
        _sender: string,
        _reciver: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _sender: string,
        _reciver: string,
        _amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    settleBulkPayment: {
      (
        _sender: string,
        ownerAddress: string,
        contributors: {
          contributorAddress: string;
          weighting: number | BN | string;
          balance: number | BN | string;
          lifetimeAllocations: number | BN | string;
        }[],
        paymentAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _sender: string,
        ownerAddress: string,
        contributors: {
          contributorAddress: string;
          weighting: number | BN | string;
          balance: number | BN | string;
          lifetimeAllocations: number | BN | string;
        }[],
        paymentAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        _sender: string,
        ownerAddress: string,
        contributors: {
          contributorAddress: string;
          weighting: number | BN | string;
          balance: number | BN | string;
          lifetimeAllocations: number | BN | string;
        }[],
        paymentAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _sender: string,
        ownerAddress: string,
        contributors: {
          contributorAddress: string;
          weighting: number | BN | string;
          balance: number | BN | string;
          lifetimeAllocations: number | BN | string;
        }[],
        paymentAmount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
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