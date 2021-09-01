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
import { WalletService } from './BlockchainServices/wallet.service';
import { faFlushed } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private _db: AngularFirestore, private _wallet: WalletService) {
  }

  getTransactions(uid: string): Observable<any> {
    let results: any;
    results = this._db.collection("Transactions", (ref) =>
      ref.where("owner", "==", uid)).get();
    return results;
  }

  public async pendingTransaction(transaction: Promise<string>, network: number): Promise<TransactionReceipt> {
    return transaction
      .then((hash: string) => { return hash ? hash : Promise.reject(new Error("no hash.")) })
      .then((hash: string) => {
        return this._startBackgroundCheck(hash, network);
      })
  }

  private _startBackgroundCheck(hash: string, network: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const receipt = await this._wallet.getTransactionReceipt(hash, network);
          if (receipt && receipt.status) {
            clearInterval(interval);
            resolve(receipt);
          }
        }
        catch (err) {
          reject(err);
        }
      }, 1000);

    });
  }

}
