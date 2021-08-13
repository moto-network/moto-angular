import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { FileNFT } from 'src/declaration';
import { NFTManagerService } from '../Services/nft-manager.service';

@Component({
  selector: 'app-download-link-dialog',
  templateUrl: './download-link-dialog.component.html',
  styleUrls: ['./download-link-dialog.component.css']
})
export class DownloadLinkDialogComponent implements OnInit, OnDestroy {
  nft: FileNFT | null = null;
  nftSub: Subscription | null = null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { link: string },
    private _nftManager: NFTManagerService,
    private matDialogRef: MatDialogRef<DownloadLinkDialogComponent>) { }

  ngOnInit(): void {
    this.nftSub = this._nftManager.getNFT()
      .subscribe((nft) => {
        if (nft) {
          this.nft = nft;
        }
      });
  }

  download() {
    
  }

  

  ngOnDestroy(): void {
    this.nftSub?.unsubscribe();
  }

}
