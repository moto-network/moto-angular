import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinExchangeComponent } from './coin-exchange.component';

describe('CoinExchangeComponent', () => {
  let component: CoinExchangeComponent;
  let fixture: ComponentFixture<CoinExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
