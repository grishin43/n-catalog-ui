import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar/snack-bar-config';
import {ToastLoaderComponent} from '../components/toast-loader/toast-loader.component';
import {ToastErrorComponent} from '../components/toast-error/toast-error.component';
import {ToastErrorDataModel} from '../models/toast-error-data.model';
import {ToastMessageComponent} from '../components/toast-message/toast-message.component';
import {MatSnackBarRef} from '@angular/material/snack-bar/snack-bar-ref';
import {TextOnlySnackBar} from '@angular/material/snack-bar/simple-snack-bar';

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
    duration?: number,
    action?: string,
    vertical?: MatSnackBarVerticalPosition,
    horizontal?: MatSnackBarHorizontalPosition,
    panelClass?: string,
    translateInterpolateParams?: any
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(this.translateService.instant(i18nKey, translateInterpolateParams), action, {
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

  public showMessage(i18nKeyOrString: string, duration: number = 10000): void {
    this.snackBar.openFromComponent(ToastMessageComponent, {
      data: this.translateService.instant(i18nKeyOrString),
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
