import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({
    email: new FormControl(''),
  });
  error_message:string="";
  error:boolean=false;
  constructor(private _db:AngularFirestore, public router:Router) { }

  ngOnInit(): void {
  }

  addEmail(){
    const email_regexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    const email: string = this.signUpForm.get("email")?.value;
    if(email){
      if(email_regexp.test(email)){
        this._db.collection("Emails").add({"email":email}).then((reference)=>{
          console.log(reference, "saved");
          this.router.navigate(['thank-you']);
        });
      }
      else{
        this.error=true;
        this.error_message="Invalid Email";
      }
    }

  }

  reset(){
    this.error = false;
    
  }


}
