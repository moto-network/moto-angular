import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { AccountComponent } from './account/account.component';
import { OnRampComponent } from './on-ramp/on-ramp.component';
import { CreateNFTComponent } from './create-nft/create-nft.component';
import { DiscoverComponent } from './discover/discover.component';
import { DisplayNFTComponent } from './display-nft/display-nft.component';
import { NftCreationResultsComponent } from './nft-creation-results/nft-creation-results.component';
import { ManageNftComponent } from './manage-nft/manage-nft.component';
import { OnlyAccountGuard } from './only-account.guard';
const routes: Routes = [{ path: "", component: HomeComponent },
{ path: "login", component: LoginComponent },
{ path: "signup", component: SignUpComponent },
{ path: "account", component: AccountComponent, canActivate: [AuthGuard] },
{ path: "create", component: CreateNFTComponent },
{ path: "discover", component: DiscoverComponent },
{ path: "nft", component: DisplayNFTComponent },
{ path: "on-ramp", component: OnRampComponent },
  { path: "nft-results", component: NftCreationResultsComponent },
  {
    path: "manage-nft",
    loadChildren: () => import('./manage-nft/manage-nft.module')
      .then(m => m.ManageNftModule),
    //canLoad:[OnlyAccountGuard]
  },
  {
    path: "profile",
    loadChildren: () => import('./profile/profile.module')
      .then(m => m.ProfileModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
