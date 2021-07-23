import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBNFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from '../Services/MarketServices/nft-manager.service';
import { SessionManagerService } from '../Services/session-manager.service';

declare var anime: any;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  nftCollection: NFTCollection = {};
  scrollPosition: any;
  loadingAnimation: any = null;
  session_id = "moto_discover";
  constructor(private _nftManager: NFTManagerService,
    private _router: Router) {
  }

  ngOnInit(): void {
    console.log("sesson data,", this.haveSessionData());
    if (!this.haveSessionData()) {
      this.loadNFTs();
    }
   
  }

  loadNFTs() {
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

    if (Object.keys(this.nftCollection).length == 0 ) {
      this.loadingAnimation.play();
    }
    
  }

  ngOnDestroy(): void {
    this.saveToLocal();
    
  }

  private haveSessionData(): boolean {
    if (this.haveScrollInfo()) {
      this.nftCollection = JSON.parse(sessionStorage.getItem("moto_network_discover_collection")!);
      this.scrollPosition = JSON.parse(sessionStorage.getItem("moto_network_discover_scroll_position")!);
      console.table({
        "scroll data": this.scrollPosition,
      });
      let scrollOptions:ScrollToOptions = {
        top: this.scrollPosition,
        behavior:"auto"
      };
      document.body.scrollTop = this.scrollPosition;
      return true;
    }
    return false;
  }
  private saveToLocal(): void {
    sessionStorage.setItem("moto_network_discover_collection", JSON.stringify(this.nftCollection));
    sessionStorage.setItem("moto_network_discover_scroll_position", JSON.stringify(document.body.scrollTop));
  }

  private haveScrollInfo(): boolean{
    const scrollInfo = "moto_network_discover_scroll_position";
    const collectionInfo: string = "moto_network_discover_collection";
    if (sessionStorage.getItem(scrollInfo) && sessionStorage.getItem(collectionInfo)) {
      return true;
    }
    return false;
  }

  display(nft: DBNFT): void {
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft']);
  }

  get NFTs() {
    return Object.keys(this.nftCollection);
  }
}
