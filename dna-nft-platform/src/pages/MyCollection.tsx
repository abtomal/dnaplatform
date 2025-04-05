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

  // Function to retrieve metadata from URI
  const fetchMetadata = async (tokenURI: string) => {
    if (!tokenURI) return null;
    
    try {
      // Handles both IPFS and HTTP URIs
      const uri = tokenURI.startsWith('ipfs://') 
        ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/') 
        : tokenURI;
        
      const response = await fetch(uri);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error retrieving metadata:', err);
      return null;
    }
  };

  // Load NFTs owned by the user
  useEffect(() => {
    const fetchMyNFTs = async () => {
      if (!isConnected || !address || totalNFTs === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedNFTs: NFT[] = [];

        // Retrieve information for each NFT
        for (let i = 0; i < totalNFTs; i++) {
          try {
            const tokenId = i;
            
            // Verify the NFT owner
            const owner = await fetchOwner(tokenId);
            
            // Include only NFTs owned by the current user
            if (owner.toLowerCase() !== address.toLowerCase()) {
              continue;
            }
            
            const price = await fetchPrice(tokenId);
            const tokenURI = await fetchTokenURI(tokenId);

            // Retrieve metadata from URI
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
            console.error(`Error retrieving NFT ${i}:`, err);
          }
        }

        setMyNfts(fetchedNFTs);
      } catch (err) {
        console.error('Error loading NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyNFTs();
  }, [isConnected, address, totalNFTs]);

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <h2>Connect your wallet</h2>
        <p>To view your collection, connect your Ethereum wallet.</p>
      </div>
    );
  }

  return (
    <div className="my-collection">
      <div className="collection-header">
        <h1>My NFT Collection</h1>
        <p className="wallet-address">Wallet: {address}</p>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading collection...</p>
        </div>
      ) : myNfts.length === 0 ? (
        <div className="empty-collection">
          <h2>Empty collection</h2>
          <p>You don't own any NFTs yet. Purchase one from the home page!</p>
          <Link to="/collection" className="browse-button">Browse available NFTs</Link>
        </div>
      ) : (
        <div className="nft-grid">
          <h2>Your scientific NFTs</h2>
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
                  <div className="nft-price">Value: {formatEther(nft.price)} ETH</div>
                  <div className="nft-actions">
                    <Link to={`/nft/${nft.id}`} className="details-button">View content</Link>
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