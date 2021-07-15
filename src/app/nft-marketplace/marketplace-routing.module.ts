import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { ProductPageComponent } from './product-page/product-page.component';


const routes: Routes = [{path:'',component:BrowsePageComponent},
{path:'nft',component:ProductPageComponent},
{path:'manage-nft',loadChildren:()=>import('./manage-nft/manage-nft.module').then(m=>m.ManageNftModule)}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NFTMarketplaceRoutingModule { }
