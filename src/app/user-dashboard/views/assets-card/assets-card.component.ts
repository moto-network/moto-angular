import { Component, OnInit, Input } from '@angular/core';
import {AssetConverterService} from '../../asset-converter.service';
@Component({
  selector: 'dashboard-assets-cards',
  templateUrl: './assets-card.component.html',
  styleUrls: ['./assets-card.component.css']
})
export class AssetsCardComponent implements OnInit {

  @Input() assetArray: any;
   
  constructor(private _assetConverter:AssetConverterService) { 
    
  }

  ngOnInit(): void {
    //console.log("test ",this._assetConverter.convertFromTo(12,"ltc","btc"));
  }

  ngOnChanges():void{
    
  }

  portfolioLoaded():boolean{
    if(this.assetArray.length > 0){
      return true;
    }
    else{
      return false;
    }
  }
  
}
