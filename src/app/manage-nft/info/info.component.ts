import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getContract, getNetwork } from 'src/app.config';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
import { FileNFT, NFT } from 'src/declaration';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private _wallet: WalletService, private _nftManager: NFTManagerService,
    private _router: Router, private _market: MarketService, public snackBar: MatSnackBar) { }
  nft: FileNFT = {
    name: "Nothing To Show",
    id: "0x0000000",
    owner: "0x00000000",
    creator: "0x000000000",
    network: 97,
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
  yellowLight: boolean = false;
  sellingForm: FormGroup = new FormGroup({
    price: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this._wallet.listenForAddress()
      .subscribe((account) => {
        if (account) {
          this.account = account;
          console.log("account in seller menu", account);
        }
      });

    this._nftManager.getNFT()
      .subscribe((nft: FileNFT | null) => {
        if (nft) {
          this.nft = nft;
          this.haveNFT = true;
          console.log("nft in seller menu", nft);
        }
        else {
          this.haveNFT = false;
        }
      });

    this.checkGlobalPermission(this.nft)
      .then((globalPermission) => {
        if (globalPermission) {
          this.allowAll = true;
          this.allowOne = false;
          this.yellowLight = true;
        }
        else {
          this.checkSinglePermission(this.nft)
        }
      })

  }

  addToMarket() {
    this._market.addToMarket(this.nft)
      .then((transactionHash) => {

        console.log("transaction hasah from market", transactionHash);
      })
      .catch((err) => { 
        if (err) {
          this.openSnackBar(err.messsage, 3000);
        }
      });
  }

  checkSinglePermission(nft: NFT): void {
    this._market.canMarketControlSingle(nft)
      .then((permission: boolean) => {
        if (permission) {
          this.yellowLight = true;
          this.allowOne = true;
        }
      });
  }

  checkGlobalPermission(nft: NFT): Promise<boolean> {
    return this._market.canMarketControlAll(nft);
  }

  getNetwork(network: number): string {
    if (getNetwork(network)) {
      return getNetwork(network).name;
    }
    return "N/A";
  }

  grantMarketSinglePermission(): void {
    if (this._nftManager.nft) {
      this._market.requestSinglePermission(this.nft)
        .then((result: string) => {
          if (result) {
            this.openSnackBar("Permission Granted");
            this.allowOne = true;
            this.yellowLight = true;
          }
        });
    }
  }

  grantMarketTotalPermission(): void {
    if (this._nftManager.nft) {
      this._market.grantTotalPermission(this.nft)
        .then((result: string) => {
          if (result) {
            this.openSnackBar("Permission Granted");
            this.allowAll = true;
            this.allowOne = true;
            this.yellowLight = true;
          }
        });
    }
  }

  goToNFT() {
    if (this.nft) {
      this._nftManager.setNFT(this.nft);
      this._router.navigate(['nft']);
    }
  }

  openSnackBar(message: string, duration: number = 3000) {
    this.snackBar.open(message, "", {
      duration: duration,
    });
  }

  isOwner(): boolean {
    if (this.nft && this.account) {

      return this.nft.owner.toUpperCase() == this.account.toUpperCase();
    }
    else {
      return false;
    }
  }

  checkInput(): void {
    const price = Number.parseFloat(this.sellingForm.get("price")?.value);
    if (price > 0) {
      this.unlock();
      this.nft['price'] = price.toString();
    }
    else {
      this.lock();
      this.openSnackBar("price should be a number greater than zero", 5000);
    }
  }

  private lock(): void {
    this.readyForMarket = false;
    this.yellowLight = true;
  }

  private unlock() {
    this.readyForMarket = true;
    this.yellowLight = false;
  }
}
