import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBNFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from '../Services/MarketServices/nft-manager.service';

declare var anime: any;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  nftCollection: NFTCollection = {};
  loadingAnimation: any = null;
  constructor(private _nftManager: NFTManagerService,
    private _router: Router) {


  }

  ngOnInit(): void {
    this._nftManager.getNFTs()
      .subscribe((collection: NFTCollection | null) => {
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

    if (!this.nftCollection) {
      this.loadingAnimation.play();
    }
  }

  display(nft: DBNFT): void {
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft']);
  }
  get NFTs() {
    return Object.keys(this.nftCollection);
  }
}
