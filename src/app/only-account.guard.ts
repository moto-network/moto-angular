import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/declaration';

import { WalletService } from './Services/BlockchainServices/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class OnlyAccountGuard implements CanLoad {
  constructor(private _wallet: WalletService, private _router:Router) {
    this._wallet.getAccount()
      .subscribe((account) => {
        if (account) {
          this.account = account;
        }
      });
  }
  account: Account | null = null;
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.account) {
      return true;
    } else {
      this._router.navigate(['login']);
      return  false;
    }
  }
}
