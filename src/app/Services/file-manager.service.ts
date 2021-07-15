import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { HttpClient } from '@angular/common/http';
import { NFT } from 'src/declaration';

const keccak256 = require('keccak256');
enum supportedImgTypes {
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/tiff',
  'image/gif'
}
@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  file: File | null = null;
  url: string = "url";
  
  constructor(private crypto:CryptoService) { 

  }
  
  public hashFile(file:File):Promise<any>{
    let hash:string;
    
    return new Promise((resolve, reject) => {
      file.arrayBuffer()
        .then((buffer) => {
          hash = "0x" + keccak256(Buffer.from(buffer)).toString('hex');
          this.file = file;
          resolve(hash);
        })
        .catch((err) => {
          reject(new Error("File Fingerprint Error"));
        });
    });
  }
 

/**
 * mime supported?
 * @param {string} mime 
 * @returns {boolean} 
 */
  public supportedImgType(mime: string) :boolean{
    return mime in supportedImgTypes;
  }
}
