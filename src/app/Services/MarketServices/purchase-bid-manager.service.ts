import { BindingScope } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletService } from '../BlockchainServices/wallet.service';
import { ProductVerifierService } from './product-verifier.service';


@Injectable({
  providedIn: 'root'
})
export class PurchaseBidManagerService {

  
  constructor(private walletService:WalletService, private verifier:ProductVerifierService) { }
/*
  buyNFT(nft:any):Observable<any> | null{
    if(verifyNFT(nft)){

    }
    else{
      return null;
    }
  }

  verifyNFT(nft:any){
    return this.verifier.verifyNFT(nft);
  }
  */
}
