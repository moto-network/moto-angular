import { Injectable } from '@angular/core';
import { LocalSession, SessionData } from 'src/declaration';
import { MarketService } from './market.service';
import { NFTManagerService } from './nft-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  constructor(private _market: MarketService, private _nftManager:NFTManagerService) {
    sessionStorage.clear();
    this._market.watchForListing.subscribe(() => {
      sessionStorage.clear();
      this._nftManager.clearCollection();
    });
  }

  set(name: string, value: any): void {
    sessionStorage.setItem(name, JSON.stringify(value));
  }

  get(name: string): any {
    let sessionData: string | null = sessionStorage.getItem(name);
    return sessionData ? JSON.parse(sessionData) : sessionData;
  }

  clear(name: string) {
    sessionStorage.removeItem(name);
  }

  clearAll(): void {
    sessionStorage.clear();
    this._nftManager.clearCollection();
  }
}
