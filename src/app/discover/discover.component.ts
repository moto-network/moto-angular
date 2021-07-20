import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBNFT, NFTCollection } from 'src/declaration';
import { NFTManagerService } from '../Services/MarketServices/nft-manager.service';

declare var anime: any;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  nftCollection: NFTCollection = {};
  loadingAnimation: any = null;
  constructor(private _nftManager: NFTManagerService,
    private _router: Router) {


  }

  ngOnInit(): void {
    this.nftCollection = {
      "0x8b0b9640bd2fa34f9e4937d77c9110e1": {
        "chainId": 97,
        "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
        "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=MfQarsaBpjIj8PyIq0BPKTvoWgweTFPqd2ZLp61PPjiaAA5MUzwi5s15n1y5vREiDaLI1xneXcecZdyjbJzXTFEV7sXHtrlc8%2BFwyexYosb8380mTIgTyOnfRDac24HOqJ3U2DxQQ80Uwbsr6qme3aNGVYbUodvQcTEdkkykQ0NWgxU%2B17fV3twDkPZ3tfniB%2Bsv42kljGbLoimWuBcLmn9dp5CnfgSjCnPyhUAv41GzAbPVaDlPK%2BrrfhOZUihRsviC4%2FPmXD%2BVGF1TSPdZY1HeLD9Gpc3OyWkwny%2FZMfGZvh72B5yJi9lZtYBFHJoce3gaaAklUokIcxgZqQGtSg%3D%3D",
        "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
        "name": "Test Two",
        "pHash": "c80418c4e42020c2",
        "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
        "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
        "beneficiary": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
        "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1"

      },
      "0x8b0b9640bd2fa34f9e4937d77m9110e1": {
        "chainId": 97,
        "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
        "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0x948f1c8fa9227de5dc3c2918794c1c5e0534b85fbf11e2acdeded44b3b79f231?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765044&Signature=YJEKvRGYB40F2DG3PyHpMONv8XI3lM3NSJafw2k2xYv3Dnd0NEbbFOkPLosNw8YgV1KArSCG7v3jk4SuR%2FdlT1BreT26bC%2FpzIB5C5813yWH0QZUdieqo%2BR8dDIhE5qKd%2Bhcrca83%2Fn7OT2EuyxYi7oIZSYfHWKdGmMqDhuSk0HzYqsQhOBUxtuh2U034%2F8ySMDRGQJIBQWD005a%2BkPCgl8kawVj%2Bk0CmioXy9ObgJ%2Bk%2B51jJrd8blTf1tR6TVG1C4g57bJ6Lfyh%2BHl7%2BGqj6CoM95Vhi7BkP%2FJoNrxMzGK%2Bssvs77iavW2HVVkhyLBY5WjlV70cIodF7jeiGCd5yw%3D%3D",
        "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
        "name": "Test Two",
        "pHash": "c80418c4e42020c2",
        "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
        "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
        "beneficiary": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
        "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1"

      },
      "0x8b0b9640bd2fa34f9d4937d77c9110e1": {
        "chainId": 97,
        "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
        "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=MfQarsaBpjIj8PyIq0BPKTvoWgweTFPqd2ZLp61PPjiaAA5MUzwi5s15n1y5vREiDaLI1xneXcecZdyjbJzXTFEV7sXHtrlc8%2BFwyexYosb8380mTIgTyOnfRDac24HOqJ3U2DxQQ80Uwbsr6qme3aNGVYbUodvQcTEdkkykQ0NWgxU%2B17fV3twDkPZ3tfniB%2Bsv42kljGbLoimWuBcLmn9dp5CnfgSjCnPyhUAv41GzAbPVaDlPK%2BrrfhOZUihRsviC4%2FPmXD%2BVGF1TSPdZY1HeLD9Gpc3OyWkwny%2FZMfGZvh72B5yJi9lZtYBFHJoce3gaaAklUokIcxgZqQGtSg%3D%3D",
        "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
        "name": "Test Two",
        "pHash": "c80418c4e42020c2",
        "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
        "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
        "beneficiary": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
        "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1"

      }
      ,
      "0x8b0b9644bd2fa34f9e4937d77m9110e1": {
        "chainId": 97,
        "contractAddress": "0x2755aBCf99a422eA7F40BB6C5ac9037D085CA67f",
        "medImg": "https://storage.googleapis.com/motonetworknft/image/med_0x948f1c8fa9227de5dc3c2918794c1c5e0534b85fbf11e2acdeded44b3b79f231?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765044&Signature=YJEKvRGYB40F2DG3PyHpMONv8XI3lM3NSJafw2k2xYv3Dnd0NEbbFOkPLosNw8YgV1KArSCG7v3jk4SuR%2FdlT1BreT26bC%2FpzIB5C5813yWH0QZUdieqo%2BR8dDIhE5qKd%2Bhcrca83%2Fn7OT2EuyxYi7oIZSYfHWKdGmMqDhuSk0HzYqsQhOBUxtuh2U034%2F8ySMDRGQJIBQWD005a%2BkPCgl8kawVj%2Bk0CmioXy9ObgJ%2Bk%2B51jJrd8blTf1tR6TVG1C4g57bJ6Lfyh%2BHl7%2BGqj6CoM95Vhi7BkP%2FJoNrxMzGK%2Bssvs77iavW2HVVkhyLBY5WjlV70cIodF7jeiGCd5yw%3D%3D",
        "smImg": "https://storage.googleapis.com/motonetworknft/image/sm_0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59?GoogleAccessId=firebase-master%40motonetwork.iam.gserviceaccount.com&Expires=4779765030&Signature=keGqVysdr0MOA6x8gg1%2FUnOOJcLXO5HmPc1RLmDb4xpobR%2B4nV1kOa74tzb4L%2F%2B8qAmqLEYXpWNoFiA4JAUkm94sU%2BJGHc5aGJyjLc%2BpIr8GveBSfSPQxrh0a5Xodsd4cpm0S4ezF%2FdHKaim8%2FixhEV%2BWZL3y1gP73jlNqsS8BLBSDGwDVzVUuXja2CZBrE%2Ftlx%2F9JWBIMWX%2FuOHFJqQqXWDKh0PMVa3hVkmaBCS4KJvUN%2Bbm4iIHm1gw%2BqrieXTpNWL3ICbR2dLPqcATuqXDTTCh%2Bc1OsNABu9d229RWvefuoAOCGEwNdZDgsNn%2FO7vPzmVwabIsMWdgS0KkXOC3A%3D%3D",
        "name": "Test Two",
        "pHash": "c80418c4e42020c2",
        "contentHash": "0xe42b0711b459e0ba1379e71e0920f4611852b4e983a6d71183084002b6740d59",
        "creator": "0xdcb982dea4c22abe650c12a1678537a3e8ddd30d",
        "beneficiary": "0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
        "tokenId": "0x8b0b9640bd2fa34f9e4937d77c9110e1"

      },
    };
    /* if (this._nftManager.hasLocalCollection()) {
       console.log("has location collection");
       this.nftCollection = this._nftManager.nftCollection;
     }
     else {
       console.log("calling the manager"); 
       this._nftManager.getNFTs()
         .subscribe((collection) => {
           this.nftCollection = collection;
           this.loadingAnimation.pause();
           this.loadingAnimation.reset();
           console.log(this.nftCollection);
         });
     }
     setTimeout(() => {
       this.loadingAnimation.pause();
       this.loadingAnimation.reset();
     }, 5000);*/
  }


  ngAfterViewInit(): void {
    this.loadingAnimation = anime.timeline({
      loop: true,
      autoplay: false,
      easing: 'easeInQuad'
    })
      .add({
        targets: "#main-content-container",
        //translateX: [0, -10, 10, 0]
      });

    if (!this._nftManager.hasLocalCollection()) {
      this.loadingAnimation.play();
    }
  }

  display(nft: DBNFT): void {
    this._nftManager.setNFT(nft);
    this._router.navigate(['nft']);
  }
  get NFTs() {
    return Object.keys(this.nftCollection);
  }
}
