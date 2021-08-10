import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './Services/authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authenticationService: AuthenticationService, private _router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("ccurrent users is ", this._authenticationService.currentUser())
    return new Promise<boolean>((resolve, reject) => {
      this._authenticationService.afAuth.currentUser
        .then((user) => {
          if (user) {
            resolve(true);
          }
          else {
            resolve(false)
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
  }
  
}
