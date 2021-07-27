import { Component, OnInit } from '@angular/core';
import { DBNFT, NFT } from 'src/declaration';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { NFTManagerService } from '../Services/nft-manager.service';
import { getNetwork } from 'src/app.config';
import { Router } from '@angular/router';
import { ContractsService } from '../Services/BlockchainServices/contracts.service';
@Component({
  selector: 'app-manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.css']
})
export class ManageNftComponent implements OnInit {
  nft: DBNFT = {
    "chainId": 97,
    "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
    "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=MfQarsaBpjIj8PyIq0BPKTvoWgweTFPqd2ZLp61PPjiaAA5MUzwi5s15n1y5vREiDaLI1xneXcecZdyjbJzXTFEV7sXHtrlc8%2BFwyexYosb8380mTIgTyOnfRDac24HOqJ3U2DxQQ80Uwbsr6qme3aNGVYbUodvQcTEdkkykQ0NWgxU%2B17fV3twDkPZ3tfniB%2Bsv42kljGbLoimWuBcLmn9dp5CnfgSjCnPyhUAv41GzAbPVaDlPK%2BrrfhOZUihRsviC4%2FPmXD%2BVGF1TSPdZY1HeLD9Gpc3OyWkwny%2FZMfGZvh72B5yJi9lZtYBFHJoce3gaaAklUokIcxgZqQGtSg%3D%3D",
    "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
    "name": "Test Two",
    "pHash": "c80418c4e42020c2",
    "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
    "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
    "beneficiary": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
    "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1",
    "onSale": true,
    "price": "20",
    "currency":"moto",
    
  };
  error: boolean = false;
  errorMessage: string = "";
  currentNetwork: number | null = null;
  account: string | null = null;
  constructor(private _nftManager: NFTManagerService,
    private _wallet: WalletService, private _router: Router,
    private _contracts:ContractsService) {

  }

  ngOnInit(): void {
    this._wallet.getAccount()
      .subscribe((account) => {
        this.account = account;
      });
    this._wallet.getNetwork()
      .subscribe((chainId: number | null) => {
        this.currentNetwork = chainId;
        this.checkNetwork(this.nft);
      });
    this.checkNetwork(this.nft);
    this._nftManager.getOwner(this.nft)
      .then((owner) => {
        console.log("owner is ",owner);
      })
      .catch((err) => {
        console.log("err herre", err);
      })
  }

  goToNFT() {
    if (this.nft) {
      this._nftManager.setNFT(this.nft);
      this._router.navigate(['nft']);
    }
  }

  showPrice(price:string): string {
    return '';
  }

  getNetwork(chainId: number): string {
    if (getNetwork(chainId)) {
      return getNetwork(chainId).name;
    }
    return "";
  }
  
  imgToShow(): string {
    if (this.nft.smImg) {
      return this.nft.smImg;
    }
    else {
      return "../../../../assets/HD2.jpg";
    }
  }

  isBuyer(): boolean {
    let onsale: boolean = this.nft.onSale ? this.nft.onSale : false;
    let isOwner: boolean = this.account == this.nft.creator ? true : false;
    
    return (onsale && !isOwner);
  }

  isSeller(): boolean {
    let onsale: boolean = this.nft.onSale ? this.nft.onSale : false;
    let isOwner: boolean = this.account === this.nft.creator ? true : false;
    console.table({ "aacount": this.account, "creator": this.nft.creator ,"isOwner":isOwner,"onsale":onsale});
    return (onsale && isOwner);
  }

  private checkNetwork(nft: NFT) {
    if (this.currentNetwork && (nft.chainId != this.currentNetwork)) {
      this.error = true;
      this.errorMessage = "Your wallet is currently connected to a \
      different decentralized network than this NFT was created. "
    }
  }
}
