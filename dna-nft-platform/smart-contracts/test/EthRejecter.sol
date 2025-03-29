// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title EthRejecter
 * @dev Contratto che rifiuta i trasferimenti di ETH
 */
contract EthRejecter is IERC721Receiver {
    // Implementazione di onERC721Received per ricevere NFT
    function onERC721Received(address, address, uint256, bytes memory) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    // Nessuna funzione receive() o fallback(), quindi rifiuta tutti gli ETH
}