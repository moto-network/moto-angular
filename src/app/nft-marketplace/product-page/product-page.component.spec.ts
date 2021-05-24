import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { NftManagerService } from 'src/app/DataManagement/remote-data-manager/services/nft-manager/nft-manager.service';
import { NFTMarketplaceRoutingModule } from '../marketplace-routing.module';

import { ProductPageComponent } from './product-page.component';
class MockManager{

}
describe('ProductPageComponent', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;
 // const nftServiceSpy = jasmine.createSpyObj('NftManagerService',['getNFTProduct']);
  const nftStub = {
    "on_sale": true,
    "id": "0x162FD",
    "img": "https://motonetwork00.s3-us-west-1.amazonaws.com/b6aVYzdnpto.jpg",
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "network":"BSC",
    "price": "312",
    "name": "GlitchArt01",
    "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nulla risus, dignissim vitae sollicitudin id, suscipit eu est. Curabitur sem diam, ornare id est imperdiet, interdum finibus erat. Suspendisse potenti. Vestibulum vitae malesuada eros, a lacinia odio. Pellentesque dignissim varius ultricies. Maecenas vitae ornare magna, vel malesuada neque. Mauris finibus nisl et est tincidunt vestibulum in quis tellus. In scelerisque lectus pretium elit molestie suscipit. Fusce ut sodales sapien."
  };
  
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPageComponent ],
      providers:[{provide:NftManagerService,useValue:MockManager}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
  });

  it("exist",()=>{
    expect(component).toBeTruthy();
  });
});
