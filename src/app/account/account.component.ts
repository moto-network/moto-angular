import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { WalletService } from '../Services/BlockchainServices/wallet.service';
import {DialogModule} from 'primeng/dialog';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  metaMaskStatus: boolean;
  displayError: boolean = false;
  currentAccount:string="";
  constructor(private _auth:AuthenticationService, private _walletService:WalletService) {
    this.metaMaskStatus = _walletService.metaMaskCheck();
  }

  requestAccount():void{
    this._walletService.requestAccount();
  }

  openMetaMask():void{
    this.displayError = !this.displayError;
    window.open("https://metamask.io");
  }

  ngOnInit(): void {
  }

  checkProvider():void{
    
  } 
}
