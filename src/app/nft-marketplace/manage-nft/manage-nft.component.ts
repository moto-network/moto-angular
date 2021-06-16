import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { NFTManagerService } from '../../Services/MarketServices/nft-manager.service';

@Component({
  selector: 'manage-nft',
  templateUrl: './manage-nft.component.html',
  styleUrls: ['./manage-nft.component.css']
})
export class ManageNFTComponent implements OnInit {

  constructor(private wallet:WalletService) { 
    
  }
  
  ngOnInit(): void {
      if(!this.wallet.accountReady()){
        //this.wallet.requestAccount();
   
      }
  }


}
