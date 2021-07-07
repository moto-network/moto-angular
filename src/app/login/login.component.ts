import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { WalletService } from '../Services/BlockchainServices/wallet.service';

//import { FormControl } from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
});
  constructor(private _authentication: AuthenticationService, private _walletService:WalletService, private _router:Router) { 
    
  }
  account = this._walletService.account;
  signIn(){
     const email: string = this.loginForm.get("email")?.value;
     const password: string = this.loginForm.get("password")?.value;
     this._authentication.SignIn(email, password);
    
    }
  
  openMetaMask():void{
    if(this._walletService.metaMaskCheck()){
      this._walletService.requestAccount()
        .then((account) => {
          if (account) {
            this._router.navigate(['nft-marketplace']);
          }
         })
        .catch((err) => {

         })
      
      
    }
  }

  ngOnInit(): void {
  }

}
