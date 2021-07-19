import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment.prod';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule} from "primeng/sidebar";
import {ButtonModule} from "primeng/button"
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {AuthenticationService } from './Services/authentication.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { AccountComponent } from './account/account.component';
import {DialogModule} from "primeng/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { OnRampComponent } from './on-ramp/on-ramp.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateNFTComponent } from './create-nft/create-nft.component'; 
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
    CreateNFTComponent
  ],
  imports: [
    ButtonModule,
    SidebarModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DialogModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule
  ],
  exports:[FontAwesomeModule],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
