import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileNFT, ListingNFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from '../Services/nft-manager.service';
import { SessionManagerService } from '../Services/session-manager.service';

declare var anime: any;

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  nftCollection: NFTCollection<ListingNFT & Partial<FileNFT>> = {} as NFTCollection<ListingNFT & Partial<FileNFT>>;
  scrollPosition: any;
  loading: boolean = false;
  session_id = "moto_discover";
  loadNFTSub: Subscription | null = null;
  constructor(private _nftManager: NFTManagerService,
    private _router: Router, private _sessionManager: SessionManagerService) {
  }

  ngOnInit(): void {
    let sessionData = this._sessionManager.get("moto_discover_nftCollection");

    this.loadNFTs();
  }

  private localLoad(nftCollection: NFTCollection<ListingNFT>): void {
    console.log("lcoaal calleld");
    this.nftCollection = nftCollection;
    if (this._sessionManager.get("moto_discover_scrollTop")) {
      document.body.scrollTop = this._sessionManager.get("moto_discover_scrollTop");
      this.nftCollection = this._sessionManager.get("moto_discover_nftCollection");
    }


  }
  loadNFTs() {
    this.loadNFTSub = this._nftManager.getNFTs<ListingNFT>("onSale",true)
      .subscribe((collection: NFTCollection<ListingNFT> | null) => {
        if (collection) {
          
          this.nftCollection = collection;
        }
      });
    setTimeout(() => {
      
    }, 5000);
  }

  ngAfterViewInit(): void {
    


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
