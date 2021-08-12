import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';

import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { MarketService } from 'src/app/Services/market.service';
import { NFTManagerService } from 'src/app/Services/nft-manager.service';
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

  //numberWithSpaces(getFormattedPrice('229834792384'))
  constructor(private _market: MarketService,
    private _nftMananger: NFTManagerService, private _router: Router,
  public snackBar: MatSnackBar, public dialog:MatDialog, private _wallet:WalletService) { }

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
    if (this.nft) {
      this._market.buyNFT(this.nft, this.priceInSubUnits.toString())
        .then((hash) => {
          console.log(hash);
        });
    }
    
  }
  
  initAccountData(): void {
    this._market.getCoinBalance()
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
        this.openSnackBar(err.message);
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
        this.openSnackBar(err.message);
      });
  }

  

  approveExactAmount() {
    if (this.nft) {
      this._market.approveExactAmount('moto', this.nft, this.priceInSubUnits.toString())
        .then((approvedAmount) => {
          this.approvedAmount = new BigNumber(approvedAmount);
          const formattedAmount = this.getFormattedPrice(approvedAmount.toString());
          const message = formattedAmount + " has been approved.";
          this.openSnackBar(message);
        })
        .catch((err) => {
          this.openDialog("Allocation Error", err.message);
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
    return this.approvedAmount.gte(this.priceInSubUnits) && this.approvedAmount.gt(0)
      && this.motoBalance.gte(this.priceInSubUnits);
  }

  openSnackBar(message: string, duration: number = 3000) {
    this.snackBar.open(message, "", {
      duration: duration,
      panelClass:['snackbar']
    });
  }
}
