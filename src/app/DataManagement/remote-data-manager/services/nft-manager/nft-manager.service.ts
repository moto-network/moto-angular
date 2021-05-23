import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NftManagerService {

  constructor(private _db:AngularFirestore) { }

  nftsArray:any = [];
  nftProduct:any


  getNFTProduct(){
    if(this.nftProduct){
      return this.nftProduct;
    }
  }
  

  setNFTProduct(nft:any){
    this.nftProduct = nft;
    console.log("nftproduct set",this.nftProduct);
  }


  getNFTs():Observable<any>{
    console.trace();
    console.log('remote called ');
    let results: Observable<any>;
    let remoteResults:any[]=[];
    let nftsRef:AngularFirestoreCollection = this._db.collection("NFTs",
    ref=> ref.where("on_sale","==",true));
    return nftsRef.valueChanges();
  }


}
