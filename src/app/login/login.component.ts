import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

//import { FormControl } from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
});
  constructor(private _authentication: AuthenticationService) { 
    
  }

  signIn(){
     const email: string = this.loginForm.get("email")?.value;
     const password: string = this.loginForm.get("password")?.value;
     this._authentication.SignIn(email, password);
    }
    

  ngOnInit(): void {
  }

}
