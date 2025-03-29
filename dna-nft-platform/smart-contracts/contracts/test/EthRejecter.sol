// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract EthRejecter is IERC721Receiver {
    // Permette di ricevere NFT ma rifiuta ETH
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    // Fallisci esplicitamente quando ricevi ETH
    receive() external payable {
        revert("EthRejecter: rifiuta esplicitamente l'ETH");
    }
    
    fallback() external payable {
        revert("EthRejecter: rifiuta sempre l'ETH");
    }
} 