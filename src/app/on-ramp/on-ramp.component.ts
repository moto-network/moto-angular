import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import {WalletService} from "../BlockchainServices/wallet.service";
import {BitcoinService} from '../BlockchainServices/bitcoin.service';
import { ThemeService } from 'ng2-charts';
@Component({
  selector: 'app-on-ramp',
  templateUrl: './on-ramp.component.html',
  styleUrls: ['./on-ramp.component.css']
})
export class OnRampComponent implements OnInit {
  onRampForm: FormGroup = new FormGroup({
    fiatAmount: new FormControl('',Validators.required),
    cryptoAmount: new FormControl('',Validators.required),
    btcAddress: new FormControl('')
  });

  invalidAddress:boolean = false;
  invalidFiat:boolean = false;
  invalidCrypto:boolean = false;
  btcPrice:number = 0;
  fiatAmount:Number = 0;
  btcAmount:Number = 0;
  currencyPair:any;
  constructor(private _walletService:WalletService, private bitcoinService:BitcoinService) { 
  }


  ngOnInit(): void {
    this.bitcoinService.getBTCPrice()?.subscribe((remoteData)=>{
      this.btcPrice = remoteData.data.amount;
    });
  }

  verifyFiat(){
    let fiatNumber = parseFloat(this.onRampForm.get('fiatAmount')?.value);
    if(fiatNumber){
      this.invalidFiat = false;
      this.fiatAmount = fiatNumber;
      return true;
    }
    else{
      this.invalidFiat = true;
      return false;
    }
  }

  estimateBTC(){
    if(this.verifyFiat()){
      console.log("fiat verified ");
      if(this.btcPrice > 0){
        let btcValue:Number = Number.parseFloat(this.fiatAmount.toFixed(2))/this.btcPrice;
        this.onRampForm.controls["cryptoAmount"].setValue(btcValue.toFixed(12));
      }

    }
  }



  public validateBTCAddress(): boolean{
    let address:string = this.onRampForm.get('btcAddress')?.value;
    if(address){
      let validAddress = this._walletService.isValidAddress(address,"BTC");
      if(validAddress){
        this.invalidAddress = false;
        return true;
      }
      else{
        this.invalidAddress = true;
        return false;
      }
    }
    else{
      this.invalidAddress = false;
      return false;
    }
  }


  finalCheck(){
    this.bitcoinService.getBTCPrice();

  }
}
