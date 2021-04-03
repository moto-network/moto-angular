import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioManagerService {
  user: any;
  uid:string="";
  
  constructor(private _db:AngularFirestore) { 
   
  }

  getPortfolio(uid_value:string):Observable<any>{
    let results: any;
    results = this._db.collection("Portfolios", (ref)=>
    ref.where("owner","==",uid_value)).get();
    return results;
  }

}
