import { Injectable } from '@angular/core';
import { WalletService } from '../BlockchainServices/wallet.service';
import { ContractsService } from '../BlockchainServices/contracts.service';
import { AngularFirestore } from '@angular/fire/firestore';
//import { collection, getDocs } from "firebase/firestore";
import { Observable } from 'rxjs';
import { sign } from 'crypto';
import { CryptoService } from '../crypto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NFT } from "src/declaration";
import { getProvider, UPLOAD_URL } from "src/app.config";
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

  initNFTData():void{
    this.nft = {
      name: "",
      beneficiary: "",
      chainId: 56,
      tokenId: "",
      contentHash: "",
      creator: "",
      contractAddress:""
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

  public uploadFile(file:File) {
    const formData = new FormData();

    if (file) {
      formData.append('nft', JSON.stringify(this.nft));
      formData.append('file', file);
      this.http.post<any>(UPLOAD_URL, formData).subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
    }


  }


  getNFTProductForView() {
    return this.nftProduct;
  }


  setNFT(nft: NFT) {
    this.nft = nft;
    console.log("nftproduct set", this.nft);
  }

  getNFTbyId(tokenId:string):Observable<any> {
   return  this._db.collection("NFTs", ref => ref.where('tokenId', '==', tokenId)).get()
  }

  getNFTs() {
    if (this.nftsArray.length == 0) {
      this._db.collection("NFTs").get()
        .subscribe((results) => {
          results.forEach((doc: any) => {
            this.nftsArray.push(doc.data());
          });
        });
    }
    
  }
}
