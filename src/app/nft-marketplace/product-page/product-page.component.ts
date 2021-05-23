import { Component, Input, OnInit } from '@angular/core';
import { NftManagerService } from 'src/app/DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';

@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  nft:any;
  constructor(private _nftManager:NftManagerService) { 

    this.nft = _nftManager.getNFTProduct();
    console.log("this nft is ", this.nft);
  }

  ngOnInit(): void {
  }

}
