import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {AuthenticationService} from './authentication.service';
class Fuck{
  constructor(){}
}

describe('Fuck Service', () => {
  let service: AuthenticationService;
  const aFireSpy = jasmine.createSpyObj('AngularFirestore',['']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[AuthenticationService,
        {provide:AngularFireAuth,useValue:{}},
        {provide:Router,useValue:{}},
        {provie:NgZone,useValue:{}}]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });
});
