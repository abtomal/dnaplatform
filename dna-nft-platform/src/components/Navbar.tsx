import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import './Navbar.css';

const Navbar: React.FC = () => {
  // Hook per gestire lo stato del dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Riferimento per il click-outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Hook di wagmi per gestire l'account e la disconnessione
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Hook di RainbowKit per la connessione
  const { openConnectModal } = useConnectModal();
  
  // Gestisce il click fuori dal dropdown per chiuderlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Ottieni un formato abbreviato dell'indirizzo
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">DnA</span>
            <span className="logo-subtitle">NFT Platform</span>
          </Link>
        </div>
        
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/collection" className="navbar-link">Discover</Link>
        </div>
        
        <div className="navbar-wallet">
          {!isConnected ? (
            // Bottone di connessione quando l'utente non è connesso
            <button 
              onClick={openConnectModal}
              className="connect-button"
              type="button"
            >
              Connect Wallet
            </button>
          ) : (
            // Dropdown quando l'utente è connesso
            <div className="wallet-dropdown" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="wallet-button"
                type="button"
              >
                {formatAddress(address || '')} <span className="dropdown-icon">▼</span>
              </button>
              
              {/* Menu dropdown che si mostra solo quando isDropdownOpen è true */}
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link 
                    to="/my-collection" 
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    MY NFTs
                  </Link>
                  <button 
                    onClick={() => {
                      disconnect();
                      setIsDropdownOpen(false);
                    }}
                    className="dropdown-item disconnect-button"
                    type="button"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 