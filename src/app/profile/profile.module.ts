import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfileNftComponent } from './profile-nft/profile-nft.component';



@NgModule({
  declarations: [GalleryComponent,  ProfileNftComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FontAwesomeModule
  ]
})
export class ProfileModule { }
