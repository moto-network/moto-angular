import { Injectable } from '@angular/core';
import { FileNFT, NFT, NFTCollection, Listing as Listing } from "src/declaration";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { CREATE_ORDER_URL, getProvider, UPLOAD_URL } from "src/app.config";
import { Observable, Subject } from 'rxjs';
import { ChinaDataService } from './china-data.service';
@Injectable({
  providedIn: 'root'
})
export class RemoteDataService {
  isChina: boolean = false;
  constructor(private http: HttpClient, private _db: AngularFirestore,
  private _china:ChinaDataService) { }

  public getNFT<NFTType extends Required<NFT>>(parameter: string, value: string):
    Observable<NFTType | null>{
    const nftObservable: Subject<NFTType | null> = new Subject<NFTType | null>();
    if (this.isChina) {
      return new Subject<NFTType | null>();
    }
    else {
      this._db
        .collection("NFTs", ref => ref.where(parameter, '==', value.toLowerCase()))
          .get()
          .subscribe((result:any) => {
            if (result && !result.empty) {

              nftObservable.next(result.docs[0].data() as NFTType);
            }
          });
      return nftObservable;
    }
  }

  public uploadFile(nft: NFT, file: File) {
    const formData = new FormData();
    formData.append('nft', JSON.stringify(nft));
    formData.append('file', file);

    this.http.post<any>(UPLOAD_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  public updateListingDB(nft:NFT): Promise<Listing>{
    return new Promise<Listing>((resolve, reject) => {
      const formData = new FormData();
      formData.append('nft', JSON.stringify(nft));
      this.http.post<any>(CREATE_ORDER_URL, formData)
        .subscribe((response) => {
          console.log("response", response);
          if (response) {
            resolve(response as Listing);
          }
        }
      );
    });
    
  }

  public getAllNFTs(): Observable<NFTCollection> {
    const nftCollection: NFTCollection = {};
    if (this.isChina) {
      return this._china.getAllNFTs();
    }
    else {
      const collectionSubject: Subject<NFTCollection> = new Subject<NFTCollection>();
      this._db.collection("NFTs").get()
        .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let nft: FileNFT = doc.data() as FileNFT;
            nftCollection[nft.tokenId] = nft;
            collectionSubject.next(nftCollection);
          });
        });
      return collectionSubject;
    }
  }


  public getNFTs(searchParameter: string, searchValue: string): Observable<NFTCollection | null>{
    const nftCollection: NFTCollection = {};
    const collectionSubject: Subject<NFTCollection | null> = new Subject<NFTCollection | null>();
    if (this.isChina) {
      return this._china.getMultipleNFTs(searchParameter);
    }
    else {
      console.log(searchValue);
    this._db
      .collection("NFTs", ref => ref.where(searchParameter, '==', searchValue.toLowerCase()))
      .get()
      .subscribe((querySnapshot) => {
        if (querySnapshot.empty) {
          collectionSubject.next(null);
        }
        querySnapshot.forEach((doc) => {
          let nft: FileNFT = doc.data() as FileNFT;
          nftCollection[nft.tokenId] = nft;
          collectionSubject.next(nftCollection);
        });
      });
      return collectionSubject;
    }
  }

}