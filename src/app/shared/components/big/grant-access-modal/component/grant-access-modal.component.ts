import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProcessModel} from '../../../../../models/domain/process.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {CatalogEntityPermissionEnum} from '../../../../../catalog/models/catalog-entity-permission.enum';
import {TranslateService} from '@ngx-translate/core';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'np-grant-access-modal',
  templateUrl: './grant-access-modal.component.html',
  styleUrls: ['./grant-access-modal.component.scss'],
  providers: [TitleCasePipe]
})
export class GrantAccessModalComponent implements OnInit {
  public form: FormGroup;
  public formControlName = FormFieldEnum;
  public formLoader: boolean;
  public permissions = [
    CatalogEntityPermissionEnum.READ,
    CatalogEntityPermissionEnum.EDIT
  ];
  public selectedPermission: string = CatalogEntityPermissionEnum.READ;

  constructor(
    private dialogRef: MatDialogRef<GrantAccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcessModel,
    private translate: TranslateService,
    private titleCasePipe: TitleCasePipe
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const key = this.titleCasePipe.transform(this.selectedPermission);
    const defaultPermission = this.translate.instant('common.can' + key);
    this.form = new FormGroup({
      [FormFieldEnum.EMAIL]: new FormControl(undefined, [Validators.required]),
      [FormFieldEnum.PERMISSIONS]: new FormControl(defaultPermission, [Validators.required])
    });
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public formSubmit(): void {
    if (this.form.valid) {
      this.formLoader = true;
      console.log({
        ...this.form.value,
        [FormFieldEnum.PERMISSIONS]: this.selectedPermission
      });
      setTimeout(() => {
        this.formLoader = false;
        this.closeModal();
      });
    }
  }

  public patchPermission(permission: string): void {
    this.selectedPermission = permission;
    const key = this.titleCasePipe.transform(permission);
    permission = this.translate.instant('common.can' + key);
    this.form.get([FormFieldEnum.PERMISSIONS]).patchValue(permission);
  }

}
