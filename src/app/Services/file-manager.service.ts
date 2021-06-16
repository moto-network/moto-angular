import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private crypto:CryptoService) { 

  }
  
  
}
