import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private _profileManager: ProfileService, private _router: Router) {

  }

  ngOnChanges(): void {
    console.log(this.nftCollection);
  }

  ngOnInit(): void {
    console.log("have profile manager address ? ", this._profileManager.address);
    if (this._profileManager.hasLocalCollection()) {
      this.nftCollection = this._profileManager.nftCollection;
    }
    else if (this._profileManager.address) {
      this._profileManager.getNFTs()
        .subscribe((remoteCollection: NFTCollection) => {
          this.nftCollection = remoteCollection;

        });
    }
  }




  goToNFT(nft: DBNFT) {
    this._profileManager.setNFT(nft);
    this._router.navigate(['profile', 'nft']);
    console.log("click registered");
  }

  get ProfileNFTs() {
    return Object.keys(this.nftCollection);
  }

}
