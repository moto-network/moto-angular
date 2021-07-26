import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DBNFT, NFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from './nft-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  address: string | null = null;
  isCreator: boolean = false;
  nftCollection: NFTCollection | null = null;
  collectionObservable: BehaviorSubject<NFTCollection | null> = new BehaviorSubject<NFTCollection | null>(this.nftCollection);
  nft: DBNFT | null = null;
  constructor(private _nftManager: NFTManagerService) {
  }

  initProfile(address:string):void {
    this.address = address;
    this._getRemoteNFTs(this.address)
      .subscribe((collection: NFTCollection) => {
        if (collection) {
          this.nftCollection = collection;
        }
      });
  }

  getNFTCollection(): Observable<NFTCollection | null> {
    if (!this.nftCollection && this.address) {
      console.log("have it ");
      return this._getRemoteNFTs(this.address);
    }
    return this.collectionObservable;
  }

  setNFT(nft: DBNFT): void {
    this.nft = nft;
    this._nftManager.setNFT(nft);
  }

  setNFTCollection(collection: NFTCollection){
    console.log("set nftCollectin is", collection);
    this.nftCollection = collection;
    this.collectionObservable.next(this.nftCollection);
    this.address = this._getAddress(collection, "creator");
  }

  getNFT(): DBNFT | null {
    if (this.nft) {
      return this.nft;
    }
    return null;
  }

  private _getRemoteNFTs(address: string): Observable<NFTCollection> {
    const collectionObservable: Subject<NFTCollection> = new Subject<NFTCollection>();
    this._nftManager.getNFTs("creator", address)
      .subscribe((remoteCollection: NFTCollection | null) => {
        if (remoteCollection) {
          this.nftCollection = remoteCollection;
          collectionObservable.next(remoteCollection);
        }
      });

    return collectionObservable;
  }

  private _getAddress(nftCollection: NFTCollection, whichAddress: string): string | null {
    const tokenId = Object.keys(nftCollection)[0];
    const nft: NFT = nftCollection[tokenId];
    if (whichAddress == "creator") {
      return nft.creator;
    }
    else if (whichAddress == "beneficiary") {
      return nft.beneficiary;
    }
    return null;
  }

}
