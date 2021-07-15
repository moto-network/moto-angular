import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NFTManagerService} from '../../../Services/MarketServices/nft-manager.service';
@Component({
  selector: 'app-nft-browse-results',
  templateUrl: './nft-browse-results.component.html',
  styleUrls: ['./nft-browse-results.component.css']
})
export class NftBrowseResultsComponent implements OnInit {
  nftsArray:any = [];
 
  constructor(private _nftManager:NFTManagerService,private _router:Router) {
    //this.nftsArray = this.dummyArray; 
    _nftManager.getNFTs();
    this.nftsArray = _nftManager.nftsArray;
    
  }

  ngOnInit(): void {

  }

  ngDoCheck(){
    
  }

  openProductPage(nft: any): void{
    console.log("the nft is ", nft);
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft-marketplace','nft']);
  }
}
