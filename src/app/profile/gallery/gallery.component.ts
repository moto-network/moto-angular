import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';
import { ProfileService } from 'src/app/Services/profile.service';
import { DBNFT, NFT, NFTCollection } from 'src/declaration';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  nftCollection: NFTCollection = {};
  nftGallery: DBNFT[] = [];
  address: string | null = null;
  constructor(private _profileManager: ProfileService) {
    console.log(_profileManager.nftCollection);
  }

  ngOnChanges(): void {
    console.log(this.nftCollection);
  }

  ngOnInit(): void {
    this._profileManager.getNFTs()
      .subscribe((remoteCollection: NFTCollection) => {
        this.nftCollection = remoteCollection;
        console.log(this.nftCollection, "inside gallery");
      });

  }

  


  goToNFT(nft: NFT) {
    
   
    console.log("click registered");
  }

  get ProfileNFTs() {
    return Object.keys(this.nftCollection);
  }

}
