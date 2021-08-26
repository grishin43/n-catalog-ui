import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar/snack-bar-config';
import {ToastLoaderComponent} from '../components/toast-loader/toast-loader.component';
import {ToastErrorComponent} from '../components/toast-error/toast-error.component';
import {ToastErrorDataModel} from '../models/toast-error-data.model';
import {ToastMessageComponent} from '../components/toast-message/toast-message.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
  }

  public show(
    i18nKey: string,
    duration: number = 1500,
    action?: string,
    vertical?: MatSnackBarVerticalPosition,
    horizontal?: MatSnackBarHorizontalPosition,
    panelClass?: string
  ): void {
    this.snackBar.open(this.translateService.instant(i18nKey), action, {
      duration,
      verticalPosition: vertical,
      horizontalPosition: horizontal,
      panelClass
    });
  }

  public showLoader(i18nKey: string): void {
    this.snackBar.openFromComponent(ToastLoaderComponent, {
      data: this.translateService.instant(i18nKey),
      duration: undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: 'loader'
    });
  }

  public showError(i18nTitleKey: string, error: string, duration: number = 30000): void {
    this.snackBar.openFromComponent(ToastErrorComponent, {
      data: {
        title: this.translateService.instant(i18nTitleKey),
        error
      } as ToastErrorDataModel,
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: 'error'
    });
  }

  public showMessage(i18nKey: string, duration: number = 10000): void {
    this.snackBar.openFromComponent(ToastMessageComponent, {
      data: this.translateService.instant(i18nKey),
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: 'message'
    });
  }

  public close(): void {
    this.snackBar.dismiss();
  }

}
