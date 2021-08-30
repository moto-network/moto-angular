import { Injectable } from '@angular/core';
import { Account, Tier } from 'src/declaration';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsManagerService {

  constructor() { }
  testTiers: Tier[] = [{
    valid: true,
    creator: "you",
    network: 3,
    priceInBaseUnits: "233",
    commissionInBaseUnits: "asdf"
  }];

  getActiveTiers(account: Account) :Promise<Tier[]>{
    return Promise.resolve(this.testTiers);
  }

  getActiveSubscriptions(account: Account) { }

  invalidateTier(tier: Tier) { }

  subscribe(tier: Tier, account: Account, amount:string) { }
}
