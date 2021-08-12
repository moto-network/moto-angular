import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileNFT, Listing, NFT } from 'src/declaration';
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
  constructor(private _profile: ProfileService, private _market: MarketService,
    private _nftManager:NFTManagerService
  ) {

  }

  ngOnInit(): void {
    this.listingSub = this._market.getListing()
      .subscribe((listing) => {
        if (listing) {
          this.listing = listing;
         this.nftSub =  this._nftManager.getNFT("tokenId", listing.tokenId)
            .subscribe((nft) => {
              if (nft) {
                this.nft = nft;
              }
             });
        }
       })
    
    
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
}
