import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NftManagerService {

  constructor(private _db:AngularFirestore) { }

  getNFTs():Observable<any>{
    let results: any;
    results = this._db.collection("NFTs", (ref)=>
    ref.where("on_sale","==",true)).get();
    return results;
  }
}
