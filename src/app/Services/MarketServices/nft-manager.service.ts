import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import { ContractsService } from '../BlockchainServices/contracts.service';
import { Observable, Subject } from 'rxjs';
import { CryptoService } from '../crypto.service';
import { DBNFT, NFT, NFTCollection } from "src/declaration";
import { getProvider } from "src/app.config";
import { RemoteDataService } from '../remote-data.service';
import { DocumentChange, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called
  nft: DBNFT | null = null;
  currentFee: number | null = null;
  currentNetwork: number | null = null;
  nftCollection: NFTCollection = {} as NFTCollection;
  lastSuccessfulTransaction = "";

  constructor(private walletService: WalletService,
    private contracts: ContractsService, crypto: CryptoService,
    private _remote: RemoteDataService) {
    walletService.networkVersion.subscribe((network) => {
      this.currentNetwork = network;
    });

  }

  initFee(): void {
    this.contracts.getNFTFee()
      .then((fee: any) => {
        if (fee) {
          this.currentFee = fee;
        }
      })
  }

  mintNFT(nft: NFT): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._validNFT(nft)) {
        this.contracts.mintNFT(nft)
          .then((transactionHash) => {
            this.lastSuccessfulTransaction = transactionHash;
            resolve(this.lastSuccessfulTransaction);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });

  }

  public uploadFile(nft: NFT, file: File) {
    if (file) {
      if (nft) {
        this._remote.uploadFile(nft, file);
      }
    }
  }

  getNFT(parameter?: string, value?: string): Observable<DBNFT | null> {
    const nftObservable: Subject<DBNFT | null> = new Subject<DBNFT | null>();
    if (value && parameter) {
      return this._remote.getNFT(parameter, value);
    }
    nftObservable.next(this.nft);
    return nftObservable;
  }

  getNFTs(parameters?: string, value?: string): Observable<NFTCollection | null> {
    const nftObservable: Subject<NFTCollection> = new Subject<NFTCollection>();
    if (parameters && value) {
      return this._getNFTs(parameters, value);
    }
    else {
      if (this.nftCollection) {
        nftObservable.next(this.nftCollection);
        return nftObservable;
      }
      else {
        return this._getAllNFTs();
      }
    }

  }

  setNFT(nft: DBNFT) {
    this.nft = nft;
  }

  /*getNFTbyId(tokenId: string): Observable<DBNFT> {
    return this._remote.getNFT(tokenId);
  }*/

  private _validNFT(nft: NFT): boolean {
    if (nft) {
      let validAddress: boolean = this.walletService
        .isValidAddress(nft?.beneficiary, "ETH");
      let validNetwork: boolean = getProvider(nft?.chainId) ? true : false;
      //add verify tokenId and contentHash
      return validAddress && validNetwork;
    }
    else {
      return false;
    }
  }

  private _getAllNFTs(): Observable<NFTCollection> {
    return this._remote.getAllNFTs();
  }

  /**
   * 
   * @param searchParameter 
   * @param searchValue 
   * @returns 
   */
  private _getNFTs(searchParameter: string, searchValue: string): Observable<NFTCollection | null> {
    return this._remote.getNFTs(searchParameter, searchValue);
  }
}
