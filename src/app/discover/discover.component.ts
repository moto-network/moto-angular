import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileNFT, NFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from '../Services/nft-manager.service';
import { SessionManagerService } from '../Services/session-manager.service';

declare var anime: any;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  nftCollection: NFTCollection<FileNFT> = {} as NFTCollection<FileNFT>;
  scrollPosition: any;
  loadingAnimation: any = null;
  session_id = "moto_discover";
  loadNFTSub: Subscription | null = null;
  constructor(private _nftManager: NFTManagerService,
    private _router: Router, private _sessionManager: SessionManagerService) {
  }

  ngOnInit(): void {
    let sessionData = this._sessionManager.get("moto_discover_nftCollection");

    if (!sessionData) {
      this.loadNFTs();
    }
    else {
      this.localLoad(sessionData);
    }
  }

  private localLoad(nftCollection: NFTCollection<NFT>): void {
    console.log("lcoaal calleld");
    this.nftCollection = nftCollection;
    if (this._sessionManager.get("moto_discover_scrollTop")) {
      document.body.scrollTop = this._sessionManager.get("moto_discover_scrollTop");
      this.nftCollection = this._sessionManager.get("moto_discover_nftCollection");
    }


  }
  loadNFTs() {
    this.loadNFTSub = this._nftManager.getNFTs()
      .subscribe((collection: NFTCollection<NFT> | null) => {
        if (collection) {
          this.loadingAnimation.pause();
          this.loadingAnimation.reset();
          this.nftCollection = collection;
        }
      });
    setTimeout(() => {
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
        targets: "#main-content-container",
        translateX: [0, -5, 4, 0],
      });

    if (Object.keys(this.nftCollection).length == 0) {
      this.loadingAnimation.play();
    }



  }

  ngOnDestroy(): void {
    this.loadNFTSub?.unsubscribe();
  }


  display(nft: FileNFT): void {
    this._sessionManager.set("moto_discover_nftCollection", this.nftCollection);
    this._sessionManager.set("moto_discover_scrollTop", document.body.scrollTop);
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft']);
  }

  get NFTs() {

    return Object.keys(this.nftCollection);

  }
}
