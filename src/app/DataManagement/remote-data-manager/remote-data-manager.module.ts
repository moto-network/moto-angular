import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PortfolioManagerService} from './services/portfolio-manager/portfolio-manager.service';
import {TransactionsService} from './services/transactions/transactions.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[PortfolioManagerService,TransactionsService]
})
export class RemoteDataManagerModule { }
