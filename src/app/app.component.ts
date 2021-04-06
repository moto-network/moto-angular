import { AnimationQueryMetadata } from '@angular/animations';
import { Component, HostListener, Input } from '@angular/core';
import { faBell, faUserCircle,faHome, faCoins } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from './authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'motonetwork';
  bellIcon = faBell;
  homeIcon = faHome;
  coin = faCoins;
  userIcon = faUserCircle;
  displayMenu:boolean = false;
  @Input() userObject: any;
  activeUser: boolean = false;
  uid: string = "";
  innerWidth:any;
  displayMobileMenu: boolean = false;

  constructor() {
    if(localStorage.getItem("user")){
      const userObject = JSON.parse(localStorage.getItem('user')!);
      this.uid = userObject?.uid;
    }
    this.setActiveUserBool();
    console.log("active user is ", this.uid);
  }

  ngOnInit():void{
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }

  ngOnChanges():void {
    this.setActiveUserBool();
  }

  setActiveUserBool() {
    if (this.uid.length > 0) {
      this.activeUser = true;
    }
  }

  public useMobileMenu():boolean{
    if(this.innerWidth < 560){
      return true;
    }
    else{
      return false;
    }   
  } 

  public changeMenuState():void{
    console.log("menu state is ", this.displayMobileMenu);
    this.displayMobileMenu = !this.displayMobileMenu;
  }

}
