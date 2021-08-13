import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FileNFT, NFT, NFTCollection } from 'src/declaration';
import { AuthenticationService } from './authentication.service';
import { WalletService } from './BlockchainServices/wallet.service';
import { NFTManagerService } from './nft-manager.service';
import { RemoteDataService } from './remote-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  address: string | null = null;
  isCreator: boolean = false;
  nftCollection: NFTCollection | null = null;
  collectionObservable: BehaviorSubject<NFTCollection | null> = new BehaviorSubject<NFTCollection | null>(this.nftCollection);
  nft: FileNFT | null = null;
  constructor(private _nftManager: NFTManagerService, private _wallet: WalletService,
    private _remote: RemoteDataService, private auth: AuthenticationService,
    private _router: Router, public snackBar:MatSnackBar) {
  }

  getUserAccountToken(): Promise<string | undefined> {
    return this.auth.currentUser()
      .then((currentUser) => {
        return currentUser?.getIdToken(true)
      })
      .then((token) => {
        return token;
      })
  }

  login() :Promise<any>{
    return new Promise((resolve, reject) => {
      this._wallet.initWallet()
        .subscribe((account: string | null) => {
          if (account) {

            this._remote.getNonce(account)
              .subscribe((nonce) => {
                console.log("nonce is ", nonce);
                if (nonce) {
                  this._wallet.getNetwork()
                    .subscribe((networkId) => {
                      if (networkId) {
                        this.openSnackBar("Preparing Login Signature...", 3000, false);
                        this._wallet.getLoginSignature(account, nonce, networkId)
                          .then((sig) => {
                            if (sig) {
                              this.openSnackBar("Verifying Signature ..", 3000, false);
                              this._remote.verifySignature(account, nonce, networkId, sig)
                                .subscribe((token) => {
                                  if (token) {
                                    this.openSnackBar("Signature Accepted", 2000, false);
                                    resolve(this.auth.walletSignIn(token))
                        
                                  }
                                  else {
                                    reject(new Error('Login Error'));
                                  }
                                });
                            }
                          })
                      }
                    })
                }
              });

          }
        });
    });

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
      .subscribe((collection: NFTCollection) => {
        if (collection) {
          this.nftCollection = collection;
        }
      });
  }

  openSnackBar(message: string, duration: number = 3000, error: boolean = true) {
    const colorClass = error ? 'snackbar-error' : 'snackbar-info';
    this.snackBar.open(message, "", {
      duration: duration,
      panelClass: [colorClass]
    });
  }

  getNFTCollection(): Observable<NFTCollection | null> {
    if (!this.nftCollection && this.address) {

      return this._getRemoteNFTs(this.address);
    }
    return this.collectionObservable;
  }

  setNFT(nft: FileNFT): void {
    this.nft = nft;
    this._nftManager.setNFT(nft);
  }

  setNFTCollection(collection: NFTCollection) {

    this.nftCollection = collection;
    this.collectionObservable.next(this.nftCollection);
    this.address = this._getAddress(collection, "creator");
  }

  getNFT(): FileNFT | null {
    if (this.nft) {
      return this.nft;
    }
    return null;
  }

  private _getRemoteNFTs(address: string): Observable<NFTCollection> {
    const collectionObservable: Subject<NFTCollection> = new Subject<NFTCollection>();
    this._nftManager.getNFTs("creator", address)
      .subscribe((remoteCollection: NFTCollection | null) => {
        if (remoteCollection) {
          this.nftCollection = remoteCollection;
          collectionObservable.next(remoteCollection);
        }
      });

    return collectionObservable;
  }

  private _getAddress(nftCollection: NFTCollection, whichAddress: string): string | null {
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
