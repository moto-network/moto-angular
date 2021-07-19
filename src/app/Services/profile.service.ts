import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DBNFT, NFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from './MarketServices/nft-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  address: string | null = null;
  isCreator: boolean = false;
  nftCollection: NFTCollection = {};
  nft: DBNFT | null = null;
  collectionObservable: Subject<NFTCollection> = new Subject<NFTCollection>();
  constructor(private _nftManager: NFTManagerService) {
  }

  initProfile(address: string) {
    this.address = address;
    this._getRemoteNFTs();
  }

  getNFTCollection():Observable<NFTCollection>{
    console.log("profile get nft called", this.nftCollection);
    return this.collectionObservable;
  }

  setNFT(nft: DBNFT) :void{
    this.nft = nft;
  }

  getNFT(): DBNFT| null {
    if (this.nft) {
      return this.nft;
    }
    return null;
  }

  hasLocalCollection(): boolean {
    return Object.keys(this.nftCollection).length > 0;
  }

  private _getRemoteNFTs() {
    if (this.address) {
      this._nftManager.getCreatedNFTs(this.address)
        .subscribe((remoteCollection: NFTCollection) => {
          this.nftCollection = remoteCollection;
          console.log("remote found", remoteCollection);
          this.collectionObservable.next(this.nftCollection);
        });
    }

  }



}
