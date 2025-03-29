// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../DnaAuction.sol";
import "../DnaCollection.sol";

contract ReentrancyAttacker is IERC721Receiver {
    DnaAuction public auctionContract;
    DnaCollection public collectionContract;
    uint256 public auctionId;
    uint256 public tokenId;
    uint256 public attackCount;
    bool public attacking;
    
    constructor() {}
    
    function setAuctionTarget(address _auctionContract, uint256 _auctionId) external {
        auctionContract = DnaAuction(_auctionContract);
        auctionId = _auctionId;
    }
    
    function setCollectionTarget(address _collectionContract, uint256 _tokenId) external {
        collectionContract = DnaCollection(_collectionContract);
        tokenId = _tokenId;
    }
    
    function attackAuctionBid() external payable {
        attacking = true;
        auctionContract.placeBid{value: msg.value}(auctionId);
        require(false, "Reentrancy attack attempt");
    }
    
    function attackAuctionClaim() external {
        attacking = true;
        auctionContract.claimNFT(auctionId);
    }
    
    function attackCollectionPurchase() external payable {
        attacking = true;
        collectionContract.purchaseNFT{value: msg.value}(tokenId);
        require(false, "Reentrancy attack attempt");
    }
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public override returns (bytes4) {
        if (attacking) {
            attackCount++;
            if (attackCount < 3) {
                if (address(auctionContract) != address(0)) {
                    try auctionContract.claimNFT(auctionId) {} catch {}
                } else if (address(collectionContract) != address(0)) {
                    try collectionContract.purchaseNFT{value: address(this).balance}(tokenId) {} catch {}
                }
            }
        }
        return this.onERC721Received.selector;
    }
    
    // Per ricevere ETH
    receive() external payable {}
} 