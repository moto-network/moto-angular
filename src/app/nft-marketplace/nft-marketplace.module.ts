import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { NFTMarketplaceRoutingModule } from './marketplace-routing.module';
import { NftBrowseResultsComponent } from './views/nft-browse-results/nft-browse-results.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { NftManagerService } from '../DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';

@NgModule({
  declarations: [BrowsePageComponent, NftBrowseResultsComponent, ProductPageComponent],
  providers:[NftManagerService],
  imports: [
    CommonModule,
    NFTMarketplaceRoutingModule
  ]
})
export class NftMarketplaceModule { }
