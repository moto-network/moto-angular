import { Component, OnInit } from '@angular/core';
import { NFTManagerService } from '../../Services/MarketServices/nft-manager.service';

@Component({
  selector: 'manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.css']
})
export class ManageNFTComponent implements OnInit {

  constructor(private nftManager:NFTManagerService) { 

  }
  
  ngOnInit(): void {
  }

  createNFT(){
    let nftObj = {
      "name":"SodomyIsASin",
      "chainId":97,
      "beneficiary":"0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
      "contentHash": "0x706f58549f18af06d914254c950ef94ab8e2df440fcc62a72bff247f304ebc62",
      "tokenId":1,
    };

    this.nftManager.createNFT(nftObj);
  }
}
