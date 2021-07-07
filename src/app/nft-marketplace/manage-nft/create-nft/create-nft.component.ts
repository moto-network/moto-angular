import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, 
  ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { allowedNodeEnvironmentFlags } from 'node:process';
import { WalletService } from 'src/app/Services/BlockchainServices\
/wallet.service';
import { FileManagerService } from 'src/app/Services/file-manager.service';
import { NFTManagerService } from 'src/app/Services/MarketServices\
/nft-manager.service';
import {NFT } from "src/declaration";
@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css']
})
export class CreateNFTComponent implements OnInit {
  errorMessage:null | string = null;
  validAddress:boolean = false;
  formValid:boolean = false;
  validName:boolean = false;
  haveFile:boolean = false;
  account:string | null= null;
  nftForm:FormGroup = new FormGroup({
    name: new FormControl(''),
    beneficiary: new FormControl('', Validators.required),
    chainId: new FormControl('',Validators.required),
   
    file: new FormControl('',Validators.required)
  });

  chainId:number | null = null;
  file: File | null = null;

  constructor(private _walletService:WalletService, 
    private nftManager:NFTManagerService, private router:Router, 
    private fileManager: FileManagerService) {
    this.nftManager.initNFTData();
     }

  ngOnInit(): void {
    this._walletService.accountSubject.subscribe((account)=>{
      this.account = account;
    });
    this._walletService.networkVersion.subscribe((currentNetwork) => {
      this.chainId = currentNetwork;
    });
  }

  public initializeAccount(): void{
      this._walletService.requestAccount()
        .then((account) => {
          if (account) {
            this.checkForm();
            
          }
        })
        .catch((err) => {
          alert(err);
        });
    
  }
//0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7
  public mint() {
  
    this.nftManager.mintNFT()//add a please wait thing
    .then((result:any)=>{
      console.log("transction data is ", result);

      if (result) {
        this.nftManager.recordNFT();
        this.router.navigate(['nft-marketplace', 'manage-nft', 'nft-results']);
      }
      

    })
    .catch((err:any)=>{
      console.log(err);
      if (err.code == -32603) {
        alert("You are on switch to proper chain");
      
      }
    });
  }


  public validateAddress():void{
    let address:string = this.nftForm.get('beneficiary')?.value;
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
    if(this.validAddress && this.validName && this.haveFile
      && this._walletService.accountReady()) {
      this.formValid = true;
    }

  }

 
  public validateName():void{
    let name:string = this.nftForm.get('name')?.value;
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
      this.file = target.files[0];
      //do more validation
      if(this.file.size > 0){
        this.fileManager.hashFile(this.file)
          .then((hash) => {
            if (this.nftManager.nft) {
              this.nftManager.nft.contentHash = hash;
            }  
          })
          .catch((error: any) => {
            alert(error.message);
          });
        this.haveFile = true;
      }
    }
    
  }


  public prepareInput(): void {
    if (this.nftManager.nft) {
      this.nftManager.nft.name = this.nftForm.get('name')?.value;
      this.nftManager.nft.beneficiary = this.nftForm.get('beneficiary')?.value;
      this.nftManager.nft.chainId = parseInt(this.nftForm.get('chainId')?.value);
      this.nftManager.nft.tokenId = this.generateTokenId();
    }
    
    if (!this.correctChain()) {
      alert("not correct chain");
    }
    else {
      this.mint();
    }
  }


  private generateTokenId():string{
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const bytesHex = bytes
    .reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
    return "0x"+BigInt('0x' + bytesHex).toString(16);
  }
 

  private correctChain(): boolean {
    console.log("chain id ", this.chainId);
    if (this.nftManager.nft) {
      return this.chainId == this.nftManager.nft.chainId;
    }
    else {
      return false;
    }
  }
}
