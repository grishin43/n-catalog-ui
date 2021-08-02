import {Component, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Component({
  selector: 'np-mat-errors',
  template: `
    <mat-error *ngIf="errorToDisplay">
      {{'errors.' + errorToDisplay.key | translate : {value: errorToDisplay.value} }}
    </mat-error>
  `
})
export class MatErrorsComponent {
  @Input() set errors(errors: ValidationErrors) {
    this.errorToDisplay = errors ? {
      key: Object.keys(errors)[0],
      value: errors[Object.keys(errors)[0]]
    } : null;
  }

  public errorToDisplay: {
    key: string;
    value: string;
  };
}
