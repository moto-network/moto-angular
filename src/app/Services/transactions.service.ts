import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getProvider } from 'src/app.config';
import { NFT } from 'src/declaration';
import Web3 from "web3";
@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private _db:AngularFirestore) { 

  }

  getTransactions(uid:string):Observable<any>{
    let results: any;
    results = this._db.collection("Transactions", (ref)=>
    ref.where("owner","==",uid)).get();
    return results;
  }

  verifyTransactionHash(nft:NFT , hash: string) :Promise<boolean>{
    const web3 = new Web3(getProvider(nft.chainId));
    return web3.eth.getTransaction(hash)
      .then((transaction: any) => {
        if (transaction.blockHash) {

          return true;
        }
        else {
          return false;
        }
       })
  }
}
