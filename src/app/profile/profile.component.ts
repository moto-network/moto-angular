import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faGem, faCrown, faHeart, faGift, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DBNFT, NFT, NFTCollection, SessionData } from 'src/declaration';
import { Location } from "@angular/common";
import { ProfileService } from '../Services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  diamond = faGem;
  crown = faCrown;
  heart = faHeart;
  gift = faGift;
  support = faHandHoldingHeart;
  glimmerAnimation: any = null;
//localhost:4200/profile?address=0xDcb982dEa4C22aBE650c12a1678537a3e8Ddd30D
  address: string | null = null;
  isCreator: boolean = true;
  scrollTag: string = "";
  nftCollectionTag: string = "";
  session: SessionData | null = null;
  constructor(private _profileManager: ProfileService, private _router: Router,
    private readonly location: Location, private readonly _route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
   
    this._route.queryParams.subscribe((params) => {
      this.address = params["address"];
      if (this.address) {
        this._profileManager.initProfile(this.address);
      }
    });
    
  }

  ngAfterViewInit(): void {
    if (this.address) {
      this.location.go(this.createNavigation(this.address));
    }
  
  }

  ngOnDestroy(): void {
    
  }

  

  private createNavigation(profile:string):string {
    const url = this._router.createUrlTree([], { relativeTo: this._route, queryParams: { address: profile } }).toString();
    return url;
  }

  comingSoon() {
    alert("coming soon.");
  }

}
