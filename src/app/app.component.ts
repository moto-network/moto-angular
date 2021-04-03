import { Component, Input } from '@angular/core';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from './authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'motonetwork';
  bellIcon = faBell;
  userIcon = faUserCircle;
  @Input() userObject: any;
  activeUser: boolean = false;
  uid: string = "";
  constructor() {
    if(localStorage.getItem("user")){
      const userObject = JSON.parse(localStorage.getItem('user')!);
      this.uid = userObject?.uid;
    }
    this.setActiveUserBool();
    console.log("active user is ", this.uid);
  }

  ngOnChanges():void {
    this.setActiveUserBool();
  }

  setActiveUserBool() {
    if (this.uid.length > 0) {
      this.activeUser = true;
    }
  }

}
