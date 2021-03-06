import { Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';
import { Subscription } from 'rxjs';

import { getContract, getNetwork } from 'src/app.config';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
import { TransactionsService } from 'src/app/Services/transactions.service';
import { FileNFT, ListingNFT, NFT } from 'src/declaration';
declare var anime: any;
@Component({
  selector: 'seller-menu',
  templateUrl: './seller-menu.component.html',
  styleUrls: ['./seller-menu.component.css']
})
export class SellerMenuComponent implements OnInit {

  constructor(private _wallet: WalletService, private _nftManager: NFTManagerService,
    private _router: Router, private _market: MarketService,
    private _profile: ProfileService, private _transactions: TransactionsService) { }
  nft: NFT & Partial<ListingNFT> = {
    name: "Nothing To Show",
    id: "0x0000000",
    owner: "0x00000000",
    creator: "0x000000000",
    network: 97,
    contentHash: "0x000000",
    contractAddress: "0x0000000"
  };
  loading: boolean = false;
  price: string = "";
  messageForUser: string = "";
  marketPermission: boolean = false;
  account: string | null = null;
  nftOwner: string = "";
  haveNFT: boolean = false;
  readyForMarket: boolean = false;
  allowOne: boolean = false;
  tranSub: Subscription | null = null;
  allowAll: boolean = false;
  yellowLight: boolean = false;
  sellingForm: FormGroup = new FormGroup({
    price: new FormControl('', Validators.required)
  });
  scalingAnimation: any = null;
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
  ngAfterViewInit(): void {

    this.scalingAnimation = anime({
      targets: '#main-content-container',
      scale: [1, 0.98, 1],
      duration: 3000,
      easing: "easeInOutSine",
      loop: true,
      autoplay: false
    })
  }

  ngOnDestroy(): void {
    this.tranSub?.unsubscribe();
  }
  /**
   * this is behind a locked input so it cant be called before input is validated
   */
  addToMarket() {
    this.startLoadingAnimation();
    if (this.nft && this.price) {
      this._market.addToMarket(this.nft, this.price)
        .then((successStatus) => {
          this.loading = true;
          if (successStatus) {
            this._profile.openSnackBar("Moto Database Updated.", 2500, false);
            this._router.navigate(['manage-nft', 'listing-management']);
            this.stopAnimations();
          }
          else {
            this._profile.openSnackBar("something went wrong", 3000);
          }


        })
        .catch((err) => {
          if (err) {
            this._profile.openSnackBar(err.messsage, 3000);
          }
        });
    }
    else {
      this._profile.openSnackBar("Missing Price.", 2000);
    }

  }

  startLoadingAnimation() {
    this.loading = true;
    let sellbutton = document.getElementById("sell-button");
    if (sellbutton) {
      console.log("sellbutton found")
      sellbutton.style.pointerEvents = "none";
      sellbutton.style.visibility = "hidden";
    }
  }

  stopAnimations() {
    let sellbutton = document.getElementById("sell-button");
    if (sellbutton) {
      sellbutton.style.pointerEvents = "all";
      sellbutton.style.visibility = "visible";
    }
  }

  checkSinglePermission(nft: NFT): void {
    this._market.canMarketControlSingle(nft)
      .then((permission: boolean) => {
        if (permission) {
          this.yellowLight = true;
          this.allowOne = true;
          this.marketPermission = true;
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
    this.allowOne = true;
    this.loading = true;
    this._profile.openSnackBar("Please wait...", 2000, false);
    if (this._nftManager.nft) {
      this._transactions
        .pendingTransaction(this._market.requestSinglePermission(this.nft), this.nft.network)
        .then((receipt) => {
          if (receipt.status) {
            this.loading = false;
            console.log("got it ");
            this._profile.openSnackBar("Permission Granted.", 2000, false);
            this.allowOne = true;
            this.yellowLight = true;
          }
        });
    }
  }

  grantMarketTotalPermission(): void {
    this.allowAll = true;
    this._profile.openSnackBar("Please wait...", 2000, false);
    if (this._nftManager.nft) {
      this._transactions
        .pendingTransaction(this._market.grantTotalPermission(this.nft), this.nft.network)
        .then((receipt) => {
          if (receipt) {
            this._profile.openSnackBar("Permission Granted.", 2000, false);
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
      this.price = price.toString();

    }
    else {
      this.lock();
      this._profile.openSnackBar("price should be a number greater than zero", 5000);
    }
  }

  private lock(): void {
    this.readyForMarket = false;
    this.yellowLight = true;
  }

  private unlock() {
    console.log("permission is ", this.marketPermission);
    if (this.marketPermission) {
      this.readyForMarket = true;
      this.yellowLight = false;
    }
  }
}
