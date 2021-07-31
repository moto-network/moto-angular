import { Injectable } from '@angular/core';
import { getContract } from 'src/app.config';
import { NFT } from 'src/declaration';
import { ContractsService } from './BlockchainServices/contracts.service';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private _contracts:ContractsService) { }

  grantSinglePermission(nft: NFT) :Promise<any>{
    return this._contracts.grantMarketSinglePermission(nft);
  }

  grantTotalPermission(nft: NFT): Promise<any> {
    return this._contracts.grantMarketTotalPermission(nft);
  }

  addToMarket(nft: NFT): Promise<any> {
    return new Promise((resolve, reject) => {
      this.canMarketControl(nft)
        .then((address: string) => {
          if (address) {
            const marketContract = getContract(nft.chainId, "market");
            if (marketContract.address.toUpperCase() == address.toUpperCase()) {
              console.log("have permission");
              resolve(this._contracts.addToMarket(nft));
            }
            else {
              this.grantSinglePermission(nft)
                .then((possibleHash) => {
                  if (possibleHash) {
                    resolve(this._contracts.addToMarket(nft));
                  }
                  else {
                    reject(new Error("Error interacting with contract. might be connection issue"));
                  }
                });
            }
          }
          else {
            reject(new Error("Connection Issue"));
          }

        })
        .catch((err) => {
          reject(new Error("some connection error"));
        });
    });
  }


  canMarketControl(nft: NFT): Promise<string> {
    return this._contracts.canMarketControl(nft);
  }
}