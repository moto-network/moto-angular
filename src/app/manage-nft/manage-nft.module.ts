import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageNFTRoutingModule } from './manage-nft-routing.module';
import { ManageNftComponent } from './manage-nft.component';
import { InfoComponent } from './info/info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ManageNftComponent, InfoComponent],
  imports: [
    CommonModule,
    ManageNFTRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManageNftModule { }
