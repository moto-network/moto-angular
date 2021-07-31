import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { WalletService } from './Services/BlockchainServices/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class OnlyAccountGuard implements CanLoad {
  constructor(private _wallet: WalletService) {
    this._wallet.listenForAccount()
      .subscribe((account) => {
        if (account) {
          this.account = account;
        }
      });
  }
  account: string | null = null;
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.account ? true : false;
  }
}
