import { Component, OnInit } from '@angular/core';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';

@Component({
  selector: 'app-nft-results',
  templateUrl: './nft-results.component.html',
  styleUrls: ['./nft-results.component.css']
})
export class NftResultsComponent implements OnInit {
  transactionHash:string;
  constructor(private nftManager:NFTManagerService) { 
    this.transactionHash = '0xba06d1fa8c2c438ad62b79b23f2a6e74fa9a49bd0c211c79ea11927e7dc35d14';//nftManager.lastSuccessfulTransaction;
  }

  ngOnInit(): void {
    
  }

}
