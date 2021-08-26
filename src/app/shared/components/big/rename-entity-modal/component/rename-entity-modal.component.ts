import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {ModalInjectableDataModel} from '../../../../../models/modal-injectable-data.model';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {ApiService} from '../../../../../catalog/services/api/api.service';
import {Observable, Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../small/toast/service/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'np-rename-entity-modal',
  templateUrl: './rename-entity-modal.component.html',
  styleUrls: ['./rename-entity-modal.component.scss']
})
export class RenameEntityModalComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public formControlName = FormFieldEnum;

  private subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<RenameEntityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInjectableDataModel,
    private api: ApiService,
    private toast: ToastService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initForm(): void {
    this.form = new FormGroup({
      [FormFieldEnum.ENTITY_NAME]: new FormControl(this.data?.entity?.name, [Validators.required])
    });
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public formSubmit(): void {
    if (this.form.valid) {
      const entityId = this.data.entity.id;
      const entityName = this.data.entity.name;
      const controlValue = this.form.value[FormFieldEnum.ENTITY_NAME];
      const loaderTitle = this.translateService.instant('loaders.rename', {name: entityName});
      if (this.isFolder) {
        this.renameEntity(
          this.api.renameFolder(entityId, controlValue),
          loaderTitle,
          this.translateService.instant(
            'common.folderSuccessfullyRenamed',
            {processOldName: entityName, processNewName: controlValue}
          ),
          this.translateService.instant('errors.failedToRenameFolder', {folderName: entityName}),
          controlValue
        );
      } else if (this.isProcess) {
        this.renameEntity(
          this.api.renameProcess(this.data.parent.id, entityId, controlValue),
          loaderTitle,
          this.translateService.instant(
            'common.processSuccessfullyRenamed',
            {processOldName: entityName, processNewName: controlValue}
          ),
          this.translateService.instant('errors.failedToRenameProcess', {processName: entityName}),
          controlValue
        );
      }
    }
  }

  private renameEntity(
    request: Observable<any>,
    loaderTitle: string,
    successTitle: string,
    errorTitle: string,
    newName: string
  ): void {
    this.closeModal();
    this.toast.showLoader(loaderTitle);
    this.subscription.add(
      request.subscribe(() => {
        this.toast.close();
        this.toast.showMessage(successTitle);
        if (typeof this.data.ssCb === 'function') {
          this.data.ssCb(newName);
        }
      }, (err: HttpErrorResponse) => {
        this.toast.showError(
          errorTitle,
          err?.message
        );
      })
    );
  }

  public get isProcess(): boolean {
    return this.data.type === CatalogEntityEnum.PROCESS;
  }

  public get isFolder(): boolean {
    return this.data.type === CatalogEntityEnum.FOLDER;
  }

}
