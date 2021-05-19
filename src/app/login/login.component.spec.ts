import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../authentication.service';
import { WalletService } from '../BlockchainServices/wallet.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const walletSpy = jasmine.createSpyObj('WalletService',['']);
  const authSpy = jasmine.createSpyObj('AuthenticationService',['']);
  const routerSpy = jasmine.createSpyObj('Router',['']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers:[{provide:AuthenticationService,useValue:authSpy},
      {provide:WalletService,useValue:walletSpy},
    {provide:Router,useValue:routerSpy}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
