import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageNFTRoutingModule } from './manage-nft-routing.module';
import { ManageNftComponent } from './manage-nft.component';
import { InfoComponent } from './seller-menu/seller-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListingManagementComponent } from './listing-management/listing-management.component';
@NgModule({
  declarations: [ManageNftComponent, InfoComponent, ListingManagementComponent],
  imports: [
    CommonModule,
    ManageNFTRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManageNftModule { }
