import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/Services/BlockchainServices/wallet.service';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css']
})
export class CreateNFTComponent implements OnInit {
  errorMessage:null | string = null;
  validAddress:boolean = true;
  formValid:boolean = true;
  validName:boolean = true;
  haveFile:boolean = true;
  createNFTform:FormGroup = new FormGroup({
    name: new FormControl(''),
    beneficiary: new FormControl('', Validators.required),
    //add chainID later but now only BSC
    file: new FormControl('',Validators.required)
  });

  constructor(private _walletService:WalletService, 
    private nftManager:NFTManagerService, private router:Router) { }

  ngOnInit(): void {

  }


//0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7
  public createNFT(){
    let nftObj = {
      "name":"OnThisDay",
      "chainId":97,
      "beneficiary":"0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
      "contentHash": "0x706f58549f18af06d914254c950ef94ab8e2df440fcc62a72bff247f304ebc62",
      "tokenId":1,
    };
   
    this.nftManager.createNFT(nftObj)//add a please wait thing
    .then((result:any)=>{
      console.log("transction data is ", result);
      this.router.navigate(['nft-results'])

    })
    .catch((err:any)=>{
      console.log(err.message);
      if(err.message == "NoAccountFound"){
        alert("No Account found. Please turn on your MetaMask or equivalent.")
      }
    });
  }


  public validateAddress():void{
    let address:string = this.createNFTform.get('beneficiary')?.value;
    if(address){
      let validityCheck = this._walletService.isValidAddress(address,'ETH');
      if(validityCheck){
        this.errorMessage = null
        this.validAddress = true;
      }
      else{
        this.validAddress = false;
        this.errorMessage = "invalid address";
      }
    }
    else{
      this.validAddress = false;
      this.errorMessage = "invalid address";
    }
  }

  public checkForm():void{
    console.log("form checked");
    if(this.validAddress && this.validName && this.haveFile){
      this.formValid=true;
    }

  }

  public validateName():void{
    let name:string = this.createNFTform.get('name')?.value;
    if(name.length == 0){
      this.validName = false;
      this.errorMessage = "invalid name";
    }
    else{
      this.validName = true;
      this.errorMessage = null;
    }
  }


  public handleFile(event:Event){
    const target = event.target as HTMLInputElement;
    if(target.files){
      const file: File | null  = target.files[0];
      //do more validation
      if(file.size > 0){
        this.haveFile = true;
      }
    }
    
  }
  /*

  get name
  chain id
  beneficiary
  NFT file
  */
}
