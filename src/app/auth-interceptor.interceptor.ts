import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { GEN_LINK } from 'src/app.config';
import { ProfileService } from './Services/profile.service';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private _profile: ProfileService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url == GEN_LINK) {
      return from(this._profile.getUserAccountToken())
        .pipe(
          map(token => {
            console.log("token ", token);
            return token;
          }),
          map(userToken => request.clone({ setHeaders: { Authorization: `Bearer ${userToken}` } })),
          mergeMap(request => {
            console.log(request);
            return next.handle(request)
          })
      )
    }
    else {
      return next.handle(request);
    }
    //return next.handle(request);
  }
/*
  request = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });*/
}
