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
  
    initialize(){
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userState = user;
          localStorage.setItem('user', JSON.stringify(this.userState));
          
      }
        else {
          this.userState = null;
        }
      });
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

    getuid():string{
      return this.uid;
    }

    isLoggedIn(): boolean {
      const localStorageUser:string|null = localStorage.getItem('user');
      if(localStorageUser){
        const user = JSON.parse(localStorageUser);
        return (user !== null) ? true : false; //add email verification here
      }
      else{
        return false;
      }
     }
}
