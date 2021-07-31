import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DBNFT, NFTCollection, SearchResults } from 'src/declaration';
import { RemoteDataService } from './remote-data.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private _remote: RemoteDataService) {

  }

  search(value: string): Observable<SearchResults> {

    let paramLength: number = value.length;
    const emptyResults: SearchResults = {
      query:value,
      empty: true
    };

    const FP: number = 66;
    const ADD: number = 42;
    const PHASH: number = 16
    const NFT: number = 34
    if (paramLength > 0) {
      console.log("paramter length ", paramLength);
      switch (paramLength) {
        case 66:
          return this._search("contentHash", value);

        case 34:
          return this._search("tokenId", value);

        case 42:
          return this._searchCollection(value);

        case 16:
          return this._search("pHash", value);

      }
    }

      const emptyObservable: Subject<SearchResults> = new Subject<SearchResults>();
      emptyObservable.next(emptyResults);
      return emptyObservable;
  }

  private _search(value: string, parameter: string):Observable<SearchResults> {
    const resultsObservable: Subject<SearchResults> = new Subject<SearchResults>();
    this._remote.getNFT(value, parameter)
      .subscribe((nft: DBNFT | null) => {
        const results: SearchResults = {
          query: value,
          suggestedRoute: "nft",
          result: nft,
          empty: false
        }
        if (nft) {
          results.result = nft;
          
        }
        else {
          results.empty = true;
        }
        resultsObservable.next(results);
      });
    return resultsObservable;
  }

  private _searchCollection(value: string): Observable<SearchResults>{
    const resultsObservable: Subject<SearchResults> = new Subject<SearchResults>();
    this._remote.getNFTs("creator", value)
      .subscribe((nftCollection: NFTCollection | null) => {
        if (nftCollection) {
          const results: SearchResults = {
            query:value,
            suggestedRoute: "profile",
            result: nftCollection,
            empty: false
          }
          resultsObservable.next(results);
        }
      });
    return resultsObservable;
  }
}
