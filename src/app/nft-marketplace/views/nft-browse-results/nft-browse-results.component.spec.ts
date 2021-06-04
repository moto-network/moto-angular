import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NFTManagerService } from '../../../Services/MarketServices/nft-manager.service';
import {of} from 'rxjs';
import { NftBrowseResultsComponent } from './nft-browse-results.component';
import { Router } from '@angular/router';

describe('NftBrowseResultsComponent', () => {
  let component: NftBrowseResultsComponent;
  let fixture: ComponentFixture<NftBrowseResultsComponent>;
  const nftSpy = jasmine.createSpyObj('NftManagerService',['getNFTs']);
  const routerSpy = jasmine.createSpyObj('Router',['']);
  nftSpy.getNFTs.and.returnValue(of({"docs":['teste','datad'],"data":()=>{}}));
  beforeEach(async () => {
    component = await TestBed.configureTestingModule({
      declarations: [ NftBrowseResultsComponent ],
      providers:[{provide:NFTManagerService,useValue:nftSpy},{provide:Router,useValue:routerSpy}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    //fixture = TestBed.createComponent(NftBrowseResultsComponent);
    //component = fixture.componentInstance;
//    fixture.detectChanges();
  });

  it('should create', () => {
    component = new NftBrowseResultsComponent(nftSpy,routerSpy);
    expect(component).toBeTruthy();
  });
});
