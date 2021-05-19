import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { WalletService } from './BlockchainServices/wallet.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    const walletSpy = jasmine.createSpyObj('WalletService',['']);
    const authSpy = jasmine.createSpyObj('AuthenticationService',['']);
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers:[
        {provide:AuthenticationService,useValue:authSpy},
        {provide:WalletService,useValue:walletSpy}
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
