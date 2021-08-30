import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, startWith, switchMap, take } from 'rxjs/operators';
import { getProvider } from 'src/app.config';

import { Account } from 'src/declaration';
import Web3 from 'web3';
import { RemoteDataService } from '../remote-data.service';
const config = require("../../../app.config");
const WAValidator = require('crypto-wallet-address-validator');
const secondaryValidator = require("wallet-address-validator");

declare let window: any;

@Injectable({
  providedIn: 'root'
})//startWith(from(this._requestAccount()))  from(this._requestAccount());
export class WalletService {
  public addressObservable: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private _walletInterface: any;
  public networkObservable: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public AccountObservable: BehaviorSubject<Account | null> = new BehaviorSubject<Account | null>(null);
  constructor(private _remote: RemoteDataService) {

  }

  async initWallet(): Promise<boolean> {
    let interfaceStatus: boolean = await this._resolveWalletInterface();
    console.log("interface status", interfaceStatus);
    if (interfaceStatus) {
      return this._requestAccount();
    }
    return interfaceStatus;
  }

  /**
   * does not request an intefface
   * @returns observabe 
   */
  getAccount(): Observable<Account> {
    return combineLatest([this.getAddress(), this.getNetwork()])
      .pipe(filter(value => value[0] != null && value[1] != null),
        map((value) => {
          return { "address": value[0], "network": value![1] } as Account;
        }))

  }

  listenForAddress(): Observable<string | null> {
    return this.addressObservable
      .pipe(
       
        
      )
   }

  getNetwork(): Observable<number | null> {
    return this.networkObservable;
  }

  getAddress(): Observable<string | null> {
    return this.addressObservable;
  }
  
  sendTransaction(transaction: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this._walletInterface) {
        reject(new Error("No Wallet Detected."));
      }
      else {
        console.table(transaction);
        resolve(this._walletInterface.request({
          method: 'eth_sendTransaction',
          params: [transaction],
        }));
      }
    });
    
  }

  isValidBTCaddress(address: string, network: string): boolean {
    return WAValidator.validate(address, network);
  }

  isValidAddress(address: string, network: string): boolean {
    return secondaryValidator.validate(address, network);
  }

  getLoginSignature(account: Account, nonce: string): Promise<string> {
    let parameters = [account.address, this.prepSignatureData(account, nonce)];
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
  
  private _resolveWalletInterface(): Promise<boolean> {
    //do a popup later so they can decide between ethereum
    if (window.ethereum) {
      this._initWalletInterface(window.ethereum);
      return Promise.resolve(true);
    }
    else {
      return Promise.resolve(false);
    }
  }

  private _initWalletInterface(walletInterface: any) {
    this._walletInterface = walletInterface;//typify this.
    this._walletInterface.on('chainChanged', (chainId: any) => {
      console.log("network id ", parseInt(chainId, 16));
      this.networkObservable.next(parseInt(chainId, 16));
    });
    this._walletInterface.on('accountsChanged', (accounts: string[]) => {
      const web3 = new Web3(getProvider(parseInt(this._walletInterface.chainId, 16)));

      console.log("accoount", accounts[0]);
      this.addressObservable.next(web3.utils.toChecksumAddress(accounts[0]))
    });
  }

  private _requestAccount(): Promise<boolean> {
    console.log("requestying ");
    if (!this._walletInterface) {
      return Promise.reject(new Error("no interface"));
    }
    return this._walletInterface.request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => {
        const web3 = new Web3(getProvider(parseInt(this._walletInterface.chainId, 16)));
        console.log('getting accocunt ', web3.utils.toChecksumAddress(accounts[0]));
        this.networkObservable.next(parseInt(this._walletInterface.chainId, 16));
        

        this.addressObservable.next(web3.utils.toChecksumAddress(accounts[0]))
        return true;
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  private prepSignatureData(account: Account, nonce: string) {
    let userMessage = `We will sign you in using the account info below. The nonce below represents random data\
    that can be signed to uniquely identify you.`;
    let data = {
      "domain": {
        name: "Moto Network",
        version: "3",
        chainId: account.network
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
      "message": {info:userMessage, account: account.address, nonce: nonce, chainId: account.network }
    };
    console.log("signature data prepared ", data);
    return JSON.stringify(data);
  }
}
