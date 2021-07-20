import { Injectable } from '@angular/core';
import { DBNFT, NFT, NFTCollection } from "src/declaration";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { getProvider, UPLOAD_URL } from "src/app.config";
import { Observable, Subject } from 'rxjs';
import { ChinaDataService } from './china-data.service';
@Injectable({
  providedIn: 'root'
})
export class RemoteDataService {
  isChina: boolean = false;
  constructor(private http: HttpClient, private _db: AngularFirestore,
  private _china:ChinaDataService) { }

  public findNFT(value: string, parameter: string): Observable<DBNFT | null>{
    const nftObservable: Subject<DBNFT | null> = new Subject<DBNFT | null>();
    if (this.isChina) {
      return new Subject<DBNFT>();
    }
    else {
      this._db
        .collection("NFTs", ref => ref.where(parameter, '==', value.toLowerCase()))
          .get()
          .subscribe((result:any) => {
            if (result && !result.empty) {

              nftObservable.next(result.docs[0].data() as DBNFT);
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
            let nft: DBNFT = doc.data() as DBNFT;
            nftCollection[nft.tokenId] = nft;
            collectionSubject.next(nftCollection);
          });
        });
      return collectionSubject;
    }
  }


  public getMultipleNFTS(searchParameter: string, searchValue:string): Observable<any>{
    if (this.isChina) {
      return this._china.getMultipleNFTs(searchParameter);
    }
    else {
      console.log(searchValue);
    return this._db
      .collection("NFTs", ref => ref.where(searchParameter, '==', searchValue.toLowerCase()))
      .get();
    }
  }
/**
 * will get a single nft. bifurcates depending on region
 * @param {string} tokenId 
 * @returns {Observable}
 */
  public getNFT(tokenId: string): Observable<NFT> {
    //const nft: DBNFT = {};
    const nftObservable: Subject<NFT> = new Subject<NFT>();
    if (this.isChina) {
      // something that is china friendly;
      return this._china.getNFT(tokenId);
    }
    else {
      this._db
        .collection("NFTs", ref => ref.where('tokenId', '==', tokenId))
        .get()
        .subscribe((remoteValue) => {
          //nft = remoteValue.docs[0].data() as DBNFT
          //nftObservabel.next(nft);
          console.log("check how the data is from remote to see how to form it");
        });
      return nftObservable;
    }
  }


}