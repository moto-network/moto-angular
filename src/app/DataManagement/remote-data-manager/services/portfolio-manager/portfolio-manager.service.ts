import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

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
