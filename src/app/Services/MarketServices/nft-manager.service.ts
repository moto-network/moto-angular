import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import {ContractsService} from '../BlockchainServices/contracts.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { sign } from 'crypto';
import { CryptoService } from '../crypto.service';

@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called

  currentFee:number | null = null;
  nftsArray:any = [];
  nftProduct:any  | null;
  lastSuccessfulTransaction = "";

  constructor(private walletService:WalletService, 
    private contracts:ContractsService, private _db:AngularFirestore, 
    crypto:CryptoService) {
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


   createNFT(nft:any):Promise<any>{
    
    return new Promise((resolve,reject)=>{
      if(this.validNFT(nft)){
        let signaturePromise:Promise<any>;
        signaturePromise = this.walletService.signForNFT(nft);
        signaturePromise
        .then((signature:string)=>{
          this.contracts.mintNFT(nft,signature)
          .then((transactionHash)=>{
            this.lastSuccessfulTransaction = transactionHash;
            resolve(this.lastSuccessfulTransaction);
          })
          .catch((err)=>{
            reject(new Error("ContractError"));
          });
              
        })
        .catch((err)=>{//signaturePromise catch
         reject(new Error("NoAccountFound"));
        });
      }
    });
    
   }


   validNFT(nft:any){
    return true;//change this to false
   }

   /*uploadNFT(nft,file){

   }
*/

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
