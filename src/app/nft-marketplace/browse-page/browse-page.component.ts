import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse-page',
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.css']
})
export class BrowsePageComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }

  createNFT() {
    this._router.navigate(['nft-marketplace', 'manage-nft', 'create-nft']);
  }
}
