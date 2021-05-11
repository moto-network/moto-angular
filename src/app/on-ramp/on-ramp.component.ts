import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {WalletService} from "../BlockchainServices/wallet.service";
@Component({
  selector: 'app-on-ramp',
  templateUrl: './on-ramp.component.html',
  styleUrls: ['./on-ramp.component.css']
})
export class OnRampComponent implements OnInit {
  onRampForm: FormGroup = new FormGroup({
    fiatAmount: new FormControl(''),
    cryptoAmount: new FormControl(''),
    btcAddress: new FormControl('')
  });
  constructor(private _walletService:WalletService) { 
      console.log("%c validation ","color:green, font-weight:bold",_walletService.isValidAddress("test","test"));
  }

  ngOnInit(): void {
    console.log("test");
  }

  verifyFiat(value:any){
    if(Number(value)){
      
    }
  }



  buyCrypto(){

  }
}
