// src/hooks/useNFTContract.ts
import { useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import DnaCollectionABI from '../contracts/DnaCollection.json';
import addresses from '../contracts/addresses.json';

// Definisci il tipo per gli NFT
export interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: bigint;
  owner: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Indirizzo del contratto NFT
const contractAddress = addresses.DnaCollection as `0x${string}`;

export function useNFTContract() {
  // Hook per leggere il numero totale di NFT
  const { data: totalNFTs, isLoading: isLoadingTotal } = useReadContract({
    address: contractAddress,
    abi: DnaCollectionABI.abi,
    functionName: 'getTotalNFTs',
  });

  // Hook per scrivere al contratto
  const { writeContract, isPending } = useWriteContract();

  // Funzione per acquistare un NFT
  const purchaseNFT = async (tokenId: number, price: string) => {
    return writeContract({
      address: contractAddress,
      abi: DnaCollectionABI.abi,
      functionName: 'purchaseNFT',
      args: [BigInt(tokenId)],
      value: parseEther(price),
    });
  };

  return {
    totalNFTs: totalNFTs ? Number(totalNFTs) : 0,
    isLoadingTotal,
    purchaseNFT,
    isPending,
    contractAddress
  };
}