import { Injectable } from '@angular/core';
import { FileNFT, NFT, NFTCollection, Listing as Listing, Account, ListingNFT } from "src/declaration";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { CREATE_ORDER_URL, FINALIZE_ORDER, GEN_LINK, GET_NONCE_URL, UPLOAD_NFT_URL, VERIFY_SIG_URL } from "src/app.config";
import { Observable, Subject } from 'rxjs';
import { ChinaDataService } from './china-data.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemoteDataService {
  isChina: boolean = false;
  constructor(private http: HttpClient, private _db: AngularFirestore,
    private _china: ChinaDataService) { }

  public getNFT<NFTType extends Required<NFT>>(parameter: string, value: string):
    Observable<NFTType | null> {
    const nftObservable: Subject<NFTType | null> = new Subject<NFTType | null>();
    if (this.isChina) {
      return new Subject<NFTType | null>();
    }
    else {
      this._db
        .collection("NFTs", ref => ref.where(parameter, '==', value.toLowerCase()))
        .get()
        .subscribe((result: any) => {
          if (result && !result.empty) {

            nftObservable.next(result.docs[0].data() as NFTType);
          }
        });
      return nftObservable;
    }
  }

  public getNonce(account: Account): Observable<string | undefined> {
    const formData = new FormData();
    formData.append('account', account.address);
    return this.http.post<any>(GET_NONCE_URL, formData)
      .pipe(take(1), map(response => response.nonce));
  }

  public verifySignature(account: Account, nonce: string, sig: string): Observable<string> {
    const formData = new FormData();
    formData.append('account', account.address);
    formData.append('nonce', nonce);
    formData.append('chainId', account.network.toString());
    formData.append('signature', sig);
    return this.http.post<any>(VERIFY_SIG_URL, formData)
      .pipe(take(1), map(res => res.token));
  }

  public uploadFile(nft: NFT, file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('nft', JSON.stringify(nft));
    formData.append('file', file);

    return this.http.post<any>(UPLOAD_NFT_URL, formData).pipe(take(1));
  }

  public updateListingDB(nft: NFT, hash:string): Promise<Listing> {
    return new Promise<Listing>((resolve, reject) => {
      const formData = new FormData();
      formData.append('nft', JSON.stringify(nft));
      formData.append("transactionHash", hash);
      this.http.post<any>(CREATE_ORDER_URL, formData)
        .subscribe((response) => {

          if (response) {
            resolve(response as Listing);
          }
        }
        );
    });

  }

  public finalizeOrder(nft: ListingNFT, hash:string): Observable<Listing> {
    const formData = new FormData();
    formData.append('nft', JSON.stringify(nft));
    formData.append('transactionHash', hash);
    return this.http.post<any>(FINALIZE_ORDER, formData)
      .pipe(take(1), map(data => data as Listing));
  }
  public getAllNFT<NFTType extends NFT>(): Observable<NFTCollection<NFTType>> {
    const nftCollection: NFTCollection<NFTType> = {};
    if (this.isChina) {
      return this._china.getAllNFTs();
    }
    else {
      const collectionSubject: Subject<NFTCollection<NFTType>> = new Subject<NFTCollection<NFTType>>();
      this._db.collection("NFTs").get()
        .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let nft: NFTType = doc.data() as NFTType;
            nftCollection[nft.tokenId] = nft;
            collectionSubject.next(nftCollection);
          });
        });
      return collectionSubject;
    }
  }

  generateDownloadLink(nft: NFT, userToken: string): Observable<string> {

    const formData = new FormData();
    formData.append('nft', JSON.stringify(nft));
    return this.http.post<any>(GEN_LINK, formData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + userToken
      })
    })
      .pipe(take(1));
  }

  public getNFTs<NFTType extends NFT>(searchParameter: string, searchValue: string): Observable<NFTCollection<NFTType> | null> {
    let nftCollection: NFTCollection<NFTType> & {} = { };
    const collectionSubject: Subject<NFTCollection<NFTType> | null> = new Subject<NFTCollection<NFTType> | null>();
    if (this.isChina) {
      return this._china.getMultipleNFTs(searchParameter);
    }
    else {

      this._db
        .collection("NFTs", ref => ref.where(searchParameter, '==', searchValue.toLowerCase()))
        .get()
        .subscribe((querySnapshot) => {
          if (querySnapshot.empty) {
            collectionSubject.next(null);
          }
          querySnapshot.forEach((doc) => {
            let nft: NFTType = doc.data() as NFTType;
            nftCollection[nft.tokenId] = nft;
            collectionSubject.next(nftCollection);
          });
        });
      return collectionSubject;
    }
  }

}