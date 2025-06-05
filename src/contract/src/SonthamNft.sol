// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract SonthamNft is ERC721 {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error SonthamNFT__NotOwnerOfNft();

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event SonthamNft__NftMinted(address indexed owner, uint256 indexed tokenId);

    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToTokenData;

    constructor() ERC721("SonthamNFT", "SNFT") {
        s_tokenCounter = 0;
    }

    function mintNFT(string memory tokenData) external {
        uint256 currentTokenId = s_tokenCounter;
        s_tokenIdToTokenData[s_tokenCounter] = tokenData;
        s_tokenCounter++;
        _safeMint(msg.sender, currentTokenId);
        emit SonthamNft__NftMinted(msg.sender, currentTokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return
            string(abi.encodePacked(_baseURI(), Base64.encode(bytes(abi.encodePacked(s_tokenIdToTokenData[tokenId])))));
    }

    /*//////////////////////////////////////////////////////////////
                            GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }
}
