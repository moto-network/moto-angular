import { compileDirectiveFromRender2 } from '@angular/compiler/src/render3/view/compiler';
import { Injectable } from '@angular/core';

import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { getContract } from 'src/app.config';
import { NFT, Listing as Listing, FileNFT, ListingNFT, Account, TransactionReceipt, NFTCollection, } from 'src/declaration';
import { ContractsService } from './BlockchainServices/contracts.service';
import { RemoteDataService } from './remote-data.service';
import { BigNumber } from "bignumber.js";
import { TransactionsService } from './transactions.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { ResolveEnd } from '@angular/router';
import { captureRejectionSymbol } from 'node:events';

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
  watchForListing: BehaviorSubject<Listing | null> = new BehaviorSubject<Listing | null>(null);
  constructor(private _contracts: ContractsService, private _remote: RemoteDataService,
    private _transactions: TransactionsService, private _profile: ProfileService) { }

  setListing(listing: Listing) {
    this.listing = listing;
    this.watchForListing.next(this.listing);
  }

  getListing(listingId?: string): Observable<Listing | null> {
    if (!listingId) {
      this.watchForListing.next(this.listing);
    }
    return this.watchForListing;
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

  grantTotalPermission(nft: NFT): Promise<string> {
    return this._contracts.grantMarketTotalPermission(nft);
  }

  addToMarket(nft: NFT, priceFromUser: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.canMarketControlSingle(nft)
        .then((hasPermission: boolean) => {
          if (hasPermission) {
            resolve(this._addToMarket(nft, priceFromUser));
          }
          else {
            this._transactions.pendingTransaction(this.requestSinglePermission(nft), nft.network)
              .then((receipt: TransactionReceipt) => {
                if (receipt.status) {
                  resolve(this._addToMarket(nft, priceFromUser));
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

  private _addToMarket(nft: NFT, priceFromUser: string): Promise<boolean> {
    const priceBN = new BigNumber(priceFromUser);
    const motoSubUnitPrice = priceBN.multipliedBy(1000000);
    this._profile.openSnackBar("Updating Market Data.", 2000, false);
    return new Promise<boolean>((resolve, reject) => {
      this._transactions
        .pendingTransaction(this._contracts.addNFTtoMarket(nft, motoSubUnitPrice.toString()), nft.network)
        .then((receipt: TransactionReceipt) => {
          if (receipt) {
            this.updateListingDB(nft, receipt.hash)
              .then((listing: Listing) => {
                this.setListing(listing);
                resolve(true);
              })
              .catch((err) => {
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
        });
    })
  }

  canMarketControlAll(nft: NFT): Promise<boolean> {
    return this._contracts.canMarketControlAllNFTs(nft);
  }

  canMarketControlSingle(nft: NFT): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._contracts.canMarketControlThisNFT(nft)
        .then((controller: string | null | undefined) => {
          const marketContract = getContract(nft.network, "market");
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

  updateListingDB(nft: NFT, hash: string): Promise<Listing> {
    return this._remote.updateListingDB(nft, hash);
  }

  async buyNFT(nft: ListingNFT, price: string): Promise<Listing> {
    console.log("listing nft ", nft);
    return this._transactions.pendingTransaction(this._contracts.buyNFT('moto', nft, price), nft.network)
      .then((receipt) => {
        if (receipt) {
          return this._remote.finalizeOrder(nft, receipt.hash).toPromise();
        }
        else {
          return Promise.reject(new Error("buying nft failed."));
        }
    })
  }

  increaseAllocationForMarket(coin: string, amount: string): Promise<string> {
    return this._contracts.increaseAllocation(coin, amount);
  }

  decreaseAllocationForMarket(coin: string, amount: string): Promise<string> {
    return this._contracts.decreaseAllocation(coin, amount);
  }

  approveExactAmount(coin: string, nft: NFT, price: string): Promise<boolean> {
    console.log("approveExactAmoouunt function in ");
    return this._transactions
      .pendingTransaction(this._contracts.setExactAllocation(coin, nft, price), nft.network)
      .then((receipt) => {
        return receipt ? receipt.status : Promise.reject(new Error("approving failed."));
      })
  }


}



