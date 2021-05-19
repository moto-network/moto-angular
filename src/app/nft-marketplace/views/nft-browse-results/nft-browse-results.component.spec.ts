import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NftManagerService } from 'src/app/DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';
import {of} from 'rxjs';
import { NftBrowseResultsComponent } from './nft-browse-results.component';

describe('NftBrowseResultsComponent', () => {
  let component: NftBrowseResultsComponent;
  let fixture: ComponentFixture<NftBrowseResultsComponent>;
  const nftSpy = jasmine.createSpyObj('NftManagerService',['getNFTs']);
  nftSpy.getNFTs.and.returnValue(of({"docs":['teste','datad'],"data":()=>{}}));
  beforeEach(async () => {
    component = await TestBed.configureTestingModule({
      declarations: [ NftBrowseResultsComponent ],
      providers:[{provide:NftManagerService,useValue:nftSpy}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    //fixture = TestBed.createComponent(NftBrowseResultsComponent);
    //component = fixture.componentInstance;
//    fixture.detectChanges();
  });

  it('should create', () => {
    component = new NftBrowseResultsComponent(nftSpy);
    expect(component).toBeTruthy();
  });
});
