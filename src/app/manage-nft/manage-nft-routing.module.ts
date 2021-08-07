import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyOwnerGuard } from '../only-owner.guard';
import { InfoComponent } from './seller-menu/seller-menu.component';
import { ManageNftComponent} from './manage-nft.component'
import { ListingManagementComponent } from './listing-management/listing-management.component';
import { BuyerMenuComponent } from './buyer-menu/buyer-menu.component';

const routes: Routes = [{
  path: "",
  component: ManageNftComponent,
  children: [
    { path: "seller-menu", component: InfoComponent},
    { path: "buyer-menu" , component: BuyerMenuComponent},
    {path:"listing-management",component:ListingManagementComponent}
  ],
//  canActivateChild:[OnlyOwnerGuard]
}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNFTRoutingModule { }
