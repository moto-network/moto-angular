import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';
import { DBNFT} from 'src/declaration';

@Component({
  selector: 'app-profile-nft',
  templateUrl: './display-nft.component.html',
  styleUrls: ['./display-nft.component.css']
})
export class DisplayNFTComponent implements OnInit {
  leftArrow:any = faArrowLeft;
  
  nft:DBNFT= {
    "tokenId": "0x00000000000000000000",
    "contractAddress": "0x000000000000000000000000000000",
    "contentHash": "0x00000000000000000000000000000000000000000000000000000000000000",
    "name": "NOTHING TO SHOW",
    "chainId": 97,
    "smImg": " ",
    "beneficiary": "0x000000000000000000000000000000",
    "pHash": "0000000000000000000000000",
    "medImg": "../../../assets/HD2.jpg",
    "creator": "0x000000000000000000000000000000"
  };
  constructor(private _nftManager:NFTManagerService, private _location: Location) {
    
  }

  ngOnInit(): void {

    if (this._nftManager.nft) {
      this.nft = this._nftManager.nft;
    }
  }

  /**
   * they will drop in here from the outside link must be clickable from here. 
   * for example must be able to to go creator page nft page
   */

  backClicked() {
    this._location.back();
  }
}

