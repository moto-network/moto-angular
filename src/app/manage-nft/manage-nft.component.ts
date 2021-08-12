import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileNFT, NFT } from 'src/declaration';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { NFTManagerService } from '../Services/nft-manager.service';
import { Contract, getContract, getNetwork } from 'src/app.config';
import { Router } from '@angular/router';
import { MarketService } from '../Services/market.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.css']
})
export class ManageNftComponent implements OnInit, OnDestroy{
  nft: FileNFT = {
    name: "Nothing To Show",
    tokenId: "0x0000000",
    owner: "0x00000000",
    creator: "0x000000000",
    chainId: 97,
    contentHash: "0x000000",
    contractAddress: "0x0000000"
  };

  marketPermission: boolean = false;
  currentNetwork: number | null = null;
  account: string | null = null;
  nftOwner: string = "";
  walletSub: Subscription | null = null;
  needPermission: boolean = true;
  constructor(private _nftManager: NFTManagerService,
    private _wallet: WalletService, private _router: Router,
  private _market:MarketService) {
  }
/**
 * 
 */
  ngOnInit(): void {
    this.walletSub = this._wallet.listenForAccount()
      .subscribe((account) => {
        
      });
    this._nftManager.getNFT()
      .subscribe((nft) => {
        if (nft) {
          this.nft = nft;
        }
      });
    
  }

  ngOnDestroy(): void{
    this.walletSub?.unsubscribe();
  }

  imgToShow(): string {
    if (this.nft) {
      if (this.nft.smImg) {
        return this.nft.smImg;
      }
      else {
        return "../../../../assets/HD2.jpg";
      }
    }
    else {
      return "../../../../assets/HD2.jpg";
    }
  }

  private checkNetwork(nft: NFT) {
    if (this.currentNetwork && (nft.chainId != this.currentNetwork)) {
     
    }
  }

  private _isOwner(): boolean {
    //let onsale: boolean = this.nft.onSale ? this.nft.onSale : false;
    let isOwner: boolean = (this.account?.toLowerCase() === this.nftOwner.toLowerCase()) ? true : false;
    return isOwner;
  }
}
