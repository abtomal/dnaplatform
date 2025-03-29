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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface ReentrancyAttackerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "attackAuctionBid"
      | "attackAuctionClaim"
      | "attackCollectionPurchase"
      | "attackCount"
      | "attacking"
      | "auctionContract"
      | "auctionId"
      | "collectionContract"
      | "onERC721Received"
      | "setAuctionTarget"
      | "setCollectionTarget"
      | "tokenId"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "attackAuctionBid",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "attackAuctionClaim",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "attackCollectionPurchase",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "attackCount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "attacking", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "auctionContract",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "auctionId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "collectionContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAuctionTarget",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setCollectionTarget",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "tokenId", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "attackAuctionBid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attackAuctionClaim",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attackCollectionPurchase",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attackCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "attacking", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "auctionContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "auctionId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "collectionContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAuctionTarget",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCollectionTarget",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenId", data: BytesLike): Result;
}

export interface ReentrancyAttacker extends BaseContract {
  connect(runner?: ContractRunner | null): ReentrancyAttacker;
  waitForDeployment(): Promise<this>;

  interface: ReentrancyAttackerInterface;

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

  attackAuctionBid: TypedContractMethod<[], [void], "payable">;

  attackAuctionClaim: TypedContractMethod<[], [void], "nonpayable">;

  attackCollectionPurchase: TypedContractMethod<[], [void], "payable">;

  attackCount: TypedContractMethod<[], [bigint], "view">;

  attacking: TypedContractMethod<[], [boolean], "view">;

  auctionContract: TypedContractMethod<[], [string], "view">;

  auctionId: TypedContractMethod<[], [bigint], "view">;

  collectionContract: TypedContractMethod<[], [string], "view">;

  onERC721Received: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "nonpayable"
  >;

  setAuctionTarget: TypedContractMethod<
    [_auctionContract: AddressLike, _auctionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  setCollectionTarget: TypedContractMethod<
    [_collectionContract: AddressLike, _tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  tokenId: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "attackAuctionBid"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "attackAuctionClaim"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "attackCollectionPurchase"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "attackCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "attacking"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "auctionContract"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "auctionId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "collectionContract"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "onERC721Received"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setAuctionTarget"
  ): TypedContractMethod<
    [_auctionContract: AddressLike, _auctionId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setCollectionTarget"
  ): TypedContractMethod<
    [_collectionContract: AddressLike, _tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "tokenId"
  ): TypedContractMethod<[], [bigint], "view">;

  filters: {};
}
