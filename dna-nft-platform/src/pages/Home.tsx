// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useTransaction } from 'wagmi';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useNFTContract, NFT } from '../hooks/useNFTContract';
import FeaturedContent from '../components/FeaturedContent/FeaturedContent';
import './Home.css';

const Home: React.FC = () => {
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
        value: price
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
      fetchNFTs(); // Aggiorna la lista dopo l'acquisto
    }
  }, [writeError, txStatus]);
  
  // Funzione principale per recuperare tutti gli NFT
  const fetchNFTs = async () => {
    if (!isConnected || !totalNFTs || totalNFTs === 0) {
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
          
          // Salta gli NFT posseduti dall'utente connesso
          if (address && owner.toLowerCase() === address.toLowerCase()) {
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

  // Carica gli NFT all'avvio
  useEffect(() => {
    if (isConnected) {
      fetchNFTs();
    }
  }, [isConnected, totalNFTs, address]);

  return (
    <div className="home">
      <div className="home-header">
        <h1>DnA - Discovering new Answers</h1>
        <h2>
          <p>Unlock and own exclusive scientific content as NFTs!</p>
          <p>This is your gateway to groundbreaking knowledge.</p>
        </h2>
      </div>
      
      {!isConnected && (
        <div className="connect-prompt">
          <h2>Connect your wallet to discover, buy and unlock our NFTs</h2>
        </div>
      )}
      
      {/* FeaturedContent mostrato dopo il prompt di connessione, ma separato da esso */}
      <FeaturedContent />
      
      {isConnected && (
        <>
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading NFTs...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="no-nfts">
              <h2>No NFTs available</h2>
              <p>There are no NFTs currently for sale.</p>
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
                            // Immagine di fallback se l'URL non è valido
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
                        <Link to={`/nft/${nft.id}`} className="details-button">Dettagli</Link>
                        <button 
                          className="buy-button" 
                          onClick={() => handlePurchase(nft.id, nft.price)}
                          disabled={purchasingId === nft.id || writeStatus === 'pending' || txStatus === 'pending'}
                        >
                          {purchasingId === nft.id && (writeStatus === 'pending' || txStatus === 'pending') 
                            ? "In elaborazione..." 
                            : "Acquista"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;