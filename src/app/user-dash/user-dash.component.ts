import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../Services/profile.service';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrls: ['./user-dash.component.css']
})
export class UserDashComponent implements OnInit {

  constructor(private _profile: ProfileService) {
    this._profile.getUserAccountToken()
      .then((token) => {
        console.log('token is ', token);
      });
  }

  ngOnInit(): void {
  }

}
