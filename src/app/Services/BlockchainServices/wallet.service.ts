import { Injectable } from '@angular/core';
import Web3 from "web3";
//import WalletConnectProvider from "@walletconnect/web3-provider";
import { Subject } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';
import { resolve } from 'node:path';
import { rejects } from 'node:assert';
import { instanceOf } from 'prop-types';
import { access } from 'node:fs';
import { AccountComponent } from 'src/app/account/account.component';
const WAValidator = require('crypto-wallet-address-validator');
  
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private web3: any;
  private provider: any;
  public accountSubject: Subject<string | null > = new Subject<string | null >();
  public account:any | null = null;
  private ethereum: any;

  constructor() {
    this.browserEthereumCheck()

  }

  browserEthereumCheck():boolean{
    if(window.ethereum){
//      this.web3 = new Web3(window.ethereum);
      this.ethereum = window.ethereum;
      return true;
    }
    else{
      return false;
    }
  }

  
  accountReady():boolean{
    if(this.account){
      return true;
    }
    else{
      return false;
    }
  }


  requestAccount():void {
    if(!this.ethereum){

    }

    else{
      this.ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts:string[])=>{
        this.account = accounts[0];
        this.accountSubject.next(this.account);
        this.ethereum.eth.accounts.wallet.add(this.account);
      })
      .catch((err:any)=>{
        return new Promise((resolve,reject)=>{
          
        });
      });
    }
  }


  sendTransaction(transaction:any):Promise<any>{
    console.table(transaction);
    return this.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    });
  }


  metaMaskCheck():boolean{
    if(this.browserEthereumCheck()){
      if(window.ethereum.isMetaMask){
        this.ethereum = window.ethereum;
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }


  async signForNFT(nft:any):Promise<any>{
    if(this.account){
      return new Promise((resolve,reject)=>{
        console.log("this.account ",this.account);
        resolve(this.executeSignature(this.account,nft));
      });
    }
    else{
      return new Promise((resolve,reject)=>{
        reject(new Error("tseting"));
      });
    }
  }


  private executeSignature(account:string,nft:any):Promise<any>{
    let parameters = [account,this.prepareSignatureData(nft)];
    return this.ethereum.request({method:"eth_signTypedData_v4",params:parameters})
    .then((result:any)=>{
      if(result){
        return result;
      }
      else{
        return new Error("no signature");
      }
    })
    .catch((err:any)=>{
      return new Error("signature error");
    });
  
  }


  prepareSignatureData(nft:any){
    let data = {
      "types": {
        "EIP712Domain": [
          { "name": "name", "type": "string" },
          { "name": "version", "type": "string" },
          { "name": "verifyingContract", "type": "address" },
          { "name": "chainId", "type": "uint256" }
        ],
        "NFT":  [
          { "name": "name", "type": "string" },
          { "name": "chainId", "type": "uint256" },
          {"name":"beneficiary","type":"address"},
          {"name":"contentHash","type":"bytes32"},
          {"name":"tokenId","type":"uint256"}
        ]
      },
      "primaryType": "NFT",
      "domain": {
        "name": "Moto Network NFT",
        "version":"1",
        "verifyingContract":"0x7D1d26e8FC29C84aF88C71744178A0f314394173",
        "chainId":97,
      },
      "message": nft
    };
    return JSON.stringify(data);
  }


  isValidAddress(address:string, network:string):boolean{ 
    return WAValidator.validate(address, network);
  }

}
