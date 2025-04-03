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
export declare const useAuctionContract: () => {
    totalAuctions: number;
    contractAddress: `0x${string}`;
    abi: ({
        inputs: any[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    fetchAuctionDetails: (auctionId: number) => Promise<Auction | null>;
    isAuctionActive: (auctionId: number) => Promise<boolean>;
    fetchUserBid: (auctionId: number, address: string) => Promise<bigint>;
    fetchActiveAuctions: () => Promise<Auction[]>;
    getRemainingTime: (endTime: bigint) => number;
};
