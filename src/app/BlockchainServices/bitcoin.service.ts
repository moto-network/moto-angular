import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitcoinService {

  constructor(private http:HttpClient) { 

  }

  getBTCPrice(): Observable<any>{
    return this.http.get<any>("https://api.coinbase.com/v2/prices/BTC-USD/buy");
  }
}
