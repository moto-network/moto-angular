import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardRoutingModule as DashboardRoutingModule } from "./dashboard-routing-module";
import { DashMenuComponent} from './dash-menu/dash-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateNFTComponent } from './create-nft/create-nft.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

  
@NgModule({
  declarations: [DashMenuComponent, DashboardComponent, CreateNFTComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class DashboardModule { }
