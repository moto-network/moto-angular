import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { SubscriptionsManagerService } from 'src/app/Services/subscriptions-manager.service';
import { Account, Tier } from 'src/declaration';

@Component({
  selector: 'app-create-tiers',
  templateUrl: './create-tiers.component.html',
  styleUrls: ['./create-tiers.component.css']
})
export class CreateTiersComponent implements OnInit {
  account: Account | null = null;
  constructor(private _subscriptionManager: SubscriptionsManagerService,
    private _wallet: WalletService) { }

  ngOnInit(): void {
    this._wallet.getAccount()
      .subscribe((account) => {
        if (account) {
          this.account = account;
          this._getActiveTiers(account);
        }
      });
  }

  createTier() { }

  changeActiveTier(tier:Tier) { }

  invalidateTier(tier: Tier) { }

  private _getActiveTiers(account:Account) {
    //talk to sub manager
  }



  
}
