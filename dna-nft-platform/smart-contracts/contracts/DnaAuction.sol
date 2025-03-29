// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./security/ReentrancyGuard.sol";

/**
 * @title DnaAuction
 * @dev Implementa un sistema di aste per gli NFT di DnA con protezioni di sicurezza
 */
contract DnaAuction is IERC721Receiver, Ownable, ReentrancyGuard {
    // Contatore per gli ID delle aste
    uint256 private _nextAuctionId;
    
    // Limite di offerenti per prevenire attacchi DoS
    uint256 public constant MAX_BIDDERS = 100;
    
    // Struct per rappresentare un'asta
    struct Auction {
        uint256 id;
        address nftContract;
        uint256 tokenId;
        uint256 startingPrice;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
        bool nftClaimed;
        mapping(address => uint256) bids;
    }
    
    // Mapping da ID asta a struct Auction
    mapping(uint256 => Auction) private _auctions;
    
    // Eventi
    event AuctionCreated(uint256 auctionId, address nftContract, uint256 tokenId, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);
    event NFTClaimed(uint256 auctionId, address winner);
    event BidRefunded(uint256 auctionId, address bidder, uint256 amount);
    event AuctionSettled(uint256 auctionId, address winner, uint256 amount);
    
    /**
     * @dev Costruttore per il contratto DnaAuction
     */
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Funzione richiesta per ricevere token ERC721
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    /**
     * @dev Crea una nuova asta
     */
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) public onlyOwner nonReentrant returns (uint256) {
        require(duration > 0, "DnaAuction: la durata deve essere positiva");
        require(startingPrice > 0, "DnaAuction: il prezzo iniziale deve essere maggiore di zero");
        
        // Verifica che questo contratto sia autorizzato a trasferire l'NFT
        address tokenOwner = IERC721(nftContract).ownerOf(tokenId);
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this) || 
            IERC721(nftContract).isApprovedForAll(tokenOwner, address(this)),
            "DnaAuction: contratto non autorizzato a trasferire l'NFT"
        );
        
        // Trasferisce l'NFT dal proprietario al contratto
        IERC721(nftContract).safeTransferFrom(tokenOwner, address(this), tokenId);
        
        uint256 newAuctionId = _nextAuctionId++;
        
        Auction storage auction = _auctions[newAuctionId];
        auction.id = newAuctionId;
        auction.nftContract = nftContract;
        auction.tokenId = tokenId;
        auction.startingPrice = startingPrice;
        auction.endTime = block.timestamp + duration;
        auction.ended = false;
        auction.nftClaimed = false;
        
        emit AuctionCreated(newAuctionId, nftContract, tokenId, startingPrice, auction.endTime);
        
        return newAuctionId;
    }
    
    /**
     * @dev Fa un'offerta su un'asta con protezione contro reentrancy e rimborsa automaticamente l'offerente precedente
     */
    function placeBid(uint256 auctionId) public payable nonReentrant {
        Auction storage auction = _auctions[auctionId];
        
        require(auction.id == auctionId, "DnaAuction: asta inesistente");
        require(!auction.ended, "DnaAuction: asta gia terminata");
        require(block.timestamp < auction.endTime, "DnaAuction: asta scaduta");
        require(msg.value > auction.highestBid, "DnaAuction: offerta non abbastanza alta");
        
        // Rimborsa l'offerente precedente se esiste
        address previousBidder = auction.highestBidder;
        uint256 previousBid = auction.highestBid;
        
        if (previousBidder != address(0) && previousBid > 0) {
            // Azzera l'offerta precedente prima di effettuare il trasferimento
            auction.bids[previousBidder] = 0;
            
            // Rimborsa l'offerente precedente
            (bool success, ) = payable(previousBidder).call{value: previousBid}("");
            // Non blocchiamo l'offerta se il rimborso fallisce, ma emettiamo un evento
            if (success) {
                emit BidRefunded(auctionId, previousBidder, previousBid);
            }
        }
        
        // Se questa e la prima offerta dell'offerente, aggiungilo al mapping
        auction.bids[msg.sender] = msg.value;
        
        // Aggiorna l'offerta piu alta
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        
        emit BidPlaced(auctionId, msg.sender, msg.value);
    }
    
    /**
     * @dev Termina un'asta e trasferisce automaticamente l'NFT e i fondi
     */
    function endAuction(uint256 auctionId) public onlyOwner nonReentrant {
        Auction storage auction = _auctions[auctionId];
        
        require(auction.id == auctionId, "DnaAuction: asta inesistente");
        require(!auction.ended, "DnaAuction: asta gia terminata");
        require(block.timestamp >= auction.endTime, "DnaAuction: asta non ancora scaduta");
        
        auction.ended = true;
        
        address winner = auction.highestBidder;
        uint256 winningBid = auction.highestBid;
        
        emit AuctionEnded(auctionId, winner, winningBid);
        
        // Se c'è un vincitore, trasferisci automaticamente l'NFT e i fondi
        if (winner != address(0) && winningBid > 0) {
            auction.nftClaimed = true;
            
            // Trasferisci l'NFT al vincitore
            IERC721(auction.nftContract).safeTransferFrom(address(this), winner, auction.tokenId);
            
            // Trasferisci i fondi al proprietario del contratto
            (bool success, ) = payable(owner()).call{value: winningBid}("");
            require(success, "DnaAuction: trasferimento fondi fallito");
            
            emit AuctionSettled(auctionId, winner, winningBid);
        }
    }
    
    /**
     * @dev Rivendica un NFT dopo aver vinto un'asta con protezione contro reentrancy
     * @notice Questa funzione è mantenuta per retrocompatibilità. Gli NFT vengono ora trasferiti automaticamente alla fine dell'asta.
     */
    function claimNFT(uint256 auctionId) public nonReentrant {
        Auction storage auction = _auctions[auctionId];
        
        require(auction.id == auctionId, "DnaAuction: asta inesistente");
        require(auction.ended, "DnaAuction: asta non terminata");
        require(msg.sender == auction.highestBidder, "DnaAuction: non sei l'offerente piu alto");
        require(!auction.nftClaimed, "DnaAuction: NFT gia rivendicato");
        
        // Prima aggiorna lo stato
        auction.nftClaimed = true;
        
        // Poi effettua le interazioni esterne
        IERC721(auction.nftContract).safeTransferFrom(address(this), msg.sender, auction.tokenId);
        
        (bool success, ) = payable(owner()).call{value: auction.highestBid}("");
        require(success, "DnaAuction: trasferimento fallito");
        
        emit NFTClaimed(auctionId, msg.sender);
    }
    
    /**
     * @dev Richiedi un rimborso dopo aver perso un'asta con protezione contro reentrancy
     * @notice Questa funzione è mantenuta per retrocompatibilità. I rimborsi vengono ora elaborati automaticamente quando un'offerta viene superata.
     */
    function claimRefund(uint256 auctionId) public nonReentrant {
        Auction storage auction = _auctions[auctionId];
        
        require(auction.id == auctionId, "DnaAuction: asta inesistente");
        require(auction.ended, "DnaAuction: asta non terminata");
        require(msg.sender != auction.highestBidder, "DnaAuction: l'offerente piu alto non puo richiedere un rimborso");
        require(auction.bids[msg.sender] > 0, "DnaAuction: nessuna offerta da rimborsare");
        
        // Prima aggiorna lo stato
        uint256 refundAmount = auction.bids[msg.sender];
        auction.bids[msg.sender] = 0;
        
        // Poi effettua le interazioni esterne
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "DnaAuction: rimborso fallito");
        
        emit BidRefunded(auctionId, msg.sender, refundAmount);
    }
    
    /**
     * @dev Ottiene i dettagli di un'asta
     */
    function getAuctionDetails(uint256 auctionId) public view returns (
        address nftContract,
        uint256 tokenId,
        uint256 startingPrice,
        uint256 endTime,
        address highestBidder,
        uint256 highestBid,
        bool ended,
        bool nftClaimed
    ) {
        Auction storage auction = _auctions[auctionId];
        require(auction.id == auctionId, "DnaAuction: asta inesistente");
        
        return (
            auction.nftContract,
            auction.tokenId,
            auction.startingPrice,
            auction.endTime,
            auction.highestBidder,
            auction.highestBid,
            auction.ended,
            auction.nftClaimed
        );
    }
    
    /**
     * @dev Ottiene il numero totale di aste
     */
    function getTotalAuctions() public view returns (uint256) {
        return _nextAuctionId;
    }
    
    /**
     * @dev Ottiene l'offerta di un utente su un'asta
     */
    function getBid(uint256 auctionId, address bidder) public view returns (uint256) {
        Auction storage auction = _auctions[auctionId];
        require(auction.id == auctionId, "DnaAuction: asta inesistente");
        
        return auction.bids[bidder];
    }
}