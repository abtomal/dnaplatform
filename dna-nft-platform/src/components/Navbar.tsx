// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './Navbar.css';

const Navbar: React.FC = () => {
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
          <Link to="/collection" className="navbar-link">Collection</Link>
        </div>
        
        <div className="navbar-wallet">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button 
                          onClick={openConnectModal} 
                          className="connect-button"
                          type="button"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div className="dropdown">
                        <div className="dropdown-toggle">
                          {account.displayName} ▼
                        </div>
                        <div className="dropdown-menu">
                          <Link to="/my-collection" className="dropdown-item">
                            My Collection
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;