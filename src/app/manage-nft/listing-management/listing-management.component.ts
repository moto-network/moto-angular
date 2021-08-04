import { Component, OnInit } from '@angular/core';

import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
import { Listing, NFT } from 'src/declaration';
const web3 = require("web3-utils");

@Component({
  selector: 'app-listing-management',
  templateUrl: './listing-management.component.html',
  styleUrls: ['./listing-management.component.css']
})
export class ListingManagementComponent implements OnInit {

  constructor(private _market: MarketService, private _nftManager: NFTManagerService) { }
  listing: Listing | null = null;
  nft: NFT | null = null;
  ngOnInit(): void {
    this._market.getListing()
      .subscribe((listing: Listing | null) => {
        if (listing) {
          this.listing = listing;
        }
      });

    this._nftManager.getNFT()
      .subscribe((nft) => {
        if (nft) {
          this.nft = nft;
        }
      });
  }

  getFormattedPrice(price: string | undefined): string {
    if (price) {

      return this._market.formatCurrency(price);
    }
    else {
      return "";
    }
  }

  numberWithSpaces(bigNum:string) {
    return bigNum.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  shortPrice(valueString: string | undefined): string {
    const formattedPrice: string = this.getFormattedPrice(valueString);
    const value: number = parseFloat((formattedPrice ? formattedPrice : "0"));
    const NumberSuffix = require('number-suffix');
    NumberSuffix.addStyle('moto-numbers', [' stacks', ' millie', ' billie', ' trillie']);
    NumberSuffix.addStyle('moto-number', [' stack', ' millie', ' billie', ' trillie']);
    if (value) {
      if (value < 1000) {
        return value.toString() + " moto";
      }

      if (value >= 1000 && value < 2000) {
        return NumberSuffix.format(value, { style: 'moto-number', precision: 3 });
      }
      else {
        return NumberSuffix.format(value, { style: 'moto-numbers', precision: 3 });
      }

    }
    else {
      return "not"
    }
  }
}
