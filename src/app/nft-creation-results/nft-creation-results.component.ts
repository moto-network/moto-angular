import { Component, OnInit } from '@angular/core';
import { NFT } from 'src/declaration';
import { NFTManagerService } from '../Services/nft-manager.service';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { getExplorer, getNetwork } from 'src/app.config';
import { SessionManagerService } from '../Services/session-manager.service';
declare var anime: any;
@Component({
  selector: 'app-nft-creation-results',
  templateUrl: './nft-creation-results.component.html',
  styleUrls: ['./nft-creation-results.component.css']
})
export class NftCreationResultsComponent implements OnInit {
  nft: NFT | null = null;
  success = faThumbsUp
  successAnimation: any = null;
  transactionHash: string = "";
  chains:any = {
    "97": "Binance Smart Chain Test Network",
    "56":"Binance Smart Chain Main Network"
  }
  constructor(private _nftManager: NFTManagerService,
    private _session: SessionManagerService) {
    _nftManager.getNFT()
      .subscribe((nft: NFT | null) => {
        console.log('subcribe nft', nft);
        if (nft) {
          this.nft = nft;
        }

      });
    console.log("this nft", this.nft);
    this.transactionHash = _nftManager.lastSuccessfulTransaction;
    this.nft = this.testnft;
  }
  testnft = {
    "chainId": 97,
    "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
    "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=MfQarsaBpjIj8PyIq0BPKTvoWgweTFPqd2ZLp61PPjiaAA5MUzwi5s15n1y5vREiDaLI1xneXcecZdyjbJzXTFEV7sXHtrlc8%2BFwyexYosb8380mTIgTyOnfRDac24HOqJ3U2DxQQ80Uwbsr6qme3aNGVYbUodvQcTEdkkykQ0NWgxU%2B17fV3twDkPZ3tfniB%2Bsv42kljGbLoimWuBcLmn9dp5CnfgSjCnPyhUAv41GzAbPVaDlPK%2BrrfhOZUihRsviC4%2FPmXD%2BVGF1TSPdZY1HeLD9Gpc3OyWkwny%2FZMfGZvh72B5yJi9lZtYBFHJoce3gaaAklUokIcxgZqQGtSg%3D%3D",
    "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
    "name": "Test Two",
    "pHash": "c80418c4e42020c2",
    "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
    "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
    "owner": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
    "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1"

  };

  ngOnInit(): void {

    if (!this.nft) {
      this.nft = this._session.get("moto_nft_results_nft");
      this._session.get("moto_nft_results_transaction_hash");
    }
    else {
      this._session.clear("moto_nft_results_nft");
      this._session.clear("moto_nft_results_transaction_hash");
    }
  }

  ngOnDestroy(): void{
    if (this.nft && this.transactionHash) {
      this._session.set("moto_nft_results_nft", this.nft);
      this._session.set("moto_nft_results_transaction_hash", this.transactionHash);
    } 
  }

  getNetworkName(chain: number | undefined) {
    if (chain) {
      const network = getNetwork(chain)
     
      return network.name;
    }
    return "";
  }
 
  getLink(linkParam:string,value:string | undefined):string {
    if (this.nft && value) {
      let explorer: string = getExplorer(this.nft?.chainId);
      return explorer + linkParam +"/" + value;
    }
    else {
      return "";
    }
  }
}
