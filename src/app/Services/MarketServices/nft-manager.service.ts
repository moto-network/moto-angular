import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import { ContractsService } from '../BlockchainServices/contracts.service';
import { Observable, Subject } from 'rxjs';
import { CryptoService } from '../crypto.service';
import { DBNFT, NFT, NFTCollection } from "src/declaration";
import { getProvider } from "src/app.config";
import { RemoteDataService } from 'src/app/src/app/Services/remote-data.service';
import { DocumentChange, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called
  nft: NFT | null = null;
  currentFee: number | null = null;
  currentNetwork: number | null = null;
  nftsArray: any = [];
  nftCollection: NFTCollection = {} as NFTCollection;
  nftProduct: any | null;
  lastSuccessfulTransaction = "";
  collectionObservable: Subject<NFTCollection> = new Subject<NFTCollection>();
  profile: string | null = null;
  constructor(private walletService: WalletService,
    private contracts: ContractsService, crypto: CryptoService,
    private _remote: RemoteDataService) {
    walletService.networkVersion.subscribe((network) => {
      this.currentNetwork = network;
    });
    this._getAllNFTs();
  }


  initializeNFTcreationFee(): void {
    this.contracts.getNFTFee()
      .then((fee: any) => {
        if (fee) {
          this.currentFee = fee;
        }
      })
  }


  getNFTCollection(): Observable<NFTCollection> {
    return this.collectionObservable;
  }

  mintNFT(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._validNFT() && this.nft) {
        this.contracts.mintNFT(this.nft)
          .then((transactionHash) => {
            localStorage.setItem('nft', JSON.stringify(this.nft));
            this.lastSuccessfulTransaction = transactionHash;
            resolve(this.lastSuccessfulTransaction);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });

  }

  initNFTData(): void {
    this.nft = {
      name: "",
      beneficiary: "",
      chainId: 56,
      tokenId: "",
      contentHash: "",
      creator: "",
      contractAddress: ""
    }
  }


  private _validNFT(): boolean {
    if (this.nft) {
      let validAddress: boolean = this.walletService
        .isValidAddress(this.nft?.beneficiary, "ETH");
      let validNetwork: boolean = getProvider(this.nft?.chainId) ? true : false;
      //add verify tokenId and contentHash
      return validAddress && validNetwork;
    }
    else {
      return false;
    }
  }

  public uploadFile(file: File) {
    if (file) {
      if (this.nft) {
        this._remote.uploadFile(this.nft, file);
      }
    }
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


  setNFT(nft: NFT) {
    this.nft = nft;
    console.log("nftproduct set", this.nft);
  }

  getNFTbyId(tokenId: string): Observable<QuerySnapshot<any>> {
    return this._remote.getNFT(tokenId);
  }

  private _getAllNFTs() {
    this._remote.getAllNFTs()
      .subscribe((querySnapshot) => {

        querySnapshot.docChanges().forEach((change: DocumentChange<any>) => {
          let nft: DBNFT = change.doc.data();
          this.nftCollection[nft.tokenId] = nft;
          console.log("docChange");
          this.collectionObservable.next(this.nftCollection);
        });

        /*  querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<any>) => {
            let nft: DBNFT = docSnapshot.data();
            this.nftCollection[nft.tokenId] = nft;
            console.log("forEach");
          });
       */
      });
  }


  getNFTs(searchParameter: string):Observable<NFTCollection> {
    const nftArray: DBNFT[] = [];
    this._remote.getMultipleNFTS(searchParameter)
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((document: QueryDocumentSnapshot<any>) => {
          nftArray.push(document.data())
          const remoteNFT = document.data();
          this.nftCollection[document.data(remoteNFT.tokenId)] = remoteNFT;
        });
      });
    this.collectionObservable.next(this.nftCollection);
    return this.collectionObservable;
  }
}
