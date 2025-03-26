import React from 'react';
import { useParams } from 'react-router-dom';

const NFTDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Dettagli NFT</h1>
      <p>ID NFT: {id}</p>
    </div>
  );
};

export default NFTDetails;