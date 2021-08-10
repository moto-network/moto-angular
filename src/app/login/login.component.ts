import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { ProfileService } from '../Services/profile.service';
import { LookupAddress } from 'node:dns';
import { Location } from '@angular/common';

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
    private _location:Location) {

  }
  account: string | null = null;
  animation: any = null;
  accountAvailable:boolean = false;
  openMetaMask(): void {
    this._profile.login();
  }

  openWalletConnect(): void {
    //this._walletService.walletConnect();
  }



  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.loggedInIcon = document.getElementById("loggedInIcon");
    this.loggedInIcon.style.display = "none";
    this.animation = anime({
      targets: "#loggedInIcon",
      color: ['#e31b23', '#4BB543', '#FFD700', '#46c3d1'],
      duration: 4000,
      autoplay: true,
      loop: true
    });
  }
}
