import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { getNetwork } from 'src/app.config';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
import { DBNFT } from 'src/declaration';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private _wallet:WalletService, private _nftManager: NFTManagerService,
  private _router:Router, private _market:MarketService) { }
  nft: DBNFT = {
    name: "Nothing To Show",
    tokenId: "0x0000000",
    owner: "0x00000000",
    creator: "0x000000000",
    chainId: 97,
    contentHash: "0x000000",
    contractAddress: "0x0000000"
  };
  messageForUser: string = "";
  marketPermission: boolean = false;
  account: string | null = null;
  nftOwner: string = "";
  haveNFT: boolean = false;
  readyForMarket: boolean = false;
  allowOne: boolean = false;
  allowAll: boolean = false;
  sellingForm: FormGroup = new FormGroup({
    price: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this._wallet.listenForAccount()
      .subscribe((account) => {
        if (account) {
          this.account = account;
        }
       });
    this._nftManager.getNFT()
      .subscribe((nft: DBNFT | null) => {
        if (nft) {
          this.nft = nft;
          this.haveNFT = true;
        }
        else {
          this.haveNFT = false;
        }
      });
  }

  getNetwork(chainId: number): string {
    if (getNetwork(chainId)) {
      return getNetwork(chainId).name;
    }
    return "N/A";
  }

  grantMarketSinglePermission(): void {
    if (this._nftManager.nft) {
      this._market.grantSinglePermission(this.nft)
        .then((result) => {
          console.log('grant result', result);
        });
    }
    
  }
  
  goToNFT() {
    if (this.nft) {
      this._nftManager.setNFT(this.nft);
      this._router.navigate(['nft']);
    }
  }

  isOwner() :boolean{
    if (this.nft && this.account) {
      return this.nft.owner.toUpperCase() == this.account.toUpperCase();
    }
    else {
      return false;
    }
  }
}
