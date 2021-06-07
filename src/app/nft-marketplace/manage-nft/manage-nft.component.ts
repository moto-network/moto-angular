import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { NFTManagerService } from '../../Services/MarketServices/nft-manager.service';

@Component({
  selector: 'manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.css']
})
export class ManageNFTComponent implements OnInit {

  constructor(private nftManager:NFTManagerService, private wallet:WalletService) { 
    
  }
  
  ngOnInit(): void {
      if(!this.wallet.accountReady()){
        //this.wallet.requestAccount();
   
      }
  }

  createNFT(){
    let nftObj = {
      "name":"OnThisDay",
      "chainId":97,
      "beneficiary":"0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
      "contentHash": "0x706f58549f18af06d914254c950ef94ab8e2df440fcc62a72bff247f304ebc62",
      "tokenId":1,
    };
   
    this.nftManager.createNFT(nftObj)//add a please wait thing
    .then((result)=>{
      console.log("transction data is ", result);
    })
    .catch((err)=>{

    });
  }
}
