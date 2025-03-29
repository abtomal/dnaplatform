// src/hooks/useNFTContract.ts
import { useState, useEffect } from 'react';
import { useReadContract, useConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import DnaCollectionABI from '../contracts/DnaCollection.json';
import addresses from '../contracts/addresses.json';

// Definizione del tipo NFT
export interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: bigint;
  owner: string;
  attributes?: any[];
}

// Configurazione specifica per le chiamate di solo lettura
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

export const useNFTContract = () => {
  const [totalNFTs, setTotalNFTs] = useState<number>(0);
  const wagmiConfig = useConfig();
  
  // Indirizzo del contratto
  const contractAddress = addresses.DnaCollection as `0x${string}`;
  
  // Leggi il numero totale di NFT
  const { data: totalNFTsData, isError, error } = useReadContract({
    address: contractAddress,
    abi: DnaCollectionABI,
    functionName: 'getTotalNFTs',
  });
  
  useEffect(() => {
    if (totalNFTsData) {
      setTotalNFTs(Number(totalNFTsData));
    }
    
    if (isError) {
      console.error('Errore nel recupero del numero totale di NFT:', error);
    }
  }, [totalNFTsData, isError, error]);
  
  // Funzione per verificare se un token esiste usando la config wagmi
  const tokenExists = async (tokenId: number): Promise<boolean> => {
    try {
      // Utilizzando la configurazione di wagmi dalla chiusura lessicale
      const data = await readContract(wagmiConfig || config, {
        address: contractAddress,
        abi: DnaCollectionABI,
        functionName: 'tokenExists',
        args: [tokenId]
      });
      return data as boolean;
    } catch (error) {
      console.error(`Errore nella verifica dell'esistenza del token ${tokenId}:`, error);
      return false;
    }
  };
  
  // Funzione per recuperare il proprietario di un NFT
  const fetchOwner = async (tokenId: number): Promise<string> => {
    try {
      const exists = await tokenExists(tokenId);
      if (!exists) {
        throw new Error(`Il token ${tokenId} non esiste`);
      }
      
      const data = await readContract(wagmiConfig || config, {
        address: contractAddress,
        abi: DnaCollectionABI,
        functionName: 'ownerOf',
        args: [tokenId]
      });
      return data as string;
    } catch (error) {
      console.error(`Errore nel recupero del proprietario per l'NFT ${tokenId}:`, error);
      return "0x0000000000000000000000000000000000000000";
    }
  };
  
  // Funzione per recuperare il prezzo di un NFT
  const fetchPrice = async (tokenId: number): Promise<bigint> => {
    try {
      const data = await readContract(wagmiConfig || config, {
        address: contractAddress,
        abi: DnaCollectionABI,
        functionName: 'getTokenStartingPrice',
        args: [tokenId]
      });
      return data as bigint;
    } catch (error) {
      console.error(`Errore nel recupero del prezzo per l'NFT ${tokenId}:`, error);
      return BigInt(0);
    }
  };
  
  // Funzione per recuperare l'URI di un NFT
  const fetchTokenURI = async (tokenId: number): Promise<string> => {
    try {
      const data = await readContract(wagmiConfig || config, {
        address: contractAddress,
        abi: DnaCollectionABI,
        functionName: 'tokenURI',
        args: [tokenId]
      });
      return data as string;
    } catch (error) {
      console.error(`Errore nel recupero dell'URI per l'NFT ${tokenId}:`, error);
      return "";
    }
  };
  
  return { 
    totalNFTs, 
    contractAddress, 
    abi: DnaCollectionABI,
    tokenExists,
    fetchOwner,
    fetchPrice,
    fetchTokenURI
  };
};