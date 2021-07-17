import { Injectable } from '@angular/core';
import { NFT } from "src/declaration";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { getProvider, UPLOAD_URL } from "src/app.config";
import { Observable } from 'rxjs';
import { ChinaDataService } from './china-data.service';
@Injectable({
  providedIn: 'root'
})
export class RemoteDataService {
  isChina: boolean = false;
  constructor(private http: HttpClient, private _db: AngularFirestore,
  private _china:ChinaDataService) { }


  public uploadFile(nft: NFT, file: File) {
    const formData = new FormData();
    formData.append('nft', JSON.stringify(nft));
    formData.append('file', file);

    this.http.post<any>(UPLOAD_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  public getAllNFTs(): Observable<any> {
    if (this.isChina) {
      return this._china.getAllNFTs();
    }
    else {
      return this._db.collection("NFTs").get();
    }
  }


  public getMultipleNFTS(searchParameter: string): Observable<any>{
    if (this.isChina) {
      return this._china.getMultipleNFTs(searchParameter);
    }
    else{
    return this._db
      .collection("NFTs", ref => ref.where(searchParameter, '==', searchParameter))
      .get();
    }
  }
/**
 * will get a single nft. bifurcates depending on region
 * @param {string} tokenId 
 * @returns {Observable}
 */
  public getNFT(tokenId: string):Observable<any> {
    if (this.isChina) {
      // something that is china friendly;
      return this._china.getNFT(tokenId);
    }
    else {
      return this._db
        .collection("NFTs", ref => ref.where('tokenId', '==', tokenId))
        .get();
    }
  }


}