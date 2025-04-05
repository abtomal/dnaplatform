// src/pages/NFTDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { useNFTContract, NFT } from '../hooks/useNFTContract';
import './NFTDetails.css';

const NFTDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { contractAddress, abi, tokenExists, fetchOwner, fetchPrice, fetchTokenURI } = useNFTContract();
  
  // Get the token ID
  const tokenId = id ? parseInt(id) : -1;
  
  // Hook for writing to the contract (NFT purchase)
  const {
    writeContract,
    isPending, 
    isError: isWriteError,
    error: writeError
  } = useWriteContract();
  
  // Listen for purchase events to update the interface
  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'NFTPurchased',
    onLogs: () => {
      // Reload NFT details when an event is emitted
      loadNFTDetails();
    },
  });
  
  // Function to retrieve metadata from URI
  const fetchMetadata = async (tokenURI: string) => {
    if (!tokenURI) return null;
    
    try {
      // Handle both IPFS and HTTP URIs
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
  
  // Function to load NFT details
  const loadNFTDetails = async () => {
    if (tokenId < 0) {
      setError("Invalid NFT ID");
      setLoading(false);
      return;
    }
    
    try {
      // Verify if the token exists
      const exists = await tokenExists(tokenId);
      if (!exists) {
        setError("NFT not found");
        setLoading(false);
        return;
      }
      
      // Retrieve NFT details
      const owner = await fetchOwner(tokenId);
      const price = await fetchPrice(tokenId);
      const tokenURI = await fetchTokenURI(tokenId);
      
      // Retrieve metadata
      const metadata = await fetchMetadata(tokenURI);
      
      const nftData: NFT = {
        id: tokenId,
        name: metadata?.name || `NFT #${tokenId}`,
        description: metadata?.description || '',
        image: metadata?.image || '',
        price,
        owner,
        attributes: metadata?.attributes
      };
      
      setNft(nftData);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error(`Error retrieving NFT details:`, error);
      setError("Error loading NFT details");
      setLoading(false);
    }
  };
  
  // Effect to load NFT details when loading or when ID changes
  useEffect(() => {
    loadNFTDetails();
  }, [tokenId]);
  
  // Write error handling
  useEffect(() => {
    if (isWriteError && writeError) {
      alert(`Error during purchase: ${writeError.message}`);
    }
  }, [isWriteError, writeError]);
  
  // Purchase handling
  const handlePurchase = () => {
    if (!isConnected || !address || !nft) {
      alert("Connect your wallet to purchase this NFT");
      return;
    }
    
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'purchaseNFT',
        args: [nft.id],
        value: nft.price,
        chain: undefined,
        account: address as `0x${string}`
      });
    } catch (error) {
      console.error("Error during NFT purchase:", error);
    }
  };
  
  // Check if the user is the owner of the NFT
  const isOwner = isConnected && address && nft && nft.owner.toLowerCase() === address.toLowerCase();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading NFT details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>An error occurred</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">Back to home</Link>
      </div>
    );
  }
  
  if (!nft) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="nft-details">
      <div className="details-header">
        <Link to="/" className="back-link">&larr; Back to home</Link>
        <h1>{nft.name}</h1>
      </div>
      
      <div className="details-content">
        <div className="nft-image-container">
          {nft.image ? (
            <img 
              src={nft.image.startsWith('ipfs://') 
                ? nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/') 
                : nft.image} 
              alt={nft.name} 
              className="nft-image-large" 
            />
          ) : (
            <div className="nft-image-placeholder-large">No Image</div>
          )}
        </div>
        
        <div className="nft-info">
          <div className="info-section">
            <h2>Description</h2>
            <p className="nft-description-full">{nft.description}</p>
          </div>
          
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="info-section">
              <h2>Attributes</h2>
              <div className="attributes-container">
                {nft.attributes.map((attr, index) => (
                  <div key={index} className="attribute-card">
                    <div className="attribute-trait">{attr.trait_type}</div>
                    <div className="attribute-value">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="info-section">
            <h2>Details</h2>
            <div className="detail-row">
              <span className="detail-label">Token ID:</span>
              <span className="detail-value">{nft.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Owner:</span>
              <span className="detail-value address">{nft.owner}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Price:</span>
              <span className="detail-value price">{formatEther(nft.price)} ETH</span>
            </div>
          </div>
          
          <div className="action-section">
            {isOwner ? (
              <div className="owner-message">
                <p>You are the owner of this NFT</p>
                <Link to="/my-collection" className="collection-link">View your collection</Link>
              </div>
            ) : (
              <button 
                className="purchase-button" 
                onClick={handlePurchase}
                disabled={isPending}
              >
                {isPending ? "Transaction in progress..." : `Purchase for ${formatEther(nft.price)} ETH`}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isOwner && (
        <div className="content-access">
          <h2>Exclusive content</h2>
          <div className="exclusive-content">
            <p>As the owner of this NFT, you have access to exclusive content!</p>
            <div className="content-box">
              <h3>Scientific content protected by NFT</h3>
              <p>This is an example of a scientific article accessible only to NFT owners.</p>
              <div className="scientific-content">
                <h4>Abstract</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                
                <h4>Introduction</h4>
                <p>Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.</p>
                
                <h4>Methodology</h4>
                <p>Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue.</p>
                
                <h4>Results</h4>
                <p>Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede.</p>
                
                <h4>Conclusions</h4>
                <p>Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTDetails;