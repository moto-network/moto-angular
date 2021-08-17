export interface Contract {
  name: string;
  address: string;
  abi: any;
  desc?: string;
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
const motoJSON = require("./app/Services/BlockchainServices/contracts/BEP20.json");


const motoBinanceTestAddress: string = "0xdc912E01a97773425adD43dB5dba75ce61Fd4c93";
const nftTestnetAddress: string = "0x4De41909a50B92b025BA95f8ddf7e7a126dC40Cd";
const ganacheNFTAddress: string = "0x0233654873Fc5130530286C9FcB64f8218E01825";
const ganachenftMarketAddress: string = "0xb52D64dFF89eDF37738C99F609E436dA5Ef8d534";
const binanceTestMarketAddress: string = "0xd4DF6E0236A01B64DB7f01f970F375384F9f5943";
const contractAddresses:AddressCollection = {
  "97": { "nft": nftTestnetAddress },
  "1337": {"nft":ganacheNFTAddress}
};
const motoTestbsc: Contract = {
  name: "moto",
  address: motoBinanceTestAddress,
  abi:motoJSON.abi
}
const nftTestnet: Contract = {
  name:"nft",
  address: nftTestnetAddress,
  abi: motoVerifiedNFT.abi,
};
const binaanceTestMarketContract: Contract = {
  name: 'market',
  address: binanceTestMarketAddress,
  abi: marketplaceJSON.abi
}
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
  "nft": nftTestnet,
  "market": binaanceTestMarketContract,
  "moto":motoTestbsc
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
  provider: "https://data-seed-prebsc-2-s2.binance.org:8545",
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
  "1337": ganacheNetwork,

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

export const UPLOAD_NFT_URL: string = "https://us-central1-motonetwork.cloudfunctions.net/uploadNFT";
export const CREATE_ORDER_URL: string = "https://us-central1-motonetwork.cloudfunctions.net/orderCreated";
export const GET_NONCE_URL: string = "https://us-central1-motonetwork.cloudfunctions.net/getNonce";
export const VERIFY_SIG_URL: string = "https://us-central1-motonetwork.cloudfunctions.net/verifySignature";
export const GEN_LINK: string = "http://localhost:5001/motonetwork/us-central1/generateFileLink";
export const FINALIZE_ORDER: string = "https://us-central1-motonetwork.cloudfunctions.net/finalizeBuyOrder";


