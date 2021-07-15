import { Component, OnInit } from '@angular/core';
import { getExplorer, Contract, getContract} from 'src/app.config';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';
import { NFT } from "src/declaration";
@Component({
  selector: 'app-nft-results',
  templateUrl: './nft-results.component.html',
  styleUrls: ['./nft-results.component.css']
})
export class NftResultsComponent implements OnInit {
  
  transactionHash: string;
  transactionUrl: string = "";
  addressUrl: string = ""
  tokenUrl: string = "";
  nft: NFT | null = null;
  contract: Contract | null = null;

  constructor(private nftManager: NFTManagerService) {
    this.transactionHash = this.nftManager.lastSuccessfulTransaction;
    if (this.nftManager.nft) {
      this.nft = this.nftManager.nft;
      this.transactionUrl = this.prepareTransactionUrl();
      this.contract = getContract(this.nftManager.nft.chainId, "nft");
    }
    else if (!this.nftManager.nft) {
      if (localStorage.getItem('nft')) {
        this.nft = JSON.parse(localStorage.getItem('nft')!);
      }
    }
  }

  ngOnInit(): void {

  }

  
  private prepareTransactionUrl(): string{
    let transactionUrl:string = "";
    if (this.nft) {
      transactionUrl = getExplorer(this.nft.chainId)
        + "/tx/" + this.transactionHash;
    }
    return transactionUrl;
  }

  public getUrl(type:string, variable:string,contract:boolean): string {
    let addressUrl: string = "";
    if (this.nft) {
      addressUrl = getExplorer(this.nft.chainId)+ type + "/";
      if (type == "address") {
        addressUrl =  addressUrl + (contract ? this.contract?.address : variable);
      }
      else if (type == "token") {
        addressUrl = addressUrl+ this.contract?.address + "?a=" + variable;
      }
    }
    return addressUrl;
  }

}

