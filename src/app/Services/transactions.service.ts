import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
}
