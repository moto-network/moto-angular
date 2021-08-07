import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faFireAlt,faGift ,faMoneyBill} from '@fortawesome/free-solid-svg-icons';
import { NFTManagerService } from '../Services/nft-manager.service';
import { FileNFT, ListingNFT } from 'src/declaration';
import { ProfileService } from '../Services/profile.service';
import { getNetworkName } from 'src/app.config';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { MarketService } from '../Services/market.service';


@Component({
  selector: 'app-profile-nft',
  templateUrl: './display-nft.component.html',
  styleUrls: ['./display-nft.component.css']

})
export class DisplayNFTComponent implements OnInit {
  leftArrow: any = faArrowLeft;
  burn: any = faFireAlt;
  give: any = faGift;
  sell: any = faMoneyBill;
  account: string | null = null
  nftOwner: string | null = null;
  nft: FileNFT & Partial<ListingNFT> = {
    "tokenId": "0x0000000000000",
    "contractAddress": "0x000000000000000000000000000000",
    "contentHash": "0x00000000000000000000000000000000000000000000000000000000000000",
    "name": "NOTHING TO SHOW",
    "chainId": 97,
    "smImg": " ",
    "owner": "0x000000000000000000000000000000",
    "pHash": "0000000000000000000000000",
    "medImg": "../../../assets/HD2.jpg",
    "creator": "0x000000000000000000000000000000"
  };
  testCount: number = 0;
  constructor(private _nftManager: NFTManagerService, private _location: Location,
    private _profileManager: ProfileService, private _router: Router,
    private _wallet: WalletService, private _market:MarketService) {

  }

  ngOnInit(): void {
    this._nftManager.getNFT()
      .subscribe((nft) => {
        if (nft) {
          this.nft = nft;
          this._getOwner(nft);
        }
      });
    
    this._wallet.listenForAccount()
      .subscribe((account) => {
        this.testCount = this.testCount + 1;

        if (account) {
          this.account = account;
        }
       });
  }

  sellNFT() {
    if (this.nft) {
      this._nftManager.setNFT(this.nft as ListingNFT);
      this._router.navigate(['manage-nft', 'seller-menu']);
    }
  }

  buyNFT() {
    this._router.navigate(['manage-nft', 'buyer-menu']);
    this._nftManager.setNFT(this.nft);
  }

  goToProfile(address: string | undefined) {
    if (address) {
      this._profileManager.initProfile(address);
      this._router.navigate(['profile']);
    }

  }

  ngAfterViewInit(): void {

  }


  nftAvailable(): boolean {
    return (this.nft.tokenId.length > 25);
  }

  getNetworkName() {
    return getNetworkName(this.nft.chainId);
  }

  private _getOwner(nft:FileNFT): void {
    if (nft) {
      this._nftManager.getOwner(nft)
        .then((owner) => {
          if (owner) {
            this.nftOwner = owner.toUpperCase();
          }
        })
        .catch(() => {
          
        });
    }

  }


  private _isOwner(): boolean {
    //let onsale: boolean = this.nft.onSale ? this.nft.onSale : false;
    let isOwner: boolean = false
    
    if (this.account && this.nftOwner) {

      return  (this.account.toUpperCase() == this.nftOwner.toUpperCase());
    }
    return false;
  }

  public showBuyMenu(): boolean { 
    const isOnSale: boolean = typeof this.nft.onSale === 'undefined' ? false : this.nft.onSale;
    return isOnSale && !this._isOwner();
  }

  public showMenu():boolean {
    return this._isOwner();
  }
  /**
   * they will drop in here from the outside link must be clickable from here. 
   * for example must be able to to go creator page nft page
   */

  backClicked() {
    this._location.back();
  }

}

