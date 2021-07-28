export interface Contract {
  name: string;
  address: string;
  abi: any;
}

interface ContractCollection {
  [address: string]: Contract;
}


interface Network {
  provider: string;
  contracts: ContractCollection;
  explorerBaseUrl: string;//must be url
  name: string,
  symbol:string
}

type NetworkCollection = {
  [chainId: string]: Network;
}

type AddressCollection = {
  [chainId: string]: any;
}


import { ContractsService } from "./app/Services/BlockchainServices/contracts.service";
const marketplaceJSON = require("./app/Services/BlockchainServices/contracts/Marketplace.json")
const motoVerifiedNFT = require("./app/Services/BlockchainServices/contracts/BEPMotoNFT.json");
const storageJson = require("./StorageManagementV1.json");

const storageContractTestnet: Contract = {
  name: "storage",
  address: "",
  abi: storageJson.abip
};

const nftTestnetAddress: string = "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f";
const ganacheNFTAddress: string = "0x0233654873Fc5130530286C9FcB64f8218E01825";
const ganachenftMarketAddress: string = "0xCcD2d8E517EBA0dB6B13B0801E8c4E92CF266D22";

const contractAddresses:AddressCollection = {
  "97": { "nft": nftTestnetAddress },
  "1337": {"nft":ganacheNFTAddress}
};
const nftTestnet: Contract = {
  name:"nft",
  address: nftTestnetAddress,
  abi: motoVerifiedNFT.abi,
};

const ganacheMarketContract: Contract = {
  name: "market",
  address: ganachenftMarketAddress,
  abi:marketplaceJSON.abi
}
const ganacheNFTContract: Contract = {
  name: "nft",
  address: ganacheNFTAddress,
  abi: motoVerifiedNFT.abi
};

const bscTestnetContracts:ContractCollection = {
  "nft" : nftTestnet,
};

const ganacheContractsCollection: ContractCollection = {
  "nft": ganacheNFTContract,
  "market":ganacheMarketContract
};
const mainnetContracts:ContractCollection = {};

const ganacheNetwork: Network = {
  provider: "http://127.0.0.1:38970",
  contracts: ganacheContractsCollection,
  explorerBaseUrl: "https://testnet.bscscan.com/",
  name: "ganache",
  symbol:"ganache"
}

const bscTestnetNetwork:Network = {
  provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  contracts: bscTestnetContracts,
  explorerBaseUrl: "https://testnet.bscscan.com/",
  name: "Binance Smart Chain  TESTNEST",
  symbol:"BSC",
};

const bscMainnetNetwork:Network = {
  provider: "https://bsc-dataseed.binance.org/",
  contracts: mainnetContracts,
  explorerBaseUrl: "https://testnet.bscscan.com/",
  name: "Binance Smart Chain",
  symbol:"BSC_TESTNET"
};

const networkCollection:NetworkCollection = {
  "97": bscTestnetNetwork,
  "1337":ganacheNetwork
};

export function getProvider(chainId: number):string | null{
  let index = chainId.toString(10);
  if (typeof networkCollection[index]!== 'undefined') {
    return networkCollection[index].provider;
  }
  return null;
}

export function getContractAddress(chainId: number, name: string):string {
  return contractAddresses[chainId][name];
}
  
export function getContract(chainId: number, name: string): Contract {
  return networkCollection[chainId].contracts[name];
}

export function getExplorer(chainId: number): string {
  return networkCollection[chainId].explorerBaseUrl;
}

export function getNetwork(chainId:number): Network {
  return networkCollection[chainId];
}

export function getNetworkName(chainId: number): string {
  if (typeof networkCollection[chainId] !== 'undefined') {
    return networkCollection[chainId].name;
  }
  return "N/Available";
}
//export const UPLOAD_URL: string = "http://localhost:5001/motonetwork/us-central1/uploadNFT";
export const UPLOAD_URL: string = "https://us-central1-motonetwork.cloudfunctions.net/uploadNFT";
  //uploadNFTurl: string = "http://localhost:5001/motonetwork/us-central1/uploadNFT";

