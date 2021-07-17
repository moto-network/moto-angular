import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChinaDataService {

  constructor() { }

  public getAllNFTs(): Observable<any> {
    return new Observable((sub) => {
      sub.next(null);
    });
  }
  public getMultipleNFTs(searchParameter: string): Observable<any> {
    return new Observable((subscriber) => {
      subscriber.next(null);
    })
  }

  public getNFT(tokenId: string): Observable<any> {
    return new Observable((subscriber) => {
      subscriber.next("china");
    });
  }
}
