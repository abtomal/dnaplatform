// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useNFTContract, NFT } from '../hooks/useNFTContract';
import DnaCollectionABI from '../contracts/DnaCollection.json';
import './Home.css';

const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { totalNFTs, contractAddress } = useNFTContract();

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!isConnected || totalNFTs === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedNFTs: NFT[] = [];

        // Recupera informazioni per ogni NFT
        for (let i = 1; i <= totalNFTs; i++) {
          try {
            // Implementa queste funzioni per recuperare i dati degli NFT
            const owner = await fetchOwner(i);
            const price = await fetchPrice(i);
            const tokenURI = await fetchTokenURI(i);

            // Salta gli NFT posseduti dall'utente connesso
            if (address && owner.toLowerCase() === address.toLowerCase()) {
              continue;
            }

            // Recupera i metadati dall'URI
            const metadata = await fetchMetadata(tokenURI);
            
            fetchedNFTs.push({
              id: i,
              name: metadata?.name || `NFT #${i}`,
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

    fetchNFTs();
  }, [isConnected, totalNFTs, address, contractAddress]);

  // Funzioni di utilità per recuperare i dati degli NFT
  const fetchOwner = async (tokenId: number) => {
    // Implementare questa funzione utilizzando useReadContract
    return "0x..."; // Placeholder
  };

  const fetchPrice = async (tokenId: number) => {
    // Implementare questa funzione utilizzando useReadContract
    return BigInt(0); // Placeholder
  };

  const fetchTokenURI = async (tokenId: number) => {
    // Implementare questa funzione utilizzando useReadContract
    return ""; // Placeholder
  };

  const fetchMetadata = async (tokenURI: string) => {
    if (!tokenURI) return null;
    
    try {
      const uri = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const response = await fetch(uri);
      return await response.json();
    } catch (err) {
      console.error('Errore nel recupero dei metadati:', err);
      return null;
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>DnA - Discovering new Answers </h1>
        <h2><p>Unlock and own exclusive scientific content as NFTs!</p><p>This your gateway to groundbreaking knowledge</p></h2>
      </div>
      
      {!isConnected ? (
        <div className="connect-prompt">
          <h2>Connect your wallet to discover, buy and unlock our NFTs</h2>
        </div>
      ) : loading ? (
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
                      src={nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                      alt={nft.name} 
                      className="nft-image" 
                    />
                  ) : (
                    <div className="nft-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="nft-content">
                  <h3>{nft.name}</h3>
                  <p className="nft-description">{nft.description.substring(0, 100)}...</p>
                  <div className="nft-price">{formatEther(nft.price)} ETH</div>
                  <div className="nft-actions">
                    <Link to={`/nft/${nft.id}`} className="details-button">Details</Link>
                    <button className="buy-button">Buy</button>
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

export default Home;