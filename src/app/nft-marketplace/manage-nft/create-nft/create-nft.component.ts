import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, 
  ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from 'src/app/Services/BlockchainServices\
/wallet.service';
import { FileManagerService } from 'src/app/Services/file-manager.service';
import { NFTManagerService } from 'src/app/Services/MarketServices\
/nft-manager.service';

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
  createNFTform:FormGroup = new FormGroup({
    name: new FormControl(''),
    beneficiary: new FormControl('', Validators.required),
    //add chainID later but now only BSC
    file: new FormControl('',Validators.required)
  });

  nft:any = {};
  chainId:number = 97;
  file: File | null = null;

  constructor(private _walletService:WalletService, 
    private nftManager:NFTManagerService, private router:Router, 
    private fileManager:FileManagerService) { }

  ngOnInit(): void {
    this._walletService.accountSubject.subscribe((account)=>{
      this.account = account;
    });
  }

  public initializeAccount():void{
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
  public createNFT(){
    console.log("NFT object is: ",this.nft);
    console.log("network id is ", this._walletService.networkVersion);
    this.nftManager.createNFT(this.nft)//add a please wait thing
    .then((result:any)=>{
      console.log("transction data is ", result);
      if (result) {
        
        this.router.navigate(['nft-marketplace', 'manage-nft', 'nft-results']);
      }
      

    })
    .catch((err:any)=>{
      console.log(err.message);
      if(err.message == "NoAccountFound"){
       this._walletService.requestAccount();
        //make a service
      }
    });
    /* let nftObj = {
      "name":"OnTheSecondDay",
      "chainId":97,
      "beneficiary":"0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D",
      "contentHash": "0x706f58549f18af06d914254c950ef94ab8e2df440fcc62a72bff247f304ebc62",
      "tokenId":2,
    };*/
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
    if(this.validAddress && this.validName && this.haveFile
      &&this._walletService.accountReady()){
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
      this.file = target.files[0];
      //do more validation
      if(this.file.size > 0){
        this.fileManager.hashFile(this.file)
          .then((hash) => {
            this.nft.contentHash = hash;
          })
          .catch((error: any) => {
            alert(error.message);
          });
        this.haveFile = true;
      }
    }
    
  }


  public prepareInput(): void {
    this.nft.name = this.createNFTform.get('name')?.value;
    this.nft.beneficiary = this.createNFTform.get('beneficiary')?.value;
    this.nft.chainId = this.chainId;
    this.nft.tokenId = this.generateTokenId();
  }


  private generateTokenId():string{
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    const bytesHex = bytes
    .reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
    return "0x"+BigInt('0x' + bytesHex).toString(16);
  }
 
}
