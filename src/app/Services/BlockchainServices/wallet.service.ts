import { Injectable } from '@angular/core';
import Web3 from "web3";
//import WalletConnectProvider from "@walletconnect/web3-provider";
import { Subject } from 'rxjs';
const config = require("../../../app.config");
const WAValidator = require('crypto-wallet-address-validator');
const secondaryValidator = require("wallet-address-validator");

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private web3: any;
  private provider: any;
  public accountSubject: Subject<string | null> = new Subject<string | null>();
  public account: any | null = null;
  private ethereum: any;
  public networkVersion: Subject<number | null> = new Subject<number | null>();
  public chainId: number = 56;

  constructor() {
    this.browserEthereumCheck();
    this.networkVersion.subscribe((networkVersion) => {
      this.chainId = networkVersion ? networkVersion : 56;
    });
  }

  browserEthereumCheck(): boolean {
    if (window.ethereum) {
      //      this.web3 = new Web3(window.ethereum);
      this.ethereum = window.ethereum;

      this.ethereum.on('chainChanged', (chainId: any) => {
        this.networkVersion.next(parseInt(chainId, 16));
      });
      return true;
    }
    else {
      return false;
    }
  }


  accountReady(): boolean {
    if (this.account) {
      return true;
    }
    else {
      return false;
    }
  }


  requestAccount(): Promise<any> {

    if (!this.ethereum) {
      return new Promise((resolve, reject) => {
        reject(new Error("no ethereum"));
      });
    }
    return new Promise((resolve, reject) => {
      this.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          this.account = accounts[0];
          this.accountSubject.next(this.account);
          this.networkVersion.next(this.ethereum.networkVersion);
          //this.ethereum.eth.accounts.wallet.add(this.account);
          resolve(accounts[0]);
        })
        .catch((err: any) => {
          reject(new Error(err));
        });
    });
  }


  sendTransaction(transaction: any): Promise<any> {
    console.table(transaction);
    return this.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    });
  }


  metaMaskCheck(): boolean {
    if (this.browserEthereumCheck()) {
      if (window.ethereum.isMetaMask) {
        this.ethereum = window.ethereum;
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }


  async signForNFT(nft: any): Promise<any> {
    if (this.account) {
      return new Promise((resolve, reject) => {
        console.log("this.account ", this.account);
        resolve(this.executeSignature(this.account, nft));

      });
    }
    else {
      return new Promise((resolve, reject) => {
        reject(new Error("NoAccountFound"));
      });
    }
  }


  private executeSignature(account: string, nft: any): Promise<any> {
    let parameters = [account, this.prepareSignatureData(nft)];
    return this.ethereum.request({ method: "eth_signTypedData_v4", params: parameters })
      .then((result: any) => {
        if (result) {
          return result;
        }
        else {
          return new Error("no signature");
        }
      })
      .catch((err: any) => {
        return new Error("signature error");
      });

  }


  private prepareSignatureData(nft: any) {
    console.log("preparing signature ", config.network[nft.chainId]);
    let domain = config.network[nft.chainId].contracts.nft.domain;
    let data = {
      "types": {
        "EIP712Domain": [
          { "name": "name", "type": "string" },
          { "name": "version", "type": "string" },
          { "name": "verifyingContract", "type": "address" },
          { "name": "chainId", "type": "uint256" }
        ],
        "NFT": [
          { "name": "name", "type": "string" },
          { "name": "chainId", "type": "uint256" },
          { "name": "beneficiary", "type": "address" },
          { "name": "contentHash", "type": "bytes32" },
          { "name": "tokenId", "type": "uint256" }
        ]
      },
      "primaryType": "NFT",
      "domain": domain,
      "message": nft
    };
    console.log("signature data prepared ", data);
    return JSON.stringify(data);
  }


  isValidBTCaddress(address: string, network: string): boolean {
    return WAValidator.validate(address, network);
  }

  isValidAddress(address: string, network: string): boolean {
    return secondaryValidator.validate(address, network);
  }
}
