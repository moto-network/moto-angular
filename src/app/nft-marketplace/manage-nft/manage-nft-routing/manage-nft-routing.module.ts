import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNFTComponent } from '../create-nft/create-nft.component';
import { FindNftComponent } from '../find-nft/find-nft.component';
import { ManageNFTComponent } from '../manage-nft.component';
import { UploadNftComponent } from '../upload-nft/upload-nft.component';

const routes: Routes = [
  {path:'',component:ManageNFTComponent ,
  children:[{path:'create-nft', component:CreateNFTComponent},
{path:'upload-nft',component:UploadNftComponent},
{path:'find-nft',component:FindNftComponent}]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageNftRoutingModule { }
