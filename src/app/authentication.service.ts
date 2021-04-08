import { Injectable, NgZone } from '@angular/core';
import { FirebaseApp } from '@angular/fire';

import { AngularFireAuth } from "@angular/fire/auth";

import { Router } from "@angular/router";

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
 }

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
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userState = user;
          localStorage.setItem('user', JSON.stringify(this.userState));
          
          //this.isAuthenticated = true;
          //JSON.parse(localStorage.getItem('user'));
        } else {
          this.userState = null;

          //localStorage.setItem('user', null);
          //JSON.parse(localStorage.getItem('user'));
        }
      })
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
        })

        /**
         return this.afAuth.signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          await this.ngZone.run(() => {
            this.uid = result.user?.uid!;
            this.router.navigate(['user_dashboard']);
          });
          //this.SetUserData(result.user);
          this.isAuthenticated = true;
        }).catch((error) => {
          window.alert(error.message)
        })
         * 
         */
    }

    getuid():string{
      return this.uid;
    }

    get isLoggedIn(): boolean {
      const localStorageUser:string|null = localStorage.getItem('user');
      if(localStorageUser){
        const user = JSON.parse(localStorageUser);
        return (user !== null) ? true : false; //add email verification here
      }
      else{
        return false;
      }
      }
  /*
    SignUp(email, password) {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this.SendVerificationMail();
          this.SetUserData(result.user);
        }).catch((error) => {
          window.alert(error.message)
        })
    }

    SendVerificationMail() {
        return this.afAuth.currentUser.then(u => u.sendEmailVerification())
        .then(() => {
          this.router.navigate(['email-verification']);
        })
    }    
  
    ForgotPassword(passwordResetEmail) {
      return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
    }
  
    
  
    GoogleAuth() {
      return this.AuthLogin(new firebase.auth().GoogleAuthProvider());
    }
  
    AuthLogin(provider) {
      return this.afAuth.signInWithPopup(provider)
      .then((result) => {
         this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
    }
  
    SetUserData(user) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userState: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
      return userRef.set(userState, {
        merge: true
      })
    }
   
    SignOut() {
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['sign-in']);
      })
    }  
    */
}
