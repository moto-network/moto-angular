import { Injectable } from '@angular/core';
import Web3 from "web3";
//import WalletConnectProvider from "@walletconnect/web3-provider";
import { Subject } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';
const WAValidator = require('crypto-wallet-address-validator');
  
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private web3: any;
  private provider: any;
  public accountSubject: Subject<string | null> = new Subject<string | null>();
  public account:any | null = null;
  private ethereum: any;

  constructor() {
  }

  browserEthereumCheck():boolean{
    if(window.ethereum){
      this.web3 = new Web3(window.ethereum);
      return true;
    }
    else{
      return false;
    }
  }


  requestAccount():boolean{
    if(this.metaMaskCheck()){

      this.ethereum.request({ method: 'eth_requestAccounts' })
      .then((accountsArray:string[])=>{
        if(accountsArray){
          this.account = accountsArray[0];
          this.accountSubject.next(accountsArray[0]);
        }
      });

      return true;
    }  
    else{
      return false;
    }
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


  signForNFT(nft:any):any{
    let parameters = [this.account,this.prepareSignatureData(nft)]
    if(this.ethereum){
      this.web3.currentProvider.sendAsync(
        {
          method:"eth_signTypedData_v4",
          params:parameters,
          from:this.account
        })
        .then((result:any)=>{
          if(result){
            console.log("signature result ",result);
          }
        })
        .catch((err:any)=>{
          console.log("signature eorror" ,err);
        });
    }
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
