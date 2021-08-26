import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'np-toast-loader',
  templateUrl: './toast-loader.component.html',
  styleUrls: ['./toast-loader.component.scss']
})
export class ToastLoaderComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) {
  }

}
