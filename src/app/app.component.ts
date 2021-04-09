import { AnimationQueryMetadata } from '@angular/animations';
import { Component, HostListener, Input } from '@angular/core';
import { faBell, faUserCircle,faHome, faSignInAlt , faUserPlus} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
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
  signIn = faSignInAlt;
  userIcon = faUserCircle;
  signUp = faUserPlus;
  displayMenu:boolean = false;
  @Input() userObject: any;
  uid: string | undefined;
  nullUserBool: boolean = true;



  constructor(private _auth:AuthenticationService) {
    _auth.afAuth.authState.subscribe((user)=>{
      this.changeActiveUserState();
    });
  } 

  ngOnInit():void{

  }

  ngOnChanges():void {
    if(this.uid){
      console.log("user  here");
    }
    else{
      console.log("nothing");
    }
  }

  changeActiveUserState():void{
    this.nullUserBool = !this.nullUserBool;
  }

}
