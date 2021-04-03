import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {ChartModule } from 'primeng/chart';
import { HttpClientModule } from '@angular/common/http';
import { AssetsCardComponent } from './views/assets-card/assets-card.component';
import { UserDashboardComponent } from './user-dashboard.component';
import {ChartComponent} from './views/chart/chart.component';
import {AssetConverterService} from './asset-converter.service';
import { TransactionsComponent } from './views/transactions-component/transactions.component';
import {RemoteDataManagerModule} from '../DataManagement/remote-data-manager/remote-data-manager.module';

@NgModule({
  declarations: [
    UserDashboardComponent,
    AssetsCardComponent,
    ChartComponent,
    TransactionsComponent
     ],
  imports: [
    UserDashboardRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserDashboardRoutingModule,
    FontAwesomeModule,
    AngularFirestoreModule,
    ChartModule,
    HttpClientModule,
    RemoteDataManagerModule
  ],
  providers: [AssetConverterService]
})
export class UserDashboardModule { 

}
