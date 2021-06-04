import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { WalletService } from '../BlockchainServices/wallet.service';

import { PurchaseBidManagerService } from './purchase-bid-manager.service';

describe('PurchaseBidManagerService', () => {
  let service: PurchaseBidManagerService;
  const dummyNFT = {
    "on_sale": true,
    "id": "0x162FD",
    "img": "https://motonetwork00.s3-us-west-1.amazonaws.com/b6aVYzdnpto.jpg",
    "address": "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    "network":"BSC",
    "price": "312",
    "price_currency":"MOTO",
    "name": "GlitchArt01",
    "desc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nulla risus, dignissim vitae sollicitudin id, suscipit eu est. Curabitur sem diam, ornare id est imperdiet, interdum finibus erat. Suspendisse potenti. Vestibulum vitae malesuada eros, a lacinia odio. Pellentesque dignissim varius ultricies. Maecenas vitae ornare magna, vel malesuada neque. Mauris finibus nisl et est tincidunt vestibulum in quis tellus. In scelerisque lectus pretium elit molestie suscipit. Fusce ut sodales sapien."
  };
  const inValidDummuy = {
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:WalletService,useValue:{}}]
    });
    service = TestBed.inject(PurchaseBidManagerService);
  });

/*
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('#buyNFT should return Observable of transaction hash if NFT is valid',()=>{
    let transactionHash:Observable<any>;
    //transactionHash = service.buyNFT(dummyNFT);
    //expect(transactionHash).toBeInstanceOf(Observable).or.;
  });

  it('#buyNFT should return null if NFT is invalid',()=>{
    let result = service.buyNFT(inValidDummuy);
    expect(result).toBeNull();
  });

  it("#verifyNFT shoudl return a boolean value",()=>{
    let result = service["verifyNFT"](dummyNFT);
    expect(result).toBeInstanceOf(Boolean);
  });
  */
});
