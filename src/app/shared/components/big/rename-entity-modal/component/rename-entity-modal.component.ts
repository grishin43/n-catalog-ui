import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {ModalInjectableDataModel} from '../../../../../models/modal-injectable-data.model';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {ApiService} from '../../../../../catalog/services/api/api.service';
import {Observable, Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../../catalog/services/toast/toast.service';

@Component({
  selector: 'np-rename-entity-modal',
  templateUrl: './rename-entity-modal.component.html',
  styleUrls: ['./rename-entity-modal.component.scss']
})
export class RenameEntityModalComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public formLoader: boolean;
  public formControlName = FormFieldEnum;

  private subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<RenameEntityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInjectableDataModel,
    private api: ApiService,
    private toast: ToastService
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
      const controlValue = this.form.value[FormFieldEnum.ENTITY_NAME];
      if (this.isFolder) {
        this.renameEntity(
          this.api.renameFolder(entityId, controlValue),
          'common.folderRenamesSuccessfully'
        );
      } else if (this.isProcess) {
        this.renameEntity(
          this.api.renameProcess(this.data.parent.id, entityId, controlValue),
          'common.processRenamesSuccessfully'
        );
      }
    }
  }

  private renameEntity(request: Observable<any>, toastSuccessKey: string): void {
    this.formLoader = true;
    this.subscription.add(
      request.subscribe(() => {
        this.formLoader = false;
        this.showToast(toastSuccessKey);
        this.closeModal();
        if (typeof this.data.ssCb === 'function') {
          this.data.ssCb();
        }
      }, (err: HttpErrorResponse) => {
        this.formLoader = false;
        this.showToast(err.message);
      })
    );
  }

  private showToast(i18nKey: string): void {
    this.toast.show(i18nKey, 1500, undefined, 'bottom', 'right');
  }

  public get isProcess(): boolean {
    return this.data.type === CatalogEntityEnum.PROCESS;
  }

  public get isFolder(): boolean {
    return this.data.type === CatalogEntityEnum.FOLDER;
  }

}
