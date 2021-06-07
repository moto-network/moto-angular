import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css']
})
export class CreateNFTComponent implements OnInit {
  
  createNFTform:FormGroup = new FormGroup({
    name: new FormControl(''),
    beneficiary: new FormControl(''),
    chainId: new FormControl(''),
    file: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {

  }

  /*
  get name
  chain id
  beneficiary
  NFT file
  */
}
