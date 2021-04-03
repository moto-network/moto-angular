import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftBrowseResultsComponent } from './nft-browse-results.component';

describe('NftBrowseResultsComponent', () => {
  let component: NftBrowseResultsComponent;
  let fixture: ComponentFixture<NftBrowseResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftBrowseResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftBrowseResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
