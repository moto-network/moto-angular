import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { NFT } from 'src/declaration';
import { WalletService } from './Services/BlockchainServices/wallet.service';
import { NFTManagerService } from './Services/nft-manager.service';

@Injectable({
  providedIn: 'root'
})
export class OnlyOwnerGuard implements CanActivateChild {
  constructor(private _wallet: WalletService,private  _nftManager: NFTManagerService) {
    this._wallet.listenForAccount().subscribe((account:string | null) => {
      if (account) {
        this.account = account;
      }
    });
    this._nftManager.getNFT()
      .subscribe((nft) => {
        if (nft) {
          this.nft = nft;
        }
      });
  }
  account: string | null = null;
  nft: NFT | null = null;
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean>((resolve, reject) => {
      if (this.nft && this.account) {
        this._nftManager.getOwner(this.nft)
          .then((owner) => {
            if (owner) {
              resolve(owner.toUpperCase() == this.account?.toUpperCase())
            }
            else {
              resolve(false);
            }
          });
      }
      else {
        resolve(false);
      }
    });
    
    

  }
  
}
