export interface Contract {
  name: string;
  address: string;
  abi: any;
}

interface ContractCollection {
  [name: string]: Contract;
}


interface Network {
  provider: string;
  contracts: ContractCollection;
  explorerBaseUrl: string;//must be url
}

type NetworkCollection = {
  [chainId: string]: Network;
}


import { ContractsService } from "./app/Services/BlockchainServices/contracts.service";

const motoVerifiedNFT = require("./app/Services/BlockchainServices/contracts/BEPMotoNFT.json");
const storageJson = require("./StorageManagementV1.json");

const storageContractTestnet: Contract = {
  name: "storage",
  address: "",
  abi: storageJson.abip
};

const nftTestnet: Contract = {
  name:"nft",
  address: "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
  abi: motoVerifiedNFT.abi,
};

const testnetContracts:ContractCollection = {
  nft: nftTestnet,
  storage: storageContractTestnet
};

const mainnetContracts:ContractCollection = {};
const validNetworks: number[] = [
  97,
  56
];


const testnet_parameters:Network = {
  provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  contracts: testnetContracts,
  explorerBaseUrl:"https://testnet.bscscan.com/"
};

const mainnet_parameters:Network = {
  provider: "https://bsc-dataseed.binance.org/",
  contracts: mainnetContracts,
  explorerBaseUrl: "https://testnet.bscscan.com/"
};

const networkCollection:NetworkCollection = {
  "97": testnet_parameters,
};

export function getProvider(chainId: number):string{
  let index = chainId.toString(10);
  return networkCollection[index].provider;
}

export function getContract(chainId: number, name: string): Contract {
  return networkCollection[chainId].contracts[name];
}

export function getExplorer(chainId: number): string {
  return networkCollection[chainId].explorerBaseUrl;
}


//export const UPLOAD_URL: string = "http://localhost:5001/motonetwork/us-central1/uploadNFT";
export const UPLOAD_URL: string = "https://us-central1-motonetwork.cloudfunctions.net/uploadNFT";
  //uploadNFTurl: string = "http://localhost:5001/motonetwork/us-central1/uploadNFT";

