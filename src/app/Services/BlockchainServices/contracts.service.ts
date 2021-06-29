import { Injectable } from '@angular/core';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as config from "../../../../app.config.json";
import { WalletService } from './wallet.service';
const motoVerifiedNFT = require('../BlockchainServices/contracts/BEPMotoNFT.json');
const utils = require('ethereumjs-util');
enum Contracts{
  BSC_MOTO_NFTsimple = "0x1A205CD19dBaDd8db1F6BECFA3b85c3d2a8B7ead",
  BSC_TEST_VERIFIED_NFT = "0x6fA54eAAE6E86A3D8DdB95533BBE988EAd8eACdc"
}

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  web3 = new Web3(config.network.bsc_test);
  MotoBEPNFTVerifiedContract = new this.web3.eth
  .Contract(motoVerifiedNFT.abi,Contracts.BSC_TEST_VERIFIED_NFT);

  constructor(private walletService:WalletService) {

   }

  

  getNFTFee():Promise<any>{
    return this.MotoBEPNFTVerifiedContract.methods.getFee().call();
    //dont forget the then and catch thign
  }


  mintNFT(nft:any,signature:string):Promise<any>{
    let transactionPromise:Promise<any>=new Promise((resolve,reject)=>{});
    console.log("signature before split ",signature);
    let sig = this.splitSignature(signature);
    console.log("mintNFT sig is ",sig);
    const transactionData = this.MotoBEPNFTVerifiedContract.methods
    .userMint(nft.name, nft.chainId,nft.beneficiary,nft.contentHash,nft.tokenId,sig.r,sig.s,sig.v).encodeABI();
    
    return new Promise((resolve, reject) => {
      this.getNFTFee()
        .then((nftFee: string) => {//can probably chain the .then statements instead of nesting
          this.web3.eth.getGasPrice()
          .then((gas:string)=>{
            const transactionValueString = this.web3.utils.toWei(nftFee, 'ether');
            const transactionParameters = {
              gasPrice: gas,
              to: Contracts.BSC_TEST_VERIFIED_NFT,
              value: this.web3.utils.numberToHex(transactionValueString),
              from: this.walletService.account,
              data: transactionData,
              chaindId: (97).toString(16),
            }
            this.walletService.sendTransaction(transactionParameters)
              .then((transactionHash: string) => {
                resolve(transactionHash);
              })
              .catch((err) => {
                reject(new Error(err));
              });
          })
          .catch((err)=>{
            reject(new Error(err));
          });
          
        })
    });
    //this.walletService.sendTransaction(transactionParameters);
  }

  splitSignature(signature:string):any{
    let chopppedString = signature.split('x')[1];
    let r = Buffer.from(chopppedString.substring(0, 64), 'hex').toString('hex');
    let s = Buffer.from(chopppedString.substring(64, 128), 'hex').toString('hex');
    let v = Buffer.from((parseInt(chopppedString.substring(128, 130)) + 27).toString(),'hex').toString('hex');
    console.table({"r":r,"s":s,"v":v});
    return {"r":"0x"+r,"s":"0x"+s,"v":v}
    
  }

}


