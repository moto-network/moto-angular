import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {faSearch,faPlusSquare } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
 
  constructor(
    private _router:Router
  ) { }

  ngOnInit(): void {
  }

  gettingStarted() {
    this._router.navigate(['getting-started']);
  }
}
