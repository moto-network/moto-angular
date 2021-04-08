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
import {AuthenticationService } from './authentication.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RemoteDataManagerModule} from "./DataManagement/remote-data-manager/remote-data-manager.module";
import { SignUpComponent } from './sign-up/sign-up.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { AccountComponent } from './account/account.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    ThankYouComponent,
    AccountComponent,
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
    RemoteDataManagerModule
  ],
  exports:[FontAwesomeModule],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
