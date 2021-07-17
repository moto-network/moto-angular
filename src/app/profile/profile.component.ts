import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faGem, faCrown, faHeart, faGift, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DBNFT, NFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from '../Services/MarketServices/nft-manager.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  diamond = faGem;
  crown = faCrown;
  heart = faHeart;
  gift = faGift;
  support = faHandHoldingHeart;
  nftCollection: NFTCollection = {};
  nftGallery: DBNFT[] = [];
  address:string | null = null;
  constructor(private _nftManager: NFTManagerService, private _router: Router,
    private readonly location: Location, private readonly _route: ActivatedRoute) {
    this._nftManager.profile = this.address;
    this.getNFTs();
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.address = params["address"];
      if (this.address) {
        this.getNFTs(this.address);
      }

    });
  }

  get ProfileNFTs() {
    return Object.keys(this.nftCollection);
  }

  getNFTs(profile?:string) {
    if (Object.keys(this._nftManager.nftCollection).length == 0) {
      if (profile) {
        this._getNFTs(profile);
      }
      else if (this._nftManager.profile) {
        this._getNFTs(this._nftManager.profile);
      }
      else {
        
      }

    }
  }

  private _getNFTs(profile:string) {
    this._nftManager.getNFTs(profile)
      .subscribe((remoteCollection: NFTCollection) => {
        this.nftCollection = remoteCollection;

      });
  }

  private addNavigation(profile: string) {
    const params = new HttpParams();
    params.append("address", profile);
    this.location.go(this._router.url.split("?")[0], params.toString());
  }

  goToNFT(nft: NFT) {
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft-marketplace', 'nft']);
    console.log("click registered");
  }
}
