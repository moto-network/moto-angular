import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';
import { DBNFT, NFT, NFTCollection } from 'src/declaration';

declare var anime: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  nftCollection: NFTCollection = {};
  nftDisplayCollection: NFTCollection = {};
  nftGallery: DBNFT[] = [];
  address: string | null = null;
  loadingAnimation: any = null;
  nothingToShow: boolean = false;
  constructor(private _profileManager: ProfileService, private _router: Router) {
    
  }

  ngOnChanges(): void {

  }

  ngOnInit(): void {
    console.log("GalleryComponent: ngOnIt: Called");
    this._profileManager.getNFTCollection()
      .subscribe((nftCollection: NFTCollection | null) => {
        if (nftCollection) {
          this.nftCollection = nftCollection;
          this.loadingAnimation.pause();
          this.loadingAnimation.reset();
          this.nothingToShow = false;
        }
      });
    /*this._profileManager.collectionObservable
      .subscribe((nftCollection: NFTCollection | null) => {
        console.log("inside observable", nftCollection);

        if (nftCollection) {
          this.nftCollection = nftCollection;
        }
      });*/
    

    setTimeout(() => {
      if (Object.keys(this.nftCollection).length == 0) {
        this.nothingToShow = true;
      }

      this.loadingAnimation.pause();
      this.loadingAnimation.reset();
    }, 5000);
  }


  ngAfterViewInit(): void {
    this.loadingAnimation = anime.timeline({
      loop: true,
      autoplay: false,
      easing: 'easeInQuad'
    })
      .add({
        targets: "#profile-sub-container",
        translateX: [0, -10, 10, 0]
      });
    if (Object.keys(this.nftCollection).length == 0) { 
      this.loadingAnimation.play();
    }
  }

  goToNFT(nft: DBNFT) {
    this._profileManager.setNFT(nft);
    this._router.navigate(['profile', 'nft']);
  }

  get ProfileNFTs() {
    return Object.keys(this.nftCollection);
  }


}
