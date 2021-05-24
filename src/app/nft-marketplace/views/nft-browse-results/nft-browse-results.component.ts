import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NftManagerService} from '../../../DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';
@Component({
  selector: 'app-nft-browse-results',
  templateUrl: './nft-browse-results.component.html',
  styleUrls: ['./nft-browse-results.component.css']
})
export class NftBrowseResultsComponent implements OnInit {
  nftsArray:any = [];
  dummyArray = [ {
    "on_sale": true,
    "id": "0x162FD",
    "img": '../assets/background/oriental-tiles.png',
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "price": "312",
    "name": "GlitchArt01",
    "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at cursus turpis. Pellentesque ac eros lectus. Aenean vehicula, tellus vitae dapibus varius, sem elit varius lectus, ut euismod felis turpis quis nibh. Integer scelerisque mattis ante, at luctus nisl euismod ullamcorper. Suspendisse potenti. Nunc volutpat faucibus sagittis. Nunc sit amet ligula quis erat posuere placerat. Duis at cursus nisi, in feugiat ex."
  }, {
    "on_sale": true,
    "id": "0x162FD",
    "img": "../assets/background/oriental-tiles.png",
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "price": "312",
    "name": "GlitchArt01",
    "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at cursus turpis. Pellentesque ac eros lectus. Aenean vehicula, tellus vitae dapibus varius, sem elit varius lectus, ut euismod felis turpis quis nibh. Integer scelerisque mattis ante, at luctus nisl euismod ullamcorper. Suspendisse potenti. Nunc volutpat faucibus sagittis. Nunc sit amet ligula quis erat posuere placerat. Duis at cursus nisi, in feugiat ex."
  }, {
    "on_sale": true,
    "id": "0x162FD",
    "img": "../assets/background/oriental-tiles.png",
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "price": "312",
    "name": "GlitchArt01",
    "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at cursus turpis. Pellentesque ac eros lectus. Aenean vehicula, tellus vitae dapibus varius, sem elit varius lectus, ut euismod felis turpis quis nibh. Integer scelerisque mattis ante, at luctus nisl euismod ullamcorper. Suspendisse potenti. Nunc volutpat faucibus sagittis. Nunc sit amet ligula quis erat posuere placerat. Duis at cursus nisi, in feugiat ex."
  },{
    "on_sale": true,
    "id": "0x162FD",
    "img": "../assets/background/oriental-tiles.png",
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "price": "312",
    "name": "GlitchArt01"
  }];
  constructor(private _nfts:NftManagerService,private _router:Router) {
    //this.nftsArray = this.dummyArray; 
    _nfts.getNFTs().subscribe((results)=>{
      if(results){
        
       this.nftsArray = results;
      }
    }
    );
    
  }

  ngOnInit(): void {

  }

  ngDoCheck(){
    
  }

  openProductPage(nft:any):void{
    this._nfts.setNFTProduct(nft);
    this._router.navigate(['nft_marketplace','product-page']);
  }
}
