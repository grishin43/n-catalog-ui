import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {ToastErrorDataModel} from '../../models/toast-error-data.model';

@Component({
  selector: 'np-toast-error',
  templateUrl: './toast-error.component.html',
  styleUrls: ['./toast-error.component.scss']
})
export class ToastErrorComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<ToastErrorComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastErrorDataModel
  ) {
  }

}
