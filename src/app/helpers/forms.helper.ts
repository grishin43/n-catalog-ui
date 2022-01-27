import {FormGroup} from '@angular/forms';

export class FormsHelper {

  public static markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.invalid) {
        control.setErrors(control.errors);
      }
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
