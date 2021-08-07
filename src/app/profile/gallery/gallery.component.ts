
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from 'src/app/Services/profile.service';
import { SessionManagerService } from 'src/app/Services/session-manager.service';
import { FileNFT, NFTCollection } from 'src/declaration';

declare var anime: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  nftCollection: NFTCollection = {};
  nftDisplayCollection: NFTCollection = {};
  nftGallery: FileNFT[] = [];
  address: string | null = null;
  loadingAnimation: any = null;
  nothingToShow: boolean = false;

  constructor(private _profileManager: ProfileService, private _router: Router,
  private _sessionManager:SessionManagerService) {
    
  }

  ngOnChanges(): void {

  }

  ngOnInit(): void {
    let sessionData = this._sessionManager.get("moto_profile_nftCollection");
    if (!sessionData) {
      this.remoteLoad();
      setTimeout(() => {
        if (Object.keys(this.nftCollection).length == 0) {
          this.nothingToShow = true;
        }
        this.loadingAnimation.pause();
        this.loadingAnimation.reset();
      }, 5000);
    }
    else {
      this.localLoad(sessionData);
    }
  }

  private localLoad(nftCollection:NFTCollection) :void{
    console.log("lcoaal calleld");
    this.nftCollection = nftCollection;
    if (this._sessionManager.get("moto_profile_scrollTop")) {
      document.body.scrollTop = this._sessionManager.get("moto_profile_scrollTop");
      this.nftCollection = this._sessionManager.get("moto_profile_nftCollection");
    }
    
    
  }

  private remoteLoad() {

    this._profileManager.getNFTCollection()
      .subscribe((nftCollection: NFTCollection | null) => {
        if (nftCollection) {
          this.nftCollection = nftCollection;
          this.loadingAnimation.pause();
          this.loadingAnimation.reset();
          this.nothingToShow = false;
        
        }
      });
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

  ngOnDestroy(): void {
    
  }

  goToNFT(nft: FileNFT) {
    this._sessionManager.set("moto_profile_nftCollection", this.nftCollection);
    this._sessionManager.set("moto_profile_scrollTop", document.body.scrollTop);
    this._profileManager.setNFT(nft);
    this._router.navigate(['profile', 'nft']);
  }

  get ProfileNFTs() {
    return Object.keys(this.nftCollection);
  }

}
