/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  HarbergerTaxManager,
  HarbergerTaxManagerInterface,
} from "../../contracts/HarbergerTaxManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "registry",
        type: "address",
      },
      {
        internalType: "address",
        name: "trustedForwarder",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "licenceId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentAssignedValue",
        type: "uint256",
      },
    ],
    name: "_createTaxObject",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "buyOutId",
        type: "uint256",
      },
    ],
    name: "_finalizeBuyOutOffer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taxObjectId",
        type: "uint256",
      },
    ],
    name: "_revokeTaxObject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taxObjectId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "offer",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "bayOutOwnerAddress",
        type: "address",
      },
    ],
    name: "_submitBuyOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taxObjectId",
        type: "uint256",
      },
    ],
    name: "_updateTaxObjectLastPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taxObjectId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_assignedValue",
        type: "uint256",
      },
    ],
    name: "_updateTaxObjectValuation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "N",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "r",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "t1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "t2",
        type: "uint256",
      },
    ],
    name: "calcFutureValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "calcOptimalExp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "taxObjectId",
        type: "uint256",
      },
    ],
    name: "calculateMinBuyOutPrice",
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
        name: "taxObjectId",
        type: "uint256",
      },
    ],
    name: "calculateOutstandingTax",
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
        name: "r",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "t1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "t2",
        type: "uint256",
      },
    ],
    name: "capFunction",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "buyOutId",
        type: "uint256",
      },
    ],
    name: "getBuyOutLicenceId",
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
        name: "buyOutId",
        type: "uint256",
      },
    ],
    name: "getBuyOutOwnerAddress",
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
        name: "licenceId",
        type: "uint256",
      },
    ],
    name: "getLicenceTaxObjectId",
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
        name: "taxObjectId",
        type: "uint256",
      },
    ],
    name: "getTaxObject",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "licenceId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastPayment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "numberOfOutBids",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentAssignedValue",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "buyOuts",
            type: "uint256[]",
          },
          {
            internalType: "enum SharedStructures.TaxObjectStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct SharedStructures.TaxObject",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTaxObjectLength",
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
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "licenceTaxObjects",
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
];

const _bytecode =
  "0x60c0346200019f57601f6200187338819003918201601f19168301916001600160401b03831184841017620001a45780849260409485528339810103126200019f576200005a60206200005283620001ba565b9201620001ba565b6080526000549060ff8260081c16159182809362000191575b801562000178575b156200011c5760ff1981166001176000558262000109575b5060a052620000cd575b6040516116a39081620001d082396080518181816108a00152610e61015260a0518181816101140152610a310152f35b61ff0019600054166000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a16200009d565b61ffff1916610101176000553862000093565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156200007b5750600160ff8216146200007b565b50600160ff82161062000073565b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036200019f5756fe6040608081526004908136101561001557600080fd5b6000803560e01c8063041d9489146109f15780631c5a27db1461099957806325c274721461096657806338b360261461094757806341107ff7146108fd57806341426813146108c9578063572b6c05146108715780635859eec11461083f578063651ea5821461051a57806388b623c8146104ee5780638a226e321461046b578063b4c0bd9d146103c3578063cacf7e0f1461038f578063e1363b5214610359578063e577b41c14610333578063eb12cdc314610171578063fd8446e91461014e5763fe6fd797146100e657600080fd5b3461014b57602036600319011261014b575061014260209261013c610109610e5e565b6001600160a01b03807f000000000000000000000000000000000000000000000000000000000000000016911614610cff565b35610f0d565b90519015158152f35b80fd5b50903461016d578160031936011261016d576020906065549051908152f35b5080fd5b503461014b576020908160031936011261014b578060c0845161019381610da7565b82815282858201528286820152826060820152826080820152606060a082015201526101bf8435610d6c565b509280516101cc81610da7565b84548152600190818601549585820196875260028101548483019081526003820154606084019081528983015491608085019283526005840193875194858b82549182815201918b528b8b20908c8a8d915b83831061031f575050505050859003601f01601f1916850167ffffffffffffffff81118682101761030c57885260a086019485526006015460c08601979060ff1660028110156102f957889a97969a5280519a878c526101008c019a51888d015251908b01525160608a01525160808901525160a0880152519460e060c08801528551809152826101208801960192855b8281106102e6575050505050519060028210156102d3575082935060e08301520390f35b634e487b7160e01b815260218552602490fd5b84518852968101969381019383016102af565b634e487b7160e01b8a5260218d5260248afd5b634e487b7160e01b8a5260418d5260248afd5b845486529094019392830192018a8e61021e565b503461014b57602036600319011261014b5750610352602092356110a6565b9051908152f35b50913461038b57602036600319011261038b576103819061037b610109610e5e565b35610d6c565b5060024291015551f35b8280fd5b50913461038b57602036600319011261038b576103b360069161037b610109610e5e565b5001805460ff1916600117905551f35b5082903461014b57602036600319011261014b57813580825260676020528382205492600184106104185760208561040a8682878781526067865220906000190190610cd1565b91905490519160031b1c8152f35b608490602086519162461bcd60e51b8352820152602760248201527f5468657265206973206e6f20746178206f626a65637420666f722074686973206044820152666c6963656e636560c81b6064820152fd5b503461014b57602036600319011261014b57506103526104d0670de0b6b3a76400006104e8856104e06104db67d02ab486cedc00006104d56104af60209b35610d6c565b509485015497856104ca600260018c99015492015442610d4b565b90610e0f565b610dd9565b046110a6565b610df2565b607f1c610e0f565b04610d4b565b50913461038b576105149061050236610cb6565b929061050f610109610e5e565b610d6c565b50015551f35b50903461016d5761052a36610cb6565b610535610109610e5e565b80156107f157818452602094606786528385205461071f575b83519186830183811067ffffffffffffffff82111761070c578552858352845161057781610da7565b84815287810164046e07d0f681528682019442865260608301938985526080840190815260a0840191825260c08401948a8652606554976801000000000000000094858a10156106f9576105d260019a8b8101606555610d6c565b9790976106e7575187555189870155516002860155516003850155518584015560058301905180519283116106d4578a9082548484558085106106aa575b5001908952898920868b8b935b85851061069457505050505050600601905160028110156106815760ff8019835416911617905560655491821061066e57509082610668926000190194859281526067875220610e22565b51908152f35b634e487b7160e01b855260119052602484fd5b634e487b7160e01b875260218352602487fd5b90818392518555019201920191908b889161061d565b8885848e8781522092830192015b8281106106c6575050610610565b8d81558e94508a91016106b8565b634e487b7160e01b8a526041865260248afd5b634e487b7160e01b8e528d8a5260248efd5b634e487b7160e01b8d526041895260248dfd5b634e487b7160e01b875260418352602487fd5b8385208054600181106107de5761074e61074260ff936006936000190190610cd1565b90549060031b1c610d6c565b5001541660028110156107cb5760011461054e57835162461bcd60e51b8152908101869052602e60248201527f43616e206f6e6c792063726561746520746178206f626a65637420696620707260448201527f6576696f7573207265766f6b65640000000000000000000000000000000000006064820152608490fd5b634e487b7160e01b865260218252602486fd5b634e487b7160e01b875260118352602487fd5b825162461bcd60e51b8152602081870152602260248201527f56616c7565206e6565647320746f206265206c6172676572207468616e207a65604482015261726f60f01b6064820152608490fd5b503461014b57602036600319011261014b575061086861086160209335610ed2565b5054610d6c565b50549051908152f35b50913461038b57602036600319011261038b57356001600160a01b03918282168092036108c5576020935051917f000000000000000000000000000000000000000000000000000000000000000016148152f35b8380fd5b503461014b57602036600319011261014b57506001600160a01b0360016108f260209435610ed2565b500154169051908152f35b503461014b57606036600319011261014b575061093d6104db67d02ab486cedc00006104d56104d0602096610936602435604435610d4b565b9035610e0f565b607f1c9051908152f35b503461014b57602036600319011261014b575061035260209235610eaa565b50903461016d5761097636610cb6565b92908152606760205281812090815484101561014b575060209261040a91610cd1565b503461014b57608036600319011261014b5750670de0b6b3a76400006109e96020936104e06104db67d02ab486cedc00006104d56104d06109de604435606435610d4b565b953595602435610e0f565b049051908152f35b50823461016d57606036600319011261016d578035916024906001600160a01b038235604435828116908190036108c557610a58610a2d610e5e565b84167f0000000000000000000000000000000000000000000000000000000000000000851614610cff565b610a6187610eaa565b8210610c4e5760ff6006610a7489610d6c565b500154166002811015610c3c57610bd457620d2f00194211610bc15787519160a0830183811067ffffffffffffffff821117610baf578952878352602083019182528883019081526060830191620d2f0042018352608084019486865260665468010000000000000000811015610b9d57806001610af59201606655610ed2565b959095610b8c5790899594939291518555600185019151166001600160a01b03198254161790555160028301555160038201550190516003811015610b7a5760ff801983541691161790556066549260018410610b6a576020600019850187610668826005610b638b610d6c565b5001610e22565b634e487b7160e01b825260119052fd5b5050634e487b7160e01b815260218352fd5b634e487b7160e01b8852878a528888fd5b634e487b7160e01b885260418a528888fd5b634e487b7160e01b8652604188528686fd5b5050634e487b7160e01b82525060118352fd5b875162461bcd60e51b81526020818801526037818701527f43616e206f6e6c79207375626d69742061206275794f757420746f20616e206160448201527f63746976652061637469766520746178206f626a6563740000000000000000006064820152608490fd5b634e487b7160e01b8552602187528585fd5b875162461bcd60e51b81526020818801526030818701527f56616c75652073656e74206973206c657373207468616e20746865206d696e6960448201527f6d756d206275794f7574207072696365000000000000000000000000000000006064820152608490fd5b6040906003190112610ccc576004359060243590565b600080fd5b8054821015610ce95760005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b15610d0657565b60405162461bcd60e51b815260206004820152601e60248201527f43616e206f6e6c792062652063616c6c656420627920726567697374727900006044820152606490fd5b818110610d56570390565b634e487b7160e01b600052601160045260246000fd5b606554811015610ce9576007906065600052027f8ff97419363ffd7000167f130ef7168fbea05faf9251824ca5043f113cc6a7c70190600090565b60e0810190811067ffffffffffffffff821117610dc357604052565b634e487b7160e01b600052604160045260246000fd5b80600019046001607f1b1181151516610d5657607f1b90565b670de0b6b3a7640000908060001904821181151516610d56570290565b8060001904821181151516610d56570290565b805468010000000000000000811015610dc357610e4491600182018155610cd1565b819291549060031b600019811b9283911b16911916179055565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031603610e9a5736601319013560601c90565b3390565b81198111610d56570190565b610eb5600491610d6c565b500154806000190460691181151516610d56576069606491020490565b606654811015610ce9576005906066600052027f46501879b8ca8525e8c2fd519e2fbfcfa2ebea26501294aa02cbfcfb12e943540190600090565b610f1690610ed2565b5090600491828101805460ff8116600381101561109157611037576003830154421115610fcd57600283015491835491610f4f83610eaa565b8410610fbb5750805460ff191660011790558490610f6c90610d6c565b5001556003610f7b8254610d6c565b50018054936001198511610fa657506001610f9a939401905554610d6c565b50600242910155600190565b601190634e487b7160e01b6000525260246000fd5b60ff1916600217905550600093505050565b60405162461bcd60e51b8152602081870152603a60248201527f63616e206f6e6c792066696e616c697a65206275794f7574206966206974206960448201527f732070617374207468652065787069726174696f6e2074696d650000000000006064820152608490fd5b60405162461bcd60e51b8152602081870152602d60248201527f43616e206f6e6c792066696e616c697a65206275794f7574206966206275794f60448201526c75742069732070656e64696e6760981b6064820152608490fd5b602186634e487b7160e01b6000525260246000fd5b6000906f0fffffffffffffffffffffffffffffff8116906110c78280610e0f565b60001992906710e1b3be415a000090607f90811c801515818704841116611631576110f28482610e0f565b821c926705a0913f6b1e00008488048111851515166116595761112492869261111e9287029102610e9e565b93610e0f565b811c91670168244fdac780008387048111841515166116455761111e61114e928692860290610e9e565b811c91664807432bc180008387048111841515166116455761111e611177928692860290610e9e565b811c91660c0135dca040008387048111841515166116455761111e6111a0928692860290610e9e565b811c916601b707b1cdc0008387048111841515166116455761111e6111c9928692860290610e9e565b811c916536e0f639b8008387048111841515166116455761111e6111f1928692860290610e9e565b811c91650618fee9f8008387048111841515166116455761111e611219928692860290610e9e565b811c91649c197dcc008387048111841515166116455761111e611240928692860290610e9e565b811c91640e30dce4008387048111841515166116455761111e611267928692860290610e9e565b811c9164012ebd13008387048111841515166116455761111e61128e928692860290610e9e565b811c916317499f008387048111841515166116455761111e6112b4928692860290610e9e565b811c916301a9d4808387048111841515166116455761111e6112da928692860290610e9e565b811c91621c63808387048111841515166116455761111e6112ff928692860290610e9e565b811c916201c6388387048111841515166116455761111e611324928692860290610e9e565b811c91611ab88387048111841515166116455761111e611348928692860290610e9e565b811c9161017c8387048111841515166116455761111e61136c928692860290610e9e565b811c9182860460141183151516611631578361111e61138f926014860290610e9e565b901c908185046001118215151661161d576113b76113bd93926721c3677c82b4000092610e9e565b04610e9e565b926f8000000000000000000000000000000019841161160957506001607f1b809301926f1000000000000000000000000000000082166115ce575b6f200000000000000000000000000000008216611593575b6f400000000000000000000000000000008216611559575b8116611520575b70010000000000000000000000000000000081166114e7575b70020000000000000000000000000000000081166114ae575b7004000000000000000000000000000000001661147c575090565b816e2bf84208204f5977f9a8cf01fdc3079104811182151516610d56576d03c6ab775dd0b95b4cbee7e65d1191020490565b916f0960aadc109e7a3bf4578099615711d790808304821181151516610d56576e2bf84208204f5977f9a8cf01fdce3d91020491611461565b916f454aaa8efe072e7f6ddbab84b40a55c5818304811182151516610d56576f0960aadc109e7a3bf4578099615711ea91020491611448565b916fbc5ab1b16779be3575bd8f0520a9f21e818304811182151516610d56576f454aaa8efe072e7f6ddbab84b40a55c99102049161142f565b927001368b2fc6f9609fe7aceb46aa619baed5818404811182151516610d56576fbc5ab1b16779be3575bd8f0520a9f21f91020492611428565b9270018ebef9eac820ae8682b9793ac6d1e778818404811182151516610d56577001368b2fc6f9609fe7aceb46aa619baed491020492611410565b927001c3d6a24ed82218787d624d3e5eba95f9818404811182151516610d565770018ebef9eac820ae8682b9793ac6d1e776910204926113f8565b634e487b7160e01b81526011600452602490fd5b634e487b7160e01b86526011600452602486fd5b634e487b7160e01b87526011600452602487fd5b634e487b7160e01b88526011600452602488fd5b634e487b7160e01b89526011600452602489fdfea264697066735822122025b136f8b27cf94a5f95235bf28d802560ac45f55af4cf35e5c3fff2c6a2019664736f6c634300080f0033";

type HarbergerTaxManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HarbergerTaxManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HarbergerTaxManager__factory extends ContractFactory {
  constructor(...args: HarbergerTaxManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    registry: PromiseOrValue<string>,
    trustedForwarder: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<HarbergerTaxManager> {
    return super.deploy(
      registry,
      trustedForwarder,
      overrides || {}
    ) as Promise<HarbergerTaxManager>;
  }
  override getDeployTransaction(
    registry: PromiseOrValue<string>,
    trustedForwarder: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      registry,
      trustedForwarder,
      overrides || {}
    );
  }
  override attach(address: string): HarbergerTaxManager {
    return super.attach(address) as HarbergerTaxManager;
  }
  override connect(signer: Signer): HarbergerTaxManager__factory {
    return super.connect(signer) as HarbergerTaxManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HarbergerTaxManagerInterface {
    return new utils.Interface(_abi) as HarbergerTaxManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HarbergerTaxManager {
    return new Contract(address, _abi, signerOrProvider) as HarbergerTaxManager;
  }
}
