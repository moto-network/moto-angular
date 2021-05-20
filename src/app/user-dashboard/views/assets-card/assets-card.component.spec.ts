;import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetConverterService } from '../../asset-converter.service';

import { AssetsCardComponent } from './assets-card.component';

describe('AssetsCardComponent', () => {
  let component: AssetsCardComponent;
  let fixture: ComponentFixture<AssetsCardComponent>;
  let service:AssetConverterService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsCardComponent],
      providers:[{provide:AssetConverterService, useValue:{}}]

    })
    .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(AssetConverterService);
    fixture = TestBed.createComponent(AssetsCardComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
