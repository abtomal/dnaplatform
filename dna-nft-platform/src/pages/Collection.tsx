// src/pages/Collection.tsx
import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useTransaction } from 'wagmi';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useNFTContract, NFT } from '../hooks/useNFTContract';
import './MyCollection.css'; // Riutilizziamo lo stesso stile di MyCollection

const Collection: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const { address, isConnected } = useAccount();
  const { totalNFTs, contractAddress, abi, fetchOwner, fetchPrice, fetchTokenURI } = useNFTContract();

  // Hook per scrivere sul contratto (acquisto NFT)
  const {
    writeContract,
    data: txHash,
    status: writeStatus,
    error: writeError
  } = useWriteContract();
  
  // Monitoraggio della transazione
  const { status: txStatus } = useTransaction({
    hash: txHash
  });

  // Funzione per recuperare i metadati dall'URI
  const fetchMetadata = async (tokenURI: string) => {
    if (!tokenURI) return null;
    
    try {
      // Gestisce sia URI IPFS che HTTP
      const uri = tokenURI.startsWith('ipfs://') 
        ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/') 
        : tokenURI;
        
      const response = await fetch(uri);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Errore nel recupero dei metadati:', err);
      return null;
    }
  };

  // Gestione dell'acquisto
  const handlePurchase = (tokenId: number, price: bigint) => {
    if (!isConnected || !address) {
      alert("Connetti il tuo wallet per acquistare questo NFT");
      return;
    }
    
    setPurchasingId(tokenId);
    
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'purchaseNFT',
        args: [tokenId],
        value: price,
        chain: undefined, // Use the connected chain
        account: address as `0x${string}` // Cast the address to the expected type
      });
    } catch (error) {
      console.error("Errore durante l'acquisto dell'NFT:", error);
      setPurchasingId(null);
    }
  };

  // Gestione degli errori di scrittura
  useEffect(() => {
    if (writeError) {
      alert(`Errore durante l'acquisto: ${writeError.message}`);
      setPurchasingId(null);
    }
    
    if (txStatus === 'success') {
      alert("Acquisto completato con successo!");
      setPurchasingId(null);
      fetchNFTsForSale(); // Aggiorna la lista dopo l'acquisto
    }
  }, [writeError, txStatus]);

  // Funzione principale per recuperare tutti gli NFT in vendita
  const fetchNFTsForSale = async () => {
    if (totalNFTs === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedNFTs: NFT[] = [];

      // Recupera informazioni per ogni NFT
      for (let i = 0; i < totalNFTs; i++) {
        try {
          const tokenId = i;
          const owner = await fetchOwner(tokenId);
          
          // Se l'utente è connesso, salta gli NFT che possiede
          if (isConnected && address && owner.toLowerCase() === address.toLowerCase()) {
            continue;
          }
          
          const price = await fetchPrice(tokenId);
          const tokenURI = await fetchTokenURI(tokenId);

          // Recupera i metadati dall'URI
          const metadata = await fetchMetadata(tokenURI);
          
          fetchedNFTs.push({
            id: tokenId,
            name: metadata?.name || `NFT #${tokenId}`,
            description: metadata?.description || '',
            image: metadata?.image || '',
            price,
            owner,
            attributes: metadata?.attributes
          });
        } catch (err) {
          console.error(`Errore nel recupero dell'NFT ${i}:`, err);
        }
      }

      setNfts(fetchedNFTs);
    } catch (err) {
      console.error('Errore nel caricamento degli NFT:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carica gli NFT all'avvio e quando cambia lo stato della connessione o il numero totale di NFT
  useEffect(() => {
    fetchNFTsForSale();
  }, [isConnected, totalNFTs, address]);

  return (
    <div className="my-collection">
      <div className="collection-header">
        <h1>DISCOVER OUR NFTs</h1>
        <p>Discover and purchase unique scientific NFTs</p>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading NFTs...</p>
        </div>
      ) : nfts.length === 0 ? (
        <div className="empty-collection">
          <h2>No NFTs Available</h2>
          <p>There are currently no NFTs available for purchase.</p>
        </div>
      ) : (
        <div className="nft-grid">
          <h2>Available Scientific NFTs</h2>
          <div className="grid">
            {nfts.map(nft => (
              <div key={nft.id} className="nft-card">
                <div className="nft-image-container">
                  {nft.image ? (
                    <img 
                      src={nft.image.startsWith('ipfs://') 
                        ? nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/') 
                        : nft.image} 
                      alt={nft.name} 
                      className="nft-image" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-nft.jpg';
                      }}
                    />
                  ) : (
                    <div className="nft-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="nft-content">
                  <h3>{nft.name}</h3>
                  <p className="nft-description">
                    {nft.description.length > 100 
                      ? `${nft.description.substring(0, 100)}...` 
                      : nft.description}
                  </p>
                  <div className="nft-price">{formatEther(nft.price)} ETH</div>
                  <div className="nft-actions">
                    <Link to={`/nft/${nft.id}`} className="details-button">Details</Link>
                    <button 
                      className="buy-button" 
                      onClick={() => handlePurchase(nft.id, nft.price)}
                      disabled={!isConnected || purchasingId === nft.id || writeStatus === 'pending' || txStatus === 'pending'}
                    >
                      {!isConnected 
                        ? "Connect Wallet" 
                        : purchasingId === nft.id && (writeStatus === 'pending' || txStatus === 'pending') 
                          ? "Processing..." 
                          : "Buy"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;