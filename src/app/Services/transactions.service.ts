import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { BehaviorSubject, Observable } from 'rxjs';
import { getProvider } from 'src/app.config';
import { NFT, TransactionReceipt } from 'src/declaration';
import Web3 from "web3";
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  pendingNFTs: any = {};
  file: File | null = null;
  nft: NFT | null = null;
  interval: any | null = null;
  constructor(private _db: AngularFirestore, private _profile:ProfileService) {

  }

  getTransactions(uid: string): Observable<any> {
    let results: any;
    results = this._db.collection("Transactions", (ref) =>
      ref.where("owner", "==", uid)).get();
    return results;
  }

  async getTransactionStatus(nft: NFT, transactionHash: string): Promise<boolean> {
    const receipt: TransactionReceipt = await this.getTransactionReceipt(nft, transactionHash);
    console.log("Receipt i s", receipt);
    return Promise.resolve(true);
  }

  setFile(file: File) {
    this.file = file;
  }


  async waitForTransaction(nft: NFT, file:File, hash:string) {
    this.setFile(file);
    this.nft = nft;
    const receipt = await this.getTransactionReceipt(nft, hash);
    this.setWait(nft, receipt);
  }

  private async getTransactionReceipt(nft: NFT, hash: string): Promise<TransactionReceipt>{
    console.log("getTransactionnReceipt Calledd");
    const web3 = await new Web3(getProvider(nft.chainId));
    console.log('hash is ', hash);
    web3.eth.getTransactionReceipt(hash)
      .then((receipt) => {
        console.log("transaction receipt getter");
        console.log(receipt);
      });
    return await web3.eth.getTransactionReceipt(hash);
  }

  private setWait(nft: NFT, receipt: any) {
    this.pendingNFTs[receipt.transactionHash] = nft;
    console.log("gonna check transaction status in the background");
    clearInterval(this.interval);
    const transactions = Object.keys(this.pendingNFTs);
    this.interval = setInterval(async () => {
      for (let pending in transactions) {
        const nft = this.pendingNFTs[pending];
        let receipt:TransactionReceipt = await this.getTransactionReceipt(nft, pending) as TransactionReceipt;
        if (receipt.status) {
          const confirmed = receipt as Required<TransactionReceipt>;
          this.confirmTransaction(confirmed);
        }
        else {
          console.log("background transaction checking..");
        }
      }
      
    }, 30 * 1000);
  }

  confirmTransaction(receipt: Required<TransactionReceipt>) {
    const nft = this.pendingNFTs[receipt.transactionHash];
    this._profile.notifyAboutTransaction(nft, receipt);
    delete this.pendingNFTs[receipt.transactionHash]; 
  }
}
