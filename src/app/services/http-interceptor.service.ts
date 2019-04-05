import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // add a custom header
    //let customReq: HttpRequest<any> = undefined;
    if (request.url.indexOf('pse.online.scea.com') !== -1) {
      const token = localStorage.getItem('authToken');
      const headers = request.headers.set('Authorization', 'Token token=' + token)
      request = request.clone({
        headers
      });
      return next.handle(request).catch(() => {
        request.clone({
          headers
        });
        return next.handle(request);
      });
    }
    // else if (request.url.indexOf('twitch') !== -1) {
    //    const headers = request.headers.set('Client-ID', 'z1hu6d9wa4s6my6oq4vrazewza5nlt')
    //   .set('Accept', 'application/vnd.twitchtv.v5+json')
    //   customReq = request.clone({
    //     headers
    //   });
    //   return next.handle(customReq).catch(() => {

    //     return next.handle(customReq);
    //   });
    // }
    else if (request.url.indexOf('switchmagic.com:4111/api') !== -1) {
      //const headers = request.headers.set('switchmagic', 'mycreds').set('Accept', 'application/json').set('Content-Type', 'application/json');
      let headers = new HttpHeaders();
      let myrequest = request.clone({
        headers
      });
      return next.handle(myrequest).catch(() => {
        return next.handle(myrequest);
      });
    }
    else if (request.url.indexOf('switchmagic.com:4111') !== -1) {
      const headers = request.headers.set('switchmagic', 'mycreds').set('Accept', 'application/json').set('Content-Type', 'application/json');
      let myrequest = request.clone({
        headers
      });
      //return next.handle(myrequest).catch(() => {
      return next.handle(request);
      //});
    }
    else {
      return next.handle(request);
    }
    // pass on the modified request object

  }

}