import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBNFT, NFTCollection } from 'src/declaration';
import {NFTManagerService} from '../../../Services/MarketServices/nft-manager.service';
@Component({
  selector: 'app-nft-browse-results',
  templateUrl: './nft-browse-results.component.html',
  styleUrls: ['./nft-browse-results.component.css']
})
export class NftBrowseResultsComponent implements OnInit {
  loading:boolean = true;
  nftCollection: NFTCollection = {};
  
  nftArray: DBNFT[] = [];
  constructor(private _nftManager:NFTManagerService,private _router:Router) {
    //this.nftsArray = this.dummyArray; 

    
    //console.log("smImg", nftCollection[nft].smImg);
    /*this._nftManager.getNFTCollection()
      .subscribe((collection: NFTCollection) => {
        this.nftCollection = collection;
        
      });*/
    if (Object.keys(this._nftManager.nftCollection).length == 0) {
      
    }
    else {
      this.nftCollection = this._nftManager.nftCollection;
    }
    
    /**
     * @todo see if you can filter data without making calls
     */
    
  }

  ngOnInit(): void {

  }

  ngDoCheck(){
    if (this.nftCollection) {
      this.loading = false;
    }
  }

  get RemoteData() {
    return Object.keys(this.nftCollection);
  }

  openProductPage(nft: any): void{
    console.log("the nft is ", nft);
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft-marketplace','nft']);
  }
}
