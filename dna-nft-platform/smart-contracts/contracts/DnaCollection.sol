// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DnaCollection
 * @dev Implementa una collezione NFT per i contenuti scientifici di DnA
 */
contract DnaCollection is ERC721URIStorage, Ownable {
    // Sostituiamo Counters con un semplice contatore
    uint256 private _nextTokenId;
    
    // Mapping da token ID al suo prezzo
    mapping(uint256 => uint256) private _tokenPrices;
    
    // Metadati della collezione
    string public collectionDescription;
    
    // Eventi
    event NFTCreated(uint256 tokenId, string tokenURI, uint256 price);
    event NFTPriceChanged(uint256 tokenId, uint256 newPrice);
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
     * @dev Crea un nuovo NFT
     */
    function createNFT(
        address recipient,
        string memory tokenURI,
        uint256 price
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _setTokenPrice(tokenId, price);
        
        emit NFTCreated(tokenId, tokenURI, price);
        
        return tokenId;
    }
    
    /**
     * @dev Imposta il prezzo di un NFT
     */
    function setTokenPrice(uint256 tokenId, uint256 price) public onlyOwner {
        require(tokenExists(tokenId), "DnaCollection: prezzo impostato per token inesistente");
        _setTokenPrice(tokenId, price);
        emit NFTPriceChanged(tokenId, price);
    }
    
    /**
     * @dev Funzione interna per impostare il prezzo del token
     */
    function _setTokenPrice(uint256 tokenId, uint256 price) internal {
        _tokenPrices[tokenId] = price;
    }
    
    /**
     * @dev Ottiene il prezzo di un NFT
     */
    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        require(tokenExists(tokenId), "DnaCollection: richiesta prezzo per token inesistente");
        return _tokenPrices[tokenId];
    }
    
    /**
     * @dev Permette a un utente di acquistare un NFT
     */
    function purchaseNFT(uint256 tokenId) public payable {
        require(tokenExists(tokenId), "DnaCollection: richiesta di acquisto per token inesistente");
        address owner = ownerOf(tokenId);
        require(owner != msg.sender, "DnaCollection: non puoi acquistare il tuo stesso NFT");
        
        uint256 price = _tokenPrices[tokenId];
        require(msg.value >= price, "DnaCollection: fondi insufficienti");
        
        address payable seller = payable(owner);
        
        // Trasferisce la proprieta dell'NFT
        _transfer(owner, msg.sender, tokenId);
        
        // Trasferisce i fondi al venditore
        seller.transfer(msg.value);
        
        emit NFTPurchased(tokenId, msg.sender, msg.value);
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
     * @dev Sovrascrive la funzione transferFrom per aggiornare lo stato interno
     */
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        super.transferFrom(from, to, tokenId);
    }
    
    /**
     * @dev Sovrascrive la funzione safeTransferFrom per aggiornare lo stato interno
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        override(ERC721, IERC721)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}