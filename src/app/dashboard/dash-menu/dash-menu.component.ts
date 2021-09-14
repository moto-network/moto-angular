import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { SubscriptionsManagerService } from 'src/app/Services/subscriptions-manager.service';
import { Account, Tier } from 'src/declaration';

@Component({
  selector: 'app-dash-menu',
  templateUrl: './dash-menu.component.html',
  styleUrls: ['./dash-menu.component.css']
})
export class DashMenuComponent implements OnInit {
  account: Account | null = null;
  tiers: Record<string,Tier> | null = null;
  constructor(private _router: Router,
    private _subscriptions: SubscriptionsManagerService,
  private _wallet:WalletService) { }

  ngOnInit(): void {
  }

  createNFT() {
    this._router.navigate(['dashboard', 'create-nft']);
  }

  createTiers() {
    this._router.navigate(['dashboard', 'create-tiers']);
  }

  exchangeCoins() {
    this._router.navigate(['dashboard', 'exchange']);
  }

  private _getActiveTiers(account: Account) :Promise<Record<string, Tier> | null>{
    return this._subscriptions.getTiers(account);
  }
}
