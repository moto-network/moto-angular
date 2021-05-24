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
  private web3js: any;
  private provider: any;
  public account: Subject<string | null> = new Subject<string | null>();
  private ethereum: any;

  constructor() {
  }

  browserEthereumCheck():boolean{
    if(typeof window.ethereum !== "undefined"){
      return true;
    }
    else{
      return false;
    }
  }


  requestAccount():boolean{
    if(this.metaMaskCheck()){

      this.ethereum.request({ method: 'eth_requestAccounts' }).then((accountsArray:string[])=>{
        this.account.next(accountsArray[0]);
        console.log("account is ",this.account);
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

  isValidAddress(address:string, network:string):boolean{ 
    return WAValidator.validate(address, network);
  }

}
