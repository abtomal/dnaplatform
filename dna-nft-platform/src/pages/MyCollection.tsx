// src/pages/MyCollection.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useNFTContract, NFT } from '../hooks/useNFTContract';
import './MyCollection.css';

const MyCollection: React.FC = () => {
  const [myNfts, setMyNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { totalNFTs, fetchOwner, fetchPrice, fetchTokenURI } = useNFTContract();

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

  // Carica gli NFT posseduti dall'utente
  useEffect(() => {
    const fetchMyNFTs = async () => {
      if (!isConnected || !address || totalNFTs === 0) {
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
            
            // Verifica il proprietario dell'NFT
            const owner = await fetchOwner(tokenId);
            
            // Includi solo gli NFT posseduti dall'utente corrente
            if (owner.toLowerCase() !== address.toLowerCase()) {
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

        setMyNfts(fetchedNFTs);
      } catch (err) {
        console.error('Errore nel caricamento degli NFT:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyNFTs();
  }, [isConnected, address, totalNFTs]);

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <h2>Connetti il tuo wallet</h2>
        <p>Per visualizzare la tua collezione, connetti il tuo wallet Ethereum.</p>
      </div>
    );
  }

  return (
    <div className="my-collection">
      <div className="collection-header">
        <h1>La mia collezione NFT</h1>
        <p className="wallet-address">Wallet: {address}</p>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Caricamento della collezione...</p>
        </div>
      ) : myNfts.length === 0 ? (
        <div className="empty-collection">
          <h2>Collezione vuota</h2>
          <p>Non possiedi ancora nessun NFT. Acquistane uno dalla home page!</p>
          <Link to="/" className="browse-button">Sfoglia gli NFT disponibili</Link>
        </div>
      ) : (
        <div className="nft-grid">
          <h2>I tuoi NFT scientifici</h2>
          <div className="grid">
            {myNfts.map(nft => (
              <div key={nft.id} className="nft-card">
                <div className="nft-image-container">
                  {nft.image ? (
                    <img 
                      src={nft.image.startsWith('ipfs://') 
                        ? nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/') 
                        : nft.image} 
                      alt={nft.name} 
                      className="nft-image" 
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
                  <div className="nft-price">Valore: {formatEther(nft.price)} ETH</div>
                  <div className="nft-actions">
                    <Link to={`/nft/${nft.id}`} className="details-button">Visualizza contenuto</Link>
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

export default MyCollection;