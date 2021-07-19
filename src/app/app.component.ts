import { AnimationQueryMetadata } from '@angular/animations';
import { Component, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faBell, faUserCircle, faHome, faSignInAlt,
  faUserPlus, faUserAstronaut, faSearch, faPlusSquare
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthenticationService } from './Services/authentication.service';
import { WalletService } from './Services/BlockchainServices/wallet.service';

declare var anime: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  search = faSearch;
  add = faPlusSquare;
  placeholder = "   Address / NFT ID / Fingerprint / License ID";
  user = faUserAstronaut;
  title = 'motonetwork';
  bellIcon = faBell;
  homeIcon = faHome;
  signIn = faSignInAlt;
  userIcon = faUserCircle;
  signUp = faUserPlus;
  displayMenu:boolean = false;
  @Input() userObject: any;
  uid: string | undefined;
  nullUserBool: boolean = true;
  address:string | null = null;
  notificationBarVisible:boolean = false;
  notificationMessage:string = "";
  animation:any;
  timeline:any;
  notificationBar:any;
  addressAnimation:any;

  searchForm: FormGroup = new FormGroup({
    searchInput: new FormControl('')
  });
  constructor(private _auth: AuthenticationService, private _walletService: WalletService,
  private _router:Router) {
      
  } 


  ngOnInit():void{
    this._auth.afAuth.authState.subscribe((user)=>{
      this.changeActiveUserState();
    });
    this._walletService.accountObservable.subscribe((remoteAddress)=>{
      this.address = remoteAddress;
      if(remoteAddress){
        this.notificationMessage = "Wallet Connected";

        if(this.notificationBar){
          this.notificationBar.style.visibility = "visible";
          this.notificationBar.style.display = "block";
          this.animation.play();
        }
       this.animation.play();
        setTimeout(()=>{
//          this.notificationBarVisible = false;

        },3200);
      }
    });
  }

  ngOnChanges():void {
    if(this.uid){
      console.log("user  here");
    }
    else{
      console.log("nothing");
    }
  }

  ngAfterViewInit(): void {
    this.animation = anime({
      targets: "#user-icon",
      color: ['gray','#e31b23', '#4BB543', '#FFD700', '#46c3d1'],
      autoplay: false,

      duration: 4000,
      easing: 'easeInBounce'
    });

  }

  ngAfterViewChecked():void{
    
  }

  changeActiveUserState():void{
    this.nullUserBool = !this.nullUserBool;
  }

  goToCreate(): void {
    this._router.navigate(['create']);
  }

}
