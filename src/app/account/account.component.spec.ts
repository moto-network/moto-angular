import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../authentication.service';
import { WalletService } from '../BlockchainServices/wallet.service';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthenticationService',['']);
    const walletSpy = jasmine.createSpyObj('WalletService',['metaMaskCheck']);
    await TestBed.configureTestingModule({
      declarations: [ AccountComponent ],
      providers:[{
        provide:WalletService,useValue:walletSpy
      },
      {
        provide:AuthenticationService, useValue:authSpy
      }
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
