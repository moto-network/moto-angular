import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowsePageComponent } from './browse-page/browse-page.component';


const routes: Routes = [{path:'',component:BrowsePageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NFTMarketplaceRoutingModule { }
