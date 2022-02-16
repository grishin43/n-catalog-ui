import {ErrorHandler, Injectable} from '@angular/core';
import {ToastService} from '../../toast/service/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private toastService: ToastService
  ) {
  }

  public handleError(error: any): void {
    if (/ChunkLoadError/.test(error?.message)) {
      if (window.navigator.onLine) {
        this.toastService.showError('errors.errorOccurred', 'errors.serviceUnavailable');
      } else {
        this.toastService.showError('errors.errorOccurred', 'errors.connectionLost');
      }
    }
  }

}
