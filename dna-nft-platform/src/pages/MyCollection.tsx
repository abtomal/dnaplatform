import React from 'react';
import { useAccount } from 'wagmi';

const MyCollection: React.FC = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <h2>Connetti il tuo wallet</h2>
        <p>Per visualizzare la tua collezione, connetti il tuo wallet Ethereum.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>La mia collezione</h1>
      <p>Indirizzo wallet: {address}</p>
    </div>
  );
};

export default MyCollection;