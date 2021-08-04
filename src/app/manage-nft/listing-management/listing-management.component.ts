import { Component, OnInit } from '@angular/core';
import { MarketService } from 'src/app/Services/market.service';
import { Listing } from 'src/declaration';
const web3 = require("web3-utils");
@Component({
  selector: 'app-listing-management',
  templateUrl: './listing-management.component.html',
  styleUrls: ['./listing-management.component.css']
})
export class ListingManagementComponent implements OnInit {

  constructor(private _market:MarketService) { }
  listing: Listing | null = null;
  ngOnInit(): void {
    this._market.getListing()
      .subscribe((listing:Listing | null) => {
        if (listing) {
          this.listing = listing;
        }
       });
  }

  getFormattedPrice(price: string | undefined): string{
    if (price) {
      return web3.fromWei(price);
    }
    else {
      return "";
    }
  }
}
