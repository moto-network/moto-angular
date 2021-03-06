
import { Injectable } from '@angular/core';
import { Account, Subscription, Tier } from 'src/declaration';
import { ContractsService } from './BlockchainServices/contracts.service';
import { RemoteDataService } from './remote-data.service';
import { TransactionsService } from './transactions.service';
import Web3 from 'web3';
import {  getProvider } from 'src/app.config';
import BigNumber from 'bignumber.js';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionsManagerService {
  tiers: Record<string,Tier> | null = null;
  tier: Tier | null = null;
  constructor(private _contracts: ContractsService,
    private _remote: RemoteDataService, private _transactions:TransactionsService) {

  }
  

  updateTier(modifiedTier: Tier, originalTier?: Tier | null | undefined): Promise<boolean>{

    return new Promise((resolve, reject) => {
      if (typeof originalTier != 'undefined') {
        if (originalTier?.name != modifiedTier.name || originalTier?.desc != modifiedTier.desc) {

          resolve(this.updateTierDB(modifiedTier));
        }
      }
      else {

        this._transactions.pendingTransaction(this.updateContract(modifiedTier), modifiedTier.network)
          .then((transactionReceipt) => {
            const dbTier = modifiedTier;
            dbTier.id = this.createTierId(dbTier.owner, dbTier.price);
            transactionReceipt.status ? resolve(this.updateTierDB(dbTier)): reject(new Error("tier update error."));
          })
          .catch((err) => {
            reject(err);
          })
      }
    });
  }

  private createTierId(address:string, price:string) :string{
    const web3 = new Web3(getProvider(97));
    const priceBN = new BigNumber(price);
    return web3.utils.soliditySha3(address, priceBN.toString())!;
  }

 

  getTiers(account: Account): Promise<Record<string, Tier> | null>{
    return this._remote.getTiers(account);
  }

  setTier(tier: Tier) {
    this.tier = tier;
  }

  getTier(): Promise<Tier | null> {
    return Promise.resolve(this.tier);
  }

  getSubscriptions(account: Account) { }

  cancelTier(tier: Tier) { }

  subscribe(tier: Tier, account: Account, amount: string) { }
  
  private updateTierDB(tier: Tier): Promise<boolean> {
    return this._remote.updateTierDB(tier);
  }

  private updateContract(data: Tier): Promise<string> {
    console.log("updating contract");
    return this._contracts.createTier(data);
  }

}
