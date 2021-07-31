import { Injectable } from '@angular/core';
import { WalletService } from './BlockchainServices/wallet.service';
import { ContractsService } from './BlockchainServices/contracts.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CryptoService } from './crypto.service';
import { DBNFT, NFT, NFTCollection } from "src/declaration";
import { getContract, getProvider } from "src/app.config";
import { RemoteDataService } from './remote-data.service';


@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called
  nft: DBNFT | null = null;
  currentFee: number | null = null;
  currentNetwork: number | null = null;
  nftCollection: NFTCollection | null = null;
  lastSuccessfulTransaction = "";
  testnft: DBNFT = {
    "creator": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
    "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0x96c339b17672978ea1b0a6cc4e992d4e923b3c0fea50964a3a4a031add3e8c6b?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4780953476&Signature=BOa7exVI2imcl2ZlKrdbpWRVRw4DGoLVwe4g%2F%2Fdye%2BmBI4K8Fagfd5yr36h%2FzhK8dt94u2A7rYX%2BId6ja3QnNMZAZ%2BkoGrVW401YTzhpvghi2KWwxgPhKFeWQE2hhl8EDCE5T0hXtADt61Vi12kWeLEIpm2HoDuE3xL7cgkePEO7risNyfqIgPCUxyZ0YiEoOR7gso1rwUJ72sy%2FSrqi87CO50B9pUOtWUbEUzOld8a8jYbiYvgyFVuD8i4UqGIv0rmkzC2DZ4n5RhfGuVJMXOe7fABGgIqwCCWCXLDGsQ84o0BAVKkyU3%2FWuLU90EBKiw8wG%2BIrOLI9Wnfm%2BfhYSg%3D%3D",
    "contentHash": "0x96c339b17672978ea1b0a6cc4e992d4e923b3c0fea50964a3a4a031add3e8c6b",
    "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0x96c339b17672978ea1b0a6cc4e992d4e923b3c0fea50964a3a4a031add3e8c6b?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4780953476&Signature=RzXJ277wMe1pFzBA9YtPufOzHgSHt%2B9yi7sLMsAAkRpf38EJVWsxAE54iva8OITjz%2BzjLBe0SqRygLoZ%2BsUPy43oZDn5qtGYQ62Xpa0fFUesmWE%2BTztN6C5R%2BzxqmjH7tDeoRiU2c%2B2xZ21ria6F6dXuF7tiWLaIg1JoleTISjgjhGGW9In3kyxMbMmIocr5NMUdzh2kHoo8j5RLN50kiQnblzxVA8KGPZ7%2FJrPQU58VonCbujxMhLWoyPbJpQ3DrP3NynDLlHB2KfrYCW%2F1QVVQegHbWIgC6UQjGCD3kKrgkEZxUcJmIsVKLcxDlZNQisrI7NRRL11B6ALoSTp3ug%3D%3D",
    "contractAddress": "0x4De41909a50B92b025BA95f8ddf7e7a126dC40Cd",
    "tokenId": "0x5b201a7d86c7fabb8c99f15ba50c7cff",
    "pHash": "c38e18c047cbc680",
    "owner": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
    "chainId": 97,
    "name": "Takes Two",
    "price":"200"
  }
  
  constructor(private _walletService: WalletService,
    private _contracts: ContractsService, crypto: CryptoService,
    private _remote: RemoteDataService) {
    _walletService.networkObservable.subscribe((network) => {
      this.currentNetwork = network;
    });
   this.nft = this.testnft;
  }

  initFee(): void {
    if (this.currentNetwork) {
      this._contracts.getNFTFee(this.currentNetwork)
        .then((fee: any) => {
          if (fee) {
            this.currentFee = fee;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } 
  }

  mintNFT(nft: NFT): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._validNFT(nft)) {
        this._contracts.mintNFT(nft)
          .then((transactionHash) => {
            console.log("transaction hash is", transactionHash);
            this.lastSuccessfulTransaction = transactionHash;
            this.nft = nft;
            resolve(this.lastSuccessfulTransaction);
          })
          .catch((err) => {
            reject(err);
          });
      }
      else {
        reject(new Error("not a valid NFT"));
      }
    });

  }

  public uploadNFT(nft: NFT, file: File) {
    if (file) {
      if (nft) {
        this._remote.uploadFile(nft, file);
      }
    }
  }

  getNFT(parameter?: string, value?: string): Observable<DBNFT | null> {
    const nftObservable: BehaviorSubject<DBNFT | null> = new BehaviorSubject<DBNFT | null>(this.nft);
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
        console.log("doing this");
        return this._getAllNFTs();
      }
    }

  }

  getOwner(nft: NFT): Promise<string | null>{
    return this._contracts.getOwner(nft);
  }

  setNFT(nft: DBNFT) {
    this.nft = nft;
  }

  /*getNFTbyId(tokenId: string): Observable<DBNFT> {
    return this._remote.getNFT(tokenId);
  }*/

  private _validNFT(nft: NFT): boolean {
    if (nft) {
      let validAddress: boolean = this._walletService
        .isValidAddress(nft?.owner, "ETH");
      let validNetwork: boolean = getProvider(nft?.chainId) ? true : false;
      //add verify tokenId and contentHash
      console.table({
        "validAddress": this._walletService.isValidAddress(nft?.owner, "ETH"),
        "validNetwork": getProvider(nft?.chainId) ? true : false
      })
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
