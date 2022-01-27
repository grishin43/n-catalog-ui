import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth/auth.service';
import {HttpStatusCodeEnum} from '../../models/http-status-code.enum';
import {ToastService} from '../../toast/service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<any> => {
        console.log(error.status);
        switch (error.status) {
          case HttpStatusCodeEnum.UNAUTHORIZED:
            this.authService.logout();
            break;
          case HttpStatusCodeEnum.NO_CONNECTION:
            this.showToastError('errors.connectionLost');
            break;
          case HttpStatusCodeEnum.INTERNAL_SERVER_ERROR:
          case HttpStatusCodeEnum.NOT_IMPLEMENTED:
          case HttpStatusCodeEnum.BAD_GATEWAY:
          case HttpStatusCodeEnum.SERVICE_UNAVAILABLE:
          case HttpStatusCodeEnum.GATEWAY_TIMEOUT:
          case HttpStatusCodeEnum.HTTP_VERSION_NOT_SUPPORTED:
            this.showToastError('errors.serviceUnavailable');
            break;
          default:
            this.showToastError(error.error?.message || error.message);
            break;
        }
        return throwError(error);
      })
    );
  }

  private showToastError(message: string): void {
    this.toastService.showError('errors.errorOccurred', message);
  }

}
