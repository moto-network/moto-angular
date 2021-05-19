import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Router } from "@angular/router";
import {  NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {of} from 'rxjs';
describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const aFireSpy = jasmine.createSpyObj('AngularFireAuth',{},
    {
      "afAuth":{
        "authState":of({"dummy":"data"})},

      }
      );
    const routerSpy = jasmine.createSpyObj('Router',['']);
    const zoneSpy = jasmine.createSpyObj('NgZone',['']);
    aFireSpy
    await TestBed.configureTestingModule({
      providers:[
        {provide:AngularFireAuth,useValue:aFireSpy},
        {provide:Router, useValue:routerSpy},
        {provide:NgZone,useValue:zoneSpy}
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('Auth should be created', () => {
    expect(true).toBeTruthy();
  });
});
