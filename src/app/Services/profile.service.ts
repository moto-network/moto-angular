import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, from, Observable, Subject, throwError } from 'rxjs';
import { filter, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { Account, FileNFT, NFT, NFTCollection, TransactionReceipt } from 'src/declaration';
import { AuthenticationService } from './authentication.service';
import { WalletService } from './BlockchainServices/wallet.service';
import { NFTManagerService } from './nft-manager.service';
import { RemoteDataService } from './remote-data.service';
import { TransactionsService } from './transactions.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  address: string | null = null;
  isCreator: boolean = false;
  nftCollection: NFTCollection<FileNFT> | null = null;
  collectionObservable: BehaviorSubject<NFTCollection<FileNFT> | null> = new BehaviorSubject<NFTCollection<FileNFT> | null>(this.nftCollection);
  nft: FileNFT | null = null;
  constructor(private _nftManager: NFTManagerService, private _wallet: WalletService,
    private _remote: RemoteDataService, private auth: AuthenticationService,
    private _router: Router, public snackBar: MatSnackBar) {
  }

  getUserAccountToken(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      this.auth.currentUser()
        .then((currentUser) => {
          return currentUser?.getIdToken(true)
        })
        .then((token) => {
          if (token) {
            resolve(token);
          }
          else {
            reject(new Error("No token"));
          }
        })
    });

  }

  login(): Observable<boolean> {
    this.openSnackBar("Preparing Login Procedure", 3000, false);
    return from(this._wallet.initWallet())
      .pipe(
        filter(status => status == true),
        mergeMap(() => {
          this.openSnackBar("Preparing Wallet", 3000, false);
          return this._wallet.getAccount()
        }),
        mergeMap(account => {
          this.openSnackBar("Communicating with Remote server", 3500, false);
          return from(this.getUserToken(account))
        }),
        mergeMap(token => {
          this.openSnackBar("User Token received.", 3000, false);
          return from(this.auth.walletSignIn(token))
        }),
        map(user => {
          this.openSnackBar("All done.", 3000, false);
          return user ? true : false
        })
      );
  }

  getDownloadLink(nft: NFT): Promise<string | void> {
    return new Promise((resolve, reject) => {
      this.getUserAccountToken()
        .then((token) => {
          if (!token) {
            reject(new Error("user not logged in"));
          }
          this._nftManager.getNFTDownloadLink(nft, token!)
            .subscribe((link) => {
              if (link) {
                resolve(link);
              }
              else {
                reject(new Error("no link available"));
              }
            })

        });
    });
  }

  initProfile(address: string): void {
    this.address = address;
    this._getRemoteNFTs(this.address)
      .subscribe((collection: NFTCollection<NFT | FileNFT>) => {
        if (collection) {
          this.nftCollection = collection;
        }
      });
  }

  openSnackBar(message: string, duration: number = 5000, error: boolean = true) {
    const colorClass = error ? 'snackbar-error' : 'snackbar-info';
    this.snackBar.open(message, "", {
      duration: duration,
      panelClass: [colorClass]
    });
  }

  notifyAboutTransaction(nft: NFT) {
    this.openSnackBar("Transaction Confirmed.", 4000, false);
  }

  getNFTCollection(): Observable<NFTCollection<FileNFT> | null> {
    if (!this.nftCollection && this.address) {

      return this._getRemoteNFTs(this.address);
    }
    else {
      return this.collectionObservable;
    }
   
  }

  setNFT(nft: FileNFT): void {
    this.nft = nft;
    this._nftManager.setNFT(nft);
  }

  setNFTCollection(collection: NFTCollection<NFT>) {

    this.nftCollection = collection;
    this.collectionObservable.next(this.nftCollection);
    const address = this._getAddress(collection, "creator");
    if (address && this.address) {
      this.address = address;
     }
  }

  getNFT(): FileNFT | null {
    if (this.nft) {
      return this.nft;
    }
    return null;
  }

  private async getUserToken(account: Account): Promise<string> {
    const nonce: string | undefined = await this._remote.getNonce(account)
      .pipe(filter(nonce => nonce != null && typeof nonce !== "undefined"))
      .toPromise();
    const signature: string = await this._wallet.getLoginSignature(account, nonce!);
    return this._remote
      .verifySignature(account, nonce!, signature).toPromise();
  }

  private _getRemoteNFTs(address: string): Observable<NFTCollection<FileNFT>> {
    const collectionObservable: Subject<NFTCollection<FileNFT>> = new Subject<NFTCollection<FileNFT>>();
    this._nftManager.getNFTs<FileNFT>("creator", address)
      .subscribe((remoteCollection: NFTCollection<FileNFT> | null) => {
        if (remoteCollection) {
          this.nftCollection = remoteCollection;
          collectionObservable.next(remoteCollection);
        }
      });

    return collectionObservable;
  }

  private _getAddress(nftCollection: NFTCollection<NFT>, whichAddress: string): string | null {
    const tokenId = Object.keys(nftCollection)[0];
    const nft: NFT = nftCollection[tokenId];
    if (whichAddress == "creator") {
      return nft.creator;
    }
    else if (whichAddress == "owner") {
      return nft.owner;
    }
    return null;
  }

}
