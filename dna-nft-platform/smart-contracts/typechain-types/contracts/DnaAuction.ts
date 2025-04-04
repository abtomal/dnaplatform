/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface DnaAuctionInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "MAX_BIDDERS"
      | "claimNFT"
      | "claimRefund"
      | "createAuction"
      | "endAuction"
      | "getAuctionDetails"
      | "getBid"
      | "getTotalAuctions"
      | "onERC721Received"
      | "owner"
      | "placeBid"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AuctionCreated"
      | "AuctionEnded"
      | "AuctionSettled"
      | "BidPlaced"
      | "BidRefunded"
      | "NFTClaimed"
      | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "MAX_BIDDERS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimNFT",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimRefund",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createAuction",
    values: [AddressLike, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "endAuction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAuctionDetails",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBid",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalAuctions",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "placeBid",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "MAX_BIDDERS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimRefund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "endAuction", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAuctionDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBid", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTotalAuctions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "placeBid", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace AuctionCreatedEvent {
  export type InputTuple = [
    auctionId: BigNumberish,
    nftContract: AddressLike,
    tokenId: BigNumberish,
    startingPrice: BigNumberish,
    endTime: BigNumberish
  ];
  export type OutputTuple = [
    auctionId: bigint,
    nftContract: string,
    tokenId: bigint,
    startingPrice: bigint,
    endTime: bigint
  ];
  export interface OutputObject {
    auctionId: bigint;
    nftContract: string;
    tokenId: bigint;
    startingPrice: bigint;
    endTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AuctionEndedEvent {
  export type InputTuple = [
    auctionId: BigNumberish,
    winner: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [auctionId: bigint, winner: string, amount: bigint];
  export interface OutputObject {
    auctionId: bigint;
    winner: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AuctionSettledEvent {
  export type InputTuple = [
    auctionId: BigNumberish,
    winner: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [auctionId: bigint, winner: string, amount: bigint];
  export interface OutputObject {
    auctionId: bigint;
    winner: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BidPlacedEvent {
  export type InputTuple = [
    auctionId: BigNumberish,
    bidder: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [auctionId: bigint, bidder: string, amount: bigint];
  export interface OutputObject {
    auctionId: bigint;
    bidder: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BidRefundedEvent {
  export type InputTuple = [
    auctionId: BigNumberish,
    bidder: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [auctionId: bigint, bidder: string, amount: bigint];
  export interface OutputObject {
    auctionId: bigint;
    bidder: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NFTClaimedEvent {
  export type InputTuple = [auctionId: BigNumberish, winner: AddressLike];
  export type OutputTuple = [auctionId: bigint, winner: string];
  export interface OutputObject {
    auctionId: bigint;
    winner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DnaAuction extends BaseContract {
  connect(runner?: ContractRunner | null): DnaAuction;
  waitForDeployment(): Promise<this>;

  interface: DnaAuctionInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  MAX_BIDDERS: TypedContractMethod<[], [bigint], "view">;

  claimNFT: TypedContractMethod<
    [auctionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  claimRefund: TypedContractMethod<
    [auctionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  createAuction: TypedContractMethod<
    [
      nftContract: AddressLike,
      tokenId: BigNumberish,
      startingPrice: BigNumberish,
      duration: BigNumberish
    ],
    [bigint],
    "nonpayable"
  >;

  endAuction: TypedContractMethod<
    [auctionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getAuctionDetails: TypedContractMethod<
    [auctionId: BigNumberish],
    [
      [string, bigint, bigint, bigint, string, bigint, boolean, boolean] & {
        nftContract: string;
        tokenId: bigint;
        startingPrice: bigint;
        endTime: bigint;
        highestBidder: string;
        highestBid: bigint;
        ended: boolean;
        nftClaimed: boolean;
      }
    ],
    "view"
  >;

  getBid: TypedContractMethod<
    [auctionId: BigNumberish, bidder: AddressLike],
    [bigint],
    "view"
  >;

  getTotalAuctions: TypedContractMethod<[], [bigint], "view">;

  onERC721Received: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  placeBid: TypedContractMethod<[auctionId: BigNumberish], [void], "payable">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "MAX_BIDDERS"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "claimNFT"
  ): TypedContractMethod<[auctionId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "claimRefund"
  ): TypedContractMethod<[auctionId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createAuction"
  ): TypedContractMethod<
    [
      nftContract: AddressLike,
      tokenId: BigNumberish,
      startingPrice: BigNumberish,
      duration: BigNumberish
    ],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "endAuction"
  ): TypedContractMethod<[auctionId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getAuctionDetails"
  ): TypedContractMethod<
    [auctionId: BigNumberish],
    [
      [string, bigint, bigint, bigint, string, bigint, boolean, boolean] & {
        nftContract: string;
        tokenId: bigint;
        startingPrice: bigint;
        endTime: bigint;
        highestBidder: string;
        highestBid: bigint;
        ended: boolean;
        nftClaimed: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getBid"
  ): TypedContractMethod<
    [auctionId: BigNumberish, bidder: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getTotalAuctions"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "onERC721Received"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "placeBid"
  ): TypedContractMethod<[auctionId: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "AuctionCreated"
  ): TypedContractEvent<
    AuctionCreatedEvent.InputTuple,
    AuctionCreatedEvent.OutputTuple,
    AuctionCreatedEvent.OutputObject
  >;
  getEvent(
    key: "AuctionEnded"
  ): TypedContractEvent<
    AuctionEndedEvent.InputTuple,
    AuctionEndedEvent.OutputTuple,
    AuctionEndedEvent.OutputObject
  >;
  getEvent(
    key: "AuctionSettled"
  ): TypedContractEvent<
    AuctionSettledEvent.InputTuple,
    AuctionSettledEvent.OutputTuple,
    AuctionSettledEvent.OutputObject
  >;
  getEvent(
    key: "BidPlaced"
  ): TypedContractEvent<
    BidPlacedEvent.InputTuple,
    BidPlacedEvent.OutputTuple,
    BidPlacedEvent.OutputObject
  >;
  getEvent(
    key: "BidRefunded"
  ): TypedContractEvent<
    BidRefundedEvent.InputTuple,
    BidRefundedEvent.OutputTuple,
    BidRefundedEvent.OutputObject
  >;
  getEvent(
    key: "NFTClaimed"
  ): TypedContractEvent<
    NFTClaimedEvent.InputTuple,
    NFTClaimedEvent.OutputTuple,
    NFTClaimedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "AuctionCreated(uint256,address,uint256,uint256,uint256)": TypedContractEvent<
      AuctionCreatedEvent.InputTuple,
      AuctionCreatedEvent.OutputTuple,
      AuctionCreatedEvent.OutputObject
    >;
    AuctionCreated: TypedContractEvent<
      AuctionCreatedEvent.InputTuple,
      AuctionCreatedEvent.OutputTuple,
      AuctionCreatedEvent.OutputObject
    >;

    "AuctionEnded(uint256,address,uint256)": TypedContractEvent<
      AuctionEndedEvent.InputTuple,
      AuctionEndedEvent.OutputTuple,
      AuctionEndedEvent.OutputObject
    >;
    AuctionEnded: TypedContractEvent<
      AuctionEndedEvent.InputTuple,
      AuctionEndedEvent.OutputTuple,
      AuctionEndedEvent.OutputObject
    >;

    "AuctionSettled(uint256,address,uint256)": TypedContractEvent<
      AuctionSettledEvent.InputTuple,
      AuctionSettledEvent.OutputTuple,
      AuctionSettledEvent.OutputObject
    >;
    AuctionSettled: TypedContractEvent<
      AuctionSettledEvent.InputTuple,
      AuctionSettledEvent.OutputTuple,
      AuctionSettledEvent.OutputObject
    >;

    "BidPlaced(uint256,address,uint256)": TypedContractEvent<
      BidPlacedEvent.InputTuple,
      BidPlacedEvent.OutputTuple,
      BidPlacedEvent.OutputObject
    >;
    BidPlaced: TypedContractEvent<
      BidPlacedEvent.InputTuple,
      BidPlacedEvent.OutputTuple,
      BidPlacedEvent.OutputObject
    >;

    "BidRefunded(uint256,address,uint256)": TypedContractEvent<
      BidRefundedEvent.InputTuple,
      BidRefundedEvent.OutputTuple,
      BidRefundedEvent.OutputObject
    >;
    BidRefunded: TypedContractEvent<
      BidRefundedEvent.InputTuple,
      BidRefundedEvent.OutputTuple,
      BidRefundedEvent.OutputObject
    >;

    "NFTClaimed(uint256,address)": TypedContractEvent<
      NFTClaimedEvent.InputTuple,
      NFTClaimedEvent.OutputTuple,
      NFTClaimedEvent.OutputObject
    >;
    NFTClaimed: TypedContractEvent<
      NFTClaimedEvent.InputTuple,
      NFTClaimedEvent.OutputTuple,
      NFTClaimedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
