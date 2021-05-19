import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Router } from "@angular/router";
import {  NgZone } from '@angular/core';
describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService',['']);
    const routerSpy = jasmine.createSpyObj('AuthenticationService',['']);
    const zoneSpy = jasmine.createSpyObj('AuthenticationService',['']);
    TestBed.configureTestingModule({
      providers:[
        {provide:AuthenticationService,useValue:authSpy},
        {provide:Router, useValue:routerSpy},
        {provide:NgZone,useValue:zoneSpy}
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
