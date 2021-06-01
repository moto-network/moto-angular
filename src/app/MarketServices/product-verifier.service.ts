import { Injectable } from '@angular/core';
enum ValidNetworks{
  "BSC",
  "ETH"
}
@Injectable({
  providedIn: 'root'
})
export class ProductVerifierService {
  //calll web3services
  constructor() { 

  }

  verifyNFT(nft:any):boolean{
    if(!Object.values(ValidNetworks).includes(nft.network)){
      return false;
    }
    else if(nft.price){}
    return false;
  }


  private validFile(url:string){
    //
  }
  private fileExists(url:string){

  }

}
