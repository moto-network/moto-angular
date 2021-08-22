import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NFTManagerService } from './nft-manager.service';

import { BehaviorSubject, from, merge, Observable, Subject } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';
import { getProvider } from 'src/app.config';
import { NFT, TransactionReceipt } from 'src/declaration';
import Web3 from "web3";
import { ProfileService } from './profile.service';

interface UnconfirmedTransaction {
  hash: string;
  nft: NFT;
  file?: File;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  file: File | null = null;
  nft: NFT | null = null;
  unconfirmed: UnconfirmedTransaction | null = null;
  constructor(private _db: AngularFirestore, private _profile: ProfileService, private _nftManager: NFTManagerService) {

  }

  getTransactions(uid: string): Observable<any> {
    let results: any;
    results = this._db.collection("Transactions", (ref) =>
      ref.where("owner", "==", uid)).get();
    return results;
  }

  public waitForUnconfirmed(nft: NFT, transactionHash: string): Promise<boolean> {
    this.unconfirmed = { "nft": nft, "hash": transactionHash };
    const promise = new Promise<boolean>((resolve, reject) => {

      this.getTransactionReceipt(nft, transactionHash)
        .then((receipt: TransactionReceipt | null) => {
          if (receipt) {
            resolve(receipt.status);
          }
          else {
            resolve(this.startBackgroundCheck(nft, transactionHash));
          }
        })
        .catch((err) => {
          reject(err);
        })
    });
    return promise;
  }

  private startBackgroundCheck(nft: NFT, hash: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      var status: boolean = false;
      while (this.unconfirmed) {

        try {
          const receipt = await this.getTransactionReceipt(nft, hash);
          if (receipt) {
            this.unconfirmed = null;
            resolve(receipt.status);
          }
        }
        catch (err) {
          reject(err);
        }
      }
    });
  }

  private async getTransactionReceipt(nft: NFT, hash: string): Promise<TransactionReceipt | null> {
    const web3 = await new Web3(getProvider(nft.chainId));
    return web3.eth.getTransactionReceipt(hash)
      .then((receipt) => {
        if (receipt) {
          console.log("receipt ", receipt);
          return receipt as TransactionReceipt;
        }
        else {
          return null;
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

}
