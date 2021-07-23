import { Injectable } from '@angular/core';
import { LocalSession ,SessionData} from 'src/declaration';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  constructor() { }

  set(name:string, value:any): void {
    sessionStorage.setItem(name, JSON.stringify(value));
  }

  get(name:string): any {
    let sessionData: string | null = sessionStorage.getItem(name);
    return sessionData ? JSON.parse(sessionData) : sessionData;
  }

  clear(name: string) {
    sessionStorage.removeItem(name);
  }
}
