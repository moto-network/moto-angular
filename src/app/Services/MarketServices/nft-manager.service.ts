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
  nftsArray: any = [];
  nftCollection: NFTCollection = {} as NFTCollection;
  nftProduct: any | null;
  lastSuccessfulTransaction = "";
  collectionObservable: Subject<NFTCollection> = new Subject<NFTCollection>();

  constructor(private walletService: WalletService,
    private contracts: ContractsService, crypto: CryptoService,
    private _remote: RemoteDataService) {
    walletService.networkVersion.subscribe((network) => {
      this.currentNetwork = network;
    });

  }

  initializeNFTcreationFee(): void {
    this.contracts.getNFTFee()
      .then((fee: any) => {
        if (fee) {
          this.currentFee = fee;
        }
      })
  }

  hasLocalCollection(): boolean {
    if (Object.keys(this.nftCollection).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  mintNFT(nft: NFT): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._validNFT(nft)) {
        this.contracts.mintNFT(nft)
          .then((transactionHash) => {
            localStorage.setItem('nft', JSON.stringify(nft));
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

  getNFTs(): Observable<NFTCollection> {
    this._getAllNFTs();//for now...it is small anyways but paginate later
    return this.collectionObservable;
  }

  addToMarket() {
    /**
     * @todo deploy marketplace contract
     * @todo add markteplace contract information to app.config
     * @todo contract service - implement contract calls  call contracts from here
     * promisese
     * @
     */
  }


  getNFTProductForView() {
    return this.nftProduct;
  }


  getNFT(): DBNFT | null {
    return this.nft;
  }

  setNFT(nft: DBNFT) {
    this.nft = nft;
  }

  /*getNFTbyId(tokenId: string): Observable<DBNFT> {
    return this._remote.getNFT(tokenId);
  }*/

  findNFT(value: string, parameter: string) :Observable<DBNFT | null>{
    return this._remote.findNFT(value, parameter);
  } 


  getCreatedNFTs(address: string): Observable<NFTCollection> {
    return this._getNFTs("creator", address);
  }

  getOwnedNFTs(address: string) {

  }

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

  private _getAllNFTs() {
    this._remote.getAllNFTs()
      .subscribe((nftCollection: NFTCollection) => {
        this.nftCollection = nftCollection;
        this.collectionObservable.next(this.nftCollection);
      });
  }

  private _getNFTs(searchParameter: string, searchValue: string): Observable<NFTCollection> {
    this._remote.getMultipleNFTS(searchParameter, searchValue)
      .subscribe((querySnapshot: any) => {
        querySnapshot.forEach((document: QueryDocumentSnapshot<any>) => {

          const remoteNFT: DBNFT = document.data();
          console.log("remote nft is ", remoteNFT);
          this.nftCollection[remoteNFT.tokenId] = remoteNFT;
          this.collectionObservable.next(this.nftCollection);
        });
      });

    return this.collectionObservable;
  }
}
