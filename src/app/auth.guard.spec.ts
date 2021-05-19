import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  const authServiceSpy = jasmine.createSpyObj('AutheticationService',['']);
  const routerSpy = jasmine.createSpyObj('Router',['']);
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:AuthenticationService,useValue:authServiceSpy},
      {provide:Router,useValue:routerSpy}]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
