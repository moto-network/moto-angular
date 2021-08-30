import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyOwnerGuard } from '../only-owner.guard';
import { SellerMenuComponent } from './seller-menu/seller-menu.component';
import { ManageNftComponent} from './manage-nft.component'
import { ListingManagementComponent } from './listing-management/listing-management.component';
import { BuyerMenuComponent } from './buyer-menu/buyer-menu.component';
import { OnlyAccountGuard } from '../only-account.guard';

const routes: Routes = [{
  path: "",
  component: ManageNftComponent,
  children: [
    { path: "seller-menu", component: SellerMenuComponent},
    { path: "buyer-menu" , component: BuyerMenuComponent},
    {path:"listing-management",component:ListingManagementComponent}
  ],

}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNFTRoutingModule { }
