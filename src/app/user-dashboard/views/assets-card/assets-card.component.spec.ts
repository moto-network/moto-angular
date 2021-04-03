;import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCardComponent } from './assets-card.component';

describe('AssetsCardComponent', () => {
  let component: AssetsCardComponent;
  let fixture: ComponentFixture<AssetsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
