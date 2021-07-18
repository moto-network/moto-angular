import { AnimationQueryMetadata } from '@angular/animations';
import { Component, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  placeholder = "   Address / NFT ID / Fingerprint / Copyright ID";
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
  addressContainer: any;
  searchForm: FormGroup = new FormGroup({
    search: new FormControl('')
  });
  constructor(private _auth:AuthenticationService, private _walletService:WalletService) {
      
  } 


  ngOnInit():void{
    this._auth.afAuth.authState.subscribe((user)=>{
      this.changeActiveUserState();
    });
    this._walletService.accountSubject.subscribe((remoteAddress)=>{
      this.address = remoteAddress;
      if(remoteAddress){
        this.notificationMessage = "MetaMask Connected";

        if(this.notificationBar){
          console.log("found  ");
          this.notificationBar.style.visibility="visible";
          this.animation.play();
        }
//        this.animation.play();
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
    this.timeline  = anime.timeline({
      autoplay:true,
      duration:3000
    });
    this.notificationBar = document.getElementById("notification-bar");
    this.addressContainer = document.getElementById("address-container");
    this.animation = anime({
      targets:"#notification-bar",
      backgroundColor: '#4BB543',
      translateY:30,
      autoplay:false,
      duration:1500,
      direction:"alternate", 
      delay:anime.stagger(200)
  
    });

    this.addressAnimation =  anime({
      targets:"#address-container",
      easing:"easeInOutQuad",
      background:"#4BB543",
      direction:"alternate",
      translateX:-30,
      autoplay:false, 
      duration:700
    });



   
    this.animation.finished.then(()=>{
      this.notificationBar.style.visibility  = "hidden";
      this.addressContainer.style.visibility = "visible";
      this.addressAnimation.play();
      
    });

    this.timeline.add(this.animation);
    
  }

  ngAfterViewChecked():void{
    
  }

  changeActiveUserState():void{
    this.nullUserBool = !this.nullUserBool;
  }

}
