import { Component, OnInit } from '@angular/core';
import { MarketService } from 'src/app/Services/market.service';

@Component({
  selector: 'app-listing-management',
  templateUrl: './listing-management.component.html',
  styleUrls: ['./listing-management.component.css']
})
export class ListingManagementComponent implements OnInit {

  constructor(private _market:MarketService) { }

  ngOnInit(): void {
    this._market.getListing();
  }

}
