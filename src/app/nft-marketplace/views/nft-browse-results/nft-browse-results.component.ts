import { Component, OnInit } from '@angular/core';
import {NftManagerService} from '../../../DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';
@Component({
  selector: 'app-nft-browse-results',
  templateUrl: './nft-browse-results.component.html',
  styleUrls: ['./nft-browse-results.component.css']
})
export class NftBrowseResultsComponent implements OnInit {
  nftsArray:any = [];
  constructor(private _nfts:NftManagerService) { 
      this._nfts.getNFTs().subscribe((remoteNFTs)=>{
        if(remoteNFTs.docs.length > 0){
          this.nftsArray = remoteNFTs.docs;
          console.log("nfts are ",this.nftsArray[0].data());
        }
          
      });
  }

  ngOnInit(): void {
  }

}
