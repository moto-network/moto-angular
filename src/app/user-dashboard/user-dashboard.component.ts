import { Component, OnInit, ViewChild } from '@angular/core';

import { PortfolioManagerService } from '../DataManagement/remote-data-manager/services/portfolio-manager/portfolio-manager.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  uid:string="";
  portfolioDataObservable: Observable<any> | null = null;
  portfolio: any | null;
  portfolioArray:Array<any>=[];
  constructor(private _pm:PortfolioManagerService) { //currency service needs to be called here. and data distributed to the other components

    if(localStorage.getItem('user')){
      const userObject = JSON.parse(localStorage.getItem('user')!);
      this.uid = userObject?.uid;
      this.portfolioDataObservable = this._pm.getPortfolio(this.uid);
      this.portfolioDataObservable.subscribe((portfolioRemote)=>{
        this.portfolio = portfolioRemote.docs[0].data().assets;
        const portfolioAssetNamesArray = Object.keys(this.portfolio);

        Object.keys(this.portfolio).forEach(
          asset=>{
            this.portfolioArray.push({
              name:asset,
              info:this.portfolio[asset]
            });
          }
        );
        console.log("this is the portfolio array ",this.portfolioArray);
      });
    }
    else{
      console.log('user dashboard found no user data');
    }
    console.log("uid is in dashboard is ",this.uid);
  }

  ngOnChanges(): void{
    
  }

  ngOnInit(): void {
    
  }

  
}
