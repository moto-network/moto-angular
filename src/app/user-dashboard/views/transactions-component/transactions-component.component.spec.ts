import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsComponentComponent } from './transactions.component';

describe('TransactionsComponentComponent', () => {
  let component: TransactionsComponentComponent;
  let fixture: ComponentFixture<TransactionsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
