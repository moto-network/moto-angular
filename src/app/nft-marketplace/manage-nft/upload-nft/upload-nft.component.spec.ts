import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNftComponent } from './upload-nft.component';

describe('UploadNftComponent', () => {
  let component: UploadNftComponent;
  let fixture: ComponentFixture<UploadNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
