import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ManageNFTComponent } from './manage-nft/manage-nft.component';


const routes: Routes = [{path:'',component:BrowsePageComponent},
{path:'product-page',component:ProductPageComponent},
{path:'manage-nft',component:ManageNFTComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NFTMarketplaceRoutingModule { }
