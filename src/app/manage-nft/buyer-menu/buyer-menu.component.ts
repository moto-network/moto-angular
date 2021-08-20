import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';


import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
import { ProfileService } from 'src/app/Services/profile.service';
import { SimpleMessageDialogComponent } from 'src/app/simple-message-dialog/simple-message-dialog.component';
import { FileNFT, Listing, ListingNFT, NFT } from 'src/declaration';
@Component({
  selector: 'app-buyer-menu',
  templateUrl: './buyer-menu.component.html',
  styleUrls: ['./buyer-menu.component.css']
})
export class BuyerMenuComponent implements OnInit {
  insufficientFunds: boolean = true;
  shortPrice: string = '2000';
  motoBalance = new BigNumber(0);
  approvedAmount = new BigNumber(0);
  priceInSubUnits = new BigNumber(0);
  nft: Partial<ListingNFT> & FileNFT | null = null;
  loading = false;
  //numberWithSpaces(getFormattedPrice('229834792384'))
  constructor(private _market: MarketService,
    private _nftMananger: NFTManagerService, private _router: Router,
    public snackBar: MatSnackBar, public dialog: MatDialog, private _wallet: WalletService,
  private _profile:ProfileService) { }

  ngOnInit(): void {
    this._nftMananger.getNFT<ListingNFT & FileNFT>()
      .subscribe((nft: ListingNFT & FileNFT | null) => {
        if (nft) {
          this.nft = nft;
          this.priceInSubUnits = new BigNumber(this.nft.order!.price!);
          
        }
      });
    this.initAccountData();
  }

  buyNFT() {
    this.loading = true;
    if (this.nft) {
      console.log(this.nft);
      this._profile.openSnackBar("Communication with Blockchain", 4000, false);
      this._market.buyNFT(this.nft as ListingNFT, this.priceInSubUnits.toString())
        .then((listing: Listing) => {
          if (listing) {
            this._router.navigate(['user-dashboard']);
          }
        })
        .catch((err) => {
          this.loading = false;
          this._profile.openSnackBar(err, 3000);
        });
    }
    
  }
  
  initAccountData(): void {
    this._wallet.getAccount()
      .subscribe((account) => {
        this._market.getCoinBalance(account)
          .then((balance) => {
            if (balance) {
              console.log("coin balance is ", balance);
              this.motoBalance = new BigNumber(balance);
              if (this.motoBalance.gte(this.priceInSubUnits)) {
                this.getAvailableAllowance();
              }
            }
          })
          .catch((err) => {
            console.log("err", err);
            this._profile.openSnackBar(err.message, 3000);
          });
       });
    
  }

  getAvailableAllowance():void {
    this._market.getAllowance()
      .then((allowance: string) => {
        if (allowance) {
          console.log("allowance is ", allowance);
          this.approvedAmount = new BigNumber(allowance);
        }
      })
      .catch((err) => {
        console.log("err", err);
        this._profile.openSnackBar(err.message, 3000);
      });
  }

  

  approveExactAmount() {
    if (this.nft) {
      this.loading = true;
      this._market.approveExactAmount('moto', this.nft, this.priceInSubUnits.toString())
        .then((approved) => {
          console.log("approved is ", approved);
          if (approved) {
            this.loading = false;
            this.getAvailableAllowance();
          }
          else {
            Promise.reject(new Error("approval error."));
          }
        })
        .catch((err) => {
          this._profile.openSnackBar(err, 4000);
        });
    }
  }

  getFormattedPrice(price: string | undefined): string {
    if (price) {
      return this._market.formatCurrency(price);
    }
    else {
      return "";
    }
  }

  openDialog(title: string, message: string) :void{
    this.dialog.open(SimpleMessageDialogComponent,
      { data: { title: title, message: message } });
  }

  numberWithSpaces(bigNum: string) {

    const value = this.getFormattedPrice(bigNum);
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  shortenPrice(valueString: string | undefined): string {
    const formattedPrice: string = this.getFormattedPrice(valueString);
    const value: number = parseFloat((formattedPrice ? formattedPrice : "0"));
    const NumberSuffix = require('number-suffix');

    if (value >= 1000) {
        return NumberSuffix.format(value, { precision: 2 });
    }
    else {
      return value.toString();
    }
  }

  
  isApprovedSufficient(): boolean {
    return this.approvedAmount.gte(this.priceInSubUnits) && this.approvedAmount.gt(0);
  }

  isMotoBalanceInsufficient(): boolean {
    return this.motoBalance.lt(this.priceInSubUnits);
  }

  
}
