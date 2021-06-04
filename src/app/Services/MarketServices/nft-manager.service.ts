import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import {ContractsService} from '../BlockchainServices/contracts.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called

  currentFee:number | null = null;
  nftsArray:any = [];
  nftProduct:any  | null;

  constructor(private walletService:WalletService, 
    private contracts:ContractsService, private _db:AngularFirestore) {
//     this.initializeNFTFee();
   }

   
   initializeNFTcreationFee():void{
    this.contracts.getNFTFee()
    .then((fee:any)=>{
      if(fee){
        this.currentFee = fee;
      }
    })
   }


   createNFT(nft:any){
     if(this.validNFT(nft)){
       const signature = this.walletService.signForNFT(nft);
       console.log("ths is the signature ",signature);
//         this.contracts.mintNFT(nft,signature);
     }
     else{
       //do something
     }
   }
   validNFT(nft:any){
    return true;//change this to false
   }


   getNFTProductForView(){
    return this.nftProduct;
  }
  

  setNFTProductForView(nft:any){
    this.nftProduct = nft;
    console.log("nftproduct set",this.nftProduct);
  }


  getMarketplaceNFTs():Observable<any>{
    console.trace();
    console.log('remote called ');
    let results: Observable<any>;
    let remoteResults:any[]=[];
    let nftsRef:AngularFirestoreCollection = this._db.collection("NFTs",
    ref=> ref.where("on_sale","==",true));
    return nftsRef.valueChanges();
  }
}
