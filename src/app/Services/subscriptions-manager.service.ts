import { NullTemplateVisitor } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Account, Subscription, Tier } from 'src/declaration';
import { ContractsService } from './BlockchainServices/contracts.service';
import { RemoteDataService } from './remote-data.service';
import { TransactionsService } from './transactions.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsManagerService {
  tiers: Tier[] | null = null;
  tier: Tier | null = null;
  constructor(private _contracts: ContractsService,
    private _remote: RemoteDataService, private _transactions:TransactionsService) {
    this.tiers = this.testTiers;
  }
  testTiers: Tier[] = [{
    valid: true,
    name:"sodomy +",
    creator: "you",
    network: 3,
    desc:"painless",
    price: "433",
    commission: "322"
  },
    {
      valid: true,
      name:"sodomy",
      creator: "you",
      network: 3,
      desc:"painful",
      price: "233",
      commission: "332"
    }
  ];

  updateTier(modifiedTier:Tier, originalTier?:Tier) :Promise<boolean>{
    return new Promise((resolve, reject) => {
      if (originalTier?.name != modifiedTier.name || originalTier?.desc != modifiedTier.desc) {
        resolve(this.updateDB(modifiedTier));
      }
      else {
        this._transactions.pendingTransaction(this.updateChain(modifiedTier), modifiedTier.network)
          .then((status) => {
            return status ? this.updateDB(modifiedTier): Promise.reject(new Error("tier update error."));
          })
          .catch((err) => {
            reject(err);
          })
      }
    });
  }

  private updateDB(data: Tier | Subscription):Promise<boolean> {
    return Promise.resolve(true);
  }

  private updateChain(data: Tier | Subscription) :Promise<string>{
    if ("tier" in data) {
      return this._contracts.updateSubscription(data);
    }
    else {
      return this._contracts.updateTier(data);
    }
  }

  getTiers(account?: Account): Promise<Tier[]>{
    return Promise.resolve(this.tiers!);
  }

  setTier(tier: Tier) {
    this.tier = tier;
  }

  getTier(): Promise<Tier | null> {
    return Promise.resolve(this.tier);
  }


  getSubscriptions(account: Account) { }

  invalidateTier(tier: Tier) { }

  subscribe(tier: Tier, account: Account, amount:string) { }
}
