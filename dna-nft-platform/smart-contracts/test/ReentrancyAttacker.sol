// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title ReentrancyAttacker
 * @dev Contratto per testare attacchi di reentrancy
 */
contract ReentrancyAttacker is IERC721Receiver {
    address public target;
    uint256 public attackCount;
    bool private _ignoreResult; // Per evitare avvisi su chiamate non controllate
    
    constructor(address _target) {
        target = _target;
    }
    
    // Attacco a DnaCollection.purchaseNFT
    function attack(uint256 tokenId) external payable {
        // Tenta di acquistare e poi riattaccare nella callback
        (bool success, ) = target.call{value: msg.value}(
            abi.encodeWithSignature("purchaseNFT(uint256)", tokenId)
        );
        require(success, "Attack failed");
    }
    
    // Attacco a DnaAuction.placeBid
    function attackBid(uint256 auctionId) external payable {
        (bool success, ) = target.call{value: msg.value}(
            abi.encodeWithSignature("placeBid(uint256)", auctionId)
        );
        require(success, "Attack failed");
    }
    
    // Attacco a DnaAuction.claimNFT
    function attackClaim(uint256 auctionId) external {
        (bool success, ) = target.call(
            abi.encodeWithSignature("claimNFT(uint256)", auctionId)
        );
        require(success, "Attack failed");
    }
    
    // Funzione per ricevere ERC721 e tentare un attacco di reentrancy
    function onERC721Received(address, address, uint256 tokenId, bytes memory) public override returns (bytes4) {
        if (attackCount < 3) {
            attackCount++;
            // Tenta di riattaccare quando riceve l'NFT
            // Ignoriamo deliberatamente il risultato perché è solo un test
            try this.performAttack(tokenId) {} catch {}
        }
        return this.onERC721Received.selector;
    }
    
    // Funzione ausiliaria per separare la logica dell'attacco
    function performAttack(uint256 tokenId) external {
        // Questo è solo un test, quindi va bene se fallisce
        (bool success, ) = target.call(
            abi.encodeWithSignature("purchaseNFT(uint256)", tokenId)
        );
        _ignoreResult = success; // Per evitare warning "variable declared but not used"
    }
    
    // Funzione per ricevere ETH
    receive() external payable {
        if (attackCount < 3) {
            attackCount++;
            // Tenta di riattaccare quando riceve ETH
            // Ignoriamo deliberatamente il risultato perché è solo un test
            try this.performRefundAttack() {} catch {}
        }
    }
    
    // Funzione ausiliaria per separare la logica dell'attacco al rimborso
    function performRefundAttack() external {
        // Questo è solo un test, quindi va bene se fallisce
        (bool success, ) = target.call(
            abi.encodeWithSignature("claimRefund(uint256)", 0)
        );
        _ignoreResult = success; // Per evitare warning "variable declared but not used"
    }
}