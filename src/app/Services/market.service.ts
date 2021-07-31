import { Injectable } from '@angular/core';
import { faMapMarked } from '@fortawesome/free-solid-svg-icons';
import { getContract } from 'src/app.config';
import { NFT } from 'src/declaration';
import { ContractsService } from './BlockchainServices/contracts.service';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private _contracts:ContractsService) { }

  requestSinglePermission(nft: NFT) :Promise<string>{
    return this._contracts.grantMarketSinglePermission(nft);
  }

  grantTotalPermission(nft: NFT): Promise<any> {
    return this._contracts.grantMarketTotalPermission(nft);
  }

  addToMarket(nft: NFT): Promise<any> {
    return new Promise((resolve, reject) => {
      this.canMarketControlSingle(nft)
        .then((hasPermission: boolean) => {

            if (hasPermission) {
              console.log("have permission");
              resolve(this._contracts.addToMarket(nft));
            }
            else {
              this.requestSinglePermission(nft)
                .then((transactionHash:string) => {
                  if (transactionHash) {
                    resolve(this._contracts.addToMarket(nft));
                  }
                  else {
                    reject(new Error("Error interacting with contract. might be connection issue"));
                  }
                });
            }
        })
        .catch((err) => {
          reject(new Error("some connection error"));
        });
    });
  }

  canMarketControlAll(nft: NFT):Promise<boolean> {
    return this._contracts.canMarketControlAll(nft);
  }

  canMarketControlSingle(nft: NFT): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._contracts.canMarketControlSingle(nft)
        .then((controller: string | null | undefined) => {
          const marketContract = getContract(nft.chainId, "market");
          const marketAddress = marketContract.address;
          if (controller) {
            resolve((controller.toUpperCase() == marketAddress.toUpperCase()));
          }
          else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(new Error("Error trying to find owner"));
        });
     });
    
  }
}