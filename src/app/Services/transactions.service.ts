import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NFTManagerService } from 'moto-angular/src/app/Services/nft-manager.service';

import { Observable, Subject } from 'rxjs';
import { getProvider } from 'src/app.config';
import { NFT, TransactionReceipt } from 'src/declaration';
import Web3 from "web3";
import { ProfileService } from './profile.service';

interface UnconfirmedTransaction {
  hash: string;
  nft: NFT;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  unconfirmedTransactions: UnconfirmedTransaction[] = [];
  pendingReceipts: any = {};
  pendingNFTs: any = {};
  file: File | null = null;
  nft: NFT | null = null;
  interval: any | null = null;
  constructor(private _db: AngularFirestore, private _profile: ProfileService, private _nftManager: NFTManagerService) {

  }

  getTransactions(uid: string): Observable<any> {
    let results: any;
    results = this._db.collection("Transactions", (ref) =>
      ref.where("owner", "==", uid)).get();
    return results;
  }

  async getTransactionStatus(nft: NFT, transactionHash: string, file: File): Promise<boolean> {
    const transactionSubject = new Subject();
    return new Promise((resolve, reject) => {
      this.getTransactionReceipt(nft, transactionHash)
        .then((receipt: TransactionReceipt | null) => {
          if (receipt) {
            resolve(receipt.status);
          }
          else {
            this.waitForUnconfirmed(nft, transactionHash, file);
          }
        })
        .catch((err) => {
          reject(err);
        })
    });
  }



  waitForUnconfirmed(nft: NFT, hash: any, file: File) {
    this.storeUnconfirmed(nft, hash, file);
    console.log("gonna check transaction status in the background");
    this.updateUnconfirmed();
  }

  private updateUnconfirmed(unconfirmed?: UnconfirmedTransaction) {
    clearInterval(this.interval);
    if (unconfirmed) {
      const index = this.unconfirmedTransactions.indexOf(unconfirmed);
      if (index > -1) {
        this.unconfirmedTransactions.splice(index, 1);
      }
    }
    setInterval(async () => {

      this.unconfirmedTransactions.forEach(async (unconfirmed) => {
        let receipt: TransactionReceipt = await this.getTransactionReceipt(unconfirmed.nft, unconfirmed.hash) as TransactionReceipt;
        if (receipt.status) {
          this._profile.openSnackBar("Transaction Receipt Received.")
          this.confirmTransaction(unconfirmed);
          clearInterval(this.interval);
        }
        else {
          console.log("background transaction checking..");
        }
      });
    }

      , 3 * 1000);
  }

  private storeUnconfirmed(nft: NFT, hash: string, file: File) {
    this.unconfirmedTransactions.push({ "nft": nft, "file": file, "hash": hash } as UnconfirmedTransaction);
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

  private confirmTransaction(unconfirmed: UnconfirmedTransaction) {
    const index = this.unconfirmedTransactions.indexOf(unconfirmed);

    const nft = this.unconfirmedTransactions[index].nft;
    const file = this.unconfirmedTransactions[index].file
    this._profile.notifyAboutTransaction(nft);
    const uploadSub = this._nftManager.uploadNFT(nft, file).subscribe((status) => {
      if (status) {
        this.updateUnconfirmed(unconfirmed);
        this._profile.openSnackBar("File uploaded.", 3000, false);
        uploadSub.unsubscribe();
      }
    })

  }
}
