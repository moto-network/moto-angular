import { AnimationQueryMetadata } from '@angular/animations';
import { Component, ComponentFactoryResolver, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faBell, faUserCircle, faHome, faSignInAlt,
  faUserPlus, faUserAstronaut, faSearch, faPlusSquare
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthenticationService } from './Services/authentication.service';
import { WalletService } from './Services/BlockchainServices/wallet.service';
import { NFTManagerService } from './Services/MarketServices/nft-manager.service';
import { ProfileService } from './Services/profile.service';
import { SearchService } from './Services/search.service';
import { SearchResults } from "src/declaration";
declare var anime: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchIcon = faSearch;
  add = faPlusSquare;
  placeholder = "   Address / NFT ID / Fingerprint / License ID";
  user = faUserAstronaut;
  title = 'motonetwork';
  bellIcon = faBell;
  homeIcon = faHome;
  signIn = faSignInAlt;
  userIcon = faUserCircle;
  signUp = faUserPlus;
  displayMenu: boolean = false;
  @Input() userObject: any;
  uid: string | undefined;
  nullUserBool: boolean = true;
  address: string | null = null;
  notificationBarVisible: boolean = false;
  notificationMessage: string = "";
  animation: any;
  timeline: any;
  notificationBar: any;
  topBarFlash: any;
  searchAnimation: any = null;
  searchForm: FormGroup = new FormGroup({
    searchInput: new FormControl('')
  });
  constructor(private _auth: AuthenticationService,
    private _walletService: WalletService,
    private _router: Router, private _nftManager: NFTManagerService,
    private _profileManager: ProfileService, private _searchManager: SearchService) {

  }


  ngOnInit(): void {
    this._auth.afAuth.authState.subscribe((user) => {
      this.changeActiveUserState();
    });
    this._walletService.accountObservable.subscribe((remoteAddress) => {
      this.address = remoteAddress;
      if (remoteAddress) {

        this.topBarFlash.play();
      }
    });
  }

  ngAfterViewInit(): void {

    this.animation = anime({
      targets: "#user-icon",
      color: ['gray', '#e31b23', '#4BB543', '#FFD700', '#46c3d1'],
      autoplay: false,

      duration: 4000,
      easing: 'easeInBounce'
    });

    this.topBarFlash = anime({
      targets: "#header",
      translateX: [0, -30, 30, 0],
      autoplay: false,

      duration: 1500,
      easing: 'easeInOutQuad',
      changeComplete: () => {
        this.animation.play();
      }
    });

    this.searchAnimation = anime({
      targets: "#search-icon",
      color: ['#e31b23', '#4BB543', '#FFD700', '#46c3d1'],
      duration: 4000,
      autoplay: false,
      loop: true
    })

  }

  ngAfterViewChecked(): void {

  }

  changeActiveUserState(): void {
    this.nullUserBool = !this.nullUserBool;
  }

  goToPage(page: string): void {
    this._router.navigate([page]);
  }

  /**
   * order of check
   * fingerprint
   * address,
   * nftid
   * license
   */

  search() {
    const value: string = this.searchForm.get("searchInput")?.value;
    const paramLength: number = value.length;
    this.playSearchAnimation();
    this._searchManager.search(value)
      .subscribe((results: SearchResults) => {
        this.handleSearchResults(results);
      });
  }


  private handleSearchResults(results: SearchResults) {
    this.endSearchAnimation();
    if (!results.empty) {
      if (results.suggestedRoute == "nft") {
        this._nftManager.setNFT(results.result);
        this._router.navigate([results.suggestedRoute]);
      }
      else if (results.suggestedRoute == "profile") {
        this._profileManager.setNFTCollection(results.result);
        this._router.navigate(['profile']);
      }
    }
    else {
      //empty results;
    }
  }

  private playSearchAnimation(): void {
    if (this.searchAnimation) {
      this.searchAnimation.play();
      setTimeout(() => { this.endSearchAnimation() }, 5000);
    }
  }

  private endSearchAnimation(): void {
    if (this.searchAnimation) {
      this.searchAnimation.pause();
      this.searchAnimation.reset();
    }
  }


}
