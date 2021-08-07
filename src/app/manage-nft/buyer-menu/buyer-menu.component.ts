import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
import { FileNFT, Listing, ListingNFT, NFT } from 'src/declaration';
@Component({
  selector: 'app-buyer-menu',
  templateUrl: './buyer-menu.component.html',
  styleUrls: ['./buyer-menu.component.css']
})
export class BuyerMenuComponent implements OnInit {
  insufficientFunds: boolean = true;
  shortPrice: string = '2000';
  approvedAmount = new BigNumber(-1);
  price = new BigNumber(0);
  nft: Partial<ListingNFT> & FileNFT = {
    "tokenId": "0x0000000000000",
    "contractAddress": "0x000000000000000000000000000000",
    "contentHash": "0x00000000000000000000000000000000000000000000000000000000000000",
    "name": "NOTHING TO SHOW",
    "chainId": 97,
    "onSale": true,
    "owner": "0x000000000000000000000000000000",
    "pHash": "0000000000000000000000000",
    "medImg": "../../../assets/HD2.jpg",
    "creator": "0x000000000000000000000000000000"
  };
  allowance = new BigNumber(0);
  //numberWithSpaces(getFormattedPrice('229834792384'))
  constructor(private _market: MarketService,
    private _nftMananger: NFTManagerService, private _router:Router) { }

  ngOnInit(): void {
    this._market.getAllowance()
      .then((allowance: string) => {
        if (allowance) {
          this.allowance = new BigNumber(allowance);
        }
       });
    this._nftMananger.getNFT<ListingNFT & FileNFT>()
      .subscribe((nft: ListingNFT & FileNFT | null) => {
        if (nft) {
          this.nft = nft;
          this.price = new BigNumber(this.nft.order!.price!);
        }
      });
  }

  buyNFT() {
    this._market.buyNFT(this.nft, this.price.toString())
      .then((hash) => {
        console.log(hash);
      });
  }

  approveExactAmount() {
    this._market.approveExactAmount('moto', this.nft, this.price.toString());
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
    console.log("number with space", bigNum);
    return bigNum.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  shortenPrice(valueString: string | undefined): string {
    const formattedPrice: string = this.getFormattedPrice(valueString);
    const value: number = parseFloat((formattedPrice ? formattedPrice : "0"));
    console.log("the value is ", value);
    const NumberSuffix = require('number-suffix');

    if (value >= 1000) {
        return NumberSuffix.format(value, { precision: 2 });
    }
    else {
      return value.toString();
    }
  }

  isApprovedSufficient(): boolean {
    console.log("is apporved", this.approvedAmount.gte(this.price));
      return this.approvedAmount.gte(this.price);
  }
}
