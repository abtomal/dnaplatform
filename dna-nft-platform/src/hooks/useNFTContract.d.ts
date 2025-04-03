export interface NFT {
    id: number;
    name: string;
    description: string;
    image: string;
    price: bigint;
    owner: string;
    attributes?: any[];
}
export declare const useNFTContract: () => {
    totalNFTs: number;
    contractAddress: `0x${string}`;
    abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
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
    tokenExists: (tokenId: number) => Promise<boolean>;
    fetchOwner: (tokenId: number) => Promise<string>;
    fetchPrice: (tokenId: number) => Promise<bigint>;
    fetchTokenURI: (tokenId: number) => Promise<string>;
};
