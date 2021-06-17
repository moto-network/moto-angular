import { Component, OnInit } from '@angular/core';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';

@Component({
  selector: 'app-nft-results',
  templateUrl: './nft-results.component.html',
  styleUrls: ['./nft-results.component.css']
})
export class NftResultsComponent implements OnInit {
  transactionHash: string;
  constructor(private nftManager: NFTManagerService) {
    this.transactionHash = this.nftManager.lastSuccessfulTransaction;
  }

  ngOnInit(): void {

  }

}
