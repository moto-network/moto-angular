import { Injectable } from '@angular/core';
import { ContractsService } from '../BlockchainServices/contracts.service';
import { WalletService } from '../BlockchainServices/wallet.service';
import { NFTManagerService } from './nft-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AddToMarketService {

  constructor(private _contracts: ContractsService,
    private _nftManager: NFTManagerService, _wallet: WalletService) { }

  

  /**
   * 
   * @param {number} amount amount in human readable form 
   * @return {string} some amount in hex form probably
   */
  private convertConcurrency(amount: number): string {
    return "";
  }
}
