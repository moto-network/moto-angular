import { ComponentFixture, TestBed } from '@angular/core/testing';
import {WalletService} from "../Services/BlockchainServices/wallet.service";
import {BitcoinService} from '../Services/BlockchainServices/bitcoin.service';
import { OnRampComponent } from './on-ramp.component';
import {of } from 'rxjs';
describe('OnRampComponent', () => {
  let component: OnRampComponent;
  let fixture: ComponentFixture<OnRampComponent>;
  const walletSpy = jasmine.createSpyObj('WalletService',['']);
  const bitcoinSpy = jasmine.createSpyObj('BitcoinService',['getBTCPrice']);
  const bitcoinStub = {'data':{'amount':1200}};
  bitcoinSpy.getBTCPrice.and.returnValue(of(bitcoinStub));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnRampComponent ],
      providers:[
        {provide:WalletService,useValue:walletSpy},
        {provide:BitcoinService,useValue:bitcoinSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
