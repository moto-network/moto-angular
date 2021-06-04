import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as config from "../../../../app.config.json";
import { WalletService } from './wallet.service';
const motoVerifiedNFT = require('../BlockchainServices/contracts/BEPMotoNFT.json');

enum Contracts{
  BSC_MOTO_NFTsimple = "0x1A205CD19dBaDd8db1F6BECFA3b85c3d2a8B7ead",
  BSC_TEST_VERIFIED_NFT = "0x7D1d26e8FC29C84aF88C71744178A0f314394173"
}

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  web3 = new Web3(config.network.ganache);
  MotoBEPNFTVerifiedContract = new this.web3.eth.Contract(motoVerifiedNFT.abi,Contracts.BSC_TEST_VERIFIED_NFT);

  constructor(private walletService:WalletService) {

   }

  

  getNFTFee():Promise<any>{
    return this.MotoBEPNFTVerifiedContract.methods.getFee().call();
    //dont forget the then and catch thign
  }


  mintNFT(nft:any,sig:any){
    /*
    if(this.walletService.account){
      this.walletService.
    }
    */
    this.MotoBEPNFTVerifiedContract.methods.userMint(nft.name, nft.chainId,
      nft.beneficiary,nft.contentHash,nft.tokenId,sig.r,sig.s,sig.v)
    .send({from:"0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",gas:200000})
    .then((result:any)=>{
      console.log("result is ",result);
    })
    .catch((error:any)=>{
      console.log("you done goofed",error);
    });
  }


  

}


