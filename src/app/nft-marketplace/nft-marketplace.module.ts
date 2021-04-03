import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { NFTMarketplaceRoutingModule } from './marketplace-routing.module';
import { NftBrowseResultsComponent } from './views/nft-browse-results/nft-browse-results.component';

@NgModule({
  declarations: [BrowsePageComponent, NftBrowseResultsComponent],
  imports: [
    CommonModule,
    NFTMarketplaceRoutingModule
  ]
})
export class NftMarketplaceModule { }
