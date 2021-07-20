import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NFTManagerService } from '../../Services/MarketServices/nft-manager.service';
import { Location } from "@angular/common";
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { SellDialogComponent } from '../sell-dialog/sell-dialog.component';
@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  account: string | null = null;
  nft: any = {
    name: "NOTHING TO SHOW",
    creator: "0x0000000000000000000000000000000000000000",
    tokenId: "0x000000000000000000000000000000000000000000000000000000",
    chainId: 0,
    beneficiary: "0x0000000000000000000000000000000000000000",
    contentHash: "0x000000000000000000000000000000000000000000000000000000000000000",
    pHash: "00000000000000000000000"
  };
  tokenId: string | null = null;
  owner: boolean = false;
  constructor(private readonly location: Location, private _nftManager: NFTManagerService,
    private readonly _route: ActivatedRoute, private _router: Router,
    private readonly _walletService: WalletService) {
    //TODO: this.nft is null on reload, need to go back and click again
    
    if (_nftManager.nft) {
      this.nft = _nftManager.nft;
      this.location.replaceState(this._router.url.toString() + "?tokenId=" + this.nft.tokenId);
    }
    this.nft = {
      "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
      "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
      "name": "Test Two",
      "pHash": "c80418c4e42020c2",
      "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
      "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=MfQarsaBpjIj8PyIq0BPKTvoWgweTFPqd2ZLp61PPjiaAA5MUzwi5s15n1y5vREiDaLI1xneXcecZdyjbJzXTFEV7sXHtrlc8%2BFwyexYosb8380mTIgTyOnfRDac24HOqJ3U2DxQQ80Uwbsr6qme3aNGVYbUodvQcTEdkkykQ0NWgxU%2B17fV3twDkPZ3tfniB%2Bsv42kljGbLoimWuBcLmn9dp5CnfgSjCnPyhUAv41GzAbPVaDlPK%2BrrfhOZUihRsviC4%2FPmXD%2BVGF1TSPdZY1HeLD9Gpc3OyWkwny%2FZMfGZvh72B5yJi9lZtYBFHJoce3gaaAklUokIcxgZqQGtSg%3D%3D",
      "chainId": 97,
      "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1",
      "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
      "beneficiary": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D"
    };

    this._walletService.accountObservable.subscribe((account) => {
      this.account = account;
      this.updateOwner();
    });
  }

  ngOnInit(): void {
    /*
    this._route.queryParams.subscribe((params) => {
      this.tokenId = params["tokenId"];
      if (this.tokenId) {
        this._nftManager.getNFTbyId(this.tokenId)
          .subscribe((snapshots) => {
            console.log("resullt", snapshots);
            this.nft = snapshots.docs[0].data();
          });
      }

    });*/
    //http://localhost:4200/nft-marketplace/nft

  }

  private addNavigation(tokenId: string) {
    const params = new HttpParams();
    params.append("tokenId", tokenId);
    this.location.go(this._router.url.split("?")[0], params.toString());
  }

  ngOnChange(): void {

  }

  updateOwner(): void {

    if (this._walletService) {
      if (this.nft.beneficiary == this.account) {
        this.owner = true;
      }
    }
  }

  sellNFT():void {
 
  }

}
