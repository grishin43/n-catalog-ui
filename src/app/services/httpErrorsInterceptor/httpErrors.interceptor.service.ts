import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth/auth.service';
import {HttpStatusCodeEnum} from '../../models/http-status-code.enum';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<any> => {
        if (error.status === HttpStatusCodeEnum.UNAUTHORIZED) {
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
