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
  contentHash = "0xca40733fe2a0b4a688b5634147b4da3551aba25fa0292af5212f6fe35ed8ce4a";
  name = "aasdfasdf";
  beneficiary = "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D";
  chainId = 97;
  tokenId = "6";


  transactionHash: string;
  transactionUrl: string = "";
  addressUrl: string = ""
  tokenUrl: string = "";
  nft: NFT | null = {
    "name": this.name,
    "contentHash": this.contentHash,
    "beneficiary": this.beneficiary,
    "chainId": this.chainId,
    "tokenId": this.tokenId,
  };
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

