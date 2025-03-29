// src/hooks/useAuctionContract.ts
import { useState, useEffect } from 'react';
import { useReadContract, useConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import DnaAuctionABI from '../contracts/DnaAuction.json';
import addresses from '../contracts/addresses.json';

// Definizione del tipo Auction
export interface Auction {
  id: number;
  nftContract: string;
  tokenId: number;
  startingPrice: bigint;
  endTime: bigint;
  highestBidder: string;
  highestBid: bigint;
  ended: boolean;
  nftClaimed: boolean;
}

// Configurazione specifica per le chiamate di solo lettura
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

export const useAuctionContract = () => {
  const [totalAuctions, setTotalAuctions] = useState<number>(0);
  const wagmiConfig = useConfig();
  
  // Indirizzo del contratto
  const contractAddress = addresses.DnaAuction as `0x${string}`;
  
  // Leggi il numero totale di aste
  const { data: totalAuctionsData, isError, error } = useReadContract({
    address: contractAddress,
    abi: DnaAuctionABI,
    functionName: 'getTotalAuctions',
  });
  
  useEffect(() => {
    if (totalAuctionsData) {
      setTotalAuctions(Number(totalAuctionsData));
    }
    
    if (isError) {
      console.error('Errore nel recupero del numero totale di aste:', error);
    }
  }, [totalAuctionsData, isError, error]);
  
  // Funzione per recuperare i dettagli di un'asta
  const fetchAuctionDetails = async (auctionId: number): Promise<Auction | null> => {
    try {
      const data = await readContract(wagmiConfig || config, {
        address: contractAddress,
        abi: DnaAuctionABI,
        functionName: 'getAuctionDetails',
        args: [auctionId]
      });
      
      // getAuctionDetails restituisce un array di valori, li mappiamo a un oggetto Auction
      const [
        nftContract,
        tokenId,
        startingPrice,
        endTime,
        highestBidder,
        highestBid,
        ended,
        nftClaimed
      ] = data as [string, bigint, bigint, bigint, string, bigint, boolean, boolean];
      
      return {
        id: auctionId,
        nftContract,
        tokenId: Number(tokenId),
        startingPrice,
        endTime,
        highestBidder,
        highestBid,
        ended,
        nftClaimed
      };
    } catch (error) {
      console.error(`Errore nel recupero dei dettagli dell'asta ${auctionId}:`, error);
      return null;
    }
  };
  
  // Funzione per verificare lo stato di un'asta
  const isAuctionActive = async (auctionId: number): Promise<boolean> => {
    try {
      const auction = await fetchAuctionDetails(auctionId);
      
      if (!auction) return false;
      
      // Un'asta è attiva se non è terminata e il tempo di fine è maggiore dell'ora attuale
      const now = BigInt(Math.floor(Date.now() / 1000)); // Timestamp corrente in secondi
      return !auction.ended && auction.endTime > now;
    } catch (error) {
      console.error(`Errore nella verifica dello stato dell'asta ${auctionId}:`, error);
      return false;
    }
  };
  
  // Funzione per recuperare l'offerta di un utente
  const fetchUserBid = async (auctionId: number, address: string): Promise<bigint> => {
    try {
      const data = await readContract(wagmiConfig || config, {
        address: contractAddress,
        abi: DnaAuctionABI,
        functionName: 'getBid',
        args: [auctionId, address]
      });
      
      return data as bigint;
    } catch (error) {
      console.error(`Errore nel recupero dell'offerta dell'utente per l'asta ${auctionId}:`, error);
      return BigInt(0);
    }
  };
  
  // Funzione per recuperare tutte le aste attive
  const fetchActiveAuctions = async (): Promise<Auction[]> => {
    if (totalAuctions === 0) return [];
    
    try {
      const auctions: Auction[] = [];
      
      for (let i = 0; i < totalAuctions; i++) {
        try {
          const auction = await fetchAuctionDetails(i);
          
          if (auction && await isAuctionActive(i)) {
            auctions.push(auction);
          }
        } catch (err) {
          console.error(`Errore nel recupero dell'asta ${i}:`, err);
        }
      }
      
      return auctions;
    } catch (err) {
      console.error('Errore nel recupero delle aste attive:', err);
      return [];
    }
  };
  
  // Calcola il tempo rimanente di un'asta in millisecondi
  const getRemainingTime = (endTime: bigint): number => {
    const now = Date.now(); // Millisecondi attuali
    const end = Number(endTime) * 1000; // Converti secondi Unix in millisecondi
    return Math.max(0, end - now);
  };
  
  return { 
    totalAuctions, 
    contractAddress, 
    abi: DnaAuctionABI,
    fetchAuctionDetails,
    isAuctionActive,
    fetchUserBid,
    fetchActiveAuctions,
    getRemainingTime
  };
};