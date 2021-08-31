
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinExchangeComponent } from './coin-exchange/coin-exchange.component';
import { CreateNFTComponent } from './create-nft/create-nft.component';
import { CreateTierDialogComponent } from './create-tier-dialog/create-tier-dialog.component';
import { CreateTiersComponent } from './create-tiers/create-tiers.component';
import { DashMenuComponent } from './dash-menu/dash-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [{
  path: "", component: DashboardComponent,
  children: [{ path: "", component: DashMenuComponent },
    { path: "create-nft", component: CreateNFTComponent },
    { path: "create-tier", component: CreateTierDialogComponent },
  { path: "create-tiers", component: CreateTiersComponent },
  { path: "exchange", component: CoinExchangeComponent }]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
