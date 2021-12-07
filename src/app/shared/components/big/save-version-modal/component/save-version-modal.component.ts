import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormsHelper} from '../../../../../helpers/forms.helper';
import {FormFieldEnum} from '../../../../../models/form-field.enum';

@Component({
  selector: 'np-save-version-modal',
  templateUrl: './save-version-modal.component.html',
  styleUrls: ['./save-version-modal.component.scss']
})
export class SaveVersionModalComponent implements OnInit {
  public form: FormGroup;
  public formControlName = FormFieldEnum;

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.saveVersion();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<SaveVersionModalComponent>,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      [FormFieldEnum.NAME]: new FormControl('', [Validators.required, Validators.maxLength(72)]),
      [FormFieldEnum.DESCRIPTION]: new FormControl('', [Validators.maxLength(200)])
    });
  }

  public saveVersion(): void {
    if (this.form.valid) {
      const formDetails = this.form.value;
      this.dialogRef.close(formDetails);
    } else {
      FormsHelper.markFormGroupTouched(this.form);
    }
  }

  public closeModal(): void {
    this.dialogRef.close();
  }
}
