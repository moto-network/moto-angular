import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToMarketplaceComponent } from './add-to-marketplace.component';

describe('AddToMarketplaceComponent', () => {
  let component: AddToMarketplaceComponent;
  let fixture: ComponentFixture<AddToMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToMarketplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
