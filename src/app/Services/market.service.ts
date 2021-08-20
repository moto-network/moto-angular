import { compileDirectiveFromRender2 } from '@angular/compiler/src/render3/view/compiler';
import { Injectable } from '@angular/core';

import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { getContract } from 'src/app.config';
import { NFT, Listing as Listing, FileNFT, ListingNFT, Account, TransactionReceipt, } from 'src/declaration';
import { ContractsService } from './BlockchainServices/contracts.service';
import { RemoteDataService } from './remote-data.service';
import { BigNumber } from "bignumber.js";
import { TransactionsService } from './transactions.service';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  listing: Listing | null = {
    "address": "0xd4DF6E0236A01B64DB7f01f970F375384F9f5943",
    "blockNumber": 11176263,
    "transactionHash": "0x756c977e590fce1db324de4307d7460736d356aa60a277539798b0f77fbed0a8",
    "id": "0x55ec93d893dfdeb1944fe6c858d886763acf5b6e804e000f862e68269dc11ac5",
    "tokenId": "0xea3311f95eddd5d6ccb51a6abf912b4b",
    "seller": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
    "contractAddress": "0x4De41909a50B92b025BA95f8ddf7e7a126dC40Cd",
    "price": "2000000000000000000",
    "expiresAt": "10000000000"
  };
  listingObservable: BehaviorSubject<Listing | null> = new BehaviorSubject<Listing | null>(null);
  constructor(private _contracts: ContractsService, private _remote: RemoteDataService,
    private _transactions: TransactionsService) { }

  setListing(listing: Listing) {
    this.listing = listing;
    this.listingObservable.next(this.listing);
  }

  getListing(listingId?: string): Observable<Listing | null> {
    if (!listingId) {
      this.listingObservable.next(this.listing);
    }
    return this.listingObservable;
  }

  getCoinBalance(account: Account): Promise<string> {
    return this._contracts.getCoinBalance(account);
  }

  getNFTBalance(account: Account): Promise<string> {
    return this._contracts.getMotoNFTBalance(account);
  }

  getAllowance(): Promise<string> {
    return this._contracts.getAllocation('moto');
  }
  requestSinglePermission(nft: NFT): Promise<string> {
    return this._contracts.grantMarketSinglePermission(nft);
  }

  grantTotalPermission(nft: NFT): Promise<any> {
    return this._contracts.grantMarketTotalPermission(nft);
  }

  addToMarket(nft: NFT, price: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.canMarketControlSingle(nft)
        .then((hasPermission: boolean) => {

          if (hasPermission) {
            console.log("have permission");
            const priceBN = new BigNumber(price);
            const motoSubUnitPrice = priceBN.multipliedBy(1000000);
            resolve(this._contracts.addNFTtoMarket(nft, motoSubUnitPrice.toString()));
          }
          else {
            this.requestSinglePermission(nft)
              .then((transactionHash: string) => {
                if (transactionHash) {
                  resolve(this._contracts.addNFTtoMarket(nft, price));
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

  canMarketControlAll(nft: NFT): Promise<boolean> {
    return this._contracts.canMarketControlAllNFTs(nft);
  }

  canMarketControlSingle(nft: NFT): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._contracts.canMarketControlThisNFT(nft)
        .then((controller: string | null | undefined) => {
          const marketContract = getContract(nft.chainId, "market");
          const marketAddress = marketContract.address;
          if (controller) {
            console.log("controller found", controller);
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

  formatCurrency(price: string): string {
    if (typeof price === 'undefined') {
      return '';
    }
    const priceBN = new BigNumber(price);
    const decimals = new BigNumber(1000000);
    return priceBN.div(decimals).toString();
  }

  updateListingDB(nft: NFT): Promise<Listing> {
    return this._remote.updateListingDB(nft);
  }

  async buyNFT(nft: ListingNFT, price: string): Promise<Listing> {
    const hash:string = await this._contracts.buyNFT('moto', nft, price) as string;
    if (hash) {
      return this._transactions.getTransactionStatus(nft, hash)
        .pipe(
          filter(status => status == true),
          mergeMap(() => this._remote.finalizeOrder(nft,hash))
        ).toPromise();
    }
    else {
      return Promise.reject(new Error("Market Update Error."));
    }    
  }

  increaseAllocationForMarket(coin: string, amount: string): Promise<string> {
    return this._contracts.increaseAllocation(coin, amount);
  }

  decreaseAllocationForMarket(coin: string, amount: string): Promise<string> {
    return this._contracts.decreaseAllocation(coin, amount);
  }

  approveExactAmount(coin: string, nft: NFT, price: string): Promise<boolean> {
    console.log("approveExactAmoouunt function in ");
    return from(this._contracts.setExactAllocation(coin, nft, price))
      .pipe(
        mergeMap(result => {
          if (result) {
            console.log("pipe results ", result);
            return this._transactions.getTransactionStatus(nft, result)
          }
          else {
            throw throwError("No result found");
          }
        })
      ).toPromise();

    
  }

}



