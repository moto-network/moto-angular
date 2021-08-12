import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment.prod';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {AuthenticationService } from './Services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountComponent } from './account/account.component';
import {DialogModule} from "primeng/dialog";

import { OnRampComponent } from './on-ramp/on-ramp.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateNFTComponent } from './create-nft/create-nft.component';
import { DiscoverComponent } from './discover/discover.component';

import { SearchService } from './Services/search.service';
import { ProfileService } from './Services/profile.service';
import { NftCreationResultsComponent } from './nft-creation-results/nft-creation-results.component';
import { SimpleMessageDialogComponent } from './simple-message-dialog/simple-message-dialog.component';
import { UserDashComponent } from './user-dash/user-dash.component';
import { UniversalDialogComponent } from './universal-dialog/universal-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    ThankYouComponent,
    AccountComponent,
    OnRampComponent,
    NotFoundComponent,
    ProfileComponent,
    CreateNFTComponent,
    DiscoverComponent,
    NftCreationResultsComponent,
    SimpleMessageDialogComponent,
    UserDashComponent,
    UniversalDialogComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DialogModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  exports:[FontAwesomeModule],
  providers: [AuthenticationService,SearchService,ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
