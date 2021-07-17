import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { NFTMarketplaceRoutingModule } from './marketplace-routing.module';
import { NftBrowseResultsComponent } from './views/nft-browse-results/nft-browse-results.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { NFTManagerService } from '../Services/MarketServices/nft-manager.service';
import { HttpClientModule } from '@angular/common/http';
import { SellDialogComponent } from './sell-dialog/sell-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [BrowsePageComponent, NftBrowseResultsComponent, ProductPageComponent, SellDialogComponent],
  providers:[NFTManagerService],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NFTMarketplaceRoutingModule,
    HttpClientModule,
    MatDialogModule
  ]
})
export class NftMarketplaceModule { }
