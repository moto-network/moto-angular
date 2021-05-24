import { Component, Input, OnInit } from '@angular/core';
import { NftManagerService } from 'src/app/DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';

@Component({
  selector: 'product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  nft:any;
  
  dummyData = {
    "on_sale": true,
    "id": "0x162FD",
    "img": "https://motonetwork00.s3-us-west-1.amazonaws.com/b6aVYzdnpto.jpg",
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "network":"BSC",
    "price": "312",
    "name": "GlitchArt01",
    "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nulla risus, dignissim vitae sollicitudin id, suscipit eu est. Curabitur sem diam, ornare id est imperdiet, interdum finibus erat. Suspendisse potenti. Vestibulum vitae malesuada eros, a lacinia odio. Pellentesque dignissim varius ultricies. Maecenas vitae ornare magna, vel malesuada neque. Mauris finibus nisl et est tincidunt vestibulum in quis tellus. In scelerisque lectus pretium elit molestie suscipit. Fusce ut sodales sapien."
  };
  
  constructor(private _nftManager:NftManagerService) { 
    
  }

  ngOnInit(): void {
    this.nft = this.dummyData;
    //this.nft = _nftManager.getNFTProduct();
    console.log("this nft is ", this.nft);
  }

}
