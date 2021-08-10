
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

export type ListingCollection = {
  [id: string]: Listing;
}

export type NFTCollection = {
  [tokenId: string]: FileNFT;
}

export type LocalSession = {
  owner: string;
  data?: SessionData;
}

export type SessionData = {
  [dataId: string]: any;
}


