// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DeploySonthamNft} from "script/DeploySonthamNft.s.sol";
import {SonthamNft} from "../src/SonthamNft.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract SonthamNftTest is Test {
    SonthamNft public sonthamNft;
    address user = makeAddr("ruhneb");
    uint256 constant INIT_BAL = 100 ether;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event SonthamNft__NftMinted(address indexed owner, uint256 indexed tokenId);

    function setUp() external {
        DeploySonthamNft deployer = new DeploySonthamNft();
        sonthamNft = deployer.run();
        vm.deal(user, INIT_BAL); // Give user some ether for testing
    }

    function testSonthamNftAddress() external view {
        console.log(address(sonthamNft));
        assertTrue(address(sonthamNft) != address(0), "SonthamNFT address should not be zero");
    }

    //bakki testing naale, tbh there is not much to test but whateves. The AI grading waala thing is not practical to add cause it can be manipulated by the user. And I can't change it to backend also cause then the whole wagmi stuff gets weird but other than that, this is a cool idea!

    function testTokenNameAndSymbol() external view {
        string memory name = sonthamNft.name();
        string memory symbol = sonthamNft.symbol();

        assertEq(name, "SonthamNFT", "Token name should be SonthamNFT");
        assertEq(symbol, "SNFT", "Token symbol should be SNFT");
    }

    function testMintNftSetsTokenData() external {
        string memory tokenData =
            '{"name":"Heart","description":"Broken and pierced a long time ago","image":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTI1IiBoZWlnaHQ9IjUzNSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0id2hpdGUiIC8+PHBhdGggZD0iTSA3MDkgMjExIEwgNzA5IDIxMSBMIDcwOSAyMTAgTCA3MDkgMjA3IEwgNzA5IDIwMyBMIDcwOSAxOTYgTCA3MDkgMTg5IEwgNzA4IDE4NCBMIDcwNiAxNzggTCA3MDMgMTcyIEwgNjk4IDE2NyBMIDY5MyAxNjEgTCA2ODYgMTU3IEwgNjgxIDE1MyBMIDY3NyAxNTEgTCA2NzIgMTQ5IEwgNjY2IDE0OCBMIDY1OSAxNDcgTCA2NTAgMTQ3IEwgNjQyIDE0NyBMIDYzNSAxNDcgTCA2MzAgMTQ3IEwgNjI2IDE0OCBMIDYyNCAxNDggTCA2MjMgMTQ5IEwgNjIzIDE1MCBMIDYyMiAxNTAgTCA2MjIgMTUxIEwgNjIyIDE1MiBMIDYyMiAxNTMgTCA2MjIgMTU0IEwgNjIyIDE1NiBMIDYyMiAxNTggTCA2MjIgMTYxIEwgNjIzIDE2NSBMIDYyNSAxNzAgTCA2MjkgMTc2IEwgNjMzIDE4MyBMIDYzNyAxOTAgTCA2NDEgMTk3IEwgNjQ3IDIwNSBMIDY1MiAyMTIgTCA2NTggMjIwIEwgNjY1IDIyOCBMIDY3MiAyMzcgTCA2NzggMjQ2IEwgNjg0IDI1NSBMIDY5MCAyNjQgTCA2OTUgMjcyIEwgNjk5IDI4MSBMIDcwNCAyOTAgTCA3MDcgMjk4IEwgNzEwIDMwNiBMIDcxMyAzMTIgTCA3MTQgMzE5IEwgNzE2IDMyNyBMIDcxNyAzMzMgTCA3MTcgMzM4IEwgNzE4IDM0MiBMIDcxOCAzNDUgTCA3MTggMzQ3IEwgNzE4IDM0OSBMIDcxOCAzNTAgTCA3MTggMzUxIEwgNzE5IDM1MiBMIDcxOSAzNTQgTCA3MTkgMzU2IEwgNzIwIDM1OCBMIDcyMSAzNjEgTCA3MjEgMzYxIEwgNzIxIDM2MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzQ2ZjZmIiBzdHJva2Utd2lkdGg9IjEwIiAvPgo8cGF0aCBkPSJNIDcwOSAyMTUgTCA3MDkgMjE0IEwgNzA5IDIxMiBMIDcwOSAyMDkgTCA3MDkgMjAzIEwgNzA5IDE5NiBMIDcwOSAxODggTCA3MDkgMTgxIEwgNzA5IDE3NSBMIDcwOSAxNjggTCA3MTAgMTYyIEwgNzExIDE1OCBMIDcxMiAxNTYgTCA3MTMgMTUzIEwgNzE0IDE1MSBMIDcxNiAxNDggTCA3MTggMTQ3IEwgNzIwIDE0NCBMIDcyNCAxNDEgTCA3MjkgMTM4IEwgNzM1IDEzNCBMIDc0MSAxMzEgTCA3NDkgMTI3IEwgNzU3IDEyNSBMIDc2NSAxMjQgTCA3NzIgMTI0IEwgNzc4IDEyNSBMIDc4NCAxMjYgTCA3ODkgMTI5IEwgNzk0IDEzNCBMIDc5OSAxMzkgTCA4MDMgMTQzIEwgODA3IDE0OCBMIDgxMCAxNTQgTCA4MTIgMTU5IEwgODEzIDE2MyBMIDgxNCAxNjggTCA4MTUgMTc1IEwgODE1IDE4MyBMIDgxNSAxOTIgTCA4MTUgMjAwIEwgODE0IDIwNyBMIDgwNyAyMjEgTCA4MDUgMjI0IEwgODAyIDIyNyBMIDc5OCAyMzEgTCA3OTUgMjM3IEwgNzkwIDI0MyBMIDc4NiAyNDkgTCA3ODMgMjU1IEwgNzc5IDI2MCBMIDc3NiAyNjYgTCA3NzMgMjcyIEwgNzY5IDI3NyBMIDc2NiAyODMgTCA3NjIgMjg4IEwgNzU5IDI5NCBMIDc1NSAzMDEgTCA3NTIgMzA3IEwgNzUwIDMxMiBMIDc0NyAzMjEgTCA3NDUgMzI1IEwgNzQ0IDMyOCBMIDc0MyAzMzIgTCA3NDEgMzM2IEwgNzQwIDM0MSBMIDczOCAzNDcgTCA3MzYgMzUyIEwgNzM1IDM1NiBMIDczNCAzNTkgTCA3MzMgMzYyIEwgNzMzIDM2NCBMIDczMyAzNjUgTCA3MzMgMzY3IEwgNzMzIDM2OCBMIDczMyAzNjkgTCA3MzMgMzY5IEwgNzMzIDM3MCBMIDczMyAzNzEgTCA3MzMgMzcxIEwgNzMzIDM3MSBMIDczMyAzNzEgTCA3MzMgMzcxIEwgNzMyIDM3MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzQ2ZjZmIiBzdHJva2Utd2lkdGg9IjEwIiAvPgo8cGF0aCBkPSJNIDQ1MyAzNjYgTCA0NTMgMzY2IEwgNDU2IDM2NCBMIDQ2MyAzNjEgTCA0NzYgMzU0IEwgNDk0IDM0NSBMIDUxMSAzMzYgTCA1MjggMzI3IEwgNTQ1IDMxOCBMIDU1OCAzMTEgTCA1NzEgMzA0IEwgNTgzIDI5NiBMIDU5NCAyOTAgTCA2MDMgMjg1IEwgNjEwIDI4MiBMIDYxNiAyNzkgTCA2MjQgMjc1IEwgNjMyIDI3MiBMIDYzOSAyNzAgTCA2NDUgMjY4IEwgNjUwIDI2NyBMIDY1NCAyNjcgTCA2NTggMjY1IEwgNjYzIDI2NCBMIDY2NyAyNjIgTCA2NzEgMjYwIEwgNjc1IDI1OCBMIDY3OSAyNTYgTCA2ODMgMjUzIEwgNjg3IDI1MSBMIDY5MSAyNDkgTCA2OTMgMjQ4IEwgNjk1IDI0NyBMIDY5NiAyNDYgTCA2OTggMjQ2IEwgNjk5IDI0NSBMIDcwMSAyNDUgTCA3MDIgMjQ0IEwgNzAzIDI0NCBMIDcwNiAyNDMgTCA3MDggMjQxIEwgNzEwIDI0MCBMIDcxMiAyMzkgTCA3MTMgMjM4IEwgNzE0IDIzOCBMIDcxNSAyMzcgTCA3MTUgMjM3IiBmaWxsPSJub25lIiBzdHJva2U9IiNjNDZmNmYiIHN0cm9rZS13aWR0aD0iMTAiIC8+CjxwYXRoIGQ9Ik0gODIyIDE4MSBMIDgyMiAxODEgTCA4MjQgMTgwIEwgODMwIDE3NyBMIDkyMyAxMTkgTCA5NDUgMTA5IEwgOTYwIDEwMiBMIDk2OSA5OSBMIDk3NCA5NyBMIDk3NiA5NyBMIDk3NiA5NyBMIDk3NiA5NyBMIDk3NSA5NyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzQ2ZjZmIiBzdHJva2Utd2lkdGg9IjEwIiAvPgo8cGF0aCBkPSJNIDk0OSA4MiBMIDk0OSA4MiBMIDk0OSA4MSBMIDk1MiA4MSBMIDk1OCA4MSBMIDk2NSA4MSBMIDk3MSA4MSBMIDk3NSA4MSBMIDk3OSA4MSBMIDk4MSA4MSBMIDk4MiA4MSBMIDk4MiA4MSBMIDk4MiA4MSBMIDk4MyA4MSBMIDk4MyA4MSBMIDk4NSA4MiBMIDk4NiA4MyBMIDk4NiA4MyBMIDk4NyA4MyBMIDk4NyA4NCBMIDk4NyA4NCBMIDk4NyA4NCBMIDk4NyA4NCBMIDk4NyA4NSBMIDk4NyA4NSBMIDk4OCA4NSBMIDk4OCA4NSBMIDk4OCA4NiBMIDk4OSA4NiBMIDk4OSA4NiBMIDk4OSA4NiBMIDk5MCA4NiBMIDk5MCA4NiBMIDk5MCA4NiBMIDk5MSA4NiBMIDk5MSA4NiBMIDk5MSA4NiBMIDk5MiA4NiBMIDk5MiA4NiBMIDk5MiA4NiBMIDk5MiA4NiBMIDk5MiA4NyBMIDk5MSA4OSBMIDk4OCA5MyBMIDk4MyAxMDAgTCA5NzYgMTEzIEwgOTY4IDEzMSBMIDk2MSAxNDkgTCA5NTYgMTYzIEwgOTU0IDE3MyBMIDk1MiAxODAgTCA5NTEgMTgzIEwgOTUxIDE4NCBMIDk1MCAxODQgTCA5NTAgMTg0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjNDZmNmYiIHN0cm9rZS13aWR0aD0iMTAiIC8+PC9zdmc+","attributes":[{"trait_type":"Sketch Score","value":60,"max_value":100},{"trait_type":"Creativity","value":70,"max_value":100},{"trait_type":"Complexity","value":30,"max_value":100}]}';
        vm.prank(user);
        sonthamNft.mintNFT(tokenData);

        string memory storedData = sonthamNft.tokenURI(0);
        string memory expectedData =
            string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(abi.encodePacked(tokenData)))));

        console.log("expected data", expectedData);
        assertEq(storedData, expectedData, "Token data should match the minted data");
    }

    function testMintNftIncrementsTokenCounter() external {
        uint256 initialCounter = sonthamNft.getTokenCounter();
        vm.prank(user);
        sonthamNft.mintNFT("Another test token data");
        uint256 newCounter = sonthamNft.getTokenCounter();

        assertEq(newCounter, initialCounter + 1, "Token counter should increment by 1 after minting");
    }

    function testMintEmitsToken() external {
        vm.expectEmit(true, true, false, false);
        emit SonthamNft__NftMinted(user, 0); // Assuming the first token ID is 0
        vm.prank(user);
        sonthamNft.mintNFT("Test token data for event emission");
    }
}
