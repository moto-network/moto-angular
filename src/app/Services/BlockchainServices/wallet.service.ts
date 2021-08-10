import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
const config = require("../../../app.config");
const WAValidator = require('crypto-wallet-address-validator');
const secondaryValidator = require("wallet-address-validator");

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  public accountObservable: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public account: any | null = null;
  private _walletInterface: any;
  public networkObservable: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public chainId: number | null = null;

  constructor() {
  }

  initWallet(): Observable<string | null> {
    this._getWalletInterface();
    return this.accountObservable;
  }

  hasBrowserProvider(): boolean {
    return (window.ethereum) ? true : false;
  }

  /**
   * if no account sends a request to an inteface to get an account
   * @returns observabe
   */
  getAccount(): Observable<string | null> {
    if (!this.account) {
      this.initWallet();
    }
    return this.accountObservable;
  }

  /**
   * does not request an intefface
   * @returns observabe 
   */
  listenForAccount(): Observable<string | null> {
    return this.accountObservable;
  }

  getNetwork(): Observable<number | null> {
    return this.networkObservable;
  }

  sendTransaction(transaction: any): Promise<any> {
    console.table(transaction);

    return this._walletInterface.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    });
  }

  convertToDecimalPrice(amount: string, currency: string) {
    //to do
  }

  isValidBTCaddress(address: string, network: string): boolean {
    return WAValidator.validate(address, network);
  }

  isValidAddress(address: string, network: string): boolean {
    return secondaryValidator.validate(address, network);
  }

  private _getWalletInterface() {
    //do a popup later so they can decide between ethereum
    if (window.ethereum) {
      this._walletInterface = window.ethereum;//typify this.
      this._requestAccount();
      this._walletInterface.on('chainChanged', (chainId: any) => {
        console.log("network id ", parseInt(chainId, 16));
        this.networkObservable.next(parseInt(chainId, 16));
      });
    }
  }

  private _requestAccount(): void {
    this._walletInterface.request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => {
        this.account = accounts[0];
        console.log("account observable is about to send ", this.account);
        this.accountObservable.next(this.account);
        this.chainId = this._walletInterface.networkVersion;
        this.networkObservable.next(this._walletInterface.networkVersion);
      })
      .catch((err: any) => {
        console.log("WalletService:_requestionBrowserAccount", err);
      });
  }

  getLoginSignature(account: string, nonce: string, chainId: number): Promise<string> {
    let parameters = [account, this.prepSignatureData(account, nonce, chainId)];
    return this._walletInterface.request({ method: "eth_signTypedData_v4", params: parameters })
      .then((result: any) => {
        if (result) {
          console.log("signature is ", result);
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

  private prepSignatureData(userAccount: string, nonce: string, chainId: number) {

    let data = {
      "domain": {
        name: "Moto Network",
        version: "3",
        chainId: chainId
      },
      "types": {
        "EIP712Domain": [
          { "name": "name", "type": "string" },
          { "name": "version", "type": "string" },
          { "name": "chainId", "type": "uint256" }
        ],
        "Identity": [
          { "name": "account", "type": "string" },
          { "name": "nonce", "type": "string" },
          { "name": "chainId", "type": "uint256" }
        ]
      },
      "primaryType": "Identity",
      "message": { account: userAccount, nonce: nonce, chainId: chainId }
    };
    console.log("signature data prepared ", data);
    return JSON.stringify(data);
  }
}
