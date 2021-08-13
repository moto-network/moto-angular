import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { ProfileService } from '../Services/profile.service';
import { LookupAddress } from 'node:dns';
import { Location } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Optional } from '@angular/core';
declare var anime: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggedIn = faThumbsUp;
  loggedInIcon: any = null;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private _authentication: AuthenticationService,
    private _wallet: WalletService,
    private _router: Router, private _profile: ProfileService,
    private _location: Location, @Optional() private matDialogRef: MatDialogRef<LoginComponent>) {
    if (matDialogRef) {
      this.dialogNote = true;
    }
  }
  dialogNote = false;
  account: string | null = null;
  animation: any = null;
  accountAvailable: boolean = false;
  loading: boolean = false;
  openMetaMask(): void {
    this.loading = true;
    this._profile.login()
      .then((result) => {
        
        if (result) {
          if (this.matDialogRef) {
            this.loading = false;
            this.matDialogRef.close();
          }
          else {
            this._router.navigate(['user-dashboard']);
          }
        }
      });
  }

  openWalletConnect(): void {
    //this._walletService.walletConnect();
  }



  ngOnInit(): void {
  }


  ngAfterViewInit(): void {

  }
}
