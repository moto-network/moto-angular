import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//2acfe0ca-81a4-4456-b37b-05351149abc9
@Injectable({
  providedIn: 'root'
})
export class AssetConverterService {
  BASE_URL:string =  "https://pro-api.coinmarketcap.com/v1/fiat/map";
  

  constructor(private http: HttpClient) { 
    
   
  }


  convertFromTo(amount:number, fromCurrency:string,toCurrency:string):any{
    
  }
}