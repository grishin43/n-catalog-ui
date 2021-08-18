import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar/snack-bar-config';

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

}
