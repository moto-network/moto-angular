import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import { ContractsService } from '../BlockchainServices/contracts.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { sign } from 'crypto';
import { CryptoService } from '../crypto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NFT } from "src/declaration";
import { getProvider } from "src/app.config";
@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called
  nft: NFT | null = null;
  currentFee: number | null = null;
  currentNetwork: number | null = null;
  nftsArray: any = [];
  nftProduct: any | null;
  lastSuccessfulTransaction = "";
  recordNFTurl: string = "https://us-central1-motonetwork.cloudfunctions.net/recordNFT";

  constructor(private walletService: WalletService,
    private contracts: ContractsService, private _db: AngularFirestore,
    crypto: CryptoService, private http: HttpClient) {
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


  mintNFT(): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this._validNFT() && this.nft) {
        this.contracts.mintNFT(this.nft)
          .then((transactionHash) => {
            localStorage.setItem('nft', JSON.stringify(this.nft));
            this.recordNFT();
            this.lastSuccessfulTransaction = transactionHash;
            resolve(this.lastSuccessfulTransaction);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });

  }

  initNFTData():void{
    this.nft = {
      name: "",
      beneficiary: "",
      chainId: 56,
      tokenId: "",
      contentHash:""
    }
  }


  private _validNFT():boolean {
    if (this.nft) {
      let validAddress:boolean = this.walletService
        .isValidAddress(this.nft?.beneficiary, "ETH");
      let validNetwork: boolean = getProvider(this.nft?.chainId) ? true : false;
      //add verify tokenId and contentHash
      return validAddress && validNetwork; 
    }
    else {
      return false;
    }
  }

  recordNFT() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin":"http://motonetwork.io"
        })};
    this.http.post(this.recordNFTurl, { "nft": this.nft }, httpOptions)
      .subscribe(result => {
        console.log(result);
      });
  }

  getNFTProductForView() {
    return this.nftProduct;
  }


  setNFTProductForView(nft: any) {
    this.nftProduct = nft;
    console.log("nftproduct set", this.nftProduct);
  }


  getMarketplaceNFTs(): Observable<any> {
    console.trace();
    console.log('remote called ');
    let results: Observable<any>;
    let remoteResults: any[] = [];
    let nftsRef: AngularFirestoreCollection = this._db.collection("NFTs",
      ref => ref.where("on_sale", "==", true));
    return nftsRef.valueChanges();
  }
}
