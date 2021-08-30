
export interface NFT {
  name: string;
  owner: string;
  chainId: number;
  tokenId: string;
  contractAddress: string;
  contentHash: string;
  creator: string;
}

export interface FileNFT extends NFT {
  readonly smImg?: string;
  readonly medImg?: string;
  readonly pHash?: string;
}

export interface ListingNFT extends NFT {
  readonly onSale: boolean;
  order: Listing;
}

export interface SearchResults {
  query: string;
  suggestedRoute?: string;
  result?: any;
  empty: boolean;
}

export interface Listing {
  address: string;
  blockNumber: number;
  transactionHash: string;
  id: string;
  tokenId: string;
  seller: string;
  contractAddress: string;
  price: string;
  expiresAt?: string;
  buyer?: string;
}

export interface Account {
  address: string;
  network: number;
}

export type ListingCollection = {
  [id: string]: Listing;
}

export type NFTCollection<NFTType extends NFT> = {
  [tokenId: string]: NFTType;
}

export type LocalSession = {
  owner: string;
  data?: SessionData;
}

export type Tier = {
  valid: boolean;
  creator: string;
  network: number;
  priceInBaseUnits: string;
  commissionInBaseUnits: string;
}

export type Subscription = {
  tier: Tier;
  expirationDate: string;
}

export type SessionData = {
  [dataId: string]: any;
}

export interface TransactionReceipt {
  status: boolean;
  transactionHash: string;
  transactionIndex?: number;
  blockHash?: string;
  blockNumber?: number;
  contractAddress?: string;
  cumulativeGasUsed?: number;
  gasUsed?: number;
  logs?:any[] //array of logs ..change
}

