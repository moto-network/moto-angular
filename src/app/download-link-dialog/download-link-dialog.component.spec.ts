import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadLinkDialogComponent } from './download-link-dialog.component';

describe('DownloadLinkDialogComponent', () => {
  let component: DownloadLinkDialogComponent;
  let fixture: ComponentFixture<DownloadLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadLinkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
