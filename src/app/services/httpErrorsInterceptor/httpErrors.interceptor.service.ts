import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsInterceptorService implements HttpInterceptor{

  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // @ts-ignore
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<any> => {
        if (error.status === 403) {
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
