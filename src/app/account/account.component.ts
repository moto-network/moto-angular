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
  displayError: boolean = false;
  account:string | null="";
  constructor(private _auth:AuthenticationService, private _walletService:WalletService) {
  
  }

  hasBrowserProvider(): boolean {
    return this._walletService.hasBrowserProvider();
  }

  initBrowserInterface(): void {
    this._walletService.initWallet();
  }

  getAccount():void{
    this._walletService.initWallet()
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
