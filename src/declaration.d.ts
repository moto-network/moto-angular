export interface NFT {
  name: string;
  beneficiary: string;
  chainId: number;
  tokenId: string;
  contractAddress: string;
  contentHash: string;
  creator: string;
  pHash?: string;
}

