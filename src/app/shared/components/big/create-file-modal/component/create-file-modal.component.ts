import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'np-create-file-modal',
  templateUrl: './create-file-modal.component.html',
  styleUrls: ['./create-file-modal.component.scss']
})
export class CreateFileModalComponent implements OnInit {
  public form: FormGroup;
  public formControlName = FormFieldEnum;
  public loader: boolean;

  constructor(
    public dialogRef: MatDialogRef<CreateFileModalComponent>
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      [FormFieldEnum.FILE_NAME]: new FormControl(null, [Validators.required]),
      [FormFieldEnum.FOLDER]: new FormControl(null, [Validators.required]),
      [FormFieldEnum.FILE_TYPE]: new FormControl(null, [Validators.required])
    });
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

}
