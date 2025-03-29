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
  
  // Ottieni l'ID del token
  const tokenId = id ? parseInt(id) : -1;
  
  // Hook per scrivere sul contratto (acquisto NFT)
  const {
    writeContract,
    data: txHash,
    isPending, 
    isError: isWriteError,
    error: writeError
  } = useWriteContract();
  
  // Ascolta eventi di acquisto per aggiornare l'interfaccia
  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'NFTPurchased',
    onLogs: () => {
      // Ricarica i dettagli dell'NFT quando viene emesso un evento
      loadNFTDetails();
    },
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
  
  // Funzione per caricare i dettagli dell'NFT
  const loadNFTDetails = async () => {
    if (tokenId < 0) {
      setError("ID NFT non valido");
      setLoading(false);
      return;
    }
    
    try {
      // Verifica se il token esiste
      const exists = await tokenExists(tokenId);
      if (!exists) {
        setError("NFT non trovato");
        setLoading(false);
        return;
      }
      
      // Recupera i dettagli dell'NFT
      const owner = await fetchOwner(tokenId);
      const price = await fetchPrice(tokenId);
      const tokenURI = await fetchTokenURI(tokenId);
      
      // Recupera i metadati
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
      console.error(`Errore nel recupero dei dettagli dell'NFT:`, error);
      setError("Errore nel caricamento dei dettagli dell'NFT");
      setLoading(false);
    }
  };
  
  // Effetto per caricare i dettagli dell'NFT al caricamento o quando cambia l'ID
  useEffect(() => {
    loadNFTDetails();
  }, [tokenId]);
  
  // Gestione degli errori di scrittura
  useEffect(() => {
    if (isWriteError && writeError) {
      alert(`Errore durante l'acquisto: ${writeError.message}`);
    }
  }, [isWriteError, writeError]);
  
  // Gestione dell'acquisto
  const handlePurchase = () => {
    if (!isConnected || !address || !nft) {
      alert("Connetti il tuo wallet per acquistare questo NFT");
      return;
    }
    
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'purchaseNFT',
        args: [nft.id],
        value: nft.price
      });
    } catch (error) {
      console.error("Errore durante l'acquisto dell'NFT:", error);
    }
  };
  
  // Verifica se l'utente è il proprietario dell'NFT
  const isOwner = isConnected && address && nft && nft.owner.toLowerCase() === address.toLowerCase();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Caricamento dettagli NFT...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Si è verificato un errore</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">Torna alla home</Link>
      </div>
    );
  }
  
  if (!nft) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="nft-details">
      <div className="details-header">
        <Link to="/" className="back-link">&larr; Torna alla home</Link>
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
            <h2>Descrizione</h2>
            <p className="nft-description-full">{nft.description}</p>
          </div>
          
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="info-section">
              <h2>Attributi</h2>
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
            <h2>Dettagli</h2>
            <div className="detail-row">
              <span className="detail-label">ID Token:</span>
              <span className="detail-value">{nft.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Proprietario:</span>
              <span className="detail-value address">{nft.owner}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Prezzo:</span>
              <span className="detail-value price">{formatEther(nft.price)} ETH</span>
            </div>
          </div>
          
          <div className="action-section">
            {isOwner ? (
              <div className="owner-message">
                <p>Sei il proprietario di questo NFT</p>
                <Link to="/my-collection" className="collection-link">Visualizza la tua collezione</Link>
              </div>
            ) : (
              <button 
                className="purchase-button" 
                onClick={handlePurchase}
                disabled={isPending}
              >
                {isPending ? "Transazione in corso..." : `Acquista per ${formatEther(nft.price)} ETH`}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isOwner && (
        <div className="content-access">
          <h2>Contenuto esclusivo</h2>
          <div className="exclusive-content">
            <p>In quanto proprietario di questo NFT, hai accesso al contenuto esclusivo!</p>
            <div className="content-box">
              <h3>Contenuto scientifico protetto da NFT</h3>
              <p>Questo è un esempio di articolo scientifico accessibile solo ai proprietari dell'NFT.</p>
              <div className="scientific-content">
                <h4>Abstract</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                
                <h4>Introduzione</h4>
                <p>Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.</p>
                
                <h4>Metodologia</h4>
                <p>Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue.</p>
                
                <h4>Risultati</h4>
                <p>Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede.</p>
                
                <h4>Conclusioni</h4>
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