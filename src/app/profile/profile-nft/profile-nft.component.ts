import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faGem} from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from 'src/app/Services/profile.service';
import { DBNFT, NFT } from 'src/declaration';

@Component({
  selector: 'app-profile-nft',
  templateUrl: './profile-nft.component.html',
  styleUrls: ['./profile-nft.component.css']
})
export class ProfileNftComponent implements OnInit {
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
  constructor(private _profileManager: ProfileService, private _location: Location) {
    
  }

  ngOnInit(): void {
    if (this._profileManager.nft) {
      this.nft = this._profileManager.nft;
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

