import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FileNFT, Listing, NFT, NFTCollection } from 'src/declaration';

import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { MarketService } from '../Services/market.service';
import { NFTManagerService } from '../Services/nft-manager.service';
import { ProfileService } from '../Services/profile.service';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrls: ['./user-dash.component.css']
})
export class UserDashComponent implements OnInit, OnDestroy {
  nft: FileNFT | null = null;
  listing: Listing | null = null;
  listingSub: Subscription | null = null;
  nftSub: Subscription | null = null;
  nftCollection: NFTCollection = {};
  nftCollectionSub: Subscription | null = null;
  account: string | null = null;
  accountSub: Subscription | null = null;
  motoBalance: string = "";
  motoNFTBalance: string = "";
  constructor(private _profile: ProfileService, private _market: MarketService,
    private _nftManager: NFTManagerService, private _wallet: WalletService,
    public snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.getLatestListing();
    this.getAccount();
    this.getBalances();
  }

getBalances():void{
  this._market.getCoinBalance()
    .then((balance) => {
      this.motoBalance = balance;
    })
    .catch((err) => {
      this.openSnackBar(err.message);
    });
  this._market.getNFTBalance()
    .then((balance) => {
      this.motoNFTBalance = balance;
    })
    .catch((err) => {
      this.openSnackBar(err.message);
    });
}

  getLatestListing() {
    this.listingSub = this._market.getListing()
      .subscribe((listing) => {
        if (listing) {
          this.listing = listing;
          this.nftSub = this._nftManager.getNFT("tokenId", listing.tokenId)
            .subscribe((nft) => {
              if (nft) {
                this.nft = nft;
              }
            });
        }
      })
  }

  getAccount(): void {
    this.accountSub = this._wallet.listenForAccount()
      .subscribe((account) => {
        if (account) {
          this.account;
          this.nftCollectionSub = this._nftManager.getNFTs("owner", account)
            .subscribe((collection: NFTCollection | null) => {
              if (collection) {
                this.nftCollection = collection;
              }
            });

        }
      });
  }

  ngOnDestroy(): void {
    this.listingSub?.unsubscribe();
    this.nftSub?.unsubscribe();
  }

  getFormattedPrice(price: string | undefined): string {
    if (price) {
      return this._market.formatCurrency(price);
    }
    else {
      return "";
    }
  }

  openSnackBar(message: string, duration: number = 3000) {
    this.snackBar.open(message, "", {
      duration: duration,
      panelClass: ['snackbar']
    });
  }

  numberWithSpaces(bigNum: string) {

    const value = this.getFormattedPrice(bigNum);
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  shortenPrice(valueString: string | undefined): string {
    const formattedPrice: string = this.getFormattedPrice(valueString);
    const value: number = parseFloat((formattedPrice ? formattedPrice : "0"));
    const NumberSuffix = require('number-suffix');

    if (value >= 1000) {
      return NumberSuffix.format(value, { precision: 2 });
    }
    else {
      return value.toString();
    }
  }

  get ProfileNFTs() {
    return Object.keys(this.nftCollection);
  }
}
