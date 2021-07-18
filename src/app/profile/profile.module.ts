import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { NftComponent } from './nft/nft.component';
import { ProfileNftComponent } from './profile-nft/profile-nft.component';



@NgModule({
  declarations: [GalleryComponent, NftComponent, ProfileNftComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
