import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Account, FileNFT, Listing, ListingNFT, NFT, NFTCollection } from 'src/declaration';
import { faDownload, faEye, faUserCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { MarketService } from '../Services/market.service';
import { NFTManagerService } from '../Services/nft-manager.service';
import { ProfileService } from '../Services/profile.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DownloadLinkDialogComponent } from '../download-link-dialog/download-link-dialog.component';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrls: ['./user-dash.component.css']
})
export class UserDashComponent implements OnInit, OnDestroy {
  download = faDownload;
  view = faEye;
  user = faUserCircle;
  add = faPlusCircle;
  nft: Partial<ListingNFT> & FileNFT | null = null;
  listing: Listing | null = null;
  listingSub: Subscription | null = null;
  nftSub: Subscription | null = null;
  nftCollection: NFTCollection<Partial<ListingNFT> & FileNFT> | null =null ;
  nftCollectionSub: Subscription | null = null;
  account: Account | null = null;
  accountSub: Subscription | null = null;
  motoBalance: string = "";
  motoNFTBalance: string = "";
  loading: boolean = false;
  constructor(private _profile: ProfileService, private _market: MarketService,
    private _nftManager: NFTManagerService, private _wallet: WalletService,
    public snackBar: MatSnackBar, private _router: Router, public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.accountSub =  this._wallet.getAccount()
      .subscribe((account) => {
        this.loading = true;
        if (account) {
          this.account = account;
//          this.getLatestListing();
          this.getBalances(account);
          setTimeout(() => { this.loading = false }, 5000);

        }
        this._nftManager.getNFTs("owner", account.address)
          .subscribe((nfts) => {
            if (nfts) {
              this.nftCollection = nfts;
            }
          })
       })
    
  }

  getBalances(account:Account): void {
    this._market.getCoinBalance(account)
      .then((balance) => {
        this.motoBalance = balance;
      })
      .catch((err) => {
        this._profile.openSnackBar(err.message);
      });
    this._market.getNFTBalance(account)
      .then((balance) => {
        this.motoNFTBalance = balance;
      })
      .catch((err) => {
        this._profile.openSnackBar(err.message);
      });
  }

  getLatestListing() {
    this.listingSub = this._market.getListing()
      .subscribe((listing) => {
        if (listing) {
          this.listing = listing;
          this.nftSub = this._nftManager.getNFT("tokenId", listing.tokenId)
            .subscribe((nft) => {
              if (nft) {
                this.nft = nft;
              }
            });
        }
      })
  }

  

  ngOnDestroy(): void {
    this.listingSub?.unsubscribe();
    this.nftSub?.unsubscribe();
  }

  getFormattedPrice(price: string | undefined): string {
    if (price) {
      return this._market.formatCurrency(price);
    }
    else {
      return "";
    }
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

  downloadNFT(nft: FileNFT): void {
    this._nftManager.setNFT(nft);
    this._profile.getDownloadLink(nft)
      .then((link) => {
        if (link) {
          console.log("link is", link);
          this.dialog.open(DownloadLinkDialogComponent,
            { data: { link: link.link } });
        }
      });

  }

  onSale(tokenId: string): boolean {
    if (this.nftCollection) {
      if (this.nftCollection[tokenId].onSale) {
        return this.nftCollection[tokenId].onSale!;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
    
  }

  goToNFT(nft: FileNFT) {
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft']);
  }

  goToProfile() {
    if (this.account) {
      this._profile.initProfile(this.account.address);
      this._router.navigate(['profile']);
    }
  }

  createNFT() {
    this._router.navigate(['create']);
  }

  get ProfileNFTs() {
    if (this.nftCollection) {
      return Object.keys(this.nftCollection);
    }
    else {
      return [];
    }
  }
}
