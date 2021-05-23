import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NftManagerService} from '../../../DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';
@Component({
  selector: 'app-nft-browse-results',
  templateUrl: './nft-browse-results.component.html',
  styleUrls: ['./nft-browse-results.component.css']
})
export class NftBrowseResultsComponent implements OnInit {
  nftsArray:any = [];
  constructor(private _nfts:NftManagerService,private _router:Router) { 
    _nfts.getNFTs().subscribe((results)=>{
      if(results){
        this.nftsArray = results;
      }
    }
    );
  }

  ngOnInit(): void {

  }

  ngDoCheck(){
    
  }

  openProductPage(nft:any):void{
    this._nfts.setNFTProduct(nft);
    this._router.navigate(['nft_marketplace','product-page']);
  }
}
