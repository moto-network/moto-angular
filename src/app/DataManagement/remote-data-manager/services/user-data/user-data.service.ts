import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _angularFS:AngularFirestore) { }

  saveEmailRemote(email:string): boolean{
    let success:boolean = false;
    this._angularFS.collection("Emails").add({"email":email}).then((reference)=>{
      //take this oout and put behind a firebase function
      if(reference){
        success = true;
      }
      console.log(reference, "saved");
     
    });
    
    return success;
  }
}
