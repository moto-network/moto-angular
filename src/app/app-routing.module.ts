import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';
//import {UserDashboardComponent} from './user-dashboard/user-dashboard.component';
import {AuthGuard } from './auth.guard';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [{path:"", component:HomeComponent},
{path:"login",component:LoginComponent},
{path:"signup",component:SignUpComponent},
{path:"thank-you", component:ThankYouComponent},
{path:"user_dashboard",loadChildren:()=>import('./user-dashboard/user-dashboard.module').then(m=>m.UserDashboardModule),canActivate:[AuthGuard]},
{path:"nft_marketplace",loadChildren:()=>import('./nft-marketplace/nft-marketplace.module').then(m=>m.NftMarketplaceModule)}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
