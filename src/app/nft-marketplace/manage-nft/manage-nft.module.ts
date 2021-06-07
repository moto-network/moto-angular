import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageNftRoutingModule } from './manage-nft-routing/manage-nft-routing.module';
import { ManageNFTComponent } from './manage-nft.component';
import { CreateNFTComponent } from './create-nft/create-nft.component';
import { UploadNftComponent } from './upload-nft/upload-nft.component';
import { FindNftComponent } from './find-nft/find-nft.component';


@NgModule({
  declarations: [
    ManageNFTComponent,
    CreateNFTComponent,
    UploadNftComponent,
    FindNftComponent
  ],
  imports: [
    CommonModule,
    ManageNftRoutingModule
  ]
})
export class ManageNftModule { }
