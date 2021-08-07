import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FileNFT, NFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from './nft-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  address: string | null = null;
  isCreator: boolean = false;
  nftCollection: NFTCollection | null = null;
  collectionObservable: BehaviorSubject<NFTCollection | null> = new BehaviorSubject<NFTCollection | null>(this.nftCollection);
  nft: FileNFT | null = null;
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

      return this._getRemoteNFTs(this.address);
    }
    return this.collectionObservable;
  }

  setNFT(nft: FileNFT): void {
    this.nft = nft;
    this._nftManager.setNFT(nft);
  }

  setNFTCollection(collection: NFTCollection){

    this.nftCollection = collection;
    this.collectionObservable.next(this.nftCollection);
    this.address = this._getAddress(collection, "creator");
  }

  getNFT(): FileNFT | null {
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
    else if (whichAddress == "owner") {
      return nft.owner;
    }
    return null;
  }

}
