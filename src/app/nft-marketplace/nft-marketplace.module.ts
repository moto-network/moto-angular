import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { NFTMarketplaceRoutingModule } from './marketplace-routing.module';
import { NftBrowseResultsComponent } from './views/nft-browse-results/nft-browse-results.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { NFTManagerService } from '../Services/MarketServices/nft-manager.service';
import { ManageNFTComponent } from './manage-nft/manage-nft.component';

@NgModule({
  declarations: [BrowsePageComponent, NftBrowseResultsComponent, ProductPageComponent, ManageNFTComponent],
  providers:[NFTManagerService],
  imports: [
    CommonModule,
    NFTMarketplaceRoutingModule
  ]
})
export class NftMarketplaceModule { }
