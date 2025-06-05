// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SonthamNft} from "../src/SonthamNft.sol";

contract DeploySonthamNft is Script {
    SonthamNft public sonthamNft;

    function run() external returns (SonthamNft) {
        vm.startBroadcast();
        sonthamNft = new SonthamNft();
        vm.stopBroadcast();
        return sonthamNft;
    }
}
