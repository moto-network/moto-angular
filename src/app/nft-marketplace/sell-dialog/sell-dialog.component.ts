import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NFTManagerService } from 'src/app/Services/MarketServices/nft-manager.service';

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.css']
})
export class SellDialogComponent implements OnInit {
  loading = false;
  constructor(private _nftManager: NFTManagerService
    , private dialogRef: MatDialogRef<SellDialogComponent>) { }
  sellNFTForm: FormGroup = new FormGroup({
    price: new FormControl('', Validators.required)
  });
  ngOnInit(): void {
  }

  sellNFT() {
    /**
     * @todo clean the input 
     * @todo add convert currency
     */
    this.loading = true;
   // this.dialogRef.close();
  }

}
