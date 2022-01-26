import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormsHelper} from '../../../../../helpers/forms.helper';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {ProcessVersionModel} from '../../../../../models/domain/process-version.model';
import {CatalogSelectors} from '../../../../../catalog/store/selectors/catalog.selectors';
import {Store} from '@ngxs/store';

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
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      [FormFieldEnum.NAME]: new FormControl('', [Validators.required, Validators.maxLength(72),
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
      [FormFieldEnum.DESCRIPTION]: new FormControl('', [Validators.maxLength(200)])
    });
  }

  public saveVersion(): void {
    if (this.form.valid) {
      const formDetails = this.form.value;
      if (this.versionHasDuplicatedName(this.form.value[FormFieldEnum.NAME])) {
        this.form.controls[FormFieldEnum.NAME].setErrors({nameAlreadyExist: true});
      } else {
        this.dialogRef.close(formDetails);
      }
    } else {
      FormsHelper.markFormGroupTouched(this.form);
    }
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  private versionHasDuplicatedName(name: string): boolean {
    const versions: ProcessVersionModel[] = this.store.selectSnapshot(CatalogSelectors.currentProcessVersions);
    if (versions?.length) {
      return !!versions.find((v: ProcessVersionModel) => v.title?.trim() === name.trim());
    }
    return false;
  }

  public get nameValid(): boolean {
    return !!this.form.value[FormFieldEnum.NAME]?.trim()?.length;
  }

}
