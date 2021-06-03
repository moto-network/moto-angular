import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import {ContractsService} from '../BlockchainServices/contracts.service';

@Injectable({
  providedIn: 'root'
})
export class ManageNFTService {//merge this wit the other NFTManager or wahtever it's called

  currentFee:number | null = null;

  constructor(private walletService:WalletService, 
    private contracts:ContractsService) {
//     this.initializeNFTFee();
   }

   
   initializeNFTFee():void{
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
}
