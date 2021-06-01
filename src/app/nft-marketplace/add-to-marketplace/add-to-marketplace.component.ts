import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/BlockchainServices/wallet.service';
import { AddToMarketService } from 'src/app/MarketServices/add-to-market.service';
import WalletConnectSDK from 'walletconnect';

@Component({
  selector: 'add-to-marketplace',
  templateUrl: './add-to-marketplace.component.html',
  styleUrls: ['./add-to-marketplace.component.css']
})
export class AddToMarketplaceComponent implements OnInit {

  constructor(private walletService:WalletService, private marketplace:AddToMarketService) { }

  ngOnInit(): void {
    //check for ethereum
  }

}
