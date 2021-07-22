import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftCreationResultsComponent } from './nft-creation-results.component';

describe('NftCreationResultsComponent', () => {
  let component: NftCreationResultsComponent;
  let fixture: ComponentFixture<NftCreationResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftCreationResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftCreationResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
