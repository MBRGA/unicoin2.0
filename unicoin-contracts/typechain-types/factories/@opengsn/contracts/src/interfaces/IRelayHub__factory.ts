/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRelayHub,
  IRelayHubInterface,
} from "../../../../../@opengsn/contracts/src/interfaces/IRelayHub";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "paymaster",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fromBlock",
        type: "uint256",
      },
    ],
    name: "HubDeprecated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxWorkerCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasReserve",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postOverhead",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasOverhead",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRecipientDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minimumUnstakeDelay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minimumStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dataGasCostPerByte",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "externalCallDataCostOverhead",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct IRelayHub.RelayHubConfig",
        name: "config",
        type: "tuple",
      },
    ],
    name: "RelayHubConfigured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "relayManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseRelayFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pctRelayFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "relayUrl",
        type: "string",
      },
    ],
    name: "RelayServerRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "relayManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "newRelayWorkers",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "workersCount",
        type: "uint256",
      },
    ],
    name: "RelayWorkersAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "relayManager",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "paymaster",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "relayWorker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "innerGasUsed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "reason",
        type: "bytes",
      },
    ],
    name: "TransactionRejectedByPaymaster",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "relayManager",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "relayWorker",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymaster",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "enum IRelayHub.RelayCallStatus",
        name: "status",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "charge",
        type: "uint256",
      },
    ],
    name: "TransactionRelayed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum IRelayHub.RelayCallStatus",
        name: "status",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "returnValue",
        type: "bytes",
      },
    ],
    name: "TransactionResult",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "dest",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "newRelayWorkers",
        type: "address[]",
      },
    ],
    name: "addRelayWorkers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pctRelayFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseRelayFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "relayWorker",
            type: "address",
          },
          {
            internalType: "address",
            name: "paymaster",
            type: "address",
          },
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "paymasterData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "clientId",
            type: "uint256",
          },
        ],
        internalType: "struct GsnTypes.RelayData",
        name: "relayData",
        type: "tuple",
      },
    ],
    name: "calculateCharge",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "calldataGasCost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "depositFor",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fromBlock",
        type: "uint256",
      },
    ],
    name: "deprecateHub",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deprecationBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getConfiguration",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxWorkerCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasReserve",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postOverhead",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasOverhead",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRecipientDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minimumUnstakeDelay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minimumStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dataGasCostPerByte",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "externalCallDataCostOverhead",
            type: "uint256",
          },
        ],
        internalType: "struct IRelayHub.RelayHubConfig",
        name: "config",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isDeprecated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "relayManager",
        type: "address",
      },
    ],
    name: "isRelayManagerStaked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "relayWorker",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "penalize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "penalizer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseRelayFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pctRelayFee",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "url",
        type: "string",
      },
    ],
    name: "registerRelayServer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxAcceptanceBudget",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "gas",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
              {
                internalType: "uint256",
                name: "validUntil",
                type: "uint256",
              },
            ],
            internalType: "struct IForwarder.ForwardRequest",
            name: "request",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "gasPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "pctRelayFee",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "baseRelayFee",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "relayWorker",
                type: "address",
              },
              {
                internalType: "address",
                name: "paymaster",
                type: "address",
              },
              {
                internalType: "address",
                name: "forwarder",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "paymasterData",
                type: "bytes",
              },
              {
                internalType: "uint256",
                name: "clientId",
                type: "uint256",
              },
            ],
            internalType: "struct GsnTypes.RelayData",
            name: "relayData",
            type: "tuple",
          },
        ],
        internalType: "struct GsnTypes.RelayRequest",
        name: "relayRequest",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "approvalData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "externalGasLimit",
        type: "uint256",
      },
    ],
    name: "relayCall",
    outputs: [
      {
        internalType: "bool",
        name: "paymasterAccepted",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "returnValue",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxWorkerCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasReserve",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postOverhead",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasOverhead",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maximumRecipientDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minimumUnstakeDelay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minimumStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dataGasCostPerByte",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "externalCallDataCostOverhead",
            type: "uint256",
          },
        ],
        internalType: "struct IRelayHub.RelayHubConfig",
        name: "_config",
        type: "tuple",
      },
    ],
    name: "setConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeManager",
    outputs: [
      {
        internalType: "contract IStakeManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "versionHub",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "dest",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager",
        type: "address",
      },
    ],
    name: "workerCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "worker",
        type: "address",
      },
    ],
    name: "workerToManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IRelayHub__factory {
  static readonly abi = _abi;
  static createInterface(): IRelayHubInterface {
    return new utils.Interface(_abi) as IRelayHubInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRelayHub {
    return new Contract(address, _abi, signerOrProvider) as IRelayHub;
  }
}
