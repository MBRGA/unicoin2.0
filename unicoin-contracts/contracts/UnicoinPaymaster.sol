// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/forwarder/IForwarder.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract UnicoinPaymaster is Initializable, BasePaymaster {
    address public registry;

    event TargetSet(address target);

    function setTarget(address target) external onlyOwner {
        registry = target;
        emit TargetSet(target);
    }

    event PreRelayed(uint);
    event PostRelayed(uint);

    function initialize() public initializer {}

    function preRelayedCall(GsnTypes.RelayRequest calldata relayRequest, 
        bytes calldata signature, 
        bytes calldata approvalData, 
        uint256 maxPossibleGas)
    external override virtual returns(bytes memory context, bool rejectOnRecipientRevert) {
        _verifyForwarder(relayRequest);
        (signature, approvalData, maxPossibleGas);

        require(relayRequest.request.to == registry);
        emit PreRelayed(block.timestamp);
        return (abi.encode(block.timestamp), false);
    }

    function postRelayedCall(
        bytes calldata context, 
        bool success, 
        uint256 gasUseWithoutPost, 
        GsnTypes.RelayData calldata relayData)
        external relayHubOnly override {
            (success, success, gasUseWithoutPost, relayData);
            emit PostRelayed(abi.decode(context, (uint)));
        }

    function versionPaymaster() external virtual view 
    override returns (string memory) {
        return "2.2.6+opengsn.unicoinpaymaster";
    }


}