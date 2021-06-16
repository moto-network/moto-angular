import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftResultsComponent } from './nft-results.component';

describe('NftResultsComponent', () => {
  let component: NftResultsComponent;
  let fixture: ComponentFixture<NftResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
