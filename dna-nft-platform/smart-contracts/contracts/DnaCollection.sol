// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./security/ReentrancyGuard.sol";

/**
 * @title DnaCollection
 * @dev Implementa una collezione NFT per i contenuti scientifici di DnA con protezioni di sicurezza
 */
contract DnaCollection is ERC721URIStorage, Ownable, ReentrancyGuard {
    // Contatore per gli ID dei token
    uint256 private _nextTokenId;
    
    // Mapping da token ID al suo prezzo iniziale
    mapping(uint256 => uint256) private _tokenStartingPrices;
    
    // Metadati della collezione
    string public collectionDescription;
    
    // Eventi
    event NFTCreated(uint256 tokenId, string tokenURI, uint256 startingPrice);
    event NFTStartingPriceChanged(uint256 tokenId, uint256 newStartingPrice);
    event NFTPurchased(uint256 tokenId, address buyer, uint256 price);
    
    /**
     * @dev Costruttore per il contratto DnaCollection
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory description
    ) ERC721(name, symbol) Ownable(msg.sender) {
        collectionDescription = description;
    }
    
    /**
     * @dev Verifica se un token esiste
     * @param tokenId ID del token da verificare
     */
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return tokenId < _nextTokenId && _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Crea un nuovo NFT con un prezzo iniziale
     */
    function createNFT(
        address recipient,
        string memory tokenURI,
        uint256 startingPrice
    ) public onlyOwner returns (uint256) {
        require(startingPrice > 0, "DnaCollection: il prezzo iniziale deve essere maggiore di zero");
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _setTokenStartingPrice(tokenId, startingPrice);
        
        emit NFTCreated(tokenId, tokenURI, startingPrice);
        
        return tokenId;
    }
    
    /**
     * @dev Imposta il prezzo iniziale di un NFT
     */
    function setTokenStartingPrice(uint256 tokenId, uint256 startingPrice) public onlyOwner {
        require(tokenExists(tokenId), "DnaCollection: prezzo impostato per token inesistente");
        require(startingPrice > 0, "DnaCollection: il prezzo iniziale deve essere maggiore di zero");
        _setTokenStartingPrice(tokenId, startingPrice);
        emit NFTStartingPriceChanged(tokenId, startingPrice);
    }
    
    /**
     * @dev Funzione interna per impostare il prezzo iniziale del token
     */
    function _setTokenStartingPrice(uint256 tokenId, uint256 startingPrice) internal {
        _tokenStartingPrices[tokenId] = startingPrice;
    }
    
    /**
     * @dev Ottiene il prezzo iniziale di un NFT
     */
    function getTokenStartingPrice(uint256 tokenId) public view returns (uint256) {
        require(tokenExists(tokenId), "DnaCollection: richiesta prezzo per token inesistente");
        return _tokenStartingPrices[tokenId];
    }
    
    /**
     * @dev Permette a un utente di acquistare un NFT al prezzo iniziale con protezione contro reentrancy
     */
    function purchaseNFT(uint256 tokenId) public payable nonReentrant {
        require(tokenExists(tokenId), "DnaCollection: richiesta di acquisto per token inesistente");
        address owner = ownerOf(tokenId);
        require(owner != msg.sender, "DnaCollection: non puoi acquistare il tuo stesso NFT");
        
        uint256 price = _tokenStartingPrices[tokenId];
        require(msg.value >= price, "DnaCollection: fondi insufficienti");
        
        address payable seller = payable(owner);
        
        // Prima aggiorna lo stato interno
        _transfer(owner, msg.sender, tokenId);
        
        // Poi interagisci con esterni usando il pattern più sicuro
        (bool success, ) = seller.call{value: price}("");
        require(success, "DnaCollection: trasferimento fallito");
        
        // Rimborsa l'eccesso all'acquirente se necessario
        uint256 excess = msg.value - price;
        if (excess > 0) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "DnaCollection: rimborso eccesso fallito");
        }
        
        emit NFTPurchased(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Restituisce il proprietario del contratto
     */
    function getContractOwner() public view returns (address) {
        return owner();
    }
    
    /**
     * @dev Ottiene il numero totale di NFT coniati
     */
    function getTotalNFTs() public view returns (uint256) {
        return _nextTokenId;
    }
    
    /**
     * @dev Sovrascrive la funzione transferFrom
     */
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        super.transferFrom(from, to, tokenId);
    }
    
    /**
     * @dev Sovrascrive la funzione safeTransferFrom
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        override(ERC721, IERC721)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    
    /**
     * @dev Prepara un NFT per l'asta approvando il contratto asta a trasferirlo
     * @param tokenId ID del token da preparare per l'asta
     * @param auctionContract Indirizzo del contratto DnaAuction
     */
    function prepareNFTForAuction(
        uint256 tokenId,
        address auctionContract
    ) public onlyOwner nonReentrant {
        require(tokenExists(tokenId), "DnaCollection: token inesistente");
        require(auctionContract != address(0), "DnaCollection: indirizzo asta invalido");
        
        // Verifica che il msg.sender sia il proprietario del token o il proprietario del contratto
        address tokenOwner = ownerOf(tokenId);
        require(
            tokenOwner == msg.sender || isApprovedForAll(tokenOwner, msg.sender),
            "DnaCollection: non autorizzato a preparare questo NFT"
        );
        
        // Approva il contratto asta a trasferire l'NFT
        approve(auctionContract, tokenId);
    }
}