import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NFTManagerService } from '../../Services/MarketServices/nft-manager.service';
import { Location } from "@angular/common";
@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  nft: any = {
    name: "NOTHING TO SHOW",
    creator: "0x0000000000000000000000000000000000000000",
    tokenId: "0x000000000000000000000000000000000000000000000000000000",
    chainId: 0,
    beneficiary: "0x0000000000000000000000000000000000000000",
    contentHash: "0x000000000000000000000000000000000000000000000000000000000000000",
    pHash:"00000000000000000000000"
  };
  tokenId: string | null = null;
  constructor(private readonly location: Location,private _nftManager: NFTManagerService, private readonly _route: ActivatedRoute,
  private _router:Router) {
    //TODO: this.nft is null on reload, need to go back and click again
    if (_nftManager.nft) {
     this.nft = _nftManager.nft;
      this.location.replaceState(this._router.url.toString() + "?tokenId="+this.nft.tokenId);
    }
    
    
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.tokenId = params["tokenId"];
      if (this.tokenId) {
        this._nftManager.getNFTbyId(this.tokenId)
          .subscribe((snapshots) => {
            console.log("resullt", snapshots);
            this.nft = snapshots.docs[0].data();
           });
      }
     
    });
    //http://localhost:4200/nft-marketplace/nft
    
  }

  private addNavigation(tokenId:string) {
    const params = new HttpParams();
    params.append("tokenId", tokenId);
    this.location.go(this._router.url.split("?")[0], params.toString());
  }

  ngOnChange(): void {
    
  }

}
