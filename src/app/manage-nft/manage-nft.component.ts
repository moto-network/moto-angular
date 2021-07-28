import { Component, OnInit } from '@angular/core';
import { DBNFT, NFT } from 'src/declaration';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { NFTManagerService } from '../Services/nft-manager.service';
import { Contract, getContract, getNetwork } from 'src/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.css']
})
export class ManageNftComponent implements OnInit {
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
  currentNetwork: number | null = null;
  account: string | null = null;
  nftOwner: string = "";
  marketPermission: boolean = false;
  needPermission: boolean = true;
  constructor(private _nftManager: NFTManagerService,
    private _wallet: WalletService, private _router: Router) {
  }

  ngOnInit(): void {
    this._wallet.getAccount()
      .subscribe((account) => {
        if (account) {
          this.account = account;
        }
      });

    this._nftManager.getNFT()
      .subscribe((nft) => {
        if (nft) {
          this.nft = nft;
          this.nftOwner = nft.owner;
          this._nftManager.canMarketControl(this.nft)
            .then((allowedAccount: string) => {
              if (allowedAccount) {
                this.marketPermission = this._doesMarketHavePermission(allowedAccount);
              }
            })
            .catch((err) => { });
        }
      });

    this._wallet.getNetwork()
      .subscribe((chainId: number | null) => {
        this.currentNetwork = chainId;
      });
  }

  giveMarketPermission() {
    if (this.nft && !this.marketPermission) {
      this._nftManager.giveMarketPermission(this.nft)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  addToMarket(): void {
    if (this.nft && this.marketPermission) {
      
    }
  }

  goToNFT() {
    if (this.nft) {
      this._nftManager.setNFT(this.nft);
      this._router.navigate(['nft']);
    }
  }

  showPrice(price: string): string {
    return '';
  }

  getNetwork(chainId: number): string {
    if (getNetwork(chainId)) {
      return getNetwork(chainId).name;
    }
    return "";
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

  displayBuy(): boolean {
    if (!this.nft) {
      return false;
    }
    return ((this.nft.onSale ? this.nft.onSale : false) && !this._isOwner());
  }

  displayPermissionRequest(): boolean {
    let displayRequest: boolean = (!this.marketPermission && this._isOwner());
    if (displayRequest) {
      this.messageForUser = "moto requires 'spend' permission to create a kind of\
    escrow contract between you and a potential buyer.";
    }
    return displayRequest;
  }

  displayNFTManagement(): boolean {
    return (this.marketPermission && this._isOwner());
  }

  private _isOwner(): boolean {
    //let onsale: boolean = this.nft.onSale ? this.nft.onSale : false;
    let isOwner: boolean = (this.account?.toLowerCase() === this.nftOwner.toLowerCase()) ? true : false;
    return isOwner;
  }

  private _doesMarketHavePermission(nftApprovedAccount: string): boolean {
    if (this.nft && nftApprovedAccount) {
      let marketContract: Contract = getContract(this.nft.chainId, "market");
      return (marketContract.address.toLowerCase() == nftApprovedAccount.toLowerCase());
    }
    return false;
  }

  private checkNetwork(nft: NFT) {
    if (this.currentNetwork && (nft.chainId != this.currentNetwork)) {
      this.messageForUser = "Your wallet is currently connected to a \
      different decentralized network than this NFT was created."
    }
  }
}
