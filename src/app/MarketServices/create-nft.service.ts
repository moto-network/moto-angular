import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import {ContractsService} from '../BlockchainServices/contracts.service';

@Injectable({
  providedIn: 'root'
})
export class CreateNftService {
 
  constructor(private walletService:WalletService, 
    private contracts:ContractsService) {

   }

   createNFT(nft:any){

   }
}
