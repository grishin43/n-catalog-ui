import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormFieldEnum} from '../../../../../../models/form-field.enum';
import {ModalInjectableEntityModel} from '../../../../../../models/modal-injectable-entity.model';
import {CatalogEntityEnum} from '../../../../../models/catalog-entity.enum';
import {ApiService} from '../../../../../services/api/api.service';
import {Observable, Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {ProcessService} from '../../../../../pages/folder/services/process/process.service';
import {FolderFieldKey, FolderModel} from '../../../../../../models/domain/folder.model';
import {CurrentProcessModel} from '../../../../../models/current-process.model';
import {FolderService} from '../../../../../pages/folder/services/folder/folder.service';
import {ToastService} from '../../../../../../toast/service/toast.service';

@Component({
  selector: 'np-rename-entity-modal',
  templateUrl: './rename-entity-modal.component.html',
  styleUrls: ['./rename-entity-modal.component.scss']
})
export class RenameEntityModalComponent implements OnInit {
  public form: FormGroup;
  public formControlName = FormFieldEnum;

  private subscription = new Subscription();

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.formSubmit();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<RenameEntityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInjectableEntityModel,
    private api: ApiService,
    private processService: ProcessService,
    private folderService: FolderService,
    private toast: ToastService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
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
      this.checkParentFolder(entityId, this.data.parent.id, entityName, controlValue);
    }
  }

  private checkParentFolder(entityId: string, parentId: string, oldName: string, newName: string): void {
    const loaderTitle = this.translate.instant('loaders.rename', {name: oldName});
    this.closeModal();
    if (!!this.data?.asyncLoader?.getValue()) {
      this.data.asyncLoader.next(this.data.entity.id);
    } else {
      this.toast.showLoader(loaderTitle);
    }
    this.subscription.add(
      this.api.getFolderByIdWithSubs(parentId)
        .subscribe((res: FolderModel) => {
          const duplicatedNotFound = !this.checkDuplicates(res, newName);
          if (duplicatedNotFound) {
            this.checkParentFolderCb(entityId, oldName, newName);
          } else {
            if (!!this.data?.asyncLoader?.getValue()) {
              this.data.asyncLoader.next(undefined);
            } else {
              this.toast.close();
            }
            this.showNameDuplicateErrorToast(newName);
          }
        })
    );
  }

  private showNameDuplicateErrorToast(newName: string): void {
    let toastErrorMessage: string;
    if (this.data.type === CatalogEntityEnum.FOLDER) {
      toastErrorMessage = this.translate.instant('errors.folderWithNameAlreadyExist', {name: newName});
    }
    if (this.data.type === CatalogEntityEnum.PROCESS) {
      toastErrorMessage = this.translate.instant('errors.processWithNameAlreadyExist', {name: newName});
    }
    this.toast.showError('errors.errorOccurred', toastErrorMessage);
  }

  private checkDuplicates(folder: FolderModel, name: string): boolean {
    if (this.isFolder) {
      return !!folder[FolderFieldKey.FOLDERS]?.items?.find((f: FolderModel) => f.name === name);
    } else if (this.isProcess) {
      return !!folder[FolderFieldKey.PROCESSES]?.items?.find((p: CurrentProcessModel) => p.name === name);
    }
  }

  private checkParentFolderCb(entityId: string, oldName: string, newName: string): void {
    if (this.isFolder) {
      this.renameEntity(
        this.folderService.renameFolder(entityId, newName, oldName),
        this.translate.instant(
          'common.folderSuccessfullyRenamed',
          {folderOldName: oldName, folderNewName: newName}
        ),
        this.translate.instant('errors.failedToRenameFolder', {folderName: oldName}),
        newName,
        'folder-renamed'
      );
    } else if (this.isProcess) {
      this.renameEntity(
        this.processService.renameProcess(this.data.parent.id, entityId, newName),
        this.translate.instant(
          'common.processSuccessfullyRenamed',
          {processOldName: oldName, processNewName: newName}
        ),
        this.translate.instant('errors.failedToRenameProcess', {processName: oldName}),
        newName,
        'process-renamed'
      );
    }
  }

  private renameEntity(
    request: Observable<any>,
    successTitle: string,
    errorTitle: string,
    newName: string,
    panelClass?: string
  ): void {
    this.subscription.add(
      request.subscribe(() => {
        if (!!this.data?.asyncLoader?.getValue()) {
          this.data.asyncLoader.next(undefined);
        } else {
          this.toast.close();
        }
        this.toast.showMessage(successTitle, undefined, panelClass);
        if (typeof this.data.ssCb === 'function') {
          this.data.ssCb(newName);
        }
        this.subscription.unsubscribe();
      }, (err: HttpErrorResponse) => {
        if (!!this.data?.asyncLoader?.getValue()) {
          this.data.asyncLoader.next(undefined);
        }
        this.toast.showError(
          errorTitle,
          err?.message
        );
        this.subscription.unsubscribe();
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
