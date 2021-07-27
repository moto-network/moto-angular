import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowAltCircleRight, faCaretSquareUp, faCog } from "@fortawesome/free-solid-svg-icons";
import { getContract, getContractAddress, getProvider } from 'src/app.config';
import { WalletService } from 'src/app/Services/BlockchainServices\
/wallet.service';
import { FileManagerService } from 'src/app/Services/file-manager.service';
import { NFTManagerService } from '../Services/nft-manager.service';
import { NFT } from 'src/declaration';

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css']
})
export class CreateNFTComponent implements OnInit {
  //UI elements 
  uploadIcon = faCaretSquareUp;
  optionsIcon = faCog;
  mintButton = faArrowAltCircleRight;
  moreOptions = false;
  errorMessage: null | string = null;
  formValidityForUI: boolean = false;
  //UI elements 

  //  validAddress: boolean = true;

  haveFile: boolean = false;
  filename: string = "";
  account: string | null = null;
  nftForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    beneficiary: new FormControl('', Validators.required),
    chainId: new FormControl('', Validators.required),
    file: new FormControl('', Validators.required)
  });

  chainId: number | null = null;
  file: File | null = null;
  nft: any = {};

  constructor(private _walletService: WalletService,
    private nftManager: NFTManagerService, private router: Router,
    private fileManager: FileManagerService) {

  }

  ngOnInit(): void {
    this._walletService.accountObservable.subscribe((account) => {
      if (account) {
        this.account = account;
        this.nftForm.controls['beneficiary'].setValue(account);
      }
    });
    this._walletService.networkObservable.subscribe((currentNetwork) => {
      this.chainId = currentNetwork;
      if (currentNetwork) {
        if (getProvider(currentNetwork)) {
          this.nftForm.controls['chainId'].setValue(currentNetwork.toString());
          this.isValidForm();
        }
      }
    });
  }

  /**
   * for the UI button if there is no account
   */
  public initAccount(): void {
    this._walletService.getAccount()
      .subscribe((account: string | null) => {
        if (account) {
          this.account = account;
          this.isValidForm();
        }
      });
    this.isValidForm();
  }

  /**
   * this is called if 
   * populateNFT(formInput)=> NFT
   * 
   */
  public createNFT(): void {
    this.nft.name = this.nftForm.get('name')?.value;
    this.nft.beneficiary = this.nftForm.get('beneficiary')?.value;
    this.nft.chainId = parseInt(this.nftForm.get('chainId')?.value);
    this.nft.tokenId = this.generateTokenId();
    this.nft.creator = this._walletService.account;
    this.nft.contractAddress = getContractAddress(this.nft.chainId, "nft");
    this.mint(this.nft);
  }

  private mint(nft: NFT) {
    this.nftManager.mintNFT(nft)//add a please wait thing
      .then((transactionHash: string) => {
        if (transactionHash && nft) {
          console.log("CreateNFT: transactionHash ", transactionHash);
          if (this.file) {
            this.nftManager.uploadNFT(nft, this.file);
          }
          this.router.navigate(['nft-results']);
        }
      })
      .catch((err: any) => {
        console.log(err);
        if (err.code == -32603) {
          alert("You need to switch to proper chain");

        }
      });

  }

  /**
   * populateNFT(file, NFT)=>NFT
   * @param {Event} event 
   * @returns {void}
   */
  public handleFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.file = target.files[0];
      this.filename = this.file.name;
      //do more validation
      if (this.file.size > 0) {
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

  public options(): void {
    this.moreOptions = !this.moreOptions;
  }

  /**
   * populateNFT(random)=> NFT.tokenId
   * @returns {string} tokenId
   */
  private generateTokenId(): string {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const bytesHex = bytes
      .reduce((o, v) => o + ('00' + v.toString(16)).slice(-2), '');
    return "0x" + BigInt('0x' + bytesHex).toString(16);
  }

  private validAddress(): boolean {
    let address: string = this.nftForm.get('beneficiary')?.value;
    if (address) {
      let validityCheck = this._walletService.isValidAddress(address, 'ETH');
      if (validityCheck) {
        this.errorMessage = null
        return true;
      }
      else {
        this.errorMessage = "invalid address";
        return false;
        
      }
    }
    else {
      return false;
    }
  }

  public isValidForm(): boolean {
    if (this.validAddress() && this.validFile()
      && this.account && this.validChain()) {
      this.formValidityForUI = true;
      return true;
    }
    else {
      this.formValidityForUI = false;
      return false;
    }
  }

  private validFile(): boolean {
    return this.haveFile;
  }

  /**
   * walletChain == formChain
   * @returns {boolean}
   */
  private validChain(): boolean { 
    let formChainId: number = parseInt(this.nftForm.get('chainId')?.value);
    if (this.nft) {
      if (this.chainId == formChainId) {
        console.log("is truee");
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

}
