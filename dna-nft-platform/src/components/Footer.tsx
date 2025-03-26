import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">DnA</span>
            <span className="logo-subtitle">NFT Platform</span>
          </div>
          
          <p className="footer-description">
          DnA provides access to exclusive scientific content through NFTs.
          Explore, purchase and participate in auctions to access the best science communication articles.
          </p>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} DnA. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;