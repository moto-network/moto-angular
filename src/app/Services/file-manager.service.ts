import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
const keccak256 = require('keccak256');
@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private crypto:CryptoService) { 

  }
  
  public hashFile(file:File):Promise<any>{
    let hash:string;
    
    return new Promise((resolve, reject) => {
      file.arrayBuffer()
        .then((buffer) => {
          hash = "0x" + keccak256(Buffer.from(buffer)).toString('hex');
          resolve(hash);
        })
        .catch((err) => {
          reject(new Error("File Fingerprint Error"));
        });
    });
  }
 
}
