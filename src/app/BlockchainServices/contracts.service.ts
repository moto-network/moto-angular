import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as config from "../../../app.config.json";
const motoContractJSON = require('../../assets/contracts/BEPMotoNFT.json');

enum Contracts{
  BSC_MOTO_NFTsimple = "0x1A205CD19dBaDd8db1F6BECFA3b85c3d2a8B7ead"
}

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  web3 = new Web3(config.network.development);
  MotoBEPNFTContract = new this.web3.eth.Contract(motoContractJSON.abi,Contracts.BSC_MOTO_NFTsimple);
  constructor() { }

  mintNFT(){
//    this.MotoBEPNFTContract.methods.
  }

}
