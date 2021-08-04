

export interface NFT {
  name: string;
  owner: string;
  chainId: number;
  tokenId: string;
  contractAddress: string;
  contentHash: string;
  creator: string;
  
}

export interface SearchResults {
  query: string;
  suggestedRoute?: string;
  result?: any;
  empty: boolean;
}

export interface DBNFT extends NFT {
  smImg?: string;
  medImg?: string;
  pHash?: string;
  onSale?: boolean;
  price?: string;
  currency?: string;
}

export interface Order {
  address: string;
  blockNumber: number;
  transactionHash: string;
  id: string;
  tokenId: string;
  seller: string;
  contractAddress: string;
  price: string;
  expiresAt: string;
}

export type OrderCollection = {
  [id: string]: Order;
}

export type NFTCollection = {
  [tokenId: string]: DBNFT;
}

export type LocalSession = {
  owner: string;
  data?: SessionData;
}

export type SessionData = {
  [dataId: string]: any;
}


