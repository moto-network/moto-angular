import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
    uid:string="";
    userState!: any;
    isAuthenticated: boolean = false;
    constructor(
      public afAuth: AngularFireAuth,
      public router: Router,
      public ngZone: NgZone
    ) {
      
    }

    SignIn(email: string, password:string ){
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          if(result){
            this.uid = result.user?.uid!;
            this.userState = result.user;
            this.router.navigate(['user_dashboard']);
          }
          else{
            console.log('no users from signin');
        }          
        }).catch((error) => {
          window.alert(error.message)
        });
    }
  
  currentUser() {
    return this.afAuth.currentUser;
  }
  
  walletSignIn(token: string) {
    console.log("token is ", token);
    return this.afAuth.signInWithCustomToken(token)
  }

}
