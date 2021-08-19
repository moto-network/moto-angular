import { Injectable } from '@angular/core';
import { WalletService } from './BlockchainServices/wallet.service';
import { ContractsService } from './BlockchainServices/contracts.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CryptoService } from './crypto.service';
import { Account, FileNFT, ListingNFT, NFT, NFTCollection } from "src/declaration";
import { getContract, getProvider } from "src/app.config";
import { RemoteDataService } from './remote-data.service';


@Injectable({
  providedIn: 'root'
})
export class NFTManagerService {//merge this wit the other NFTManager or wahtever it's called
  nft: NFT | null = null;
  currentFee: number | null = null;
  currentNetwork: number | null = null;
  nftCollection: NFTCollection<NFT> | null = null;
  lastSuccessfulTransaction = "";
  testnft: FileNFT = {
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
  }

  constructor(private _walletService: WalletService,
    private _contracts: ContractsService, crypto: CryptoService,
    private _remote: RemoteDataService) {
    _walletService.networkObservable.subscribe((network) => {
      this.currentNetwork = network;
    });
       //this.nft = this.testnft;
  }

  initFee(): void {
    if (this.currentNetwork) {
      this._contracts.getNFTFee(this.currentNetwork, "nft")
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

  getNFTDownloadLink(nft: NFT, userIDToken:string):Observable<string> {
    return this._remote.generateDownloadLink(nft, userIDToken)
  }

  mintNFT(account:Account, nft: NFT): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._validNFT(nft)) {
        this._contracts.createNFT(account, nft)
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

  public uploadNFT(nft: NFT, file: File) :Observable<boolean>{
    return this._remote.uploadFile(nft, file);
  }

  getNFT<NFTType extends NFT>(parameter?: string, value?: string): Observable<NFTType | null> {
    const nftObservable: BehaviorSubject<NFTType | null> = new BehaviorSubject<NFTType | null>(this.nft as NFTType);
    if (value && parameter) {
      return this._remote.getNFT<NFTType>(parameter, value);
    }
    nftObservable.next(this.nft as NFTType);
    return nftObservable;
  }

  getNFTs<NFTType extends NFT>(parameters?: string, value?: string): Observable<NFTCollection<NFTType> | null> {
    const nftObservable: Subject<NFTCollection<NFTType>> = new Subject<NFTCollection<NFTType>>();
    if (parameters && value) {
      return this._getNFTs<NFTType>(parameters, value);
    }
    else {
      if (this.nftCollection) {
        nftObservable.next(this.nftCollection as NFTCollection <NFTType>);
        return nftObservable;
      }
      else {
        console.log("doing this");
        return this._getAllNFTs();
      }
    }
  }


  getOwner(nft: NFT): Promise<string | null> {
    this._contracts.getNFTOwner(nft)
      .then((result) => {
        console.log("result ", result);
      })
    return this._contracts.getNFTOwner(nft);
  }

  setNFT(nft: FileNFT) {
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

  private _getAllNFTs<NFTType extends NFT>(): Observable<NFTCollection<NFTType>> {
    return this._remote.getAllNFT<NFTType>();
  }

  /**
   * 
   * @param searchParameter 
   * @param searchValue 
   * @returns 
   */
  private _getNFTs<NFTType extends NFT>(searchParameter: string, searchValue: string): Observable<NFTCollection<NFTType> | null> {
    return this._remote.getNFTs(searchParameter, searchValue);
  }
}
