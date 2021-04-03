import { AnimationQueryMetadata } from '@angular/animations';
import { Component, OnInit , Input} from '@angular/core';
import {ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
 // PolarArea
 //chart needs to be able to handle extremely small numbers 
 //consider normalization
 @Input() portfolio:any;
  
data:any;
assetLabels:string[] = [];
assetValues: number[] = [];

 constructor() {
  
}
//need to sort by some value metric, USD or something
ngOnInit(): void {
  
  this.updateData();
}

ngOnChanges():void{
  this.data ={
    labels: ['aaa','bbb','ccc','ddd','eee','fff'],
    datasets: [
        {
            data: [100,200,400,500,600,900],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF5733"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#D3D3D3"
            ]
        }]    
    };
  this.updateData();
}

updateData():void{
  if(this.portfolio){
    this.buildChartDataObject(this.portfolio);
    console.log("data varaible was changed");
  }
}

buildChartDataObject(remoteData:any):any{
  this._getLabels(this.portfolio);
  this._getValues();
  let newData = this.data;
  newData.labels  = this.assetLabels;
  newData.datasets[0].data = this.assetValues;
  this.data = newData;
}



  private _getLabels(data:any): void{
    if(!data){
      
    }
    else{
      const newLabels = Object.keys(data);
      if(newLabels.length > 5){
        let truncatedLabels = newLabels.slice(0,5);
        truncatedLabels.push('others');
        this.assetLabels = truncatedLabels;
      }
      else{
        this.assetLabels = newLabels;
      }
    }
  }


  private _getValues(): void{
    if(this.assetLabels.length > 0){
      console.log("portofolio object is ",this.portfolio);
      for(let i = 0; i < this.assetLabels.length; i++){
        this.assetValues[i] = parseInt(this.portfolio[this.assetLabels[i]]["amount"]);
        console.log(this.assetValues[i], "asset values here");
        console.log("component data is ", this.data);
      }
    } 
  }


}
